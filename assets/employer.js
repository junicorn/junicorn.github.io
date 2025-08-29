(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle__icon');
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }
  
  function updateThemeIcon(theme) {
    if (!themeIcon) return; // בדיקה אם האלמנט קיים
    if (theme === 'light') {
      themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    } else {
      themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }
  
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  }
  
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Theme will be initialized when DOM is ready

  if (window.JI18N) {
    window.JI18N.init();
  }
  
  // Language toggle
  const languageButtons = document.querySelectorAll('.language-toggle__btn');
  if (languageButtons.length > 0 && window.JI18N) {
    languageButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        window.JI18N.setLang(lang);
        
        // Update active state
        document.querySelectorAll('.language-toggle__btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Set initial active language
    const currentLang = window.JI18N.getLang();
    const activeBtn = document.querySelector(`[data-lang="${currentLang}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // Auth tabs
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      authTabs.forEach(t => t.classList.toggle('is-active', t === tab));
      authPanels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-panel') === name));
    });
  });

  // Management tabs
  const managementTabs = document.querySelectorAll('.management-tab');
  const managementPanels = document.querySelectorAll('.management-panel');
  managementTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      managementTabs.forEach(t => t.classList.toggle('is-active', t === tab));
      managementPanels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-panel') === name));
      
      if (name === 'manage') {
        loadEmployerJobs();
      }
    });
  });

  // Modal handling
  const forgotModal = document.getElementById('forgotModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotPasswordBtn = document.getElementById('forgotPassword');

  function showModal() {
    forgotModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    forgotModal.classList.add('hidden');
    modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  forgotPasswordBtn.addEventListener('click', showModal);
  closeForgotModal.addEventListener('click', hideModal);
  modalBackdrop.addEventListener('click', hideModal);

  // Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAJiCEIR8vsPtm5wE4duinpyKKpYV584fw",
    authDomain: "junicornjobs.firebaseapp.com",
    projectId: "junicornjobs",
    storageBucket: "junicornjobs.firebasestorage.app",
    messagingSenderId: "379742849424",
    appId: "1:379742849424:web:1c1b35d393a5b880714b15",
    measurementId: "G-MSWKTZF7J0",
    databaseURL: "https://junicornjobs-default-rtdb.firebaseio.com"
  };

  // Initialize Firebase
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
  } else {
    console.error('Firebase not available');
  }
  
  let auth, database;
  function initFirebase() {
    if (typeof firebase === 'undefined') {
      console.error('Firebase not available');
      return;
    }
    
    auth = firebase.auth();
    database = firebase.database();
    auth.onAuthStateChanged(handleAuthState);
    bindAuthUI();
    bindJobForm();
    bindJobFormManagement();
  }

  // Initialize Firebase when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        initTheme();
        initFirebase();
      }, 100);
    });
  } else {
    setTimeout(() => {
      initTheme();
      initFirebase();
    }, 100);
  }

  const authSection = document.getElementById('authSection');
  const jobSection = document.getElementById('jobSection');
  const jobManagementSection = document.getElementById('jobManagementSection');
  const userEmailEl = document.getElementById('userEmail');
  const userEmailManagementEl = document.getElementById('userEmailManagement');

  function handleAuthState(user) {
    if (user) {
      authSection.classList.add('hidden');
      jobSection.classList.add('hidden');
      jobManagementSection.classList.remove('hidden');
      userEmailEl.textContent = user.email || '';
      userEmailManagementEl.textContent = user.email || '';
    } else {
      authSection.classList.remove('hidden');
      jobSection.classList.add('hidden');
      jobManagementSection.classList.add('hidden');
      userEmailEl.textContent = '';
      userEmailManagementEl.textContent = '';
    }
  }

  function sanitizeEmail(raw) {
    if (!raw) return '';
    return raw
      .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  function showMessage(element, message, type = 'info') {
    element.textContent = message;
    element.className = `form-message ${type}`;
  }

  function setLoading(button, loading) {
    if (loading) {
      button.disabled = true;
      button.innerHTML = '<span class="loader__spinner"></span> Loading...';
    } else {
      button.disabled = false;
      button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
  }

  function bindAuthUI() {
    const signInForm = document.getElementById('emailSignInForm');
    const registerForm = document.getElementById('emailRegisterForm');
    const forgotForm = document.getElementById('forgotForm');
    const googleSignInBtn = document.getElementById('googleSignIn');
    const googleRegisterBtn = document.getElementById('googleRegister');
    const signOutBtn = document.getElementById('signOut');
    const signOutManagementBtn = document.getElementById('signOutManagement');

    // Store original button text
    const signInBtn = signInForm.querySelector('button[type="submit"]');
    const registerBtn = registerForm.querySelector('button[type="submit"]');
    const forgotBtn = forgotForm.querySelector('button[type="submit"]');
    
    signInBtn.setAttribute('data-original-text', signInBtn.textContent);
    registerBtn.setAttribute('data-original-text', registerBtn.textContent);
    forgotBtn.setAttribute('data-original-text', forgotBtn.textContent);

    signInForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('emailSignIn');
      const passInput = document.getElementById('passwordSignIn');
      const state = document.getElementById('authStateSignIn');
      const email = sanitizeEmail(emailInput.value);
      const password = passInput.value;
      
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { showMessage(state, 'Please enter a valid email', 'error'); emailInput.focus(); return; }
      if (!password || password.length < 6) { showMessage(state, 'Password must be at least 6 characters', 'error'); passInput.focus(); return; }
      
      try {
        setLoading(signInBtn, true);
        showMessage(state, 'Signing in…', 'info');
        await auth.signInWithEmailAndPassword(email, password);
        showMessage(state, '', '');
      } catch (err) {
        const map = {
          'auth/invalid-email': 'Invalid email format',
          'auth/user-not-found': 'No account found. Try Register.',
          'auth/wrong-password': 'Incorrect password',
          'auth/too-many-requests': 'Too many attempts. Try again later.',
          'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to sign in', 'error');
      } finally {
        setLoading(signInBtn, false);
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const state = document.getElementById('authStateRegister');
      const email = sanitizeEmail(document.getElementById('emailRegister').value);
      const password = document.getElementById('passwordRegister').value;
      const confirmPassword = document.getElementById('passwordConfirm').value;
      
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { showMessage(state, 'Please enter a valid email', 'error'); return; }
      if (!password || password.length < 6) { showMessage(state, 'Password must be at least 6 characters', 'error'); return; }
      if (password !== confirmPassword) { showMessage(state, 'Passwords do not match', 'error'); return; }
      
      try {
        setLoading(registerBtn, true);
        showMessage(state, 'Creating account…', 'info');
        await auth.createUserWithEmailAndPassword(email, password);
        showMessage(state, 'Account created successfully!', 'success');
      } catch (err) {
        const map = {
          'auth/email-already-in-use': 'Email already in use',
          'auth/invalid-email': 'Invalid email format',
          'auth/weak-password': 'Password too weak',
          'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to register', 'error');
      } finally {
        setLoading(registerBtn, false);
      }
    });

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const state = document.getElementById('forgotState');
      const email = sanitizeEmail(document.getElementById('forgotEmail').value);
      
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { showMessage(state, 'Please enter a valid email', 'error'); return; }
      
      try {
        setLoading(forgotBtn, true);
        showMessage(state, 'Sending reset link…', 'info');
        await auth.sendPasswordResetEmail(email);
        showMessage(state, 'Reset link sent! Check your email.', 'success');
        setTimeout(hideModal, 2000);
      } catch (err) {
        const map = {
          'auth/user-not-found': 'No account found with this email',
          'auth/invalid-email': 'Invalid email format',
          'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to send reset link', 'error');
      } finally {
        setLoading(forgotBtn, false);
      }
    });

    googleSignInBtn.addEventListener('click', async () => {
      try {
        setLoading(googleSignInBtn, true);
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        const el = document.getElementById('authStateSignIn');
        const map = {
          'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
          'auth/popup-closed-by-user': 'Sign-in was cancelled.'
        };
        showMessage(el, map[err.code] || err.message, 'error');
      } finally {
        setLoading(googleSignInBtn, false);
      }
    });

    googleRegisterBtn.addEventListener('click', async () => {
      try {
        setLoading(googleRegisterBtn, true);
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        const el = document.getElementById('authStateRegister');
        const map = {
          'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
          'auth/popup-closed-by-user': 'Sign-in was cancelled.'
        };
        showMessage(el, map[err.code] || err.message, 'error');
      } finally {
        setLoading(googleRegisterBtn, false);
      }
    });

    signOutBtn.addEventListener('click', async () => {
      await auth.signOut();
    });

    signOutManagementBtn.addEventListener('click', async () => {
      await auth.signOut();
    });
  }

  function validateJob(payload) {
    const required = ['title','company','workMode','employmentType','description','applyEmail'];
    for (const key of required) {
      if (!payload[key] || String(payload[key]).trim() === '') return `${key} is required`;
    }
    if ((typeof payload.latitude !== 'number' || isNaN(payload.latitude)) || (typeof payload.longitude !== 'number' || isNaN(payload.longitude))) {
      return 'Please select location on the map';
    }
    const emailOk = /.+@.+\..+/.test(payload.applyEmail);
    if (!emailOk) return 'Invalid apply email';
    if (payload.applyUrl && !/^https?:\/\//i.test(payload.applyUrl)) return 'Invalid apply URL';
    const desc = payload.description.toLowerCase();
    const banned = ['<script', 'javascript:', 'onerror=', 'onload=', 'virus', 'malware'];
    if (banned.some(b => desc.includes(b))) return 'Description contains disallowed content';
    return null;
  }

  function bindJobForm() {
    const form = document.getElementById('jobForm');
    const state = document.getElementById('formState');
    const submitBtn = document.getElementById('submitJob');
    let pickerInstance = null;
    
    // Store original button text
    submitBtn.setAttribute('data-original-text', submitBtn.textContent);

    // Initialize map picker for simple form
    setTimeout(() => {
      if (window.initMapPicker) {
        pickerInstance = window.initMapPicker('locationMap', 'locationSearch', 'latitude', 'longitude', [32.0853, 34.7818]);
      }
    }, 0);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth.currentUser) { 
        showMessage(state, 'Please sign in first', 'error'); 
        return; 
      }
      
      const latitudeVal = document.getElementById('latitude').value;
      const longitudeVal = document.getElementById('longitude').value;
      let payload = {
        title: document.getElementById('title').value.trim(),
        company: document.getElementById('company').value.trim(),
        location: document.getElementById('location').value.trim(),
        latitude: latitudeVal ? parseFloat(latitudeVal) : null,
        longitude: longitudeVal ? parseFloat(longitudeVal) : null,
        workMode: document.getElementById('workMode').value,
        employmentType: document.getElementById('employmentType').value,
        description: document.getElementById('description').value.trim(),
        applyEmail: document.getElementById('applyEmail').value.trim(),
        applyUrl: document.getElementById('applyUrl').value.trim(),
        tags: document.getElementById('tags').value.split(',').map(s => s.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
        status: 'pending',
        ownerUid: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email
      };

      if ((!payload.location || !payload.location.trim()) && payload.latitude != null && payload.longitude != null) {
        payload.location = `${payload.latitude.toFixed(5)}, ${payload.longitude.toFixed(5)}`;
      }
      
      const err = validateJob(payload);
      if (err) { 
        showMessage(state, err, 'error'); 
        return; 
      }
      
      try {
        setLoading(submitBtn, true);
        showMessage(state, 'Submitting job…', 'info');
        
        // Save to Realtime Database
        const jobRef = database.ref('jobs').push();
        await jobRef.set(payload);
        
        showMessage(state, 'Job submitted successfully! It will be reviewed shortly.', 'success');
        form.reset();
      } catch (e2) {
        console.error('Job submission error:', e2);
        showMessage(state, e2.message || 'Failed to submit job. Please try again.', 'error');
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  function bindJobFormManagement() {
    const form = document.getElementById('jobFormManagement');
    const state = document.getElementById('formStateManagement');
    const submitBtn = document.getElementById('submitJobManagement');
    let pickerInstance = null;
    
    // Store original button text
    submitBtn.setAttribute('data-original-text', submitBtn.textContent);

    // Initialize map picker for management form
    setTimeout(() => {
      if (window.initMapPicker) {
        pickerInstance = window.initMapPicker('locationMapManagement', 'locationSearchManagement', 'latitudeManagement', 'longitudeManagement', [32.0853, 34.7818]);
      }
    }, 0);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth.currentUser) { 
        showMessage(state, 'Please sign in first', 'error'); 
        return; 
      }
      
      const latitudeVal = document.getElementById('latitudeManagement').value;
      const longitudeVal = document.getElementById('longitudeManagement').value;
      let payload = {
        title: document.getElementById('titleManagement').value.trim(),
        company: document.getElementById('companyManagement').value.trim(),
        location: document.getElementById('locationManagement').value.trim(),
        latitude: latitudeVal ? parseFloat(latitudeVal) : null,
        longitude: longitudeVal ? parseFloat(longitudeVal) : null,
        workMode: document.getElementById('workModeManagement').value,
        employmentType: document.getElementById('employmentTypeManagement').value,
        description: document.getElementById('descriptionManagement').value.trim(),
        applyEmail: document.getElementById('applyEmailManagement').value.trim(),
        applyUrl: document.getElementById('applyUrlManagement').value.trim(),
        tags: document.getElementById('tagsManagement').value.split(',').map(s => s.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
        status: 'pending',
        ownerUid: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email
      };

      if ((!payload.location || !payload.location.trim()) && payload.latitude != null && payload.longitude != null) {
        payload.location = `${payload.latitude.toFixed(5)}, ${payload.longitude.toFixed(5)}`;
      }
      
      const err = validateJob(payload);
      if (err) { 
        showMessage(state, err, 'error'); 
        return; 
      }
      
      try {
        setLoading(submitBtn, true);
        showMessage(state, 'Submitting job…', 'info');
        
        // Save to Realtime Database
        const jobRef = database.ref('jobs').push();
        await jobRef.set(payload);
        
        showMessage(state, 'Job submitted successfully! It will be reviewed shortly.', 'success');
        form.reset();
      } catch (e2) {
        console.error('Job submission error:', e2);
        showMessage(state, e2.message || 'Failed to submit job. Please try again.', 'error');
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  // Job Management Functions
  async function loadEmployerJobs() {
    if (!auth.currentUser) return;

    const jobsLoader = document.getElementById('jobsLoader');
    const jobsEmpty = document.getElementById('jobsEmpty');
    const employerJobs = document.getElementById('employerJobs');

    jobsLoader.classList.add('is-active');
    jobsEmpty.classList.add('hidden');
    employerJobs.innerHTML = '';

    try {
      console.log('🔍 Loading jobs for user:', auth.currentUser.uid);
      
      const snapshot = await database.ref('jobs')
        .orderByChild('ownerUid')
        .equalTo(auth.currentUser.uid)
        .once('value');

      const jobs = [];
      snapshot.forEach(child => {
        const job = child.val();
        if (job) {
          jobs.push({
            id: child.key,
            ...job
          });
        }
      });

      console.log(`📊 Found ${jobs.length} jobs for user`);

      if (jobs.length === 0) {
        jobsEmpty.classList.remove('hidden');
      } else {
        renderEmployerJobs(jobs);
      }
    } catch (error) {
      console.error('Error loading employer jobs:', error);
      
      // Handle specific permission errors
      if (error.code === 'PERMISSION_DENIED') {
        showMessage(jobsLoader, 
          window.JI18N.getLang() === 'he' ? 
          'שגיאת הרשאות. אנא נסה להתחבר מחדש.' : 
          'Permission error. Please try signing in again.', 
          'error'
        );
      } else {
        showMessage(jobsLoader, 
          window.JI18N.getLang() === 'he' ? 
          'שגיאה בטעינת המשרות. אנא נסה שוב.' : 
          'Failed to load jobs. Please try again.', 
          'error'
        );
      }
    } finally {
      jobsLoader.classList.remove('is-active');
    }
  }

  function renderEmployerJobs(jobs) {
    const employerJobs = document.getElementById('employerJobs');
    const fragment = document.createDocumentFragment();

    jobs.forEach(job => {
      const jobEl = document.createElement('div');
      jobEl.className = 'employer-job';
      jobEl.innerHTML = `
        <div class="employer-job__header">
          <div>
            <h3 class="employer-job__title">${job.title}</h3>
            <div class="employer-job__company">${job.company}</div>
            <div class="employer-job__meta">
              <span class="employer-job__meta-item">
                <svg class="employer-job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ${job.location}
              </span>
              <span class="employer-job__meta-item">
                <svg class="employer-job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                </svg>
                ${job.employmentType}
              </span>
              <span class="employer-job__meta-item">
                <svg class="employer-job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                ${job.workMode}
              </span>
            </div>
          </div>
          <div class="employer-job__status employer-job__status--${job.status}">
            <span data-i18n="jobManagement.status.${job.status}">${job.status}</span>
          </div>
        </div>
        <div class="employer-job__tags">${(job.tags || []).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
        <div class="employer-job__description">${job.description || ''}</div>
        
        <div class="employer-job__stats">
          <span class="employer-job__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span data-i18n="jobManagement.stats.views">Views</span>: 0
          </span>
          <span class="employer-job__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span data-i18n="jobManagement.stats.applications">Applications</span>: 0
          </span>
          <span class="employer-job__stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span data-i18n="jobManagement.stats.posted">Posted</span>: ${new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div class="employer-job__actions">
          <button class="employer-job__btn employer-job__btn--delete" onclick="deleteJob('${job.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            <span data-i18n="jobManagement.actions.delete">Delete</span>
          </button>
        </div>
      `;

      fragment.appendChild(jobEl);
    });

    employerJobs.appendChild(fragment);
    
    // Re-apply i18n
    window.JI18N && window.JI18N.apply();
  }

  // Global functions for job management (availability toggles removed by request)

  window.deleteJob = async function(jobId) {
    if (!confirm(window.JI18N.getLang() === 'he' ? 
      'האם אתה בטוח שברצונך למחוק משרה זו? פעולה זו אינה ניתנת לביטול.' : 
      'Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      // First, verify ownership
      const jobSnapshot = await database.ref(`jobs/${jobId}`).once('value');
      const currentJob = jobSnapshot.val();
      
      if (!currentJob) {
        throw new Error('Job not found');
      }
      
      if (currentJob.ownerUid !== auth.currentUser.uid) {
        throw new Error('Permission denied');
      }

      await database.ref(`jobs/${jobId}`).remove();
      
      alert(window.JI18N.getLang() === 'he' ? 
        'המשרה נמחקה בהצלחה! ייתכן שהשינוי יתעדכן באתר בתוך עד 24 שעות.' : 
        'Job deleted successfully! Changes may take up to 24 hours to reflect site-wide.');
      
      loadEmployerJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };
})();

