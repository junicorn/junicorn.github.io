(function() {
  const translations = {
    en: {
      'nav.employers': 'Employers',
      'nav.home': 'Home',
      'hero.title': 'Discover junior tech opportunities',
      'hero.subtitle': 'Curated jobs for aspiring developers, designers, and data talents.',
      'filters.search': 'Search by title, company, tags',
      'filters.anyLocation': 'Any Location',
      'filters.remote': 'Remote',
      'filters.onsite': 'On-site',
      'filters.hybrid': 'Hybrid',
      'filters.anyType': 'Any Type',
      'filters.clear': 'Clear',
      'meta.listings': 'listings',
      'meta.updated': 'updated daily',
      'loading': 'Loading jobs…',
      'empty': 'No jobs found. Try adjusting filters.',
      'footer.postFree': 'Post a job for free',
      'footer.browse': 'Browse jobs',
      'job.expand': 'Show more',
      'job.viewDetails': 'View Details',
      'job.apply': 'Apply',
      'job.email': 'Email',
      'employers.title': 'Employer Portal',
      'employers.subtitle': 'Sign in and publish junior-friendly jobs. Free and fast.',
      'employers.warningTitle': 'Important',
      'employers.warningBody': 'All submissions are automatically scanned by AI for spam, malicious links, or harmful content. Offenders may face removal and legal action. The service is free for the public good—please post responsibly.',
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
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.delete': 'Delete'
    },
    he: {
      'nav.employers': 'למעסיקים',
      'nav.home': 'דף הבית',
      'hero.title': 'גילוי הזדמנויות הייטק לג׳וניורים',
      'hero.subtitle': 'משרות נבחרות למפתחים, מעצבים ואנשי דאטה בתחילת הדרך.',
      'filters.search': 'חיפוש לפי תפקיד, חברה, תגיות',
      'filters.anyLocation': 'כל מיקום',
      'filters.remote': 'מרחוק',
      'filters.onsite': 'במשרד',
      'filters.hybrid': 'היברידי',
      'filters.anyType': 'כל סוג',
      'filters.clear': 'נקה',
      'meta.listings': 'מודעות',
      'meta.updated': 'מתעדכן מדי יום',
      'loading': 'טוען משרות…',
      'empty': 'לא נמצאו משרות. נסו לשנות סינון.',
      'footer.postFree': 'פרסם משרה בחינם',
      'footer.browse': 'עיון במשרות',
      'job.expand': 'הצג עוד',
      'job.viewDetails': 'צפה בפרטים',
      'job.apply': 'הגש מועמדות',
      'job.email': 'שלח אימייל',
      'employers.title': 'איזור מעסיקים',
      'employers.subtitle': 'התחברו ופרסמו משרות ידידותיות לג׳וניורים. מהיר וחינמי.',
      'employers.warningTitle': 'חשוב',
      'employers.warningBody': 'כל ההגשות נסרקות אוטומטית ע״י AI לאיתור ספאם, קישורים זדוניים או תוכן מזיק. מפרים עשויים להימחק ואף לעמוד לדין. השירות חינמי למען הציבור—אנא פרסמו באחריות.',
      'auth.signInTab': 'התחברות',
      'auth.registerTab': 'הרשמה',
      'auth.email': 'אימייל',
      'auth.password': 'סיסמה',
      'auth.confirmPassword': 'אימות סיסמה',
      'auth.signIn': 'התחברות',
      'auth.createAccount': 'צור חשבון',
      'auth.signInWithGoogle': 'התחברות עם Google',
      'auth.signUpWithGoogle': 'הרשמה עם Google',
      'auth.signOut': 'התנתקות',
      'auth.forgotPassword': 'שכחתי סיסמה?',
      'auth.forgotPasswordTitle': 'איפוס סיסמה',
      'auth.sendResetLink': 'שלח קישור איפוס',
      'employers.signedIn': 'מחובר',
      'jobForm.title': 'פרסום משרה',
      'jobForm.subtitle': 'שדות עם * הינם חובה. המשרות נבדקות.',
      'jobForm.position': 'שם התפקיד *',
      'jobForm.company': 'שם החברה *',
      'jobForm.location': 'מיקום *',
      'jobForm.workMode': 'אופן עבודה *',
      'jobForm.type': 'סוג משרה *',
      'jobForm.description': 'תיאור קצר *',
      'jobForm.applyEmail': 'אימייל לשליחת קו״ח *',
      'jobForm.applyUrl': 'קישור להגשה',
      'jobForm.tags': 'תגיות (מופרדות בפסיקים)',
      'jobForm.submit': 'שליחה לבדיקה',
      'jobManagement.title': 'ניהול המשרות שלך',
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
      'jobManagement.unavailableNotice': 'תפקיד זה אינו מקבל מועמדויות כרגע. יתעדכן אוטומטית תוך 24 שעות.',
      'jobManagement.stats.views': 'צפיות',
      'jobManagement.stats.applications': 'הגשות',
      'jobManagement.stats.posted': 'פורסם',
      'jobManagement.confirmUnavailable': 'סמן משרה כלא זמינה',
      'jobManagement.confirmUnavailableMessage': 'זה יסתיר את המשרה מהרשימה הציבורית ויסיר את פרטי הקשר. המשרה תתעדכן אוטומטית תוך 24 שעות.',
      'jobManagement.confirmDelete': 'מחק משרה',
      'jobManagement.confirmDeleteMessage': 'פעולה זו אינה ניתנת לביטול. המשרה תוסר לצמיתות.',
      'jobManagement.updateSuccess': 'הבקשה נשלחה בהצלחה! המשרה תתעדכן תוך 24 שעות.',
      'jobManagement.deleteSuccess': 'המשרה נמחקה בהצלחה!',
      'common.cancel': 'ביטול',
      'common.confirm': 'אישור',
      'common.delete': 'מחק'
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
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-i18n');
      if (dict[key]) node.textContent = dict[key];
    });
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (dict[key]) node.setAttribute('placeholder', dict[key]);
    });
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

