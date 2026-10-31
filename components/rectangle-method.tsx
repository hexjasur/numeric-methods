'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Waves } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { QuadraturePlot } from '@/components/integration/trapezoid-plot';
import { calculateRectangles, formatRectangle, type RectangleResult } from '@/lib/rectangles';
import { math, normalizeExpression } from '@/lib/math';
import { ResultActions } from '@/components/ui/result-actions';

type PlotShape = 'left-rectangle' | 'right-rectangle';
const EXAMPLE = { expression: 'dx/sqrt(1+2*x^2)', a: '0.6', b: '1.6', n: '8' };

function MathOutput({ tex, display = false }: { tex: string; display?: boolean }) {
  const normalized = useMemo(() => tex.replace(/\\\\([a-zA-Z]+)/g, '\\$1'), [tex]);
  const html = useMemo(() => {
    try {
      return katex.renderToString(normalized, { throwOnError: false, displayMode: display });
    } catch {
      return normalized;
    }
  }, [normalized, display]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function NodeTable({ result }: { result: RectangleResult }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[500px] border-collapse text-left font-mono text-[12px]">
        <thead className="bg-bg-2 text-muted"><tr>
          <th className="px-3 py-2.5">i</th><th className="px-3 py-2.5">xᵢ</th><th className="px-3 py-2.5">f(xᵢ)</th><th className="px-3 py-2.5 text-right">yᵢ</th>
        </tr></thead>
        <tbody>{result.points.map((point) => <tr className="border-t border-line" key={point.index}>
          <td className="px-3 py-2 text-brand">{point.index}</td>
          <td className="px-3 py-2">{formatRectangle(point.x, 7)}</td>
          <td className="px-3 py-2"><MathOutput tex={`f(${formatRectangle(point.x, 5)})`} /></td>
          <td className="px-3 py-2 text-right font-semibold">{formatRectangle(point.y, 8)}</td>
        </tr>)}</tbody>
      </table>
      <span className="sr-only">{t('rectangle.tbl_y')}</span>
    </div>
  );
}

function AreasTable({ result }: { result: RectangleResult }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[720px] border-collapse text-left font-mono text-[12px]">
        <thead className="bg-bg-2 text-muted"><tr>
          <th className="px-3 py-2.5">i</th><th className="px-3 py-2.5">{t('rectangle.tbl_interval')}</th>
          <th className="px-3 py-2.5">{t('rectangle.left_area')}</th><th className="px-3 py-2.5">{t('rectangle.right_area')}</th><th className="px-3 py-2.5 text-right">{t('rectangle.tbl_mean')}</th>
        </tr></thead>
        <tbody>{result.slices.map((slice) => <tr className="border-t border-line" key={slice.index}>
          <td className="px-3 py-2 text-brand">{slice.index}</td>
          <td className="px-3 py-2">[{formatRectangle(slice.x0, 4)}, {formatRectangle(slice.x1, 4)}]</td>
          <td className="px-3 py-2"><MathOutput tex={`${formatRectangle(result.h, 5)}\\cdot ${formatRectangle(slice.y0, 6)} = ${formatRectangle(slice.leftArea, 7)}`} /></td>
          <td className="px-3 py-2"><MathOutput tex={`${formatRectangle(result.h, 5)}\\cdot ${formatRectangle(slice.y1, 6)} = ${formatRectangle(slice.rightArea, 7)}`} /></td>
          <td className="px-3 py-2 text-right font-semibold">{formatRectangle((slice.leftArea + slice.rightArea) / 2, 7)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

export function RectangleMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState(EXAMPLE.expression);
  const [a, setA] = useState(EXAMPLE.a);
  const [b, setB] = useState(EXAMPLE.b);
  const [n, setN] = useState(EXAMPLE.n);
  const [shape, setShape] = useState<PlotShape>('left-rectangle');
  const [result, setResult] = useState<RectangleResult | null>(null);
  const [error, setError] = useState('');

  const integralTex = useMemo(() => {
    try {
      const normalized = normalizeExpression(expression).replace(/\bdx\b/g, '1');
      const tex = math.parse(normalized).toTex({ parenthesis: 'auto' });
      return katex.renderToString(`\\int_{${a || 'a'}}^{${b || 'b'}} ${tex}`, { displayMode: true, throwOnError: false });
    } catch {
      return '';
    }
  }, [expression, a, b]);

  function calculate() {
    setError('');
    try { setResult(calculateRectangles(expression, a, b, n, t)); }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : t('rectangle.err_calc')); }
  }

  const visiblePoints = result ? (result.points.length <= 14 ? result.points : [...result.points.slice(0, 6), ...result.points.slice(-3)]) : [];
  const visibleSlices = result ? (result.slices.length <= 12 ? result.slices : [...result.slices.slice(0, 5), ...result.slices.slice(-3)]) : [];

  return (
    <div className="relative mx-auto max-w-[1160px] px-0 sm:px-2 md:px-4 pb-12">
      <PsStrip eyebrow="INTEGRAL / 006" id="QUADRATURE" name={t('rectangle.strip')} />
      <PsHero eyebrow={t('rectangle.hero_eyebrow')} title={t('rectangle.hero_title')} titleHighlight={t('rectangle.hero_highlight')} lead={t('rectangle.hero_lead')}
        conditionMain={<MathOutput tex={String.raw`I_L=h\sum_{i=0}^{n-1}f(x_i),\quad I_R=h\sum_{i=1}^{n}f(x_i),\quad I_M=\frac{I_L+I_R}{2}`} />}
        conditionSub={t('rectangle.hero_condition')} />
      <PsMap eyebrow="Method map" title={t('rectangle.map_title')} steps={[
        { n: '01', t: t('rectangle.map_1_title'), s: <MathOutput tex={String.raw`h=\frac{b-a}{n}`} /> },
        { n: '02', t: t('rectangle.map_2_title'), s: t('rectangle.map_2_desc') },
        { n: '03', t: t('rectangle.map_3_title'), s: <MathOutput tex={String.raw`I_M=\frac{I_L+I_R}{2}`} /> },
      ]} />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(290px,.78fr)_minmax(0,1.5fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('rectangle.panel_input')} idx="01" />
          <PsNote icon={<Info size={18} />}><p>{t('rectangle.note_fn')} <code className="font-mono text-ink">dx/sqrt(1+2*x^2)</code></p></PsNote>
          <label className="mb-4 block"><span className="text-[13.5px] font-semibold text-ink">{t('rectangle.label_fn')}</span>
            <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-brand bg-brand-soft px-3.5 focus-within:ring-4 focus-within:ring-brand-soft">
              <b className="whitespace-nowrap font-mono text-brand">f(x) =</b>
              <input value={expression} onChange={(event) => setExpression(event.target.value)} aria-label={t('rectangle.label_fn')} spellCheck={false} className="min-w-0 flex-1 bg-transparent py-3.5 font-mono text-[15px] font-semibold text-ink outline-none" />
            </div>
          </label>
          <div className="mb-4 grid min-h-[65px] place-items-center overflow-x-auto rounded-lg border border-dashed border-line-2 bg-bg-2 p-2 text-cyan">
            {integralTex ? <span dangerouslySetInnerHTML={{ __html: integralTex }} /> : <span className="text-xs text-neg">{t('rectangle.preview_error')}</span>}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[13px] font-semibold text-ink">{t('rectangle.label_a')}</span><input value={a} onChange={(event) => setA(event.target.value)} type="number" step="any" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" /></label>
            <label className="block"><span className="text-[13px] font-semibold text-ink">{t('rectangle.label_b')}</span><input value={b} onChange={(event) => setB(event.target.value)} type="number" step="any" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" /></label>
          </div>
          <label className="mb-5 block"><span className="text-[13px] font-semibold text-ink">{t('rectangle.label_n')}</span><input value={n} onChange={(event) => setN(event.target.value)} type="number" min="1" max="1000" step="1" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" /><small className="mt-1 block text-xs text-muted">{t('rectangle.n_hint')}</small></label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={calculate} className="flex min-h-[50px] items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-3 py-3 text-sm font-bold text-panel transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand">{t('rectangle.btn_calc')} <ArrowUpRight size={17} /></button>
            <button onClick={() => { setExpression(EXAMPLE.expression); setA(EXAMPLE.a); setB(EXAMPLE.b); setN(EXAMPLE.n); setResult(null); setError(''); }} className="min-h-[50px] rounded-lg border border-line-2 bg-bg-2 px-3 py-3 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand">{t('rectangle.btn_example')}</button>
          </div>
          {error && <div className="mt-4 rounded-lg border border-neg/30 bg-neg/10 p-3.5 font-mono text-xs font-semibold text-neg" role="alert">{error}</div>}
        </PsPanel>

        <div className="grid min-w-0 gap-[18px]">
          <PsPanel>
            <PsPanelHead eyebrow={t('rectangle.plot_eyebrow')} title={t('rectangle.plot_title')} idx="02" />
            <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t('rectangle.plot_title')}>
              {(['left-rectangle', 'right-rectangle'] as PlotShape[]).map((value) => <button key={value} onClick={() => setShape(value)} aria-pressed={shape === value} className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${shape === value ? 'border-brand bg-brand-soft text-brand' : 'border-line-2 bg-bg-2 text-muted hover:text-ink'}`}>{t(value === 'left-rectangle' ? 'rectangle.legend_left' : 'rectangle.legend_right')}</button>)}
            </div>
            <QuadraturePlot expression={expression} a={a} b={b} result={result} shape={shape} emptyLabel={t('rectangle.plot_empty')} />
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted"><span className="flex items-center gap-2"><i className="h-0 w-5 border-t-2 border-cyan" />f(x)</span><span className="flex items-center gap-2"><i className="h-3 w-4 border border-cyan bg-cyan/15" />{t('rectangle.legend_rect')}</span></div>
          </PsPanel>

          {result ? <>
            <ResultActions
              summaryText={`Töğri törtburçaklar usuli: f(x) = ${expression}, [a, b] = [${a}, ${b}], n = ${result.n} -> Örta I_M ≈ ${formatRectangle(result.meanIntegral, 10)}, Çap I_L ≈ ${formatRectangle(result.leftIntegral, 10)}, Öng I_R ≈ ${formatRectangle(result.rightIntegral, 10)}`}
              csvData={result.points.map((p) => ({
                i: p.index,
                x_i: formatRectangle(p.x),
                y_i: formatRectangle(p.y),
              }))}
              csvFileName="tortburchaklar-integral.csv"
              imageFileName="tortburchaklar-integral.png"
            />

            <PsPanel>
              <PsPanelHead eyebrow={t('rectangle.result_eyebrow')} title={t('rectangle.result_title')} idx="03" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-brand bg-brand-soft p-4 sm:col-span-3"><span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted">{t('rectangle.mean_label')}</span><strong className="mt-2 block break-all font-mono text-3xl font-bold tracking-tight text-brand whitespace-nowrap overflow-x-auto [scrollbar-width:none]">{formatRectangle(result.meanIntegral, 10)}</strong></div>
                {[
                  [t('rectangle.left_label'), result.leftIntegral],
                  [t('rectangle.right_label'), result.rightIntegral],
                  [t('rectangle.trap_label'), result.trapezoidIntegral],
                ].map(([label, value]) => <div key={String(label)} className="rounded-lg border border-line bg-bg-2 p-3"><span className="block text-xs text-muted">{label}</span><b className="font-mono text-sm">{formatRectangle(Number(value), 9)}</b></div>)}
              </div>
            </PsPanel>

            <PsPanel>
              <PsPanelHead eyebrow="Trace / Qadamlar" title={t('rectangle.steps_title')} idx="04" />
              <div className="space-y-4">
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">01 · {t('rectangle.step_h')}</h3><div className="overflow-x-auto text-center"><MathOutput display tex={`h=\\frac{b-a}{n}=\\frac{${formatRectangle(result.b, 5)}-${formatRectangle(result.a, 5)}}{${result.n}}=${formatRectangle(result.h, 8)}`} /></div></section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">02 · {t('rectangle.step_nodes')}</h3><p className="mb-3 text-xs text-muted">{t('rectangle.step_nodes_desc')}</p><NodeTable result={{ ...result, points: visiblePoints }} />{visiblePoints.length !== result.points.length && <details className="mt-3 rounded-lg border border-line bg-panel p-3"><summary className="cursor-pointer text-sm font-semibold text-brand">{t('rectangle.show_all_nodes', { count: result.points.length })}</summary><div className="mt-3"><NodeTable result={result} /></div></details>}</section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">03 · {t('rectangle.step_areas')}</h3><div className="mb-3 grid gap-2 overflow-x-auto text-center sm:grid-cols-3"><MathOutput display tex="I_L=h\\sum_{i=0}^{n-1}f(x_i)" /><MathOutput display tex="I_R=h\\sum_{i=1}^{n}f(x_i)" /><MathOutput display tex="I_M=\\frac{I_L+I_R}{2}" /></div><AreasTable result={{ ...result, slices: visibleSlices }} />{visibleSlices.length !== result.slices.length && <details className="mt-3 rounded-lg border border-line bg-panel p-3"><summary className="cursor-pointer text-sm font-semibold text-brand">{t('rectangle.show_all_slices', { count: result.slices.length })}</summary><div className="mt-3"><AreasTable result={result} /></div></details>}<div className="mt-4 overflow-x-auto rounded-lg border border-dashed border-line-2 p-3 text-center"><MathOutput display tex={`I_L=${formatRectangle(result.leftIntegral, 9)},\\quad I_R=${formatRectangle(result.rightIntegral, 9)},\\quad I_M=\\frac{I_L+I_R}{2}=${formatRectangle(result.meanIntegral, 9)}`} /></div></section>
                <section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">04 · {t('rectangle.step_compare')}</h3><p className="mb-3 text-xs leading-relaxed text-muted">{t('rectangle.benchmark_note', { count: 10000 })}</p><div className="overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[500px] border-collapse text-left font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2">{t('rectangle.tbl_method')}</th><th className="px-3 py-2 text-right">{t('rectangle.tbl_result')}</th><th className="px-3 py-2 text-right">|Δ|</th></tr></thead><tbody>{[[t('rectangle.left_label'), result.leftIntegral, result.leftError], [t('rectangle.right_label'), result.rightIntegral, result.rightError], [t('rectangle.mean_label'), result.meanIntegral, result.meanError], [t('rectangle.trap_label'), result.trapezoidIntegral, result.trapezoidError], [t('rectangle.benchmark_value'), result.benchmark, 0]].map(([label, value, errorValue]) => <tr className="border-t border-line" key={String(label)}><td className="px-3 py-2 font-semibold">{label}</td><td className="px-3 py-2 text-right">{formatRectangle(Number(value), 8)}</td><td className="px-3 py-2 text-right">{String(label) === t('rectangle.benchmark_value') ? '—' : formatRectangle(Number(errorValue), 8)}</td></tr>)}</tbody></table></div><div className="mt-3 rounded-md border border-cyan/30 bg-cyan-soft p-3 text-xs text-muted">{t('rectangle.error_note')}</div></section>
              </div>
            </PsPanel>
          </> : !error ? <PsPanel className="grid min-h-[230px] place-items-center text-center"><div className="max-w-sm text-muted"><Waves size={44} className="mx-auto mb-3 text-cyan" /><b className="text-ink">{t('rectangle.empty_title')}</b><p className="mt-2 text-sm">{t('rectangle.empty_desc')}</p></div></PsPanel> : null}
        </div>
      </div>
      <footer className="mt-7 border-t border-line pt-3 font-mono text-xs text-muted">{t('rectangle.footer')}</footer>
    </div>
  );
}

export default RectangleMethod;
