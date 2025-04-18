const API_KEYS = ['AIzaSyArWgDJ2FXX4Lt1TlNbazOCz1P7_KYiovA'];
let currentKeyIndex = 0;
const CHANNEL_ID = 'UC0usNaN5iwML35qPxASBDWQ';
const playlistIds = {
    'Географія': 'PLOI77RmcxMp7iQywXcinPbgpl4kTXx_oV',
    'Історія': 'PLOI77RmcxMp57Hj3qFR8kv0D1rYs-MJNO',
    'Біблія': 'PLOI77RmcxMp6bsY12dqBZ9tdf-EMf6lpY',
    'Україна': 'PLOI77RmcxMp7umvhlyP8jIgvCk_9gKUFN',
    'Загальні знання': 'PLOI77RmcxMp40BcW7EImRhMEtLFieW9B7',
    'Логіка': 'PLOI77RmcxMp69eZQe-B51PXjk-hG123nE',
    'Що зайве': 'PLOI77RmcxMp6jhCedjZf7QYOscN3KuMIO',
    'Не програєш': 'PLOI77RmcxMp5FIXH2Z9OGFTEhrGQjBi_S'
};
const CACHE = { latest: 12*60*60*1000, random: 48*60*60*1000, category: 24*60*60*1000 };

const pages = {
    about: {
        title: 'Про нас - Знання для всіх',
        desc: 'Дізнайтесь більше про проєкт Знання для всіх: освітні вікторини з географії, історії, Біблії для всіх поколінь.',
        content: `
            <div class="content-text">
                <p>"Знання для всіх" – це унікальний освітній проєкт, створений для тих, хто любить перевіряти свої знання та дізнаватися нове у цікавій формі. Ми пропонуємо тести й вікторини з географії, історії, Біблії, культури України, логіки та багатьох інших тем, які захоплюють і об’єднують людей різного віку.</p>
                <p>Наш YouTube-канал – це місце, де знання стають грою, а навчання – задоволенням. З понад 20 000 підписників і сотнями тисяч переглядів щомісяця ми створюємо контент, який ідеально підходить для сімейного дозвілля, дружніх посиденьок чи просто цікавого вечора наодинці. Особливо ми пишаємося нашою аудиторією 50+, яка цінує глибину, простоту і теплу атмосферу наших відео.</p>
                <p>Приєднуйтесь до нас на <a href="https://www.youtube.com/@ЗнанняДляВсіхТак" target="_blank">YouTube</a>, щоб разом відкривати світ знань! Підписуйтесь і ставайте частиною спільноти, де кожен знайде щось для себе.</p>
            </div>`
    },
    collaboration: {
        title: 'Співпраця - Знання для всіх',
        desc: 'Співпрацюйте з Знання для всіх: вікторини з географії, історії, Біблії для аудиторії 50+. Зв’яжіться з нами!',
        content: `
            <div class="content-text">
                <p>YouTube-канал: понад 20 000 підписників, 200 000 переглядів на місяць.</p>
                <p>Аудиторія: 50+, активні користувачі з України та україномовного зарубіжжя.</p>
                <p>Формати співпраці: інтеграція в відео (оголошення, згадки), спонсорство тематичних вікторин, розміщення реклами в описі чи на сайті.</p>
                <p>Переваги: лояльна аудиторія, висока залученість, унікальний освітній контент.</p>
                <p>Зв’язок: <a href="mailto:znanniadliavsikh@gmail.com">znanniadliavsikh@gmail.com</a></p>
            </div>`
    },
    contact: {
        title: 'Контакти - Знання для всіх',
        desc: 'Зв’яжіться з нами для співпраці чи запитань. Підписуйтесь на YouTube-канал Знання для всіх!',
        content: `
            <div class="content-text">
                <p>Зв’яжіться з нами: <a href="mailto:znanniadliavsikh@gmail.com">znanniadliavsikh@gmail.com</a></p>
                <p>Підписуйтесь на наш YouTube-канал: <a href="https://www.youtube.com/@ЗнанняДляВсіхТак" target="_blank">Знання для всіх</a></p>
            </div>`
    },
    privacy: {
        title: 'Політика конфіденційності - Знання для всіх',
        desc: 'Ознайомтесь із політикою конфіденційності сайту Знання для всіх. Захист ваших даних – наш пріоритет.',
        content: `
            <div class="content-text">
                <p>Сайт "Знання для всіх" поважає вашу конфіденційність. Ми не збираємо, не зберігаємо та не обробляємо ваші персональні дані через цей сайт. Усі відео та контент надаються через платформу YouTube, яка має власну політику конфіденційності. Ми не маємо доступу до ваших особистих даних, таких як ім’я, електронна пошта чи IP-адреса.</p>
                <p>Якщо ви залишаєте коментарі чи взаємодієте з нашим контентом на YouTube, зверніть увагу, що ці дані регулюються <a href="https://policies.google.com/privacy" target="_blank">Політикою конфіденційності Google</a>. Ми не несемо відповідальності за те, як YouTube обробляє вашу інформацію.</p>
                <p>Для зв’язку з нами використовуйте email: <a href="mailto:znanniadliavsikh@gmail.com">znanniadliavsikh@gmail.com</a>. Якщо у вас є запитання щодо цієї політики, ми раді відповісти!</p>
                <p>Останнє оновлення: 11 квітня 2025 року.</p>
            </div>`
    }
};

