'use client';

import { createContext, useContext, useState, type FormEvent, type ReactNode } from 'react';
import katex from 'katex';
import { Calculator, Check, Copy, Info } from 'lucide-react';
import {
  PsHero,
  PsNote,
  PsPanel,
  PsPanelHead,
} from '@/components/ui/print-stream';
import { useScrollToResult } from '@/components/ui/use-scroll-to-result';
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/components/i18n-provider';
import {
  GalerkinError,
  exprTex,
  expandedApproximation,
  formatNumber,
  legendreBasis,
  operatorLhsTex,
  solveGalerkin,
  texNumber,
  type GalerkinInput,
  type GalerkinResult,
  type TexTerm,
} from '@/lib/galerkin';

type Translate = ReturnType<typeof useI18n>['t'];

// Empty form on page load; the user enters their own problem
const EMPTY_INPUT: GalerkinInput = {
  a2: '',
  a1: '',
  a0: '',
  f: '',
  a: '',
  b: '',
  alpha0: '1',
  alpha1: '0',
  alphaValue: '',
  beta0: '1',
  beta1: '0',
  betaValue: '',
  phi0: '',
  basis: [],
};

// Notebook example: u'' - u' cos x + u sin x = sin x, u(0)=1, u(pi)=2
const SAMPLE_INPUT: GalerkinInput = {
  a2: '1',
  a1: '-cos(x)',
  a0: 'sin(x)',
  f: 'sin(x)',
  a: '0',
  b: 'pi',
  alpha0: '1',
  alpha1: '0',
  alphaValue: '1',
  beta0: '1',
  beta1: '0',
  betaValue: '2',
  phi0: '',
  basis: ['sin(x)', 'sin(2*x)'],
};

const SAMPLE_TEMPLATE = 'sin(i*x)';
const PRECISIONS = [4, 6, 8, 12] as const;

function katexHtml(source: string, displayMode: boolean): string {
  return katex.renderToString(source, { throwOnError: false, displayMode });
}

// Precision chosen by the user; every decimal in result formulas is rounded to it
const PrecisionContext = createContext(6);

function roundNumbers(source: string, digits: number): string {
  return source.replace(/\d+\.\d+/g, (m) => String(Number(Number(m).toFixed(digits))));
}

function Tex({ value, block = true }: { value: string; block?: boolean }) {
  const digits = useContext(PrecisionContext);
  const text = roundNumbers(value, digits);
  // Inline formulas are spans so they can sit inside paragraphs
  return block ? (
    <div className="w-full overflow-x-auto text-cyan" dangerouslySetInnerHTML={{ __html: katexHtml(text, true) }} />
  ) : (
    <span className="inline-block text-cyan" dangerouslySetInnerHTML={{ __html: katexHtml(text, false) }} />
  );
}

function Step({
  index,
  title,
  eyebrow,
  children,
}: {
  index: number;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <PsPanel className="mb-5">
      <PsPanelHead
        eyebrow={eyebrow ?? t('galerkin.step', { index })}
        title={title}
        idx={String(index).padStart(2, '0')}
      />
      <div className="flex flex-col gap-3 text-[14px] leading-[1.6]">{children}</div>
    </PsPanel>
  );
}

function Details({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group rounded-lg border border-line bg-bg-2 px-3.5 py-2.5">
      <summary className="cursor-pointer select-none font-mono text-xs font-semibold tracking-[.08em] uppercase text-muted">
        {summary}
      </summary>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </details>
  );
}

function CopyButton({ value }: { value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:text-ink"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? t('galerkin.copied') : t('galerkin.copy')}
    </button>
  );
}

