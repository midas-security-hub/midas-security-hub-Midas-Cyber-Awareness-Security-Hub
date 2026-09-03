/**
 * Reusable Components Loader for Midas Cyber Awareness & Security Hub
 * Usage: Include <script src="js/components.js"></script> in any web page and add
 * <div id="site-header"></div> at the top and <div id="site-footer"></div> at the bottom.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Load Header
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(err => {
                console.warn('Could not fetch components/header.html via HTTP, falling back to embedded component.', err);
            });
    }

    // Load Footer
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(err => {
                console.warn('Could not fetch components/footer.html via HTTP, falling back to embedded component.', err);
            });
    }
});
