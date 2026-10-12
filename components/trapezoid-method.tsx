'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Waves } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { TrapezoidPlot } from '@/components/integration/trapezoid-plot';
import { calculateTrapezoid, formatTrapezoid, type TrapezoidResult } from '@/lib/trapezoid';
import { math, normalizeExpression } from '@/lib/math';

const EXAMPLE = {
  expression: 'dx/sqrt(1+2*x^2)',
  a: '0.6',
  b: '1.6',
  n: '8',
};

function MathOutput({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: display });
    } catch {
      return tex;
    }
  }, [tex, display]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function NodeTable({ result }: { result: TrapezoidResult }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left font-mono text-[12px]">
        <thead className="bg-bg-2 text-muted">
          <tr>
            <th className="px-3 py-2.5">{t('trapezoid.tbl_i')}</th>
            <th className="px-3 py-2.5">{t('trapezoid.tbl_x')}</th>
            <th className="px-3 py-2.5">{t('trapezoid.tbl_eval')}</th>
            <th className="px-3 py-2.5 text-right">{t('trapezoid.tbl_y')}</th>
          </tr>
        </thead>
        <tbody>
          {result.points.map((point) => (
            <tr className="border-t border-line" key={point.index}>
              <td className="px-3 py-2 text-brand">{point.index}</td>
              <td className="px-3 py-2"><MathOutput tex={`x_{${point.index}} = ${formatTrapezoid(result.a, 4)} + ${point.index}\\cdot ${formatTrapezoid(result.h, 5)} = ${formatTrapezoid(point.x, 6)}`} /></td>
              <td className="px-3 py-2"><MathOutput tex={`f(${formatTrapezoid(point.x, 5)})`} /></td>
              <td className="px-3 py-2 text-right font-semibold">{formatTrapezoid(point.y, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrapezoidTable({ result }: { result: TrapezoidResult }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[620px] border-collapse text-left font-mono text-[12px]">
        <thead className="bg-bg-2 text-muted">
          <tr>
            <th className="px-3 py-2.5">{t('trapezoid.tbl_interval')}</th>
            <th className="px-3 py-2.5">{t('trapezoid.tbl_formula')}</th>
            <th className="px-3 py-2.5 text-right">{t('trapezoid.tbl_area')}</th>
          </tr>
        </thead>
        <tbody>
          {result.slices.map((slice) => (
            <tr className="border-t border-line" key={slice.index}>
              <td className="px-3 py-2 text-brand">[{formatTrapezoid(slice.x0, 4)}, {formatTrapezoid(slice.x1, 4)}]</td>
              <td className="px-3 py-2"><MathOutput tex={`\\frac{${formatTrapezoid(slice.y0, 5)} + ${formatTrapezoid(slice.y1, 5)}}{2}\\cdot ${formatTrapezoid(result.h, 5)}`} /></td>
              <td className="px-3 py-2 text-right font-semibold">{formatTrapezoid(slice.area, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrapezoidMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState(EXAMPLE.expression);
  const [a, setA] = useState(EXAMPLE.a);
  const [b, setB] = useState(EXAMPLE.b);
  const [n, setN] = useState(EXAMPLE.n);
  const [result, setResult] = useState<TrapezoidResult | null>(null);
  const [error, setError] = useState('');

  const integralTex = useMemo(() => {
    try {
      const normalized = normalizeExpression(expression).replace(/\bdx\b/g, '1');
      const tex = math.parse(normalized).toTex({ parenthesis: 'auto' });
      return katex.renderToString(`\\int_{${a || 'a'}}^{${b || 'b'}} ${tex}`, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return '';
    }
  }, [expression, a, b]);

  function calculate() {
    setError('');
    try {
      setResult(calculateTrapezoid(expression, a, b, n, t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('trapezoid.err_calc'));
    }
  }

  const visiblePoints = result
    ? result.points.length <= 14
      ? result.points
      : [...result.points.slice(0, 6), ...result.points.slice(-3)]
    : [];
  const visibleSlices = result
    ? result.slices.length <= 12
      ? result.slices
      : [...result.slices.slice(0, 5), ...result.slices.slice(-3)]
    : [];

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="INTEGRAL / 005" id="QUADRATURE" name={t('trapezoid.strip')} />
      <PsHero
        eyebrow={t('trapezoid.hero_eyebrow')}
        title={t('trapezoid.hero_title')}
        titleHighlight={t('trapezoid.hero_highlight')}
        lead={t('trapezoid.hero_lead')}
        conditionMain={<MathOutput tex="I_T = h\\sum_{i=0}^{n-1}\\frac{f(x_i)+f(x_{i+1})}{2}" />}
        conditionSub={t('trapezoid.hero_condition')}
      />
      <PsMap
        eyebrow="Method map"
        title={t('trapezoid.map_title')}
        steps={[
          { n: '01', t: t('trapezoid.map_1_title'), s: <MathOutput tex="h=\\frac{b-a}{n}" /> },
          { n: '02', t: t('trapezoid.map_2_title'), s: t('trapezoid.map_2_desc') },
          { n: '03', t: t('trapezoid.map_3_title'), s: <MathOutput tex="I_T=h\\sum\\frac{y_i+y_{i+1}}{2}" /> },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(290px,.78fr)_minmax(0,1.5fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('trapezoid.panel_input')} idx="01" />
          <PsNote icon={<Info size={18} />}>
            <p>{t('trapezoid.note_fn')} <code className="font-mono text-ink">dx/sqrt(1+2*x^2)</code></p>
          </PsNote>

          <label className="mb-4 block">
            <span className="text-[13.5px] font-semibold text-ink">{t('trapezoid.label_fn')}</span>
            <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-brand bg-brand-soft px-3.5 focus-within:ring-4 focus-within:ring-brand-soft">
              <b className="whitespace-nowrap font-mono text-brand">f(x) =</b>
              <input
                value={expression}
                onChange={(event) => setExpression(event.target.value)}
                aria-label={t('trapezoid.label_fn')}
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent py-3.5 font-mono text-[15px] font-semibold text-ink outline-none"
              />
            </div>
          </label>

          <div className="mb-4 grid min-h-[65px] place-items-center overflow-x-auto rounded-lg border border-dashed border-line-2 bg-bg-2 p-2 text-cyan">
            {integralTex ? <span dangerouslySetInnerHTML={{ __html: integralTex }} /> : <span className="text-xs text-neg">{t('trapezoid.preview_error')}</span>}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-semibold text-ink">{t('trapezoid.label_a')}</span>
              <input value={a} onChange={(event) => setA(event.target.value)} type="number" step="any" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-ink">{t('trapezoid.label_b')}</span>
              <input value={b} onChange={(event) => setB(event.target.value)} type="number" step="any" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" />
            </label>
          </div>

          <label className="mb-5 block">
            <span className="text-[13px] font-semibold text-ink">{t('trapezoid.label_n')}</span>
            <input value={n} onChange={(event) => setN(event.target.value)} type="number" min="1" max="1000" step="1" className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-3 font-mono text-[15px] text-ink outline-none focus:border-brand" />
            <small className="mt-1 block text-xs text-muted">{t('trapezoid.n_hint')}</small>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={calculate} className="flex min-h-[50px] items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-3 py-3 text-sm font-bold text-panel transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand">
              {t('trapezoid.btn_calc')} <ArrowUpRight size={17} />
            </button>
            <button
              onClick={() => {
                setExpression(EXAMPLE.expression);
                setA(EXAMPLE.a);
                setB(EXAMPLE.b);
                setN(EXAMPLE.n);
                setResult(null);
                setError('');
              }}
              className="min-h-[50px] rounded-lg border border-line-2 bg-bg-2 px-3 py-3 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              {t('trapezoid.btn_example')}
            </button>
          </div>
          {error && <div className="mt-4 rounded-lg border border-neg/30 bg-neg/10 p-3.5 font-mono text-xs font-semibold text-neg" role="alert">{error}</div>}
        </PsPanel>

        <div className="grid min-w-0 gap-[18px]">
          <PsPanel>
            <PsPanelHead eyebrow={t('trapezoid.plot_eyebrow')} title={t('trapezoid.plot_title')} idx="02" />
            <TrapezoidPlot expression={expression} a={a} b={b} result={result} emptyLabel={t('trapezoid.plot_empty')} />
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
              <span className="flex items-center gap-2"><i className="h-0 w-5 border-t-2 border-cyan" />f(x)</span>
              <span className="flex items-center gap-2"><i className="h-3 w-4 border border-cyan bg-cyan/15" />{t('trapezoid.legend_area')}</span>
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-brand" />{t('trapezoid.legend_node')}</span>
            </div>
          </PsPanel>

          {result ? (
            <>
              <PsPanel>
                <PsPanelHead eyebrow={t('trapezoid.result_eyebrow')} title={t('trapezoid.result_title')} idx="03" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-brand bg-brand-soft p-4 sm:col-span-3">
                    <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted">{t('trapezoid.result_value')}</span>
                    <strong className="mt-2 block break-all font-mono text-3xl font-bold tracking-tight text-brand">{formatTrapezoid(result.integral, 10)}</strong>
                  </div>
                  <div className="rounded-lg border border-line bg-bg-2 p-3">
                    <span className="block text-xs text-muted">h</span>
                    <b className="font-mono text-sm">{formatTrapezoid(result.h, 8)}</b>
                  </div>
                  <div className="rounded-lg border border-line bg-bg-2 p-3">
                    <span className="block text-xs text-muted">{t('trapezoid.result_intervals')}</span>
                    <b className="font-mono text-sm">{result.n}</b>
                  </div>
                  <div className="rounded-lg border border-line bg-bg-2 p-3">
                    <span className="block text-xs text-muted">{t('trapezoid.result_error')}</span>
                    <b className="font-mono text-sm">{formatTrapezoid(result.absoluteError, 8)}</b>
                  </div>
                </div>
              </PsPanel>

              <PsPanel>
                <PsPanelHead eyebrow="Trace / Qadamlar" title={t('trapezoid.steps_title')} idx="04" />
                <div className="space-y-4">
                  <section className="rounded-lg border border-line bg-bg-2 p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">01 · {t('trapezoid.step_h')}</h3>
                    <div className="overflow-x-auto text-center text-ink"><MathOutput display tex={`h=\\frac{b-a}{n}=\\frac{${formatTrapezoid(result.b, 5)}-${formatTrapezoid(result.a, 5)}}{${result.n}}=${formatTrapezoid(result.h, 8)}`} /></div>
                  </section>

                  <section className="rounded-lg border border-line bg-bg-2 p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">02 · {t('trapezoid.step_nodes')}</h3>
                    <p className="mb-3 text-xs text-muted">{t('trapezoid.step_nodes_desc')}</p>
                    <NodeTable result={{ ...result, points: visiblePoints }} />
                    {visiblePoints.length !== result.points.length && (
                      <details className="mt-3 rounded-lg border border-line bg-panel p-3">
                        <summary className="cursor-pointer text-sm font-semibold text-brand">{t('trapezoid.show_all_nodes', { count: result.points.length })}</summary>
                        <div className="mt-3"><NodeTable result={result} /></div>
                      </details>
                    )}
                  </section>

                  <section className="rounded-lg border border-line bg-bg-2 p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">03 · {t('trapezoid.step_areas')}</h3>
                    <div className="mb-3 overflow-x-auto text-center text-ink"><MathOutput display tex="A_i=\\frac{f(x_i)+f(x_{i+1})}{2}\\cdot h" /></div>
                    <TrapezoidTable result={{ ...result, slices: visibleSlices }} />
                    {visibleSlices.length !== result.slices.length && (
                      <details className="mt-3 rounded-lg border border-line bg-panel p-3">
                        <summary className="cursor-pointer text-sm font-semibold text-brand">{t('trapezoid.show_all_slices', { count: result.slices.length })}</summary>
                        <div className="mt-3"><TrapezoidTable result={result} /></div>
                      </details>
                    )}
                    <div className="mt-4 overflow-x-auto rounded-lg border border-dashed border-line-2 p-3 text-center text-ink">
                      <MathOutput display tex={`I_T=\\sum_{i=0}^{${result.n - 1}} A_i=${formatTrapezoid(result.integral, 10)}`} />
                    </div>
                  </section>

                  <section className="rounded-lg border border-line bg-bg-2 p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">04 · {t('trapezoid.step_error')}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted">{t('trapezoid.benchmark_note', { count: 10000 })}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-md border border-line bg-panel p-3"><span className="block text-xs text-muted">{t('trapezoid.benchmark_value')}</span><b className="font-mono text-sm">{formatTrapezoid(result.benchmark, 9)}</b></div>
                      <div className="rounded-md border border-line bg-panel p-3"><span className="block text-xs text-muted">|Δ|</span><b className="font-mono text-sm">{formatTrapezoid(result.absoluteError, 9)}</b></div>
                      <div className="rounded-md border border-line bg-panel p-3"><span className="block text-xs text-muted">{t('trapezoid.relative_error')}</span><b className="font-mono text-sm">{result.relativeErrorPercent === null ? '—' : `${formatTrapezoid(result.relativeErrorPercent, 5)}%`}</b></div>
                    </div>
                  </section>
                </div>
              </PsPanel>
            </>
          ) : !error ? (
            <PsPanel className="grid min-h-[230px] place-items-center text-center">
              <div className="max-w-sm text-muted">
                <Waves size={44} className="mx-auto mb-3 text-cyan" />
                <b className="text-ink">{t('trapezoid.empty_title')}</b>
                <p className="mt-2 text-sm">{t('trapezoid.empty_desc')}</p>
              </div>
            </PsPanel>
          ) : null}
        </div>
      </div>
      <footer className="mt-7 border-t border-line pt-3 font-mono text-xs text-muted">{t('trapezoid.footer')}</footer>
    </div>
  );
}

export default TrapezoidMethod;
