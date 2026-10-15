'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRightLeft,
  ArrowUpRight,
  Search,
  Sigma,
  Spline,
  Split,
  type LucideIcon,
} from 'lucide-react';
import katex from 'katex';
import { useI18n } from '@/components/i18n-provider';
import { PsPanel, PsPanelHead } from '@/components/ui/print-stream';

type MethodCategory = 'all' | 'equations' | 'linear' | 'interpolation' | 'quadrature' | 'odes';

interface MethodDef {
  id: string;
  code: string;
  category: 'equations' | 'linear' | 'interpolation' | 'quadrature' | 'odes';
  categoryKey: string;
  titleKey: string;
  descKey: string;
  href: string;
  formulaTex: string;
  orderTex: string;
  icon: LucideIcon;
  accentClass: string;
  isNew?: boolean;
}

const METHODS: MethodDef[] = [
  {
    id: 'bisection',
    code: '01 / ALG',
    category: 'equations',
    categoryKey: 'dashboard.cat_equations',
    titleKey: 'nav.bisection',
    descKey: 'dashboard.desc_bisection',
    href: '/methods/bisection',
    formulaTex: 'c = \\frac{a+b}{2}, \\quad f(a) \\cdot f(c) < 0',
    orderTex: 'O(\\log_2(1/\\varepsilon))',
    icon: Split,
    accentClass: 'text-cyan bg-cyan-soft border-cyan/25',
  },
  {
    id: 'newton',
    code: '02 / ALG',
    category: 'equations',
    categoryKey: 'dashboard.cat_equations',
    titleKey: 'nav.newton',
    descKey: 'dashboard.desc_newton',
    href: '/methods/newton',
    formulaTex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
    orderTex: 'O(\\log\\log(1/\\varepsilon))',
    icon: ArrowUpRight,
    accentClass: 'text-cyan bg-cyan-soft border-cyan/25',
  },
  {
    id: 'sweep',
    code: '03 / LIN',
    category: 'linear',
    categoryKey: 'dashboard.cat_linear',
    titleKey: 'nav.sweep',
    descKey: 'dashboard.desc_sweep',
    href: '/methods/sweep',
    formulaTex: 'a_i x_{i-1} + b_i x_i + c_i x_{i+1} = d_i',
    orderTex: 'O(n)',
    icon: ArrowRightLeft,
    accentClass: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/25',
  },
  {
    id: 'lagrange',
    code: '04 / INT',
    category: 'interpolation',
    categoryKey: 'dashboard.cat_interpolation',
    titleKey: 'nav.lagrange',
    descKey: 'dashboard.desc_lagrange',
    href: '/methods/lagrange',
    formulaTex: 'L_n(x) = \\sum_{i=0}^n y_i \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}',
    orderTex: 'O(n^2)',
    icon: Spline,
    accentClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
  },
  {
    id: 'rectangles',
    code: '05 / QUA',
    category: 'quadrature',
    categoryKey: 'dashboard.cat_quadrature',
    titleKey: 'nav.rectangles',
    descKey: 'dashboard.desc_rectangles',
    href: '/methods/rectangles',
    formulaTex: 'I \\approx h \\sum_{i=0}^{n-1} f(x_i^*), \\quad x_i^* \\in \\{x_i, x_{i+1}\\}',
    orderTex: 'O(h) \\dots O(h^2)',
    icon: Sigma,
    accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  },
  {
    id: 'trapezoid',
    code: '06 / QUA',
    category: 'quadrature',
    categoryKey: 'dashboard.cat_quadrature',
    titleKey: 'nav.trapezoid',
    descKey: 'dashboard.desc_trapezoid',
    href: '/methods/trapezoid',
    formulaTex: 'I \\approx \\frac{h}{2} \\left[ y_0 + 2\\sum_{i=1}^{n-1} y_i + y_n \\right]',
    orderTex: 'O(h^2)',
    icon: Sigma,
    accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  },
  {
    id: 'simpson',
    code: '07 / QUA',
    category: 'quadrature',
    categoryKey: 'dashboard.cat_quadrature',
    titleKey: 'nav.simpson',
    descKey: 'dashboard.desc_simpson',
    href: '/methods/simpson',
    formulaTex: 'I \\approx \\frac{h}{3} \\left[ y_0 + 4\\sum_{\\text{toq}} y_i + 2\\sum_{\\text{juft}} y_i + y_n \\right]',
    orderTex: 'O(h^4)',
    icon: Sigma,
    accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  },
  {
    id: 'euler',
    code: '08 / ODE',
    category: 'odes',
    categoryKey: 'dashboard.cat_odes',
    titleKey: 'nav.euler',
    descKey: 'dashboard.desc_euler',
    href: '/methods/euler',
    formulaTex: 'y_{i+1} = y_i + h \\cdot f(x_i, y_i), \\quad y(x_0) = y_0',
    orderTex: 'O(h)',
    icon: Activity,
    accentClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
    isNew: true,
  },
  {
    id: 'runge-kutta',
    code: '09 / ODE',
    category: 'odes',
    categoryKey: 'dashboard.cat_odes',
    titleKey: 'nav.rungeKutta',
    descKey: 'dashboard.desc_rungeKutta',
    href: '/methods/runge-kutta',
    formulaTex: String.raw`y_{i+1}=y_i+\frac{k_0+2k_1+2k_2+k_3}{6}`,
    orderTex: 'O(h^4)',
    icon: Activity,
    accentClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
    isNew: true,
  },
  {
    id: 'iteration',
    code: '10 / ALG',
    category: 'equations',
    categoryKey: 'dashboard.cat_equations',
    titleKey: 'nav.iteration',
    descKey: 'dashboard.desc_iteration',
    href: '/methods/iteration',
    formulaTex: String.raw`x_{k+1}=x_k-\frac{f(x_k)}{M}`,
    orderTex: 'O(k)',
    icon: ArrowUpRight,
    accentClass: 'text-cyan bg-cyan-soft border-cyan/25',
  },
  {
    id: 'spline',
    code: '11 / INT',
    category: 'interpolation',
    categoryKey: 'dashboard.cat_interpolation',
    titleKey: 'nav.spline',
    descKey: 'dashboard.desc_spline',
    href: '/methods/spline',
    formulaTex: 'S_i(x)=a_i+b_i x+c_i x^2+d_i x^3',
    orderTex: 'O(n)',
    icon: Spline,
    accentClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
  },
];

