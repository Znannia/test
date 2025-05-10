const API_KEYS = ["AIzaSyAZRW_d8xXbCSudzTPPQ7pUqcLmH26MeuE"],
      CHANNEL_ID = "UC0usNaN5iwML35qPxASBDWQ";
let currentKeyIndex = 0;

const playlistIds = {
  "Географія": "PLOI77RmcxMp7iQywXcinPbgpl4kTXx_oV",
  "Історія": "PLOI77RmcxMp57Hj3qFR8kv0D1rYs-MJNO",
  "Біблія": "PLOI77RmcxMp6bsY12dqBZ9tdf-EMf6lpY",
  "Україна": "PLOI77RmcxMp7umvhlyP8jIgvCk_9gKUFN",
  "Загальні знання": "PLOI77RmcxMp40BcW7EImRhMEtLFieW9B7",
  "Логіка": "PLOI77RmcxMp69eZQe-B51PXjk-hG123nE",
  "Що зайве": "PLOI77RmcxMp6jhCedjZf7QYOscN3KuMIO",
  "Не програєш": "PLOI77RmcxMp5FIXH2Z9OGFTEhrGQjBi_S"
};

const categoryDescriptions = {
  "Загальні знання": "Перевірте свою ерудицію з тестами на загальні знання! Від історії до науки — ці вікторини ідеальні для дітей і дорослих, щоб весело провести час і дізнатися щось нове разом із родиною. Пройдіть тест прямо зараз!",
  "Біблія": "Зануртеся у світ Святого Письма з вікторинами про Біблію! Перевірте, як добре ви знаєте біблійні сюжети та персонажів разом із сім’єю. Пройдіть тест і поглибте свої знання!",
  "Не програєш": "Готові до сміху та веселощів? Ці вікторини з несподіваними питаннями ідеальні для гри з друзями чи родиною. Дізнайтесь цікаве один про одного та пройдіть тест разом!",
  "Що зайве": "Потренуйте мозок із тестами на пошук зайвого чи подібного разом із родиною! Ці завдання покращують концентрацію та увагу. Прийміть виклик і перевірте свої навички!",
  "Логіка": "Перевірте свою кмітливість із тестами на логіку разом із сім’єю! Ці загадки — чудовий спосіб потренувати розум і весело провести час. Спробуйте розв’язати всі завдання!",
  "Історія": "Досліджуйте минуле з вікторинами про історію, міфи та легенди разом із родиною! Перевірте знання про давні цивілізації й таємничі сюжети. Пройдіть тест і дізнайтесь більше!",
  "Географія": "Мандруйте світом із географічними тестами разом із сім’єю! Від країн до природних чудес — ці вікторини підходять усім, хто любить географію. Перевірте свої знання вже зараз!",
  "Україна": "Поглибте знання про Україну з тестами про її історію та культуру разом із родиною! Дізнайтесь більше про традиції, події та видатних постатей. Пройдіть вікторину прямо зараз!"
};

async function fetchWithKey(e) {
  try {
    const t = await fetch(`${e}&key=${API_KEYS[currentKeyIndex]}`);
    if (!t.ok && (t.status === 403 || t.status === 429)) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      return fetchWithKey(e);
    }
    return t;
  } catch (t) {
    throw t;
  }
}

