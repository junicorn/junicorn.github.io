#!/usr/bin/env node
/*
  Exports approved jobs from Firestore to data/jobs.json
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
      projectId
    });
  }

  const db = admin.firestore();
  const snapshot = await db.collection('jobs').where('status', '==', 'approved').orderBy('createdAt', 'desc').get();
  const items = snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || '',
      company: data.company || '',
      location: data.location || '',
      employmentType: data.employmentType || '',
      workMode: data.workMode || '',
      description: data.description || '',
      applyEmail: data.applyEmail || '',
      applyUrl: data.applyUrl || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: (data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString())
    };
  });

  const outPath = path.join(__dirname, '..', 'data', 'jobs.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} jobs to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

