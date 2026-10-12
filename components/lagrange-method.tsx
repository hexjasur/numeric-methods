'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Minus, Plus, Waves } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { calculateLagrange, formatLagrange, type LagrangeInputPoint, type LagrangeResult } from '@/lib/lagrange';
import { math } from '@/lib/math';

const DEFAULT_POINTS: LagrangeInputPoint[] = [
  { x: '-1', y: '0' },
  { x: '0', y: '2' },
  { x: '1/2', y: '9/8' },
  { x: '1', y: '0' },
];
const EXAMPLES = [
  { label: 'Lagrange / sample 01', points: DEFAULT_POINTS, target: '', x: '1/4' },
  { label: 'x² + product', points: [{ x: '1', y: '1' }, { x: '2', y: '4' }, { x: '3', y: '9' }], target: 'x^2 + (x-1)*(x-2)*(x-3)', x: '3/2' },
  { label: 'Sample 03', points: [{ x: '1', y: '4' }, { x: '3', y: '1' }, { x: '4', y: '5' }], target: '', x: '5/2' },
];

function MathOutput({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, displayMode: display }), [tex, display]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function polynomialToTex(coefficients: number[]): string {
  const terms: string[] = [];
  for (let power = coefficients.length - 1; power >= 0; power--) {
    const coefficient = coefficients[power];
    if (Math.abs(coefficient) < 1e-10) continue;
    const magnitude = Number(Math.abs(coefficient).toPrecision(8)).toString();
    const term = power === 0
      ? magnitude
      : power === 1
        ? `${magnitude === '1' ? '' : magnitude}x`
        : `${magnitude === '1' ? '' : magnitude}x^{${power}}`;
    terms.push(`${coefficient < 0 ? '-' : '+'}${term}`);
  }
  if (terms.length === 0) return '0';
  const positive = terms[0].startsWith('+') ? terms[0].slice(1) : terms[0];
  return [positive, ...terms.slice(1)].join(' ');
}

function fractionTex(value: number): string {
  const fraction = math.fraction(value);
  const sign = Number(fraction.s) < 0 ? '-' : '';
  return Number(fraction.d) === 1
    ? `${sign}${fraction.n}`
    : `${sign}\\frac{${fraction.n}}{${fraction.d}}`;
}

