# Changelog

All notable changes to the **Numeric Methods** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.6] - 2026-10-14

### Added
- **Euler Method Step-by-Step Derivation Panel (`/methods/euler`):**
  - Added an academic "Daftarga ko'chirish uchun bosqichma-bosqich yechim" collapsible panel detailing Cauchy problem parameters, iterative arithmetic substitution for each step $i$, predictor-corrector calculations, and formatted copyable result tables.
  - Implemented dynamic analytical ODE solving for separable and 1st-order linear differential equations, computing exact closed-form solutions $y(x)$, exact values $y^*(x_i)$, and absolute error tracking.
  - Added informative status badges explaining when an ODE does not admit an elementary closed-form analytical solution.
  - Added localized Cauchy condition badges and refined step table localization (Takomillashgan Eyler / Heun).

### Fixed
- **Lagrange Interpolation Table Layout (`/methods/lagrange`):**
  - Redesigned the node input table (`PointTable`) using fixed-width table layout and responsive input paddings to completely eliminate horizontal scrolling.
  - Balanced the section 01 input nodes table columns (`w-1/3 text-center`) to fix right-skewing and ensure symmetrical alignment.

### Changed
- **Navigation & Methods Hub Icons:**
  - Assigned mathematically appropriate icons across navigation and the dashboard methods hub:
    - **Haydash (Thomas/TDMA) Method:** Updated to `ArrowRightLeft` representing forward and backward elimination sweep passes.
    - **Lagrange Interpolation:** Updated to `Spline` representing continuous polynomial curve fitting through interpolation nodes.
- **Haydash (Thomas/TDMA) Method Workspace (`/methods/sweep`):**
  - Refactored layout to follow spacious V2 layout conventions with separate dimension controls and streamlined coefficient matrices.

---

## [3.0.5] - 2026-10-13

### Added
- Added the Haydash (Thomas/TDMA) method for tridiagonal systems, with editable coefficients, forward and backward walkthroughs, and full-precision residual verification.

---

## [3.0.4] - 2026-10-13

### Fixed
- Corrected the signed Windows updater manifest to use the exact installer URL published in GitHub Releases.
- Opened Android APK downloads in the system browser and clarified the Android install confirmation steps.

---

## [3.0.3] - 2026-10-13

### Added
- Added the Newton tangent method with finite-difference derivatives, V2-compatible starting-point selection, and a detailed iteration walkthrough.

---

## [3.0.2] - 2026-10-13

### Fixed
- Enabled signed Tauri updater artifacts and publication of the `latest.json` manifest required for in-app Windows updates.
- Kept desktop updates on the signed native updater path instead of silently downloading a standalone installer in a browser.
- Uploaded Android APKs to existing GitHub Releases through the GitHub CLI and required a persistent signing keystore for upgrade compatibility.

---

## [3.0.1] - 2026-10-13

### 🎨 UI & UX Improvements
- **Interactive Methods Catalog Hub (`/`):**
  - Integrated full methods catalog on the workspace dashboard with category filter pills (`All`, `Equations`, `Interpolation`, `Quadrature`, `ODEs`).
  - Added live instant search filtering, KaTeX-rendered mathematical formulas, convergence order badges, and direct laboratory launch buttons.
- **Standalone Export & Tools Toolbar (`ResultActions`):**
  - Refactored calculation result layout across all 6 methods to eliminate number wrapping and crowding.
  - Added high-resolution (Retina 2x) PNG screenshot export capturing the method workspace without sidebars or navbars.
  - Added official `sonli-usullar.uz` watermark badge stamped on exported PNGs.
  - Enhanced 1-click clipboard result copy and UTF-8 BOM CSV export for laboratory spreadsheets.
  - Added dedicated `@media print` CSS rules for clean academic laboratory PDF reports.

