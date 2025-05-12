// Логіка для секції "Читайте також" у статтях розділу "Цікаві факти"

// Завантажуємо список статей із articles.json
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

// Вибираємо 3 випадкові статті, виключаючи поточну
function getRelatedArticles(articles, currentUrl) {
    const otherArticles = articles.filter(article => article.url !== currentUrl);
    const shuffled = otherArticles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

// Відображаємо посилання в секції "Читайте також"
async function renderRelatedArticles() {
    const relatedList = document.getElementById('related-articles');
    if (!relatedList) return; // Виходимо, якщо елемент не знайдено

    const currentPath = window.location.pathname; // Наприклад, /facts/articles/money-facts/
    const articles = await fetchArticles();
    if (articles.length === 0) {
        relatedList.innerHTML = '<li>Немає доступних статей</li>';
        return;
    }

    const relatedArticles = getRelatedArticles(articles, currentPath);
    relatedList.innerHTML = relatedArticles.map(article => `
        <li><a href="${article.url}">${article.title}</a></li>
    `).join('');
}

// Запускаємо після завантаження сторінки
document.addEventListener('DOMContentLoaded', renderRelatedArticles);