function renderKatexSafe(tex: string, displayMode = false): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode });
  } catch {
    return tex;
  }
}

export function MethodsHub() {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<MethodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const definitions: { id: MethodCategory; label: string }[] = [
      { id: 'all', label: t('dashboard.cat_all') || 'Barchasi' },
      { id: 'equations', label: t('dashboard.cat_equations') || 'Tenglamalar' },
      { id: 'linear', label: t('dashboard.cat_linear') || 'Chiziqli sistemalar' },
      { id: 'interpolation', label: t('dashboard.cat_interpolation') || 'Interpolyatsiya' },
      { id: 'quadrature', label: t('dashboard.cat_quadrature') || 'Integrallash' },
      { id: 'odes', label: t('dashboard.cat_odes') || 'Differensial' },
    ];
    return definitions.map((category) => ({
      ...category,
      count:
        category.id === 'all'
          ? METHODS.length
          : METHODS.filter((method) => method.category === category.id).length,
    }));
  }, [t]);

  const filteredMethods = useMemo(() => {
    return METHODS.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = t(m.titleKey).toLowerCase();
      const desc = t(m.descKey).toLowerCase();
      const code = m.code.toLowerCase();
      return title.includes(q) || desc.includes(q) || code.includes(q);
    }).sort((left, right) => Number(right.isNew ?? false) - Number(left.isNew ?? false));
  }, [selectedCategory, searchQuery, t]);

  return (
    <PsPanel className="mb-[18px]">
      <PsPanelHead
        eyebrow={t('dashboard.catalog_eyebrow') || '02 / METODLAR KATALOGI'}
        title={t('dashboard.catalog_title') || 'Interaktiv sonli usullar laboratoriyasi'}
        idx="HUB"
      />

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-bg-2 border border-line rounded-lg" role="tablist">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-ink text-brand-ink shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-panel'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-line/40 text-muted'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dashboard.search_placeholder') || 'Metodlarni qidirish...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-bg-2 border border-line rounded-lg text-ink placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all"
          />
        </div>
      </div>

      {/* Grid of Methods */}
      {filteredMethods.length === 0 ? (
        <div className="grid place-content-center min-h-[160px] text-center text-muted font-mono text-xs p-6 border border-dashed border-line-2 rounded-lg bg-bg-2">
          {t('dashboard.no_methods_found') || 'Ushbu toifada metod topilmadi.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredMethods.map((method) => {
            const Icon = method.icon;
            const title = t(method.titleKey);
            const desc = t(method.descKey);
            const categoryLabel = t(method.categoryKey);
            const formulaHtml = renderKatexSafe(method.formulaTex, false);
            const orderHtml = renderKatexSafe(method.orderTex, false);

            return (
              <Link
                key={method.id}
                href={method.href}
                prefetch={false}
                className="group relative flex flex-col justify-between p-5 rounded-xl border border-line bg-bg-2 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:bg-panel hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* Top Bar: Code, Category & Order */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold text-muted bg-panel border border-line px-1.5 py-0.5 rounded">
                      {method.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {method.isNew && <span className="rounded-full border border-amber-400/50 bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-amber-700 dark:text-amber-300">{t('dashboard.badge_new')}</span>}
                      <span className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${method.accentClass}`}>{categoryLabel}</span>
                    </div>
                  </div>

                  {/* Title with Icon */}
                  <div className="flex items-center gap-2.5 my-2">
                    <div className="p-2 rounded-lg bg-panel border border-line text-brand transition-colors group-hover:bg-brand-soft">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-[16px] font-[650] tracking-[-.02em] text-ink group-hover:text-brand transition-colors">
                      {title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-muted line-clamp-2">
                    {desc}
                  </p>

                  {/* Mathematical Formula Preview */}
                  <div className="mt-3.5 p-2 bg-panel border border-dashed border-line rounded-lg text-center overflow-x-auto text-[13px] text-cyan [&_.katex]:text-[1.05em] group-hover:border-cyan/40 transition-colors">
                    <span dangerouslySetInnerHTML={{ __html: formulaHtml }} />
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-4 pt-3 border-t border-line/70 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                    <span>{t('dashboard.complexity_label') || 'Tartibi'}:</span>
                    <span
                      className="text-ink font-semibold"
                      dangerouslySetInnerHTML={{ __html: orderHtml }}
                    />
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand text-xs transition-transform group-hover:translate-x-0.5">
                    {t('dashboard.launch_method') || 'Laboratoriyaga'}
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PsPanel>
  );
}
