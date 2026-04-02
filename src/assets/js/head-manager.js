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
    { tag: 'link', rel: 'icon', href: base + 'favicon.ico', sizes: 'any' },
    { tag: 'link', rel: 'icon', type: 'image/png', href: base + 'favicon.png' },

    // 1.1 PWA Manifest
    { tag: 'link', rel: 'manifest' , href: base + 'manifest.json' },

    // 1.2 Open Graph (OG) Tags for better social media sharing
    { tag: 'meta', property: 'og:title', content: 'Sonli Usullar - Matematik usullar va algoritmlar to\'plami' },
    { tag: 'meta', property: 'og:description', content: 'Sonli usullar haqida maqolalar, algoritmlar va amaliy misollar. Matematik muammolarni yechish uchun eng yaxshi resurs.' },
    { tag: 'meta', property: 'og:image', content: 'https://www.sonli-usullar.uz/src/assets/images/og-image-1200x630.jpg' },

    // 2. Shared Stylesheets
    { tag: 'link', rel: 'stylesheet', href: base + 'src/assets/css/sidebar.css' },
    { tag: 'link', rel: 'stylesheet', href: base + 'src/assets/css/output.css' },
    { tag: 'link', rel: 'stylesheet', href: base + 'src/assets/css/native.css' },

    // 3. Font Awesome
    { tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' },

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
    
    { tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js' },
    // 5. Common Meta Tags (that are the same everywhere)

    { tag: 'meta', name: 'author', content: 'Haydarov Jasurbek' },
    { tag: 'meta', name: 'robots', content: 'index, follow' },
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
