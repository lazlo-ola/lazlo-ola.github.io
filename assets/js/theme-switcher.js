/**
 * Theme Switcher JavaScript
 * Handles toggling between light and dark themes
 */
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('cv-theme') || 'light';
        this.init();
    }

    init() {
        this.createToggleButton();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = `
            <i class="bi ${this.getThemeIcon()}"></i>
            <span>${this.getThemeLabel()}</span>
        `;
        document.body.appendChild(button);
        this.toggleButton = button;
    }

    getThemeIcon() {
        return this.currentTheme === 'light' ? 'bi-moon' : 'bi-sun';
    }

    getThemeLabel() {
        return this.currentTheme === 'light' ? 'Dark' : 'Light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('cv-theme', theme);
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (this.toggleButton) {
            const icon = this.toggleButton.querySelector('i');
            const label = this.toggleButton.querySelector('span');
            
            icon.className = `bi ${this.getThemeIcon()}`;
            label.textContent = this.getThemeLabel();
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Emit custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }

    bindEvents() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('cv-theme')) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(systemTheme);
                }
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});

// Export for use
window.ThemeSwitcher = ThemeSwitcher;
