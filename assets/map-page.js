// Map Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize internationalization
    window.JI18N.init();
    
    // Initialize map
    initMap();
    
    // Load jobs
    loadJobs();
    
    // Event listeners
    setupEventListeners();
});

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        icon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        `;
    } else {
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `;
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    
    // Update map tiles for theme
    updateMapTheme();
}

// Global variables
let map;
let allJobs = [];
let filteredJobs = [];
let markers = [];
let currentBounds = null;

// Initialize map
function initMap() {
    // Default to Israel center
    const defaultLat = 31.7683;
    const defaultLng = 35.2137;
    const defaultZoom = 7;
    
    map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Listen for map bounds changes
    map.on('moveend', function() {
        currentBounds = map.getBounds();
        filterJobsByBounds();
    });
}

// Update map theme
function updateMapTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Remove existing tiles
    map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });
    
    // Add new tiles based on theme
    if (currentTheme === 'dark') {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors, © CARTO'
        }).addTo(map);
    } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

// Load jobs from JSON file
async function loadJobs() {
    try {
        console.log('Loading jobs for map...');
        const response = await fetch('data/jobs.json');
        if (!response.ok) {
            throw new Error('Failed to load jobs');
        }
        
        const data = await response.json();
        console.log('Loaded data for map:', data);
        
        // Handle both array format and object with jobs property
        allJobs = Array.isArray(data) ? data : (data.jobs || []);
        console.log('Processed jobs for map:', allJobs);
        
        filteredJobs = [...allJobs];
        
        // Add markers to map
        addMarkersToMap();
        
        // Update jobs list
        updateMapJobsList();
        updateMapJobsCount();
        
    } catch (error) {
        console.error('Error loading jobs for map:', error);
        showMapError('Failed to load jobs. Please try again later.');
    }
}

// Add markers to map
function addMarkersToMap() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    allJobs.forEach(job => {
        if (job.latitude && job.longitude) {
            const marker = L.marker([job.latitude, job.longitude])
                .bindPopup(createMarkerPopup(job))
                .addTo(map);
            
            marker.jobId = job.id;
            markers.push(marker);
        }
    });
}

// Create marker popup content
function createMarkerPopup(job) {
    const isUnavailable = job.status === 'unavailable';
    
    return `
        <div class="map-marker-popup">
            <h3>${escapeHtml(job.title)}</h3>
            <p><strong>${escapeHtml(job.company)}</strong></p>
            <p>${escapeHtml(job.location)}</p>
            ${isUnavailable ? 
                '<p class="unavailable">Job not available</p>' : 
                '<button onclick="showJobDetails(\'' + job.id + '\')" class="btn btn--primary">View Details</button>'
            }
        </div>
    `;
}

// Filter jobs by map bounds
function filterJobsByBounds() {
    if (!currentBounds) return;
    
    const boundsJobs = allJobs.filter(job => {
        if (!job.latitude || !job.longitude) return false;
        return currentBounds.contains([job.latitude, job.longitude]);
    });
    
    filteredJobs = boundsJobs;
    updateMapJobsList();
    updateMapJobsCount();
}

// Update map jobs list
function updateMapJobsList() {
    const jobsList = document.getElementById('mapJobsList');
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = `
            <div class="map-jobs-list__empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>${window.JI18N.getLang() === 'he' ? 'לא נמצאו משרות באזור זה' : 'No jobs found in this area'}</p>
            </div>
        `;
        return;
    }
    
    jobsList.innerHTML = filteredJobs.map(job => `
        <div class="map-job-card" onclick="showJobDetails('${job.id}')">
            <div class="map-job-card__title">${escapeHtml(job.title)}</div>
            <div class="map-job-card__company">${escapeHtml(job.company)}</div>
            <div class="map-job-card__meta">
                <div class="map-job-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${escapeHtml(job.location)}
                </div>
                <div class="map-job-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${formatDate(job.createdAt)}
                </div>
            </div>
            <div class="map-job-card__tags">
                <span class="map-job-card__tag">${escapeHtml(job.employmentType)}</span>
                <span class="map-job-card__tag">${escapeHtml(job.workMode)}</span>
            </div>
        </div>
    `).join('');
    
    // Apply translations to new content
    window.JI18N.apply();
}

