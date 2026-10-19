<p align="center">
  <img src="src-tauri/icons/icon.png" width="130" alt="Numeric Methods Logo"/>
</p>

<h1 align="center">Numeric Methods <sup>v3</sup></h1>

<p align="center">
  <strong>A modern cross-platform application for interactive and step-by-step exploration of numerical methods.</strong>
</p>

<p align="center">
  <a href="https://sonli-usullar.uz"><img src="https://img.shields.io/badge/Live_Web-sonli--usullar.uz-00D26A?style=flat-square&logo=googlechrome&logoColor=white" alt="Live Website" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases/latest"><img src="https://img.shields.io/github/v/release/hexjasur/numeric-methods?style=flat-square&color=blue&label=Release" alt="Latest Release" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases"><img src="https://img.shields.io/badge/Platform-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-purple?style=flat-square" alt="Supported Platforms" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Package_Manager-Bun-f472b6?style=flat-square&logo=bun&logoColor=white" alt="Bun Only" /></a>
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-v2-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri v2" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Non--Commercial%20%7C%20Attribution-blue?style=flat-square" alt="Non-Commercial Attribution License" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <b>Translations:</b>
  <a href="README.md"><b>English</b></a> |
  <a href="README.ru.md"><b>Русский</b></a> |
  <a href="README.zh.md"><b>简体中文</b></a> |
  <a href="README.uz.md"><b>O'zbekcha</b></a>
</p>

---

## 📥 Downloads

