## Junicorn Jobs – Static Jobs Board (GitHub Pages + Firebase + GitHub Actions)

This repository hosts a static jobs site for junior developers. Employers submit jobs via Firebase Auth + Firestore. A daily GitHub Action exports all approved jobs into `data/jobs.json`, which the public site reads to display listings without hitting Firebase.

### Stack
- Static hosting: GitHub Pages
- Auth + DB: Firebase (Auth + Firestore)
- Export: GitHub Actions + Node (firebase-admin)
- Front-end: HTML, CSS, JS only (no frameworks)

### Local Structure
- `index.html` – Public landing page with filters and listings
- `employer.html` – Employer portal (login + job submission)
- `assets/styles.css` – Global styles (responsive, light/dark-ready)
- `assets/app.js` – Public site logic (load `data/jobs.json`)
- `assets/i18n.js` – Simple i18n (EN/HE) + RTL handling
- `data/jobs.json` – Exported jobs (Action writes this file)
- `scripts/export-jobs.js` – Action script to export jobs from Firestore
- `.github/workflows/export-jobs.yml` – Daily workflow to run exporter

### Firebase Setup
1. Create a Firebase project and enable:
   - Authentication: Email/Password and Google
   - Firestore Database (rules to allow only authenticated employer writes)
2. In `assets/app.js`, set your public web config (already scaffolded).
3. Create a Service Account with Firestore access and add its JSON as a GitHub Secret named `FIREBASE_SERVICE_ACCOUNT`.

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

### Firestore Data Model (collection: `jobs`)
```
{
  title: string,
  company: string,
  location: string,
  employmentType: 'Full-time'|'Part-time'|'Contract'|'Internship'|'Freelance',
  workMode: 'On-site'|'Hybrid'|'Remote',
  description: string (markdown allowed),
  applyEmail: string,
  applyUrl?: string,
  tags?: string[],
  createdAt: Timestamp,
  status: 'pending'|'approved'|'rejected'
}
```

Only `approved` jobs are exported to `data/jobs.json`.

### Development
- Open `index.html` locally via a simple HTTP server to avoid CORS issues.
- No build step required.

# junicorn.github.io