### 📱 Android Platform & CI Fixes
- **Native Android Launcher Icon & Splash Screen:**
  - Injected custom Android mipmap density assets (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`) into `src-tauri/gen/android/app/src/main/res/` immediately after `tauri android init`.
  - Resolved default Tauri rocket icon and splash screen issue on Android APK builds.

---

## [3.0.0] - 2026-10-13

### 🚀 Overview: The Next-Gen Multi-Target Rebuild
Version 3.0.0 is a complete reimagining and architectural overhaul of Numeric Methods. Transitioning from the legacy static v2 web portal into a high-performance, multi-target desktop and mobile laboratory powered by **Next.js 16 (Turbopack)**, **Tailwind CSS 4**, and **Tauri v2**. One unified TypeScript codebase now seamlessly delivers cross-platform experiences across Web, Windows, Linux, macOS, and Android.

---

### 📐 Numerical Methods Laboratory Suite
- **Simpson's 1/3 Rule (Parabolic Quadrature) (`/methods/simpson`):**
  - High-precision quadratic parabolic quadrature algorithm for definite integrals $\int_a^b f(x) dx$.
  - Automatically verifies even partition counts ($n \pmod 2 = 0$), computes step size $h = \frac{b - a}{n}$, endpoints sum $Y_{\text{chet}}$, odd indices sum $\sum Y_{\text{toq}}$, and even indices sum $\sum Y_{\text{juft}}$.
  - Step-by-step formula breakdown cards with KaTeX typography, interactive SVG partition plot, and detailed nodes table.
- **Trapezoidal Rule (`/methods/trapezoid`):**
  - Definite numerical integration with linear approximations across sub-intervals.
  - Step-by-step mathematical cards including expanded substitution formulas $f(x_i)$, step size $h = \frac{b - a}{n}$, and error delta against high-precision benchmark.
  - Interactive trapezoidal geometry visualization with shaded sub-intervals and coordinate tooltips.
- **Rectangle Method (`/methods/rectangles`):**
  - Left, Right, and Midpoint Riemann sum approximations with interactive partition visualizations and step audit logs.
- **Lagrange Polynomial Interpolation (`/methods/lagrange`):**
  - Real-time $n$-point polynomial curve construction, basis polynomials $L_i(x)$ computation, and coordinate curve tracing.
- **Euler's Method (`/methods/euler`):**
  - First-order Ordinary Differential Equation (ODE) numerical solver with step-by-step Cauchy problem tracing.
- **Bisection Method (`/methods/bisection`):**
  - Root-finding module with bracket interval tracking $[a, b]$, sign convergence checks, and iterations table.

---

### 🔄 In-App Auto-Updater & Cryptographic Security
- **Native Tauri v2 In-App Updater:**
  - Integrated `tauri-plugin-updater` with Minisign asymmetric public/private cryptographic signature verification.
  - One-click in-app update for desktop: downloads update chunks, displays real-time progress screen, installs seamlessly in background, and relaunches the application (`tauri-plugin-process`).
- **Platform-Aware Download & Android Guidance:**
  - Intelligently detects client environment (Tauri Desktop vs Android APK vs Web).
  - On Android: provides direct `.apk` download with automatic system package installer prompting, preserving user data without requiring app uninstall.
  - On Web: serves platform-specific executable installers with instant GitHub fallback.
- **Formatted Markdown Changelog Viewer:**
  - Dedicated `MarkdownViewer` component rendering release notes with styled headings, bold text, bullet points, and inline code badges.
- **Header Update Check Button:**
  - Responsive spinning check button in the top navigation header for one-click manual update checks with non-intrusive toast notifications.

---

### 🎨 Signature "Print Stream" Design System
- **Next-Gen Utility Styling:**
  - Built with Tailwind CSS 4 directly in TSX using custom design tokens (`@theme inline`), open-corner borders, and technical barcode accents.
- **Fluid View Transitions API:**
  - Seamless circular expanding wave animation when switching between dark and light themes.
- **Independently Scrollable Sidebar Navigation:**
  - Flexible layout ensuring navigation across all laboratory methods scrolls smoothly on any screen height while keeping the brand header and "Hisoblash muhiti" (Compute Engine) status pinned in view.
  - Active method item is automatically scrolled into view on navigation.
- **Toploader Progress Bar:**
  - Integrated `nextjs-toploader` featuring brand vermilion-to-cyan gradient and glowing head for instantaneous route transition feedback.
- **KaTeX Mathematical Typography:**
  - High-fidelity LaTeX mathematical typesetting across all formulas, step cards, and table headers.

---

### 🌐 Trilingual Academic Localization (UZ / RU / EN)
- Complete, native localization in Uzbek, Russian, and English across all pages, method equations, error states, and history logs.
- Terminology aligned with official university STEM curricula and academic literature.

---

### 📱 Android Dual-Distribution & Safe-Area Protection
- **Edge-to-Edge & Status Bar Insets:**
  - Synchronously injected safe-area environment variables (`--sat`, `--sab`, `viewportFit: cover`) protecting navigation and headers on edge-to-edge Android displays.
- **Dual APK Architecture:**
  - Lightweight 64-bit ARM APK (`arm64.apk`, ~15–20 MB) with stripped binary footprints (`opt-level = "z"`, LTO enabled) + Universal APK fallback.
- **Automated Keystore & apksigner Integration:**
  - Full support for permanent keystore signing (`release.jks`) ensuring seamless in-place updates.

---

### 🛠️ Developer Tooling & Multi-Target Synchronizations
- Strict TypeScript enforcement (zero `any` types throughout).
- Automated multi-target version validator (`bun run check:version`) synchronizing `package.json`, `tauri.conf.json`, and `Cargo.toml`.
