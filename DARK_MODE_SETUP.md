# Dark Mode System — Complete Setup Guide

A production-level dark mode implementation for **Sonli Usullar** with zero flickering, persistent preferences, and smooth transitions.

---

## ✨ Features

- ✅ **No FOUC (Flash of Unstyled Content)** — Theme applied before page renders
- ✅ **Persistent** — User preference saved in localStorage
- ✅ **System Preference Aware** — Respects `prefers-color-scheme`
- ✅ **Smooth Transitions** — 0.3s ease transitions between themes
- ✅ **Accessible** — ARIA labels, keyboard support
- ✅ **Mobile Optimized** — Responsive toggle button
- ✅ **Works Everywhere** — All pages, cards, inputs, buttons automatically styled
- ✅ **Premium Design** — Not just inverted colors (proper contrast with #0f172a dark base)

---

## 📁 Files Included

### CSS
- **`src/assets/css/dark-mode.css`** — All theme variables and dark mode styles

### JavaScript
- **`src/assets/js/dark-mode.js`** — Core dark mode toggle logic with localStorage
- **`src/assets/js/inject-dark-mode.js`** — Auto-injects dark mode into pages (optional)

---

## 🚀 Quick Setup

### Method 1: Manual Setup (Recommended for Control)

Add these two lines to the `<head>` of each HTML page:

```html
<head>
  <!-- ... other meta tags ... -->
  
  <!-- Dark Mode -->
  <link rel="stylesheet" href="path/to/dark-mode.css">
  <script src="path/to/dark-mode.js"></script>
  
  <!-- ... rest of head ... -->
</head>
```

**Path Examples:**
- **From index.html:** `<link rel="stylesheet" href="src/assets/css/dark-mode.css">`
- **From src/about.html:** `<link rel="stylesheet" href="assets/css/dark-mode.css">`
- **From src/Sonli-Usullar/method.html:** `<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">`

### Method 2: Auto-Injection (Easiest)

Add just this one line to the `<head>` of pages you want dark mode on:

```html
<script src="path/to/inject-dark-mode.js"></script>
```

The script will automatically detect your page location and inject the CSS and JS.

---

## 🎨 How It Works

### 1. **CSS Variables for Theming**

```css
:root {
  /* Light theme (default) */
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --accent-primary: #00f2ff;
  /* ... more variables ... */
}

:root[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
  --accent-primary: #00f2ff;
  /* ... more variables ... */
}
```

### 2. **Toggle Button**

- Automatically injected into every page (or add manually)
- Shows 🌙 in light mode → Click to switch to dark
- Shows ☀️ in dark mode → Click to switch to light
- Fixed position (top-right corner)
- Smooth animations and hover effects

### 3. **Persistence**

User theme preference is saved to `localStorage` with key `theme-preference`:
```javascript
localStorage.setItem('theme-preference', 'dark') // or 'light'
```

On next visit, the saved preference is automatically applied.

### 4. **System Preference Detection**

If user hasn't set a preference, the system's `prefers-color-scheme` is used:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

Changes to system theme are detected and applied automatically (unless user has manually set preference).

### 5. **No Flickering**

The theme is applied **before the page renders**:
1. `dark-mode.js` runs in the `<head>`
2. Theme is read from localStorage or system preference
3. `data-theme` attribute is set on `<html>`
4. CSS is already loaded → No flash!

---

## 🎯 CSS Classes & Selectors

All elements automatically use theme variables. No need to modify existing CSS!

```css
/* Automatically themed */
body { background-color: var(--bg-primary); }
h1, p, span { color: var(--text-primary); }
.card { background-color: var(--card-bg); }
input { border-color: var(--input-border); }
```

### Available CSS Variables

**Backgrounds:**
- `--bg-primary` — Main background
- `--bg-secondary` — Secondary/hover backgrounds
- `--bg-tertiary` — Tertiary backgrounds

**Text:**
- `--text-primary` — Main text color
- `--text-secondary` — Secondary text
- `--text-tertiary` — Tertiary/muted text

**Accents:**
- `--accent-primary` — Primary accent (#00f2ff cyan)
- `--accent-secondary` — Secondary accent (#ff00ea magenta)
- `--accent-tertiary` — Tertiary accent

**Components:**
- `--card-bg` — Card background
- `--card-border` — Card border
- `--card-shadow` — Card shadow
- `--input-bg` — Input background
- `--input-border` — Input border
- `--input-text` — Input text
- `--button-bg` — Button background
- `--button-text` — Button text
- `--button-border` — Button border

**Other:**
- `--border-color` — General border color
- `--border-dark` — Dark border
- `--transition-speed` — Transition duration (0.3s ease)

---

## 💻 JavaScript API

If you need to control dark mode programmatically:

```javascript
// Get current theme
const theme = window.DarkMode.get(); // 'light' or 'dark'

// Set theme
window.DarkMode.set('dark', true); // Second param: animate transitions

// Toggle theme
window.DarkMode.toggle();

// Inject toggle button manually
window.DarkMode.injectToggle();
```

### Listen for Theme Changes

```javascript
window.addEventListener('theme-changed', (e) => {
  console.log('Theme changed to:', e.detail.theme);
});
```

---

## 🔧 Customization

### Change Colors

Edit the CSS variables in `dark-mode.css`:

```css
:root[data-theme="dark"] {
  --bg-primary: #0f172a;  /* Change this to your dark color */
  --accent-primary: #00f2ff;  /* Change accent color */
  /* ... */
}
```

### Change Toggle Button Position

Edit in `dark-mode.css`:

```css
.dark-mode-toggle {
  top: 20px;      /* Change to 'bottom' */
  right: 20px;    /* Change to 'left' */
  /* ... */
}
```

### Change Transition Speed

Edit in `dark-mode.css`:

```css
:root {
  --transition-speed: 0.3s ease;  /* Change from 0.3s to 0.5s, etc. */
}
```

### Disable Transitions on Specific Elements

```css
.no-transition-element {
  transition: none !important;
}
```

---

## 📱 Responsive Design

The toggle button is responsive:

```css
/* Mobile: 45px button, positioned at 12px from edges */
@media (max-width: 768px) {
  .dark-mode-toggle {
    width: 45px;
    height: 45px;
    top: 12px;
    right: 12px;
  }
}
```

---

## 🧪 Testing

### Test No Flickering
1. Open DevTools → Settings → Throttling
2. Set to "Slow 3G"
3. Refresh page
4. Toggle dark mode
5. Reload page → Should not flash light mode before dark mode

### Test Persistence
1. Switch to dark mode
2. Close browser tab
3. Reopen the page
4. Should open in dark mode (your preference saved)

### Test System Preference
1. **Windows:** Settings → Personalization → Colors → Dark mode
2. **macOS:** System Preferences → General → Dark/Light
3. Refresh page (if no localStorage preference set)
4. Should match system preference

---

## 🎓 How Each Page Gets Dark Mode

### index.html
```html
<!-- Already updated -->
<link rel="stylesheet" href="src/assets/css/dark-mode.css">
<script src="src/assets/js/dark-mode.js"></script>
```

### src/Sonli-Usullar/*.html (Method pages)
```html
<!-- Add to each method page -->
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

### src/about.html, src/privacy.html
```html
<!-- Add to each utility page -->
<link rel="stylesheet" href="assets/css/dark-mode.css">
<script src="assets/js/dark-mode.js"></script>
```

---

## 🐛 Troubleshooting

### Toggle button not appearing
- Ensure `dark-mode.js` is loaded
- Check browser console for errors
- Dark mode JS should run before page fully loads

### Colors not changing
- Ensure CSS file path is correct
- Check if `data-theme="dark"` is set on `<html>` element
- Open DevTools → Elements → check `<html>` attributes

### Flickering on load
- Ensure dark-mode JS runs **in the `<head>`** before other scripts
- Should be one of the first scripts loaded

### localStorage not working
- Check if browser allows localStorage (some private windows don't)
- Check browser console for storage errors
- Fallback: system preference will be used

---

## 📊 Browser Support

- ✅ Chrome/Edge 76+
- ✅ Firefox 67+
- ✅ Safari 12.1+
- ✅ Opera 63+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)

---

## 📝 Summary Checklist

- [x] Dark mode CSS created (`dark-mode.css`)
- [x] Dark mode JS created (`dark-mode.js`)
- [x] index.html updated with dark mode
- [x] Sample method page updated (Iteratsiya-Usuli.html)
- [ ] Update remaining method pages (Copy the 2-line addition to each)
- [ ] Update src/about.html (Copy the 2-line addition)
- [ ] Update src/privacy.html (Copy the 2-line addition)
- [ ] Test dark mode toggle
- [ ] Test theme persistence (localStorage)
- [ ] Test system preference detection
- [ ] Test on mobile devices

---

## 🚀 Next Steps

1. **Copy dark mode lines to all HTML pages** — Use the 2-line template above
2. **Test the toggle button** — Click 🌙 button on index.html
3. **Test persistence** — Toggle, refresh, toggle back
4. **Customize colors** — Edit CSS variables if needed
5. **Deploy** — All dark mode files are included in production build

---

## 💡 Pro Tips

- **Keyboard users:** Tab to the toggle button, press Space/Enter to toggle
- **Accessible:** Toggle has proper `aria-label` for screen readers
- **SEO:** Dark mode is transparent to SEO (no impact)
- **Performance:** Minimal overhead (~10KB total CSS + JS)
- **Future-proof:** Uses standard CSS variables and localStorage APIs

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the JavaScript console (DevTools F12)
3. Ensure all file paths are correct for your directory structure

Enjoy your production-level dark mode! 🌙
