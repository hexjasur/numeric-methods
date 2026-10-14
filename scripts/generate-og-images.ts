import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// MathJax setup for vector SVG math rendering
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: AllPackages });
const svgJax = new SVG({ fontCache: 'none' });
const mathDoc = mathjax.document('', { InputJax: tex, OutputJax: svgJax });

function renderLatexToSvgInner(latex: string, color = '#22d3ee'): { inner: string; viewBox: string } {
  try {
    const node = mathDoc.convert(latex, { display: true });
    let svgHtml = adaptor.innerHTML(node);
    const vbMatch = svgHtml.match(/viewBox="([^"]+)"/);
    const viewBox = vbMatch ? vbMatch[1] : '0 0 1000 1000';

    svgHtml = svgHtml.replace(/currentColor/g, color);

    const innerMatch = svgHtml.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const inner = innerMatch ? innerMatch[1] : svgHtml;

    return { inner, viewBox };
  } catch (err) {
    console.error('MathJax render error:', err);
    return { inner: '', viewBox: '0 0 1000 1000' };
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface MethodOgConfig {
  slug: string;
  methodId: string;
  category: string;
  titleUz: string;
  titleAlt: string;
  descriptionLine1: string;
  descriptionLine2?: string;
  formulaLatex: string;
  conditionLatex?: string;
  badge: string;
  accentColor?: string;
}

export function generateOgSvg({
  methodId,
  category,
  titleUz,
  titleAlt,
  descriptionLine1,
  descriptionLine2,
  formulaLatex,
  conditionLatex,
  badge,
  accentColor = '#ff6a2b',
}: MethodOgConfig): string {
  const safeTitleUz = escapeXml(titleUz);
  const safeTitleAlt = escapeXml(titleAlt);
  const safeDesc1 = escapeXml(descriptionLine1);
  const safeDesc2 = descriptionLine2 ? escapeXml(descriptionLine2) : '';
  const safeCategory = escapeXml(category);
  const safeMethodId = escapeXml(methodId);
  const safeBadge = escapeXml(badge);

  const formulaSvg = renderLatexToSvgInner(formulaLatex, '#22d3ee');
  const conditionSvg = conditionLatex ? renderLatexToSvgInner(conditionLatex, '#eef0f2') : null;

  const gridLines: string[] = [];
  for (let x = 40; x <= 1160; x += 60) {
    gridLines.push(`<line x1="${x}" y1="40" x2="${x}" y2="590" stroke="#16191f" stroke-width="1" />`);
  }
  for (let y = 40; y <= 590; y += 50) {
    gridLines.push(`<line x1="40" y1="${y}" x2="1160" y2="${y}" stroke="#16191f" stroke-width="1" />`);
  }

  const barcodeDashes = [4, 2, 8, 3, 6, 2, 9, 3, 5, 2, 7, 4, 3, 6, 2, 8, 3, 5, 2, 7]
    .map((w, i) => `<rect x="${760 + i * 10}" y="67" width="${w}" height="14" fill="#303640" />`)
    .join('');

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cyan-glow" cx="85%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#0a0b0d" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="brand-glow" cx="15%" cy="85%" r="55%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#0a0b0d" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14171d" />
      <stop offset="100%" stop-color="#0e1014" />
    </linearGradient>
    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="60%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#272b32" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0b0d" />
  <rect width="1200" height="630" fill="url(#cyan-glow)" />
  <rect width="1200" height="630" fill="url(#brand-glow)" />

  <g opacity="0.4">
    ${gridLines.join('\n    ')}
  </g>

  <rect x="40" y="40" width="1120" height="550" rx="14" fill="none" stroke="#23272e" stroke-width="1.5" />

  <g stroke="${accentColor}" stroke-width="2" opacity="0.8">
    <line x1="32" y1="40" x2="48" y2="40" /><line x1="40" y1="32" x2="40" y2="48" />
    <line x1="1152" y1="40" x2="1168" y2="40" /><line x1="1160" y1="32" x2="1160" y2="48" />
    <line x1="32" y1="590" x2="48" y2="590" /><line x1="40" y1="582" x2="40" y2="598" />
    <line x1="1152" y1="590" x2="1168" y2="590" /><line x1="1160" y1="582" x2="1160" y2="598" />
  </g>

  <!-- HEADER -->
  <g id="header-strip">
    <rect x="70" y="60" width="168" height="28" rx="6" fill="#14171d" stroke="#272b32" stroke-width="1" />
    <circle cx="85" cy="74" r="4" fill="${accentColor}" />
    <text x="96" y="78" fill="#eef0f2" font-size="11" font-family="'Courier New', monospace" font-weight="700" letter-spacing="1.5">SONLI USULLAR</text>

    <text x="254" y="78" fill="#8d949d" font-size="11" font-family="'Courier New', monospace" font-weight="600" letter-spacing="2">${safeCategory}</text>
    <g>${barcodeDashes}</g>

    <rect x="990" y="60" width="138" height="28" rx="6" fill="#14171d" stroke="#272b32" stroke-width="1" />
    <text x="1059" y="78" fill="#22d3ee" font-size="11" font-family="'Courier New', monospace" font-weight="600" letter-spacing="1" text-anchor="middle">${safeBadge}</text>
  </g>

  <line x1="70" y1="104" x2="1128" y2="104" stroke="#1d2127" stroke-width="1" />

  <!-- LEFT CONTENT -->
  <g id="main-content">
    <rect x="72" y="130" width="112" height="24" rx="4" fill="rgba(255, 106, 43, 0.12)" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1" />
    <text x="128" y="146" fill="${accentColor}" font-size="11" font-family="'Courier New', monospace" font-weight="700" letter-spacing="1.5" text-anchor="middle">${safeMethodId}</text>

    <text x="70" y="222" fill="#ffffff" font-size="52" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="800" letter-spacing="-1">
      ${safeTitleUz}
    </text>

    <rect x="72" y="242" width="200" height="5" rx="2" fill="url(#line-grad)" />

    <text x="72" y="280" fill="#8d949d" font-size="19" font-family="'Courier New', monospace" font-weight="500">
      ${safeTitleAlt}
    </text>

    <text x="72" y="328" fill="#c3c8cf" font-size="19" font-family="'Segoe UI', Roboto, sans-serif">
      ${safeDesc1}
    </text>
    ${
      safeDesc2
        ? `<text x="72" y="358" fill="#8d949d" font-size="18" font-family="'Segoe UI', Roboto, sans-serif">
      ${safeDesc2}
    </text>`
        : ''
    }
  </g>

  <!-- FORMULA CARD -->
  <g id="formula-card">
    <rect x="670" y="132" width="460" height="294" rx="12" fill="url(#card-grad)" stroke="#272b32" stroke-width="1.5" />
    
    <rect x="670" y="132" width="460" height="40" rx="12" fill="#181c24" />
    <rect x="670" y="152" width="460" height="20" fill="#181c24" />
    <circle cx="694" cy="152" r="3.5" fill="#ff6a2b" />
    <circle cx="708" cy="152" r="3.5" fill="#22d3ee" />
    <circle cx="722" cy="152" r="3.5" fill="#34d399" />
    <text x="740" y="156" fill="#8d949d" font-size="11" font-family="'Courier New', monospace" font-weight="600" letter-spacing="1">MATEMATIK HISOB / FORMULA (LATEX)</text>

    <rect x="692" y="188" width="416" height="88" rx="8" fill="#0a0b0d" stroke="#22262e" stroke-width="1" />
    
    <svg x="704" y="196" width="392" height="72" viewBox="${formulaSvg.viewBox}" preserveAspectRatio="xMidYMid meet">
      ${formulaSvg.inner}
    </svg>

    ${
      conditionSvg
        ? `
    <rect x="692" y="290" width="416" height="46" rx="6" fill="rgba(34, 211, 238, 0.08)" stroke="#22d3ee" stroke-opacity="0.25" stroke-width="1" />
    <text x="712" y="318" fill="#8d949d" font-size="11" font-family="'Courier New', monospace">SHART:</text>
    <svg x="768" y="297" width="320" height="32" viewBox="${conditionSvg.viewBox}" preserveAspectRatio="xMinYMid meet">
      ${conditionSvg.inner}
    </svg>
    `
        : `
    <rect x="692" y="290" width="416" height="46" rx="6" fill="#14171d" stroke="#1f2329" stroke-width="1" />
    <text x="712" y="318" fill="#8d949d" font-size="13" font-family="'Segoe UI', Roboto, sans-serif">✓ Qadam-baqam analitik yechim va taqqoslash</text>
    `
    }

    <g transform="translate(692, 354)">
      <rect x="0" y="0" width="130" height="32" rx="6" fill="#14171d" stroke="#272b32" stroke-width="1" />
      <text x="65" y="20" fill="#34d399" font-size="11" font-family="'Courier New', monospace" font-weight="600" text-anchor="middle">✓ INTERAKTIV</text>

      <rect x="142" y="0" width="132" height="32" rx="6" fill="#14171d" stroke="#272b32" stroke-width="1" />
      <text x="208" y="20" fill="#ff6a2b" font-size="11" font-family="'Courier New', monospace" font-weight="600" text-anchor="middle">⚡ QADAM-BAQAM</text>

      <rect x="286" y="0" width="130" height="32" rx="6" fill="#14171d" stroke="#272b32" stroke-width="1" />
      <text x="351" y="20" fill="#22d3ee" font-size="11" font-family="'Courier New', monospace" font-weight="600" text-anchor="middle">📈 GRAFIK</text>
    </g>
  </g>

  <!-- FOOTER -->
  <g id="footer-strip">
    <line x1="70" y1="460" x2="1128" y2="460" stroke="#1d2127" stroke-width="1" />

    <g transform="translate(72, 492)">
      <rect x="0" y="0" width="190" height="34" rx="8" fill="#14171d" stroke="#272b32" stroke-width="1" />
      <text x="95" y="21" fill="#8d949d" font-size="11" font-family="'Courier New', monospace" font-weight="600" text-anchor="middle">✦ 100% BEPUL VA OCHIQ</text>

      <rect x="204" y="0" width="230" height="34" rx="8" fill="#14171d" stroke="#272b32" stroke-width="1" />
      <text x="319" y="21" fill="#8d949d" font-size="11" font-family="'Courier New', monospace" font-weight="600" text-anchor="middle">✦ WEB · WINDOWS · ANDROID</text>
    </g>

    <g transform="translate(900, 488)">
      <text x="228" y="26" fill="#ffffff" font-size="22" font-family="'Courier New', monospace" font-weight="700" letter-spacing="1" text-anchor="end">
        sonli-usullar<tspan fill="${accentColor}">.uz</tspan>
      </text>
      <text x="228" y="44" fill="#8d949d" font-size="11" font-family="'Courier New', monospace" letter-spacing="1.5" text-anchor="end">NUMERICAL METHODS LAB</text>
    </g>
  </g>
</svg>`;
}

export const ALL_OG_CONFIGS: MethodOgConfig[] = [
  {
    slug: 'main',
    methodId: 'LAB // 2026',
    category: 'MATEMATIK HISOB // NUMERICAL LAB',
    titleUz: 'Sonli Usullar Laboratoriyasi',
    titleAlt: 'Численные методы • Numerical Methods Platform',
    descriptionLine1: 'Matematik va muhandislik tenglamalarini',
    descriptionLine2: 'qadam-baqam yechuvchi interaktiv online laboratoriya.',
    formulaLatex: 'f(x) = 0 \\quad \\int_a^b f(x)dx \\quad y\' = f(x,y)',
    badge: '10 TA USUL',
    accentColor: '#ff6a2b',
  },
  {
    slug: 'bisection',
    methodId: 'METHOD // 001',
    category: 'ILDIZ TOPISH // ROOT FINDING',
    titleUz: 'Biseksiya usuli',
    titleAlt: 'Метод бисекции • Bisection Method',
    descriptionLine1: "Oraliqni teng ikkiga bo'lib, tenglama ildizini",
    descriptionLine2: 'kafolatli tarzda yaqinlashtiring va qadam-baqam yeching.',
    formulaLatex: 'c = \\frac{a + b}{2}',
    conditionLatex: 'f(a) \\cdot f(b) < 0',
    badge: 'KAFOLATLI YAQL.',
    accentColor: '#ff6a2b',
  },
  {
    slug: 'newton',
    methodId: 'METHOD // 002',
    category: 'URINMALAR // TANGENT METHOD',
    titleUz: 'Nyuton usuli',
    titleAlt: 'Метод Ньютона • Newton-Raphson',
    descriptionLine1: 'Hosila urinmasi yordamida nochiziqli tenglama',
    descriptionLine2: 'ildiziga kvadratik tezlikda yaqinlashish.',
    formulaLatex: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}',
    badge: 'KVADRATIK TEZLIK',
    accentColor: '#ff6a2b',
  },
  {
    slug: 'euler',
    methodId: 'METHOD // 003',
    category: 'ODU // DIFFERENSIAL TENGLAMA',
    titleUz: 'Eyler usullari',
    titleAlt: 'Метод Эйлера • Euler Methods',
    descriptionLine1: 'Oddiy differensial tenglamalarni Koshi masalasini',
    descriptionLine2: 'standart va takomillashtirilgan Eyler usullari bilan yechish.',
    formulaLatex: 'y_{i+1} = y_i + h \\cdot f(x_i, y_i)',
    badge: 'CHEKLI AYIRMALAR',
    accentColor: '#22d3ee',
  },
  {
    slug: 'runge-kutta',
    methodId: 'METHOD // 004',
    category: 'ODU // DIFFERENSIAL TENGLAMA',
    titleUz: 'Runge-Kutta 4 usuli',
    titleAlt: 'Метод Рунге-Кутты 4 • RK4 Solver',
    descriptionLine1: 'Koshi masalasini 4-tartibli klassik Runge-Kutta',
    descriptionLine2: 'usuli bilan yuqori O(h⁴) aniqlikda sonli integrallash.',
    formulaLatex: 'y_{i+1} = y_i + \\frac{h}{6}(k_0 + 2k_1 + 2k_2 + k_3)',
    badge: 'YUQORI O(h⁴) AN.',
    accentColor: '#22d3ee',
  },
  {
    slug: 'lagrange',
    methodId: 'METHOD // 005',
    category: 'APPROKSIMATSIYA // INTERPOLATION',
    titleUz: 'Lagranj interpolyatsiyasi',
    titleAlt: 'Интерполяция Лагранжа • Lagrange Polynomial',
    descriptionLine1: 'Berilgan tugun nuqtalari orqali Lagranj bazis',
    descriptionLine2: "ko'phadlarini va polinomni qadam-baqam hisoblash.",
    formulaLatex: 'L(x) = \\sum_{i=0}^n y_i \\prod_{j \\ne i} \\frac{x - x_j}{x_i - x_j}',
    badge: 'POLINOMIAL FIT',
    accentColor: '#ff6a2b',
  },
  {
    slug: 'rectangles',
    methodId: 'METHOD // 006',
    category: 'INTEGRALLASH // QUADRATURE',
    titleUz: "To'g'ri to'rtburchaklar",
    titleAlt: 'Метод прямоугольников • Rectangles Rule',
    descriptionLine1: "Aniq integrallarni chap va o'ng to'g'ri to'rtburchaklar",
    descriptionLine2: 'yordamida geometrik yuzalarni jamlab hisoblash.',
    formulaLatex: 'I \\approx h \\sum_{i=0}^{n-1} f(x_i)',
    badge: "RIEMANN YIG'INDISI",
    accentColor: '#34d399',
  },
  {
    slug: 'simpson',
    methodId: 'METHOD // 007',
    category: 'INTEGRALLASH // QUADRATURE',
    titleUz: 'Simpson usuli',
    titleAlt: "Метод Симпсона • Simpson's Rule",
    descriptionLine1: 'Aniq integrallarni parabolik approksimatsiya va',
    descriptionLine2: "Simpson 1/3 qoidasi bo'yicha yuqori aniqlikda hisoblash.",
    formulaLatex: 'I \\approx \\frac{h}{3}[y_0 + 4\\sum y_{toq} + 2\\sum y_{juft} + y_n]',
    badge: 'PARABOLIK O(h⁴)',
    accentColor: '#34d399',
  },
  {
    slug: 'trapezoid',
    methodId: 'METHOD // 008',
    category: 'INTEGRALLASH // QUADRATURE',
    titleUz: 'Trapetsiyalar usuli',
    titleAlt: 'Метод трапеций • Trapezoidal Rule',
    descriptionLine1: "Egri chiziqli oraliqni to'g'ri chiziqli trapetsiyalarga",
    descriptionLine2: 'bo\'lib, integral qiymatini qadam-baqam jamlash.',
    formulaLatex: 'I \\approx h \\left[ \\frac{y_0 + y_n}{2} + \\sum_{i=1}^{n-1} y_i \\right]',
    badge: 'CHIZIQLI TRAPETSIYA',
    accentColor: '#34d399',
  },
  {
    slug: 'sweep',
    methodId: 'METHOD // 009',
    category: 'SLAU // CHIZIQLI ALGEBRA',
    titleUz: 'Progonka usuli',
    titleAlt: 'Метод прогонки • Thomas Algorithm',
    descriptionLine1: 'Uch diagonalli chiziqli tenglamalar sistemasini',
    descriptionLine2: "to'g'ri va teskari yurish koeffitsientlari orqali yechish.",
    formulaLatex: 'x_i = \\alpha_{i+1} x_{i+1} + \\beta_{i+1}',
    badge: 'CHIZIQLI O(n)',
    accentColor: '#ff6a2b',
  },
];

async function main() {
  const isForce = process.argv.includes('--force');
  const targetDir = path.join(process.cwd(), 'public', 'images', 'og');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Check which files need generation
  const missingConfigs = ALL_OG_CONFIGS.filter((cfg) => {
    if (isForce) return true;
    const file = path.join(targetDir, `${cfg.slug}.png`);
    return !fs.existsSync(file);
  });

  if (missingConfigs.length === 0) {
    console.log(`[og-generator] ✅ All ${ALL_OG_CONFIGS.length} OG images exist. (Use --force to regenerate)`);
    return;
  }

  console.log(`[og-generator] 🚀 Generating ${missingConfigs.length} OG image(s)...`);
  const start = performance.now();

  for (const config of missingConfigs) {
    const svg = generateOgSvg(config);
    const outFile = path.join(targetDir, `${config.slug}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
    console.log(`  ✓ Created: public/images/og/${config.slug}.png`);
  }

  const duration = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`[og-generator] ✨ Completed in ${duration}s!`);
}

main().catch((err) => {
  console.error('[og-generator] Error:', err);
  process.exit(1);
});
