## Junicorn Jobs – Static Jobs Board (GitHub Pages + Firebase + GitHub Actions)

This repository hosts a static jobs site for junior developers. Employers submit jobs via Firebase Auth + Realtime Database. A daily GitHub Action exports all approved jobs into `data/jobs.json`, which the public site reads to display listings without hitting Firebase.

### Stack
- Static hosting: GitHub Pages
- Auth + DB: Firebase (Auth + Realtime Database)
- Export: GitHub Actions + Node (firebase-admin)
- Front-end: HTML, CSS, JS only (no frameworks)

### Local Structure
- `index.html` – Public landing page with filters and listings
- `employer.html` – Employer portal (login + job submission)
- `assets/styles.css` – Global styles (responsive, light/dark-ready)
- `assets/app.js` – Public site logic (load `data/jobs.json`)
- `assets/i18n.js` – Simple i18n (EN/HE) + RTL handling
- `assets/employer.js` – Employer portal logic (Firebase Auth + Realtime DB)
- `data/jobs.json` – Exported jobs (Action writes this file)
- `scripts/export-jobs.js` – Action script to export jobs from Realtime Database
- `.github/workflows/export-jobs.yml` – Daily workflow to run exporter

### Firebase Setup
1. Create a Firebase project and enable:
   - Authentication: Email/Password and Google
   - Realtime Database (rules to allow only authenticated employer writes)
2. In `assets/employer.js`, set your public web config (already scaffolded).
3. Create a Service Account with Realtime Database access and add its JSON as a GitHub Secret named `FIREBASE_SERVICE_ACCOUNT`.

### GitHub Pages
- Create an organization (e.g., `junicorn`) and enable GitHub Pages for this repo.
- Set Pages source to `main` branch, root.

### GitHub Action Secrets
- `FIREBASE_SERVICE_ACCOUNT` – The full service account JSON (stringified)
- Optional: `FIREBASE_PROJECT_ID` – Overrides project from the service account JSON

### Realtime Database Rules
If you are not using Realtime Database, lock it entirely. Import `database.rules.json` with:

```
firebase deploy --only database
```

### Realtime Database Data Model (path: `/jobs/{jobId}`)
```json
{
  "title": "string",
  "company": "string", 
  "location": "string",
  "employmentType": "Full-time|Part-time|Contract|Internship|Freelance",
  "workMode": "On-site|Hybrid|Remote",
  "description": "string (markdown allowed)",
  "applyEmail": "string",
  "applyUrl": "string (optional)",
  "tags": ["string"],
  "createdAt": "ISO string",
  "status": "pending|approved|rejected",
  "ownerUid": "string",
  "ownerEmail": "string"
}
```

Only `approved` jobs are exported to `data/jobs.json`.

### Development
- Open `index.html` locally via a simple HTTP server to avoid CORS issues.
- No build step required.

### Domain Authorization
To fix "unauthorized-domain" errors:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your domain (e.g., `junicorn.github.io` for GitHub Pages)
3. For local development, add `localhost`
