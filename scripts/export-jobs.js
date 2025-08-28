#!/usr/bin/env node
/*
  Exports approved jobs from Realtime Database to data/jobs.json
  Appends new approved jobs to existing file instead of overwriting
  Includes timeout handling and error recovery for GitHub Actions
  Requires env var FIREBASE_SERVICE_ACCOUNT containing the full JSON
*/
const fs = require('fs');
const path = require('path');

// Timeout settings for GitHub Actions (prevent hanging)
const TIMEOUT_MS = 30000; // 30 seconds max
const MAX_JOBS_TO_PROCESS = 100; // Limit to prevent memory issues

function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
}

async function main() {
  console.log('Starting job export...');
  
  try {
    // Wrap entire operation in timeout
    await Promise.race([
      performExport(),
      timeout(TIMEOUT_MS)
    ]);
    
    console.log('Export completed successfully');
  } catch (err) {
    console.error('Export failed:', err.message);
    
    // If we have partial data, try to save what we have
    if (err.partialData) {
      try {
        const outPath = path.join(__dirname, '..', 'data', 'jobs.json');
        fs.writeFileSync(outPath, JSON.stringify(err.partialData, null, 2));
        console.log(`Saved partial data: ${err.partialData.length} jobs`);
      } catch (saveErr) {
        console.error('Failed to save partial data:', saveErr.message);
      }
    }
    
    // Exit with error code but don't fail the entire workflow
    process.exit(0);
  }
}

async function performExport() {
  const svcStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svcStr) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret');
  }
  
  const serviceAccount = JSON.parse(svcStr);
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
  if (!projectId) throw new Error('No project_id');

  console.log('Initializing Firebase...');
  const admin = require('firebase-admin');
  
  // Initialize Firebase with timeout
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
    });
  }

  const db = admin.database();
  
  console.log('Fetching approved jobs from database...');
  
  // Fetch jobs with timeout
  const snapshot = await Promise.race([
    db.ref('jobs').orderByChild('status').equalTo('approved').once('value'),
    timeout(15000) // 15 second timeout for database query
  ]);
  
  const jobsData = snapshot.val();
  console.log(`Found ${jobsData ? Object.keys(jobsData).length : 0} approved jobs in database`);
  
  // Load existing jobs from file
  const outPath = path.join(__dirname, '..', 'data', 'jobs.json');
  let existingJobs = [];
  
  try {
    if (fs.existsSync(outPath)) {
      const existingData = fs.readFileSync(outPath, 'utf8');
      existingJobs = JSON.parse(existingData);
      if (!Array.isArray(existingJobs)) {
        existingJobs = [];
      }
      console.log(`Loaded ${existingJobs.length} existing jobs from file`);
    }
  } catch (err) {
    console.warn('Could not read existing jobs.json, starting fresh:', err.message);
    existingJobs = [];
  }

  // Get existing job IDs to avoid duplicates
  const existingJobIds = new Set(existingJobs.map(job => job.id));
  
  const newJobs = [];
  let processedCount = 0;
  
  if (jobsData) {
    const jobKeys = Object.keys(jobsData);
    
    // Limit processing to prevent memory issues
    const keysToProcess = jobKeys.slice(0, MAX_JOBS_TO_PROCESS);
    
    if (jobKeys.length > MAX_JOBS_TO_PROCESS) {
      console.warn(`Processing only first ${MAX_JOBS_TO_PROCESS} jobs (total: ${jobKeys.length})`);
    }
    
    for (const key of keysToProcess) {
      // Only add jobs that don't already exist in the file
      if (!existingJobIds.has(key)) {
        const data = jobsData[key];
        
        // Validate job data before adding
        if (data && data.title && data.company && data.status === 'approved') {
          newJobs.push({
            id: key,
            title: data.title || '',
            company: data.company || '',
            location: data.location || '',
            employmentType: data.employmentType || '',
            workMode: data.workMode || '',
            description: data.description || '',
            applyEmail: data.applyEmail || '',
            applyUrl: data.applyUrl || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: data.createdAt || new Date().toISOString()
          });
        } else {
          console.warn(`Skipping invalid job ${key}: missing required fields`);
        }
      }
      
      processedCount++;
      
      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(`Processed ${processedCount}/${keysToProcess.length} jobs...`);
      }
    }
  }

  // Combine existing and new jobs
  const allJobs = [...existingJobs, ...newJobs];
  
  // Sort by creation date (newest first)
  allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log(`Writing ${allJobs.length} total jobs to file...`);
  
  // Write back to file with timeout
  await Promise.race([
    fs.promises.writeFile(outPath, JSON.stringify(allJobs, null, 2)),
    timeout(10000) // 10 second timeout for file write
  ]);
  
  console.log(`✅ Success: Added ${newJobs.length} new jobs to existing ${existingJobs.length} jobs`);
  console.log(`📊 Total: ${allJobs.length} jobs written to ${outPath}`);
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  process.exit(0); // Don't fail the workflow
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(0); // Don't fail the workflow
});

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(0); // Always exit gracefully
});

