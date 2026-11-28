'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useScrollToResult } from '@/components/ui/use-scroll-to-result';
import katex from 'katex';
import { Calculator, Info } from 'lucide-react';
import {
  PsHero,
  PsMap,
  PsNote,
  PsPanel,
  PsPanelHead,
  PsStrip,
} from '@/components/ui/print-stream';
import {
  solveCollocation,
  texNumber,
  type CollocationInput,
  type CollocationResult,
} from '@/lib/collocation';
import { useI18n } from '@/components/i18n-provider';

const INITIAL: CollocationInput = {
  a2: '1',
  a1: '0',
  a0: '-1',
  f: '2*x',
  a: '0',
  b: '1',
  alpha0: '1',
  alpha1: '0',
  alphaValue: '0',
  beta0: '1',
  beta1: '0',
  betaValue: '0',
  n: 3,
  points: ['1/4', '1/2', '3/4'],
};

function tex(value: string): string {
  return value.replaceAll('*', '\\,').replaceAll('~', '').replaceAll('u', 'u');
}

function formatApproximation(value: number): string {
  return Number(value.toFixed(8)).toString();
}

function linearCombinationTex(
  coefficients: number[],
  formatCoefficient: (value: number) => string,
): string {
  const terms: string[] = [];
  coefficients.forEach((coefficient, index) => {
    const magnitude = formatCoefficient(Math.abs(coefficient));
    if (magnitude === '0') return;
    const factor = magnitude === '1' ? '' : `${magnitude}\\,`;
    const sign = coefficient < 0 ? '-' : terms.length ? '+' : '';
    terms.push(`${sign}${factor}C_{${index + 1}}`);
  });
  return terms.join(' ') || '0';
}