async function fetchWithKey(url) {
    try {
        const res = await fetch(`${url}&key=${API_KEYS[currentKeyIndex]}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    } catch (e) {
        if (e.message.includes('403') && currentKeyIndex < API_KEYS.length - 1) {
            currentKeyIndex++;
            return fetchWithKey(url);
        }
        throw e;
    }
}

function renderVideos(videos, container, isLatest = false) {
    if (!container) return;
    container.innerHTML = videos?.length ? '' : '<p>Відео недоступні</p>';
    videos?.forEach(v => {
        const id = isLatest ? v.id.videoId : v.snippet.resourceId.videoId;
        const title = v.snippet.title;
        const thumb = v.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        const isNew = isLatest && Date.now() - new Date(v.snippet.publishedAt) < 7*24*60*60*1000;
        const el = document.createElement('article');
        el.className = 'video-item';
        el.innerHTML = `
            <div class="video-container">
                <img src="${thumb}" alt="${title}" data-video-id="${id}" loading="lazy">
                ${isNew ? '<span class="new">Нове</span>' : ''}
            </div>
            <h3 class="video-title" data-video-id="${id}">${title}</h3>
            <div class="video-actions">
                <button class="comment-btn">Коментар</button>
                <span class="heart${localStorage.getItem(`liked_${id}`) ? ' liked' : ''}" data-video-id="${id}">${localStorage.getItem(`liked_${id}`) ? '♥' : '♡'}</span>
                <span class="like-count">${localStorage.getItem(`likes_${id}`) || 0}</span>
                <button class="share-btn" data-video-id="${id}">Поділитися</button>
            </div>
            <div class="comment-box" style="display:none">
                <textarea placeholder="Коментар..."></textarea>
                <button class="submit-comment">OK</button>
                <div class="comment-list">${(JSON.parse(localStorage.getItem(`comments_${id}`) || '[]')).map(c => `<p>${c}</p>`).join('')}</div>
            </div>
        `;
        container.appendChild(el);
    });

    container.querySelectorAll('.video-title, img').forEach(el => {
        el.onclick = () => {
            const cont = el.closest('.video-item').querySelector('.video-container');
            cont.innerHTML = `<iframe src="https://www.youtube.com/embed/${el.dataset.videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
        };
    });

    container.querySelectorAll('.comment-btn').forEach(btn => btn.onclick = () => {
        const box = btn.parentElement.nextElementSibling;
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });

    container.querySelectorAll('.submit-comment').forEach(btn => btn.onclick = () => {
        const ta = btn.previousElementSibling;
        const id = btn.closest('.video-item').querySelector('.heart').dataset.videoId;
        if (ta.value.trim()) {
            const comments = JSON.parse(localStorage.getItem(`comments_${id}`) || '[]');
            comments.push(ta.value.trim());
            localStorage.setItem(`comments_${id}`, JSON.stringify(comments));
            btn.nextElementSibling.innerHTML += `<p>${ta.value.trim()}</p>`;
            ta.value = '';
        }
    });

    container.querySelectorAll('.heart').forEach(h => {
        h.onclick = () => {
            const id = h.dataset.videoId;
            let likes = parseInt(localStorage.getItem(`likes_${id}`) || 0);
            if (!localStorage.getItem(`liked_${id}`)) {
                likes++;
                h.classList.add('liked');
                h.innerHTML = '♥';
                localStorage.setItem(`liked_${id}`, 'true');
            } else {
                likes--;
                h.classList.remove('liked');
                h.innerHTML = '♡';
                localStorage.removeItem(`liked_${id}`);
            }
            localStorage.setItem(`likes_${id}`, likes);
            h.nextElementSibling.textContent = likes;
        };
    });

    container.querySelectorAll('.share-btn').forEach(btn => btn.onclick = () => {
        const url = `https://www.youtube.com/watch?v=${btn.dataset.videoId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Вікторина від Знання для всіх',
                text: 'Перегляньте цю цікаву вікторину!',
                url
            }).catch(() => alert('Помилка поширення'));
        } else {
            navigator.clipboard.writeText(url).then(() => alert('Посилання скопійовано!'));
        }
    });
}

async function fetchLatestVideos() {
    const div = document.getElementById('latest-videos');
    if (!div) return;
    const key = 'latestVideos';
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const time = localStorage.getItem(`${key}Time`);

    if (cached && time && now - time < CACHE.latest) return renderVideos(JSON.parse(cached), div, true);

    try {
        const data = await fetchWithKey(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=8&order=date&type=video`);
        const videos = data.items.filter(v => v.id?.videoId && v.snippet?.title);
        div.innerHTML = videos.length ? '' : '<p>Відео недоступні</p>';
        localStorage.setItem(key, JSON.stringify(videos));
        localStorage.setItem(`${key}Time`, now);
        renderVideos(videos, div, true);
    } catch (e) {
        div.innerHTML = '<p>Помилка</p>';
    }
}

