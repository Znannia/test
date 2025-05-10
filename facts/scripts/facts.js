document.addEventListener('DOMContentLoaded', () => {
    // Відстеження кліків по посиланнях YouTube
    const youtubeLinks = document.querySelectorAll('a[href*="youtube.com"]');
    youtubeLinks.forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'click', {
                'event_category': 'YouTube Link',
                'event_label': link.href
            });
        });
    });

    // Прокручування до секцій
    const sections = document.querySelectorAll('.article-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'view', {
                    'event_category': 'Article Section',
                    'event_label': entry.target.querySelector('h3').textContent
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Відстеження кліків по соцмережах
    const shareLinks = document.querySelectorAll('.share-panel a');
    shareLinks.forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'share', {
                'event_category': 'Social Share',
                'event_label': link.getAttribute('data-network')
            });
        });
    });

    // Відстеження кліків по кнопках навігації
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            gtag('event', 'click', {
                'event_category': 'Navigation Button',
                'event_label': button.textContent
            });
        });
    });
});
