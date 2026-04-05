# 🌙 Dark Mode — Pages Implementation Checklist

## Overview

This checklist helps you add dark mode to all pages in the Sonli Usullar website.

**Status: 2 / 16 pages completed**

---

## ✅ Completed Pages

### 1. ✅ index.html (Root Page)
**Status:** DONE  
**Path:** `/index.html`  
**Added:** CSS + JS links

```html
<!-- Dark Mode (CSS + JS) - Applied immediately to prevent FOUC -->
<link rel="stylesheet" href="src/assets/css/dark-mode.css">
<script src="src/assets/js/dark-mode.js"></script>
```

### 2. ✅ Iteratsiya-Usuli.html
**Status:** DONE  
**Path:** `/src/Sonli-Usullar/Iteratsiya-Usuli.html`  
**Added:** CSS + JS links

```html
<!-- Dark Mode (CSS + JS) - Applied immediately to prevent FOUC -->
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

## 📝 Remaining Pages (14 pages)

### Method Pages (in `/src/Sonli-Usullar/`)

#### 3. ⬜ Chats-Oddiy-Iteratsiya-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Chats-Oddiy-Iteratsiya-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

**Where:** Right after `<head>` opens, before `<script>window.HEAD_BASE = '../../'</script>`

---

#### 4. ⬜ Chats-Zeydel-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Chats-Zeydel-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 5. ⬜ FunksiyaKesishishNuqtasiAniqlash.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/FunksiyaKesishishNuqtasiAniqlash.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 6. ⬜ Haydash-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Haydash-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 7. ⬜ KesmaniTengIkkigaBo'lish-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/KesmaniTengIkkigaBo'lish-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 8. ⬜ Nazariya.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Nazariya.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 9. ⬜ Oddiy-Nyuton-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Oddiy-Nyuton-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 10. ⬜ Urinma-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Urinma-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 11. ⬜ Vatar-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Vatar-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 12. ⬜ Zeydel-usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/Zeydel-usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 13. ⬜ 3nd-Oddiy-Iteratsiya-Usuli.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/3nd-Oddiy-Iteratsiya-Usuli.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

#### 14. ⬜ code.html
**Status:** TODO  
**Path:** `/src/Sonli-Usullar/code.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

---

### Utility Pages (in `/src/`)

#### 15. ⬜ about.html
**Status:** TODO  
**Path:** `/src/about.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="assets/css/dark-mode.css">
<script src="assets/js/dark-mode.js"></script>
```

**Note:** Different path! (one level up, not three)

---

#### 16. ⬜ privacy.html
**Status:** TODO  
**Path:** `/src/privacy.html`

**Action:** Add to `<head>`:
```html
<link rel="stylesheet" href="assets/css/dark-mode.css">
<script src="assets/js/dark-mode.js"></script>
```

**Note:** Different path! (one level up, not three)

---

## 📋 How to Apply Changes

### Method 1: Manual Edit Each File

1. Open the HTML file in your text editor
2. Locate the `<head>` section
3. Add the appropriate 2-line snippet (see above for each file)
4. Insert right after `<meta name="viewport"...>` or before other scripts
5. Save the file
6. Test by opening the page and clicking the toggle button (🌙)

### Method 2: Batch Edit with Find & Replace

If your editor supports this, you can use find & replace to add the same lines to multiple files.

### Path Reference

**For all `/src/Sonli-Usullar/*.html` files:**
```html
<link rel="stylesheet" href="../../src/assets/css/dark-mode.css">
<script src="../../src/assets/js/dark-mode.js"></script>
```

**For `/src/about.html` and `/src/privacy.html`:**
```html
<link rel="stylesheet" href="assets/css/dark-mode.css">
<script src="assets/js/dark-mode.js"></script>
```

**For `/index.html` (already done):**
```html
<link rel="stylesheet" href="src/assets/css/dark-mode.css">
<script src="src/assets/js/dark-mode.js"></script>
```

---

## ✅ Testing Each Page

After adding dark mode to a page:

1. Open the page in your browser
2. Look for the **toggle button** in top-right corner (🌙 or ☀️)
3. Click the button
4. Verify:
   - [ ] Background colors change
   - [ ] Text colors change
   - [ ] Buttons and inputs are styled correctly
   - [ ] All text is readable
   - [ ] Transitions are smooth
   - [ ] No console errors (F12)

---

## 📊 Quick Stats

