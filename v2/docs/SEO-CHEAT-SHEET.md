# ⚡ SEO CHEAT SHEET - QUICK REFERENCE

## 🎯 FIRST 5 STEPS (DO THIS FIRST)

```
1. COPY HEAD SECTION
   File: OPTIMIZED-HEAD-SECTION.html
   To: Your index.html <head>
   Time: 30 min

2. CREATE IMAGES
   OG 1200x630, OG 1000x1500, Favicons
   Tool: Canva.com or realfavicongenerator.net
   Time: 1-2 hours

3. DEPLOY FILES
   robots.txt → /robots.txt
   sitemap.xml → /sitemap.xml
   manifest.json → /manifest.json
   Time: 10 min

4. GOOGLE SETUP
   Create Google Search Console account
   Verify ownership
   Submit sitemap
   Time: 20 min

5. TEST & SUBMIT
   Test with Rich Results Tester
   Check Mobile-Friendly
   Check PageSpeed
   Time: 15 min

TOTAL: 4-8 HOURS FOR 50% OF SEO BENEFITS
```

---

## 📋 TITLE TAG FORMULA

**Format:** `[Keyword] | [Modifier] | [Brand]`

**Examples:**
- Newton's Method Calculator | Step-by-Step Solver | Sonli Usullar
- Bisection Method Online | Root Finding Tool | Sonli Usullar
- Numerical Methods Tutorial | Complete Guide | Sonli Usullar

**Rules:**
- Max 60 characters
- Include primary keyword first
- Make it compelling (improves CTR)
- Keep brand name at end
- No keyword stuffing

---

## 📝 META DESCRIPTION FORMULA

**Format:** `[Value] + [Features] + [Details]`

**Example:**
"Free Newton's method calculator with step-by-step visualization. Calculate roots instantly with convergence tracking and error analysis."

**Rules:**
- 155 characters max
- Start with benefit/action word
- Include 2-3 key features
- Make user want to click
- Unique per page

---

## 🔗 HREFLANG TEMPLATE (Copy & Paste)

**Add to every page's `<head>`:**
```html
<link rel="alternate" hreflang="en" href="https://sonli-usullar.uz/">
<link rel="alternate" hreflang="uz" href="https://sonli-usullar.uz/uz/">
<link rel="alternate" hreflang="x-default" href="https://sonli-usullar.uz/">
```

**URL Changes per page:**
- English: `/methods/newton-method/`
- Uzbek: `/uz/methods/newton-method/`
- Default: Same as English

---

## 🏠 HEADING STRUCTURE

**Rule: ONE H1 per page**

```html
<h1>Page Main Topic (with keyword)</h1>
  <h2>Subtopic</h2>
    <h3>Sub-subtopic</h3>
  <h2>Another Subtopic</h2>
    <h3>Details</h3>
```

**Example:**
```html
<h1>Newton's Method Calculator - Find Function Roots</h1>
  <h2>How Newton's Method Works</h2>
    <h3>Algorithm Steps</h3>
  <h2>Using the Calculator</h2>
    <h3>Input Your Function</h3>
```

**Don't:**
- ❌ Multiple H1s
- ❌ Skip levels (H1 → H3)
- ❌ Keyword stuffing in headings

---

## 📊 CORE WEB VITALS TARGETS

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** | < 2.5s | ✅ Pass |
| **INP** | < 200ms | ✅ Pass |
| **CLS** | < 0.1 | ✅ Pass |

**How to Check:** https://pagespeed.web.dev/

**Too Slow?**
- LCP: Optimize images, lazy load, minify JS
- INP: Break up long tasks, remove unused code
- CLS: Set image dimensions, avoid dynamic content

---

## 🖼️ OPEN GRAPH IMAGE SIZES

| Platform | Size | Format |
|----------|------|--------|
| **Facebook/LinkedIn** | 1200x630 | JPEG |
| **Pinterest** | 1000x1500 | JPEG |
| **Twitter** | 1200x675 | JPEG |
| **Generic** | 1200x630 | JPEG |

**Must Have:**
- Logo/brand visible
- Clear headline text
- High contrast colors
- Optimized < 200 KB

---

## 📱 FAVICON SET NEEDED

```
favicon.svg ..................... Scalable for all
favicon-192x192.png ........... Android app icon
favicon-512x512.png ........... App large icon
apple-touch-icon-180x180.png . iOS home screen
```

**Easiest:** Use realfavicongenerator.net (generates all sizes)

---

## 🔍 SEO CHECKLIST

### On Every Page:
- [ ] Unique title (60 chars max)
- [ ] Unique meta description (155 chars max)
- [ ] One H1 tag with keyword
- [ ] Logical heading hierarchy
- [ ] Image alt text on all images
- [ ] hreflang tags for language variants
- [ ] JSON-LD schema appropriate to content
- [ ] Internal links (3-5 per page)
- [ ] Mobile-friendly responsive

### Site Level:
- [ ] robots.txt deployed
- [ ] sitemap.xml deployed
- [ ] manifest.json deployed
- [ ] Google Search Console: verified
- [ ] Sitemap: submitted to GSC
- [ ] Analytics: tracking installed
- [ ] Core Web Vitals: monitored
- [ ] No broken links (404s)
- [ ] HTTPS: enabled site-wide
- [ ] Favicons: all sizes present

---

## 📈 RANKING FACTORS (PRIORITY ORDER)

1. **Content Quality** (most important)
   - Comprehensive, accurate, helpful
   - Longer content (1,500+ words) ranks better
   - Original research/unique angle helps

