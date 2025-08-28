#!/usr/bin/env node
/*
  Exports approved jobs from Realtime Database to data/jobs.json
  Appends new approved jobs to existing file instead of overwriting
  Requires env var FIREBASE_SERVICE_ACCOUNT containing the full JSON
*/
const fs = require('fs');
const path = require('path');

async function main() {
  const svcStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svcStr) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret');
  }
  const serviceAccount = JSON.parse(svcStr);

  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
  if (!projectId) throw new Error('No project_id');

  const admin = require('firebase-admin');
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
    });
  }

  const db = admin.database();
  const snapshot = await db.ref('jobs').orderByChild('status').equalTo('approved').once('value');
  const jobsData = snapshot.val();
  
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
    }
  } catch (err) {
    console.warn('Could not read existing jobs.json, starting fresh:', err.message);
    existingJobs = [];
  }

  // Get existing job IDs to avoid duplicates
  const existingJobIds = new Set(existingJobs.map(job => job.id));
  
  const newJobs = [];
  if (jobsData) {
    Object.keys(jobsData).forEach(key => {
      // Only add jobs that don't already exist in the file
      if (!existingJobIds.has(key)) {
        const data = jobsData[key];
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
      }
    });
  }

  // Combine existing and new jobs
  const allJobs = [...existingJobs, ...newJobs];
  
  // Sort by creation date (newest first)
  allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Write back to file
  fs.writeFileSync(outPath, JSON.stringify(allJobs, null, 2));
  
  console.log(`Added ${newJobs.length} new jobs to existing ${existingJobs.length} jobs`);
  console.log(`Total: ${allJobs.length} jobs written to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

