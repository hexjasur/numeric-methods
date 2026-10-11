# Changelog

All notable changes to the **Numeric Methods** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0] - 2026-10-11

### 🚀 Overview: The Next-Gen Rebuild
Version 3.0.0 is a complete reimagining and architectural overhaul of Numeric Methods. Transitioning from a static v2 web page into a high-performance, multi-target desktop and mobile laboratory powered by **Next.js 16 (Turbopack)**, **Tailwind CSS 4**, and **Tauri v2**. One unified TypeScript codebase now seamlessly delivers cross-platform experiences across Web, Windows, Linux, macOS, and Android.

---

### ✨ Added
- **Multi-Target Native Architecture:**
  - Integrated Tauri v2 with Rust backend entry points under `src-tauri/`.
  - Native window size and position persistence across restarts via `tauri-plugin-window-state`.
  - Static export compatibility (`output: "export"`) delivering 0ms cold-start and instant navigation.
  - Multi-platform packaging targets: Windows (`.msi`, `.exe`), Linux (`.deb`, `.AppImage`), and Android dual APKs (`arm64.apk` lightweight + `universal.apk`).
  - Automated Android APK signing (`apksigner` v2/v3) and release profile binary footprint optimization (`opt-level = "z"`, LTO, codegen-units = 1).
  - Cross-platform Auto-Updater with platform-aware asset selection and ambient update screen.
- **Signature "Print Stream" Design System:**
  - Modern technical aesthetic featuring open-corner accents, barcode identity, custom theme variables, and KaTeX mathematical typography.
  - Fluid **View Transitions API** integration for light/dark mode toggling, creating an organic expanding circular wave effect from the toggle origin.
- **Newton-Raphson Method (MK-003):**
  - High-precision root-finding module with quadratic convergence.
  - Automatic symbolic differentiation powered by central `Math.js` engine—eliminating manual derivative inputs.
  - Step-by-step trace table tracking approximations, functional values, and convergence deltas.
- **Comprehensive Trilingual Localization (i18n):**
  - Full native translations for Uzbek, Russian, and English.
  - Terminology aligned with scientific academic literature (e.g., *Teng ikkiga bo'lish usuli*, *Метод деления отрезка пополам*, *Bisection Method*).
  - Dynamic localized error formatting with variable parameter substitution.
  - Custom compact language selector matching the aesthetic of the system controls.
- **Centralized Math Engine & Syntax Guide:**
  - Unified `lib/math.ts` core engine standardizing formula compilation, evaluation, and safe parsing.
  - Dedicated `/docs/syntax` interactive documentation page explaining Math.js operator rules, fractions, roots, and trigonometric conventions.
- **Enterprise Release & CI Workflows:**
  - Automated GitHub Actions workflow verifying version synchronization between `package.json`, `tauri.conf.json`, and `Cargo.toml`.
  - Multi-platform release automation creating GitHub Releases with native installers and changelog extraction.
  - Dynamic, SEO-optimized `sitemap.xml` and `robots.txt` reflecting actual file modification timestamps (`mtime`).

---

### 📱 Android Dual-Distribution & Automated Signing
- **Lightweight 64-bit ARM APK (`arm64.apk`):**
  - Dedicated build for modern Android devices with stripped native binaries (`opt-level = "z"`, LTO, codegen-units = 1).
  - Memory and download footprint drastically reduced (~15–20 MB).
- **Universal Fallback APK (`universal.apk`):**
  - All-architecture bundle supporting legacy devices (`arm64-v8a`, `armeabi-v7a`, `x86_64`).
- **Automated CI Keystore & APK Signing:**
  - Automated `zipalign` and `apksigner` integration with v2 and v3 signature scheme verification.
  - Fixes Android package installer validation, allowing one-tap installation directly from downloads.
- **Smart Asset Selection in Auto-Updater:**
  - The updater intelligently detects Android clients and downloads the optimized `arm64.apk` with graceful fallback to `universal.apk`.

---

### 🛠️ Improved & Fixed
- **Type Safety & Code Quality:** Enforced strict TypeScript rules with zero `any` types across all mathematical modules and context providers.