2. **Core Web Vitals** (major 2025 factor)
   - LCP < 2.5s, INP < 200ms, CLS < 0.1
   - Mobile speed critical

3. **Mobile-First Design**
   - Mobile version indexes first
   - Must be responsive and fast

4. **Backlinks** (quality > quantity)
   - Links from authoritative sites
   - Relevant anchor text helps

5. **User Behavior**
   - CTR from search results
   - Time on page, bounce rate
   - Share/engagement signals

6. **Freshness**
   - Recent content preferred
   - Update dates important
   - Keep old content current

7. **E-E-A-T** (Expertise, Experience, Authoritativeness, Trustworthiness)
   - Author credibility
   - Site authority in topic
   - Trust signals

---

## 🎯 KEYWORD PLACEMENT

**Primary keyword should appear in:**
- ✅ Title tag (first 60 chars)
- ✅ Meta description
- ✅ H1 heading
- ✅ First 100 words of content
- ✅ URL slug (ideally)
- ✅ Image alt text

**Density:** 1-2% of total content words (e.g., 15-30 times in 1500-word article)

**Rule:** Natural language first, keyword optimization second. Never write for search engines, write for humans.

---

## 📊 GOOGLE SEARCH CONSOLE SETUP

### 1. Add Property
https://search.google.com/search-console/
→ Add property → Enter URL

### 2. Verify Ownership
Options:
- HTML meta tag (easiest)
- DNS record
- HTML file upload
- Google Analytics

Choose HTML meta tag, copy to `<head>`

### 3. Submit Sitemap
Settings → Sitemaps → Add sitemap
→ Enter: `https://sonli-usullar.uz/sitemap.xml`

### 4. Monitor Weekly
- Coverage report (all pages indexed?)
- Performance report (rankings, CTR)
- Core Web Vitals report

---

## 🧪 TESTING TOOLS

| Tool | Purpose | URL |
|------|---------|-----|
| **Rich Results Test** | Schema validation | https://search.google.com/test/rich-results |
| **Mobile-Friendly** | Mobile rendering | https://search.google.com/test/mobile-friendly |
| **PageSpeed Insights** | Core Web Vitals | https://pagespeed.web.dev/ |
| **OG Image Preview** | Social sharing | https://developers.facebook.com/tools/debug/sharing/ |
| **Lighthouse** | Overall SEO | Chrome DevTools → Lighthouse |

---

## ⏰ MONTHLY MAINTENANCE CHECKLIST

- [ ] Monitor rankings in Google Search Console
- [ ] Check Core Web Vitals (PageSpeed Insights)
- [ ] Update old content (refresh dates)
- [ ] Analyze traffic in Google Analytics
- [ ] Fix any crawl errors in GSC
- [ ] Update sitemap if new pages added
- [ ] Monitor competitor rankings
- [ ] Plan new content for ranking opportunities

---

## 💡 QUICK WINS (Highest Impact)

1. **Add OG Images** (+30% social CTR)
   Time: 2 hours
   Impact: IMMEDIATE

2. **Fix Duplicate Titles** (+10% ranking boost)
   Time: 2 hours
   Impact: 2-4 weeks

3. **Add Meta Descriptions** (+20% CTR)
   Time: 2 hours
   Impact: 1-2 weeks

4. **Add JSON-LD Schema** (+2-3x rich snippet CTR)
   Time: 4 hours
   Impact: 2-4 weeks

5. **Fix Core Web Vitals** (+5% ranking boost)
   Time: 4-8 hours
   Impact: 4-8 weeks

**Total: 16 hours work = 60% of total SEO improvements**

---

## ❌ NEVER DO THIS

```
❌ Use same title on multiple pages
❌ Copy descriptions from competitors
❌ Keyword stuff (unnatural text)
❌ Add noindex without reason
❌ Leave duplicate content without hreflang
❌ Block important pages in robots.txt
❌ Ignore Core Web Vitals
❌ Use hidden text (can penalize)
❌ Buy low-quality backlinks
❌ Cloak content (show different to Google)
❌ Create thin/low-quality pages
❌ Use automatic translation without review
```

---

## 📞 QUICK HELP

**Page not ranking?**
- Check Google Search Console for errors
- Ensure page is indexed (not noindex)
- Check if robots.txt is blocking
- Wait longer (3-6 months minimum)

**CTR too low?**
- Rewrite title (make more compelling)
- Improve meta description
- Add schema markup (rich snippets)
- Check if date is current (appears stale?)

**Traffic not growing?**
- Increase number of pages (more keywords)
- Improve content quality
- Add internal links strategically
- Create content for new keywords

**Core Web Vitals failing?**
- Optimize images (WebP, compression)
- Lazy load images and components
- Remove unused JavaScript
- Set width/height on all images

---

## 🎯 FIRST WEEK ACTION ITEM

**Monday:** Copy OPTIMIZED-HEAD-SECTION.html to your site
**Tuesday:** Create 2 OG images using Canva
**Wednesday:** Create favicon set using realfavicongenerator.net
**Thursday:** Deploy robots.txt, sitemap.xml, manifest.json
**Friday:** Create Google Search Console account & submit sitemap

**By End of Week:**
✅ All critical SEO files deployed
✅ Google Search Console set up
✅ Sitemap submitted
✅ Initial crawl in progress

**By End of Month:**
✅ All pages indexed
✅ Pages starting to appear in search results
✅ Monitor for improvements

---

**Print this sheet and keep it handy!**

Last Updated: April 2, 2026