function Chart({
  samples,
  pick,
  color,
  label,
}: {
  samples: Array<{ x: number; y: number }>;
  pick: 'u' | 'residual';
  color: string;
  label: string;
}) {
  const width = 760;
  const height = 240;
  const pad = 36;
  const ys = samples.map((s) => s.y);
  const min = Math.min(0, ...ys);
  const max = Math.max(0, ...ys);
  const span = max - min || 1;
  const xs = samples.map((s) => s.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const xSpan = xMax - xMin || 1;
  const toX = (x: number) => pad + ((x - xMin) / xSpan) * (width - 2 * pad);
  const toY = (y: number) => height - pad - ((y - min) / span) * (height - 2 * pad);
  const polyline = samples.map((s) => `${toX(s.x)},${toY(s.y)}`).join(' ');
  const zeroY = toY(0);
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-bg-2 p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[560px] w-full"
        role="img"
        aria-label={label}
      >
        <line x1={pad} y1={zeroY} x2={width - pad} y2={zeroY} stroke="currentColor" opacity=".3" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" opacity=".24" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        <text x={pad} y={height - 10} fontSize="11" fill="currentColor">
          x = {formatNumber(xMin, 3)}
        </text>
        <text x={width - pad} y={height - 10} textAnchor="end" fontSize="11" fill="currentColor">
          x = {formatNumber(xMax, 3)}
        </text>
        <text x={pad + 6} y={pad + 12} fontSize="11" fill="currentColor">
          {pick === 'u' ? 'uₙ(x)' : 'R(x)'} ∈ [{formatNumber(min, 3)}, {formatNumber(max, 3)}]
        </text>
      </svg>
    </div>
  );
}

function fmt(value: number, digits: number): string {
  return formatNumber(value, digits);
}

