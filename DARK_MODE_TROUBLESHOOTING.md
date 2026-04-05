# 🔧 Dark Mode — Troubleshooting Guide

## Quick Diagnostics

### **The toggle button is not showing**

#### Possible Causes:
1. CSS/JS files not loaded
2. Incorrect file paths
3. JavaScript error preventing execution
4. HTML syntax error

#### How to Fix:

**Step 1: Check if files are loaded**
```
1. Open Developer Tools (F12 or Ctrl+Shift+I)
2. Go to "Network" tab
3. Look for:
   - dark-mode.css
   - dark-mode.js
4. They should show status "200" (loaded successfully)
5. If missing, file paths are wrong
```

**Step 2: Check for JavaScript errors**
```
1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Look for red error messages
4. Common errors:
   ✗ "Cannot find dark-mode.js" → Wrong file path
   ✗ "404 Not Found" → File doesn't exist or path is incorrect
   ✗ Syntax errors → Check file was saved correctly
```

**Step 3: Verify file paths**

Check the paths match your file location:

```
Your HTML File Location       | CSS Path                    | JS Path
─────────────────────────────┼────────────────────────────┼─────────────────────────
/index.html                  | src/assets/css/dark-mode.css | src/assets/js/dark-mode.js
/src/about.html              | assets/css/dark-mode.css   | assets/js/dark-mode.js
/src/Sonli-Usullar/method.html | ../../src/assets/css/... | ../../src/assets/js/...
```

**Step 4: Verify links in HTML**

Open your HTML file and check:

```html
<!-- These two lines must be present in <head> -->
<link rel="stylesheet" href="path/to/dark-mode.css">
<script src="path/to/dark-mode.js"></script>

<!-- Not in body! -->
<!-- Not at the end of html! -->
<!-- Must be in <head> -->
```

---

### **Colors are not changing when I toggle**

#### Possible Causes:
1. CSS file not loaded
2. HTML element is missing `data-theme` attribute
3. Other CSS is overriding the theme colors
4. Browser not applying CSS variables

#### How to Fix:

**Step 1: Verify CSS is loaded**
```
1. DevTools → Network tab
2. Find "dark-mode.css"
3. Click on it
4. Check "Response" tab shows CSS content
5. If empty or 404, file path is wrong
```

**Step 2: Check HTML element for data-theme**
```
1. DevTools → Elements tab
2. Find the <html> tag at the top
3. It should look like: <html data-theme="dark">
4. If missing data-theme, dark-mode.js didn't run
5. Check Console for errors
```

**Step 3: Check if other CSS overrides**

If styles have higher specificity, they override theme variables:

```css
/* ❌ Wrong (too specific, overrides variables) */
body {
  background-color: white !important;  /* This beats var(--bg-primary) */
}

/* ✅ Correct (uses variables) */
body {
  background-color: var(--bg-primary);
}
```

Find and fix hardcoded colors in your CSS.

**Step 4: Check in DevTools**
```
1. DevTools → Elements tab
2. Right-click any element
3. Select "Inspect" or "Inspect Element"
4. Look at Styles panel on right
5. Find the element's background/color
6. Should show: background-color: var(--bg-primary)
7. Check Computed tab to see actual color value
```

**Step 5: Force refresh browser**
```
Hard refresh (clears cache):
  Windows: Ctrl+Shift+R
  Mac: Cmd+Shift+R
  
This forces browser to reload CSS files.
```

---

### **Page is flickering when it loads**

#### Possible Causes:
1. dark-mode.js is not in `<head>`
2. dark-mode.js runs after page content
3. Page renders before theme is applied

#### How to Fix:

**Step 1: Verify script location**

❌ **WRONG** (at end of body):
```html
<html>
  <head>
    <!-- Other stuff -->
  </head>
  <body>
    <!-- All your content -->
    
    <script src="dark-mode.js"></script>  <!-- ❌ TOO LATE! -->
  </body>
</html>
```

✅ **CORRECT** (in head, early):
```html
<html>
  <head>
    <!-- Dark mode FIRST -->
    <script src="dark-mode.js"></script>
    
    <!-- Then other stuff -->
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- Content here -->
  </body>
</html>
```

**Step 2: Check execution order**

The dark-mode.js must run **before** page content loads:

```
Timeline:
1. HTML parser starts
2. dark-mode.css is loaded ✅
3. dark-mode.js executes ✅ (applies theme before page renders)
4. Page content starts rendering ✅
5. Rest of scripts and stylesheets load

NOT:
1. Page content renders
2. dark-mode.js runs
3. Colors flash/change → FOUC ❌
```

