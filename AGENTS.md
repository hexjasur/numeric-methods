# AGENTS.md

## Styling rules

- This project uses **Tailwind CSS 4** as the default and preferred styling system.
- Write visual styles directly in JSX/TSX with Tailwind utility classes. Do not create large custom CSS class systems in `app/globals.css`.
- Keep `app/globals.css` limited to Tailwind imports, design tokens/theme variables, base resets, and styles that Tailwind cannot express cleanly (for example KaTeX integration, a genuinely custom keyframe animation, or the open-corner border effect).
- Before adding CSS, check whether the requirement can be expressed with existing Tailwind utilities, arbitrary values, responsive variants, `dark:` variants, or `@theme` tokens. Prefer those approaches.
- Do not add a new styling dependency unless the task explicitly requires it. Iconography should use the existing `lucide-react` dependency rather than emoji or hand-drawn SVGs.
- Preserve the `dark` variant contract: the app toggles `data-theme="dark"` on `<html>`, and `globals.css` defines the Tailwind v4 custom variant for it.

## Validation

- Run `npm run lint` after UI changes.
- Run `npx next build` before committing.
- Keep changes focused and make one descriptive commit per requested change.
- Split multi-part requests into logical tasks. After each task is implemented and validated, create its own descriptive commit; do not bundle unrelated fixes into one final commit.
- Before committing a task, run the relevant lint/build checks and leave the working tree understandable for the next task.

## Multi-target application

- The `tauri-desktop` branch supports one shared codebase for website, Tauri desktop, and Tauri Android targets.
- Keep the Next.js app compatible with static export (`output: "export"`); do not add server-only routes or APIs without a target-specific adapter.
- Keep Tauri configuration and Rust entry points under `src-tauri/`. Do not commit `src-tauri/target/`, signing keys, keystores, or platform secrets.
