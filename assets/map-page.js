(function() {
  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle__icon');
  
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }
  
  function updateThemeIcon(theme) {
    if (!themeIcon) return;
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

  // Initialize i18n
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

  // Map functionality
  let map;
  let markers = [];
  let jobs = [];
  let allJobs = [];

  // Initialize map
  function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    if (typeof L === 'undefined') {
      console.error('Leaflet not available');
      showError('Map library not available');
      return;
    }

    // מרכז ישראל
    map = L.map('map').setView([31.5, 34.8], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadJobs();
  }

  // Load jobs - עדכון הנתיב
  async function loadJobs() {
    try {
      // נסה קודם לטעון מ-data/jobs.json, אם לא קיים נטען מה-JSON המוטבע
      let jobsData;
      try {
        const response = await fetch('data/jobs.json');
        if (response.ok) {
          jobsData = await response.json();
        } else {
          throw new Error('Failed to fetch from data/jobs.json');
        }
      } catch (error) {
        console.log('Could not load from data/jobs.json, using embedded data');
        // אם אין קובץ נפרד, נשתמש בנתונים המוטבעים כאן לבדיקה
        jobsData = [
          {
            "id": "-OYppXgDSWDPFhl_hU9P",
            "applyEmail": "test@test.com",
            "applyUrl": "https://junicorn.github.io/employer.html",
            "company": "hellersoft",
            "createdAt": "2025-08-29T12:38:30.412Z",
            "description": "בלה בלה",
            "employmentType": "התמחות",
            "latitude": 31.22417,
            "location": "נבטים",
            "longitude": 34.88098,
            "ownerEmail": "yehudaheller10@gmail.com",
            "ownerUid": "6zm26krPZJOAKZ54Rg8YvNdP8Gh1",
            "status": "approved",
            "tags": ["too"],
            "title": "מפתח בשפת TOO",
            "workMode": "במשרד"
          }
        ];
      }

      // סנן משרות מאושרות עם קואורדינטות תקינות
      allJobs = (Array.isArray(jobsData) ? jobsData : [])
        .filter(j => j &&
          j.status === 'approved' &&
          typeof j.latitude === 'number' &&
          typeof j.longitude === 'number' &&
          j.latitude >= 29 && j.latitude <= 34 && // גבולות ישראל בערך
          j.longitude >= 34 && j.longitude <= 36
        )
        .map(j => ({
          id: j.id,
          title: j.title || 'ללא כותרת',
          company: j.company || 'ללא שם חברה',
          location: j.location || 'ללא מיקום',
          latitude: j.latitude,
          longitude: j.longitude,
          workMode: j.workMode || '',
          employmentType: j.employmentType || '',
          description: j.description || '',
          applyEmail: j.applyEmail || '',
          applyUrl: j.applyUrl || '',
          tags: Array.isArray(j.tags) ? j.tags : [],
          createdAt: j.createdAt || '',
          ownerEmail: j.ownerEmail || '',
          status: j.status
        }));

      jobs = [...allJobs];
      console.log(`Loaded ${jobs.length} jobs with coordinates`);

      if (jobs.length > 0) {
        addMarkersToMap();
        updateJobsList();
        updateJobsCount();

        // מרכז המפה על המשרות
        const group = new L.featureGroup(markers);
        if (markers.length > 0) {
          map.fitBounds(group.getBounds().pad(0.1));
        }
      } else {
        showError('לא נמצאו משרות עם קואורדינטות תקינות');
      }

    } catch (error) {
      console.error('Error loading jobs:', error);
      showError('שגיאה בטעינת המשרות');
    }
  }

  // Add markers to map - שיפור התצוגה
  function addMarkersToMap() {
    if (!map) return;

    // נקה markers קיימים
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    jobs.forEach(job => {
      // יצירת אייקון מותאם אישית
      const icon = L.divIcon({
        className: 'job-marker',
        html: `
          <div class="job-marker-pin">
            <div class="job-marker-icon">💼</div>
          </div>
          <div class="job-marker-label">${escapeHtml(job.title.substring(0, 25))}${job.title.length > 25 ? '...' : ''}</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([job.latitude, job.longitude], { icon })
        .bindPopup(createPopupContent(job), {
          maxWidth: 300,
          className: 'job-popup'
        })
        .addTo(map);

      marker.jobId = job.id;
      markers.push(marker);
    });
  }

  // Create popup content - שיפור הPOPUP
  function createPopupContent(job) {
    const tags = job.tags.length > 0 ?
      `<div class="popup-tags">${job.tags.map(tag => `<span class="popup-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : '';

    const applyButtons = [];
    if (job.applyEmail) {
      applyButtons.push(`<a href="mailto:${encodeURIComponent(job.applyEmail)}?subject=${encodeURIComponent('בקשה לתפקיד: ' + job.title)}" class="popup-btn popup-btn-email">📧 שלח מייל</a>`);
    }
    if (job.applyUrl) {
      applyButtons.push(`<a href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noopener" class="popup-btn popup-btn-apply">🔗 הגש מועמדות</a>`);
    }

    return `
      <div class="job-popup-content">
        <div class="popup-header">
          <h3 class="popup-title">${escapeHtml(job.title)}</h3>
          <div class="popup-company">${escapeHtml(job.company)}</div>
        </div>

        <div class="popup-meta">
          <div class="popup-meta-item">📍 ${escapeHtml(job.location)}</div>
          <div class="popup-meta-item">💼 ${escapeHtml(job.employmentType)}</div>
          <div class="popup-meta-item">🏠 ${escapeHtml(job.workMode)}</div>
        </div>

        ${tags}

        ${job.description ? `<div class="popup-description">${escapeHtml(job.description.substring(0, 150))}${job.description.length > 150 ? '...' : ''}</div>` : ''}

        <div class="popup-actions">
          ${applyButtons.join('')}
          <button onclick="showJobModal('${job.id}')" class="popup-btn popup-btn-details">📋 פרטים נוספים</button>
        </div>
      </div>
    `;
  }

  // Filter jobs - שיפור החיפוש
  function filterJobs() {
    const searchTerm = (document.getElementById('mapSearch')?.value || '').toLowerCase().trim();
    const typeFilter = document.getElementById('mapTypeFilter')?.value || '';
    const workModeFilter = document.getElementById('mapWorkModeFilter')?.value || '';

    jobs = allJobs.filter(job => {
      // חיפוש טקסט
      let matchesSearch = true;
      if (searchTerm) {
        matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }

      // סינון לפי סוג עבודה
      const matchesType = !typeFilter || job.employmentType.toLowerCase().includes(typeFilter.toLowerCase());

      // סינון לפי אופן עבודה
      const matchesWorkMode = !workModeFilter || job.workMode.toLowerCase().includes(workModeFilter.toLowerCase());

      return matchesSearch && matchesType && matchesWorkMode;
    });

    // עדכן המפה והרשימה
    addMarkersToMap();
    updateJobsList();
    updateJobsCount();

    // התאם את המפה למשרות המסוננות
    if (jobs.length > 0 && markers.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Update jobs list
  function updateJobsList() {
    const jobsList = document.getElementById('mapJobsList');
    if (!jobsList) return;

    if (jobs.length === 0) {
      jobsList.innerHTML = `
        <div class="map-jobs-list__empty">
          <div class="empty-icon">🔍</div>
          <p>לא נמצאו משרות התואמות את החיפוש</p>
        </div>
      `;
      return;
    }

    const jobsHTML = jobs.map(job => `
      <div class="map-job-item" onclick="showJobModal('${job.id}')">
        <div class="map-job-item__header">
          <h4 class="map-job-item__title">${escapeHtml(job.title)}</h4>
          <span class="map-job-item__company">${escapeHtml(job.company)}</span>
        </div>
        <div class="map-job-item__meta">
          <span class="map-job-item__location">📍 ${escapeHtml(job.location)}</span>
          <span class="map-job-item__type">💼 ${escapeHtml(job.employmentType)}</span>
          <span class="map-job-item__work-mode">🏠 ${escapeHtml(job.workMode)}</span>
        </div>
        ${job.tags.length > 0 ? `
          <div class="map-job-item__tags">
            ${job.tags.slice(0, 3).map(tag => `<span class="job-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    jobsList.innerHTML = jobsHTML;
  }

  // Update jobs count
  function updateJobsCount() {
    const countElement = document.getElementById('mapJobsCount');
    if (countElement) {
      countElement.textContent = `${jobs.length} משר${jobs.length === 1 ? 'ה' : 'ות'}`;
    }
  }

  // Show job modal - שיפור המודל
  window.showJobModal = function(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) {
      console.error('Job not found:', jobId);
      return;
    }

    const modal = document.getElementById('jobModal');
    const title = document.getElementById('modalTitle');
    const company = document.getElementById('modalCompany');
    const meta = document.getElementById('modalMeta');
    const tags = document.getElementById('modalTags');
    const desc = document.getElementById('modalDescription');
    const actions = document.getElementById('modalActions');
    const extra = document.getElementById('modalExtra');

    if (!modal) {
      console.error('Job modal not found');
      return;
    }

    if (title) title.textContent = job.title;
    if (company) company.textContent = job.company;
    if (meta) {
      meta.innerHTML = `
        <div class="modal-meta-item">📍 ${escapeHtml(job.location)}</div>
        <div class="modal-meta-item">💼 ${escapeHtml(job.employmentType)}</div>
        <div class="modal-meta-item">🏠 ${escapeHtml(job.workMode)}</div>
      `;
    }

    if (tags) {
      tags.innerHTML = job.tags.length > 0 ?
        job.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') :
        '<span class="no-tags">אין תגיות</span>';
    }

    if (desc) {
      desc.innerHTML = job.description ?
        `<p>${escapeHtml(job.description)}</p>` :
        '<p class="no-description">אין תיאור נוסף</p>';
    }

    if (actions) {
      const buttons = [];
      if (job.applyEmail) {
        buttons.push(`<a class="btn btn--email" href="mailto:${encodeURIComponent(job.applyEmail)}?subject=${encodeURIComponent('בקשה לתפקיד: ' + job.title)}">📧 שלח מייל</a>`);
      }
      if (job.applyUrl) {
        buttons.push(`<a class="btn btn--primary" target="_blank" rel="noopener" href="${escapeHtml(job.applyUrl)}">🔗 הגש מועמדות</a>`);
      }
      if (buttons.length === 0) {
        buttons.push('<span class="no-apply">פרטי התקשרות לא זמינים</span>');
      }
      actions.innerHTML = buttons.join('');
    }

    if (extra) {
      let dateStr = '';
      if (job.createdAt) {
        const d = new Date(job.createdAt);
        dateStr = d.toLocaleDateString('he-IL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      extra.innerHTML = `
        <div class="extra-info">
          <div><strong>תאריך פרסום:</strong> ${dateStr || 'לא ידוע'}</div>
          <div><strong>מזהה:</strong> ${job.id}</div>
          ${job.ownerEmail ? `<div><strong>איש קשר:</strong> ${escapeHtml(job.ownerEmail)}</div>` : ''}
        </div>
      `;
    }

    modal.classList.add('is-active');
  };

  // Close job modal
  window.closeJobModal = function() {
    const modal = document.getElementById('jobModal');
    if (modal) {
      modal.classList.remove('is-active');
    }
  };

  // Modal event listeners
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('job-modal__backdrop') ||
        e.target.id === 'closeJobModal') {
      closeJobModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeJobModal();
    }
  });

  // Show error message
  function showError(message) {
    const jobsList = document.getElementById('mapJobsList');
    if (jobsList) {
      jobsList.innerHTML = `
        <div class="map-jobs-list__error">
          <div class="error-icon">⚠️</div>
          <p>${message}</p>
        </div>
      `;
    }
    console.error('Map error:', message);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize when DOM is ready
  function initialize() {
    initTheme();
    initMap();

    // Add search and filter event listeners
    const searchInput = document.getElementById('mapSearch');
    if (searchInput) {
      searchInput.addEventListener('input', filterJobs);
    }

    const typeFilter = document.getElementById('mapTypeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', filterJobs);
    }

    const workModeFilter = document.getElementById('mapWorkModeFilter');
    if (workModeFilter) {
      workModeFilter.addEventListener('change', filterJobs);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();