async function fetchSubscribers() {
  const e = document.getElementById("subscribers");
  if (!e) return;
  const t = "subscribersCount", a = "subscribersTime", n = 864e5, s = new Date, i = s.getTime(), r = s.getHours() === 17;
  const c = localStorage.getItem(t), o = localStorage.getItem(a);
  if (c && o && i - o < n && !r) {
    e.innerHTML = `Нас уже понад<br><span class="subscribers-count">${c}</span>`;
    return;
  }
  try {
    const n = await fetchWithKey(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}`);
    if (!n.ok) throw new Error("Не вдалося отримати дані про підписників");
    const s = await n.json(), r = s.items[0].statistics.subscriberCount;
    localStorage.setItem(t, r);
    localStorage.setItem(a, i.toString());
    e.innerHTML = `Нас уже понад<br><span class="subscribers-count">${r}</span>`;
  } catch (t) {
    e.innerHTML = "Помилка завантаження підписників";
  }
}

async function filterNonShorts(e, t) {
  if (!e.length) return [];
  if (t === "Логіка") return e;
  try {
    const a = await fetchWithKey(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${e.join(",")}`);
    if (!a.ok) return e;
    const n = await a.json(), s = [];
    n.items.forEach((t, a) => {
      const n = t.contentDetails.duration, i = (n.match(/PT(\d+H)?(\d+M)?(\d+S)?/) || [0, 0, 0, 0]).slice(1).map(e => parseInt(e) || 0), r = i[0] * 3600 + i[1] * 60 + i[2];
      if (r >= 60) s.push(e[a]);
    });
    return s;
  } catch (a) {
    return e;
  }
}

function cleanDescription(e) {
  return e.replace(/#[\wА-Яа-я]+/g, "").replace(/Вітаємо на каналі "Знання для всіх"/gi, "").trim();
}

async function renderVideos(e, t, a = false) {
  t.innerHTML = "";
  if (e.length === 0) {
    t.innerHTML = "<p>Немає доступних відео. Спробуйте пізніше.</p>";
    return;
  }
  const n = document.createElement("script");
  n.type = "application/ld+json";
  const s = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": a ? "Вікторини та тести для всієї родини - Знання для всіх" : `Вікторини з ${t.dataset.category || "Категорії"} - Знання для всіх`,
    "description": a ? "Тести та вікторини з географії, історії, Біблії, України та логіки для родини та друзів. Пізнавайте світ через розваги!" : categoryDescriptions[t.dataset.category] || "Цікаві тести та вікторини для всієї родини!",
    "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
    "uploadDate": "2025-05-01",
    "contentUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
  };
  if (e[0]) {
    const i = a ? e[0].id.videoId : e[0].snippet.resourceId.videoId;
    s.thumbnailUrl = `https://img.youtube.com/vi/${i}/maxresdefault.jpg`;
    s.contentUrl = `https://www.youtube.com/watch?v=${i}`;
    n.text = JSON.stringify(s);
    document.head.appendChild(n);
  }
  for (const i of e) {
    const r = a ? i.id.videoId : i.snippet.resourceId.videoId, c = i.snippet.title, o = `https://img.youtube.com/vi/${r}/maxresdefault.jpg`;
    let l = "";
    try {
      const e = await fetchWithKey(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${r}`);
      if (e.ok) {
        const t = await e.json();
        l = cleanDescription(t.items[0].snippet.description);
      }
    } catch (e) {}
    const d = document.createElement("div");
    d.className = "video-item";
    d.innerHTML = `
      <div class="video-container">
        <img src="${o}" alt="${c}" class="thumbnail" data-video-id="${r}" loading="lazy">
      </div>
      <p class="video-title" data-video-id="${r}">${c}${a ? ' <span class="new">Нове</span>' : ""}</p>
      <div class="video-actions">
        <button class="comment-btn">Коментар</button>
        <div class="like-container">
          <span class="heart${localStorage.getItem(`liked_${r}`) ? " liked" : ""}" data-video-id="${r}">${localStorage.getItem(`liked_${r}`) ? "♥" : "♡"}</span>
          <span class="like-count" data-video-id="${r}">${localStorage.getItem(`likes_${r}`) || 0}</span>
        </div>
        <button class="more-btn" data-video-id="${r}">Більше</button>
      </div>
      <div class="comment-box" style="display:none">
        <textarea placeholder="Ваш коментар..." rows="4"></textarea>
        <button class="submit-comment">Відправити</button>
        <div class="comment-list"></div>
      </div>
      <div class="description-box" style="display:none" data-video-id="${r}">
        <p>${l || "Опис недоступний"}</p>
      </div>`;
    t.appendChild(d);
    const m = d.querySelector(".comment-list"), g = JSON.parse(localStorage.getItem(`comments_${r}`) || "[]");
    g.forEach(e => {
      const t = document.createElement("p");
      t.textContent = e;
      m.appendChild(t);
    });
  }
  t.addEventListener("click", e => {
    const a = e.target;
    if (a.matches(".video-title,.thumbnail")) {
      const n = a.getAttribute("data-video-id"), s = a.closest(".video-item").querySelector(".video-container"), i = s.dataset.playerActive === "true";
      if (!i) {
        s.innerHTML = `<iframe src="https://www.youtube.com/embed/${n}?rel=0&autoplay=1" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
        s.dataset.playerActive = "true";
      }
    } else if (a.matches(".comment-btn")) {
      const e = a.parentElement.nextElementSibling;
      e.style.display = e.style.display === "none" ? "block" : "none";
    } else if (a.matches(".submit-comment")) {
      const e = a.previousElementSibling, n = a.closest(".video-item").querySelector(".heart").getAttribute("data-video-id"), s = a.nextElementSibling;
      if (e.value.trim()) {
        const t = document.createElement("p");
        t.textContent = e.value.trim();
        s.appendChild(t);
        const a = JSON.parse(localStorage.getItem(`comments_${n}`) || "[]");
        a.push(e.value.trim());
        localStorage.setItem(`comments_${n}`, JSON.stringify(a));
        e.value = "";
      }
    } else if (a.matches(".heart")) {
      const e = a.getAttribute("data-video-id");
      let t = parseInt(localStorage.getItem(`likes_${e}`) || 0);
      if (localStorage.getItem(`liked_${e}`)) {
        t -= 1;
        a.classList.remove("liked");
        a.innerHTML = "♡";
        localStorage.removeItem(`liked_${e}`);
      } else {
        t += 1;
        a.classList.add("liked");
        a.innerHTML = "♥";
        localStorage.setItem(`liked_${e}`, "true");
      }
      localStorage.setItem(`likes_${e}`, t);
      a.nextElementSibling.textContent = t;
    } else if (a.matches(".more-btn")) {
      const e = a.getAttribute("data-video-id"), t = a.parentElement.nextElementSibling.nextElementSibling;
      t.style.display = t.style.display === "none" ? "block" : "none";
      a.textContent = t.style.display === "none" ? "Більше" : "Менше";
    }
  });
}

