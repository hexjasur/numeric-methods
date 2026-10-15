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
| Tauri Dev | `bun td` |
| Tauri Build | `bun tb` |
| Static Preview | `bun run start` |
| Lint | `bun lint` |
| Check Versions | `bun run check:version` |
| OG:Generator  | `bun run og:generate` |

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
- Always synchronize the `version` field identically across `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`. Run `bun run check:version` to verify.
- Never commit `src-tauri/target/`, signing keys, keystores, or platform secrets.

## PowerShell (Windows) — running bun

On Windows, `bun` is installed as a `.cmd` shim under `%APPDATA%\npm\`. PowerShell's execution policy blocks unsigned `.ps1` scripts, so the bare `bun` alias may fail. **Always invoke bun through its `.cmd` path** when running lint, build, or any other script in PowerShell:

```powershell
# Lint
& "$env:APPDATA\npm\bun.cmd" run lint

# Build
& "$env:APPDATA\npm\bun.cmd" run build

# Lint then build (bail on lint failure)
& "$env:APPDATA\npm\bun.cmd" run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; & "$env:APPDATA\npm\bun.cmd" run build; exit $LASTEXITCODE
```

> **Why not `cmd /c "bun ..."`?** `cmd` works but disables prefix-matching for auto-approval in the agent sandbox. Prefer the PowerShell form above.

## Workflow and commits

- Keep changes focused.
- Split multi-part requests into logical tasks. Implement and validate each task, then make **one descriptive commit per task**. Do not bundle unrelated fixes into a single final commit.
- Before each commit:
  1. Run lint (see PowerShell section above for the correct invocation).
  2. Run build and confirm it exits with code 0.
  3. Run `bun run check:version` if `package.json` or Tauri configs were touched.
  4. Leave the working tree clean and understandable for the next task.

### Commit message structure

Follow **Conventional Commits** with a trailing emoji:

```
<type>(<scope>): <short imperative subject> <emoji>

[optional body — what and why, not how]

[optional footer — breaking changes, issue refs]
```

**Types:**

| Type | When to use |
| --- | --- |
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `refactor` | Code restructure with no behaviour change |
| `perf` | Performance improvement |
| `style` | Formatting / whitespace only |
| `chore` | Tooling, deps, config, CI |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |

**Scope** (optional): the affected area, e.g. `export`, `trapezoid`, `rk4`, `i18n`, `deps`.

**Emoji** — end the subject line with one emoji that matches the intent:

| Emoji | Meaning |
| --- | --- |
| ✨ | New feature |
| 🐛 | Bug fix |
| ♻️ | Refactor |
| ⚡️ | Performance |
| 🎨 | Style / UI polish |
| 🧹 | Chore / cleanup |
| 📝 | Docs |
| 🚀 | Deploy / release |
| 🔧 | Config / tooling |
| ➕ | Add dependency |
| ➖ | Remove dependency |

**Examples:**

```
fix(export): replace html-to-image with modern-screenshot, add PNG timestamp 🐛
feat(rk4): add CSV/PNG export toolbar to Runge-Kutta page ✨
chore(deps): bump modern-screenshot to 4.7.0 ➕
refactor(plot): extract QuadraturePlot into shared integration component ♻️
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
