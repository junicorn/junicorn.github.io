// Jobs Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize internationalization
    window.JI18N.init();
    
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
}

// Global variables
let allJobs = [];
let filteredJobs = [];
let selectedJobId = null;

// Load jobs from JSON file
async function loadJobs() {
    try {
        const response = await fetch('data/jobs.json');
        if (!response.ok) {
            throw new Error('Failed to load jobs');
        }
        
        const data = await response.json();
        allJobs = data.jobs || [];
        filteredJobs = [...allJobs];
        
        renderJobList();
        updateJobsCount();
        
        // Select first job if available
        if (allJobs.length > 0) {
            selectJob(allJobs[0].id);
        }
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        showError('Failed to load jobs. Please try again later.');
    }
}

// Render job list in sidebar
function renderJobList() {
    const jobsList = document.getElementById('jobsList');
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = `
            <div class="jobs-list__empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>${window.JI18N.getLang() === 'he' ? 'לא נמצאו משרות' : 'No jobs found'}</p>
            </div>
        `;
        return;
    }
    
    jobsList.innerHTML = filteredJobs.map(job => `
        <div class="job-card ${selectedJobId === job.id ? 'job-card--active' : ''}" 
             data-job-id="${job.id}" onclick="selectJob('${job.id}')">
            <div class="job-card__title">${escapeHtml(job.title)}</div>
            <div class="job-card__company">${escapeHtml(job.company)}</div>
            <div class="job-card__meta">
                <div class="job-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${escapeHtml(job.location)}
                </div>
                <div class="job-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${formatDate(job.createdAt)}
                </div>
            </div>
            <div class="job-card__tags">
                <span class="job-card__tag">${escapeHtml(job.employmentType)}</span>
                <span class="job-card__tag">${escapeHtml(job.workMode)}</span>
            </div>
        </div>
    `).join('');
}

// Select a job and show its details
function selectJob(jobId) {
    selectedJobId = jobId;
    const job = allJobs.find(j => j.id === jobId);
    
    if (!job) {
        showEmptyState();
        return;
    }
    
    // Update active state in sidebar
    document.querySelectorAll('.job-card').forEach(card => {
        card.classList.remove('job-card--active');
    });
    
    const activeCard = document.querySelector(`[data-job-id="${jobId}"]`);
    if (activeCard) {
        activeCard.classList.add('job-card--active');
    }
    
    // Render job details
    renderJobDetails(job);
}

// Render job details in main content
function renderJobDetails(job) {
    const jobDetails = document.getElementById('jobDetails');
    
    const isUnavailable = job.status === 'unavailable';
    
    jobDetails.innerHTML = `
        <div class="job-details__content">
            <div class="job-details__header">
                <h1 class="job-details__title">${escapeHtml(job.title)}</h1>
                <div class="job-details__company">${escapeHtml(job.company)}</div>
                <div class="job-details__meta">
                    <div class="job-details__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${escapeHtml(job.location)}
                    </div>
                    <div class="job-details__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${formatDate(job.createdAt)}
                    </div>
                    <div class="job-details__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        ${window.JI18N.getLang() === 'he' ? 'פורסם לפני' : 'Posted'} ${getTimeAgo(job.createdAt)}
                    </div>
                </div>
                <div class="job-details__tags">
                    <span class="job-details__tag">${escapeHtml(job.employmentType)}</span>
                    <span class="job-details__tag">${escapeHtml(job.workMode)}</span>
                </div>
            </div>
            
            <div class="job-details__description">
                ${formatDescription(job.description)}
            </div>
            
            ${isUnavailable ? `
                <div class="job-details__unavailable">
                    <svg class="job-details__unavailable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <h3>${window.JI18N.getLang() === 'he' ? 'משרה לא זמינה' : 'Job Not Available'}</h3>
                    <p>${window.JI18N.getLang() === 'he' ? 'משרה זו אינה מקבלת פניות כרגע. אנא בדוק משרות אחרות או נסה שוב מאוחר יותר.' : 'This job is not currently accepting applications. Please check other jobs or try again later.'}</p>
                </div>
            ` : `
                <div class="job-details__apply">
                    <h3>${window.JI18N.getLang() === 'he' ? 'הגש מועמדות' : 'Apply for this position'}</h3>
                    <div class="job-details__apply-options">
                        ${job.applyEmail ? `
                            <a href="mailto:${escapeHtml(job.applyEmail)}?subject=${encodeURIComponent(`Application for ${job.title} at ${job.company}`)}" 
                               class="job-details__apply-btn job-details__apply-btn--primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                ${window.JI18N.getLang() === 'he' ? 'שלח מייל' : 'Send Email'}
                            </a>
                        ` : ''}
                        ${job.applyUrl ? `
                            <a href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noopener noreferrer" 
                               class="job-details__apply-btn job-details__apply-btn--secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    <polyline points="15,3 21,3 21,9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                ${window.JI18N.getLang() === 'he' ? 'הגש בקישור' : 'Apply via Link'}
                            </a>
                        ` : ''}
                    </div>
                </div>
            `}
        </div>
    `;
    
    // Apply translations to new content
    window.JI18N.apply();
}