function MathDisplay({ value }: { value: string }) {
  const markup = useMemo(
    () =>
      katex.renderToString(tex(value), {
        throwOnError: false,
        displayMode: true,
      }),
    [value],
  );
  return (
    <div
      className="w-full overflow-x-auto text-cyan [&_.katex-display]:!my-1 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function InlineMath({ value }: { value: string }) {
  const markup = useMemo(
    () => katex.renderToString(tex(value), { throwOnError: false }),
    [value],
  );
  return <span dangerouslySetInnerHTML={{ __html: markup }} />;
}

function Chart({
  result,
  t,
}: {
  result: CollocationResult;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const width = 760;
  const height = 260;
  const pad = 32;
  const values = result.samples.map((sample) => sample.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = result.samples
    .map((sample, index) => {
      const x = pad + (index / (result.samples.length - 1)) * (width - 2 * pad);
      const y =
        height - pad - ((sample.value - min) / span) * (height - 2 * pad);
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-bg-2 p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-w-[560px] w-full"
        role="img"
        aria-label={t('collocation.plot_title')}
      >
        <line
          x1={pad}
          y1={height - pad}
          x2={width - pad}
          y2={height - pad}
          stroke="currentColor"
          opacity=".24"
        />
        <line
          x1={pad}
          y1={pad}
          x2={pad}
          y2={height - pad}
          stroke="currentColor"
          opacity=".24"
        />
        <polyline
          points={points}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {result.input.points.map((point) => {
          const xValue =
            Number(point.includes('/') ? point.split('/')[0] : point) /
            Number(point.includes('/') ? point.split('/')[1] : 1);
          const index = Math.max(
            0,
            Math.min(
              40,
              Math.round(
                ((xValue - Number(result.input.a)) /
                  (Number(result.input.b) - Number(result.input.a))) *
                  40,
              ),
            ),
          );
          const [cx, cy] = points.split(' ')[index].split(',');
          return (
            <circle key={point} cx={cx} cy={cy} r="4" fill="var(--brand)" />
          );
        })}
        <text x={pad} y={height - 8} fontSize="11" fill="currentColor">
          x = {result.input.a}
        </text>
        <text
          x={width - pad}
          y={height - 8}
          textAnchor="end"
          fontSize="11"
          fill="currentColor"
        >
          x = {result.input.b}
        </text>
        <text x={pad + 6} y={pad + 14} fontSize="11" fill="currentColor">
          u~(x) ∈ [{values[0].toFixed(3)}, {values.at(-1)?.toFixed(3)}]
        </text>
      </svg>
    </div>
  );
}

export function CollocationMethod() {
  const { t } = useI18n();
  const [input, setInput] = useState(INITIAL);
  const [result, setResult] = useState<CollocationResult | null>(null);
  const resultRef = useScrollToResult(result);
  const [error, setError] = useState('');
  const update = (
    key: keyof CollocationInput,
    value: string | number | string[],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
  };
  const updatePoint = (index: number, value: string) =>
    update(
      'points',
      input.points.map((point, pointIndex) =>
        pointIndex === index ? value : point,
      ),
    );
  const distributePoints = () => {
    const a = Number(input.a);
    const b = Number(input.b);
    if (!Number.isFinite(a) || !Number.isFinite(b) || !(a < b)) return;
    update(
      'points',
      Array.from({ length: input.n }, (_, index) =>
        String(a + ((index + 1) * (b - a)) / (input.n + 1)),
      ),
    );
  };
  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setResult(solveCollocation(input));
      setError('');
    } catch (cause) {
      setResult(null);
      setError(
        cause instanceof Error
          ? cause.message
          : t('collocation.calculate_error'),
      );
    }
  };
  const fields: Array<{ key: keyof CollocationInput; label: string }> = [
    { key: 'a2', label: 'A₂(x) · u″' },
    { key: 'a1', label: 'A₁(x) · u′' },
    { key: 'a0', label: 'A₀(x) · u' },
    { key: 'f', label: 'f(x)' },
    { key: 'a', label: 'a' },
    { key: 'b', label: 'b' },
    { key: 'alpha0', label: 'α₀' },
    { key: 'alpha1', label: 'α₁' },
    { key: 'alphaValue', label: 'A' },
    { key: 'beta0', label: 'β₀' },
    { key: 'beta1', label: 'β₁' },
    { key: 'betaValue', label: 'B' },
  ];
  return (
    <div className="relative mx-auto max-w-[1200px] px-0 pb-12 sm:px-2 md:px-4">
      <PsStrip eyebrow={t('collocation.strip')} id="ODE" name={t('nav.collocation')} />
      <PsHero
        eyebrow={t('collocation.hero_eyebrow')}
        title={t('collocation.hero_title')}
        titleHighlight={t('collocation.hero_title_highlight')}
        lead={t('collocation.hero_lead')}
        conditionMain={<>A₂(x)u″ + A₁(x)u′ + A₀(x)u = f(x)</>}
        conditionSub={t('collocation.hero_condition')}
      />
      <PsMap
        eyebrow={t('collocation.map_eyebrow')}
        title={t('collocation.map_title')}
        steps={[
          { n: '01', t: t('collocation.map_basis_title'), s: t('collocation.map_basis_desc') },
          { n: '02', t: t('collocation.map_residual_title'), s: t('collocation.map_residual_desc') },
          {
            n: '03',
            t: t('collocation.map_system_title'),
            s: t('collocation.map_system_desc'),
          },
        ]}
      />
      <div className="min-w-0 space-y-[18px]">
        <aside className="mx-auto w-full min-w-0 max-w-3xl space-y-[18px]">
          <PsPanel>
            <PsPanelHead
              eyebrow={t('collocation.input_eyebrow')}
              title={t('collocation.input_title')}
              idx="01"
            />
            <form onSubmit={calculate} className="space-y-4">
              <p className="text-xs leading-relaxed text-muted">
                {t('collocation.input_hint')}{' '}
                <code>x^2</code>, <code>sin(x)</code>. {t('collocation.fraction_hint')}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {fields.map(({ key, label }) => (
                  <label key={key} className="min-w-0">
                    <span className="mb-1 block text-xs font-semibold text-ink">
                      {label}
                    </span>
                    <input
                      value={String(input[key])}
                      onChange={(event) => update(key, event.target.value)}
                      className="w-full rounded-lg border border-line bg-bg-2 px-2 py-2 font-mono text-sm text-ink outline-none focus:border-brand"
                    />
                  </label>
                ))}
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">
                  {t('collocation.basis_count')}
                </span>
                <select
                  value={input.n}
                  onChange={(event) => {
                    const n = Number(event.target.value);
                    update('n', n);
                    update(
                      'points',
                      Array.from(
                        { length: n },
                        (_, index) =>
                          input.points[index] ?? String((index + 1) / (n + 1)),
                      ),
                    );
                  }}
                  className="w-full rounded-lg border border-line bg-bg-2 px-2 py-2 font-mono text-sm text-ink"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </label>
              <div className="rounded-lg border border-line bg-bg-2 p-3">
                <p className="mb-2 text-xs font-semibold text-ink">
                  {t('collocation.points_title')}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {input.points.map((point, index) => (
                    <input
                      key={index}
                      value={point}
                      onChange={(event) =>
                        updatePoint(index, event.target.value)
                      }
                      aria-label={t('collocation.point_label', { index: index + 1 })}
                      className="w-full rounded-lg border border-line bg-panel px-2 py-2 font-mono text-sm text-ink outline-none focus:border-brand"
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  {t('collocation.points_hint')}
                </p>
                <button
                  type="button"
                  onClick={distributePoints}
                  className="mt-3 w-full rounded-lg border border-brand/40 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand"
                >
                  {t('collocation.distribute')}
                </button>
              </div>
              <div className="rounded-lg border border-line bg-bg-2 p-3 text-xs leading-relaxed text-muted">
                <b className="text-ink">{t('collocation.boundary_left')}:</b> α₀u(a)+α₁u′(a)=A
                <br />
                <b className="text-ink">{t('collocation.boundary_right')}:</b> β₀u(b)+β₁u′(b)=B
                <br />
                {t('collocation.boundary_hint')}
              </div>
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 font-semibold text-brand-ink hover:opacity-90"
              >
                <Calculator size={17} />
                {t('collocation.calculate')}
              </button>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300"
                >
                  {error}
                </p>
              )}
            </form>
          </PsPanel>
          <PsNote icon={<Info size={15} />}>
            <span className="text-sm">
              {t('collocation.note')}
            </span>
          </PsNote>
        </aside>
        <div ref={resultRef} className="min-w-0 scroll-mt-24 space-y-[18px]">
          {!result ? (
            <PsPanel>
              <PsPanelHead
                eyebrow={t('collocation.result_wait')}
                title={t('collocation.result_wait_title')}
                idx="02"
              />
              <p className="py-10 text-center text-sm text-muted">
                {t('collocation.result_wait_desc')}
              </p>
            </PsPanel>
          ) : (
            <>
              <PsPanel>
                <PsPanelHead
                  eyebrow={t('collocation.steps_eyebrow')}
                  title={t('collocation.steps_title')}
                  idx="02"
                />
                <ol className="space-y-4">
                  <li className="rounded-lg border border-line bg-bg-2 p-3">
                    <h3 className="mb-2 text-sm font-semibold text-ink">
                      {t('collocation.basis_title')}
                    </h3>
                    <MathDisplay value={`\\varphi_0(x) = ${result.phi0}`} />
                    <div className="space-y-2">
                      {result.basis.map((item) => (
                        <MathDisplay
                          key={item.index}
                          value={`\\varphi_${item.index}(x) = ${item.expression}`}
                        />
                      ))}
                    </div>
                  </li>
                  <li className="rounded-lg border border-line bg-bg-2 p-3">
                    <h3 className="mb-2 text-sm font-semibold text-ink">
                      {t('collocation.approximation_title')}
                    </h3>
                    <MathDisplay value={result.approximation} />
                  </li>
                  <li className="rounded-lg border border-line bg-bg-2 p-3">
                    <h3 className="mb-3 text-sm font-semibold text-ink">
                      {t('collocation.derivatives_title')}
                    </h3>
                    <p className="mb-1 text-xs font-semibold text-muted">
                      {t('collocation.first_derivative')}
                    </p>
                    <MathDisplay value={result.derivative} />
                    <p className="mb-1 mt-3 text-xs font-semibold text-muted">
                      {t('collocation.second_derivative')}
                    </p>
                    <MathDisplay value={result.secondDerivative} />
                  </li>
                  <li className="rounded-lg border border-line bg-bg-2 p-3">
                    <h3 className="mb-2 text-sm font-semibold text-ink">
                      {t('collocation.residual_title')}
                    </h3>
                    <MathDisplay value={result.residual} />
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {t('collocation.residual_note')}
                    </p>
                  </li>
                  <li className="rounded-lg border border-brand/30 bg-brand-soft/30 p-3">
                    <h3 className="mb-3 text-sm font-semibold text-ink">
                      {t('collocation.system_title')}
                    </h3>
                    <div className="space-y-3">
                      {result.equations.map((equation, index) => (
                        <div
                          key={equation.exactX}
                          className="rounded-md border border-line bg-panel p-2"
                        >
                          <p className="mb-1 text-xs text-muted">
                            <InlineMath
                              value={`x_{${index + 1}} = ${texNumber(equation.x)} \\approx ${formatApproximation(equation.x)}`}
                            />
                          </p>
                          <MathDisplay
                            value={`${linearCombinationTex(equation.coefficients, texNumber)} = ${texNumber(equation.rhs)}`}
                          />
                          <div className="overflow-x-auto text-xs text-muted">
                            <InlineMath
                              value={`${linearCombinationTex(equation.coefficients, formatApproximation)} = ${formatApproximation(equation.rhs)}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 overflow-x-auto rounded-md bg-panel p-3">
                      <MathDisplay
                        value={`\\left\\{\\begin{aligned}${result.equations.map((equation) => `${linearCombinationTex(equation.coefficients, texNumber)}&=${texNumber(equation.rhs)}`).join('\\\\')}\\end{aligned}\\right.`}
                      />
                    </div>
                  </li>
                  <li className="rounded-lg border border-line bg-bg-2 p-3">
                    <h3 className="mb-2 text-sm font-semibold text-ink">
                      {t('collocation.gauss_title')}
                    </h3>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {result.coefficients.map((coefficient, index) => (
                        <span
                          key={index}
                          className="rounded-md border border-brand/30 bg-brand/10 px-2 py-1 text-xs text-brand"
                        >
                          <InlineMath
                            value={`C_${index + 1} = ${texNumber(coefficient)} \\approx ${formatApproximation(coefficient)}`}
                          />
                        </span>
                      ))}
                    </div>
                    <MathDisplay value={result.finalSolution} />
                  </li>
                </ol>
              </PsPanel>
              <PsPanel>
                <PsPanelHead
                  eyebrow={t('collocation.plot_eyebrow')}
                  title={t('collocation.plot_title')}
                  idx="03"
                />
                <Chart result={result} t={t} />
                <div className="mt-4 overflow-x-auto rounded-lg border border-line">
                  <table className="w-full min-w-[360px] text-left font-mono text-xs">
                    <thead className="bg-bg-2 text-muted">
                      <tr>
                        <th className="px-3 py-2">{t('collocation.table_x')}</th>
                        <th className="px-3 py-2">{t('collocation.table_approximation')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.samples
                        .filter(
                          (_, index) =>
                            index % 5 === 0 ||
                            index === result.samples.length - 1,
                        )
                        .map((sample) => (
                          <tr key={sample.x} className="border-t border-line">
                            <td className="px-3 py-2">{sample.x.toFixed(6)}</td>
                            <td className="px-3 py-2 font-semibold text-brand">
                              {sample.value.toFixed(8)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </PsPanel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