// Update map jobs count
function updateMapJobsCount() {
    const jobsCount = document.getElementById('mapJobsCount');
    const count = filteredJobs.length;
    const lang = window.JI18N.getLang();
    const jobsText = lang === 'he' ? 'משרות' : count === 1 ? 'job' : 'jobs';
    jobsCount.textContent = `${count} ${jobsText}`;
}

// Show job details modal
function showJobDetails(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('jobModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCompany = document.getElementById('modalCompany');
    const modalMeta = document.getElementById('modalMeta');
    const modalTags = document.getElementById('modalTags');
    const modalDescription = document.getElementById('modalDescription');
    const modalActions = document.getElementById('modalActions');
    
    const isUnavailable = job.status === 'unavailable';
    
    modalTitle.textContent = job.title;
    modalCompany.textContent = job.company;
    
    modalMeta.innerHTML = `
        <div class="job-modal__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            ${escapeHtml(job.location)}
        </div>
        <div class="job-modal__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${formatDate(job.createdAt)}
        </div>
    `;
    
    modalTags.innerHTML = job.tags.map(tag => 
        `<span class="job-modal__tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    modalDescription.innerHTML = formatDescription(job.description);
    
    if (isUnavailable) {
        modalActions.innerHTML = `
            <div class="job-modal__unavailable">
                <svg class="job-modal__unavailable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <h3>${window.JI18N.getLang() === 'he' ? 'משרה לא זמינה' : 'Job Not Available'}</h3>
                <p>${window.JI18N.getLang() === 'he' ? 'משרה זו אינה מקבלת פניות כרגע. אנא בדוק משרות אחרות או נסה שוב מאוחר יותר.' : 'This job is not currently accepting applications. Please check other jobs or try again later.'}</p>
            </div>
        `;
    } else {
        modalActions.innerHTML = `
            <h3>${window.JI18N.getLang() === 'he' ? 'הגש מועמדות' : 'Apply for this position'}</h3>
            <div class="job-modal__apply-options">
                ${job.applyEmail ? `
                    <a href="mailto:${escapeHtml(job.applyEmail)}?subject=${encodeURIComponent(`Application for ${job.title} at ${job.company}`)}" 
                       class="job-modal__apply-btn job-modal__apply-btn--primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        ${window.JI18N.getLang() === 'he' ? 'שלח מייל' : 'Send Email'}
                    </a>
                ` : ''}
                ${job.applyUrl ? `
                    <a href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noopener noreferrer" 
                       class="job-modal__apply-btn job-modal__apply-btn--secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15,3 21,3 21,9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        ${window.JI18N.getLang() === 'he' ? 'הגש בקישור' : 'Apply via Link'}
                    </a>
                ` : ''}
            </div>
        `;
    }
    
    modal.classList.add('is-active');
    
    // Apply translations to new content
    window.JI18N.apply();
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search functionality
    const searchInput = document.getElementById('mapSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
    }
    
    // Filter functionality
    const typeFilter = document.getElementById('mapTypeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterJobs);
    }
    
    const workModeFilter = document.getElementById('mapWorkModeFilter');
    if (workModeFilter) {
        workModeFilter.addEventListener('change', filterJobs);
    }
    
    // Modal close
    const closeModal = document.getElementById('closeJobModal');
    if (closeModal) {
        closeModal.addEventListener('click', hideJobModal);
    }
    
    const modalBackdrop = document.querySelector('.job-modal__backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', hideJobModal);
    }
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideJobModal();
        }
    });
}

// Filter jobs
function filterJobs() {
    const searchTerm = document.getElementById('mapSearch').value.toLowerCase();
    const typeFilter = document.getElementById('mapTypeFilter').value;
    const workModeFilter = document.getElementById('mapWorkModeFilter').value;
    
    filteredJobs = allJobs.filter(job => {
        // Search filter
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        // Type filter
        const matchesType = !typeFilter || job.employmentType === typeFilter;
        
        // Work mode filter
        const matchesWorkMode = !workModeFilter || job.workMode === workModeFilter;
        
        return matchesSearch && matchesType && matchesWorkMode;
    });
    
    updateMapJobsList();
    updateMapJobsCount();
}

// Hide job modal
function hideJobModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('is-active');
}

// Show map error
function showMapError(message) {
    const jobsList = document.getElementById('mapJobsList');
    jobsList.innerHTML = `
        <div class="map-jobs-list__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p>${message}</p>
        </div>
    `;
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatDescription(description) {
    return description.replace(/\n/g, '<br>');
}

// Make functions globally available
window.showJobDetails = showJobDetails;