**Step 3: Test with slow network**

To see if your theme applies before rendering:

```
1. DevTools → Network tab
2. Throttle to "Slow 3G"
3. Refresh page
4. Watch as page loads
5. Should NOT see white flash before dark mode appears
6. If you see flickering, move dark-mode.js to <head>
```

---

### **Theme preference is not saving**

#### Possible Causes:
1. localStorage is disabled
2. Browser is in private/incognito mode
3. localStorage quota exceeded
4. Browser cookies/storage settings

#### How to Fix:

**Step 1: Check if localStorage works**

Open DevTools Console and run:
```javascript
// Test if localStorage is available
try {
  localStorage.setItem('test', 'value');
  console.log('✓ localStorage works');
  localStorage.removeItem('test');
} catch (e) {
  console.log('✗ localStorage disabled:', e.message);
}
```

**Step 2: Check saved preference**

In DevTools Console:
```javascript
// See what's saved
const saved = localStorage.getItem('theme-preference');
console.log('Saved theme:', saved);  // Should print 'light' or 'dark'

// Check all localStorage
console.log('All localStorage:', localStorage);
```

**Step 3: Check browser settings**

**Windows/Chrome/Edge:**
- Settings → Privacy → Clear browsing data
- Check "Cookies and other site data"
- Make sure you're NOT in Incognito mode

**macOS/Safari:**
- Safari → Preferences → Privacy
- Check "Block cross-site tracking"
- May affect localStorage

**Firefox:**
- Settings → Privacy & Security
- Check "Enhanced Tracking Protection"
- History: "Firefox will" → "Remember history"

**Step 4: Test in private window**

Private/Incognito mode **disables localStorage**:
```
1. Open new private/incognito window
2. Navigate to page
3. Toggle dark mode
4. Refresh page
5. Will revert to system preference (localStorage disabled)
6. This is expected browser behavior
```

Close private window and use normal window for testing.

**Step 5: Manual localStorage test**

In Console, manually set and get:
```javascript
// Set
localStorage.setItem('theme-preference', 'dark');

// Get
console.log(localStorage.getItem('theme-preference'));  // Should print: 'dark'

// Check if toggle picks it up
window.DarkMode.get();  // Should return: 'dark'
```

---

### **System dark mode preference is not detected**

#### Possible Causes:
1. User has manually set preference in localStorage
2. System `prefers-color-scheme` is not available
3. Browser doesn't support `prefers-color-scheme`
4. OS setting change requires browser restart

#### How to Fix:

**Step 1: Clear manual preference**

System preference only applies if NO localStorage value:

```javascript
// In DevTools Console, clear saved preference
localStorage.removeItem('theme-preference');

// Refresh page
location.reload();
```

Now system preference should be detected.

**Step 2: Check system preference detection**

In DevTools Console:
```javascript
// Check if browser detects dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log('System prefers dark:', prefersDark);

// Should print: true or false
```

**Step 3: Check what dark-mode.js sees**

```javascript
// What does the system think?
const currentTheme = window.DarkMode.get();
console.log('Current theme:', currentTheme);

// Check localStorage
const saved = localStorage.getItem('theme-preference');
console.log('Saved preference:', saved);  // null or 'light'/'dark'
```

**Step 4: Change OS theme setting**

**Windows:**
- Settings → Personalization → Colors
- Toggle Dark/Light mode
- Refresh browser page
- Should switch theme

**macOS:**
- System Preferences → General
- Toggle Appearance (Dark/Light)
- Refresh browser page
- Should switch theme

**Linux:**
- Desktop Environment settings
- Set dark/light theme
- Refresh browser page

---

### **Toggle button is broken or unresponsive**

#### Possible Causes:
1. JavaScript error preventing click handler
2. CSS hiding the button
3. Button has display: none
4. Event listener not attached

#### How to Fix:

**Step 1: Check if button exists in DOM**

```
1. DevTools → Elements tab
2. Press Ctrl+F (search)
3. Type: "dark-mode-toggle"
4. Should find the button
5. If not found, check Console for errors
```

**Step 2: Check button visibility**

```
1. Right-click toggle button
2. Select "Inspect"
3. Look at Styles panel
4. Check for:
   ✗ display: none
   ✗ visibility: hidden
   ✗ opacity: 0
   ✗ z-index: -999
5. These would hide the button
```

