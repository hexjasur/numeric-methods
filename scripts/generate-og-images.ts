import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// MathJax renders formulas to vector SVG so they stay sharp in every OG image.
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

// Print Stream light theme tokens (mirrors app/globals.css :root).
const THEME = {
  bg: '#eceef0',
  bg2: '#f6f7f8',
  panel: '#fbfbfc',
  ink: '#0d0f12',
  ink2: '#2a2e35',
  muted: '#5d646e',
  line: '#d5d9de',
  line2: '#b9bfc7',
  brand: '#e8480c',
  brandSoft: '#fde8df',
  cyan: '#0891b2',
  cyanSoft: '#dff3f8',
  pos: '#0f9d6b',
} as const;

const SANS = "'DejaVu Sans', Helvetica, Arial, sans-serif";
const MONO = "'DejaVu Sans Mono', 'Courier New', monospace";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({ packages: AllPackages });
const svgJax = new SVG({ fontCache: 'none' });
const mathDoc = mathjax.document('', { InputJax: tex, OutputJax: svgJax });

function renderLatexToSvgInner(latex: string, color: string): { inner: string; viewBox: string } {
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

export type OgAccent = 'brand' | 'cyan' | 'pos';

export interface MethodOgConfig {
  slug: string;
  methodId: string;
  category: string;
  /** English method name, one array item per line. Rendered large. */
  titleLines: string[];
  /** Uzbek name shown under the title. */
  subtitleUz: string;
  descriptionLines: string[];
  formulaLatex: string;
  conditionLatex?: string;
  badge: string;
  accent?: OgAccent;
}

const TITLE_MAX_PX = 84;
const TITLE_BOX_W = 560;
const DEFAULT_ACCENT: OgAccent = 'brand';

// Font size that keeps the longest title line inside the left column.
function titleFontSize(lines: string[]): number {
  const longest = Math.max(...lines.map((l) => l.length));
  return Math.min(TITLE_MAX_PX, Math.floor(TITLE_BOX_W / (0.62 * longest)));
}

function barcodeBars(x: number, y: number): string {
  const widths = [4, 2, 8, 3, 6, 2, 9, 3, 5, 2, 7, 4, 3, 6, 2, 8, 3, 5, 2, 7];
  let cursor = x;
  return widths
    .map((w) => {
      const rect = `<rect x="${cursor}" y="${y}" width="${w}" height="18" fill="${THEME.line2}" />`;
      cursor += w + 3;
      return rect;
    })
    .join('');
}

export function generateOgSvg({
  methodId,
  category,
  titleLines,
  subtitleUz,
  descriptionLines,
  formulaLatex,
  conditionLatex,
  badge,
  accent = DEFAULT_ACCENT,
}: MethodOgConfig): string {
  const accentColor = accent === 'brand' ? THEME.brand : accent === 'cyan' ? THEME.cyan : THEME.pos;
  const accentSoft = accent === 'brand' ? THEME.brandSoft : accent === 'cyan' ? THEME.cyanSoft : '#dcf3ea';

  const fontSize = titleFontSize(titleLines);
  const lineHeight = Math.round(fontSize * 1.02);
  const categoryY = 158;
  const titleTop = categoryY + 34 + Math.round(fontSize * 0.73);
  const titleTspans = titleLines
    .map((line, i) => `<tspan x="72" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');
  const titleBottom = titleTop + lineHeight * (titleLines.length - 1);
  const underlineY = titleBottom + Math.round(fontSize * 0.18);
  const subtitleY = underlineY + 50;
  const descStartY = subtitleY + 42;

  const descriptionSvg = descriptionLines
    .map((line, i) => `<text x="72" y="${descStartY + i * 32}" fill="${THEME.ink2}" font-size="22" font-family="${SANS}">${escapeXml(line)}</text>`)
    .join('\n    ');

  const formulaSvg = renderLatexToSvgInner(formulaLatex, THEME.ink);
  const conditionSvg = conditionLatex ? renderLatexToSvgInner(conditionLatex, THEME.ink) : null;

  const conditionBlock = conditionSvg
    ? `<rect x="724" y="316" width="380" height="56" rx="8" fill="${accentSoft}" stroke="${accentColor}" stroke-opacity="0.35" />
    <text x="740" y="350" fill="${THEME.muted}" font-size="15" font-family="${MONO}" font-weight="700">IF</text>
    <svg x="776" y="324" width="318" height="40" viewBox="${conditionSvg.viewBox}" preserveAspectRatio="xMinYMid meet">
      ${conditionSvg.inner}
    </svg>`
    : '';

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="4" height="8" fill="${THEME.ink}" fill-opacity="0.04" />
    </pattern>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${THEME.line}" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${THEME.bg}" />
  <rect width="1200" height="630" fill="url(#stripe)" />
  <rect x="32" y="32" width="1136" height="566" rx="12" fill="${THEME.panel}" stroke="${THEME.line}" stroke-width="1.5" />

  <!-- Top strip: eyebrow · barcode · id -->
  <rect x="64" y="60" width="1072" height="48" rx="8" fill="${THEME.panel}" stroke="${THEME.line}" />
  <text x="84" y="90" fill="${THEME.ink}" font-size="18" font-family="${MONO}" font-weight="700" letter-spacing="2">NUMERIC / METHODS</text>
  ${barcodeBars(360, 75)}
  <text x="1116" y="90" fill="${THEME.muted}" font-size="16" font-family="${MONO}" font-weight="700" text-anchor="end" letter-spacing="1.5">${escapeXml(methodId)}</text>

  <!-- Left column: category, English title, Uzbek name, description -->
  <text x="72" y="${categoryY}" fill="${accentColor}" font-size="18" font-family="${MONO}" font-weight="700" letter-spacing="2.5">${escapeXml(category)}</text>
  <text x="72" y="${titleTop}" fill="${THEME.ink}" font-size="${fontSize}" font-family="${SANS}" font-weight="800" letter-spacing="-${Math.max(1, Math.round(fontSize / 40))}">${titleTspans}</text>
  <rect x="72" y="${underlineY}" width="${Math.min(TITLE_BOX_W, Math.round(fontSize * 3.2))}" height="10" fill="${accentColor}" />
  <text x="72" y="${subtitleY}" fill="${THEME.muted}" font-size="30" font-family="${SANS}" font-weight="600">${escapeXml(subtitleUz)}</text>
  ${descriptionSvg}

  <!-- Right column: formula card -->
  <rect x="700" y="150" width="428" height="240" rx="10" fill="${THEME.bg2}" stroke="${THEME.line}" stroke-width="1.5" />
  <text x="724" y="184" fill="${THEME.muted}" font-size="15" font-family="${MONO}" font-weight="700" letter-spacing="1.5">FORMULA</text>
  <rect x="724" y="200" width="380" height="${conditionSvg ? 100 : 140}" rx="8" fill="${THEME.panel}" stroke="${THEME.line2}" />
  <svg x="740" y="208" width="348" height="${conditionSvg ? 84 : 124}" viewBox="${formulaSvg.viewBox}" preserveAspectRatio="xMidYMid meet">
    ${formulaSvg.inner}
  </svg>
  ${conditionBlock}

  <!-- Footer -->
  <line x1="72" y1="500" x2="1128" y2="500" stroke="${THEME.line}" stroke-width="1.5" />
  <rect x="72" y="526" width="${Math.max(180, badge.length * 12 + 40)}" height="36" rx="8" fill="${accentSoft}" stroke="${accentColor}" stroke-opacity="0.4" />
  <text x="${72 + Math.max(180, badge.length * 12 + 40) / 2}" y="550" fill="${accentColor}" font-size="16" font-family="${MONO}" font-weight="700" text-anchor="middle" letter-spacing="1">${escapeXml(badge)}</text>
  <text x="1128" y="552" fill="${THEME.ink}" font-size="24" font-family="${MONO}" font-weight="700" text-anchor="end">sonli-usullar<tspan fill="${accentColor}">.uz</tspan></text>
</svg>`;
}

export const ALL_OG_CONFIGS: MethodOgConfig[] = [
  {
    slug: 'main',
    methodId: 'LAB // 2026',
    category: 'NUMERICAL LABORATORY',
    titleLines: ['Numerical', 'Methods'],
    subtitleUz: 'Sonli Usullar Laboratoriyasi',
    descriptionLines: [
      "Matematik va muhandislik masalalarini qadam-baqam",
      'yechuvchi interaktiv online laboratoriya.',
    ],
    formulaLatex: "f(x) = 0 \\quad \\int_a^b f(x)\\,dx \\quad y' = f(x,y)",
    badge: '13 TA USUL',
    accent: 'brand',
  },
  {
    slug: 'bisection',
    methodId: 'METHOD // 001',
    category: 'ROOT FINDING',
    titleLines: ['Bisection', 'Method'],
    subtitleUz: 'Biseksiya usuli',
    descriptionLines: ["Oraliqni teng ikkiga bo'lib, ildizni", 'kafolatli tarzda yaqinlashtiring.'],
    formulaLatex: 'c = \\frac{a + b}{2}',
    conditionLatex: 'f(a)\\cdot f(b) < 0',
    badge: 'KAFOLATLI YAQINLASHISH',
    accent: 'brand',
  },
  {
    slug: 'newton',
    methodId: 'METHOD // 002',
    category: 'TANGENT LINES',
    titleLines: ["Newton's", 'Method'],
    subtitleUz: 'Nyuton usuli',
    descriptionLines: ['Hosila urinmasi yordamida nochiziqli', 'tenglama ildizini kvadratik tezlikda toping.'],
    formulaLatex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
    badge: 'KVADRATIK TEZLIK',
    accent: 'brand',
  },
  {
    slug: 'euler',
    methodId: 'METHOD // 003',
    category: 'ODE // INITIAL VALUE',
    titleLines: ['Euler', 'Methods'],
    subtitleUz: 'Eyler usullari',
    descriptionLines: ['Koshi masalasini oddiy va takomillashtirilgan', 'Eyler usullari bilan yeching.'],
    formulaLatex: 'y_{i+1} = y_i + h \\cdot f(x_i, y_i)',
    badge: 'CHEKLI AYIRMALAR',
    accent: 'cyan',
  },
  {
    slug: 'runge-kutta',
    methodId: 'METHOD // 004',
    category: 'ODE // INITIAL VALUE',
    titleLines: ['Runge-Kutta', '4th Order'],
    subtitleUz: 'Runge-Kutta 4 usuli',
    descriptionLines: ["Koshi masalasini 4-tartibli klassik usul bilan", 'O(h⁴) aniqlikda yeching.'],
    formulaLatex: 'y_{i+1} = y_i + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
    badge: "YUQORI ANIQLIK O(h⁴)",
    accent: 'cyan',
  },
  {
    slug: 'lagrange',
    methodId: 'METHOD // 005',
    category: 'APPROXIMATION',
    titleLines: ['Lagrange', 'Interpolation'],
    subtitleUz: 'Lagranj interpolyatsiyasi',
    descriptionLines: ['Tugun nuqtalari orqali Lagranj', "ko'phadini qadam-baqam hisoblang."],
    formulaLatex: 'L(x) = \\sum_{i=0}^{n} y_i \\prod_{j \\ne i} \\frac{x - x_j}{x_i - x_j}',
    badge: 'POLINOMIAL FIT',
    accent: 'brand',
  },
  {
    slug: 'newton-interpolation',
    methodId: 'METHOD // 010',
    category: 'APPROXIMATION',
    titleLines: ['Newton', 'Interpolation'],
    subtitleUz: 'Nyuton interpolyatsiyasi',
    descriptionLines: ['Bo‘lingan ayirmalar jadvalidan Newton', "ko'phadini tuzing va P(x*) ni toping."],
    formulaLatex: 'P(x) = y_0 + f[x_0,x_1](x - x_0) + \\cdots',
    badge: 'DIVIDED DIFFERENCES',
    accent: 'brand',
  },
  {
    slug: 'rectangles',
    methodId: 'METHOD // 006',
    category: 'QUADRATURE',
    titleLines: ['Rectangle', 'Rule'],
    subtitleUz: "To'g'ri to'rtburchaklar usuli",
    descriptionLines: ["Aniq integralni chap va o'ng to'g'ri", "to'rtburchaklar yig'indisi bilan hisoblang."],
    formulaLatex: 'I \\approx h \\sum_{i=0}^{n-1} f(x_i)',
    badge: "RIEMANN YIG'INDISI",
    accent: 'pos',
  },
  {
    slug: 'simpson',
    methodId: 'METHOD // 007',
    category: 'QUADRATURE',
    titleLines: ["Simpson's", 'Rule'],
    subtitleUz: 'Simpson usuli',
    descriptionLines: ['Parabolik approksimatsiya asosida', "Simpson 1/3 qoidasi bilan integrallang."],
    formulaLatex: 'I \\approx \\frac{h}{3}\\left[y_0 + 4\\sum y_{\\text{toq}} + 2\\sum y_{\\text{juft}} + y_n\\right]',
    badge: 'PARABOLIK O(h⁴)',
    accent: 'pos',
  },
  {
    slug: 'trapezoid',
    methodId: 'METHOD // 008',
    category: 'QUADRATURE',
    titleLines: ['Trapezoidal', 'Rule'],
    subtitleUz: 'Trapetsiyalar usuli',
    descriptionLines: ["Egri chiziq ostidagi yuzani trapetsiyalarga", "bo'lib hisoblang."],
    formulaLatex: 'I \\approx h\\left[\\frac{y_0 + y_n}{2} + \\sum_{i=1}^{n-1} y_i\\right]',
    badge: 'CHIZIQLI TRAPETSIYA',
    accent: 'pos',
  },
  {
    slug: 'sweep',
    methodId: 'METHOD // 009',
    category: 'LINEAR ALGEBRA',
    titleLines: ['Thomas', 'Algorithm'],
    subtitleUz: 'Progonka usuli',
    descriptionLines: ["Uch diagonalli chiziqli sistemani to'g'ri", 'va teskari yurish bilan yeching.'],
    formulaLatex: 'x_i = \\alpha_{i+1} x_{i+1} + \\beta_{i+1}',
    badge: 'CHIZIQLI O(n)',
    accent: 'brand',
  },
  {
    slug: 'bvp',
    methodId: 'METHOD // 011',
    category: 'BOUNDARY VALUE',
    titleLines: ['Finite Difference', 'BVP'],
    subtitleUz: 'Chekli ayirmalar usuli',
    descriptionLines: ['Ikkinchi tartibli chegaraviy masalani chekli', 'ayirmalar va Tomas algoritmi bilan yeching.'],
    formulaLatex: "y'' + P(x)\\,y' + Q(x)\\,y = f(x)",
    conditionLatex: 'y(a)=g_0,\\quad y(b)=g_1',
    badge: 'CHEKLI AYIRMALAR',
    accent: 'cyan',
  },
  {
    slug: 'adams-predictor',
    methodId: 'METHOD // 012',
    category: 'ODE // MULTISTEP',
    titleLines: ['Adams', 'Predictor'],
    subtitleUz: 'Adams bashorat qiluvchi usuli',
    descriptionLines: ['RK4 boshlang‘ich qadamlari va 3-tartibli', 'Adams bashorat formulasi.'],
    formulaLatex: 'y_{i+1}=y_i+q_i+\\tfrac{1}{2}\\Delta q_{i-1}+\\tfrac{5}{12}\\Delta^2 q_{i-2}',
    badge: '3-TARTIBLI ADAMS',
    accent: 'cyan',
  },
  {
    slug: 'collocation',
    methodId: 'METHOD // 013',
    category: 'BOUNDARY VALUE',
    titleLines: ['Collocation', 'Method'],
    subtitleUz: 'Kollokatsiya usuli',
    descriptionLines: ['Bazis funksiyalar va kollokatsiya nuqtalari', 'orqali chegaraviy masalani yeching.'],
    formulaLatex: "A_2(x)\\,u'' + A_1(x)\\,u' + A_0(x)\\,u = f(x)",
    conditionLatex: '\\alpha_0 u(a)+\\alpha_1 u\'(a)=A',
    badge: 'KOLLOKATSIYA',
    accent: 'cyan',
  },
];

async function main() {
  const isForce = process.argv.includes('--force');
  const targetDir = path.join(process.cwd(), 'public', 'images', 'og');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const missingConfigs = ALL_OG_CONFIGS.filter((cfg) => {
    if (isForce) return true;
    return !fs.existsSync(path.join(targetDir, `${cfg.slug}.png`));
  });

  if (missingConfigs.length === 0) {
    console.log(`[og-generator] All ${ALL_OG_CONFIGS.length} OG images exist. (Use --force to regenerate)`);
    return;
  }

  console.log(`[og-generator] Generating ${missingConfigs.length} OG image(s)...`);
  const start = performance.now();
  for (const config of missingConfigs) {
    const svg = generateOgSvg(config);
    const outFile = path.join(targetDir, `${config.slug}.png`);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
    console.log(`  Created: public/images/og/${config.slug}.png`);
  }
  const duration = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`[og-generator] Completed in ${duration}s`);
}

main().catch((err) => {
  console.error('[og-generator] Error:', err);
  process.exit(1);
});
