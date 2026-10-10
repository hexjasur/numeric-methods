<p align="center">
  <img src="src-tauri/icons/icon.png" width="130" alt="Sonli Usullar Logo"/>
</p>

<h1 align="center">Numeric Methods <sup>v3</sup></h1>

Numeric Methods — a Next.js application for the interactive study of numerical methods. A single repository targeting three platforms: **website** (`sonli-usullar.uz`), **Tauri v2 desktop**, and **Tauri v2 Android APK/AAB**.

## Development

```bash
bun install
bun dev
```

The website runs at `http://localhost:3000`.

## Website build & start

```bash
bun build
bun start
```

`next.config.ts` uses `output: "export"`. The build output is written to the `out/` directory. This static artifact is shared between website hosting and the Tauri frontend. Server actions, API routes, and server runtime features must not be used with this target.

## Tauri desktop

After installing the Rust toolchain and platform-specific Tauri dependencies:

```bash
bun td
bun tb
```

The Tauri configuration is located in `src-tauri/tauri.conf.json`. `tauri:dev` or `td` runs the Next.js dev server, while `tauri:build` or `tb` first creates the `out/` static export and then builds the desktop bundle.

## Android APK

Soon
## Architecture

`app/` stores Next.js routes, `components/` holds the UI, `lib/` contains business logic, `public/` houses shared static assets, and `src-tauri/` stores the Rust shell and configuration. Web, desktop, and mobile versions share the same React UI; platform-specific features are added later as adapters via Tauri plugins.
