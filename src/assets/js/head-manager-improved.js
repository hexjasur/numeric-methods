/**
 * head-manager-improved.js — DRY prinsipi bilan dynamik meta taglar
 *
 * Foydalanish:
 * <script>
 *   window.PAGE_CONFIG = {
 *     basePath: '../../',
 *     title: 'Iteratsiya Usuli | Sonli Usullar',
 *     description: 'Oddiy iteratsiya usuli...',
 *     keywords: 'iteratsiya, iteration',
 *     image: '/src/assets/images/og-image.jpg',
 *     type: 'article' // 'article' yoki 'website'
 *   };
 * </script>
 * <script src="../../assets/js/head-manager-improved.js"></script>
 */

(function () {
  'use strict';

  const config = window.PAGE_CONFIG || {};
  const basePath = config.basePath ?? './';

  // ============================================
  // 1. METADATA CONFIGURATION
  // ============================================
  const metadata = {
    siteUrl: 'https://www.sonli-usullar.uz',
    siteName: 'Sonli Usullar',
    siteDescription:
      "O'zbek tilida sonli usullar mavzusidagi interaktiv platforma",
    author: 'Haydarov Jasurbek',
    locale: 'uz_UZ',

    // SAHIFA SPESIFIK
    pageTitle: config.title || 'Sonli Usullar',
    pageDescription:
      config.description ||
      "O'zbek tilida sonli usullar mavzusidagi interaktiv platforma",
    pageKeywords:
      config.keywords || 'sonli usullar, matematika, numerical methods',
    pageImage: config.image || '/src/assets/images/logo-dark.jpg',
    pageType: config.type || 'website',
    pageUrl: window.location.href,
  };

  // ============================================
  // 2. SET DYNAMIC META TAGS
  // ============================================
  function setMetaTag(selector, content, attribute = 'content') {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement(
        selector.includes('og:') ? 'meta' : 'meta',
      );
      if (selector.includes('[property')) {
        element.setAttribute(
          'property',
          selector.match(/property="([^"]*)"/)[1],
        );
      } else if (selector.includes('[name')) {
        element.setAttribute('name', selector.match(/name="([^"]*)"/)[1]);
      }
      document.head.appendChild(element);
    }
    element.setAttribute(attribute, content);
  }

  function updateMetaTags() {
    // TITLE
    document.title = metadata.pageTitle;
    setMetaTag('meta[name="title"]', metadata.pageTitle);

    // DESCRIPTION
    setMetaTag('meta[name="description"]', metadata.pageDescription);

    // KEYWORDS
    if (metadata.pageKeywords) {
      setMetaTag('meta[name="keywords"]', metadata.pageKeywords);
    }

    // AUTHOR
    setMetaTag('meta[name="author"]', metadata.author);

    // THEME COLOR
    setMetaTag('meta[name="theme-color"]', config.themeColor || '#00f2ff');

    // ============================================
    // 3. OPEN GRAPH TAGS (Social Media)
    // ============================================
    setMetaTag('meta[property="og:type"]', metadata.pageType);
    setMetaTag('meta[property="og:url"]', metadata.pageUrl);
    setMetaTag('meta[property="og:site_name"]', metadata.siteName);
    setMetaTag('meta[property="og:locale"]', metadata.locale);
    setMetaTag('meta[property="og:title"]', metadata.pageTitle);
    setMetaTag('meta[property="og:description"]', metadata.pageDescription);
    setMetaTag('meta[property="og:image"]', metadata.pageImage);

    // OG IMAGE DIMENSIONS
    if (config.imageWidth && config.imageHeight) {
      setMetaTag('meta[property="og:image:width"]', config.imageWidth);
      setMetaTag('meta[property="og:image:height"]', config.imageHeight);
    }

    // ============================================
    // 4. TWITTER CARD TAGS
    // ============================================
    setMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', metadata.pageTitle);
    setMetaTag('meta[name="twitter:description"]', metadata.pageDescription);
    setMetaTag('meta[name="twitter:image"]', metadata.pageImage);

    // ============================================
    // 5. CANONICAL LINK
    // ============================================
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = metadata.pageUrl;
      document.head.appendChild(link);
    } else {
      canonical.href = metadata.pageUrl;
    }
  }

  // ============================================
  // 6. JSON-LD STRUCTURED DATA
  // ============================================
  function updateJsonLd() {
    let jsonLd = document.querySelector('script[id="json-ld"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'json-ld';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': config.jsonLdType || 'WebPage',
      name: metadata.pageTitle,
      description: metadata.pageDescription,
      url: metadata.pageUrl,
      image: metadata.pageImage,
      inLanguage: 'uz',
      creator: {
        '@type': 'Person',
        name: metadata.author,
      },
      publisher: {
        '@type': 'Organization',
        name: metadata.siteName,
        url: metadata.siteUrl,
      },
    };

    jsonLd.textContent = JSON.stringify(schema);
  }

  // ============================================
  // 7. LOAD EXTERNAL RESOURCES (OPTIMIZED)
  // ============================================
  const essentialResources = [
    // Stylesheets (CRITICAL)
    {
      tag: 'link',
      rel: 'stylesheet',
      href: basePath + 'src/assets/css/style.min.css',
    },

    // Fonts (PRELOAD)
    {
      tag: 'link',
      rel: 'preload',
      href: basePath + 'src/assets/fonts/Orbitron.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true,
    },
    {
      tag: 'link',
      rel: 'preload',
      href: basePath + 'src/assets/fonts/JetBrains-Mono.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: true,
    },

    // Favicons
    {
      tag: 'link',
      rel: 'icon',
      href: basePath + 'src/assets/images/favicon.ico',
      sizes: 'any',
    },
    {
      tag: 'link',
      rel: 'apple-touch-icon',
      href: basePath + 'src/assets/images/apple-touch-icon-180x180.png',
    },

    // Manifest (PWA)
    { tag: 'link', rel: 'manifest', href: basePath + 'manifest.json' },
  ];

  const deferredResources = [
    // Math Library
    {
      tag: 'script',
      src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.min.js',
      defer: true,
    },

    // KaTeX (Math Rendering)
    {
      tag: 'link',
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    },
    {
      tag: 'script',
      src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
      defer: true,
    },

    // Font Awesome
    {
      tag: 'link',
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    },
  ];

  function addElement(config) {
    const element = document.createElement(config.tag);

    for (const [key, value] of Object.entries(config)) {
      if (key === 'tag') continue;

      if (key === 'src') element.src = value;
      else if (key === 'href') element.href = value;
      else if (key === 'rel') element.rel = value;
      else if (key === 'type') element.type = value;
      else if (key === 'as') element.as = value;
      else if (key === 'defer') element.defer = value;
      else if (key === 'async') element.async = value;
      else if (key === 'crossorigin') element.crossOrigin = value;
      else if (key === 'sizes') element.sizes = value;
      else element.setAttribute(key, value);
    }

    document.head.appendChild(element);
  }

  function loadResources() {
    // Load essential resources immediately
    essentialResources.forEach(addElement);

    // Load deferred resources after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        deferredResources.forEach(addElement);
      });
    } else {
      deferredResources.forEach(addElement);
    }
  }

  // ============================================
  // 8. RESOURCE HINTS (Speed Optimization)
  // ============================================
  function addResourceHints() {
    const hints = [
      {
        rel: 'preconnect',
        href: 'https://cdnjs.cloudflare.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preconnect',
        href: 'https://cdn.jsdelivr.net',
        crossOrigin: 'anonymous',
      },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
    ];

    hints.forEach((hint) => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      document.head.insertBefore(link, document.head.firstChild);
    });
  }

  // ============================================
  // 9. INITIALIZE
  // ============================================
  function init() {
    addResourceHints();
    loadResources();
    updateMetaTags();
    updateJsonLd();
  }

  // Run on DOM ready or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.HeadManager = {
    updateMetaTags,
    updateJsonLd,
    setMetaTag,
  };
})();
