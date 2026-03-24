/**
 * sidebar.js — math.yolnoma.uz uchun umumiy sidebar komponenti
 * DRY tamoyiliga amal qilgan holda barcha sahifalar uchun bitta sidebar
 *
 * Foydalanish:
 *   <script src="/src/assets/js/sidebar.js"></script>
 *   yoki nisbiy yo'l bilan:
 *   <script src="../../assets/js/sidebar.js"></script>
 *
 * Konfiguratsiya (ixtiyoriy, skriptdan oldin o'rnating):
 *   window.SIDEBAR_BASE = '../../'; // fayl joylashuviga qarab
 *   window.SIDEBAR_ACTIVE = 'iteratsiya'; // aktiv bo'lim nomi
 */

(function () {
  'use strict';

  // ── Yo'llarni aniqlash ──────────────────────────────────────────────
  const base = window.SIDEBAR_BASE ?? '/';

  // Sidebar menyusidagi sahifalar
  const MENU_ITEMS = [
    {
      id: 'home',
      label: 'ASOSIY SAHIFA',
      icon: '🏠',
      href: base + 'index.html',
    },
    {
      id: 'about',
      label: 'WEBSITE HAQIDA',
      icon: 'ℹ️',
      href: base + 'src/about.html',
    },
    {
      id: 'funksiya',
      label: 'FUNKSIYA KESISHISH',
      icon: '📈',
      href: base + 'src/Sonli-Usullar/FunksiyaKesishishNuqtasiAniqlash.html',
    },
    {
      id: 'iteratsiya',
      label: 'ITERATSIYA USULI',
      icon: '🔄',
      href: base + 'src/Sonli-Usullar/Iteratsiya-Usuli.html',
    },
    {
      id: 'newton',
      label: 'URINMA (NYUTON) USULI',
      icon: '📐',
      href: base + 'src/Sonli-Usullar/Urinma-Usuli.html',
    },
    {
      id: 'oddiyNyuton',
      label: 'ODDIY NYUTON USULI',
      icon: '📐',
      href: base + 'src/Sonli-Usullar/Oddiy-Nyuton-Usuli.html',
    },
    {
      id: 'vatar',
      label: 'VATAR (SEKANT) USULI',
      icon: '📏',
      href: base + 'src/Sonli-Usullar/Vatar-Usuli.html',
    },
    {
      id: 'kesma',
      label: "KESMANI TENG IKKIGA BO'LISH",
      icon: '✂️',
      href: base + "src/Sonli-Usullar/KesmaniTengIkkigaBo'lish-Usuli.html",
    },
    {
      id: 'gauss',
      label: 'GAUSS-SEYDEL USULI',
      icon: '🧮',
      href: base + 'src/Sonli-Usullar/Gauss-Seydel-usuli.html',
    },
    {
      id: 'nazariya',
      label: 'NAZARIYA (PROMPT)',
      icon: '📋',
      href: base + 'src/Sonli-Usullar/Nazariya.html',
    },
  ];

  // ── Aktiv sahifani aniqlash ─────────────────────────────────────────
  function getActiveId() {
    if (window.SIDEBAR_ACTIVE) return window.SIDEBAR_ACTIVE;
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) return 'home';
    if (path.includes('Iteratsiya')) return 'iteratsiya';
    if (path.includes('Urinma') || path.includes('Newton') || path.includes('newton')) return 'newton';
    if (path.includes('Vatar') || path.includes('Secant') || path.includes('vatar')) return 'vatar';
    if (path.includes('KesmaniTeng') || path.includes('kesmani') || path.includes('Bisect')) return 'kesma';
    if (path.includes('FunksiyaKesish') || path.includes('funksiya') || path.includes('Graph')) return 'funksiya';
    if (path.includes('Gauss') || path.includes('gauss') || path.includes('Zeydel')) return 'gauss';
    if (path.includes('Nazariya') || path.includes('nazariya') || path.includes('Prompt')) return 'nazariya';
    if (path.includes('about')) return 'about';
    return '';
  }

  // ── HTML tuzish ────────────────────────────────────────────────────
  function buildSidebar() {
    const activeId = getActiveId();

    const itemsHTML = MENU_ITEMS.map(item => {
      const isActive = item.id === activeId;
      return `<a href="${item.href}" class="sidebar-item${isActive ? ' active' : ''}" data-id="${item.id}">
        <span class="si-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
    }).join('\n');

    const sidebarHTML = `
      <div class="sidebar" id="sidebar" role="navigation" aria-label="Asosiy menyu">
        <div class="sidebar-header">
          <div class="sidebar-logo">SONLI USULLAR</div>
          <div class="sidebar-subtitle">QarDU · Amaliy Matematika · 2026</div>
        </div>
        <div class="sidebar-section-label">Navigatsiya</div>
        <nav class="sidebar-menu">
          ${itemsHTML}
        </nav>
        <div class="sidebar-footer">
          <div>© 2026 Haydarov Jasurbek</div>
          <div style="margin-top:2px; color:#cbd5e1;">QarDU | 023-40 guruh</div>
        </div>
      </div>

      <div class="sidebar-overlay" id="sidebar-overlay" role="presentation"></div>

      <button class="sidebar-toggle-btn" id="sidebar-toggle" aria-label="Menyuni ochish" aria-expanded="false" aria-controls="sidebar">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button id="back-to-top" aria-label="Yuqoriga qaytish" title="Yuqoriga">▲</button>
    `;

    // DOM ga kiritish
    const container = document.createElement('div');
    container.innerHTML = sidebarHTML.trim();
    // body ning boshiga qo'shish
    document.body.insertBefore(container, document.body.firstChild);
    // Faqat bolalar elementlarini ko'chirish
    while (container.firstChild) {
      document.body.insertBefore(container.firstChild, container);
    }
    container.remove();
  }

  // ── Toggle mantiq ──────────────────────────────────────────────────
  function initToggle() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');

    if (!sidebar || !toggleBtn) return;

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      if (mainContent) mainContent.classList.add('shifted');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      if (mainContent) mainContent.classList.remove('shifted');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleSidebar() {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    }

    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Klaviatura qo'llab-quvvatlash
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSidebar();
    });

    // Global funksiya sифatида ham qoldirish (eski kodlar uchun)
    window.toggleSidebar = toggleSidebar;
  }

  // ── Back to top ────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Main ────────────────────────────────────────────────────────────
  function init() {
    buildSidebar();
    initToggle();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