| Category | Status | Count |
|----------|--------|-------|
| **Completed** | ✅ | 2 |
| **Remaining** | ⬜ | 14 |
| **Total** | - | 16 |
| **Progress** | 🟦🟦⬜⬜⬜⬜⬜⬜ | 12.5% |

---

## 🚀 Priority Order (Recommended)

1. **High Priority** (most visited):
   - Iteratsiya-Usuli.html ✅ (done)
   - Urinma-Usuli.html
   - Vatar-Usuli.html
   - KesmaniTengIkkigaBo'lish-Usuli.html

2. **Medium Priority** (frequently accessed):
   - Haydash-Usuli.html
   - Zeydel-usuli.html
   - FunksiyaKesishishNuqtasiAniqlash.html

3. **Lower Priority** (less frequently used):
   - Nazariya.html
   - code.html
   - about.html
   - privacy.html
   - Utility pages

---

## 💡 Tips

### Opening HTML Files
- Use VS Code, Sublime, or any text editor
- Search for `<head>` in the file (Ctrl+F)
- Add the 2 dark mode lines right after `<head>` opens

### Verifying Changes
After editing each file:
```bash
# Option 1: Open in browser
# Just double-click the HTML file or drag into browser

# Option 2: Use Live Server (VS Code)
# Install "Live Server" extension, right-click file → "Open with Live Server"
```

### Batch Verification
Create a simple script to check all pages:
```html
<!-- Save this as test_dark_mode.html -->
<html>
<body>
  <h1>Dark Mode Status</h1>
  <ul>
    <li><a href="index.html">index.html ✅</a></li>
    <li><a href="src/Sonli-Usullar/Iteratsiya-Usuli.html">Iteratsiya ✅</a></li>
    <li><a href="src/Sonli-Usullar/Urinma-Usuli.html">Urinma ⬜</a></li>
    <!-- Continue for all pages -->
  </ul>
</body>
</html>
```

---

## 📝 Completion Checklist

- [ ] 1. index.html ✅
- [ ] 2. Iteratsiya-Usuli.html ✅
- [ ] 3. Chats-Oddiy-Iteratsiya-Usuli.html
- [ ] 4. Chats-Zeydel-Usuli.html
- [ ] 5. FunksiyaKesishishNuqtasiAniqlash.html
- [ ] 6. Haydash-Usuli.html
- [ ] 7. KesmaniTengIkkigaBo'lish-Usuli.html
- [ ] 8. Nazariya.html
- [ ] 9. Oddiy-Nyuton-Usuli.html
- [ ] 10. Urinma-Usuli.html
- [ ] 11. Vatar-Usuli.html
- [ ] 12. Zeydel-usuli.html
- [ ] 13. 3nd-Oddiy-Iteratsiya-Usuli.html
- [ ] 14. code.html
- [ ] 15. about.html
- [ ] 16. privacy.html

---

## 🎉 Final Steps

After completing all pages:

1. **Test on all pages** — Click toggle on each page
2. **Test on mobile** — Use DevTools mobile emulation
3. **Test persistence** — Toggle, refresh, verify theme saved
4. **Test system preference** — Check if auto-detected
5. **Deploy** — Push to production

---

## 📞 Quick Help

**Question:** What if I get the file path wrong?

**Answer:** You'll see the toggle button won't appear, or styles won't apply. Check:
1. DevTools → Network tab (are CSS/JS files loaded?)
2. DevTools → Console (are there errors?)
3. Use relative paths from the HTML file location

**Question:** Do I need to edit every page?

**Answer:** For complete dark mode coverage, yes. But you can prioritize:
- Start with homepage and most popular pages
- Add to others gradually
- Optional: Use auto-inject script (inject-dark-mode.js)

**Question:** Can I customize colors per page?

**Answer:** Yes! You can override CSS variables in a `<style>` tag:
```html
<style>
  :root[data-theme="dark"] {
    --bg-primary: #1a2a3a;  /* Custom color for this page */
  }
</style>
```

---

## 🎯 What You're Building

A complete dark mode system where:
- ✅ Every page has a toggle button
- ✅ Theme preference is remembered
- ✅ System preference is respected
- ✅ All elements automatically theme
- ✅ No flickering or flashing
- ✅ Professional appearance
- ✅ Fully accessible

**Time to complete all pages:** 30-60 minutes (depending on method)

---

Good luck implementing dark mode across all pages! 🌙
