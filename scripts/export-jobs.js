#!/usr/bin/env node
/*
  Exports approved jobs from Realtime Database to data/jobs.json
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
  
  const items = [];
  if (jobsData) {
    Object.keys(jobsData).forEach(key => {
      const data = jobsData[key];
      items.push({
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
    });
  }

  // Sort by creation date (newest first)
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const outPath = path.join(__dirname, '..', 'data', 'jobs.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} jobs to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

