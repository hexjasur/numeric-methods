# Contributing to Numeric Methods

Thank you for your interest in contributing to **Numeric Methods** (Sonli Usullar)! Whether you are reporting a bug, improving documentation, designing features, or implementing new computational mathematics algorithms, your help is welcome.

Please read through this guide to ensure a smooth, efficient collaboration process.

---

## 📜 Code of Conduct & Licensing

By contributing to this repository, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE).

Key licensing conditions to remember:
- **Non-Commercial:** The project is educational and strictly non-commercial.
- **Brand & Original Author Protection:** The project name ("Numeric Methods" / "Sonli Usullar") and the original creator's attribution (Jasurbek Haydarov / @hexjasur) must be preserved.
- **Contributor Recognition:** When you implement a feature, fix, or new method, you are welcome and encouraged to add your name to the contributors list alongside the original author!

---

## 🛠 Tech Stack & Rules

Before contributing code, please keep in mind our core engineering principles:

- **Package Manager:** **Bun only**. Never use `npm`, `yarn`, or `pnpm`. Always run `bun install`, `bun run build`, `bun lint`, etc.
- **Language:** **TypeScript (strict mode)**. **No `any` allowed.** Use strict, well-defined types or generics.
- **Framework:** Next.js 16 (App Router, Turbopack, static export with `output: "export"`).
- **Styling:** Tailwind CSS 4. Write utility classes directly in JSX/TSX.
- **Icons:** `lucide-react` only. (No inline hand-drawn SVGs or raw emojis in the UI).
- **Native Platform:** Tauri v2 (Rust backend for Desktop and Android APK). Do not use Node.js-only or server-only packages.

---

## 🐛 Reporting Bugs

If you find a bug, incorrect mathematical calculation, or graphical glitch:

1. **Check existing issues:** Search [GitHub Issues](https://github.com/hexjasur/numeric-methods/issues) to avoid duplicate reports.
2. **Open a Bug Report:** Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
   - A clear, descriptive title.
   - Exact mathematical function or inputs used (e.g. $f(x) = x^3 - x - 2$, interval $[1, 2]$, $\varepsilon = 10^{-4}$).
   - Expected mathematical result vs. actual calculation output.
   - Operating system and platform (Web browser, Windows desktop, Linux, or Android APK).
   - Screenshots or console error logs if applicable.

---

## 💡 Proposing Features

Have an idea for UI enhancements, export tools, or learning guides?

1. Open an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).
2. Detail the motivation, target audience (students, engineers, researchers), and proposed design or workflow.
3. Discuss the implementation approach with the maintainers before submitting large PRs.

---

## 🧮 Adding a New Numerical Method (Step-by-Step)

Adding a new mathematical method is one of the most valuable contributions you can make! Follow this architectural blueprint:

### 1. Algorithm Logic & Mathematical Soundness
- Ensure the algorithm handles edge cases gracefully (division by zero, divergence, singular matrices, step size underflow).
- Maintain numerical stability and document theoretical convergence order (e.g., $O(h^2)$).

### 2. Register in Methods Hub
Add the method definition to `components/dashboard/methods-hub.tsx`:
```typescript
{
  id: 'your-method',
  code: '11 / CAT',
  category: 'equations' | 'linear' | 'interpolation' | 'quadrature' | 'odes',
  categoryKey: 'dashboard.cat_...',
  titleKey: 'nav.yourMethod',
  descKey: 'dashboard.desc_yourMethod',
  href: '/methods/your-method',
  formulaTex: '...', // LaTeX formula for KaTeX
  orderTex: 'O(...)', // Convergence rate
  icon: YourLucideIcon,
  accentClass: '...',
}
```

### 3. Create the Interactive UI Component
Create your method component (e.g. `components/your-method.tsx`):
- **Input Panel:** Allow user to enter function, intervals/step sizes, tolerance, and initial guesses.
- **Parsing:** Use `mathjs` safely to evaluate functions.
- **KaTeX Formula Rendering:** Show formulas dynamically with KaTeX.
- **Interactive Visualization:** Render function plots, roots, secants, or tangent lines using `recharts` and `components/ui/coordinate-axes.tsx`.
- **Step-by-Step Audit Table:** Display an iteration table with columns for step $n$, values, residuals, and error estimates.
- **Result Actions:** Include `<ResultActions />` for copying results and downloading high-resolution PNG charts (`modern-screenshot`).

### 4. Create the Page Route
Add `app/(workspace)/methods/your-method/page.tsx`:
```tsx
import { YourMethodComponent } from '@/components/your-method';

export default function YourMethodPage() {
  return <YourMethodComponent />;
}
```

### 5. Multi-language Support (i18n)
Add titles, descriptions, and labels across all locale files:
- `lib/i18n/locales/uz.json` (O'zbekcha)
- `lib/i18n/locales/ru.json` (Русский)
- `lib/i18n/locales/en.json` (English)

### 6. Add Navigation Entry
Register the new route in `components/app-shell.tsx` under the sidebar navigation array.

---

## 🔄 Commit Message Convention

We strictly follow **Conventional Commits** with a trailing emoji matching the intent:

```
<type>(<scope>): <short imperative subject> <emoji>

[optional body explaining motivation and changes]
```

### Types & Emojis:

| Type | Intent | Emoji |
| :--- | :--- | :---: |
| `feat` | New user-facing feature or method | ✨ |
| `fix` | Bug fix or mathematical correction | 🐛 |
| `refactor` | Code restructuring with no behavior change | ♻️ |
| `perf` | Performance improvement | ⚡️ |
| `style` | Formatting or whitespace adjustments | 🎨 |
| `docs` | Documentation updates (README, docs, guides) | 📝 |
| `chore` | Tooling, dependencies, build configs | 🧹 / 🔧 |
| `test` | Adding or fixing test suites | 🧪 |

**Examples:**
```bash
feat(newton): add convergence safeguard and divided difference table ✨
fix(rk4): resolve step size underflow at boundary conditions 🐛
docs(readme): add android apk installation guide 📝
```

---

## 🚀 Pull Request (PR) Workflow

1. **Fork the Repository:** Create your own fork at `github.com/hexjasur/numeric-methods`.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
3. **Make Focused Changes:** Split large tasks into logical commits.
4. **Run Quality Gates Locally:**
   ```bash
   # 1. Run ESLint checks
   bun run lint

   # 2. Verify static export build
   bun run build

   # 3. Check version sync (if package or Tauri config was modified)
   bun run check:version
   ```
   Both `bun run lint` and `bun run build` **must exit with code 0**.
5. **Push and Open a Pull Request:**
   - Push your branch to your fork: `git push origin feat/your-feature-name`.
   - Open a PR against the `main` branch.
   - Fill out the provided [Pull Request Template](.github/pull_request_template.md).

---

## 🧑‍💻 Adding Yourself to Contributors

If your Pull Request is accepted, you are welcome to add your name, GitHub handle, and role to the Contributors section in `README.md` and `about-page.tsx`. Thank you for helping advance open computational mathematics!
