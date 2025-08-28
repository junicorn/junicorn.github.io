(function() {
  const translations = {
    en: {
      // Navigation
      'nav.employers': 'Employers',
      'nav.home': 'Home',
      'nav.jobs': 'Jobs',
      'nav.employer': 'Employer',
      
      // Hero
      'hero.title': 'Discover junior tech opportunities',
      'hero.subtitle': 'Curated jobs for aspiring developers, designers, and data talents.',
      'hero.browseJobs': 'Browse Jobs',
      'hero.postJob': 'Post a Job',
      
      // Featured Jobs
      'featured.title': 'Featured Jobs',
      'featured.subtitle': 'Latest opportunities for junior developers',
      'featured.viewAll': 'View All Jobs',
      
      // Jobs Page
      'jobs.title': 'Available Jobs',
      'jobs.subtitle': 'Find your next opportunity in tech',
      'jobs.listTitle': 'Job Listings',
      'jobs.loading': 'Loading jobs...',
      'jobs.selectJob': 'Select a job to view details',
      'jobs.selectJobDesc': 'Choose a job from the list to see full details and apply',
      
      // Filters
      'filters.search': 'Search by title, company, tags',
      'filters.allLocations': 'All Locations',
      'filters.remote': 'Remote',
      'filters.telAviv': 'Tel Aviv',
      'filters.jerusalem': 'Jerusalem',
      'filters.haifa': 'Haifa',
      'filters.allTypes': 'All Types',
      'filters.fullTime': 'Full Time',
      'filters.partTime': 'Part Time',
      'filters.contract': 'Contract',
      'filters.internship': 'Internship',
      'filters.anyLocation': 'Any Location',
      'filters.onsite': 'On-site',
      'filters.hybrid': 'Hybrid',
      'filters.anyType': 'Any Type',
      'filters.clear': 'Clear',
      
      // Placeholders
      'placeholders.searchJobs': 'Search jobs...',
      'placeholders.location': 'City, Country or Remote',
      'placeholders.description': 'What you\'ll do, must-have skills, nice-to-haves',
      'placeholders.applyUrl': 'https://...',
      'placeholders.tags': 'JavaScript, Vue, QA, Data',
      
      // Job Details
      'job.apply': 'Apply for this position',
      'job.sendEmail': 'Send Email',
      'job.applyViaLink': 'Apply via Link',
      'job.notAvailable': 'Job Not Available',
      'job.notAvailableDesc': 'This job is not currently accepting applications. Please check other jobs or try again later.',
      'job.posted': 'Posted',
      'job.expand': 'Show more',
      'job.viewDetails': 'View Details',
      'job.email': 'Email',
      
      // Meta
      'meta.listings': 'listings',
      'meta.updated': 'updated daily',
      'loading': 'Loading jobs…',
      'empty': 'No jobs found. Try adjusting filters.',
      
      // Footer
      'footer.postFree': 'Post a job for free',
      'footer.browse': 'Browse jobs',
      
      // Employers
      'employers.title': 'Employer Portal',
      'employers.subtitle': 'Sign in and publish junior-friendly jobs. Free and fast.',
      'employers.warningTitle': 'Important',
      'employers.warningBody': 'All submissions are automatically scanned by AI for spam, malicious links, or harmful content. Offenders may face removal and legal action. The service is free for the public good—please post responsibly.',
      
      // Auth
      'auth.signInTab': 'Sign In',
      'auth.registerTab': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.signIn': 'Sign In',
      'auth.createAccount': 'Create Account',
      'auth.signInWithGoogle': 'Sign in with Google',
      'auth.signUpWithGoogle': 'Sign up with Google',
      'auth.signOut': 'Sign out',
      'auth.forgotPassword': 'Forgot password?',
      'auth.forgotPasswordTitle': 'Reset Password',
      'auth.sendResetLink': 'Send Reset Link',
      'employers.signedIn': 'Signed in',
      
      // Job Form
      'jobForm.title': 'Post a Job',
      'jobForm.subtitle': 'Fields marked * are required. Jobs are reviewed.',
      'jobForm.position': 'Position Title *',
      'jobForm.company': 'Company *',
      'jobForm.location': 'Location *',
      'jobForm.workMode': 'Work Mode *',
      'jobForm.type': 'Employment Type *',
      'jobForm.description': 'Short Description *',
      'jobForm.applyEmail': 'Apply Email *',
      'jobForm.applyUrl': 'Apply URL',
      'jobForm.tags': 'Tags (comma separated)',
      'jobForm.submit': 'Submit for review',
      
      // Job Management
      'jobManagement.title': 'Manage Your Jobs',
      'jobManagement.subtitle': 'View and manage all your posted jobs',
      'jobManagement.postNew': 'Post New Job',
      'jobManagement.manageJobs': 'Manage Jobs',
      'jobManagement.loading': 'Loading your jobs...',
      'jobManagement.noJobs': 'You haven\'t posted any jobs yet.',
      'jobManagement.status.pending': 'Pending Review',
      'jobManagement.status.approved': 'Active',
      'jobManagement.status.unavailable': 'Not Available',
      'jobManagement.status.rejected': 'Rejected',
      'jobManagement.actions.edit': 'Edit',
      'jobManagement.actions.markUnavailable': 'Mark as Unavailable',
      'jobManagement.actions.markAvailable': 'Mark as Available',
      'jobManagement.actions.delete': 'Delete',
      'jobManagement.unavailableNotice': 'This position is currently not accepting applications. It will be automatically updated within 24 hours.',
      'jobManagement.stats.views': 'Views',
      'jobManagement.stats.applications': 'Applications',
      'jobManagement.stats.posted': 'Posted',
      'jobManagement.confirmUnavailable': 'Mark Job as Unavailable',
      'jobManagement.confirmUnavailableMessage': 'This will hide the job from public listings and remove contact information. The job will be automatically updated within 24 hours.',
      'jobManagement.confirmDelete': 'Delete Job',
      'jobManagement.confirmDeleteMessage': 'This action cannot be undone. The job will be permanently removed.',
      'jobManagement.updateSuccess': 'Request sent successfully! The job will be updated within 24 hours.',
      'jobManagement.deleteSuccess': 'Job deleted successfully!',
      
      // Common
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.delete': 'Delete',
      
      // Page Titles
      'pageTitle.home': 'Junicorn Jobs – Junior Tech Jobs',
      'pageTitle.jobs': 'Job Listings - Junicorn Jobs',
      'pageTitle.employer': 'Employers – Junicorn Jobs',
      
      // Select Options
      'select.onsite': 'On-site',
      'select.hybrid': 'Hybrid',
      'select.remote': 'Remote',
      'select.internship': 'Internship',
      'select.fullTime': 'Full-time',
      'select.partTime': 'Part-time',
      'select.contract': 'Contract',
      'select.freelance': 'Freelance',
      
      // Static Text
      'static.jobsCount': 'jobs',
      'static.closeModal': 'Close modal',
      'static.toggleLanguage': 'Toggle language',
      'static.toggleTheme': 'Toggle theme',
      'static.copyright': '©'
    },
    he: {
      // Navigation
      'nav.employers': 'למעסיקים',
      'nav.home': 'דף הבית',
      'nav.jobs': 'משרות',
      'nav.employer': 'מעסיק',
      
      // Hero
      'hero.title': 'גילוי הזדמנויות הייטק לג׳וניורים',
      'hero.subtitle': 'משרות נבחרות למפתחים, מעצבים ואנשי דאטה בתחילת הדרך.',
      'hero.browseJobs': 'עיין במשרות',
      'hero.postJob': 'פרסם משרה',
      
      // Featured Jobs
      'featured.title': 'משרות מומלצות',
      'featured.subtitle': 'הזדמנויות אחרונות למפתחים ג׳וניורים',
      'featured.viewAll': 'צפה בכל המשרות',
      
      // Jobs Page
      'jobs.title': 'משרות זמינות',
      'jobs.subtitle': 'מצא את ההזדמנות הבאה שלך בהייטק',
      'jobs.listTitle': 'רשימת משרות',
      'jobs.loading': 'טוען משרות...',
      'jobs.selectJob': 'בחר משרה לצפייה בפרטים',
      'jobs.selectJobDesc': 'בחר משרה מהרשימה כדי לראות פרטים מלאים ולהגיש מועמדות',
      
      // Filters
      'filters.search': 'חיפוש לפי תפקיד, חברה, תגיות',
      'filters.allLocations': 'כל המיקומים',
      'filters.remote': 'עבודה מרחוק',
      'filters.telAviv': 'תל אביב',
      'filters.jerusalem': 'ירושלים',
      'filters.haifa': 'חיפה',
      'filters.allTypes': 'כל הסוגים',
      'filters.fullTime': 'משרה מלאה',
      'filters.partTime': 'משרה חלקית',
      'filters.contract': 'חוזה',
      'filters.internship': 'התמחות',
      'filters.anyLocation': 'כל מיקום',
      'filters.onsite': 'במשרד',
      'filters.hybrid': 'היברידי',
      'filters.anyType': 'כל סוג',
      'filters.clear': 'נקה',
      
      // Placeholders
      'placeholders.searchJobs': 'חיפוש משרות...',
      'placeholders.location': 'עיר, מדינה או מרחוק',
      'placeholders.description': 'מה תעשה, חובה לדעת, נעזרות נעימות',
      'placeholders.applyUrl': 'https://...',
      'placeholders.tags': 'ג\'אווהסקריפט, וויואו, קיי איי, נושאי נתונים',
      
      // Job Details
      'job.apply': 'הגש מועמדות למשרה זו',
      'job.sendEmail': 'שלח מייל',
      'job.applyViaLink': 'הגש בקישור',
      'job.notAvailable': 'משרה לא זמינה',
      'job.notAvailableDesc': 'משרה זו אינה מקבלת פניות כרגע. אנא בדוק משרות אחרות או נסה שוב מאוחר יותר.',
      'job.posted': 'פורסם לפני',
      'job.expand': 'הצג עוד',
      'job.viewDetails': 'הצג פרטים',
      'job.email': 'מייל',
      
      // Meta
      'meta.listings': 'משרות',
      'meta.updated': 'מתעדכן יומי',
      'loading': 'טוען משרות...',
      'empty': 'לא נמצאו משרות. נסה לשנות את הפילטרים.',
      
      // Footer
      'footer.postFree': 'פרסם משרה בחינם',
      'footer.browse': 'עיין במשרות',
      
      // Employers
      'employers.title': 'פורטל מעסיקים',
      'employers.subtitle': 'התחבר ופרסם משרות ידידותיות לג׳וניורים. חינמי ומהיר.',
      'employers.warningTitle': 'חשוב',
      'employers.warningBody': 'כל ההגשות נסרקות אוטומטית על ידי AI לספאם, קישורים זדוניים או תוכן מזיק. מפירים עלולים לעמוד בפני הסרה ופעולה משפטית. השירות חינמי לטובת הציבור - אנא פרסם באחריות.',
      
      // Auth
      'auth.signInTab': 'התחברות',
      'auth.registerTab': 'הרשמה',
      'auth.email': 'אימייל',
      'auth.password': 'סיסמה',
      'auth.confirmPassword': 'אימות סיסמה',
      'auth.signIn': 'התחבר',
      'auth.createAccount': 'צור חשבון',
      'auth.signInWithGoogle': 'התחבר עם Google',
      'auth.signUpWithGoogle': 'הירשם עם Google',
      'auth.signOut': 'התנתק',
      'auth.forgotPassword': 'שכחת סיסמה?',
      'auth.forgotPasswordTitle': 'איפוס סיסמה',
      'auth.sendResetLink': 'שלח קישור איפוס',
      'employers.signedIn': 'מחובר',
      
      // Job Form
      'jobForm.title': 'פרסם משרה',
      'jobForm.subtitle': 'שדות המסומנים ב-* הם חובה. משרות נבדקות.',
      'jobForm.position': 'כותרת התפקיד *',
      'jobForm.company': 'חברה *',
      'jobForm.location': 'מיקום *',
      'jobForm.workMode': 'מצב עבודה *',
      'jobForm.type': 'סוג העסקה *',
      'jobForm.description': 'תיאור קצר *',
      'jobForm.applyEmail': 'מייל להגשה *',
      'jobForm.applyUrl': 'קישור להגשה',
      'jobForm.tags': 'תגיות (מופרדות בפסיקים)',
      'jobForm.submit': 'שלח לבדיקה',
      
      // Job Management
      'jobManagement.title': 'נהל את המשרות שלך',
      'jobManagement.subtitle': 'צפה ונהל את כל המשרות שפרסמת',
      'jobManagement.postNew': 'פרסם משרה חדשה',
      'jobManagement.manageJobs': 'נהל משרות',
      'jobManagement.loading': 'טוען את המשרות שלך...',
      'jobManagement.noJobs': 'עדיין לא פרסמת משרות.',
      'jobManagement.status.pending': 'ממתין לבדיקה',
      'jobManagement.status.approved': 'פעיל',
      'jobManagement.status.unavailable': 'לא זמין',
      'jobManagement.status.rejected': 'נדחה',
      'jobManagement.actions.edit': 'ערוך',
      'jobManagement.actions.markUnavailable': 'סמן כלא זמין',
      'jobManagement.actions.markAvailable': 'סמן כזמין',
      'jobManagement.actions.delete': 'מחק',
      'jobManagement.unavailableNotice': 'תפקיד זה אינו מקבל פניות כרגע. הוא יתעדכן אוטומטית תוך 24 שעות.',
      'jobManagement.stats.views': 'צפיות',
      'jobManagement.stats.applications': 'הגשות',
      'jobManagement.stats.posted': 'פורסם',
      'jobManagement.confirmUnavailable': 'סמן משרה כלא זמינה',
      'jobManagement.confirmUnavailableMessage': 'זה יסתיר את המשרה מרשימות ציבוריות ויסיר מידע ליצירת קשר. המשרה תתעדכן אוטומטית תוך 24 שעות.',
      'jobManagement.confirmDelete': 'מחק משרה',
      'jobManagement.confirmDeleteMessage': 'פעולה זו אינה ניתנת לביטול. המשרה תוסר לצמיתות.',
      'jobManagement.updateSuccess': 'הבקשה נשלחה בהצלחה! המשרה תתעדכן תוך 24 שעות.',
      'jobManagement.deleteSuccess': 'המשרה נמחקה בהצלחה!',
      
      // Common
      'common.cancel': 'ביטול',
      'common.confirm': 'אישור',
      'common.delete': 'מחק',
      
      // Page Titles
      'pageTitle.home': 'Junicorn Jobs – Junior Tech Jobs',
      'pageTitle.jobs': 'Job Listings - Junicorn Jobs',
      'pageTitle.employer': 'Employers – Junicorn Jobs',
      
      // Select Options
      'select.onsite': 'במשרד',
      'select.hybrid': 'היברידי',
      'select.remote': 'מרחוק',
      'select.internship': 'התמחות',
      'select.fullTime': 'משרה מלאה',
      'select.partTime': 'משרה חלקית',
      'select.contract': 'חוזה',
      'select.freelance': 'פרטי',
      
      // Static Text
      'static.jobsCount': 'משרות',
      'static.closeModal': 'סגור תיבת דו-דעת',
      'static.toggleLanguage': 'החלף שפה',
      'static.toggleTheme': 'החלף נושא',
      'static.copyright': '©'
    }
  };

  const storageKey = 'ji18n.lang';
  function getSavedLang() {
    const fromStorage = localStorage.getItem(storageKey);
    if (fromStorage === 'he' || fromStorage === 'en') return fromStorage;
    const fromBrowser = (navigator.language || 'en').toLowerCase().startsWith('he') ? 'he' : 'en';
    return fromBrowser;
  }

  function apply(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
    // Apply translations to elements with data-i18n
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-i18n');
      if (dict[key]) {
        if (node.tagName === 'TITLE') {
          document.title = dict[key];
        } else {
          node.textContent = dict[key];
        }
      }
    });
    
    // Apply translations to placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (dict[key]) node.setAttribute('placeholder', dict[key]);
    });
    
    // Apply translations to aria-labels
    const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');
    ariaLabels.forEach(node => {
      const key = node.getAttribute('data-i18n-aria-label');
      if (dict[key]) node.setAttribute('aria-label', dict[key]);
    });
    
    // Update language toggle button
    const toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = lang.toUpperCase();
  }

  const api = {
    init() {
      const lang = getSavedLang();
      apply(lang);
    },
    toggle() {
      const current = document.documentElement.lang === 'he' ? 'he' : 'en';
      const next = current === 'he' ? 'en' : 'he';
      localStorage.setItem(storageKey, next);
      apply(next);
    },
    getLang() {
      return document.documentElement.lang === 'he' ? 'he' : 'en';
    },
    apply() {
      const lang = this.getLang();
      apply(lang);
    }
  };

  window.JI18N = api;
})();

