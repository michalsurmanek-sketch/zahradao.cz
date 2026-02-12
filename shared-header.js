/* Zahradao.cz — Shared Header Snippet (GitHub Pages friendly)
   v3: přidáno mobilní menu (hamburger + panel).

   Usage:
   1) Vlož do stránky tam, kde chceš header:
      <div id="siteHeader"
        data-subtitle="..."
        data-cta-label="..." data-cta-href="..."
        data-back-label="..." data-back-href="...">
      </div>

   2) Na konci body (před vlastními skripty):
      <script src="./shared-header.js"></script>

   Keys:
   - theme: zahradao_theme
   - cart:  zahradao_cart_v1
*/

(() => {
  const THEME_KEY = "zahradao_theme";
  const LS_CART = "zahradao_cart_v1";

  const $ = (s, r=document) => r.querySelector(s);

  function readLS(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || "") || fallback; } catch { return fallback; }
  }

  function applyTheme(mode){
    const html = document.documentElement;
    if (mode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem(THEME_KEY, mode);

    const label = $("#themeLabel");
    if (label) label.textContent = (mode === "dark") ? "Tmavý" : "Světlý";

    // v mobilním panelu může být druhý label
    const label2 = $("#themeLabelMobile");
    if (label2) label2.textContent = (mode === "dark") ? "Tmavý" : "Světlý";
  }

  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return applyTheme(saved);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function updateCartBadge(){
    const cart = readLS(LS_CART, []);
    const count = cart.reduce((a,i)=>a+(i.qty||0),0);

    const setBadge = (badge) => {
      if(!badge) return;
      if(count > 0){
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    };

    setBadge(document.getElementById('cartBadge'));
    setBadge(document.getElementById('cartBadgeMobile'));
  }

  function mount(){
    const host = document.getElementById("siteHeader");
    if (!host) return;

    const subtitle  = host.dataset.subtitle || "";
    const ctaLabel  = host.dataset.ctaLabel || "";
    const ctaHref   = host.dataset.ctaHref  || "";
    const backLabel = host.dataset.backLabel || "";
    const backHref  = host.dataset.backHref  || "";

    host.innerHTML = `
<header class="sticky top-0 z-50 border-b border-zinc-200/70 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-zinc-950/40">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="flex items-center justify-between py-3 gap-3">

      <a href="./index.html#home" class="flex items-center gap-3 group min-w-0">
        <div class="h-10 w-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 grid place-items-center shadow-soft flex-none">
          <span class="text-sm font-bold tracking-tight">ZA</span>
        </div>
        <div class="leading-tight min-w-0">
          <div class="font-semibold tracking-tight group-hover:opacity-90 truncate">Zahradao.cz</div>
          <div class="text-xs text-zinc-600 dark:text-zinc-400 truncate">${escapeHtml(subtitle)}</div>
        </div>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <a href="./index.html#home" class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Domů</a>
        <a href="./katalog.html" class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Katalog</a>
        <a href="./moje-objednavky.html" class="px-3 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Moje objednávky</a>
        <a href="./kosik.html" class="relative px-3 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">
          Košík
          <span id="cartBadge" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[11px] leading-[18px] text-center rounded-full bg-emerald-600 text-white hidden">0</span>
        </a>
      </nav>

      <div class="flex items-center gap-2 flex-none">
        <!-- Mobile menu button -->
        <button id="btnMenu" class="md:hidden px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition" aria-label="Otevřít menu" aria-controls="mobileMenu" aria-expanded="false">☰</button>

        ${backHref && backLabel ? `<a href="${escapeAttr(backHref)}" class="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm font-medium border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">${escapeHtml(backLabel)}</a>` : ``}
        ${ctaHref && ctaLabel ? `<a href="${escapeAttr(ctaHref)}" class="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm font-medium border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">${escapeHtml(ctaLabel)}</a>` : ``}

        <button id="toggleTheme" class="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm font-medium border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Režim: <span id="themeLabel">Světlý</span></button>
      </div>

    </div>

    <!-- Mobile panel -->
    <div id="mobileMenu" class="md:hidden hidden pb-4">
      <div class="mt-2 p-3 rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/70 dark:bg-zinc-950/40">
        <div class="grid gap-1">
          <a href="./index.html#home" class="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Domů</a>
          <a href="./katalog.html" class="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Katalog</a>
          <a href="./moje-objednavky.html" class="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Moje objednávky</a>
          <a href="./kosik.html" class="relative px-3 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">
            Košík
            <span id="cartBadgeMobile" class="absolute top-2 right-3 min-w-[18px] h-[18px] px-1 text-[11px] leading-[18px] text-center rounded-full bg-emerald-600 text-white hidden">0</span>
          </a>
        </div>

        <div class="mt-3 grid gap-2">
          ${backHref && backLabel ? `<a href="${escapeAttr(backHref)}" class="px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">${escapeHtml(backLabel)}</a>` : ``}
          ${ctaHref && ctaLabel ? `<a href="${escapeAttr(ctaHref)}" class="px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">${escapeHtml(ctaLabel)}</a>` : ``}
          <button id="toggleThemeMobile" class="px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-200/70 dark:border-white/10 hover:bg-zinc-900/5 dark:hover:bg-white/10 transition">Režim: <span id="themeLabelMobile">Světlý</span></button>
        </div>
      </div>
    </div>

  </div>
</header>`;

    // theme + badge
    initTheme();
    updateCartBadge();

    // theme buttons
    document.getElementById("toggleTheme")?.addEventListener("click", () => {
      const html = document.documentElement;
      applyTheme(html.classList.contains("dark") ? "light" : "dark");
    });
    document.getElementById("toggleThemeMobile")?.addEventListener("click", () => {
      const html = document.documentElement;
      applyTheme(html.classList.contains("dark") ? "light" : "dark");
    });

    // mobile menu
    const btn = document.getElementById('btnMenu');
    const panel = document.getElementById('mobileMenu');

    function setOpen(open){
      if(!btn || !panel) return;
      if(open){
        panel.classList.remove('hidden');
        btn.setAttribute('aria-expanded','true');
        btn.textContent = '✕';
        btn.setAttribute('aria-label','Zavřít menu');
      } else {
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded','false');
        btn.textContent = '☰';
        btn.setAttribute('aria-label','Otevřít menu');
      }
    }

    btn?.addEventListener('click', () => {
      const isOpen = panel && !panel.classList.contains('hidden');
      setOpen(!isOpen);
    });

    // close on navigation click
    panel?.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if(a) setOpen(false);
    });

    // close on Escape
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') setOpen(false);
    });

    // storage sync
    window.addEventListener('storage', (e)=>{
      if(e.key === LS_CART) updateCartBadge();
      if(e.key === THEME_KEY) initTheme();
    });
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[c]);
  }
  function escapeAttr(str){
    return escapeHtml(str);
  }

  window.ZahradaoHeader = {
    mount,
    applyTheme,
    initTheme,
    updateCartBadge,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
