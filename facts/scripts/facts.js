// Логіка для секції "Читайте також" у статтях розділу "Цікаві факти"
// Використовує відносні шляхи, сумісні з https://www.znannia.online/

async function fetchArticles() {
    try {
        const response = await fetch('/facts/articles/articles.json');
        if (!response.ok) throw new Error('Не вдалося завантажити статті');
        return await response.json();
    } catch (error) {
        console.error('Помилка завантаження articles.json:', error);
        return [];
    }
}

function getRelatedArticles(articles, currentPath) {
    // Нормалізуємо URL для порівняння, додаючи '/' якщо потрібно
    const normalizeUrl = (url) => url.endsWith('/') ? url : `${url}/`;
    const currentUrl = normalizeUrl(currentPath);
    
    const otherArticles = articles.filter(article => {
        const articleUrl = normalizeUrl(article.url);
        return articleUrl !== currentUrl && articleUrl !== `${currentUrl}index.html/`;
    });
    
    const shuffled = otherArticles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

async function renderRelatedArticles() {
    const relatedList = document.getElementById('related-articles');
    if (!relatedList) return;

    const currentPath = window.location.pathname;
    const articles = await fetchArticles();
    if (articles.length === 0) {
        relatedList.innerHTML = '<li>Немає доступних статей</li>';
        return;
    }

    const relatedArticles = getRelatedArticles(articles, currentPath);
    relatedList.innerHTML = relatedArticles.map(article => `
        <li><a href="/${article.url}">${article.title}</a></li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderRelatedArticles);