**Step 3: Test click handler**

In DevTools Console:
```javascript
// Manually trigger toggle
window.DarkMode.toggle();

// Page should switch theme
// Check if it works (means button handler is fine, just not firing)
```

**Step 4: Check Console for errors**

```
1. Click toggle button
2. Open DevTools Console (F12)
3. Look for any red errors
4. Common errors:
   ✗ "Cannot read property 'toggle' of undefined"
     → dark-mode.js didn't load
   ✗ "Syntax error in dark-mode.js"
     → File is corrupted, re-download
   ✗ "elementId is null"
     → Button wasn't injected, check Network tab
```

**Step 5: Manual button re-inject**

If button won't appear:
```javascript
// Inject it manually
window.DarkMode.injectToggle();

// Should create button in top-right corner
```

---

### **Styles/colors are inconsistent across pages**

#### Possible Causes:
1. Different file paths on different pages
2. Some pages missing dark-mode CSS/JS
3. Different CSS customizations per page
4. Cache issues between pages

#### How to Fix:

**Step 1: Verify all pages have dark mode**

Create a test file that lists all pages:
```html
<!-- test_dark_mode_pages.html -->
<html>
<body>
  <h1>Dark Mode Pages Check</h1>
  <ul>
    <li><a href="index.html">index.html</a></li>
    <li><a href="src/about.html">about.html</a></li>
    <li><a href="src/Sonli-Usullar/method.html">method.html</a></li>
  </ul>
  <p>Visit each link. Toggle should work on all.</p>
</body>
</html>
```

Test each page — toggle button should appear on all.

**Step 2: Check file paths**

If some pages don't have toggle:
```
1. View page source (Ctrl+U)
2. Find dark-mode CSS/JS links
3. Check paths are correct for that page's location
4. Test each path manually in address bar
5. All should load with 200 status
```

**Step 3: Compare working vs non-working page**

**Working page (e.g., index.html):**
```html
<head>
  <link rel="stylesheet" href="src/assets/css/dark-mode.css">
  <script src="src/assets/js/dark-mode.js"></script>
</head>
```

**Check non-working page has same structure:**
```html
<head>
  <!-- Must have these lines, with correct paths -->
  <link rel="stylesheet" href="...">
  <script src="..."></script>
</head>
```

**Step 4: Clear browser cache**

Inconsistencies might be cached:
```
Windows: Ctrl+Shift+Delete
Mac: Cmd+Shift+Delete
Chrome: Settings → Clear browsing data

Then refresh all pages (Ctrl+Shift+R)
```

---

### **Colors look wrong or have poor contrast**

#### Possible Causes:
1. CSS variables are overridden
2. Custom colors don't match theme
3. Accessibility contrast too low
4. Monitor/display color settings

#### How to Fix:

**Step 1: Check CSS variable values**

In DevTools Console:
```javascript
// Get light mode colors
getComputedStyle(document.documentElement)
  .getPropertyValue('--text-primary');

// Get dark mode colors
document.documentElement.setAttribute('data-theme', 'dark');
getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-primary');
```

**Step 2: Verify color contrast**

Light text on dark background should be:
- Light: #f1f5f9 text on #0f172a background = high contrast ✓
- Dark: #0f172a text on #ffffff background = high contrast ✓

If colors look wrong:
1. Check Monitor/Display color settings
2. Test on different monitor
3. Check if using color blind friendly mode

**Step 3: Customize colors if needed**

Edit `/src/assets/css/dark-mode.css`:
```css
:root[data-theme="dark"] {
  --bg-primary: #0f172a;  /* Change this */
  --text-primary: #f1f5f9;  /* Or this */
}
```

**Step 4: Check accessibility**

Test contrast using online tools:
1. Go to https://www.tpadesign.com/contrast-checker
2. Enter your colors
3. Check WCAG AA compliance
4. If fails, adjust colors

---

### **Page loads in wrong theme then flashes to correct theme**

#### This is FOUC (Flash of Unstyled Content)

#### Causes:
1. dark-mode.js is not in `<head>`
2. CSS loads after HTML renders
3. JavaScript loads too late

#### Solution:

Move dark-mode links to the very beginning of `<head>`:

