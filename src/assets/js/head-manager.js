/**
 * head-manager.js — sonli-usullar.uz uchun umumiy head elementlari
 * DRY tamoyiliga amal qilgan holda barcha sahifalar uchun umumiy meta, icon va linklar
 *
 * Foydalanish:
 *   <script src="/src/assets/js/head-manager.js"></script>
 *   yoki nisbiy yo'l bilan:
 *   <script src="../../assets/js/head-manager.js"></script>
 *
 * Konfiguratsiya:
 *   window.HEAD_BASE = '../../'; // fayl joylashuviga qarab
 */

(function () {
  'use strict';

  const base = window.HEAD_BASE ?? (window.SIDEBAR_BASE ?? './');

  const elements = [
    // 1. Favicons
    { tag: 'link', rel: 'icon', href: base + 'src/assets/images/logo-glass.png', media: '(prefers-color-scheme: light)' },
    { tag: 'link', rel: 'icon', href: base + 'src/assets/images/logo-glass.png', media: '(prefers-color-scheme: dark)' },

    // 2. Shared Stylesheets
    { tag: 'link', rel: 'stylesheet', href: base + 'src/assets/css/sidebar.css' },
    { tag: 'link', rel: 'stylesheet', href: base + 'src/assets/css/output.css' },

    // 3. Font Awesome
    { tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/al l.min.css' },

    // 4. Math.js
    { tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js' },

    // 5. Katex
    {
      tag: 'link', rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
    },
    {
      tag: 'script', src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
    },
    {
      tag: 'script', src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'
    },

    // 5. Common Meta Tags (that are the same everywhere)

    { tag: 'meta', name: 'author', content: 'Haydarov Jasurbek' },
    { tag: 'meta', name: 'robots', content: 'index, follow' },
    { tag: 'meta', name: 'language', content: 'Uzbek' },
    { tag: 'meta', name: 'theme-color', content: '#00f2ff' },
  ];

  // Injeksiya
  elements.forEach(el => {
    const tag = document.createElement(el.tag);
    Object.keys(el).forEach(key => {
      if (key !== 'tag') tag.setAttribute(key, el[key]);
    });
    document.head.appendChild(tag);
  });

  // 5. Google Fonts (Orbitron & JetBrains Mono) - Agar kerak bo'lsa
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap';
  document.head.appendChild(fontLink);

})();
