/**
 * math-config.js — mathjs uchun qo'shimcha konfiguratsiyalar
 * arcsin, arccos, ln, lg kabi funksiyalarni aliasing qilish
 */
(function () {
  const configure = () => {
    if (typeof math !== 'undefined') {
      math.import({
        arcsin: math.asin,
        arccos: math.acos,
        arctan: math.atan,
        arcctg: math.acot,
        ln: math.log,
        lg: math.log10
      }, { override: true });
    }
  };

  // Agar math yuklangan bo'lsa darhol, aks holda interval bilan kutish
  if (typeof math !== 'undefined') {
    configure();
  } else {
    const interval = setInterval(() => {
      if (typeof math !== 'undefined') {
        configure();
        clearInterval(interval);
      }
    }, 50);
    setTimeout(() => clearInterval(interval), 5000); // 5 soniyadan keyin to'xtatish
  }
})();
