# Numeric Methods

Numeric Methods — sonli usullarni interaktiv o‘rganish uchun Next.js ilovasi. Bitta repository uchta targetni ta’minlaydi: **website** (`sonli-usullar.uz`), **Tauri 2 desktop** va **Tauri 2 Android APK/AAB**.

## Development

```bash
bun install
bun dev
```

Website `http://localhost:3000` manzilida ishlaydi.

## Website build

```bash
bun build
bun start
```

`next.config.ts` `output: "export"` ishlatadi. Build natijasi `out/` katalogiga yoziladi. Shu static artifact website hosting va Tauri frontend’i uchun umumiy hisoblanadi. Server actions, API routes va server runtime bu targetda ishlatilmasligi kerak.

## Tauri desktop

Rust toolchain va platformaga tegishli Tauri dependencies o‘rnatilgandan keyin:

```bash
bun td
bun tb
```

Tauri konfiguratsiyasi `src-tauri/tauri.conf.json` ichida. `tauri:dev` Next.js dev serverini, `tauri:build` esa avval `out/` static exportni va keyin desktop bundleni yaratadi.

## Android APK

Android SDK, Java 17+, Rust Android targets va Tauri Android prerequisites o‘rnatilgandan keyin bir marta initialize qiling:

```bash
bun run tauri:android:init
bun run tauri:android:dev
bun run tauri:android:build
```

Release signing ma’lumotlari environment secrets sifatida saqlanadi; keystore va parollar repository’ga commit qilinmaydi.

## Architecture

`app/` Next.js route’larini, `components/` UI’ni, `lib/` hisoblash mantiqini, `public/` umumiy static assetlarni, `src-tauri/` esa Rust shell/configuration’ni saqlaydi. Web, desktop va mobile bir xil React UI’dan foydalanadi; platformaga xos funksiyalar keyinchalik Tauri pluginlari orqali adapter sifatida qo‘shiladi.
