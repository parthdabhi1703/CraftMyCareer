import { GeminiService } from './geminiServices.js';

// Global State
let resumeData = {
    fullName: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    socialLinks: [],
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    renderAllDynamicLists();
});

// --- Accordion Logic ---
window.toggleAccordion = function (header) {
    const content = header.nextElementSibling;
    const isActive = content.classList.contains('active');

    if (!isActive) {
        content.classList.add('active');
        header.classList.add('active');
    } else {
        content.classList.remove('active');
        header.classList.remove('active');
    }
};

// --- Data Persistence ---
function loadData() {
    const stored = localStorage.getItem('resumeData');
    if (stored) {
        const parsed = JSON.parse(stored);
        resumeData = { ...resumeData, ...parsed };
    }

    // Data Sanitization (Fix for migration from old version)
    if (!Array.isArray(resumeData.skills)) {
        resumeData.skills = typeof resumeData.skills === 'string'
            ? resumeData.skills.split(',').map(s => s.trim()).filter(Boolean)
            : [];
    }
    if (!Array.isArray(resumeData.experience)) resumeData.experience = [];
    if (!Array.isArray(resumeData.projects)) resumeData.projects = [];
    if (!Array.isArray(resumeData.education)) resumeData.education = [];
    if (!Array.isArray(resumeData.certifications)) resumeData.certifications = [];
    if (!Array.isArray(resumeData.socialLinks)) resumeData.socialLinks = [];

    // Populate Static Fields
    ['fullName', 'email', 'phone', 'location'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = resumeData[id] || '';
    });

    updatePreview();
}

function saveData() {
    // Capture Static Fields
    ['fullName', 'email', 'phone', 'location'].forEach(id => {
        const el = document.getElementById(id);
        if (el) resumeData[id] = el.value;
    });

    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    updatePreview();
}

// --- Dynamic Lists Logic ---

// Social Links
window.addSocialLink = function () {
    resumeData.socialLinks.push({ platform: 'github', url: '', label: '' });
    renderSocialLinksList();
    saveData();
};

window.removeSocialLink = function (index) {
    resumeData.socialLinks.splice(index, 1);
    renderSocialLinksList();
    saveData();
};

window.updateSocialLink = function (index, field, value) {
    resumeData.socialLinks[index][field] = value;
    saveData();
};

