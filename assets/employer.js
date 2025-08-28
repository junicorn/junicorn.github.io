(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.JI18N && window.JI18N.init();
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => window.JI18N.toggle());
    langToggle.textContent = window.JI18N.getLang().toUpperCase();
  }

  // Tabs
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-panel') === name));
    });
  });

  // Firebase
  // Firebase Web v9 modular SDK via script import
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

  const authedEl = document.getElementById('authed');
  const anonEl = document.getElementById('anon');
  const userEmailEl = document.getElementById('userEmail');

  function handleAuthState(user) {
    if (user) {
      authedEl.classList.remove('hidden');
      anonEl.classList.add('hidden');
      userEmailEl.textContent = user.email || '';
    } else {
      authedEl.classList.add('hidden');
      anonEl.classList.remove('hidden');
      userEmailEl.textContent = '';
    }
  }

  function bindAuthUI() {
    const emailForm = document.getElementById('emailAuth');
    const registerBtn = document.getElementById('register');
    const googleBtn = document.getElementById('googleSignIn');
    const signOutBtn = document.getElementById('signOut');

    function sanitizeEmail(raw) {
      if (!raw) return '';
      // Remove common invisible/RTL marks and spaces
      return raw
        .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    }

    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      const state = document.getElementById('authState');
      const email = sanitizeEmail(emailInput.value);
      const password = passInput.value;
      state.textContent = '';
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { state.textContent = 'Please enter a valid email'; state.style.color = '#ef4444'; emailInput.focus(); return; }
      if (!password || password.length < 6) { state.textContent = 'Password must be at least 6 characters'; state.style.color = '#ef4444'; passInput.focus(); return; }
      try {
        state.textContent = 'Signing in…'; state.style.color = '#94a3b8';
        await auth.signInWithEmailAndPassword(email, password);
        state.textContent = '';
      } catch (err) {
        const map = {
          'auth/invalid-email': 'Invalid email format',
          'auth/user-not-found': 'No account found. Try Register.',
          'auth/wrong-password': 'Incorrect password',
          'auth/too-many-requests': 'Too many attempts. Try again later.'
        };
        state.textContent = map[err.code] || err.message || 'Failed to sign in';
        state.style.color = '#ef4444';
      }
    });
    registerBtn.addEventListener('click', async () => {
      const state = document.getElementById('authState');
      const email = sanitizeEmail(document.getElementById('email').value);
      const password = document.getElementById('password').value;
      state.textContent = '';
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!emailOk) { state.textContent = 'Please enter a valid email'; state.style.color = '#ef4444'; return; }
      if (!password || password.length < 6) { state.textContent = 'Password must be at least 6 characters'; state.style.color = '#ef4444'; return; }
      try {
        state.textContent = 'Creating account…'; state.style.color = '#94a3b8';
        await auth.createUserWithEmailAndPassword(email, password);
        state.textContent = 'Account created'; state.style.color = '#22c55e';
      } catch (err) {
        const map = {
          'auth/email-already-in-use': 'Email already in use',
          'auth/invalid-email': 'Invalid email format',
          'auth/weak-password': 'Password too weak'
        };
        state.textContent = map[err.code] || err.message || 'Failed to register';
        state.style.color = '#ef4444';
      }
    });
    googleBtn.addEventListener('click', async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
      } catch (err) {
        alert(err.message);
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
    // naive anti-spam: disallow <script> and some bad keywords
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