// Show empty state
function showEmptyState() {
    const jobDetails = document.getElementById('jobDetails');
    jobDetails.innerHTML = `
        <div class="job-details__empty">
            <div class="empty-state">
                <svg class="empty-state__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 7L8 14L2 11L8 4L20 11L14 14L20 7Z"/>
                    <path d="M8 14V21L14 18V11"/>
                </svg>
                <h3>${window.JI18N.getLang() === 'he' ? 'בחר משרה לצפייה בפרטים' : 'Select a job to view details'}</h3>
                <p>${window.JI18N.getLang() === 'he' ? 'בחר משרה מהרשימה כדי לראות פרטים מלאים ולהגיש מועמדות' : 'Choose a job from the list to see full details and apply'}</p>
            </div>
        </div>
    `;
}

// Filter and search jobs
function filterJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredJobs = allJobs.filter(job => {
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm);
            
        const matchesLocation = !locationFilter || 
            job.location.toLowerCase().includes(locationFilter) ||
            (locationFilter === 'remote' && job.workMode.toLowerCase().includes('remote'));
            
        const matchesType = !typeFilter || 
            job.employmentType.toLowerCase().includes(typeFilter);
            
        return matchesSearch && matchesLocation && matchesType;
    });
    
    renderJobList();
    updateJobsCount();
    
    // Reset selection if current job is not in filtered results
    if (selectedJobId && !filteredJobs.find(job => job.id === selectedJobId)) {
        if (filteredJobs.length > 0) {
            selectJob(filteredJobs[0].id);
        } else {
            showEmptyState();
            selectedJobId = null;
        }
    }
}

// Update jobs count
function updateJobsCount() {
    const jobsCount = document.getElementById('jobsCount');
    const count = filteredJobs.length;
    const lang = window.JI18N.getLang();
    const jobsText = lang === 'he' ? 'משרות' : count === 1 ? 'job' : 'jobs';
    jobsCount.textContent = `${count} ${jobsText}`;
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Language toggle
    document.querySelectorAll('.language-toggle__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            window.JI18N.setLang(lang);
            document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', lang);
            
            // Update UI elements
            updateJobsCount();
            if (selectedJobId) {
                const job = allJobs.find(j => j.id === selectedJobId);
                if (job) {
                    renderJobDetails(job);
                }
            }
        });
    });
    
    // Search and filters
    document.getElementById('jobSearch').addEventListener('input', filterJobs);
    document.getElementById('locationFilter').addEventListener('change', filterJobs);
    document.getElementById('typeFilter').addEventListener('change', filterJobs);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(window.JI18N.getLang() === 'he' ? 'he-IL' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return window.JI18N.getLang() === 'he' ? 'פחות משעה' : 'less than an hour';
    } else if (diffInHours < 24) {
        return window.JI18N.getLang() === 'he' ? `${diffInHours} שעות` : `${diffInHours} hours`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return window.JI18N.getLang() === 'he' ? `${diffInDays} ימים` : `${diffInDays} days`;
    }
}

function formatDescription(description) {
    // Convert line breaks to HTML
    return description.replace(/\n/g, '<br>');
}

function showError(message) {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = `
        <div class="jobs-list__error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p>${message}</p>
        </div>
    `;
}