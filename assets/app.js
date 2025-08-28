(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }
  
  function updateThemeIcon(theme) {
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
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  initTheme();

  // i18n init
  window.JI18N && window.JI18N.init();
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => window.JI18N.toggle());
    langToggle.textContent = window.JI18N.getLang().toUpperCase();
  }

  const jobsEl = document.getElementById('jobs');
  const loaderEl = document.getElementById('loader');
  const emptyEl = document.getElementById('empty');
  const jobsMetaCountEl = document.getElementById('jobsCount');

  const qEl = document.getElementById('q');
  const locationEl = document.getElementById('location');
  const typeEl = document.getElementById('employmentType');
  const clearFiltersEl = document.getElementById('clearFilters');

  // Job Modal
  const jobModal = document.getElementById('jobModal');
  const closeJobModal = document.getElementById('closeJobModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCompany = document.getElementById('modalCompany');
  const modalMeta = document.getElementById('modalMeta');
  const modalTags = document.getElementById('modalTags');
  const modalDescription = document.getElementById('modalDescription');
  const modalActions = document.getElementById('modalActions');

  function showJobModal(job) {
    // Populate modal content
    modalTitle.textContent = job.title;
    modalCompany.textContent = job.company;
    
    // Meta information
    modalMeta.innerHTML = `
      <span class="job-modal__meta-item">
        <svg class="job-modal__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${job.location}
      </span>
      <span class="job-modal__meta-item">
        <svg class="job-modal__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
        </svg>
        ${job.employmentType}
      </span>
      <span class="job-modal__meta-item">
        <svg class="job-modal__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        ${job.workMode}
      </span>
    `;
    
    // Tags
    modalTags.innerHTML = (job.tags || []).map(tag => `<span class="job-modal__tag">${tag}</span>`).join('');
    
    // Description
    modalDescription.textContent = job.description || '';
    
    // Actions
    const actions = [];
    if (job.applyUrl) {
      actions.push(`<a class="job-modal__btn job-modal__btn--primary" target="_blank" rel="noopener" href="${job.applyUrl}"><span data-i18n="job.apply">Apply</span></a>`);
    }
    if (job.applyEmail) {
      actions.push(`<a class="job-modal__btn job-modal__btn--secondary" href="mailto:${job.applyEmail}"><span data-i18n="job.email">Email</span></a>`);
    }
    modalActions.innerHTML = actions.join('');
    
    // Show modal
    jobModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    
    // Re-apply i18n to new content
    window.JI18N && window.JI18N.apply();
  }

  function hideJobModal() {
    jobModal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // Modal event listeners
  if (closeJobModal) {
    closeJobModal.addEventListener('click', hideJobModal);
  }
  
  if (jobModal) {
    jobModal.addEventListener('click', (e) => {
      if (e.target === jobModal || e.target.classList.contains('job-modal__backdrop')) {
        hideJobModal();
      }
    });
  }

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && jobModal.classList.contains('is-active')) {
      hideJobModal();
    }
  });

  let allJobs = [];

  function normalize(str) {
    return (str || '').toLowerCase();
  }

  function renderJobs(jobs) {
    jobsEl.innerHTML = '';
    if (!jobs || jobs.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');
    const fragment = document.createDocumentFragment();
    jobs.forEach(job => {
      const li = document.createElement('li');
      li.className = 'job';
      li.innerHTML = `
        <div class="job__header">
          <div>
            <h3 class="job__title">${job.title}</h3>
            <div class="job__company">${job.company}</div>
            <div class="job__meta">
              <span class="job__meta-item">
                <svg class="job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ${job.location}
              </span>
              <span class="job__meta-item">
                <svg class="job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                </svg>
                ${job.employmentType}
              </span>
              <span class="job__meta-item">
                <svg class="job__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                ${job.workMode}
              </span>
            </div>
          </div>
        </div>
        <div class="job__tags">${(job.tags || []).slice(0, 6).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
        <div class="job__description">${job.description || ''}</div>
        <div class="job__cta">
          <div>
            <button class="job__expand" onclick="showJobDetails('${job.id || job.title}')">
              <span data-i18n="job.viewDetails">View Details</span>
              <svg class="job__expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div>
            ${job.applyUrl ? `<a class="btn btn--secondary" target="_blank" rel="noopener" href="${job.applyUrl}"><span data-i18n="job.apply">Apply</span></a>` : ''}
            ${job.applyEmail ? `<a class="btn" href="mailto:${job.applyEmail}"><span data-i18n="job.email">Email</span></a>` : ''}
          </div>
        </div>`;
      
      // Add click event to show modal
      li.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons or links
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
          return;
        }
        showJobModal(job);
      });
      
      fragment.appendChild(li);
    });
    jobsEl.appendChild(fragment);
    jobsMetaCountEl.textContent = String(jobs.length);
    
    // Re-apply i18n after rendering
    window.JI18N && window.JI18N.apply();
  }

  // Make showJobDetails globally available
  window.showJobDetails = function(jobId) {
    const job = allJobs.find(j => (j.id || j.title) === jobId);
    if (job) {
      showJobModal(job);
    }
  };

  function applyFilters() {
    const q = normalize(qEl && qEl.value);
    const loc = locationEl && locationEl.value;
    const typ = typeEl && typeEl.value;
    let filtered = allJobs.slice();
    if (q) {
      filtered = filtered.filter(j => normalize(j.title + ' ' + j.company + ' ' + (j.tags||[]).join(' ')).includes(q));
    }
    if (loc) {
      if (loc === 'Remote') filtered = filtered.filter(j => j.workMode === 'Remote' || /remote/i.test(j.location));
      else if (loc === 'On-site') filtered = filtered.filter(j => j.workMode === 'On-site');
      else if (loc === 'Hybrid') filtered = filtered.filter(j => j.workMode === 'Hybrid');
    }
    if (typ) filtered = filtered.filter(j => j.employmentType === typ);
    renderJobs(filtered);
  }

  function bindFilters() {
    [qEl, locationEl, typeEl].forEach(el => el && el.addEventListener('input', applyFilters));
    clearFiltersEl && clearFiltersEl.addEventListener('click', () => {
      if (qEl) qEl.value = '';
      if (locationEl) locationEl.value = '';
      if (typeEl) typeEl.value = '';
      applyFilters();
    });
  }

  async function loadJobs() {
    loaderEl.classList.add('is-active');
    try {
      const res = await fetch('data/jobs.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch jobs.json');
      const jobs = await res.json();
      allJobs = Array.isArray(jobs) ? jobs : [];
    } catch (e) {
      console.warn('Failed to load jobs.json, fallback to empty', e);
      allJobs = [];
    } finally {
      loaderEl.classList.remove('is-active');
      applyFilters();
    }
  }

  bindFilters();
  loadJobs();
})();