Numeric Methods targets three main environments from a single codebase: **Web**, **Desktop (Windows / Linux)**, and **Mobile (Android APK)**. All signed binary packages and releases are hosted directly on [GitHub Releases](https://github.com/hexjasur/numeric-methods/releases/latest).

### 📱 Android (APK)

| Package | Architecture / Target | Download Link |
| :--- | :--- | :--- |
| **Numeric Methods APK (ARM64)** <br/> *(Recommended)* | Optimized for modern 64-bit Android smartphones and tablets (arm64-v8a). Smaller file size and best runtime performance. | [⬇️ Download ARM64 APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_arm64.apk) |
| **Numeric Methods APK (Universal)** | Compatible with all Android CPU architectures (arm64-v8a, armeabi-v7a, x86, x86_64). | [⬇️ Download Universal APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_universal.apk) |

> 💡 **Latest Release Mirror:** You can always find the newest APK releases at the [GitHub Releases page](https://github.com/hexjasur/numeric-methods/releases/latest).

---

### 💻 Desktop (Windows & Linux)

| Platform | Format | Download Link |
| :--- | :--- | :--- |
| **Windows 10 / 11 (64-bit)** | NSIS Setup (`.exe`) | [⬇️ Download Windows Installer](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64-setup.exe) |
| **Windows 10 / 11 (64-bit)** | Windows Installer (`.msi`) | [⬇️ Download Windows MSI](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64_en-US.msi) |
| **Linux (Ubuntu / Debian)** | Debian package (`.deb`) | [⬇️ Download Debian Package](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.deb) |
| **Linux (Universal)** | Portable AppImage (`.AppImage`) | [⬇️ Download AppImage](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.AppImage) |

---

### 🌐 Web Version

Instant access without installation:
- **Production Web App (v3):** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Archive Version (v2):** [v2.sonli-usullar.uz](https://v2.sonli-usullar.uz)

---

## 🧮 Implemented Numerical Methods

The application includes 10 fundamental computational algorithms divided into 5 academic categories:

### 1. Algebraic & Transcendental Equations
- **Bisection Method (Interval Halving):** Finding roots by iteratively halving an interval $[a, b]$ where $f(a) \cdot f(b) < 0$. Convergence rate: $O(\log_2(1/\varepsilon))$.
- **Newton-Raphson Method:** Tangent-based root finding with quadratic convergence: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$.

### 2. Systems of Linear Equations
- **Tridiagonal Matrix Algorithm (Thomas / Sweep Method):** An efficient $O(n)$ elimination solver for tridiagonal systems $a_i x_{i-1} + b_i x_i + c_i x_{i+1} = d_i$.

### 3. Polynomial Interpolation
- **Lagrange Interpolation:** Constructs the unique lowest-degree polynomial passing through a given set of data points: $L_n(x) = \sum_{i=0}^n y_i \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$.
- **Newton Divided Differences Interpolation:** Step-by-step divided difference table construction and polynomial evaluation.

### 4. Numerical Quadrature (Definite Integrals)
- **Rectangle (Midpoint) Rule:** Approximation using left, right, and midpoint Riemann sums ($O(h)$ to $O(h^2)$).
- **Trapezoidal Rule:** Linear approximation over subintervals: $I \approx \frac{h}{2} [y_0 + 2\sum y_i + y_n]$ ($O(h^2)$).
- **Simpson's 1/3 Rule (Parabolic):** Higher-order quadratic spline quadrature ($O(h^4)$).

### 5. Ordinary Differential Equations (ODEs / Cauchy Initial Value Problem)
- **Euler's Method:** First-order explicit step solver: $y_{i+1} = y_i + h \cdot f(x_i, y_i)$.
- **Runge-Kutta 4th Order (RK4):** Classic fourth-order predictor-corrector solver with weighted sub-step slopes ($k_1, k_2, k_3, k_4$).

### ✨ Key Features Across All Solvers
- 📈 **Dynamic Interactive Charts:** Powered by Recharts and custom coordinate axes with zoom, inspection, and function traces.
- 📐 **Instant Formula Typography:** High-speed client-side math typesetting via KaTeX.
- 📋 **Audit Tables & Intermediate Steps:** Complete step-by-step arithmetic tables showing residuals, error bounds, and convergence.
- 💾 **Export Options:** One-click table copying, raw CSV export, and high-resolution PNG snapshot download with timestamps.
- 🌐 **Trilingual Localization:** Seamless switching between Uzbek, Russian, and English.
- 🌗 **Light / Dark Mode:** High-contrast technical theme with open-corner aesthetic.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, `output: "export"`)
- **UI Library:** [React 19](https://react.dev/)
- **Native Runtime:** [Tauri v2](https://tauri.app/) (Rust shell for Desktop and Android)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Math Engine:** [Math.js](https://mathjs.org/) (Symbolic parsing & numerical evaluation)
- **Typography:** [KaTeX](https://katex.org/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** [Bun](https://bun.sh/) (Strict requirement)

---

## 🚀 Getting Started (Development)

### Prerequisites
- [Bun](https://bun.sh) (v1.2 or later)
- [Rust](https://rustup.rs) (Required only for building Tauri desktop or mobile apps)

### 1. Install Dependencies

```bash
bun install
```

### 2. Run Next.js Web Dev Server

```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build Static Web Export

```bash
bun run build
bun start
```
The static export will be written to the `out/` directory, which is shared between web deployments (Netlify, Vercel) and the Tauri frontend.

---

## 💻 Building Desktop (Tauri)

After configuring the Rust toolchain and platform dependencies:

```bash
# Run desktop development with live reload
bun td

# Build production installers (.exe, .msi, .deb, .AppImage)
bun tb
```

Configuration resides in `src-tauri/tauri.conf.json`.

---

## 📱 Building Android APK

Requirements:
- Java JDK 17+
- Android SDK & NDK (r26d recommended)
- Android target architectures for Rust:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
  ```

### Build Commands:

```bash
# Initialize Android project structure
bun run tauri:android:init

# Run in an Android emulator or connected device
bun run tauri:android:dev

# Build Universal signed APK (runs on all devices)
bun run tauri:android:build --apk

# Build Split per-ABI APKs (optimized ARM64 APK)
bun run tauri:android:build --apk --split-per-abi
```

Generated APKs are located in:  
`src-tauri/gen/android/app/build/outputs/apk/`

---

## 🔄 Automatic Updates (Auto-Updater)

- **Desktop (Windows/Linux):** Integrated with Tauri's native signed updater (`minisign` public key). Automatically checks `latest.json` on GitHub Releases and updates in the background.
- **Android:** Embedded updater detector notifies users whenever a newer APK is released and opens the direct download link in the system browser.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions before submitting code.

- 🐛 **Found a bug?** Submit a [Bug Report](https://github.com/hexjasur/numeric-methods/issues/new?template=bug_report.md).
- 💡 **Have a feature idea?** Submit a [Feature Request](https://github.com/hexjasur/numeric-methods/issues/new?template=feature_request.md).
- 🧮 **Want to add a new numerical method?** Check out the [New Method Proposal](https://github.com/hexjasur/numeric-methods/issues/new?template=new_method.md) and step-by-step implementation guide in [CONTRIBUTING.md](CONTRIBUTING.md).
- 📜 Please review our [Code of Conduct](CODE_OF_CONDUCT.md) for community standards.

---

## 📄 License & Terms of Use

This project is licensed under a **Custom Non-Commercial & Attribution License**. See the full text in [LICENSE](LICENSE).

### Key Terms:
- **Educational & Non-Commercial:** The Software and its compiled packages (Web, Desktop, Android APK) may be used freely for learning and research, but **CANNOT be sold, monetized, or used for commercial gain**.
- **Preserve Original Author & Brand:** The project brand ("Numeric Methods" / "Sonli Usullar") and the original authorship credits to **Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))** must remain intact and cannot be altered or removed.
- **Forks & Contributions:** You are welcome to fork the project, develop enhancements, and **add your own name alongside the original author** in the contributors list.
- **Redistribution:** You may redistribute derivative works only under identical license and attribution terms.

### Contact:
- **Author:** Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))
- **Official Website:** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Telegram:** [@KanYonA](https://t.me/KanYonA)
- **Email:** jasurhaydarovcode@gmail.com

