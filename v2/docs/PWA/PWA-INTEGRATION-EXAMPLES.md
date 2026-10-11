# PWA Integration Examples

## 🎯 How to Add PWA to Your Pages

### Example 1: Simple HTML Page

#### ❌ BEFORE (without PWA)
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="path/to/styles.css">
</head>
<body>
  <h1>About Us</h1>
  <p>Page content here...</p>
  
  <script src="path/to/script.js"></script>
</body>
</html>
```

#### ✅ AFTER (with PWA enabled)
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="path/to/styles.css">
</head>
<body>
  <h1>About Us</h1>
  <p>Page content here...</p>
  
  <script src="path/to/script.js"></script>
  
  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

**What changed?** Just added lines 18-19 ⬆️

---

### Example 2: Page with Multiple Scripts

#### ❌ BEFORE
```html
<body>
  <div class="container">
    <h1>Newton's Method Calculator</h1>
    <!-- Content -->
  </div>

  <!-- Analytics -->
  <script async src="https://cdn.analytics.com/track.js"></script>
  
  <!-- Your site scripts -->
  <script src="../../assets/js/sidebar.js"></script>
  <script src="../../assets/js/calculator.js"></script>

</body>
</html>
```

#### ✅ AFTER
```html
<body>
  <div class="container">
    <h1>Newton's Method Calculator</h1>
    <!-- Content -->
  </div>

  <!-- Analytics -->
  <script async src="https://cdn.analytics.com/track.js"></script>
  
  <!-- Your site scripts -->
  <script src="../../assets/js/sidebar.js"></script>
  <script src="../../assets/js/calculator.js"></script>

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

**Key point:** Add PWA registration AFTER your other scripts ⬆️

---

### Example 3: Page with Head Manager

#### ❌ BEFORE (with head-manager.js)
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Iteratsiya Usuli - Sonli Usullar</title>
  
  <script>
    window.HEAD_BASE = '../../';
  </script>
  <script src="../../assets/js/head-manager.js"></script>
</head>
<body>
  <h1>Iteration Method</h1>
  <p>Content with formulas, calculations, etc.</p>

  <footer>
    <p>© 2026 Sonli Usullar</p>
  </footer>
</body>
</html>
```

#### ✅ AFTER
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Iteratsiya Usuli - Sonli Usullar</title>
  
  <script>
    window.HEAD_BASE = '../../';
  </script>
  <script src="../../assets/js/head-manager.js"></script>
</head>
<body>
  <h1>Iteration Method</h1>
  <p>Content with formulas, calculations, etc.</p>

  <footer>
    <p>© 2026 Sonli Usullar</p>
  </footer>

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

**Same pattern:** Add PWA script at the very end ⬆️

---

### Example 4: Page with Custom Footer & Navigation

#### ❌ BEFORE
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Method Page - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/src/about.html">About</a>
  </nav>

  <main>
    <h1>Page Title</h1>
    <div class="content">
      <!-- Content here -->
    </div>
  </main>

  <footer>
    <p>Footer content</p>
    <p>© 2026</p>
  </footer>

  <script src="/assets/js/sidebar.js"></script>
  <script src="/assets/js/calculator.js"></script>
</body>
</html>
```

#### ✅ AFTER
```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Method Page - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/src/about.html">About</a>
  </nav>

  <main>
    <h1>Page Title</h1>
    <div class="content">
      <!-- Content here -->
    </div>
  </main>

  <footer>
    <p>Footer content</p>
    <p>© 2026</p>
  </footer>

  <script src="/assets/js/sidebar.js"></script>
  <script src="/assets/js/calculator.js"></script>

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

**Pattern is consistent:** PWA script goes at the very end ⬆️

---

## 🎨 Showing Install Button (Optional)

If you want to show an explicit "Install App" button, add this HTML:

```html
<button id="pwa-install-btn" style="display: none;">
  📱 Install App
