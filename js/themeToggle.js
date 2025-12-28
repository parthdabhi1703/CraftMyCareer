/* ENGINEERING NOTE:
   State Persistence: Removed to ensure default System Mode on open.
   The theme will default to system preference and listen for changes.
   User toggle is temporary for the session.
*/

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update icon
    function updateIcon(theme) {
        if (toggleBtn) {
            const iconSpan = toggleBtn.querySelector('.material-icons');
            if (iconSpan) {
                iconSpan.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }
    }

    // Function to apply system theme
    function applySystemTheme() {
        const theme = systemMedia.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateIcon(theme);
    }

    // Handler for system changes
    const handleSystemChange = (e) => {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateIcon(theme);
    };

    // Initialize with system theme (ignoring localStorage)
    applySystemTheme();

    // Listen for system theme changes
    systemMedia.addEventListener('change', handleSystemChange);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // User manually overrode, so stop listening to system
            systemMedia.removeEventListener('change', handleSystemChange);

            let current = document.documentElement.getAttribute('data-theme');
            let newTheme = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            // localStorage.setItem('theme', newTheme); // Disabled for default System Mode

            updateIcon(newTheme);
        });
    }
});