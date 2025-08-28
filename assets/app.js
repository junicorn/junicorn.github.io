(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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
        <div>
          <h3 class="job__title">${job.title}</h3>
          <div class="job__meta">${job.company} • ${job.location} • ${job.employmentType} • ${job.workMode}</div>
          <div class="job__tags">${(job.tags || []).slice(0, 6).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
        </div>
        <div class="job__cta">
          ${job.applyUrl ? `<a class="btn btn--ghost" target="_blank" rel="noopener" href="${job.applyUrl}">Apply</a>` : ''}
          ${job.applyEmail ? `<a class="btn" href="mailto:${job.applyEmail}">Email</a>` : ''}
        </div>`;
      fragment.appendChild(li);
    });
    jobsEl.appendChild(fragment);
    jobsMetaCountEl.textContent = String(jobs.length);
  }

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