function ResultView({
  result,
  digits,
}: {
  result: GalerkinResult;
  digits: number;
}) {
  const { t } = useI18n();
  const n = result.coefficients.length;
  // Fully expanded form when uₙ is a polynomial; otherwise the sum of basis terms
  const expanded = expandedApproximation(result, digits);
  const finalTex = expanded ? `u_n(x)=${expanded.tex}` : result.finalTex;
  const copyText = expanded
    ? `u_n(x) = ${expanded.text}`
    : `u_n(x) = ${result.phi0.text} + ${result.coefficients
        .map((c, i) => `${fmt(c, digits)}*(${result.basis[i].text})`)
        .join(' + ')}`;

  return (
    <>
      <Step index={1} title={t('galerkin.titles.1')}>
        <Tex value={`${result.operatorTex}`} />
        <p>{t('galerkin.s1_text')}</p>
        <Tex value={`\\alpha_0 u(a)+\\alpha_1 u'(a)=${texNumber(result.boundaryLeft.target)}`} />
        <Tex value={`\\beta_0 u(b)+\\beta_1 u'(b)=${texNumber(result.boundaryRight.target)}`} />
      </Step>

      <Step index={2} title={t('galerkin.titles.2')}>
        <Tex value={`L(u)=${result.operatorLhsTex}`} />
        <PsNote>
          <p>
            {t('galerkin.s2_rhs')} <Tex value={`f(x)=${result.fTex}`} block={false} />.
          </p>
        </PsNote>
      </Step>

      <Step index={3} title={t('galerkin.titles.3')}>
        <Tex value={`\\varphi_0(x)=${result.phi0.tex}`} />
        <Tex value={`\\varphi_0'(x)=${result.phi0.d1Tex}`} />
        <p>
          {t('galerkin.s3_text', {
            left: fmt(result.boundaryLeft.phi0, digits),
            leftTarget: fmt(result.boundaryLeft.target, digits),
            right: fmt(result.boundaryRight.phi0, digits),
            rightTarget: fmt(result.boundaryRight.target, digits),
          })}
        </p>
      </Step>

      <Step index={4} title={t('galerkin.titles.4')}>
        {result.basis.map((phi, i) => (
          <Tex key={i} value={`\\varphi_{${i + 1}}(x)=${phi.tex}`} />
        ))}
        <p>{t('galerkin.s4_text')}</p>
      </Step>

      <Step index={5} title={t('galerkin.titles.5')}>
        <Tex value={`u_n(x)=\\varphi_0(x)+\\sum_{i=1}^{${n}} C_i\\varphi_i(x)`} />
        <Tex value={result.approximationTex} />
      </Step>

      <Step index={6} title={t('galerkin.titles.6')}>
        {result.basis.map((phi, i) => (
          <Details key={i} summary={t('galerkin.s6_summary', { index: i + 1 })}>
            <Tex value={`\\varphi_{${i + 1}}'=${phi.d1Tex}`} />
            <Tex value={`\\varphi_{${i + 1}}''=${phi.d2Tex}`} />
            <Tex value={`L(\\varphi_{${i + 1}})=\\varphi_{${i + 1}}''+p\\,\\varphi_{${i + 1}}'+q\\,\\varphi_{${i + 1}}`} />
          </Details>
        ))}
      </Step>

      <Step index={7} title={t('galerkin.titles.7')}>
        <Tex value={`a_{ki}=\\int_a^b \\varphi_k(x)\\,L(\\varphi_i(x))\\,dx`} />
        <CoefficientMatrix result={result} digits={digits} />
        <div className="flex flex-col gap-2">
          {result.integrals
            .filter((item) => item.name.startsWith('a'))
            .map((item) => (
              <Details key={item.name} summary={`${item.name} = ${fmt(item.value, digits)}`}>
                <Tex value={`${item.name}=\\int_a^b ${item.integrandTex}\\,dx`} />
                <p className="font-mono text-xs text-muted">
                  {t('galerkin.s7_samples')}{' '}
                  {item.samples.map((s) => fmt(s.value, 4)).join(', ')}
                </p>
                <p className="font-mono text-xs text-muted">
                  {t('galerkin.result', { value: fmt(item.value, digits), error: fmt(item.error, 2) })}
                </p>
              </Details>
            ))}
        </div>
      </Step>

      <Step index={8} title={t('galerkin.titles.8')}>
        <Tex value={`b_k=\\int_a^b \\varphi_k(x)\\left[f(x)-L(\\varphi_0(x))\\right]dx`} />
        <div className="flex flex-col gap-2">
          {result.integrals
            .filter((item) => item.name.startsWith('b'))
            .map((item) => (
              <Details key={item.name} summary={`${item.name} = ${fmt(item.value, digits)}`}>
                <Tex value={`${item.name}=\\int_a^b ${item.integrandTex}\\,dx`} />
                <p className="font-mono text-xs text-muted">
                  {t('galerkin.result', { value: fmt(item.value, digits), error: fmt(item.error, 2) })}
                </p>
              </Details>
            ))}
        </div>
      </Step>

      <Step index={9} title={t('galerkin.titles.9')}>
        <SystemView result={result} digits={digits} />
      </Step>

      <Step index={10} title={t('galerkin.titles.10')}>
        <Tex value={`AC=B \\quad\\Rightarrow\\quad C=A^{-1}B`} />
        <PsNote>
          <p>{t('galerkin.s10_note')}</p>
        </PsNote>
        <div className="grid gap-2 sm:grid-cols-2">
          {result.coefficients.map((c, i) => (
            <div key={i} className="rounded-lg border border-line bg-bg-2 px-3.5 py-2.5">
              <Tex value={`C_{${i + 1}}=${texNumber(c)}`} />
              <p className="font-mono text-xs text-muted">{fmt(c, digits)}</p>
            </div>
          ))}
        </div>
      </Step>

      <section className="mb-5 rounded-xl border border-brand/30 bg-brand-soft p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs font-semibold tracking-[.14em] uppercase text-muted">
            {t('galerkin.final_step')}
          </span>
          <CopyButton value={copyText} />
        </div>
        <div className="mt-4">
          <Tex value={finalTex} />
        </div>
        <div className="mt-4 font-mono text-sm text-muted">
          {t('galerkin.final_meta', { precision: digits, n })}
        </div>
      </section>

      <Step index={12} title={t('galerkin.titles.12')}>
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat label={t('galerkin.stat_left')} value={fmt(result.boundaryErrors.left, digits)} />
          <Stat label={t('galerkin.stat_right')} value={fmt(result.boundaryErrors.right, digits)} />
          <Stat label={t('galerkin.residual_max')} value={fmt(result.residualMax, digits)} />
        </div>
        <p>
          {t('galerkin.s12_orthogonality')}{' '}
          <span className="font-mono">
            {result.orthogonality.map((v) => fmt(v, 3)).join(', ')}
          </span>
          .
        </p>
        <PsNote variant="orange" icon={<Info size={16} />}>
          <p>{t('galerkin.s12_note')}</p>
        </PsNote>
        <Chart
          samples={result.samples.map((s) => ({ x: s.x, y: s.residual }))}
          pick="residual"
          color="var(--brand)"
          label={t('galerkin.chart_residual')}
        />
        <Chart
          samples={result.samples.map((s) => ({ x: s.x, y: s.u }))}
          pick="u"
          color="var(--cyan)"
          label={t('galerkin.chart_solution')}
        />
      </Step>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg-2 px-3.5 py-2.5">
      <div className="font-mono text-[11px] uppercase tracking-[.1em] text-muted">{label}</div>
      <div className="mt-1 font-mono text-base">{value}</div>
    </div>
  );
}

