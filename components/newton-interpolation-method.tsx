'use client';

import { useState, type ReactNode } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Minus, Plus } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import {
  PsHero,
  PsMap,
  PsNote,
  PsPanel,
  PsPanelHead,
  PsStrip,
} from '@/components/ui/print-stream';
import { ResultActions } from '@/components/ui/result-actions';
import {
  calculateNewtonInterpolation,
  formatNewtonValue,
  type NewtonInputPoint,
  type NewtonInterpolationMode,
  type NewtonInterpolationResult,
} from '@/lib/newton-interpolation';

const DEFAULT_POINTS: NewtonInputPoint[] = [
  { x: '1', y: '1' },
  { x: '2', y: '4' },
  { x: '3', y: '9' },
];
const DEFAULT_TARGET = '1.5';
const MAX_POINTS = 12;

const EXAMPLES: {
  labelKey: string;
  points: NewtonInputPoint[];
  targetX: string;
  mode: NewtonInterpolationMode;
}[] = [
  {
    labelKey: 'newtonInterpolation.example_1',
    points: DEFAULT_POINTS,
    targetX: DEFAULT_TARGET,
    mode: 'divided',
  },
  {
    labelKey: 'newtonInterpolation.example_2',
    points: [
      { x: '0', y: '0' },
      { x: '1', y: '1' },
      { x: '3', y: '10' },
    ],
    targetX: '2',
    mode: 'divided',
  },
  {
    labelKey: 'newtonInterpolation.example_3',
    points: [
      { x: '-1', y: '0' },
      { x: '0', y: '2' },
      { x: '1/2', y: '1.125' },
      { x: '1', y: '0' },
    ],
    targetX: '1/4',
    mode: 'divided',
  },
];

