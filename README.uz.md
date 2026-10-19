<p align="center">
  <img src="src-tauri/icons/icon.png" width="130" alt="Sonli Usullar Logo"/>
</p>

<h1 align="center">Sonli Usullar (Numeric Methods) <sup>v3</sup></h1>

<p align="center">
  <strong>Sonli usullarni interaktiv va bosqichma-bosqich o'rganish uchun zamonaviy ko'p platformali ilova</strong><br/>
  <em>A modern multi-platform application for interactive and step-by-step exploration of numerical methods.</em>
</p>

<p align="center">
  <a href="https://sonli-usullar.uz"><img src="https://img.shields.io/badge/Web-sonli--usullar.uz-00D26A?style=flat-square&logo=googlechrome&logoColor=white" alt="Live Website" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases/latest"><img src="https://img.shields.io/github/v/release/hexjasur/numeric-methods?style=flat-square&color=blue&label=Reliz" alt="Latest Release" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases"><img src="https://img.shields.io/badge/Platformalar-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-purple?style=flat-square" alt="Supported Platforms" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Paket_Menejeri-Bun-f472b6?style=flat-square&logo=bun&logoColor=white" alt="Bun Only" /></a>
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-v2-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri v2" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Litsenziya-Tijoriy_emas%20%7C%20Mualliflik-blue?style=flat-square" alt="Tijoriy emas mualliflik litsenziyasi" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRlar-Xush_kelibsiz-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <b>Tillar (Translations):</b>
  <a href="README.md"><b>English</b></a> |
  <a href="README.ru.md"><b>Русский</b></a> |
  <a href="README.zh.md"><b>简体中文</b></a> |
  <a href="README.uz.md"><b>O'zbekcha</b></a>
</p>

---

## 📥 Yuklab Olish (Downloads)

