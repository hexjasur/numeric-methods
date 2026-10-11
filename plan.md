# Numeric Methods v3 — implementation plan

## Scope
- Build a responsive, fixed app shell with a desktop sidebar, mobile drawer, and sticky top navbar.
- Add light/dark mode with a persisted user preference and system fallback.
- Use Next.js 16 App Router route groups for clean, scalable method routes.
- Rebuild the legacy Bisection Method page as a reusable React client component with Math.js parsing, KaTeX preview, validation, result summary, and iteration logs.

## Design
- **Design movement:** editorial scientific dashboard with a restrained neo-brutalist accent system.
- **Core principles:** high information density without clutter, strong hierarchy, calm surfaces, and visible mathematical state.
- **Color philosophy:** indigo is the ownable brand color for precision and trust; cyan marks active computation; amber is reserved for guidance.
- **Layout paradigm:** persistent navigation rail + sticky utility bar + focused work canvas, rather than a centered marketing page.
- **Signature elements:** indigo gradient brand mark, monospace numeric values, and thin ruled section labels.
- **Interaction philosophy:** every control gives immediate feedback, invalid intervals explain the mathematical reason, and calculation history stays inspectable.
- **Animation:** short opacity/translate transitions for drawer, cards, and result states; no distracting loops.
- **Typography:** Geist for interface copy, Geist Mono for formulas and values.
- **Brand essence:** a focused workspace for learning and running numerical methods — precise, approachable, and practical.
- **Brand voice:** concise Uzbek microcopy; examples: “Hisoblashni boshlang” and “Har bir iteratsiyani tekshiring.”
- **Wordmark:** `NUMERIC / METHODS` lockup paired with a bracket-shaped method mark.
- **Signature brand color:** `#635bff` indigo.

## Project structure
- `app/layout.tsx`: metadata, fonts, and document shell.
- `app/(workspace)/layout.tsx`: shared authenticated-style application frame.
- `app/(workspace)/page.tsx`: dashboard landing page.
- `app/(workspace)/methods/bisection/page.tsx`: method route and page metadata.
- `components/app-shell.tsx`: responsive navbar/sidebar navigation.
- `components/theme-toggle.tsx`: persisted light/dark theme control.
- `components/bisection-method.tsx`: client-only equation parsing and bisection calculation UI.
- `app/globals.css`: design tokens, responsive layout, component primitives, and theme styles.
- `public/manus-routes.json`: route manifest for the application.