function MathOutput({ tex, display = false }: { tex: string; display?: boolean }) {
  let html: string;
  try {
    html = katex.renderToString(tex, { throwOnError: false, displayMode: display });
  } catch {
    html = tex;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function texNumber(value: number): string {
  const text = formatNewtonValue(value, 8);
  const match = /^(-?\d+(?:\.\d+)?)e([+-]?\d+)$/i.exec(text);
  if (match) return `${match[1]}\\times 10^{${Number(match[2])}}`;
  return text;
}

function dividedDifferenceLabel(start: number, end: number): string {
  return start === end
    ? `f[x_{${start}}]`
    : `f[x_{${start}},\\ldots,x_{${end}}]`;
}

function newtonBasisPolynomialTex(
  result: NewtonInterpolationResult,
  termCount: number,
): string {
  const terms: string[] = [];
  for (let order = 0; order < termCount; order += 1) {
    const coefficient = result.coefficients[order];
    const magnitude = texNumber(Math.abs(coefficient));
    const factors = result.basisNodes[order]
      .map((node) => `(x - (${texNumber(node)}))`)
      .join('\\,');
    const term = order === 0
      ? magnitude
      : `${magnitude}${factors ? `\\,${factors}` : ''}`;
    if (terms.length === 0) {
      terms.push(coefficient < 0 ? `-${term}` : term);
    } else {
      terms.push(`${coefficient < 0 ? '-' : '+'} ${term}`);
    }
  }
  return terms.join(' ') || '0';
}

function expandedPolynomialTex(coefficients: number[]): string {
  const terms: string[] = [];
  for (let power = coefficients.length - 1; power >= 0; power -= 1) {
    const coefficient = coefficients[power];
    if (coefficient === 0) continue;
    const absolute = Math.abs(coefficient);
    const coefficientText = absolute === 1 && power > 0 ? '' : texNumber(absolute);
    const variable = power === 0
      ? ''
      : power === 1
        ? 'x'
        : `x^{${power}}`;
    const term = `${coefficientText}${variable}`;
    if (terms.length === 0) {
      terms.push(coefficient < 0 ? `-${term}` : term);
    } else {
      terms.push(`${coefficient < 0 ? '-' : '+'} ${term}`);
    }
  }
  return terms.join(' ') || '0';
}

function PointInputTable({
  points,
  onChange,
}: {
  points: NewtonInputPoint[];
  onChange: (index: number, axis: 'x' | 'y', value: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="w-full table-fixed border-collapse font-mono text-sm">
        <thead className="bg-bg-2 text-muted">
          <tr>
            <th className="w-12 border-b border-line px-2 py-2 text-center text-xs font-semibold">i</th>
            <th className="border-b border-line px-2 py-2 text-center font-semibold">xᵢ</th>
            <th className="border-b border-line px-2 py-2 text-center font-semibold">yᵢ</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point, index) => (
            <tr key={index} className="border-b border-line last:border-b-0 hover:bg-bg-2/30">
              <td className="px-2 py-2 text-center text-xs font-bold text-brand">{index}</td>
              <td className="p-1">
                <input
                  aria-label={t('newtonInterpolation.point_x', { index: index + 1 })}
                  value={point.x}
                  onChange={(event) => onChange(index, 'x', event.target.value)}
                  className="w-full min-w-0 rounded border border-line-2 bg-transparent px-2 py-2 text-center font-mono text-sm text-ink outline-none focus:border-brand focus:bg-bg"
                  inputMode="decimal"
                />
              </td>
              <td className="p-1">
                <input
                  aria-label={t('newtonInterpolation.point_y', { index: index + 1 })}
                  value={point.y}
                  onChange={(event) => onChange(index, 'y', event.target.value)}
                  className="w-full min-w-0 rounded border border-line-2 bg-transparent px-2 py-2 text-center font-mono text-sm text-ink outline-none focus:border-brand focus:bg-bg"
                  inputMode="decimal"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepBlock({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-bg-2 p-3 sm:p-4">
      <h3 className="mb-3 flex items-start gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">
        <span className="shrink-0">{number} ·</span>
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}

export function NewtonInterpolationMethod() {
  const { t } = useI18n();
  const [points, setPoints] = useState<NewtonInputPoint[]>(DEFAULT_POINTS.map((point) => ({ ...point })));
  const [targetX, setTargetX] = useState(DEFAULT_TARGET);
  const [mode, setMode] = useState<NewtonInterpolationMode>('divided');
  const [result, setResult] = useState<NewtonInterpolationResult | null>(() =>
    calculateNewtonInterpolation(DEFAULT_POINTS, DEFAULT_TARGET, 'divided'),
  );
  const [error, setError] = useState('');

  function calculate(inputPoints = points, inputTarget = targetX, inputMode = mode) {
    setError('');
    try {
      setResult(calculateNewtonInterpolation(inputPoints, inputTarget, inputMode));
    } catch (cause) {
      setResult(null);
      setError(
        cause instanceof Error
          ? t(cause.message)
          : t('newtonInterpolation.err_general'),
      );
    }
  }

  function updatePoint(index: number, axis: 'x' | 'y', value: string) {
    setPoints((current) =>
      current.map((point, pointIndex) =>
        pointIndex === index ? { ...point, [axis]: value } : point,
      ),
    );
    setResult(null);
    setError('');
  }

  function applyExample(index: number) {
    const example = EXAMPLES[index];
    const nextPoints = example.points.map((point) => ({ ...point }));
    setPoints(nextPoints);
    setTargetX(example.targetX);
    setMode(example.mode);
    calculate(nextPoints, example.targetX, example.mode);
  }

  function addPoint() {
    if (points.length >= MAX_POINTS) return;
    setPoints((current) => [...current, { x: '', y: '' }]);
    setResult(null);
    setError('');
  }

  function removePoint() {
    if (points.length <= 2) return;
    setPoints((current) => current.slice(0, -1));
    setResult(null);
    setError('');
  }

  const anchorIndex = result?.mode === 'finite' && result.direction === 'backward'
    ? (result.points.length - 1)
    : 0;

  return (
    <div className="relative mx-auto max-w-[1160px] px-0 sm:px-2 md:px-4 pb-12">
      <PsStrip eyebrow="INTERPOLATION / 010" id="NEWTON" name={t('newtonInterpolation.strip')} />
      <PsHero
        eyebrow={t('newtonInterpolation.hero_eyebrow')}
        title={t('newtonInterpolation.hero_title')}
        titleHighlight={t('newtonInterpolation.hero_highlight')}
        lead={t('newtonInterpolation.hero_lead')}
        conditionMain={<MathOutput tex={String.raw`P_{n-1}(x)=a_0+a_1(x-x_0)+\cdots+a_{n-1}\prod_{j=0}^{n-2}(x-x_j)`} />}
        conditionSub={t('newtonInterpolation.hero_condition')}
      />
      <PsMap
        eyebrow={t('newtonInterpolation.map_eyebrow')}
        title={t('newtonInterpolation.map_title')}
        steps={[
          { n: '01', t: t('newtonInterpolation.map_1_title'), s: t('newtonInterpolation.map_1_desc') },
          { n: '02', t: t('newtonInterpolation.map_2_title'), s: <MathOutput tex={String.raw`f[x_i,\ldots,x_{i+j}]=\frac{f[x_{i+1},\ldots,x_{i+j}]-f[x_i,\ldots,x_{i+j-1}]}{x_{i+j}-x_i}`} /> },
          { n: '03', t: t('newtonInterpolation.map_3_title'), s: <MathOutput tex={String.raw`P_n(x)=a_0+a_1(x-x_0)+a_2(x-x_0)(x-x_1)+\cdots`} /> },
          { n: '04', t: t('newtonInterpolation.map_4_title'), s: t('newtonInterpolation.map_4_desc') },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(300px,.78fr)_minmax(0,1.4fr)]">
        <PsPanel>
          <PsPanelHead eyebrow={t('newtonInterpolation.input_eyebrow')} title={t('newtonInterpolation.input_title')} idx="01" />
          <PsNote icon={<Info size={18} />}>
            <p>{t('newtonInterpolation.note_points')} <code className="font-mono text-ink">1/2</code>, <code className="font-mono text-ink">-1</code>. {t('newtonInterpolation.note_unique')}</p>
          </PsNote>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              calculate();
            }}
            className="mt-4"
          >
            <PointInputTable points={points} onChange={updatePoint} />
            <div className="my-3 flex items-center gap-2">
              <span className="flex-1 text-xs text-muted">{t('newtonInterpolation.point_controls')}</span>
              <button type="button" disabled={points.length >= MAX_POINTS} onClick={addPoint} aria-label={t('newtonInterpolation.add_point')} className="grid h-9 w-9 place-items-center rounded-md border border-line-2 bg-bg-2 text-ink hover:border-brand hover:text-brand disabled:opacity-40"><Plus size={17} /></button>
              <button type="button" disabled={points.length <= 2} onClick={removePoint} aria-label={t('newtonInterpolation.remove_point')} className="grid h-9 w-9 place-items-center rounded-md border border-line-2 bg-bg-2 text-ink hover:border-brand hover:text-brand disabled:opacity-40"><Minus size={17} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-[13px] font-semibold text-ink">
                {t('newtonInterpolation.mode')}
                <select value={mode} onChange={(event) => { setMode(event.target.value as NewtonInterpolationMode); setResult(null); setError(''); }} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-sm text-ink outline-none focus:border-brand">
                  <option value="divided">{t('newtonInterpolation.mode_divided')}</option>
                  <option value="finite">{t('newtonInterpolation.mode_finite')}</option>
                </select>
              </label>
              <label className="block text-[13px] font-semibold text-ink">
                {t('newtonInterpolation.target_x')}
                <input value={targetX} onChange={(event) => { setTargetX(event.target.value); setResult(null); setError(''); }} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-sm text-ink outline-none focus:border-brand" inputMode="decimal" />
              </label>
            </div>
            <div className="my-4 grid gap-2 sm:grid-cols-1">
              {EXAMPLES.map((example, index) => (
                <button key={example.labelKey} type="button" onClick={() => applyExample(index)} className="min-h-10 rounded-md border border-line bg-bg-2 px-3 py-2 text-left text-xs font-semibold text-muted transition-colors hover:border-brand hover:text-brand">
                  {t(example.labelKey)}
                </button>
              ))}
            </div>
            <button type="submit" className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-3 py-3 text-sm font-bold text-panel transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand">
              {t('newtonInterpolation.calculate')} <ArrowUpRight size={17} />
            </button>
            {error && <div className="mt-4 rounded-lg border border-neg/30 bg-neg/10 p-3.5 font-mono text-xs font-semibold text-neg" role="alert">{error}</div>}
          </form>
        </PsPanel>

        <div className="grid min-w-0 gap-[18px]">
          {result ? (
            <>
              <ResultActions
                summaryText={`P(${formatNewtonValue(result.targetX, 8)}) = ${formatNewtonValue(result.interpolatedValue, 10)}`}
                csvData={result.differenceSteps.map((step) => ({
                  order: step.order,
                  i: step.index,
                  left_value: formatNewtonValue(step.leftValue),
                  right_value: formatNewtonValue(step.rightValue),
                  denominator: step.denominator === null ? '' : formatNewtonValue(step.denominator),
                  result: formatNewtonValue(step.result),
                }))}
                csvFileName="newton-interpolation-steps.csv"
                imageFileName="newton-interpolation-steps.png"
              />
              <PsPanel>
                <PsPanelHead eyebrow={t('newtonInterpolation.steps_eyebrow')} title={t('newtonInterpolation.steps_title')} idx="02" />
                <div className="space-y-4">
                  <StepBlock number="01" title={t('newtonInterpolation.step_points')}>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{t('newtonInterpolation.step_points_desc', { count: result.points.length })}</p>
                    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
                      <table className="w-full min-w-[360px] border-collapse font-mono text-sm">
                        <thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2 text-left">i</th><th className="px-3 py-2 text-right">xᵢ</th><th className="px-3 py-2 text-right">yᵢ</th></tr></thead>
                        <tbody>{result.points.map((point) => <tr key={point.index} className="border-t border-line"><td className="px-3 py-2 text-brand">{point.index}</td><td className="px-3 py-2 text-right">{formatNewtonValue(point.x)}</td><td className="px-3 py-2 text-right">{formatNewtonValue(point.y)}</td></tr>)}</tbody>
                      </table>
                    </div>
                    <p className="mt-3 rounded-md border border-cyan/20 bg-cyan-soft px-3 py-2 text-xs leading-relaxed text-ink-2">{t('newtonInterpolation.step_points_check')}</p>
                  </StepBlock>

                  <StepBlock number="02" title={t('newtonInterpolation.step_differences')}>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{result.mode === 'divided' ? t('newtonInterpolation.divided_intro') : t('newtonInterpolation.finite_intro', { direction: t(`newtonInterpolation.${result.direction}`), h: formatNewtonValue(result.spacing ?? 0) })}</p>
                    <div className="mb-4 overflow-x-auto rounded-lg border border-dashed border-line-2 bg-panel p-3 text-center text-brand">
                      {result.mode === 'divided'
                        ? <MathOutput display tex={String.raw`f[x_i,\ldots,x_{i+j}]=\frac{f[x_{i+1},\ldots,x_{i+j}]-f[x_i,\ldots,x_{i+j-1}]}{x_{i+j}-x_i}`} />
                        : result.direction === 'backward'
                          ? <MathOutput display tex={String.raw`\nabla^j y_i=\nabla^{j-1}y_i-\nabla^{j-1}y_{i-1}`} />
                          : <MathOutput display tex={String.raw`\Delta^j y_i=\Delta^{j-1}y_{i+1}-\Delta^{j-1}y_i`} />}
                    </div>
                    <div className="space-y-2.5">
                      {result.differenceSteps.map((step) => {
                        const isBackward = result.mode === 'finite' && result.direction === 'backward';
                        const formulaTex = result.mode === 'divided'
                          ? `${dividedDifferenceLabel(step.index, step.index + step.order)}=\\frac{${dividedDifferenceLabel(step.index + 1, step.index + step.order)}-${dividedDifferenceLabel(step.index, step.index + step.order - 1)}}{x_{${step.index + step.order}}-x_{${step.index}}}=\\frac{${texNumber(step.leftValue)}-(${texNumber(step.rightValue)})}{${texNumber(step.endX)}-(${texNumber(step.startX)})}=${texNumber(step.result)}`
                          : isBackward
                            ? `\\nabla^{${step.order}}y_{${step.index}}=${step.order === 1 ? `y_{${step.index}}-y_{${step.index - 1}}` : `\\nabla^{${step.order - 1}}y_{${step.index}}-\\nabla^{${step.order - 1}}y_{${step.index - 1}}`}=${texNumber(step.leftValue)}-(${texNumber(step.rightValue)})=${texNumber(step.result)}`
                            : `${step.order === 1 ? '\\Delta y' : `\\Delta^{${step.order}}y`}_{${step.index}}=${step.order === 1 ? `y_{${step.index + 1}}-y_{${step.index}}` : `\\Delta^{${step.order - 1}}y_{${step.index + 1}}-\\Delta^{${step.order - 1}}y_{${step.index}}`}=${texNumber(step.leftValue)}-(${texNumber(step.rightValue)})=${texNumber(step.result)}`;
                        return (
                          <div key={`${step.order}-${step.index}`} className="rounded-lg border border-line bg-bg-2 p-3">
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">{t('newtonInterpolation.difference_cell', { order: step.order, index: step.index })}</p>
                            <div className="overflow-x-auto text-center text-ink"><MathOutput display tex={formulaTex} /></div>
                          </div>
                        );
                      })}
                    </div>
                    <details className="mt-4 rounded-lg border border-line bg-panel">
                      <summary className="cursor-pointer px-3 py-2.5 text-sm font-semibold text-brand">{t('newtonInterpolation.table_summary')}</summary>
                      <div className="overflow-x-auto p-3 pt-1">
                        <table className="w-full min-w-[440px] border-collapse font-mono text-xs">
                          <thead><tr className="border-b border-line text-muted"><th className="px-2 py-2 text-left">i</th><th className="px-2 py-2 text-right">xᵢ</th><th className="px-2 py-2 text-right">yᵢ</th>{result.points.slice(1).map((_, index) => <th key={index} className="px-2 py-2 text-right">{result.mode === 'divided' ? `f[·] ${index + 1}` : `${result.direction === 'backward' ? '∇' : 'Δ'}${index + 1}y`}</th>)}</tr></thead>
                          <tbody>{result.points.map((point, row) => <tr key={point.index} className="border-t border-line"><td className="px-2 py-2 text-brand">{point.index}</td><td className="px-2 py-2 text-right">{formatNewtonValue(point.x)}</td><td className="px-2 py-2 text-right">{formatNewtonValue(point.y)}</td>{result.points.slice(1).map((_, orderIndex) => { const order = orderIndex + 1; const validCell = result.mode === 'finite' && result.direction === 'backward' ? row >= order : row < result.points.length - order; return <td key={order} className="px-2 py-2 text-right">{validCell ? formatNewtonValue(result.differenceTable[row][order]) : '—'}</td>; })}</tr>)}</tbody>
                        </table>
                      </div>
                    </details>
                  </StepBlock>

                  <StepBlock number="03" title={t('newtonInterpolation.step_polynomial')}>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{t('newtonInterpolation.polynomial_intro')}</p>
                    <div className="mb-3 overflow-x-auto rounded-lg border border-dashed border-line-2 bg-panel p-3 text-center text-brand"><MathOutput display tex={String.raw`P_{n-1}(x)=a_0+a_1(x-x_{m_0})+a_2(x-x_{m_0})(x-x_{m_1})+\cdots`} /></div>
                    <div className="space-y-3">
                      {result.coefficients.map((coefficient, order) => {
                        let coefficientTex: string;
                        if (order === 0) {
                          coefficientTex = `a_0=y_{${anchorIndex}}=${texNumber(coefficient)}`;
                        } else if (result.mode === 'divided') {
                          coefficientTex = `a_${order}=${dividedDifferenceLabel(0, order)}=${texNumber(coefficient)}`;
                        } else {
                          const symbol = result.direction === 'forward' ? '\\Delta' : '\\nabla';
                          const nodeIndex = result.direction === 'forward' ? 0 : result.points.length - 1;
                          const differenceRow = result.direction === 'forward' ? 0 : result.points.length - 1;
                          coefficientTex = `a_${order}=\\frac{${symbol}^{${order}}y_{${nodeIndex}}}{${order}!\\,h^{${order}}}=\\frac{${texNumber(result.differenceTable[differenceRow][order])}}{${order}!\\,(${texNumber(result.spacing ?? 0)})^{${order}}}=${texNumber(coefficient)}`;
                        }
                        return (
                          <div key={order} className="rounded-lg border border-line bg-bg-2 p-3">
                            <div className="overflow-x-auto text-center text-ink"><MathOutput display tex={coefficientTex} /></div>
                            <div className="mt-2 overflow-x-auto border-t border-dashed border-line pt-2 text-center text-brand"><MathOutput display tex={`P_${order}(x)=${newtonBasisPolynomialTex(result, order + 1)}`} /></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 rounded-lg border border-brand/30 bg-brand-soft p-3">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">{t('newtonInterpolation.expanded_polynomial')}</p>
                      <div className="overflow-x-auto text-center text-lg font-bold text-brand"><MathOutput display tex={`P_{${result.points.length - 1}}(x)=${expandedPolynomialTex(result.expandedCoefficients)}`} /></div>
                    </div>
                  </StepBlock>

                  <StepBlock number="04" title={t('newtonInterpolation.step_evaluate')}>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{t('newtonInterpolation.evaluate_intro', { x: formatNewtonValue(result.targetX) })}</p>
                    <div className="space-y-2.5">
                      {result.evaluationTerms.map((term) => {
                        const factors = term.nodes.map((node) => `(${texNumber(result.targetX)}-(${texNumber(node)}))`).join('\\cdot ') || '1';
                        const termFormula = `T_${term.order}(${texNumber(result.targetX)})=${texNumber(term.coefficient)}\\cdot ${factors}=${texNumber(term.value)}`;
                        const previous = term.order === 0 ? '0' : texNumber(result.evaluationTerms[term.order - 1].cumulative);
                        return (
                          <div key={term.order} className="rounded-lg border border-line bg-bg-2 p-3">
                            <div className="overflow-x-auto text-center text-ink"><MathOutput display tex={termFormula} /></div>
                            <div className="mt-2 overflow-x-auto border-t border-dashed border-line pt-2 text-center text-brand"><MathOutput display tex={`P_${term.order}(${texNumber(result.targetX)})=${previous}+(${texNumber(term.value)})=${texNumber(term.cumulative)}`} /></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 rounded-lg border border-cyan/30 bg-cyan-soft p-4 text-center">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">{t('newtonInterpolation.final_value')}</p>
                      <MathOutput display tex={`P_{${result.points.length - 1}}(${texNumber(result.targetX)})=${texNumber(result.interpolatedValue)}`} />
                    </div>
                  </StepBlock>
                </div>
              </PsPanel>
            </>
          ) : (
            <PsPanel>
              <PsPanelHead eyebrow={t('newtonInterpolation.steps_eyebrow')} title={t('newtonInterpolation.steps_title')} idx="02" />
              <p className="rounded-lg border border-line bg-bg-2 p-4 text-sm leading-relaxed text-muted">{error || t('newtonInterpolation.waiting')}</p>
            </PsPanel>
          )}
        </div>
      </div>
      <PsPanel className="mt-[18px]">
        <PsPanelHead eyebrow={t('newtonInterpolation.theory_eyebrow')} title={t('newtonInterpolation.theory_title')} idx="03" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-bg-2 p-4">
            <h2 className="mb-2 text-sm font-bold text-ink">{t('newtonInterpolation.theory_divided_title')}</h2>
            <p className="text-sm leading-relaxed text-muted">{t('newtonInterpolation.theory_divided_desc')}</p>
          </div>
          <div className="rounded-lg border border-line bg-bg-2 p-4">
            <h2 className="mb-2 text-sm font-bold text-ink">{t('newtonInterpolation.theory_finite_title')}</h2>
            <p className="text-sm leading-relaxed text-muted">{t('newtonInterpolation.theory_finite_desc')}</p>
          </div>
        </div>
      </PsPanel>
    </div>
  );
}