Ilova yagona kod bazasidan uch xil muhit uchun quriladi: **Web sayt**, **Windows va Linux kompyuter dasturlari** hamda **Android (APK) mobil ilovasi**. Barcha imzolangan rasmiy dasturlar [GitHub Releases](https://github.com/hexjasur/numeric-methods/releases/latest) sahifasida e'lon qilib boriladi.

### 📱 Android (APK)

| Versiya / Fayl | Tavsif va Arxitektura | To'g'ridan-to'g'ri havola |
| :--- | :--- | :--- |
| **Numeric Methods APK (ARM64)** <br/> *(Tavsiya etiladi)* | Zamonaviy 64-bitli Android telefon va planshetlar uchun ixcham, yuqori tezlikda ishlovchi versiya (arm64-v8a). | [⬇️ Yuklab olish (ARM64 APK)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_arm64.apk) |
| **Numeric Methods APK (Universal)** | Barcha Android qurilmalari (arm64-v8a, armeabi-v7a, x86, x86_64) uchun mos keluvchi universal o'rnatuvchi. | [⬇️ Yuklab olish (Universal APK)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_universal.apk) |

> 💡 **Eng so'nggi Android relizini olish:**  
> [GitHub Latest Releases sahifasi](https://github.com/hexjasur/numeric-methods/releases/latest) orqali doimo eng so'nggi `.apk` paketini yuklab olishingiz mumkin.

---

### 💻 Kompyuter / Desktop (Windows & Linux)

| Platforma | Paket formati | Yuklab olish havolasi |
| :--- | :--- | :--- |
| **Windows 10 / 11** | NSIS Installer (`.exe`) | [⬇️ Windows x64 Setup yuklab olish (.exe)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64-setup.exe) |
| **Windows 10 / 11** | MSI Package (`.msi`) | [⬇️ Windows x64 MSI yuklab olish (.msi)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64_en-US.msi) |
| **Linux (Ubuntu / Debian)** | Debian paketi (`.deb`) | [⬇️ Linux .deb yuklab olish](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.deb) |
| **Linux (Har qanday dist)** | Portable AppImage (`.AppImage`) | [⬇️ Linux AppImage yuklab olish](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.AppImage) |

---

### 🌐 Veb-talqin (Online Web)

O'rnatishni talab qilmaydigan to'liq onlayn laboratoriya:
- **Asosiy v3 veb-sayt:** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Arxiv v2 veb-sayt:** [v2.sonli-usullar.uz](https://v2.sonli-usullar.uz)

---

## 🧮 Mavjud Sonli Usullar (Implemented Methods)

Ilova o'z ichiga 10 ta asosiy hisoblash matematikasi usullarini oladi:

1. **Yarmini bo'lish (Biseksiya) usuli** — Tenglamalar ildizlarini oraliqni teng ikkiga bo'lish orqali topish.
2. **Nyuton (Urinmalar) usuli** — Hosila yordamida kvadratik tezlikda ildizga yaqinlashish.
3. **Progonka (Tridiagonal matritsa) usuli** — Uch diagonalli chiziqli tenglamalar sistemasini $O(n)$ da yechish.
4. **Lagranj interpolyatsiyasi** — Berilgan nuqtalar to'plami bo'yicha interpolyatsion ko'phad qurish.
5. **Nyuton interpolyatsiyasi (Bo'lingan ayirmalar)** — Bosqichma-bosqich bo'lingan ayirmalar jadvali va polinomi.
6. **To'g'ri to'rtburchaklar usuli** — Aniq integrallarni chap, o'ng va o'rta to'rtburchaklar yordamida taqribiy hisoblash.
7. **Trapetsiyalar usuli** — Egri chiziqli trapetsiyalar orqali kvadratura hisoblash.
8. **Simpson (Parabolalar) usuli** — 2-tartibli parabolalar yordamida yuqori aniqlikdagi integral hisoblash ($O(h^4)$).
9. **Eyler usuli** — Oddiy differensial tenglamalarni (Koshi masalasi) birinchi tartibli taqribiy integrallash.
10. **Runge-Kutta 4-tartibli usuli (RK4)** — Oddiy differensial tenglamalar uchun yuqori aniqlikdagi klassik RK4 integrallash.

Har bir usulda:
- 📊 **Interaktiv grafiklar va koordinata o'qlari** (Recharts)
- 📝 **LaTeX formatdagi matematik formulalar** (KaTeX)
- 📋 **Bosqichma-bosqich hisoblash jadvali va auditi**
- 💾 **Natijalarni nusxalash va rasm (PNG) shaklida yuklab olish**

---

## 🛠 Texnologiyalar Staki (Tech Stack)

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router, Static Export), [React 19](https://react.dev/)
- **Native Runtime:** [Tauri v2](https://tauri.app/) (Desktop va Android uchun Rust yadrosi)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Matematika:** [Math.js](https://mathjs.org/) (Simvolik va hisoblash dvigateli)
- **Formulalar:** [KaTeX](https://katex.org/)
- **Grafiklar:** [Recharts](https://recharts.org/)
- **Ikonkalar:** [Lucide React](https://lucide.dev/)
- **Paket menejeri:** [Bun](https://bun.sh/) (Qat'iy talab)

---

## 🚀 Loyihani Ishga Tushirish va O'rnatish

### Talablar
- [Bun](https://bun.sh) (v1.2+)
- [Rust](https://rustup.rs) (Tauri desktop yoki Android build uchun)

### 1. Bog'liqliklarni o'rnatish

```bash
bun install
```

### 2. Veb-dasturni ishlab chiqish rejimida ishga tushirish

```bash
bun dev
```
Brauzerda [http://localhost:3000](http://localhost:3000) manzilini oching.

### 3. Veb-saytni statik eksport qilish (Build)

```bash
bun run build
bun start
```
Statik fayllar `out/` jildiga yoziladi. Ushbu papka Web xosting hamda Tauri interfeysi uchun asos hisoblanadi.

---

## 💻 Desktop (Tauri) Ishga Tushirish va Build

```bash
# Ishlab chiqish rejimida (Dev)
bun td

# Ishchi versiyani yig'ish (Build: .exe / .msi / .deb / .AppImage)
bun tb
```

Desktop konfiguratsiyasi: `src-tauri/tauri.conf.json`.

---

## 📱 Android (APK) Build Qilish

Android ilovasini yaratish uchun:
- Java JDK 17+
- Android SDK & NDK (r26d tavsiya etiladi)
- Rust Android targetlari:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
  ```

### Android komandalari:

```bash
# Android loyihasini initsializatsiya qilish
bun run tauri:android:init

# Emulyator yoki ulangan telefonda ishga tushirish (Dev)
bun run tauri:android:dev

# Universal APK yaratish
bun run tauri:android:build --apk

# Arxitektura bo'yicha ajratilgan (ARM64 va b.) APK yaratish
bun run tauri:android:build --apk --split-per-abi
```

Yaratilgan tayyor `.apk` fayllar `src-tauri/gen/android/app/build/outputs/apk/` jildida joylashadi.

---

## 🔄 Avtomatik Yangilanish (Auto-Updater)

- **Desktop (Windows/Linux):** Tauri Updater orqali imzolangan (`minisign`) relizlarni avtomatik aniqlaydi va bir bosishda yangilaydi.
- **Android:** Ilova ichida yangi versiya e'lon qilinganida avtomatik xabarnoma chiqadi va yangi APK yuklab olish manziliga yo'naltiradi.

---

## 🤝 Loyihaga Hissa Qo'shish (Contributing)

Loyihani rivojlantirishga hissa qo'shishingizni mamnuniyat bilan qabul qilamiz! Kod yuborishdan avval [CONTRIBUTING.md](CONTRIBUTING.md) qo'llanmasi bilan tanishib chiqing:

- 🐛 **Xatolik yoki noto'g'ri hisob-kitob topdingizmi?** [Bug Report](https://github.com/hexjasur/numeric-methods/issues/new?template=bug_report.md) orqali xabar bering.
- 💡 **Yangi imkoniyat bo'yicha g'oyangiz bormi?** [Feature Request](https://github.com/hexjasur/numeric-methods/issues/new?template=feature_request.md) oching.
- 🧮 **Yangi sonli usul qo'shmoqchimisiz?** [New Method Proposal](https://github.com/hexjasur/numeric-methods/issues/new?template=new_method.md) oching va [CONTRIBUTING.md](CONTRIBUTING.md) dagi bosqichma-bosqich yo'riqnomaga amal qiling.
- 📜 Hamjamiyat qoidalari uchun [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) faylini ko'ring.

---

## 📄 Litsenziya va Foydalanish Shartlari

Ushbu loyiha **Maxsus Tijoriy bo'lmagan va Mualliflikni saqlash Litsenziyasi (Custom Non-Commercial & Attribution License)** asosida taqdim etiladi. To'liq matn [LICENSE](LICENSE) faylida keltirilgan.

### Asosiy shartlar:
- **Ta'limiy va notijoriy foydalanish:** Dastur va uning barcha paketlari (Web, Desktop, Android APK) ta'lim, ilmiy izlanish va shaxsiy o'rganish uchun mutlaqo bepul. **Dasturni yoki uning qismlarini sotish, pullash yoki tijoriy maqsadda daromad olish qat'iyan taqiqlanadi**.
- **Muallif va brend daxlsizligi:** Loyiha nomi ("Numeric Methods" / "Sonli Usullar") hamda asl loyiha yaratuvchisi — **Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))** — mualliflik belgilari barcha nusxalarda saqlanishi shart, ularni o'zgartirish yoki olib tashlash mumkin emas.
- **Fork qilish va o'zgartirish:** Loyihani erkin fork qilishingiz, qo'shimchalar kiritishingiz va kiritilgan hissa uchun **o'z ismingizni hissa qo'shuvchilar safida asl muallif yoniga qo'shishingiz mumkin**.
- **Tarqatish:** Har qanday o'zgartirilgan talqinlarni faqatgina ushbu litsenziya shartlarini va mualliflik huquqini to'liq saqlagan holda bepul tarqatishga ruxsat beriladi.

### Bog'lanish:
- **Asosiy muallif:** Jasurbek Haydarov ([@hexjasur](https://github.com/hexjasur))
- **Rasmiy veb-sayt:** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Telegram:** [@KanYonA](https://t.me/KanYonA)
- **Email:** jasurhaydarovcode@gmail.com

