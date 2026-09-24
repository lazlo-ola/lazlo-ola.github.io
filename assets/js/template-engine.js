/**
 * Vanilla JavaScript Template Engine
 * Uses template literals for clean data/presentation separation
 */
class CVTemplateEngine {
    constructor() {
        this.templates = new Map();
        this.registerDefaultTemplates();
    }

    registerTemplate(name, template) {
        this.templates.set(name, template);
    }

    registerDefaultTemplates() {
        // Header template
        this.registerTemplate('header', (data) => `
            <header class="cv-header">
                <div class="profile-section">
                    <img src="${data.basics.image}" alt="${data.basics.name}" class="profile-image">
                    <h1 class="name text-uppercase letter-spacing-lg">${data.basics.name}</h1>
                    <p class="title text-uppercase letter-spacing-md">${data.basics.label}</p>
                </div>
                <div class="contact-section">
                    <div class="contact-info">
                        <i class="bi bi-telephone"></i>
                        <button type="button" class="contact-item contact-reveal" data-contact="phone">Telefonszám megjelenítése</button>
                        <i class="bi bi-envelope"></i>
                        <button type="button" class="contact-item contact-reveal" data-contact="email">E-mail megjelenítése</button>
                        <i class="bi bi-geo-alt"></i><span class="contact-item">${data.basics.location}</span>
                        <i class="bi bi-globe"></i>
                        <a href="${data.basics.website}" target="_blank" class="contact-item">${data.basics.website}</a>
                    </div>
                    <div class="social-links">
                        ${data.basics.profiles.map(profile => `
                            <a href="${profile.url}" target="_blank" class="social-link" title="${profile.network}">
                                <i class="bi ${this.getSocialIcon(profile.network)}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </header>
        `);

        // Summary template
        this.registerTemplate('summary', (data) => `
            <section class="cv-section summary-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-person"></i> Bemutatkozás
                </h2>
                <div class="summary-content">
                    ${data.summary.map(paragraph => `<p class="summary-paragraph">${paragraph}</p>`).join('')}
                </div>
            </section>
        `);

        // Experience template
        this.registerTemplate('experience', (data) => `
            <section class="cv-section experience-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-briefcase"></i> Szakmai tapasztalat
                </h2>
                <div class="experience-timeline">
                    ${data.work.map(job => this.renderJob(job)).join('')}
                </div>
            </section>
        `);

        // Skills template
        this.registerTemplate('skills', (data) => `
            <section class="cv-section skills-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-gear"></i> Készségek
                </h2>
                <div class="skills-content">
                    ${data.skills.technical.map(group => this.renderSkillGroup(group)).join('')}
                </div>
            </section>
        `);

        // Soft Skills template
        this.registerTemplate('softSkills', (data) => `
            <section class="cv-section soft-skills-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-people"></i> Soft Skills
                </h2>
                <div class="soft-skills-content">
                    <div class="soft-skills-tags">
                        ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </section>
        `);

        // Education template
        this.registerTemplate('education', (data) => `
            <section class="cv-section education-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-book"></i> Tanulmányok
                </h2>
                <div class="education-content">
                    ${data.education.map(edu => this.renderEducation(edu)).join('')}
                </div>
            </section>
        `);

        // Languages template
        this.registerTemplate('languages', (data) => `
            <section class="cv-section languages-section">
                <h2 class="section-title letter-spacing-sm">
                    <i class="bi bi-translate"></i> Nyelvismeret
                </h2>
                <div class="languages-content">
                    ${data.languages.map(lang => this.renderLanguage(lang)).join('')}
                </div>
            </section>
        `);
    }

    renderJob(job) {
        const startDate = this.formatDate(job.start);
        const endDate = job.end ? this.formatDate(job.end) : 'Present';
        const period = `${startDate} - ${endDate}`;

        return `
            <div class="job-item">
                <div class="job-header">
                    <div class="job-period">${period}</div>
                    <div class="job-position">${job.position}</div>
                    <div class="job-company">${job.company}${job.project ? ` - ${job.project}` : ''}</div>
                    ${job.location ? `<div class="job-vendor">${job.location}</div>` : ''}
                    ${job.vendor ? `<div class="job-vendor">Via ${job.vendor}</div>` : ''}
                </div>
                <div class="job-description">
                    <ul class="job-highlights">
                        ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
                ${job.technologies.length ? `<div class="job-technologies">
                    <strong>Technologies:</strong>
                    <div class="tech-tags">
                        ${job.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>` : ''}
            </div>
        `;
    }

    renderSkillGroup(group) {
        return `
            <div class="skill-group">
                <h3 class="skill-group-title">${group.group}</h3>
                <div class="languages-content">
                    ${group.items.map(skill => this.renderSkill(skill)).join('')}
                </div>
            </div>
        `;
    }

    renderSkill(skill) {
        const indicator = Number.isFinite(skill.proficiencyPercent) ? this.renderSpanIndicator(skill.proficiencyPercent) : '';
        return `
            <div class="language-item">
                <div class="language-name">
                    ${skill.name}
                </div>
                <div class="language-indicator">${indicator}</div>
            </div>
        `;
    }

    renderEducation(edu) {
        // A qualification can have a single year or a start/end date range.
        const dates = edu.year != null ? [edu.year] : [edu.start, edu.end];
        const period = [...new Set(dates
            .filter(date => date != null && date !== '')
            .map(date => this.formatDate(String(date))))].join(' - ');

        return `
            <div class="education-item">
                <div class="education-header">
                    <h3 class="education-institution">
                        ${edu.institution}
                    </h3>
                    ${period ? `<div class="education-period">${period}</div>` : ''}
                </div>
                <div class="education-details">
                    <div class="education-degree">${edu.area}</div>
                    <div class="education-major">${edu.location}</div>
                </div>
            </div>
        `;
    }

    renderLanguage(lang) {
        const indicator = Number.isFinite(lang.percentage) ? this.renderSpanIndicator(lang.percentage) : '';
        return `
            <div class="language-item">
                <div class="language-name">${lang.language} (${lang.fluency})</div>
                <div class="language-indicator">${indicator}</div>
            </div>
        `;
    }

    renderIndicator(percentage) {
        const decFull = Math.floor(percentage / 10);
        const decEmpty = Math.floor((100-percentage) / 10);
        const decHalf = 10 - (decFull + decEmpty);
        const full = '■'.repeat(decFull);
        const half = '▸'.repeat(decHalf);
        const empty = '□'.repeat(decEmpty);
        return `${full}${half}${empty}`;
    }

    renderSpanIndicator(percentage) {
        return `<span class="indicator">${this.renderIndicator(percentage)}</span>`;
    }

    getSocialIcon(network) {
        const icons = {
            'LinkedIn': 'bi-linkedin',
            'GitHub': 'bi-github',
            'GitLab': 'bi-gitlab',
            'Twitter': 'bi-twitter',
            'Stack Overflow': 'bi-stack-overflow'
        };
        return icons[network] || 'bi-link';
    }

    formatDate(dateString) {
        if (dateString.includes('-')) {
            const [year, month] = dateString.split('-');
            const monthNames = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
            return `${year}. ${monthNames[parseInt(month) - 1]}`;
        }
        return dateString;
    }

    render(data, container) {
        const html = `
            <div class="cv-container">
                ${this.templates.get('header')(data)}
                <div class="cv-content">
                    <div class="main-content">
                        ${this.templates.get('summary')(data)}
                        ${this.templates.get('experience')(data)}
                    </div>
                    <div class="sidebar">
                        ${this.templates.get('skills')(data)}
                        ${this.templates.get('education')(data)}
                        ${this.templates.get('languages')(data)}
                        ${data.skills.soft.length ? this.templates.get('softSkills')(data) : ''}
                    </div>
                </div>
                <footer class="cv-footer">
                    <div class="footer-content">
                        <a href="${data.extras.footerLink.url}" target="_blank" class="footer-link">
                            ${data.extras.footerLink.label}
                        </a>
                    </div>
                </footer>
            </div>
        `;

        if (container) {
            container.innerHTML = html;
            this.setupDecryptionHandlers(data.basics, container);
        }
        return html;
    }

    setupDecryptionHandlers(basics, container) {
        container.querySelectorAll('[data-contact]').forEach(button => {
            let revealing = false;
            const reveal = async () => {
                if (revealing) return;
                revealing = true;
                try {
                    const kind = button.dataset.contact;
                    const value = await dec(basics[kind].ciphertext, 'https://mail.google.com');
                    const anchor = document.createElement('a');
                    anchor.href = `${kind === 'phone' ? 'tel:' : 'mailto:'}${value}`;
                    anchor.textContent = value;
                    anchor.className = 'contact-item';
                    const hadFocus = document.activeElement === button;
                    button.replaceWith(anchor);
                    if (hadFocus) anchor.focus();
                } catch (error) {
                    revealing = false;
                    button.textContent = 'Újrapróbálkozás';
                    console.error('Contact reveal failed:', error);
                }
            };
            button.addEventListener('mouseenter', reveal);
            button.addEventListener('focus', reveal);
            button.addEventListener('click', reveal);
        });
    }

}

// Export for use
window.CVTemplateEngine = CVTemplateEngine;
