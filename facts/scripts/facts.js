document.addEventListener('DOMContentLoaded', () => {
    // Відстеження активності через Google Analytics
    // Кліки по посиланнях YouTube
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

    // Логіка кнопки "Поділитися"
    const shareButton = document.querySelector('.share-button');
    const sharePanel = document.querySelector('.share-panel');

    if (shareButton && sharePanel) {
        shareButton.addEventListener('click', () => {
            sharePanel.classList.toggle('active');
            gtag('event', 'click', {
                'event_category': 'Share Button',
                'event_label': 'Share Panel Toggle'
            });
        });

        // Відстеження кліків по соцмережах
        const shareLinks = sharePanel.querySelectorAll('a');
        shareLinks.forEach(link => {
            link.addEventListener('click', () => {
                gtag('event', 'share', {
                    'event_category': 'Social Share',
                    'event_label': link.getAttribute('data-network')
                });
            });
        });
    }
});
