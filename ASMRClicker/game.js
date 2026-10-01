(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const SAVE_KEY = "asmrClick_v3";

  const OBJECTS = {
    key: { name: "Мягкая клавиша", icon: "assets/icons/key.png", symbol: "ПРОБЕЛ", sound: "keyboard", price: 0, physics: "hard", img: "assets/key.png" },
    soft: { name: "Плюшевая подушка", icon: "assets/icons/soft.png", symbol: "♡", sound: "soft", price: 5000, physics: "soft", img: "assets/soft.png" },
    bubble: { name: "Мыльный пузырь", icon: "assets/icons/bubble.png", symbol: "○", sound: "bubble", price: 25000, physics: "soft", img: "assets/bubble.png" },
    wood: { name: "Деревянный кубик", icon: "assets/icons/wood.png", symbol: "■", sound: "wood", price: 80000, physics: "hard", img: "assets/wood.png" },
    glass: { name: "Стеклянная сфера", icon: "assets/icons/glass.png", symbol: "◇", sound: "glass", price: 200000, physics: "hard", img: "assets/glass.png" },
    slime: { name: "Зелёный слайм", icon: "assets/icons/slime.png", symbol: "◉", sound: "slime", price: 450000, physics: "jelly", img: "assets/slime.png" },
    jelly: { name: "Желе", icon: "assets/icons/jelly.png", symbol: "●", sound: "jelly", price: 850000, physics: "jelly", img: "assets/jelly.png" },
    crystal: { name: "Кристалл", icon: "assets/icons/crystal.png", symbol: "✦", sound: "crystal", price: 1500000, physics: "hard", img: "assets/crystal.png" }
  };

  const THEMES = {
    rose: { name: "Розовый закат", icon: "assets/icons/theme_rose.png", price: 0 },
    night: { name: "Ночная комната", icon: "assets/icons/theme_night.png", price: 15000 },
    mint: { name: "Мятный сад", icon: "assets/icons/theme_mint.png", price: 60000 },
    sand: { name: "Тёплый песок", icon: "assets/icons/theme_sand.png", price: 250000 },
    sky: { name: "Голубое небо", icon: "assets/icons/theme_sky.png", price: 800000 }
  };

  const SOUNDS = {
    keyboard: { name: "Механическая", icon: "assets/icons/key.png", desc: "Чёткий сочный клик", price: 0 },
    soft: { name: "Мягкий хлопок", icon: "assets/icons/soft.png", desc: "Нежный и округлый", price: 8000 },
    bubble: { name: "Пузырьки", icon: "assets/icons/bubble.png", desc: "Лопанье и хруст", price: 30000 },
    wood: { name: "Дерево", icon: "assets/icons/wood.png", desc: "Тёплый щелчок", price: 100000 },
    glass: { name: "Стекло", icon: "assets/icons/glass.png", desc: "Чистый звон", price: 250000 },
    slime: { name: "Слайм", icon: "assets/icons/slime.png", desc: "Тягучий и влажный", price: 500000 },
    jelly: { name: "Желе", icon: "assets/icons/jelly.png", desc: "Мягкое подрагивание", price: 900000 },
    crystal: { name: "Кристалл", icon: "assets/icons/crystal.png", desc: "Магический резонанс", price: 1500000 }
  };

  function soundKey(id) { return "snd_" + id; }
  function ownsSound(id) {
    if (id === "keyboard") return true;
    return save.owned.includes(soundKey(id));
  }

  const UPGRADES = {
    power: { name: "Сила клика", icon: "assets/icons/power.png", desc: "+1 монета за каждый клик", base: 15 },
    critical: { name: "Крит. шанс", icon: "assets/icons/crit.png", desc: "Шанс получить ×2", base: 35 },
    auto: { name: "Автоклик", icon: "assets/icons/auto.png", desc: "Сам кликает за тебя", base: 500 }
  };

  const WHEEL = [
    { id: "plant", label: "Растение", type: "decor", weight: 1 },
    { id: "plant2", label: "Цветок", type: "decor", weight: 1 },
    { id: "chair", label: "Кресло", type: "decor", weight: 1 },
    { id: "shelf", label: "Полка", type: "decor", weight: 1 },
    { id: "frame", label: "Рамка", type: "decor", weight: 1 },
    { id: "books", label: "Книги", type: "books", weight: 1 },
    { id: "heart", label: "Сердечко", type: "decor", weight: 1 },
    { id: "candle", label: "Свеча", type: "decor", weight: 1 },
    { id: "lamp", label: "Лампа", type: "decor", weight: 1 },
    { id: "rug", label: "Коврик", type: "decor", weight: 1 },
    { id: "empty", label: "Пусто", type: "empty", weight: 1 },
    { id: "empty2", label: "Пусто", type: "empty", weight: 1 }
  ];
  const WHEEL_N = WHEEL.length;
  const WHEEL_STEP = 360 / WHEEL_N;

  const DECORS = {
    rug: { name: "Коврик", img: "assets/decor/rug.png", w: 42 },
    chair: { name: "Кресло", img: "assets/decor/chair.png", w: 28 },
    plant: { name: "Растение", img: "assets/decor/plant.png", w: 22 },
    plant2: { name: "Цветок", img: "assets/decor/plant2.png", w: 20 },
    lamp: { name: "Лампа", img: "assets/decor/lamp.png", w: 16 },
    candle: { name: "Свеча", img: "assets/decor/candle.png", w: 10 },
    heart: { name: "Сердечко", img: "assets/decor/heart.png", w: 12 },
    shelf: { name: "Полка", img: "assets/decor/shelf.png", w: 36 },
    frame: { name: "Рамка", img: "assets/decor/frame.png", w: 18 },
    book1: { name: "Книга 1", img: "assets/decor/book1.png", w: 8 },
    book2: { name: "Книга 2", img: "assets/decor/book2.png", w: 7 },
    book3: { name: "Книга 3", img: "assets/decor/book3.png", w: 6 },
    book4: { name: "Книга 4", img: "assets/decor/book4.png", w: 6 }
  };

  const DEFAULT_PLACE = {
    rug: { x: 50, y: 82, rot: 0, z: 20, scale: 1 },
    chair: { x: 82, y: 68, rot: 0, z: 35, scale: 1 },
    plant: { x: 14, y: 70, rot: 0, z: 35, scale: 1 },
    plant2: { x: 22, y: 62, rot: 0, z: 35, scale: 1 },
    lamp: { x: 16, y: 42, rot: 0, z: 40, scale: 1 },
    candle: { x: 90, y: 58, rot: 0, z: 30, scale: 1 },
    heart: { x: 84, y: 22, rot: 0, z: 60, scale: 1 },
    shelf: { x: 50, y: 18, rot: 0, z: 25, scale: 1 },
    frame: { x: 72, y: 28, rot: 0, z: 30, scale: 1 },
    book1: { x: 44, y: 16, rot: 0, z: 36, scale: 1 },
    book2: { x: 50, y: 16, rot: 0, z: 36, scale: 1 },
    book3: { x: 55, y: 16, rot: 0, z: 36, scale: 1 },
    book4: { x: 60, y: 16, rot: 0, z: 36, scale: 1 }
  };

  const defaultSave = () => ({
    coins: 0,
    clickPower: 1,
    critical: 0,
    comboBonus: 0,
    totalClicks: 0,
    combo: 0,
    lastClick: 0,
    levels: { power: 0, critical: 0, auto: 0 },
    activeDecor: [],
    decorPlacements: {},
    tokens: 0,
    giftsClaimed: 0,
    nextGiftAt: 0,
    owned: ["key", "rose"],
    object: "key",
    sound: "keyboard",
    theme: "rose",
    volume: 75,
    muted: false,
    vibrate: true,
    showFloat: true,
    showParticles: true,
    x2Until: 0,
    comboBoostUntil: 0
  });

  let save = Object.assign(defaultSave(), JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"));
  if (!save.levels) save.levels = defaultSave().levels;
  ["power", "critical", "auto"].forEach(k => {
    if (save.levels[k] === undefined) save.levels[k] = 0;
  });
  if (!Array.isArray(save.activeDecor)) save.activeDecor = [];
  save.activeDecor = save.activeDecor.filter(id => id !== "star" && DECORS[id]);

  if (!save.decorPlacements || typeof save.decorPlacements !== "object") save.decorPlacements = {};
  (save.activeDecor || []).forEach(id => {
    if (!save.decorPlacements[id] && DEFAULT_PLACE[id]) {
      save.decorPlacements[id] = Object.assign({}, DEFAULT_PLACE[id]);
    }
  });
  save.owned = (save.owned || []).filter(id => id !== "decor_star" && id !== "star");
  if (save.tokens === undefined) save.tokens = 0;

  (function migrateSounds() {
    const soundIds = Object.keys(SOUNDS);
    const objIds = Object.keys(OBJECTS);
    soundIds.forEach(id => {
      if (id === "keyboard") return;
      if (save.owned.includes("snd_" + id)) return;
    });
    if (!save.owned.includes("key")) save.owned.push("key");
    if (!save.owned.includes("rose")) save.owned.push("rose");
  })();

  if (save.sound && !ownsSound(save.sound)) save.sound = "keyboard";
  if (save.giftsClaimed === undefined) save.giftsClaimed = 0;
  if (!save.nextGiftAt) save.nextGiftAt = Date.now() + getGiftDelayMs();

  let currentPanel = "upgrades";

  function persist() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function fmt(n) {
    n = Math.floor(n);
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function toast(msg, ms = 1600) {
    const t = $("toast");
    if (/<img |<span /i.test(msg)) t.innerHTML = msg;
    else t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.add("hidden"), ms);
  }
  const ICO = {
    token: '<img src="assets/icons/token.png" alt="" class="toast-ico">',
    gift: '<img src="assets/icons/gift.png" alt="" class="toast-ico">',
    coin: '<img src="assets/icons/coin.png" alt="" class="toast-ico">',
    lock: '<img src="assets/icons/lock.png" alt="" class="toast-ico">'
  };

  const SOUND_FILES = {
    keyboard: "sounds/key.mp3",
    soft: "sounds/soft.mp3",
    bubble: "sounds/bubble.mp3",
    wood: "sounds/wood.wav",
    glass: "sounds/glass.mp3",
    slime: "sounds/slime.wav",
    jelly: "sounds/jelly.wav",
    crystal: "sounds/crystal.wav"
  };

  let audioCtx = null;
  const soundBuffers = {};

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => { });
    return audioCtx;
  }

  function preloadSounds() {
    const ctx = getAudioCtx();
    Object.keys(SOUND_FILES).forEach(type => {
      if (soundBuffers[type]) return;
      fetch(SOUND_FILES[type])
        .then(r => r.arrayBuffer())
        .then(buf => ctx.decodeAudioData(buf))
        .then(decoded => { soundBuffers[type] = decoded; })
        .catch(() => { });
    });
  }

  function playSound(type) {
    if (save.muted || save.volume <= 0) return;
    const key = type || save.sound || "keyboard";
    const ctx = getAudioCtx();
    const buffer = soundBuffers[key] || soundBuffers.keyboard;
    if (!buffer) {
      try {
        const a = new Audio(SOUND_FILES[key] || SOUND_FILES.keyboard);
        a.volume = Math.min(1, (save.volume || 100) / 100);
        a.play().catch(() => { });
      } catch (e) { }
      preloadSounds();
      return;
    }
    try {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = Math.min(1, Math.max(0, (save.volume || 100) / 100));
      src.buffer = buffer;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    } catch (e) { }
  }

  function updateUI() {
    $("coins").textContent = fmt(save.coins);
    $("clickPower").textContent = save.clickPower;
    if ($("tokens")) $("tokens").textContent = save.tokens;
    $("totalClicks").textContent = fmt(save.totalClicks);

    const obj = OBJECTS[save.object] || OBJECTS.key;
    $("objectName").textContent = obj.name;
    $("clickSymbol").textContent = obj.symbol;
    $("clickButton").className = "clicker skin-" + save.object;

    document.body.className = "theme-" + (save.theme || "rose");

    $("volRange").value = save.volume;
    $("volLabel").textContent = save.volume + "%";
    setSwitch("swSound", !save.muted);
    setSwitch("swVib", save.vibrate);
    setSwitch("swFloat", save.showFloat);
    setSwitch("swPart", save.showParticles);

    updateAdButtons();
    renderDecor();
  }

  function setSwitch(id, on) {
    $(id).classList.toggle("on", on);
  }

  function upgradePrice(key) {
    const base = UPGRADES[key].base;
    const lvl = save.levels[key] || 0;
    return Math.min(Math.floor(base * Math.pow(1.55, lvl)), 999999);
  }

  function renderPanel(panel) {
    currentPanel = panel;
    const body = $("sheetBody");
    const titles = { upgrades: "Улучшения", objects: "Предметы", depalka: "Колесо", themes: "Темы", sounds: "Звуки" };
    $("sheetTitle").textContent = titles[panel] || "Магазин";
    body.innerHTML = "";

    if (panel === "upgrades") {
      Object.keys(UPGRADES).forEach(key => {
        const u = UPGRADES[key];
        const lvl = save.levels[key] || 0;
        const price = upgradePrice(key);
        const card = document.createElement("button");
        card.className = "shop-card";
        card.innerHTML = `
                <div class="shop-ico"><img src="${u.icon}" alt=""></div>
                <div class="shop-info">
                    <b>${u.name}</b>
                    <small>${u.desc} · Ур. ${lvl}</small>
                </div>
                <span class="shop-price"><img class="lock-ico" src="assets/icons/coin.png" alt=""> ${fmt(price)}</span>
            `;
        card.addEventListener("click", () => buyUpgrade(key));
        body.appendChild(card);
      });
    }

    if (panel === "objects") {
      Object.keys(OBJECTS).forEach(id => {
        const o = OBJECTS[id];
        const owned = save.owned.includes(id);
        const selected = save.object === id;
        const card = document.createElement("button");
        card.className = "shop-card" + (selected ? " selected" : "") + (owned ? "" : " locked");
        const ico = owned
          ? `<div class="shop-ico img-preview" style="background-image:url('${o.img}')"></div>`
          : `<div class="shop-ico locked-ico"><img src="assets/icons/lock.png" alt=""></div>`;
        card.innerHTML = `
                ${ico}
                <div class="shop-info">
                    <b>${owned ? o.name : "???"}</b>
                    <small>${owned ? "Нажми, чтобы выбрать" : "Купи, чтобы открыть"}</small>
                </div>
                <span class="shop-price ${owned ? "owned" : ""}">${owned ? "✓" : `<img class="lock-ico" src="assets/icons/coin.png" alt=""> ${fmt(o.price)}`}</span>
            `;
        card.addEventListener("click", () => buyObject(id));
        body.appendChild(card);
      });
    }

    if (panel === "depalka") {
      body.innerHTML = `
            <p class="depalka-hint">Жетоны из подарков <img src="assets/icons/gift.png" alt="" style="width:16px;height:16px;vertical-align:middle"> · кинь в колесо</p>
            <div class="token-row">Жетоны: <span id="wheelTokens">${save.tokens}</span> <img class="lock-ico" src="assets/icons/token.png" alt="" style="width:18px;height:18px;vertical-align:middle"></div>
            <div class="wheel-wrap">
                <div class="wheel-pointer"></div>
                <div class="wheel" id="wheel">
                    <div class="wheel-seg" style="--i:0"><span>?</span></div>
                    <div class="wheel-seg" style="--i:1"><span>?</span></div>
                    <div class="wheel-seg" style="--i:2"><span>?</span></div>
                    <div class="wheel-seg" style="--i:3"><span>?</span></div>
                    <div class="wheel-seg" style="--i:4"><span>?</span></div>
                    <div class="wheel-seg" style="--i:5"><span>?</span></div>
                    <div class="wheel-seg" style="--i:6"><span>?</span></div>
                    <div class="wheel-seg" style="--i:7"><span>?</span></div>
                    <div class="wheel-seg" style="--i:8"><span>?</span></div>
                    <div class="wheel-seg" style="--i:9"><span>?</span></div>
                    <div class="wheel-seg" style="--i:10"><span>пусто</span></div>
                    <div class="wheel-seg" style="--i:11"><span>пусто</span></div>
                    <div class="wheel-center"><span><img src="assets/icons/wheel.png" alt="" style="width:28px;height:28px"></span></div>
                </div>
                <button class="spin-btn" id="spinBtn" ${save.tokens < 1 ? "disabled" : ""}>
                    Крутить · 1 <img src="assets/icons/token.png" alt="" class="btn-ico">
                </button>
            </div>
            <button type="button" class="spin-btn decor-arrange-btn" id="openDecorEdit" style="margin-top:12px;background:var(--card);color:var(--text);border:2px solid var(--accent);">
                ✏️ Расставить комнату
            </button>
        `;
      const spinBtn = $("spinBtn");
      if (spinBtn) spinBtn.addEventListener("click", spinWheel);
      const openEdit = $("openDecorEdit");
      if (openEdit) openEdit.addEventListener("click", () => {
        $("shopSheet").classList.add("hidden");
        setDecorEditMode(true);
      });
    }

    if (panel === "themes") {
      Object.keys(THEMES).forEach(id => {
        const t = THEMES[id];
        const owned = save.owned.includes(id) || id === "rose";
        const selected = save.theme === id;
        const card = document.createElement("button");
        card.className = "shop-card" + (selected ? " selected" : "") + (owned ? "" : " locked");
        const ico = owned
          ? `<div class="shop-ico"><img src="${t.icon}" alt=""></div>`
          : `<div class="shop-ico locked-ico"><img src="assets/icons/lock.png" alt=""></div>`;
        card.innerHTML = `
                ${ico}
                <div class="shop-info">
                    <b>${owned ? t.name : "???"}</b>
                    <small>${owned ? "Активна / выбрать" : "Купи, чтобы открыть"}</small>
                </div>
                <span class="shop-price ${owned ? "owned" : ""}">${owned ? "✓" : `<img class="lock-ico" src="assets/icons/coin.png" alt=""> ${fmt(t.price)}`}</span>
            `;
        card.addEventListener("click", () => buyTheme(id));
        body.appendChild(card);
      });
    }

    if (panel === "sounds") {
      Object.keys(SOUNDS).forEach(id => {
        const s = SOUNDS[id];
        const owned = ownsSound(id);
        const selected = save.sound === id;
        const card = document.createElement("button");
        card.className = "shop-card" + (selected ? " selected" : "") + (owned ? "" : " locked");
        const ico = owned
          ? `<div class="shop-ico"><img src="${s.icon}" alt=""></div>`
          : `<div class="shop-ico locked-ico"><img src="assets/icons/lock.png" alt=""></div>`;
        card.innerHTML = `
                ${ico}
                <div class="shop-info">
                    <b>${owned ? s.name : "???"}</b>
                    <small>${owned ? s.desc : "Купи, чтобы открыть"}</small>
                </div>
                <span class="shop-price ${owned ? "owned" : ""}">${owned ? "✓" : `<img class="lock-ico" src="assets/icons/coin.png" alt=""> ${fmt(s.price)}`}</span>
            `;
        card.addEventListener("click", () => buySound(id));
        body.appendChild(card);
      });
    }
  }

  function buyUpgrade(key) {
    const price = upgradePrice(key);
    if (save.coins < price) return toast("Не хватает монет 💰");
    save.coins -= price;
    save.levels[key]++;
    if (key === "power") save.clickPower++;
    if (key === "critical") save.critical = Math.min(60, save.critical + 5);
    persist();
    updateUI();
    renderPanel("upgrades");
    setupAutoClick();
    toast("Улучшено! ⚡");
  }

  function buyObject(id) {
    const o = OBJECTS[id];
    if (save.owned.includes(id)) {
      save.object = id;
      persist(); updateUI(); renderPanel("objects");
      return;
    }
    if (save.coins < o.price) return toast("Не хватает монет 💰");
    save.coins -= o.price;
    save.owned.push(id);
    save.object = id;
    persist(); updateUI(); renderPanel("objects");
    toast("Новый предмет! 🎯");
  }

  function buyTheme(id) {
    const t = THEMES[id];
    if (save.owned.includes(id) || id === "rose") {
      save.theme = id;
      persist(); updateUI(); renderPanel("themes");
      return;
    }
    if (save.coins < t.price) return toast("Не хватает монет 💰");
    save.coins -= t.price;
    save.owned.push(id);
    save.theme = id;
    persist(); updateUI(); renderPanel("themes");
    toast("Новая тема! 🎨");
  }

  function buySound(id) {
    const s = SOUNDS[id];
    if (ownsSound(id)) {
      save.sound = id;
      persist(true); updateUI(); renderPanel("sounds");
      playSound(id);
      return;
    }
    if (save.coins < s.price) return toast("Не хватает монет 💰");
    save.coins -= s.price;
    save.owned.push(soundKey(id));
    save.sound = id;
    persist(true); updateUI(); renderPanel("sounds");
    playSound(id);
    toast("Новый звук! 🔊");
  }

  function doClick(cx, cy) {
    const now = Date.now();
    if (now - save.lastClick < 850) save.combo++;
    else save.combo = 1;
    save.lastClick = now;
    save.totalClicks++;

    let reward = save.clickPower;
    let isCrit = false;
    if (Math.random() < save.critical / 100) {
      reward *= 2;
      isCrit = true;
    }

    if (Date.now() < save.x2Until) reward *= 5;
    if (Date.now() < save.comboBoostUntil) reward += Math.floor(save.combo * 0.5);

    save.coins += reward;

    if (!decorEditMode) playSound(save.sound);

    const btn = $("clickButton");
    const phys = (OBJECTS[save.object] || {}).physics || "soft";
    if (!decorEditMode) {
      btn.classList.remove("wobble-soft", "wobble-jelly", "wobble-hard", "pressed", "auto-press");
      void btn.offsetWidth;
      btn.classList.add("pressed");
      setTimeout(() => {
        btn.classList.remove("pressed");
        btn.classList.add("wobble-" + phys);
        setTimeout(() => btn.classList.remove("wobble-soft", "wobble-jelly", "wobble-hard"), 600);
      }, 70);
      const comboEl = $("comboLine");
      if (save.combo >= 3) comboEl.textContent = `КОМБО ×${save.combo}`;
      else comboEl.textContent = "";
    }

    const rect = btn.getBoundingClientRect();
    const cx0 = cx ?? (rect.left + rect.width / 2);
    const cy0 = cy ?? (rect.top + rect.height / 2);

    if (!decorEditMode && save.showFloat) {
      const layer = $("floatLayer").getBoundingClientRect();
      const fx = cx0 - layer.left;
      const fy = cy0 - layer.top;
      const el = document.createElement("div");
      el.className = "floater" + (isCrit ? " crit" : "");
      el.textContent = (isCrit ? "КРИТ " : "") + `+${fmt(reward)}`;
      el.style.left = fx + "px";
      el.style.top = fy + "px";
      $("floatLayer").appendChild(el);
      setTimeout(() => el.remove(), 950);
    }

    if (!decorEditMode && save.showParticles) {
      const colors = ["#e45a9a", "#f5a0c8", "#ffd0e8", "#fff", "#e8b020"];
      const px = cx ?? (btn.getBoundingClientRect().left + btn.offsetWidth / 2);
      const py = cy ?? (btn.getBoundingClientRect().top + btn.offsetHeight / 2);
      for (let i = 0; i < (isCrit ? 9 : 5); i++) {
        const p = document.createElement("div");
        p.className = "pt";
        const ang = (Math.PI * 2 * i) / (isCrit ? 9 : 5) + Math.random() * 0.4;
        const dist = 35 + Math.random() * 45;
        p.style.left = px + "px";
        p.style.top = py + "px";
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--x", Math.cos(ang) * dist + "px");
        p.style.setProperty("--y", Math.sin(ang) * dist - 15 + "px");
        $("particles").appendChild(p);
        setTimeout(() => p.remove(), 700);
      }
    }

    if (!decorEditMode && save.vibrate && navigator.vibrate) {
      navigator.vibrate(isCrit ? [10, 25, 10] : 8);
    }

    updateUI();
    persist();
  }

  function updateAdButtons() {
    const now = Date.now();
    const x2 = $("adX2");
    const boost = $("adBoost");
    if (now < save.x2Until) {
      x2.classList.add("cd");
      const left = Math.ceil((save.x2Until - now) / 1000);
      x2.querySelector("small").textContent = left + " сек";
    } else {
      x2.classList.remove("cd");
      x2.querySelector("small").textContent = "5 мин";
    }
    if (now < save.comboBoostUntil) {
      boost.classList.add("cd");
      const left = Math.ceil((save.comboBoostUntil - now) / 1000);
      boost.querySelector("small").textContent = left + " сек";
    } else {
      boost.classList.remove("cd");
      boost.querySelector("small").textContent = "3 мин";
    }
  }

  function watchAd(type) {
    toast("Реклама… (заглушка)");
    setTimeout(() => {
      if (type === "x2") {
        save.x2Until = Date.now() + 5 * 60 * 1000;
        toast("×5 монеты на 5 минут! 🎉");
      } else {
        save.comboBoostUntil = Date.now() + 3 * 60 * 1000;
        toast("Буст комбо на 3 минуты! 🔥");
      }
      persist();
      updateAdButtons();
    }, 800);
  }

  setInterval(updateAdButtons, 1000);

  $("clickButton").addEventListener("pointerdown", e => {
    if (decorEditMode) return;
    e.preventDefault();
    doClick(e.clientX, e.clientY);
  });

  document.addEventListener("keydown", e => {
    if (e.code !== "Space") return;
    if (!$("shopSheet").classList.contains("hidden") || !$("settingsSheet").classList.contains("hidden")) return;
    e.preventDefault();
    const r = $("clickButton").getBoundingClientRect();
    doClick(r.left + r.width / 2, r.top + r.height / 2);
  });

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPanel(btn.dataset.panel);
      $("shopSheet").classList.remove("hidden");
    });
  });

  $("settingsBtn").addEventListener("click", () => {
    $("settingsSheet").classList.remove("hidden");
  });

  function toggleDecor(id) {
    if (!DECORS[id]) return;
    const i = save.activeDecor.indexOf(id);
    if (i >= 0) {
      save.activeDecor.splice(i, 1);
      if (selectedDecorId === id) selectedDecorId = null;
    } else {
      save.activeDecor.push(id);
      if (!save.decorPlacements[id]) {
        save.decorPlacements[id] = Object.assign({}, DEFAULT_PLACE[id] || { x: 50, y: 50, rot: 0, z: 3, scale: 1 });
      }
    }
    persist(true);
    renderDecor();

  }

  function renderOwnedDecorList() { }

  let spinning = false;
  function spinWheel() {
    if (spinning) return;
    if (save.tokens < 1) return toast("Нет жетонов " + ICO.token);
    spinning = true;
    save.tokens--;
    persist();
    updateUI();
    const btn = $("spinBtn");
    if (btn) btn.disabled = true;
    if ($("wheelTokens")) $("wheelTokens").textContent = save.tokens;

    const idx = Math.floor(Math.random() * WHEEL_N);
    const sector = WHEEL[idx];
    const sectorCenter = idx * WHEEL_STEP + WHEEL_STEP / 2;
    const spins = 5 + Math.floor(Math.random() * 3);
    const rot = spins * 360 + (360 - sectorCenter);
    const wheel = $("wheel");
    if (wheel) {
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";
      void wheel.offsetWidth;
      wheel.style.transition = "transform 4s cubic-bezier(0.12, 0.75, 0.15, 1)";
      wheel.style.transform = `rotate(${rot}deg)`;
    }

    setTimeout(() => {
      spinning = false;
      if (sector.type === "empty") {
        toast("Пусто… повезёт в следующий раз 😅");
      } else if (sector.type === "books") {
        const bookIds = ["book1", "book2", "book3", "book4"];
        let added = 0;
        bookIds.forEach(bid => {
          const key = "decor_" + bid;
          if (!save.owned.includes(key)) {
            save.owned.push(key);
            added++;
          }
          if (!save.activeDecor.includes(bid)) save.activeDecor.push(bid);
          if (!save.decorPlacements[bid]) {
            save.decorPlacements[bid] = Object.assign({}, DEFAULT_PLACE[bid] || { x: 50, y: 16, rot: 0, z: 36, scale: 1 });
          }
        });
        persist();
        renderDecor();
        toast(added ? "Книги! Все 4 на полке 📚" : "Книги уже есть · +50 💰");
        if (!added) { save.coins += 50; persist(); updateUI(); }
      } else {
        const key = "decor_" + sector.id;
        if (!save.owned.includes(key)) {
          save.owned.push(key);
          if (!save.activeDecor.includes(sector.id)) {
            save.activeDecor.push(sector.id);
            if (!save.decorPlacements[sector.id]) {
              save.decorPlacements[sector.id] = Object.assign({}, DEFAULT_PLACE[sector.id] || { x: 50, y: 50, rot: 0, z: 3, scale: 1 });
            }
          }
          persist();
          renderDecor();
          toast("Выпало: " + sector.label + "!");
        } else {
          save.coins += 50;
          persist();
          toast(sector.label + " уже есть · +50 💰");
        }
      }
      updateUI();
      if (btn) btn.disabled = save.tokens < 1;
      if ($("wheelTokens")) $("wheelTokens").textContent = save.tokens;

    }, 4200);
  }

  function getGiftDelayMs() {
    const n = save.giftsClaimed || 0;
    if (n === 0) return 15 * 1000;
    if (n === 1) return 60 * 1000;
    if (n === 2) return 5 * 60 * 1000;
    const mins = Math.min(10, 5 + (n - 2));
    return mins * 60 * 1000;
  }

  function checkGift() {
    const btn = $("giftBtn");
    if (!btn) return;
    if (Date.now() >= save.nextGiftAt) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  }

  function claimGift() {
    if (Date.now() < save.nextGiftAt) return;
    save.tokens += 1;
    save.giftsClaimed = (save.giftsClaimed || 0) + 1;
    save.nextGiftAt = Date.now() + getGiftDelayMs();
    persist();
    updateUI();
    checkGift();
    toast(ICO.token + " Жетон получен! Зайди в Колесо");
  }

  let decorEditMode = false;
  let selectedDecorId = null;
  let dragState = null;
  let decorSnapshot = null;

  function snapshotDecor() {
    return {
      activeDecor: JSON.parse(JSON.stringify(save.activeDecor || [])),
      decorPlacements: JSON.parse(JSON.stringify(save.decorPlacements || {}))
    };
  }
  function restoreDecorSnapshot() {
    if (!decorSnapshot) return;
    save.activeDecor = JSON.parse(JSON.stringify(decorSnapshot.activeDecor));
    save.decorPlacements = JSON.parse(JSON.stringify(decorSnapshot.decorPlacements));
    decorSnapshot = null;
  }

  const CLICKER_Z = 50; // декор z < 50 = за предметом, z > 50 = перед

  function getPlacement(id) {
    if (!save.decorPlacements[id]) {
      const def = Object.assign({ x: 50, y: 50, rot: 0, z: 40, scale: 1 }, DEFAULT_PLACE[id] || {});
      if (def.z >= CLICKER_Z) def.z = CLICKER_Z + 10;
      else def.z = Math.min(def.z, CLICKER_Z - 10);
      save.decorPlacements[id] = def;
    }
    return save.decorPlacements[id];
  }

  function layerLabel(z) {
    return (z >= CLICKER_Z) ? "перед предметом" : "за предметом";
  }

  function getDecorTargetLayer() {
    return $("decorFront");
  }

  function renderDecor() {
    const clicker = $("clickButton");
    if (clicker) clicker.style.zIndex = "50";
    paintDecorLayer($("decorBehind"), false);
    paintDecorLayer($("decorFront"), true);
    updateDecorToolbar();
  }

  function paintDecorLayer(layer, frontLayer) {
    if (!layer) return;
    layer.innerHTML = "";
    layer.classList.toggle("edit-mode", decorEditMode);
    const active = (save.activeDecor || []).filter(id => DECORS[id]);
    active.forEach(id => {
      const p = getPlacement(id);
      const isFront = (p.z || 0) >= CLICKER_Z;
      if (isFront !== frontLayer) return;
      const d = DECORS[id];
      const z = isFront ? 60 : 40;
      p.z = isFront ? CLICKER_Z + 10 : CLICKER_Z - 10;
      const el = document.createElement("div");
      el.className = "decor-item" + (selectedDecorId === id && decorEditMode ? " selected" : "");
      el.dataset.id = id;
      el.style.left = p.x + "%";
      el.style.top = p.y + "%";
      el.style.transform = `translate(-50%, -50%) rotate(${p.rot || 0}deg) scale(${p.scale || 1})`;
      el.style.zIndex = String(z);
      el.style.width = (d.w || 20) + "%";
      const img = document.createElement("img");
      img.src = d.img;
      img.alt = d.name || "";
      img.draggable = false;
      el.appendChild(img);
      if (decorEditMode) {
        el.style.pointerEvents = "auto";
        el.style.touchAction = "none";
        el.style.cursor = "grab";
        el.addEventListener("pointerdown", onDecorPointerDown);
      } else {
        el.style.pointerEvents = "none";
      }
      layer.appendChild(el);
    });
  }

  function onDecorPointerDown(e) {
    if (!decorEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    const id = el.dataset.id;
    selectedDecorId = id;
    document.querySelectorAll(".decor-item").forEach(n => {
      n.classList.toggle("selected", n.dataset.id === id);
      n.style.cursor = n.dataset.id === id ? "grabbing" : "grab";
    });
    updateDecorToolbar();
    const stage = document.querySelector(".stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const p = getPlacement(id);
    document.removeEventListener("pointermove", onDecorPointerMove);
    document.removeEventListener("pointerup", onDecorPointerUp);
    document.removeEventListener("pointercancel", onDecorPointerUp);
    dragState = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: p.x,
      origY: p.y,
      rectW: rect.width,
      rectH: rect.height
    };
    document.addEventListener("pointermove", onDecorPointerMove, { passive: false });
    document.addEventListener("pointerup", onDecorPointerUp);
    document.addEventListener("pointercancel", onDecorPointerUp);
  }

  function onDecorPointerMove(e) {
    if (!dragState) return;
    e.preventDefault();
    const dx = ((e.clientX - dragState.startX) / dragState.rectW) * 100;
    const dy = ((e.clientY - dragState.startY) / dragState.rectH) * 100;
    const p = getPlacement(dragState.id);
    const d = DECORS[dragState.id] || {};
    const halfW = Math.max(8, (d.w || 20) * (p.scale || 1) / 2 + 2);
    const halfH = Math.max(8, halfW * 0.9);
    p.x = Math.max(halfW, Math.min(100 - halfW, dragState.origX + dx));
    p.y = Math.max(halfH, Math.min(100 - halfH, dragState.origY + dy));
    const el = document.querySelector('.decor-item[data-id="' + dragState.id + '"]');
    if (el) {
      el.style.left = p.x + "%";
      el.style.top = p.y + "%";
    }
  }

  function onDecorPointerUp(e) {
    if (!dragState) return;
    document.removeEventListener("pointermove", onDecorPointerMove);
    document.removeEventListener("pointerup", onDecorPointerUp);
    document.removeEventListener("pointercancel", onDecorPointerUp);
    document.querySelectorAll(".decor-item").forEach(n => { n.style.cursor = "grab"; });
    dragState = null;
    if (!decorEditMode) persist(true);
    updateDecorToolbar();
  }

  function setDecorEditMode(on, opts) {
    opts = opts || {};
    const shouldSave = !!opts.save;
    decorEditMode = !!on;
    selectedDecorId = null;

    ["decorBehind", "decorFront"].forEach(id => {
      const layer = $(id);
      if (layer) layer.style.pointerEvents = "none";
    });
    const clicker = $("clickButton");
    if (clicker) clicker.style.pointerEvents = decorEditMode ? "none" : "";

    if (decorEditMode) {
      decorSnapshot = snapshotDecor(); // вход — снимок
    } else if (shouldSave) {
      decorSnapshot = null;
      persist(true);
      toast("Комната сохранена ✨");
    } else {
      restoreDecorSnapshot(); // Выйти — откат
      toast("Выход без сохранения");
    }

    document.body.classList.toggle("decor-editing", decorEditMode);
    const editor = $("roomEditor");
    if (editor) editor.classList.toggle("hidden", !decorEditMode);
    const btn = $("decorEditBtn");
    if (btn) {
      btn.classList.toggle("active", decorEditMode);
      const label = btn.querySelector(".edit-label");
      if (label) label.textContent = decorEditMode ? "Выйти" : "Комната";
    }
    const tag = document.querySelector(".tagline");
    const name = $("objectName");
    if (tag) tag.style.visibility = decorEditMode ? "hidden" : "";
    if (name) {
      if (decorEditMode) {
        name.dataset.prev = name.textContent;
        name.textContent = "Обустрой свою комнату";
        name.classList.add("room-title-active");
      } else {
        if (name.dataset.prev) name.textContent = name.dataset.prev;
        name.classList.remove("room-title-active");
      }
    }
    if (decorEditMode) {
      const shop = $("shopSheet");
      if (shop) shop.classList.add("hidden");
      const settings = $("settingsSheet");
      if (settings) settings.classList.add("hidden");
    }
    renderDecor();
    if (decorEditMode) renderEditorOwned();
    else {
      const box = $("editorOwnedList");
      if (box) box.innerHTML = "";
    }
  }

  function updateDecorToolbar() {
    const bar = $("decorToolbar");
    if (!bar) return;
    const has = selectedDecorId && (save.activeDecor || []).includes(selectedDecorId);
    bar.querySelectorAll("[data-decor-act]").forEach(b => { b.disabled = !has; });
  }

  function decorAct(act) {
    if (!selectedDecorId || !(save.activeDecor || []).includes(selectedDecorId)) return;
    const p = getPlacement(selectedDecorId);
    if (act === "rotL") p.rot = (p.rot || 0) - 15;
    if (act === "rotR") p.rot = (p.rot || 0) + 15;
    if (act === "front") p.z = CLICKER_Z + 10;
    if (act === "back") p.z = CLICKER_Z - 10;
    if (act === "bigger") p.scale = Math.min(1.8, +(p.scale || 1) + 0.1);
    if (act === "smaller") p.scale = Math.max(0.4, +(p.scale || 1) - 0.1);
    if (act === "remove") {
      save.activeDecor = save.activeDecor.filter(id => id !== selectedDecorId);
      selectedDecorId = null;
    }
    persist(true);
    renderDecor(); // перекинет в behind/front слой
    renderEditorOwned();
  }

  function renderEditorOwned() {
    const box = $("editorOwnedList");
    if (!box) return;
    box.innerHTML = "";
    const row = document.createElement("div");
    row.className = "editor-owned-row";
    let any = false;
    Object.keys(DECORS).forEach(id => {
      if (!save.owned.includes("decor_" + id)) return;
      any = true;
      const d = DECORS[id];
      const active = save.activeDecor.includes(id);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "editor-owned-item" + (active ? " on" : "");
      b.innerHTML = `<img src="${d.img}" alt="${d.name}">`;
      b.title = d.name;
      b.addEventListener("click", () => {
        toggleDecor(id);
        renderEditorOwned();
        renderDecor();
      });
      row.appendChild(b);
    });
    if (!any) {
      const empty = document.createElement("p");
      empty.className = "editor-owned-empty";
      empty.textContent = "Крути Колесо, чтобы получить декор";
      box.appendChild(empty);
    } else box.appendChild(row);
  }

  function spawnFx(emoji, x, y, kind, stageEl, glowClass) {
    const layer = $("fxLayer");
    if (!layer) return;
    const el = document.createElement("div");
    el.className = "fx-burst " + (kind || "");
    el.textContent = emoji;
    el.style.left = x + "px";
    el.style.top = y + "px";
    layer.appendChild(el);
    if (stageEl && glowClass) {
      stageEl.classList.add(glowClass);
      setTimeout(() => stageEl.classList.remove(glowClass), 700);
    }
    setTimeout(() => el.remove(), 1200);
  }

  let autoTimer = null;
  function setupAutoClick() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    const lvl = save.levels.auto || 0;
    if (lvl <= 0) return;
    const interval = Math.max(900, 2800 - lvl * 180);
    autoTimer = setInterval(() => {
      const btn = $("clickButton");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      if (!decorEditMode) {
        btn.classList.add("auto-press");
        setTimeout(() => btn.classList.remove("auto-press"), 120);
      }
      doClick(r.left + r.width / 2, r.top + r.height / 2);
    }, interval);
  }

  document.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", () => {
      const which = el.dataset.close;
      if (which === "shop") $("shopSheet").classList.add("hidden");
      if (which === "settings") $("settingsSheet").classList.add("hidden");
    });
  });

  $("volRange").addEventListener("input", e => {
    save.volume = +e.target.value;
    $("volLabel").textContent = save.volume + "%";
    persist();
  });
  $("swSound").addEventListener("click", () => {
    save.muted = !save.muted;
    setSwitch("swSound", !save.muted);
    persist();
  });
  $("swVib").addEventListener("click", () => {
    save.vibrate = !save.vibrate;
    setSwitch("swVib", save.vibrate);
    persist();
  });
  $("swFloat").addEventListener("click", () => {
    save.showFloat = !save.showFloat;
    setSwitch("swFloat", save.showFloat);
    persist();
  });
  $("swPart").addEventListener("click", () => {
    save.showParticles = !save.showParticles;
    setSwitch("swPart", save.showParticles);
    persist();
  });
  $("resetBtn").addEventListener("click", () => {
    if (confirm("Сбросить весь прогресс?")) {
      localStorage.removeItem(SAVE_KEY);
      location.reload();
    }
  });

  $("adX2").addEventListener("click", () => watchAd("x2"));
  $("adBoost").addEventListener("click", () => watchAd("boost"));

  preloadSounds();
  ["pointerdown", "keydown"].forEach(ev => {
    document.addEventListener(ev, () => { getAudioCtx(); preloadSounds(); }, { once: true });
  });

  const giftBtn = $("giftBtn");
  if (giftBtn) giftBtn.addEventListener("click", claimGift);
  setInterval(checkGift, 1000);
  checkGift();

  updateUI();
  renderDecor();
  setupAutoClick();

  const decorEditBtn = $("decorEditBtn");
  if (decorEditBtn) decorEditBtn.addEventListener("click", () => {
    if (decorEditMode) setDecorEditMode(false, { save: false }); // Выйти — без сохранения
    else setDecorEditMode(true);
  });
  const decorSaveBtn = $("decorSaveBtn");
  if (decorSaveBtn) decorSaveBtn.addEventListener("click", () => setDecorEditMode(false, { save: true }));
  document.querySelectorAll("[data-decor-act]").forEach(b => {
    b.addEventListener("click", () => decorAct(b.dataset.decorAct));
  });
})();