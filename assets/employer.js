(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.JI18N && window.JI18N.init();
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => window.JI18N.toggle());
    langToggle.textContent = window.JI18N.getLang().toUpperCase();
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
    measurementId: "G-MSWKTZF7J0"
  };

  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
  const scriptAuth = document.createElement('script');
  scriptAuth.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js';
  const scriptFirestore = document.createElement('script');
  scriptFirestore.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js';

  scriptFirestore.onload = initFirebase;
  document.head.appendChild(script);
  document.head.appendChild(scriptAuth);
  document.head.appendChild(scriptFirestore);

  let auth, db;
  function initFirebase() {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    auth.onAuthStateChanged(handleAuthState);
    bindAuthUI();
    bindJobForm();
  }

  const authSection = document.getElementById('authSection');
  const jobSection = document.getElementById('jobSection');
  const userEmailEl = document.getElementById('userEmail');

  function handleAuthState(user) {
    if (user) {
      authSection.classList.add('hidden');
      jobSection.classList.remove('hidden');
      userEmailEl.textContent = user.email || '';
    } else {
      authSection.classList.remove('hidden');
      jobSection.classList.add('hidden');
      userEmailEl.textContent = '';
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

  function bindAuthUI() {
    const signInForm = document.getElementById('emailSignInForm');
    const registerForm = document.getElementById('emailRegisterForm');
    const forgotForm = document.getElementById('forgotForm');
    const googleSignInBtn = document.getElementById('googleSignIn');
    const googleRegisterBtn = document.getElementById('googleRegister');
    const signOutBtn = document.getElementById('signOut');

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
        showMessage(state, 'Signing in…', 'info');
        await auth.signInWithEmailAndPassword(email, password);
        showMessage(state, '', '');
      } catch (err) {
        const map = {
          'auth/invalid-email': 'Invalid email format',
          'auth/user-not-found': 'No account found. Try Register.',
          'auth/wrong-password': 'Incorrect password',
          'auth/too-many-requests': 'Too many attempts. Try again later.'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to sign in', 'error');
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
        showMessage(state, 'Creating account…', 'info');
        await auth.createUserWithEmailAndPassword(email, password);
        showMessage(state, 'Account created successfully!', 'success');
      } catch (err) {
        const map = {
          'auth/email-already-in-use': 'Email already in use',
          'auth/invalid-email': 'Invalid email format',
          'auth/weak-password': 'Password too weak'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to register', 'error');
      }
    });

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const state = document.getElementById('forgotState');
      const email = sanitizeEmail(document.getElementById('forgotEmail').value);
      
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { showMessage(state, 'Please enter a valid email', 'error'); return; }
      
      try {
        showMessage(state, 'Sending reset link…', 'info');
        await auth.sendPasswordResetEmail(email);
        showMessage(state, 'Reset link sent! Check your email.', 'success');
        setTimeout(hideModal, 2000);
      } catch (err) {
        const map = {
          'auth/user-not-found': 'No account found with this email',
          'auth/invalid-email': 'Invalid email format'
        };
        showMessage(state, map[err.code] || err.message || 'Failed to send reset link', 'error');
      }
    });

    googleSignInBtn.addEventListener('click', async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        const el = document.getElementById('authStateSignIn');
        showMessage(el, err.message, 'error');
      }
    });

    googleRegisterBtn.addEventListener('click', async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        const el = document.getElementById('authStateRegister');
        showMessage(el, err.message, 'error');
      }
    });

    signOutBtn.addEventListener('click', async () => {
      await auth.signOut();
    });
  }

  function validateJob(payload) {
    const required = ['title','company','location','workMode','employmentType','description','applyEmail'];
    for (const key of required) {
      if (!payload[key] || String(payload[key]).trim() === '') return `${key} is required`;
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth.currentUser) { alert('Please sign in first'); return; }
      const payload = {
        title: document.getElementById('title').value.trim(),
        company: document.getElementById('company').value.trim(),
        location: document.getElementById('location').value.trim(),
        workMode: document.getElementById('workMode').value,
        employmentType: document.getElementById('employmentType').value,
        description: document.getElementById('description').value.trim(),
        applyEmail: document.getElementById('applyEmail').value.trim(),
        applyUrl: document.getElementById('applyUrl').value.trim(),
        tags: document.getElementById('tags').value.split(',').map(s => s.trim()).filter(Boolean),
        createdAt: new Date(),
        status: 'pending',
        ownerUid: auth.currentUser.uid
      };
      const err = validateJob(payload);
      if (err) { state.textContent = err; state.style.color = '#ef4444'; return; }
      state.textContent = 'Submitting…'; state.style.color = '#94a3b8';
      try {
        await db.collection('jobs').add(payload);
        state.textContent = 'Submitted for review. Thank you!'; state.style.color = '#22c55e';
        form.reset();
      } catch (e2) {
        console.error(e2);
        state.textContent = e2.message || 'Failed to submit'; state.style.color = '#ef4444';
      }
    });
  }
})();