// Оновлено для обмеження кількості відео
const VIDEOS_PER_PAGE = 6;

async function fetchLatestVideos() {
  const e = document.getElementById("latest-videos");
  if (!e) return;
  const t = "latestVideos", a = "latestVideosTime", n = 864e5;
  e.classList.add("loading");
  const s = localStorage.getItem(t), i = localStorage.getItem(a), r = Date.now();
  if (s && i && r - i < n) {
    let videos = JSON.parse(s).filter(e => e.id && e.id.videoId && e.snippet && e.snippet.title !== "Private video" && e.snippet.title !== "Deleted video");
    videos = videos.slice(0, VIDEOS_PER_PAGE);
    await renderVideos(videos, e, true);
    localStorage.setItem(t, JSON.stringify(videos));
    e.classList.remove("loading");
    return;
  }
  try {
    const n = await fetchWithKey(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNELভ

System: Вибачте, відповідь обірвалася через технічне обмеження. Я завершу аналіз, внесу всі необхідні зміни до файлів, врахую ваші побажання (опис над футером, акцент на розваги, розділ "Цікаві факти", збереження гедера/футера) і поверну оновлені та нові файли одним повідомленням. Я також перевірю кожен файл на валідність, сумісність із AdSense, SEO, UX і доступність.

---

### Завершення аналізу та внесення змін

#### Ваші побажання:
1. **Опис сайту**:
   - Перемістити над футер, уникати згадок НМТ.
   - Ак
