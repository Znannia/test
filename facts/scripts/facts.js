document.addEventListener('DOMContentLoaded', () => {
    const relatedArticlesContainer = document.getElementById('related-articles');
    if (!relatedArticlesContainer) {
        console.warn('Елемент #related-articles не знайдено на сторінці');
        return;
    }

    // Отримуємо поточний шлях сторінки
    const currentPath = window.location.pathname
        .replace(/\/index\.html$/, '') // Видаляємо index.html
        .replace(/\/$/, ''); // Видаляємо завершальний слеш

    console.debug('Поточний шлях:', currentPath);

    // Завантажуємо articles.json
    fetch('../../../facts/articles/articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Не вдалося завантажити articles.json: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(articles => {
            console.debug('Завантажені статті:', articles);

            // Фільтруємо статті, виключаючи поточну
            const filteredArticles = articles.filter(article => {
                const articlePath = `/${article.url}`
                    .replace(/\/index\.html$/, '') // Видаляємо index.html
                    .replace(/\/$/, ''); // Видаляємо завершальний слеш
                console.debug(`Порівняння: ${articlePath} === ${currentPath}`);
                return articlePath !== currentPath;
            });

            console.debug('Відфільтровані статті:', filteredArticles);

            // Якщо немає доступних статей
            if (filteredArticles.length === 0) {
                relatedArticlesContainer.innerHTML = '<li>Немає доступних статей</li>';
                console.warn('Немає доступних статей для відображення');
                return;
            }

            // Перемішуємо статті
            const shuffledArticles = filteredArticles.sort(() => Math.random() - 0.5);

            // Вибираємо до 3 статей
            const selectedArticles = shuffledArticles.slice(0, Math.min(3, shuffledArticles.length));

            console.debug('Вибрані статті:', selectedArticles);

            // Формуємо HTML
            relatedArticlesContainer.innerHTML = selectedArticles
                .map(article => {
                    const articleUrl = `/${article.url}`.replace(/\/$/, '') + '/';
                    return `<li><a href="${articleUrl}">${article.title}</a></li>`;
                })
                .join('');
        })
        .catch(error => {
            console.error('Помилка завантаження статей:', error);
            relatedArticlesContainer.innerHTML = '<li>Немає доступних статей</li>';
        });
});