</button>
```

The button will:
- Display only when installation is available
- Automatically styled
- Trigger the install prompt when clicked
- Hide after app is installed

### Example with Install Button

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Sonli Usullar</title>
</head>
<body>
  <!-- Install Button (hidden until available) -->
  <header>
    <h1>Sonli Usullar</h1>
    <button id="pwa-install-btn" style="display: none;">
      📱 Install App
    </button>
  </header>

  <main>
    <!-- Page content -->
  </main>

  <!-- PWA Registration -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

---

## 🖥️ Using Offline Status Classes (Optional)

The PWA script automatically adds classes to the `<body>` tag:

```html
<body class="online">   <!-- When online -->
  <!-- content -->
</body>

<body class="offline">  <!-- When offline -->
  <!-- content -->
</body>
```

You can use CSS to style based on connection status:

```css
/* Style when online */
body.online .online-only {
  display: block;
}

body.offline .online-only {
  opacity: 0.5;
  pointer-events: none;
}

/* Show offline indicator -->
body.offline::before {
  content: "Offline Mode";
  position: fixed;
  top: 0;
  right: 0;
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  z-index: 9999;
}
```

Then in your HTML:

```html
<div class="online-only">
  <button onclick="syncData()">Sync Data</button>
</div>

<div class="offline-only" style="display: none;">
  <p>You are offline. Changes will sync when online.</p>
</div>
```

---

## 📋 Template for Each Page Type

### Type A: Simple Static Page

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <!-- Your content here -->

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

### Type B: Page with Multiple Scripts

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Sonli Usullar</title>
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <!-- Your content here -->

  <!-- Your existing scripts -->
  <script src="/path/to/your/script.js"></script>

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

### Type C: Page with Head Manager

```html
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Sonli Usullar</title>
  
  <script>
    window.HEAD_BASE = '../../'; // Adjust based on location
  </script>
  <script src="../../assets/js/head-manager.js"></script>
</head>
<body>
  <!-- Your content here -->

  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
</html>
```

---

## ✅ Verification Checklist for Each Page

After adding the PWA script to a page:

- [ ] Script tag added before `</body>`
- [ ] Path is absolute: `/sw-register.js` (not relative)
- [ ] No console errors (F12 → Console)
- [ ] See `[PWA] Service Worker registered` message
- [ ] Can go offline and page still loads
- [ ] See update notification if available

---

## 🚀 Quick Copy-Paste Snippets

### For `/src/` pages (about.html, privacy.html)

```html
  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
```

### For `/src/Sonli-Usullar/` pages

```html
  <!-- PWA: Service Worker Registration & Install Prompt -->
  <script src="/sw-register.js"></script>

</body>
```

**Same in both cases!** The absolute path works everywhere.

---

## 🔍 Common Mistakes to Avoid

### ❌ Wrong: Using relative path
```html
<!-- This will NOT work from all pages -->
<script src="../../sw-register.js"></script>
```

### ✅ Correct: Using absolute path
```html
<!-- This works from ALL pages -->
<script src="/sw-register.js"></script>
```

### ❌ Wrong: Placing in head
```html
<head>
  <!-- Don't put it here -->
  <script src="/sw-register.js"></script>
</head>
```

### ✅ Correct: Placing before closing body
```html
<body>
  <!-- content -->
  
  <!-- Put it here -->
  <script src="/sw-register.js"></script>
</body>
```

### ❌ Wrong: Multiple instances
```html
<body>
  <!-- content -->
  <script src="/sw-register.js"></script>
  <script src="/sw-register.js"></script>  <!-- Duplicate, unnecessary -->
</body>
```

### ✅ Correct: Single instance
```html
<body>
  <!-- content -->
  <script src="/sw-register.js"></script>  <!-- Just one -->
</body>
```

---

## 📊 Summary

| Aspect | Details |
|--------|---------|
| **Script Path** | `/sw-register.js` (absolute) |
| **Placement** | Right before `</body>` |
| **Instances** | One per HTML file |
| **Frequency** | Add to all 15 remaining pages |
| **Time per page** | 1-2 minutes manual |
| **Total for all** | ~20 minutes manual or 1 second auto-batch |

---

## 🎯 Final Step

**Once all pages have the script:**

1. Visit your website
2. Press F12 → Console
3. Should see: `[PWA] Service Worker registered successfully`
4. Go offline in DevTools
5. All pages should load from cache
6. Done! 🎉

---

*PWA Integration Examples v1.0*
*Last Updated: 2026-04-05*
