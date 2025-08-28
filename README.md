# Junicorn Jobs - Junior Tech Job Board

A modern, bilingual job board for junior tech positions. Built with HTML, CSS, JavaScript, and Firebase, hosted on GitHub Pages.

## 🌟 Features

### For Job Seekers
- **Bilingual Support**: English and Hebrew with RTL support
- **Advanced Search**: Filter by location, employment type, and keywords
- **Modern UI**: LinkedIn-style job cards with modal view
- **Light/Dark Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Jobs updated daily via GitHub Actions

### For Employers
- **Free Job Posting**: No cost to post junior positions
- **Easy Management**: View and manage all posted jobs
- **Status Control**: Mark jobs as unavailable to stop applications
- **Professional Portal**: Modern interface with tabs and status indicators
- **AI Protection**: Automatic spam and malicious content detection

## 🏗️ Architecture

### Frontend
- **Static Site**: HTML, CSS, JavaScript only
- **Hosting**: GitHub Pages
- **Design**: Modern, responsive, professional UI
- **Internationalization**: Full RTL support for Hebrew

### Backend
- **Firebase Authentication**: Email/password and Google Sign-in
- **Firebase Realtime Database**: Job storage and management
- **GitHub Actions**: Daily job export to static JSON
- **Security**: Comprehensive Firebase security rules

### Data Flow
1. Employers post jobs via Firebase
2. Jobs are stored in Realtime Database with status tracking
3. GitHub Action exports approved jobs daily to `data/jobs.json`
4. Public site reads from static JSON file (no direct Firebase access)

## 📁 File Structure

```
/
├── index.html              # Public job board
├── employer.html           # Employer portal
├── assets/
│   ├── styles.css         # Global styles with themes
│   ├── app.js            # Public site logic
│   ├── employer.js       # Employer portal logic
│   ├── i18n.js          # Internationalization
│   ├── logo.svg         # Brand assets
│   ├── hero.svg
│   └── favicon.svg
├── data/
│   └── jobs.json        # Static job data (auto-generated)
├── scripts/
│   └── export-jobs.js   # GitHub Action script
├── .github/workflows/
│   └── export-jobs.yml  # Daily export workflow
└── database.rules.json  # Firebase security rules
```

## 🚀 Setup

### 1. Firebase Configuration

Create a Firebase project and enable:
- **Authentication**: Email/password and Google providers
- **Realtime Database**: For job storage
- **Authorized Domains**: Add `yourusername.github.io` and `localhost`

