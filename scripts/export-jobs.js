#!/usr/bin/env node
/*
  Exports approved jobs from Realtime Database to data/jobs.json
  Appends new approved jobs to existing file instead of overwriting
  Includes timeout handling and error recovery for GitHub Actions
  Requires env var FIREBASE_SERVICE_ACCOUNT containing the full JSON
*/
const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const TIMEOUT_MS = 15000; // 15 seconds
const MAX_JOBS_TO_PROCESS = 50;
const FORCE_EXIT_TIMEOUT = 20000; // 20 seconds
const DATABASE_TIMEOUT = 8000; // 8 seconds
const FILE_WRITE_TIMEOUT = 5000; // 5 seconds

// Environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!serviceAccount || !projectId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

let forceExitTimer;

async function main() {
  console.log('🚀 Starting job export...');
  
  try {
    // Step 1: Check environment variables
    console.log('📋 Step 1: Checking environment variables...');
    if (!serviceAccount || !projectId) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID');
    }

    // Step 2: Parse service account
    console.log('📋 Step 2: Parsing service account...');
    let serviceAccountKey;
    try {
      serviceAccountKey = JSON.parse(serviceAccount);
    } catch (e) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
    }

    // Step 3: Load firebase-admin
    console.log('📋 Step 3: Loading firebase-admin...');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
      });
    }

    // Step 4: Initialize Firebase
    console.log('📋 Step 4: Initializing Firebase...');
    const db = admin.database();

    // Step 5: Get database reference
    console.log('📋 Step 5: Getting database reference...');
    const jobsRef = db.ref('jobs');

    // Step 6: Fetch approved jobs from database
    console.log('📋 Step 6: Fetching approved jobs from database...');
    const snapshot = await Promise.race([
      jobsRef.orderByChild('status').equalTo('approved').once('value'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), DATABASE_TIMEOUT)
      )
    ]);

    const jobs = [];
    snapshot.forEach(child => {
      const job = child.val();
      if (job && job.status === 'approved') {
        jobs.push({
          id: child.key,
          ...job
        });
      }
    });

    console.log(`📊 Found ${jobs.length} approved jobs in database`);

    // Step 7: Load existing jobs from file
    console.log('📋 Step 7: Loading existing jobs from file...');
    const jobsFilePath = path.join(process.cwd(), 'data', 'jobs.json');
    let existingJobs = [];
    
    try {
      const existingData = await Promise.race([
        fs.readFile(jobsFilePath, 'utf8'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('File read timeout')), FILE_WRITE_TIMEOUT)
        )
      ]);
      existingJobs = JSON.parse(existingData);
      console.log(`📊 Loaded ${existingJobs.length} existing jobs from file`);
    } catch (error) {
      console.log('📊 No existing jobs file found, starting fresh');
      existingJobs = [];
    }

    // Step 8: Process new jobs
    console.log('📋 Step 8: Processing new jobs...');
    const existingJobIds = new Set(existingJobs.map(job => job.id));
    const newJobs = jobs.filter(job => !existingJobIds.has(job.id));
    
    console.log(`📊 Found ${newJobs.length} new jobs to add`);

    // Step 9: Combine and sort jobs
    console.log('📋 Step 9: Combining and sorting jobs...');
    const allJobs = [...existingJobs, ...newJobs];
    
    // Sort by creation date (newest first)
    allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Step 10: Write jobs to file
    console.log('📋 Step 10: Writing jobs to file...');
    const jobsData = JSON.stringify(allJobs, null, 2);
    
    await Promise.race([
      fs.writeFile(jobsFilePath, jobsData, 'utf8'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('File write timeout')), FILE_WRITE_TIMEOUT)
      )
    ]);

    console.log(`✅ Success: Added ${newJobs.length} new jobs to existing ${existingJobs.length} jobs`);
    console.log(`📊 Total: ${allJobs.length} jobs written to ${jobsFilePath}`);
    console.log('✅ Export completed successfully');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  } finally {
    console.log('🏁 Script finished, exiting...');
    if (forceExitTimer) {
      clearTimeout(forceExitTimer);
    }
    process.exit(0);
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  if (forceExitTimer) {
    clearTimeout(forceExitTimer);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (forceExitTimer) {
    clearTimeout(forceExitTimer);
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('⚠️ Received SIGTERM, cleaning up...');
  if (forceExitTimer) {
    clearTimeout(forceExitTimer);
  }
  process.exit(0);
});

// Force exit after timeout
forceExitTimer = setTimeout(() => {
  console.error('⏰ Force exit timeout reached');
  process.exit(1);
}, FORCE_EXIT_TIMEOUT);

// Start the export
main();