function CoefficientMatrix({ result, digits }: { result: GalerkinResult; digits: number }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1 rounded-lg border border-line bg-bg-2 p-3 font-mono text-sm"
        style={{ gridTemplateColumns: `repeat(${result.matrix.length}, minmax(96px, auto))` }}>
        {result.matrix.flatMap((row, r) =>
          row.map((value, c) => (
            <div key={`${r}-${c}`} className="text-center">
              <span className="text-muted">a{r + 1}{c + 1}=</span> {fmt(value, digits)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

function SystemView({ result, digits }: { result: GalerkinResult; digits: number }) {
  const { t } = useI18n();
  const n = result.rhs.length;
  return (
    <>
      <Tex
        value={`\\begin{cases}${result.matrix
          .map(
            (row, r) =>
              row.map((v, c) => `${v < 0 ? '' : '+'}${fmt(v, 4)}\\,C_{${c + 1}}`).join('') +
              `=${fmt(result.rhs[r], 4)}`,
          )
          .join(' \\\\ ')}\\end{cases}`}
      />
      <Tex
        value={`A=\\begin{pmatrix}${result.matrix
          .map((row) => row.map((v) => fmt(v, 4)).join(' & '))
          .join(' \\\\ ')}\\end{pmatrix},\\quad B=\\begin{pmatrix}${result.rhs
          .map((v) => fmt(v, 4))
          .join(' \\\\ ')}\\end{pmatrix}`}
      />
      <p className="font-mono text-xs text-muted">{t('galerkin.system_meta', { n, precision: digits })}</p>
    </>
  );
}

function basisFromTemplate(template: string, count: number): string[] {
  return Array.from({ length: count }, (_, k) => template.replace(/\bi\b/g, String(k + 1)));
}

// Empty template → empty basis, so the solver builds φᵢ itself (autoCount)
function buildBasis(template: string, count: number): string[] {
  return template.trim() ? basisFromTemplate(template, count) : [];
}

function equationTex(a2: string, a1: string, a0: string, f: string): string {
  // Empty u'' coefficient means 1; empty u′ and u coefficients mean 0; empty f means 0
  const term = (source: string, fallback: string): TexTerm => {
    if (!source.trim()) return { tex: fallback, atomic: true };
    try {
      return exprTex(source);
    } catch {
      return { tex: '\\text{?}', atomic: true };
    }
  };
  const lhs = operatorLhsTex(term(a2, '1'), term(a1, '0'), term(a0, '0'));
  return `${lhs}=${term(f, '0').tex}`;
}

// Translated message for a solver error; unexpected errors get a generic text
function describeError(cause: unknown, t: Translate): string {
  if (cause instanceof GalerkinError) return t(`galerkin.errors.${cause.code}`, cause.params);
  return t('galerkin.unknown_error');
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[.1em] text-muted">{label}</span>
      <input
        className="w-full rounded-md border border-line bg-bg-2 px-2.5 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function GalerkinMethod() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [input, setInput] = useState<GalerkinInput>(EMPTY_INPUT);
  const [template, setTemplate] = useState('');
  const [legendre, setLegendre] = useState(false);
  const [count, setCount] = useState(2);
  const [advanced, setAdvanced] = useState(false);
  const [board, setBoard] = useState(false);
  const [result, setResult] = useState<GalerkinResult | null>(null);
  const [digits, setDigits] = useState<(typeof PRECISIONS)[number]>(6);
  const resultRef = useScrollToResult(result);

  const update = <K extends keyof GalerkinInput>(key: K, value: GalerkinInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const changeTemplate = (value: string) => {
    setTemplate(value);
    setLegendre(false);
    update('basis', buildBasis(value, count));
  };

  const toggleLegendre = () => {
    setLegendre((on) => !on);
    setResult(null);
  };

  const changeCount = (value: number) => {
    setCount(value);
    update('basis', buildBasis(template, value));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (legendre && (!input.a.trim() || !input.b.trim())) {
      setResult(null);
      showToast('error', describeError(new GalerkinError('empty', { label: input.a.trim() ? 'b' : 'a' }), t));
      return;
    }
    // Simple mode uses Dirichlet conditions: u(a) and u(b) are given directly
    const payload: GalerkinInput = {
      ...(advanced ? input : { ...input, alpha0: '1', alpha1: '0', beta0: '1', beta1: '0' }),
      basis: legendre ? legendreBasis(input.a, input.b, count) : input.basis,
      autoCount: count,
      allowNonHomogeneousBasis: board,
    };
    try {
      setResult(solveGalerkin(payload));
    } catch (cause) {
      setResult(null);
      showToast('error', describeError(cause, t));
    }
  };

  const reset = () => {
    setInput(SAMPLE_INPUT);
    setTemplate(SAMPLE_TEMPLATE);
    setLegendre(false);
    setCount(2);
    setAdvanced(false);
    setResult(null);
  };

  const clear = () => {
    setInput(EMPTY_INPUT);
    setTemplate('');
    setLegendre(false);
    setResult(null);
  };

  const labelClass = 'font-mono text-[11px] uppercase tracking-[.1em] text-muted';
  const hintClass = 'text-xs leading-[1.5] text-muted';

  return (
    <>
      <PsHero
        eyebrow={t('galerkin.eyebrow')}
        title={t('galerkin.title')}
        titleHighlight={t('galerkin.title_highlight')}
        lead={t('galerkin.lead')}
      />

      <form onSubmit={submit} className="mx-auto mb-6 max-w-3xl">
        <PsPanel className="mb-4">
          <PsPanelHead eyebrow={t('galerkin.input_eyebrow')} title={t('galerkin.input_title')} idx="IN" />

          <div className="mb-4 overflow-x-auto rounded-lg border border-line bg-bg-2 px-3 py-2 text-cyan">
            <div dangerouslySetInnerHTML={{ __html: katex.renderToString(equationTex(input.a2, input.a1, input.a0, input.f), { throwOnError: false, displayMode: true }) }} />
          </div>

          <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <legend className={`${labelClass} mb-2`}>{t('galerkin.coefficients')}</legend>
            <Field label="a₂ (u″)" placeholder="1" value={input.a2} onChange={(v) => update('a2', v)} />
            <Field label="a₁ (u′)" placeholder="0" value={input.a1} onChange={(v) => update('a1', v)} />
            <Field label="a₀ (u)" placeholder="0" value={input.a0} onChange={(v) => update('a0', v)} />
            <Field label="f(x)" placeholder="0" value={input.f} onChange={(v) => update('f', v)} />
          </fieldset>
          <p className={`${hintClass} mt-1.5`}>{t('galerkin.coefficients_hint')}</p>

          <fieldset className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <legend className={`${labelClass} mb-2`}>{t('galerkin.interval')}</legend>
            <Field label="a" placeholder="0" value={input.a} onChange={(v) => update('a', v)} />
            <Field label="b" placeholder="pi" value={input.b} onChange={(v) => update('b', v)} />
            <Field label="u(a)" placeholder="0" value={input.alphaValue} onChange={(v) => update('alphaValue', v)} />
            <Field label="u(b)" placeholder="0" value={input.betaValue} onChange={(v) => update('betaValue', v)} />
          </fieldset>

          {advanced && (
            <fieldset className="mt-4 grid grid-cols-3 gap-3">
              <legend className={`${labelClass} mb-2`}>{t('galerkin.advanced_legend')}</legend>
              <Field label="α₀" value={input.alpha0} onChange={(v) => update('alpha0', v)} />
              <Field label="α₁" value={input.alpha1} onChange={(v) => update('alpha1', v)} />
              <Field label="β₀" value={input.beta0} onChange={(v) => update('beta0', v)} />
              <Field label="β₁" value={input.beta1} onChange={(v) => update('beta1', v)} />
            </fieldset>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field
              label={t('galerkin.phi0_label')}
              placeholder={t('galerkin.auto_placeholder')}
              value={input.phi0}
              onChange={(v) => update('phi0', v)}
            />
            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>{t('galerkin.n_label')}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeCount(value)}
                    className={`min-w-9 rounded-md border py-2 font-mono text-sm ${
                      count === value ? 'border-brand bg-brand-soft text-ink' : 'border-line text-muted hover:text-ink'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Field
              label={t('galerkin.template_label')}
              placeholder={t('galerkin.auto_placeholder')}
              value={template}
              onChange={changeTemplate}
            />
            {template.trim() && !legendre ? (
              <p className={`${hintClass} mt-1.5 font-mono`}>
                {input.basis.map((item, index) => `φ${index + 1} = ${item}`).join('   ')}
              </p>
            ) : (
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  aria-pressed={legendre}
                  onClick={toggleLegendre}
                  className={`rounded-md border px-2.5 py-1 text-xs ${
                    legendre ? 'border-brand bg-brand-soft text-ink' : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {t('galerkin.legendre_button')}
                </button>
                <span className={hintClass}>
                  {legendre ? t('galerkin.legendre_hint') : t('galerkin.template_auto')}
                </span>
              </div>
            )}
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs leading-[1.5] text-muted">
            <input
              type="checkbox"
              checked={board}
              onChange={(e) => setBoard(e.target.checked)}
              className="mt-0.5"
            />
            <span>{t('galerkin.board_label')}</span>
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Calculator size={16} />
              {t('galerkin.submit')}
            </button>
            <button type="button" onClick={reset} className="rounded-md border border-line px-3 py-2 text-sm text-muted hover:text-ink">
              {t('galerkin.sample')}
            </button>
            <button type="button" onClick={clear} className="rounded-md px-2 py-2 text-sm text-muted hover:text-ink">
              {t('galerkin.clear')}
            </button>
            <button
              type="button"
              onClick={() => setAdvanced((value) => !value)}
              className="rounded-md px-2 py-2 text-xs text-muted underline underline-offset-4 hover:text-ink"
            >
              {advanced ? t('galerkin.simple_mode') : t('galerkin.advanced')}
            </button>
            <label className="ml-auto flex items-center gap-2 font-mono text-xs text-muted">
              {t('galerkin.precision')}
              <select
                value={digits}
                onChange={(e) => setDigits(Number(e.target.value) as (typeof PRECISIONS)[number])}
                className="rounded-md border border-line bg-bg-2 px-2 py-1 text-ink"
              >
                {PRECISIONS.map((d) => (
                  <option key={d} value={d}>
                    {t('galerkin.digits', { count: d })}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </PsPanel>
      </form>

      <div ref={resultRef}>
        {result && (
          <PrecisionContext.Provider value={digits}>
            {board && (
              <PsNote variant="orange" icon={<Info size={16} />}>
                <p>{t('galerkin.board_notice')}</p>
              </PsNote>
            )}
            <PsNote>
              <p>{t('galerkin.numeric_notice')}</p>
            </PsNote>
            <ResultView result={result} digits={digits} />
          </PrecisionContext.Provider>
        )}
      </div>
    </>
  );
}