function PointTable({ points, onChange }: { points: LagrangeInputPoint[]; onChange: (index: number, axis: 'x' | 'y', value: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[340px] border-collapse text-left font-mono text-sm">
        <thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2.5">№</th><th className="px-3 py-2.5">xᵢ</th><th className="px-3 py-2.5">yᵢ</th></tr></thead>
        <tbody>{points.map((point, index) => <tr key={index} className="border-t border-line">
          <td className="px-3 py-2 text-xs text-muted">{index + 1}</td>
          <td className="p-1"><input aria-label={t('lagrange.point_x', { index: index + 1 })} value={point.x} onChange={(event) => onChange(index, 'x', event.target.value)} className="w-full min-w-[90px] border-b border-line-2 bg-transparent px-2 py-2 text-center font-mono text-ink outline-none focus:border-brand" /></td>
          <td className="p-1"><input aria-label={t('lagrange.point_y', { index: index + 1 })} value={point.y} onChange={(event) => onChange(index, 'y', event.target.value)} className="w-full min-w-[90px] border-b border-line-2 bg-transparent px-2 py-2 text-center font-mono text-ink outline-none focus:border-brand" /></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

export function LagrangeMethod() {
  const { t } = useI18n();
  const [points, setPoints] = useState<LagrangeInputPoint[]>(DEFAULT_POINTS.map((point) => ({ ...point })));
  const [target, setTarget] = useState('');
  const [xValue, setXValue] = useState('1/4');
  const [result, setResult] = useState<LagrangeResult | null>(null);
  const [error, setError] = useState('');

  function updatePoint(index: number, axis: 'x' | 'y', value: string) {
    setPoints((current) => current.map((point, pointIndex) => pointIndex === index ? { ...point, [axis]: value } : point));
  }
  function calculate() {
    setError('');
    try { setResult(calculateLagrange(points, xValue, target, t)); }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : t('lagrange.err_calc')); }
  }
  function applyExample(index: number) {
    const example = EXAMPLES[index];
    setPoints(example.points.map((point) => ({ ...point })));
    setTarget(example.target);
    setXValue(example.x);
    setResult(null);
    setError('');
  }

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="INTERPOLATION / 007" id="POLYNOMIAL" name={t('lagrange.strip')} />
      <PsHero eyebrow={t('lagrange.hero_eyebrow')} title={t('lagrange.hero_title')} titleHighlight={t('lagrange.hero_highlight')} lead={t('lagrange.hero_lead')}
        conditionMain={<MathOutput tex="P_n(x)=\\sum_{i=0}^{n} y_i\\,\\ell_i(x)" />}
        conditionSub={t('lagrange.hero_condition')} />
      <PsMap eyebrow="Method map" title={t('lagrange.map_title')} steps={[
        { n: '01', t: t('lagrange.map_1_title'), s: t('lagrange.map_1_desc') },
        { n: '02', t: t('lagrange.map_2_title'), s: <MathOutput tex="\\ell_i(x)=\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j}" /> },
        { n: '03', t: t('lagrange.map_3_title'), s: <MathOutput tex="P_n(x)=\\sum y_i\\ell_i(x)" /> },
      ]} />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(330px,.82fr)_minmax(0,1.45fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Nuqtalar" title={t('lagrange.panel_input')} idx="01" />
          <PsNote icon={<Info size={18} />}><p>{t('lagrange.note_points')} <code className="font-mono text-ink">1/2</code>, <code className="font-mono text-ink">-1</code> {t('lagrange.note_end')}</p></PsNote>
          <PointTable points={points} onChange={updatePoint} />
          <div className="my-3 flex items-center gap-2">
            <span className="flex-1 text-xs text-muted">{t('lagrange.point_controls')}</span>
            <button disabled={points.length >= 12} onClick={() => { setPoints((current) => [...current, { x: '0', y: '0' }]); setResult(null); }} aria-label={t('lagrange.add_point')} className="grid h-9 w-9 place-items-center rounded-md border border-line-2 bg-bg-2 text-ink hover:border-brand hover:text-brand disabled:opacity-40"><Plus size={17} /></button>
            <button disabled={points.length <= 2} onClick={() => { setPoints((current) => current.slice(0, -1)); setResult(null); }} aria-label={t('lagrange.remove_point')} className="grid h-9 w-9 place-items-center rounded-md border border-line-2 bg-bg-2 text-ink hover:border-brand hover:text-brand disabled:opacity-40"><Minus size={17} /></button>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-[13px] font-semibold text-ink">{t('lagrange.target_x')}</span><input value={xValue} onChange={(event) => setXValue(event.target.value)} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-sm text-ink outline-none focus:border-brand" /></label>
            <label className="block"><span className="text-[13px] font-semibold text-ink">{t('lagrange.target_fn')}</span><input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="x^2 + 1 (optional)" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-sm text-ink outline-none focus:border-brand" /></label>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">{EXAMPLES.map((example, index) => <button key={example.label} onClick={() => applyExample(index)} className="min-h-10 rounded-md border border-line bg-bg-2 px-2 py-2 text-[11px] font-semibold text-muted hover:border-brand hover:text-brand">{t(`lagrange.example_${index + 1}`)}</button>)}</div>
          <button onClick={calculate} className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-3 py-3 text-sm font-bold text-panel transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand">{t('lagrange.btn_calc')} <ArrowUpRight size={17} /></button>
          {error && <div className="mt-4 rounded-lg border border-neg/30 bg-neg/10 p-3.5 font-mono text-xs font-semibold text-neg" role="alert">{error}</div>}
        </PsPanel>

        <div className="grid min-w-0 gap-[18px]">
          {result ? <>
            <PsPanel>
              <PsPanelHead eyebrow={t('lagrange.result_eyebrow')} title={t('lagrange.result_title')} idx="02" />
              <div className="rounded-lg border border-brand bg-brand-soft p-4"><span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted">{t('lagrange.result_poly')}</span><div className="mt-2 overflow-x-auto text-center text-brand"><MathOutput display tex={`P_{${result.points.length - 1}}(x)=${polynomialToTex(result.coefficients)}`} /></div></div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-line bg-bg-2 p-3"><span className="block text-xs text-muted">{t('lagrange.at_x', { x: formatLagrange(result.xValue, 6) })}</span><b className="font-mono text-lg">{formatLagrange(result.interpolatedValue, 10)}</b></div><div className="rounded-lg border border-line bg-bg-2 p-3"><span className="block text-xs text-muted">{t('lagrange.result_points')}</span><b className="font-mono text-lg">{result.points.length}</b></div></div>
              {result.targetValue !== null && <div className="mt-3 grid gap-3 rounded-lg border border-cyan/30 bg-cyan-soft p-3 sm:grid-cols-3"><div><span className="block text-xs text-muted">{t('lagrange.target_value')}</span><b className="font-mono">{formatLagrange(result.targetValue, 9)}</b></div><div><span className="block text-xs text-muted">Pₙ(x*)</span><b className="font-mono">{formatLagrange(result.interpolatedValue, 9)}</b></div><div><span className="block text-xs text-muted">|f(x*) − Pₙ(x*)|</span><b className="font-mono">{formatLagrange(result.absoluteError ?? 0, 9)}</b></div></div>}
            </PsPanel>

            <PsPanel>
              <PsPanelHead eyebrow="Trace / Qadamlar" title={t('lagrange.steps_title')} idx="03" />
              <div className="space-y-4">
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand">01 · {t('lagrange.step_points')}</h3><div className="overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[370px] border-collapse font-mono text-sm"><thead className="bg-panel text-muted"><tr><th className="px-3 py-2">i</th><th className="px-3 py-2">xᵢ</th><th className="px-3 py-2">yᵢ</th></tr></thead><tbody>{result.points.map((point) => <tr key={point.index} className="border-t border-line"><td className="px-3 py-2 text-brand">{point.index}</td><td className="px-3 py-2">{formatLagrange(point.x, 8)}</td><td className="px-3 py-2">{formatLagrange(point.y, 8)}</td></tr>)}</tbody></table></div></section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">02 · {t('lagrange.step_basis')}</h3><div className="mb-3 overflow-x-auto text-center"><MathOutput display tex="\\ell_i(x)=\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j}" /></div><div className="space-y-3">{result.bases.map((basis) => { const numerator = result.points.filter((_, index) => index !== basis.index).map((other) => `(x-(${fractionTex(other.x)}))`).join('\\cdot'); return <div key={basis.index} className="overflow-x-auto rounded-lg border border-line bg-panel p-3"><p className="mb-2 font-mono text-xs font-bold text-brand">ℓ{basis.index}(x) · {t('lagrange.point_label', { index: basis.index })}</p><div className="text-center"><MathOutput display tex={`\\ell_{${basis.index}}(x)=\\frac{${numerator}}{${fractionTex(basis.denominator)}}=${polynomialToTex(basis.coefficients)}`} /></div><div className="mt-2 border-t border-dashed border-line pt-2 text-center text-sm"><span className="mr-1 text-muted">y{basis.index}ℓ{basis.index}(x) =</span><MathOutput tex={polynomialToTex(basis.weightedCoefficients)} /></div></div>; })}</div></section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">03 · {t('lagrange.step_sum')}</h3><p className="mb-3 text-xs leading-relaxed text-muted">{t('lagrange.step_sum_desc')}</p><div className="overflow-x-auto rounded-lg border border-dashed border-line-2 bg-panel p-4 text-center text-brand"><MathOutput display tex={`P_{${result.points.length - 1}}(x)=\\sum_{i=0}^{${result.points.length - 1}} y_i\\ell_i(x)=${polynomialToTex(result.coefficients)}`} /></div></section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">04 · {t('lagrange.step_eval')}</h3><div className="overflow-x-auto text-center"><MathOutput display tex={`P(${formatLagrange(result.xValue, 6)})=${formatLagrange(result.interpolatedValue, 10)}`} /></div>{result.targetValue !== null && <><p className="my-3 text-xs text-muted">{t('lagrange.error_substitution')}</p><div className="overflow-x-auto rounded-lg border border-cyan/20 bg-panel p-3 text-center"><MathOutput display tex={`f(${formatLagrange(result.xValue, 6)})=${formatLagrange(result.targetValue, 10)},\\qquad |f(x^*)-P(x^*)|=${formatLagrange(result.absoluteError ?? 0, 10)}`} /></div></>}
                  <div className="mt-3 rounded-md border border-line bg-panel p-3 text-xs leading-relaxed text-muted"><MathOutput tex={`R_{${result.points.length - 1}}(x)=\\frac{f^{(${result.points.length})}(\\xi)}{${result.points.length}!}\\prod_{i=0}^{${result.points.length - 1}}(x-x_i)`} /> <span>{t('lagrange.remainder_note')}</span></div>
                </section>
              </div>
            </PsPanel>
          </> : !error ? <PsPanel className="grid min-h-[300px] place-items-center text-center"><div className="max-w-sm text-muted"><Waves size={44} className="mx-auto mb-3 text-cyan" /><b className="text-ink">{t('lagrange.empty_title')}</b><p className="mt-2 text-sm">{t('lagrange.empty_desc')}</p></div></PsPanel> : null}
        </div>
      </div>
      <footer className="mt-7 border-t border-line pt-3 font-mono text-xs text-muted">{t('lagrange.footer')}</footer>
    </div>
  );
}

export default LagrangeMethod;