function renderSocialLinksList() {
    const container = document.getElementById('socialLinksList');
    if (!container) return;

    const options = [
        { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
        { value: 'github', label: 'GitHub', icon: 'code' },
        { value: 'portfolio', label: 'Portfolio', icon: 'folder_special' },
        { value: 'blog', label: 'Blog', icon: 'rss_feed' },
        { value: 'website', label: 'Website', icon: 'language' },
        { value: 'twitter', label: 'Twitter/X', icon: 'alternate_email' },
        { value: 'instagram', label: 'Instagram', icon: 'camera_alt' },
        { value: 'facebook', label: 'Facebook', icon: 'facebook' },
        { value: 'youtube', label: 'YouTube', icon: 'play_circle' }
    ];

    container.innerHTML = resumeData.socialLinks.map((item, index) => `
        <div class="dynamic-item" style="display: flex; gap: 0.5rem; align-items: center; padding: 0.5rem;">
            <select onchange="updateSocialLink(${index}, 'platform', this.value)" style="width: 120px; margin-bottom: 0;">
                ${options.map(opt => `<option value="${opt.value}" ${item.platform === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
            <input type="text" placeholder="Label (e.g. LinkedIn)" value="${item.label || ''}" oninput="updateSocialLink(${index}, 'label', this.value)" style="margin-bottom: 0; flex: 1;">
            <input type="text" placeholder="URL" value="${item.url}" oninput="updateSocialLink(${index}, 'url', this.value)" style="margin-bottom: 0; flex: 1;">
            <button onclick="removeSocialLink(${index})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>
    `).join('');
}

// Skills
window.addSkill = function () {
    const input = document.getElementById('skillInput');
    const val = input.value.trim();
    if (val) {
        resumeData.skills.push(val);
        input.value = '';
        renderSkillsList();
        saveData();
    }
};

window.removeSkill = function (index) {
    resumeData.skills.splice(index, 1);
    renderSkillsList();
    saveData();
};

function renderSkillsList() {
    const container = document.getElementById('skillsList');
    container.innerHTML = resumeData.skills.map((skill, index) => `
        <div class="skill-tag" style="display: flex; align-items: center; gap: 0.5rem;">
            ${skill}
            <span onclick="removeSkill(${index})" style="cursor: pointer; color: #ef4444;">&times;</span>
        </div>
    `).join('');
}

// Summary
window.updateSummary = function (value) {
    resumeData.summary = value;
    saveData();
};

function renderSummary() {
    const container = document.getElementById('summaryContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="position: relative; margin-top: 0.5rem;">
            <textarea id="summary" rows="5" placeholder="Type a rough draft here..." oninput="updateSummary(this.value)">${resumeData.summary || ''}</textarea>
            <button onclick="enhanceSummary()" class="btn btn-primary" style="position: absolute; bottom: 35px; right: 15px; font-size: 0.8rem; padding: 6px 12px; z-index: 5;">✨ AI Write</button>
        </div>
    `;
}

// Experience
window.addExperience = function () {
    resumeData.experience.push({ company: '', role: '', start: '', end: '', description: '' });
    renderExperienceList();
    saveData();
};

window.removeExperience = function (index) {
    resumeData.experience.splice(index, 1);
    renderExperienceList();
    saveData();
};

window.updateExperience = function (index, field, value) {
    resumeData.experience[index][field] = value;
    saveData();
};

function renderExperienceList() {
    const container = document.getElementById('experienceList');
    container.innerHTML = resumeData.experience.map((item, index) => `
        <div class="dynamic-item">
            <button class="delete-btn" onclick="removeExperience(${index})">&times;</button>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <input type="text" placeholder="Company Name" value="${item.company}" oninput="updateExperience(${index}, 'company', this.value)">
                <input type="text" placeholder="Job Title" value="${item.role}" oninput="updateExperience(${index}, 'role', this.value)">
                <input type="text" placeholder="Start Date" value="${item.start}" oninput="updateExperience(${index}, 'start', this.value)">
                <input type="text" placeholder="End Date" value="${item.end}" oninput="updateExperience(${index}, 'end', this.value)">
            </div>
            <div style="position: relative; margin-top: 0.5rem;">
                <textarea rows="3" id="exp-desc-${index}" placeholder="Description (Bullet points)" oninput="updateExperience(${index}, 'description', this.value)">${item.description}</textarea>
                <button onclick="enhanceExperience(${index})" class="btn btn-primary" style="position: absolute; bottom: 35px; right: 15px; font-size: 0.8rem; padding: 6px 12px; z-index: 5;">✨ AI Write</button>
            </div>
        </div>
    `).join('');
}

// AI Handlers
window.enhanceSummary = async function () {
    const summaryInput = document.getElementById('summary');
    const role = resumeData.role || 'Professional';

    if (!summaryInput.value) return alert("Please write a rough draft first.");

    const btn = document.querySelector('#summary + button');
    const originalText = btn.innerText;
    btn.innerText = "Generating...";
    btn.disabled = true;

    const result = await GeminiService.enhanceSummary(summaryInput.value, role);

    btn.innerText = originalText;
    btn.disabled = false;

    if (result.text) {
        summaryInput.value = result.text;
        resumeData.summary = result.text;
        saveData();
    } else {
        alert("AI Error: " + result.error);
    }
};

window.enhanceExperience = async function (index) {
    const item = resumeData.experience[index];
    const role = item.role || resumeData.role || 'Professional';
    const context = `Role: ${item.role}, Company: ${item.company}, Description: ${item.description}`;

    const btn = document.querySelector(`#exp-desc-${index} + button`);
    const originalText = btn.innerText;
    btn.innerText = "Generating...";
    btn.disabled = true;

    const result = await GeminiService.generateBulletPoints(role, context, 'experience');

    btn.innerText = originalText;
    btn.disabled = false;

    if (result.text) {
        updateExperience(index, 'description', result.text);
        document.getElementById(`exp-desc-${index}`).value = result.text;
    } else {
        alert("AI Error: " + result.error);
    }
};

// Projects
window.addProject = function () {
    resumeData.projects.push({ name: '', tech: '', link: '', linkLabel: 'Live Demo', description: '' });
    renderProjectsList();
    saveData();
};

window.removeProject = function (index) {
    resumeData.projects.splice(index, 1);
    renderProjectsList();
    saveData();
};

window.updateProject = function (index, field, value) {
    resumeData.projects[index][field] = value;
    saveData();
};

function renderProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = resumeData.projects.map((item, index) => `
        <div class="dynamic-item">
            <button class="delete-btn" onclick="removeProject(${index})">&times;</button>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <input type="text" placeholder="Project Name" value="${item.name}" oninput="updateProject(${index}, 'name', this.value)">
                <input type="text" placeholder="Technologies Used" value="${item.tech || ''}" oninput="updateProject(${index}, 'tech', this.value)">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                <input type="text" placeholder="Label (e.g. Live Demo)" value="${item.linkLabel || ''}" oninput="updateProject(${index}, 'linkLabel', this.value)">
                <input type="text" placeholder="Link URL" value="${item.link}" oninput="updateProject(${index}, 'link', this.value)">
            </div>
            <div style="position: relative; margin-top: 0.5rem;">
                <textarea rows="3" id="proj-desc-${index}" placeholder="Description" oninput="updateProject(${index}, 'description', this.value)">${item.description}</textarea>
                <button onclick="enhanceProject(${index})" class="btn btn-primary" style="position: absolute; bottom: 35px; right: 15px; font-size: 0.8rem; padding: 6px 12px; z-index: 5;">✨ AI Enhance</button>
            </div>
        </div>
    `).join('');
}

window.enhanceProject = async function (index) {
    const item = resumeData.projects[index];
    const role = resumeData.role || 'Developer';
    const context = `Project: ${item.name}, Tech: ${item.tech}, Description: ${item.description}`;

    const btn = document.querySelector(`#proj-desc-${index} + button`);
    const originalText = btn.innerText;
    btn.innerText = "Generating...";
    btn.disabled = true;

    const result = await GeminiService.generateBulletPoints(role, context, 'project');

    btn.innerText = originalText;
    btn.disabled = false;

    if (result.text) {
        updateProject(index, 'description', result.text);
        document.getElementById(`proj-desc-${index}`).value = result.text;
    } else {
        alert("AI Error: " + result.error);
    }
};

// Education
window.addEducation = function () {
    resumeData.education.push({ school: '', degree: '', start: '', end: '', grade: '', gradeType: 'CGPA' });
    renderEducationList();
    saveData();
};

window.removeEducation = function (index) {
    resumeData.education.splice(index, 1);
    renderEducationList();
    saveData();
};

window.updateEducation = function (index, field, value) {
    resumeData.education[index][field] = value;
    saveData();
};

function renderEducationList() {
    const container = document.getElementById('educationList');
    const gradeOptions = ['CGPA', 'Grade', 'Percentage', 'Marks'];

    container.innerHTML = resumeData.education.map((item, index) => `
        <div class="dynamic-item">
            <button class="delete-btn" onclick="removeEducation(${index})">&times;</button>
            <input type="text" placeholder="Institution Name" value="${item.school}" oninput="updateEducation(${index}, 'school', this.value)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <input type="text" placeholder="Degree" value="${item.degree}" oninput="updateEducation(${index}, 'degree', this.value)">
                
                <div style="display: flex; gap: 0.5rem;">
                    <select onchange="updateEducation(${index}, 'gradeType', this.value)" style="margin-bottom: 1rem; max-width: 120px;">
                        <option value="" ${!item.gradeType ? 'selected' : ''}>Type</option>
                        ${gradeOptions.map(opt => `<option value="${opt}" ${item.gradeType === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                    <input type="text" placeholder="Value" value="${item.grade}" oninput="updateEducation(${index}, 'grade', this.value)" style="flex: 1;">
                </div>

                <input type="text" placeholder="Start Date" value="${item.start}" oninput="updateEducation(${index}, 'start', this.value)">
                <input type="text" placeholder="End Date" value="${item.end}" oninput="updateEducation(${index}, 'end', this.value)">
            </div>
        </div>
    `).join('');
}

// Certifications
window.addCertification = function () {
    resumeData.certifications.push({ title: '', description: '' });
    renderCertificationList();
    saveData();
};

window.removeCertification = function (index) {
    resumeData.certifications.splice(index, 1);
    renderCertificationList();
    saveData();
};

window.updateCertification = function (index, field, value) {
    resumeData.certifications[index][field] = value;
    saveData();
};

function renderCertificationList() {
    const container = document.getElementById('certificationList');
    container.innerHTML = resumeData.certifications.map((item, index) => `
        <div class="dynamic-item">
            <button class="delete-btn" onclick="removeCertification(${index})">&times;</button>
            <input type="text" placeholder="Certificate Title" value="${item.title}" oninput="updateCertification(${index}, 'title', this.value)">
            <textarea rows="2" placeholder="Description" oninput="updateCertification(${index}, 'description', this.value)">${item.description}</textarea>
        </div>
    `).join('');
}

function renderAllDynamicLists() {
    renderSummary();
    renderSocialLinksList();
    renderSkillsList();
    renderExperienceList();
    renderProjectsList();
    renderEducationList();
    renderCertificationList();
}

// --- Preview Rendering ---
function updatePreview() {
    // Header
    document.getElementById('p-name').textContent = resumeData.fullName || 'YOUR NAME';

    const iconMap = {
        github: 'code',
        portfolio: 'folder_special',
        blog: 'rss_feed',
        website: 'language',
        twitter: 'alternate_email',
        instagram: 'camera_alt',
        facebook: 'facebook',
        youtube: 'play_circle'
    };

    const socialLinksHTML = (resumeData.socialLinks || []).map(link => {
        if (!link.url) return '';

        const displayText = link.label || link.url;
        const content = `<a href="${link.url}" target="_blank" style="color: inherit; text-decoration: none;">${displayText}</a>`;

        if (link.platform === 'github') {
            return `<span><img src="assets/github.svg" alt="github" style="height: 14px; width: 14px; vertical-align: middle;"/> ${content}</span>`;
        }
        if (link.platform === 'linkedin') {
            return `<span><img src="assets/linkedin.svg" alt="linkedin" style="height: 14px; width: 14px; vertical-align: middle;"/> ${content}</span>`;
        }

        const icon = iconMap[link.platform] || 'link';
        return `<span><span class="material-icons" style="font-size: 14px; vertical-align: middle;">${icon}</span> ${content}</span>`;
    }).join('');

    const contactHTML = [
        resumeData.email ? `<span><span class="material-icons" style="font-size: 14px; vertical-align: middle;">email</span> <a href="mailto:${resumeData.email}" style="color: inherit; text-decoration: none;">${resumeData.email}</a></span>` : '',
        resumeData.phone ? `<span><span class="material-icons" style="font-size: 14px; vertical-align: middle;">phone</span> ${resumeData.phone}</span>` : '',
        resumeData.location ? `<span><span class="material-icons" style="font-size: 14px; vertical-align: middle;">location_on</span> ${resumeData.location}</span>` : '',
        socialLinksHTML
    ].filter(Boolean).join('');
    document.getElementById('p-contact').innerHTML = contactHTML;

    // Summary
    document.getElementById('p-summary').textContent = resumeData.summary;
    document.getElementById('sec-summary').style.display = resumeData.summary ? 'block' : 'none';

    // Skills
    const skillsContainer = document.getElementById('p-skills');
    skillsContainer.innerHTML = resumeData.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById('sec-skills').style.display = resumeData.skills.length ? 'block' : 'none';

    // Experience
    const expContainer = document.getElementById('p-experience');
    expContainer.innerHTML = resumeData.experience.map(item => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div class="resume-item-title">${item.role}</div>
                <div class="resume-item-date">${item.start} - ${item.end}</div>
            </div>
            <div class="resume-item-subtitle">${item.company}</div>
            <ul class="resume-list">
                ${item.description.split('\n').map(line => line.trim() ? `<li>${line}</li>` : '').join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('sec-experience').style.display = resumeData.experience.length ? 'block' : 'none';

    // Projects
    const projContainer = document.getElementById('p-projects');
    projContainer.innerHTML = resumeData.projects.map(item => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div class="resume-item-title">${item.name}</div>
                <div class="resume-item-date">
                    ${item.link ? `<a href="${item.link}" target="_blank" style="color: inherit; text-decoration: none;">${item.linkLabel || item.link} <span class="material-icons" style="font-size: 10pt; vertical-align: middle;">open_in_new</span></a>` : ''}
                </div>
            </div>
            ${item.tech ? `<div style="font-size: 9pt; font-style: italic; color: #555; margin-bottom: 0.2rem;">Technologies: ${item.tech}</div>` : ''}
            <ul class="resume-list">
                ${item.description.split('\n').map(line => line.trim() ? `<li>${line}</li>` : '').join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('sec-projects').style.display = resumeData.projects.length ? 'block' : 'none';

    // Education
    const eduContainer = document.getElementById('p-education');
    eduContainer.innerHTML = resumeData.education.map(item => `
        <div class="resume-item">
            <div class="resume-item-header">
                <div class="resume-item-title">${item.school}</div>
                <div class="resume-item-date">${item.start} - ${item.end}</div>
            </div>
            <div class="resume-item-header">
                <div class="resume-item-subtitle">${item.degree}</div>
                <div class="resume-item-date">${item.gradeType ? item.gradeType + ': ' : ''}${item.grade}</div>
            </div>
        </div>
    `).join('');
    document.getElementById('sec-education').style.display = resumeData.education.length ? 'block' : 'none';

    // Certification
    const certContainer = document.getElementById('p-certification');
    certContainer.innerHTML = resumeData.certifications.map(item => `
        <div class="resume-item">
            <div class="resume-item-title">${item.title}</div>
            <ul class="resume-list">
                ${item.description.split('\n').map(line => line.trim() ? `<li>${line}</li>` : '').join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('sec-certification').style.display = resumeData.certifications.length ? 'block' : 'none';
}

function setupEventListeners() {
    // Static inputs
    document.querySelectorAll('#fullName, #email, #phone, #location').forEach(input => {
        input.addEventListener('input', saveData);
    });
}