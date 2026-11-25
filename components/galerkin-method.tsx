'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { math } from '@/lib/math';
import katex from 'katex';
import { Calculator, Check, Copy, Info } from 'lucide-react';
import {
  PsHero,
  PsNote,
  PsPanel,
  PsPanelHead,
} from '@/components/ui/print-stream';
import { useScrollToResult } from '@/components/ui/use-scroll-to-result';
import {
  formatNumber,
  solveGalerkin,
  texNumber,
  type GalerkinInput,
  type GalerkinResult,
} from '@/lib/galerkin';

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

function Tex({ value, block = true }: { value: string; block?: boolean }) {
  return (
    <div
      className={block ? 'w-full overflow-x-auto text-cyan' : 'inline-block text-cyan'}
      dangerouslySetInnerHTML={{ __html: katexHtml(value, block) }}
    />
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <PsPanel className="mb-5">
      <PsPanelHead
        eyebrow={`Bosqich ${index}`}
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
      {copied ? 'Nusxalandi' : 'Formulani nusxalash'}
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
  const n = result.coefficients.length;
  const copyText = `u_n(x) = ${result.phi0.text} + ${result.coefficients
    .map((c, i) => `${fmt(c, digits)}*(${result.basis[i].text})`)
    .join(' + ')}`;

  return (
    <>
      <Step index={1} title="Masalaning berilishi">
        <Tex value={`${result.operatorTex}`} />
        <p>
          Oraliq <span className="font-mono">[a, b]</span> bo‘yicha ikkinchi tartibli chiziqli chegaraviy masala.
        </p>
        <Tex value={`\\alpha_0 u(a)+\\alpha_1 u'(a)=${texNumber(result.boundaryLeft.target)}`} />
        <Tex value={`\\beta_0 u(b)+\\beta_1 u'(b)=${texNumber(result.boundaryRight.target)}`} />
      </Step>

      <Step index={2} title="Differensial operatorni aniqlash">
        <Tex value={`L(u)=\\left(${result.a2Tex}\\right)u''+\\left(${result.a1Tex}\\right)u'+\\left(${result.a0Tex}\\right)u`} />
        <PsNote>
          <p>
            Tenglamaning o‘ng tomoni <b>f(x) = {result.fTex}</b>.
          </p>
        </PsNote>
      </Step>

      <Step index={3} title="Boshlang‘ich funksiyani tekshirish">
        <Tex value={`\\varphi_0(x)=${result.phi0.tex}`} />
        <Tex value={`\\varphi_0'(x)=${result.phi0.d1Tex}`} />
        <p>
          Chap chegarada α₀φ₀(a)+α₁φ₀′(a) = {fmt(result.boundaryLeft.phi0, digits)} —
          kutilgan {fmt(result.boundaryLeft.target, digits)}. O‘ng chegarada:{' '}
          {fmt(result.boundaryRight.phi0, digits)} — kutilgan {fmt(result.boundaryRight.target, digits)}.
        </p>
      </Step>

      <Step index={4} title="Bazis funksiyalarni tanlash">
        {result.basis.map((phi, i) => (
          <Tex key={i} value={`\\varphi_{${i + 1}}(x)=${phi.tex}`} />
        ))}
        <p>
          Har bir bazis funksiya bir jinsli chegaraviy shartlarni (α₀φ(a)+α₁φ′(a)=0,
          β₀φ(b)+β₁φ′(b)=0) qanoatlantiradi — tekshiruv muvaffaqiyatli o‘tdi.
        </p>
      </Step>

      <Step index={5} title="Taqribiy yechimni tuzish">
        <Tex value={`u_n(x)=\\varphi_0(x)+\\sum_{i=1}^{${n}} C_i\\varphi_i(x)`} />
        <Tex value={result.approximationTex} />
      </Step>

      <Step index={6} title="Operator qiymatlarini hisoblash">
        {result.basis.map((phi, i) => (
          <Details key={i} summary={`L(φ${i + 1}) hisobi`}>
            <Tex value={`\\varphi_{${i + 1}}'=${phi.d1Tex}`} />
            <Tex value={`\\varphi_{${i + 1}}''=${phi.d2Tex}`} />
            <Tex value={`L(\\varphi_{${i + 1}})=\\varphi_{${i + 1}}''+p\\,\\varphi_{${i + 1}}'+q\\,\\varphi_{${i + 1}}`} />
          </Details>
        ))}
      </Step>

      <Step index={7} title="Galerkin integrallari: a_{ki}">
        <Tex value={`a_{ki}=\\int_a^b \\varphi_k(x)\\,L(\\varphi_i(x))\\,dx`} />
        <CoefficientMatrix result={result} digits={digits} />
        <div className="flex flex-col gap-2">
          {result.integrals
            .filter((item) => item.name.startsWith('a'))
            .map((item) => (
              <Details key={item.name} summary={`${item.name} = ${fmt(item.value, digits)}`}>
                <Tex value={`${item.name}=\\int_a^b ${item.integrandTex}\\,dx`} />
                <p className="font-mono text-xs text-muted">
                  Integrand qiymatlari (x = a … b):{' '}
                  {item.samples.map((s) => fmt(s.value, 4)).join(', ')}
                </p>
                <p className="font-mono text-xs text-muted">
                  Natija: {fmt(item.value, digits)} · xato baholash: ±{fmt(item.error, 2)}
                </p>
              </Details>
            ))}
        </div>
      </Step>

      <Step index={8} title="Ozod hadlarni hisoblash">
        <Tex value={`b_k=\\int_a^b \\varphi_k(x)\\left[f(x)-L(\\varphi_0(x))\\right]dx`} />
        <div className="flex flex-col gap-2">
          {result.integrals
            .filter((item) => item.name.startsWith('b'))
            .map((item) => (
              <Details key={item.name} summary={`${item.name} = ${fmt(item.value, digits)}`}>
                <Tex value={`${item.name}=\\int_a^b ${item.integrandTex}\\,dx`} />
                <p className="font-mono text-xs text-muted">
                  Natija: {fmt(item.value, digits)} · xato baholash: ±{fmt(item.error, 2)}
                </p>
              </Details>
            ))}
        </div>
      </Step>

      <Step index={9} title="Algebraik sistema">
        <SystemView result={result} digits={digits} />
      </Step>

      <Step index={10} title="Noma’lum koeffitsiyentlar">
        <Tex value={`AC=B \\quad\\Rightarrow\\quad C=A^{-1}B`} />
        <PsNote>
          <p>
            Sistema teskari matritsasiz, qisman tanlash (partial pivoting) bilan Gauss usulida yechildi.
          </p>
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
            Bosqich 11 · Yakuniy natija
          </span>
          <CopyButton value={copyText} />
        </div>
        <div className="mt-4">
          <Tex value={result.finalTex} />
        </div>
        <div className="mt-4 font-mono text-sm text-muted">
          Aniqlik: {digits} xona · n = {n}
        </div>
      </section>

      <Step index={12} title="Tekshirish">
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat label="Chap chegara xatosi" value={fmt(result.boundaryErrors.left, digits)} />
          <Stat label="O‘ng chegara xatosi" value={fmt(result.boundaryErrors.right, digits)} />
          <Stat label="max |R(x)|" value={fmt(result.residualMax, digits)} />
        </div>
        <p>
          Galerkin ortogonallik qoldiqlari ∫φₖR(x)dx:{' '}
          <span className="font-mono">
            {result.orthogonality.map((v) => fmt(v, 3)).join(', ')}
          </span>
          .
        </p>
        <PsNote variant="orange" icon={<Info size={16} />}>
          <p>
            Galerkin ortogonalligi differensial tenglama har bir x nuqtada aniq bajarilishini anglatmaydi.
            Quyidagi R(x) = L(uₙ) − f qoldiq funksiyasi bu farqni ko‘rsatadi.
          </p>
        </PsNote>
        <Chart
          samples={result.samples.map((s) => ({ x: s.x, y: s.residual }))}
          pick="residual"
          color="var(--brand)"
          label="Qoldiq R(x) grafigi"
        />
        <Chart
          samples={result.samples.map((s) => ({ x: s.x, y: s.u }))}
          pick="u"
          color="var(--cyan)"
          label="Taqribiy yechim uₙ(x) grafigi"
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
      <p className="font-mono text-xs text-muted">n = {n} · hisoblash aniqligi {digits} xona</p>
    </>
  );
}

function basisFromTemplate(template: string, count: number): string[] {
  return Array.from({ length: count }, (_, k) => template.replace(/\bi\b/g, String(k + 1)));
}

function equationTex(a2: string, a1: string, a0: string, f: string): string {
  const tex = (source: string): string | null => {
    if (!source.trim()) return null;
    try {
      return math.parse(source.trim()).toTex();
    } catch {
      return '\\text{?}';
    }
  };
  // Empty u'' coefficient means 1; other empty terms are omitted
  const a2t = tex(a2);
  const a1t = tex(a1);
  const a0t = tex(a0);
  const ft = tex(f) ?? '0';
  const lhs = [
    a2t ? `\\left(${a2t}\\right)u''` : "u''",
    a1t ? `+\\left(${a1t}\\right)u'` : '',
    a0t ? `+\\left(${a0t}\\right)u` : '',
  ].join('');
  return `${lhs}=${ft}`;
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
  const [input, setInput] = useState<GalerkinInput>(EMPTY_INPUT);
  const [template, setTemplate] = useState('');
  const [count, setCount] = useState(2);
  const [advanced, setAdvanced] = useState(false);
  const [result, setResult] = useState<GalerkinResult | null>(null);
  const [error, setError] = useState('');
  const [digits, setDigits] = useState<(typeof PRECISIONS)[number]>(6);
  const resultRef = useScrollToResult(result);

  const update = <K extends keyof GalerkinInput>(key: K, value: GalerkinInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
  };

  const changeTemplate = (value: string) => {
    setTemplate(value);
    update('basis', basisFromTemplate(value, count));
  };

  const changeCount = (value: number) => {
    setCount(value);
    update('basis', basisFromTemplate(template, value));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simple mode uses Dirichlet conditions: u(a) and u(b) are given directly
    const payload: GalerkinInput = advanced
      ? input
      : { ...input, alpha0: '1', alpha1: '0', beta0: '1', beta1: '0' };
    try {
      setResult(solveGalerkin(payload));
      setError('');
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : 'Noma’lum xatolik.');
    }
  };

  const reset = () => {
    setInput(SAMPLE_INPUT);
    setTemplate(SAMPLE_TEMPLATE);
    setCount(2);
    setAdvanced(false);
    setResult(null);
    setError('');
  };

  const clear = () => {
    setInput(EMPTY_INPUT);
    setTemplate('');
    setResult(null);
    setError('');
  };

  const labelClass = 'font-mono text-[11px] uppercase tracking-[.1em] text-muted';
  const hintClass = 'text-xs leading-[1.5] text-muted';

  return (
    <>
      <PsHero
        eyebrow="Metod 13 · Galerkin"
        title="Galerkin usuli"
        titleHighlight="qadam-baqadam"
        lead="Chegaraviy masalani bazis funksiyalar yordamida, daftarda qo‘lda ishlagandek bosqichma-bosqich yeching."
      />

      <form onSubmit={submit} className="mx-auto mb-6 max-w-3xl">
        <PsPanel className="mb-4">
          <PsPanelHead eyebrow="Kiritish" title="Masala" idx="IN" />

          <div className="mb-4 overflow-x-auto rounded-lg border border-line bg-bg-2 px-3 py-2 text-cyan">
            <div dangerouslySetInnerHTML={{ __html: katex.renderToString(equationTex(input.a2, input.a1, input.a0, input.f), { throwOnError: false, displayMode: true }) }} />
          </div>

          <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <legend className={`${labelClass} mb-2`}>Tenglama koeffitsiyentlari</legend>
            <Field label="a₂ (u″)" placeholder="1" value={input.a2} onChange={(v) => update('a2', v)} />
            <Field label="a₁ (u′)" placeholder="0" value={input.a1} onChange={(v) => update('a1', v)} />
            <Field label="a₀ (u)" placeholder="0" value={input.a0} onChange={(v) => update('a0', v)} />
            <Field label="f(x)" placeholder="0" value={input.f} onChange={(v) => update('f', v)} />
          </fieldset>
          <p className={`${hintClass} mt-1.5`}>Bo‘sh qolsa: a₂ = 1, qolganlari = 0.</p>

          <fieldset className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <legend className={`${labelClass} mb-2`}>Oraliq va chegara shartlari</legend>
            <Field label="a" placeholder="0" value={input.a} onChange={(v) => update('a', v)} />
            <Field label="b" placeholder="pi" value={input.b} onChange={(v) => update('b', v)} />
            <Field label="u(a)" placeholder="0" value={input.alphaValue} onChange={(v) => update('alphaValue', v)} />
            <Field label="u(b)" placeholder="0" value={input.betaValue} onChange={(v) => update('betaValue', v)} />
          </fieldset>

          {advanced && (
            <fieldset className="mt-4 grid grid-cols-3 gap-3">
              <legend className={`${labelClass} mb-2`}>Umumiy chegara: α₀u + α₁u′ = F   ·   β₀u + β₁u′ = F</legend>
              <Field label="α₀" value={input.alpha0} onChange={(v) => update('alpha0', v)} />
              <Field label="α₁" value={input.alpha1} onChange={(v) => update('alpha1', v)} />
              <Field label="β₀" value={input.beta0} onChange={(v) => update('beta0', v)} />
              <Field label="β₁" value={input.beta1} onChange={(v) => update('beta1', v)} />
            </fieldset>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field
              label="φ₀(x) — bo‘sh qolsa avtomatik"
              placeholder="avtomatik"
              value={input.phi0}
              onChange={(v) => update('phi0', v)}
            />
            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>n</span>
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
              label="φᵢ(x) shabloni (i = 1, 2, …, n)"
              placeholder="sin(i*x)"
              value={template}
              onChange={changeTemplate}
            />
            {template.trim() && (
              <p className={`${hintClass} mt-1.5 font-mono`}>
                {input.basis.map((item, index) => `φ${index + 1} = ${item}`).join('   ')}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Calculator size={16} />
              Yechish
            </button>
            <button type="button" onClick={reset} className="rounded-md border border-line px-3 py-2 text-sm text-muted hover:text-ink">
              Namuna masala
            </button>
            <button type="button" onClick={clear} className="rounded-md px-2 py-2 text-sm text-muted hover:text-ink">
              Tozalash
            </button>
            <button
              type="button"
              onClick={() => setAdvanced((value) => !value)}
              className="rounded-md px-2 py-2 text-xs text-muted underline underline-offset-4 hover:text-ink"
            >
              {advanced ? 'Oddiy rejim' : 'Kengaytirilgan'}
            </button>
            <label className="ml-auto flex items-center gap-2 font-mono text-xs text-muted">
              Aniqlik
              <select
                value={digits}
                onChange={(e) => setDigits(Number(e.target.value) as (typeof PRECISIONS)[number])}
                className="rounded-md border border-line bg-bg-2 px-2 py-1 text-ink"
              >
                {PRECISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} xona
                  </option>
                ))}
              </select>
            </label>
          </div>
        </PsPanel>
      </form>

      {error && (
        <PsNote variant="orange" icon={<Info size={16} />}>
          <p>{error}</p>
        </PsNote>
      )}

      <div ref={resultRef}>
        {result && (
          <>
            <PsNote>
              <p>
                Integrallar sonli usulda (Simpson, 800 bo‘lak) hisoblandi; simvolik integrallash qo‘llanmaydi.
                Xato baholash taxminiy.
              </p>
            </PsNote>
            <ResultView result={result} digits={digits} />
          </>
        )}
      </div>
    </>
  );
}
