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
const TIMEOUT_MS = 15000; // 15 seconds max (reduced from 30)
const MAX_JOBS_TO_PROCESS = 50; // Reduced limit

function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
}

// Force exit after max time
const FORCE_EXIT_TIMEOUT = setTimeout(() => {
  console.error('🛑 FORCE EXIT: Script running too long, exiting...');
  process.exit(0);
}, 20000); // 20 seconds max

async function main() {
  console.log('🚀 Starting job export...');
  
  try {
    // Wrap entire operation in timeout
    await Promise.race([
      performExport(),
      timeout(TIMEOUT_MS)
    ]);
    
    console.log('✅ Export completed successfully');
  } catch (err) {
    console.error('❌ Export failed:', err.message);
    
    // If we have partial data, try to save what we have
    if (err.partialData) {
      try {
        const outPath = path.join(__dirname, '..', 'data', 'jobs.json');
        fs.writeFileSync(outPath, JSON.stringify(err.partialData, null, 2));
        console.log(`💾 Saved partial data: ${err.partialData.length} jobs`);
      } catch (saveErr) {
        console.error('❌ Failed to save partial data:', saveErr.message);
      }
    }
  } finally {
    clearTimeout(FORCE_EXIT_TIMEOUT);
    console.log('🏁 Script finished, exiting...');
    process.exit(0);
  }
}

async function performExport() {
  console.log('📋 Step 1: Checking environment variables...');
  
  const svcStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svcStr) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret');
  }
  
  console.log('📋 Step 2: Parsing service account...');
  const serviceAccount = JSON.parse(svcStr);
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
  if (!projectId) throw new Error('No project_id');

  console.log('📋 Step 3: Loading firebase-admin...');
  const admin = require('firebase-admin');
  
  console.log('📋 Step 4: Initializing Firebase...');
  // Initialize Firebase with timeout
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
    });
  }

  console.log('📋 Step 5: Getting database reference...');
  const db = admin.database();
  
  console.log('📋 Step 6: Fetching approved jobs from database...');
  
  // Fetch jobs with aggressive timeout
  const snapshot = await Promise.race([
    db.ref('jobs').orderByChild('status').equalTo('approved').once('value'),
    timeout(8000) // 8 second timeout for database query (reduced)
  ]);
  
  const jobsData = snapshot.val();
  console.log(`📊 Found ${jobsData ? Object.keys(jobsData).length : 0} approved jobs in database`);
  
  console.log('📋 Step 7: Loading existing jobs from file...');
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
      console.log(`📊 Loaded ${existingJobs.length} existing jobs from file`);
    }
  } catch (err) {
    console.warn('⚠️ Could not read existing jobs.json, starting fresh:', err.message);
    existingJobs = [];
  }

  console.log('📋 Step 8: Processing new jobs...');
  // Get existing job IDs to avoid duplicates
  const existingJobIds = new Set(existingJobs.map(job => job.id));
  
  const newJobs = [];
  let processedCount = 0;
  
  if (jobsData) {
    const jobKeys = Object.keys(jobsData);
    
    // Limit processing to prevent memory issues
    const keysToProcess = jobKeys.slice(0, MAX_JOBS_TO_PROCESS);
    
    if (jobKeys.length > MAX_JOBS_TO_PROCESS) {
      console.warn(`⚠️ Processing only first ${MAX_JOBS_TO_PROCESS} jobs (total: ${jobKeys.length})`);
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
          console.warn(`⚠️ Skipping invalid job ${key}: missing required fields`);
        }
      }
      
      processedCount++;
      
      // Progress indicator
      if (processedCount % 5 === 0) {
        console.log(`📈 Processed ${processedCount}/${keysToProcess.length} jobs...`);
      }
    }
  }

  console.log('📋 Step 9: Combining and sorting jobs...');
  // Combine existing and new jobs
  const allJobs = [...existingJobs, ...newJobs];
  
  // Sort by creation date (newest first)
  allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log(`📋 Step 10: Writing ${allJobs.length} total jobs to file...`);
  
  // Write back to file with timeout
  await Promise.race([
    fs.promises.writeFile(outPath, JSON.stringify(allJobs, null, 2)),
    timeout(5000) // 5 second timeout for file write (reduced)
  ]);
  
  console.log(`✅ Success: Added ${newJobs.length} new jobs to existing ${existingJobs.length} jobs`);
  console.log(`📊 Total: ${allJobs.length} jobs written to ${outPath}`);
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught exception:', err.message);
  clearTimeout(FORCE_EXIT_TIMEOUT);
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled rejection at:', promise, 'reason:', reason);
  clearTimeout(FORCE_EXIT_TIMEOUT);
  process.exit(0);
});

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, exiting gracefully...');
  clearTimeout(FORCE_EXIT_TIMEOUT);
  process.exit(0);
});

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  clearTimeout(FORCE_EXIT_TIMEOUT);
  process.exit(0);
});

