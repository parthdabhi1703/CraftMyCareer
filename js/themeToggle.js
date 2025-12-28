/* ENGINEERING NOTE:
   State Persistence: We use localStorage so the user's preference 
   persists across page reloads and sessions.
*/

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Load saved theme or system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (toggleBtn) {
        const iconSpan = toggleBtn.querySelector('.material-icons');
        if (iconSpan) {
            iconSpan.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }

        toggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            if (iconSpan) {
                iconSpan.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        });
    }
});