async function fetchRandomVideos() {
    const div = document.getElementById('random-videos');
    if (!div) return;
    const key = 'randomVideos';
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const time = localStorage.getItem(`${key}Time`);

    if (cached && time && now - time < CACHE.random) return renderVideos(JSON.parse(cached), div);

    try {
        const videos = [];
        for (const id of Object.values(playlistIds)) {
            const data = await fetchWithKey(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=10`);
            videos.push(...data.items.filter(v => v.snippet?.resourceId?.videoId));
        }
        const shuffled = videos.sort(() => Math.random() - 0.5).slice(0, 8);
        div.innerHTML = shuffled.length ? '' : '<p>Відео недоступні</p>';
        localStorage.setItem(key, JSON.stringify(shuffled));
        localStorage.setItem(`${key}Time`, now);
        renderVideos(shuffled, div);
    } catch (e) {
        div.innerHTML = '<p>Помилка</p>';
    }
}

async function fetchSubscribers() {
    const div = document.getElementById('subscribers');
    if (!div) return;
    const key = 'subscribers';
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const time = localStorage.getItem(`${key}Time`);

    if (cached && time && now - time < CACHE.random) return div.innerHTML = `Нас: <b>${cached}</b>`;

    try {
        const data = await fetchWithKey(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}`);
        const count = data.items[0].statistics.subscriberCount;
        localStorage.setItem(key, count);
        localStorage.setItem(`${key}Time`, now);
        div.innerHTML = `Нас: <b>${count}</b>`;
    } catch (e) {
        div.innerHTML = '<p>Н/Д</p>';
    }
}

async function fetchCategoryVideos() {
    const div = document.getElementById('category-videos');
    if (!div) return;
    const category = new URLSearchParams(window.location.search).get('category');
    const playlistId = playlistIds[category];
    const key = `cat_${category}`;
    const now = Date.now();
    const cached = localStorage.getItem(key);
    const time = localStorage.getItem(`${key}Time`);

    if (cached && time && now - time < CACHE.category) return renderVideos(JSON.parse(cached), div);

    try {
        if (!playlistId) return div.innerHTML = '<p>Категорія не знайдена</p>';
        const title = document.getElementById('category-title');
        if (title) title.textContent = category || 'Вікторини';
        document.title = `Вікторини: ${category || 'Всі'}`;
        document.getElementById('meta-desc').content = `Вікторини з ${category || 'різних тем'} для всієї родини!`;
        const data = await fetchWithKey(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10`);
        const videos = data.items.filter(v => v.snippet?.resourceId?.videoId);
        div.innerHTML = videos.length ? '' : '<p>Відео недоступні</p>';
        localStorage.setItem(key, JSON.stringify(videos));
        localStorage.setItem(`${key}Time`, now);
        renderVideos(videos, div);
    } catch (e) {
        div.innerHTML = '<p>Помилка</p>';
    }
}

function renderPage() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    const category = params.get('category');
    const main = document.getElementById('main-content');
    const title = document.getElementById('meta-title');
    const desc = document.getElementById('meta-desc');

    if (category) {
        title.textContent = `Вікторини: ${category}`;
        desc.content = `Вікторини з ${category} для всієї родини!`;
        main.innerHTML = `
            <h2 id="category-title">${category}</h2>
            <div id="category-videos" class="video-grid"></div>
        `;
        fetchCategoryVideos();
    } else if (pages[page]) {
        title.textContent = pages[page].title;
        desc.content = pages[page].desc;
        main.innerHTML = `<h2>${page === 'about' ? 'Про нас' : page === 'collaboration' ? 'Співпраця' : page === 'contact' ? 'Контакти' : 'Політика конфіденційності'}</h2>${pages[page].content}`;
    } else {
        title.textContent = 'Знання для всіх';
        desc.content = 'Вікторини з географії, історії, Біблії для всієї родини!';
        main.innerHTML = `
            <section>
                <h2>Останні відео</h2>
                <div id="latest-videos" class="video-grid"></div>
            </section>
            <section>
                <h2>Випадкові відео</h2>
                <div id="random-videos" class="video-grid"></div>
            </section>
        `;
        fetchLatestVideos();
        fetchRandomVideos();
    }
    fetchSubscribers();
}

document.addEventListener('DOMContentLoaded', () => {
    renderPage();
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.onclick = e => {
            if (!btn.href) e.preventDefault(), window.location.href = `/?category=${encodeURIComponent(btn.textContent)}`;
        };
    });
    document.getElementById('categories-btn').onclick = () => {
        const list = document.getElementById('categories-list');
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    };
    setInterval(() => {
        localStorage.removeItem('latestVideos');
        localStorage.removeItem('latestVideosTime');
        fetchLatestVideos();
    }, CACHE.latest);
});