```html
❌ WRONG:
<head>
  <meta charset="UTF-8">
  <meta name="viewport"...>
  <title>...</title>
  <!-- Lots of other stuff -->
  <script src="dark-mode.js"></script>  <!-- TOO LATE -->
</head>

✅ CORRECT:
<head>
  <!-- Dark mode FIRST -->
  <link rel="stylesheet" href="dark-mode.css">
  <script src="dark-mode.js"></script>
  
  <!-- THEN everything else -->
  <meta charset="UTF-8">
  <meta name="viewport"...>
  <title>...</title>
</head>
```

---

### **JavaScript console shows errors**

#### Common Error Messages

**"Cannot read property 'getAttribute' of null"**
- Cause: HTML element doesn't exist yet
- Solution: Ensure dark-mode.js is in `<head>`

**"dark-mode.css: Failed to load resource"**
- Cause: File path is wrong
- Solution: Check file path, verify file exists

**"Uncaught SyntaxError"**
- Cause: JavaScript file is corrupted
- Solution: Re-download or recreate the file

**"localStorage is not defined"**
- Cause: Browser privacy mode, very old browser
- Solution: Use normal browsing mode, update browser

**"window.DarkMode is undefined"**
- Cause: dark-mode.js didn't load/execute
- Solution: Check Network tab, check file path

---

## Advanced Debugging

### Enable Debug Mode

Add this to console to see internal logs:

```javascript
// Before loading page, add to dark-mode.js temporary:
console.log('[v0] Dark mode initialization started');
console.log('[v0] Saved theme:', localStorage.getItem('theme-preference'));
console.log('[v0] System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);
console.log('[v0] Applied theme:', document.documentElement.getAttribute('data-theme'));
```

### Step-by-Step Trace

Manually run dark mode initialization:

```javascript
// 1. Check localStorage
localStorage.getItem('theme-preference');  // null or 'light'/'dark'

// 2. Check system preference
window.matchMedia('(prefers-color-scheme: dark)').matches;  // true/false

// 3. Check current theme
document.documentElement.getAttribute('data-theme');  // 'light' or 'dark'

// 4. Check toggle button exists
document.getElementById('dark-mode-toggle');  // should show button element

// 5. Test toggle
window.DarkMode.toggle();  // should switch theme

// 6. Check after toggle
document.documentElement.getAttribute('data-theme');  // should be new theme
```

---

## Performance Debugging

### Check file sizes

```
1. DevTools → Network tab
2. Reload page
3. Find dark-mode.css and dark-mode.js
4. Check "Size" column:
   ✓ dark-mode.css should be ~10KB
   ✓ dark-mode.js should be ~4KB
5. Check "Transferred" column (gzip):
   ✓ dark-mode.css should be ~6KB
   ✓ dark-mode.js should be ~2KB
```

### Check load time

```
1. DevTools → Network tab
2. Reload page
3. Look at dark-mode.js timing
4. Should be in first 100ms
5. If slower, your server is slow (not dark mode issue)
```

---

## Getting Help

If you're still stuck:

1. **Check the documentation:**
   - Read `DARK_MODE_SETUP.md` for complete guide
   - Review `DARK_MODE_QUICK_REFERENCE.txt`
   - Open `DARK_MODE_EXAMPLE.html` in browser

2. **Verify setup:**
   - Use `DARK_MODE_PAGES_CHECKLIST.md`
   - Check `DARK_MODE_ARCHITECTURE.txt` for how it works

3. **Debug systematically:**
   - Check each step in this guide
   - Open DevTools Console (F12)
   - Check Network tab for file loading
   - Check Elements tab for HTML structure

4. **Common fixes:**
   - Hard refresh: Ctrl+Shift+R
   - Clear cache: Ctrl+Shift+Delete
   - Check file paths
   - Move dark-mode.js to `<head>`
   - Re-download files if corrupted

---

## Still Not Working?

**Last resort checklist:**

- [ ] dark-mode.js is in `<head>` before other scripts
- [ ] dark-mode.css is loaded in `<head>`
- [ ] File paths are correct (test each file in address bar)
- [ ] No typos in filenames
- [ ] HTML file is saved with these changes
- [ ] Browser cache is cleared (hard refresh)
- [ ] You're not in private/incognito mode
- [ ] DevTools Console shows no errors
- [ ] Toggle button appears when DevTools Network shows files loaded
- [ ] You waited 2+ seconds for page to fully load before testing

If all above pass, the system should work. If still issues, try:
1. Copy a working file (like index.html) as template
2. Gradually add content to it
3. Test at each step to isolate the issue

---

**Good luck debugging! 🔧🌙**
