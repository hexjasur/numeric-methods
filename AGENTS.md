# AGENTS.md

## Tech stack

- **Package manager:** Bun only. Never use `npm`, `yarn`, or `pnpm`. Use `bun add`, `bun remove`, `bun run`, etc.
- **Styling:** Tailwind CSS 4.
- **Language:** TypeScript (strict mode).
- **Icons:** `lucide-react`.

## Commands

| Task | Command |
| --- | --- |
| Run | `bun dev` |
| Build | `bun build` |
| Tauri + Web Run | `bun td` |
| Tauri + Web Build | `bun tb` |
| Lint | `bun lint` |

## Styling rules

- Tailwind CSS 4 is the default and preferred styling system.
- Write styles directly in JSX/TSX with Tailwind utility classes. Do not build large custom CSS class systems in `app/globals.css`.
- Keep `app/globals.css` limited to:
  - Tailwind imports
  - Design tokens / theme variables (`@theme`)
  - Base resets
  - Styles Tailwind cannot express cleanly (e.g. KaTeX integration, genuinely custom keyframes, the open-corner border effect)
- Before adding any CSS, check whether it can be done with existing utilities, arbitrary values, responsive variants, `dark:` variants, or `@theme` tokens.
- Do not add new styling dependencies unless the task explicitly requires it.
- Use `lucide-react` for icons. No emoji or hand-drawn SVGs.
- Preserve the `dark` variant contract: the app toggles `data-theme="dark"` on `<html>`, and `globals.css` defines the Tailwind v4 custom variant for it.

## TypeScript

- **No `any`.** Use explicit, strict types instead (e.g. `Record<string, string | number>`, generics, well-defined interfaces).
- Rely on strict mode checks; do not weaken them.

## Multi-target application

The `tauri-desktop` branch shares one codebase across website, Tauri desktop, and Tauri Android targets.

- Keep the Next.js app compatible with static export (`output: "export"`). Do not add server-only routes or APIs without a target-specific adapter.
- Keep Tauri configuration and Rust entry points under `src-tauri/`.
- Never commit `src-tauri/target/`, signing keys, keystores, or platform secrets.

## Workflow and commits

- Keep changes focused.
- Split multi-part requests into logical tasks. Implement and validate each task, then make **one descriptive commit per task**. Do not bundle unrelated fixes into a single final commit.
- Before each commit:
  1. Run `bun lint` (required after any UI change).
  2. Run `bun run build`.
  3. Leave the working tree clean and understandable for the next task.