### 2. Firebase Security Rules

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "jobs": {
      ".indexOn": ["status", "ownerUid"],
      ".read": "auth != null",
      "$jobId": {
        ".read": "auth != null && data.exists() && data.child('ownerUid').val() === auth.uid",
        ".write": "auth != null && (
          // Create new job: must be pending status and owner must match
          (!data.exists() && 
           newData.exists() && 
           newData.child('ownerUid').val() === auth.uid && 
           newData.child('status').val() === 'pending' &&
           newData.child('title').isString() &&
           newData.child('company').isString() &&
           newData.child('location').isString() &&
           newData.child('description').isString() &&
           newData.child('applyEmail').isString() &&
           newData.child('createdAt').isString() &&
           newData.child('employmentType').isString() &&
           newData.child('workMode').isString() &&
           newData.child('title').val().length > 0 &&
           newData.child('company').val().length > 0 &&
           newData.child('location').val().length > 0 &&
           newData.child('description').val().length > 0 &&
           newData.child('applyEmail').val().length > 0
          ) ||
          // Update existing job: must be owner and job exists
          (data.exists() && 
           data.child('ownerUid').val() === auth.uid &&
           newData.exists() &&
           newData.child('ownerUid').val() === auth.uid
          ) ||
          // Delete job: must be owner
          (data.exists() && 
           data.child('ownerUid').val() === auth.uid &&
           !newData.exists()
          )
        )",
        ".validate": "newData.hasChildren(['ownerUid', 'title', 'company', 'location', 'description', 'applyEmail', 'createdAt', 'status', 'employmentType', 'workMode'])"
      }
    }
  }
}
```

**Deploy the rules:**
```bash
firebase deploy --only database
```

**Security Features:**
- ✅ **Authentication Required**: Only logged-in users can access jobs
- ✅ **Owner-Only Access**: Users can only read/write their own jobs
- ✅ **Data Validation**: All required fields must be present and non-empty
- ✅ **Status Updates**: Users can update job status (available/unavailable)
- ✅ **Type Validation**: All fields must be strings
- ✅ **No Public Access**: Database is completely locked by default
- ✅ **Indexed Queries**: Efficient queries by status and ownerUid
- ✅ **Complete Job Updates**: All fields preserved during status changes

**Important:** Make sure to deploy these rules to enable job management functionality.

### 3. GitHub Secrets

Add these secrets to your repository:
- `FIREBASE_SERVICE_ACCOUNT`: Full JSON service account key
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `PAT_TOKEN`: Personal Access Token (optional, for write permissions)

### 4. Repository Settings

Enable GitHub Pages:
- Source: Deploy from branch
- Branch: `main`
- Folder: `/ (root)`

Enable Actions permissions:
- Settings → Actions → General
- Workflow permissions: "Read and write permissions"

## 📊 Job Status System

### Status Types
- **`pending`**: New job awaiting review
- **`approved`**: Job is live and accepting applications
- **`unavailable`**: Job temporarily not accepting applications
- **`rejected`**: Job rejected by moderators

### Employer Actions
- **Mark as Unavailable**: Hides job from public listings
- **Mark as Available**: Restores job to public listings
- **Delete**: Permanently removes job

### Automatic Updates
- Jobs marked unavailable are automatically updated within 24 hours
- GitHub Action only exports `approved` jobs to public listings
- Status changes are reflected in real-time in employer portal

## 🌐 Internationalization

### Supported Languages
- **English**: Default language
- **Hebrew**: Full RTL support with proper text direction

### Translation Keys
All UI text is translatable via `assets/i18n.js`:
- Navigation and headers
- Form labels and buttons
- Status messages and notifications
- Job management interface

## 🎨 Theming

### Light/Dark Mode
- Automatic theme detection
- Manual toggle via header button
- Persistent theme preference
- Smooth transitions between themes

### Design System
- CSS custom properties for consistent theming
- Gradient backgrounds and modern shadows
- Responsive breakpoints for all devices
- Professional color palette with purple/cyan accents

## 🔧 Development

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Testing
1. **Public Site**: `http://localhost:8000`
2. **Employer Portal**: `http://localhost:8000/employer.html`
3. **Job Management**: Sign in and use "Manage Jobs" tab

### Key Features to Test
- Job posting and management
- Status updates (available/unavailable)
- Bilingual switching
- Theme toggling
- Modal job views
- Responsive design

## 📈 Analytics & Monitoring

### Job Statistics
- View counts (placeholder for future implementation)
- Application tracking (placeholder)
- Posting dates and status history

### Error Handling
- Comprehensive error messages
- Graceful fallbacks for network issues
- User-friendly validation messages
- Loading states and progress indicators

## 🔒 Security Features

### Content Protection
- AI-powered spam detection
- Malicious link prevention
- Input sanitization and validation
- Rate limiting on job submissions

### Access Control
- Firebase Authentication required for job posting
- Owner-only job management
- Secure database rules
- No direct Firebase access from public site

## 🚀 Deployment

### GitHub Pages
- Automatic deployment from main branch
- Custom domain support
- HTTPS enabled by default
- CDN distribution for fast loading

### GitHub Actions
- Daily job export at 3:00 UTC
- Automatic status updates
- Error handling and retries
- Timeout protection (3 minutes max)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the Firebase console for authentication issues
2. Verify GitHub Actions are running
3. Check browser console for JavaScript errors
4. Ensure all environment variables are set correctly

---

**Built with ❤️ for the junior developer community**
