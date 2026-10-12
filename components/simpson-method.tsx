'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Sigma } from 'lucide-react';
import { calculateSimpson, format, type SimpsonResult } from '@/lib/simpson';
import { isSumOperatorNode, math, normalizeExpression } from '@/lib/math';
import { SimpsonPlot } from '@/components/simpson/plot';
import { PsHero, PsStrip, PsMap, PsPanel, PsPanelHead, PsNote } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';

function MathInline({ tex, className = '' }: { tex: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { throwOnError: false });
    } catch {
      return tex;
    }
  }, [tex]);

  return (
    <span
      className={`[&_.katex]:!px-0 [&_.katex]:!overflow-visible [&_.katex]:!max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function SimpsonMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState('dx / sqrt(1 + 2x^2)');
  const [a, setA] = useState('0.6');
  const [b, setB] = useState('1.6');
  const [n, setN] = useState('10');
  const [result, setResult] = useState<SimpsonResult | null>(() => {
    try {
      return calculateSimpson('dx / sqrt(1 + 2x^2)', '0.6', '1.6', '10', (k) => k);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');

  const liveIntegralTex = useMemo(() => {
    try {
      const norm = normalizeExpression(expression);
      if (!norm) return '';
      const node = math.parse(norm);
      const tex = node
        .toTex({ parenthesis: 'auto' })
        .replace(/\\cdot/g, '')
        .replace(/~/g, ' ')
        .trim();
      const hasDx = /\bdx\b/i.test(expression);
      const isSum = isSumOperatorNode(node);

      const inner = hasDx ? tex : isSum ? `\\left(${tex}\\right)\\,dx` : `${tex}\\,dx`;
      const lower = a.trim() || 'a';
      const upper = b.trim() || 'b';
      return katex.renderToString(`\\int_{${lower}}^{${upper}} ${inner}`, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return '';
    }
  }, [expression, a, b]);

  function calculate() {
    setError('');
    try {
      setResult(calculateSimpson(expression, a, b, n, t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('simpson.err_calc'));
    }
  }

  const renderKatex = (value: string) => katex.renderToString(value, { throwOnError: false });

  return (
    <div className="smp relative max-w-[1160px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="SMP-004" id="INTEGRAL" name={t('simpson.strip')} />

      <PsHero
        eyebrow={t('simpson.hero_eyebrow')}
        title={<>{t('simpson.hero_title')}</>}
        titleHighlight={t('simpson.hero_titleHighlight')}
        lead={t('simpson.hero_lead')}
        conditionMain={<MathInline tex="n \equiv 0 \pmod 2" />}
        conditionSub={t('simpson.hero_condSub')}
      />

      <PsMap
        eyebrow="Method map"
        title={t('simpson.map_title')}
        steps={[
          {
            n: '01',
            t: t('simpson.map_1_t'),
            s: (
              <div className="space-y-1">
                <span className="block text-muted text-[13px]">{t('simpson.map_1_desc')}</span>
                <span className="block text-ink font-semibold text-[13px] whitespace-nowrap overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
                  <MathInline tex="h = \frac{b - a}{n}" />
                </span>
              </div>
            ),
          },
          {
            n: '02',
            t: t('simpson.map_2_t'),
            s: (
              <div className="space-y-1">
                <span className="block text-muted text-[13px]">{t('simpson.map_2_desc')}</span>
                <span className="block text-ink font-semibold text-[13px] whitespace-nowrap overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
                  <MathInline tex="Y_{\mathrm{chet}},\; \sum Y_{\mathrm{toq}},\; \sum Y_{\mathrm{juft}}" />
                </span>
              </div>
            ),
          },
          {
            n: '03',
            t: t('simpson.map_3_t'),
            s: (
              <div className="space-y-1">
                <span className="block text-muted text-[13px]">{t('simpson.map_3_desc')}</span>
                <span className="block text-ink font-semibold text-[13px] whitespace-nowrap overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
                  <MathInline tex="I \approx \frac{h}{3} \Big[ Y_{\mathrm{chet}} + 4\sum Y_{\mathrm{toq}} + 2\sum Y_{\mathrm{juft}} \Big]" />
                </span>
              </div>
            ),
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,.85fr)_minmax(0,1.4fr)] gap-[18px] items-start">
        {/* INPUT PANEL */}
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('simpson.panel_input')} idx="01" />

          <PsNote icon={<Info size={18} />}>
            <p className="flex flex-wrap items-center gap-1.5">
              <b><MathInline tex="f(x)" /></b> — <span>{t('simpson.note_fn')}</span>
            </p>
          </PsNote>

          <label className="block mb-4">
            <span className="flex justify-between items-baseline text-[13.5px] font-[650] text-ink">
              {t('simpson.label_fn')}
            </span>
            <div className="mt-2 w-full border border-brand bg-brand-soft rounded-lg flex items-center gap-2.5 px-3.5 focus-within:ring-4 focus-within:ring-brand-soft focus-within:bg-panel transition-all">
              <b className="text-brand text-[15px] whitespace-nowrap"><MathInline tex="f(x) =" /></b>
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="dx / sqrt(1 + 2x^2)"
                aria-label={t('simpson.label_fn')}
                spellCheck={false}
                className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-ink py-[15px] font-mono text-[16px] font-semibold"
              />
            </div>
          </label>

          {/* Live KaTeX integral preview */}
          <div className="grid place-items-center min-h-[60px] -mt-1 mb-[18px] p-2.5 overflow-x-auto bg-bg-2 border border-dashed border-line-2 rounded-lg text-cyan text-[1.15em] [&_.katex-display]:my-0 [&_.katex]:text-[1.05em]">
            {liveIntegralTex ? (
              <span dangerouslySetInnerHTML={{ __html: liveIntegralTex }} />
            ) : (
              <span className="font-mono text-[13px] font-medium text-neg">
                {t('simpson.plot_empty')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="block">
              <span className="flex items-center gap-1.5 text-[13.5px] font-[650] text-ink mb-1.5">
                <span>{t('simpson.label_a_text')}</span>
                <MathInline tex="a" />
              </span>
              <input
                value={a}
                onChange={(e) => setA(e.target.value)}
                type="number"
                step="any"
                className="w-full border border-line bg-panel rounded-lg py-3 px-3.5 font-mono text-[15px] font-semibold text-ink outline-0 focus:border-brand transition-all"
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-1.5 text-[13.5px] font-[650] text-ink mb-1.5">
                <span>{t('simpson.label_b_text')}</span>
                <MathInline tex="b" />
              </span>
              <input
                value={b}
                onChange={(e) => setB(e.target.value)}
                type="number"
                step="any"
                className="w-full border border-line bg-panel rounded-lg py-3 px-3.5 font-mono text-[15px] font-semibold text-ink outline-0 focus:border-brand transition-all"
              />
            </label>
          </div>

          <label className="block mb-5">
            <span className="flex items-center gap-1.5 text-[13.5px] font-[650] text-ink mb-1.5">
              <span>{t('simpson.label_n_text')}</span>
              <MathInline tex="n" />
              <span className="text-muted font-normal text-xs">({t('simpson.label_n_even')})</span>
            </span>
            <input
              value={n}
              onChange={(e) => setN(e.target.value)}
              type="number"
              min="2"
              max="1000"
              step="2"
              className="w-full border border-line bg-panel rounded-lg py-3 px-3.5 font-mono text-[15px] font-semibold text-ink outline-0 focus:border-brand transition-all"
            />
          </label>

          <button
            onClick={calculate}
            className="w-full min-h-[50px] p-[14px_18px] bg-brand text-brand-ink border-0 rounded-lg font-sans text-[15px] font-[750] tracking-[.02em] cursor-pointer flex items-center justify-center gap-2.5 transition-all shadow-[0_12px_28px_-12px_var(--brand)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('simpson.btn_calc')}</span>
            <ArrowUpRight size={18} />
          </button>

          {error && (
            <div className="mt-4 p-3.5 border border-neg/30 bg-neg/10 text-neg rounded-lg font-mono text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}
        </PsPanel>

        {/* RESULTS & OUTPUT */}
        <div className="space-y-[18px]">
          {result ? (
            <>
              {/* PRIMARY RESULT CARD */}
              <PsPanel>
                <PsPanelHead eyebrow={t('simpson.res_eyebrow')} title={t('simpson.res_val')} idx="02" />

                <div className="flex flex-wrap items-baseline gap-4 mb-4">
                  <div className="font-mono text-[36px] font-extrabold text-brand tracking-tight">
                    {format(result.integral, 6)}
                  </div>
                  <div className="font-mono text-xs px-2.5 py-1 rounded-full border border-cyan/40 bg-cyan-soft text-cyan font-bold flex items-center gap-1.5">
                    <MathInline tex={`h = ${format(result.h, 5)}`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-line text-xs font-mono">
                  <div className="p-2.5 rounded bg-bg-2 border border-line">
                    <span className="text-muted block mb-1">{t('simpson.res_exact')}:</span>
                    <strong className="text-ink text-[13px]">{format(result.exactIntegral, 6)}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-bg-2 border border-line">
                    <span className="text-muted block mb-1 flex items-center gap-1">
                      <span>{t('simpson.res_err')}</span> <MathInline tex="(\Delta)" />:
                    </span>
                    <strong className="text-pos text-[13px]">{result.errorMargin.toExponential(4)}</strong>
                  </div>
                </div>
              </PsPanel>

              {/* MATH STEPS */}
              <PsPanel>
                <PsPanelHead eyebrow="Analysis / Formulalar" title="Matematik qadamlar" idx="03" />

                <div className="space-y-4">
                  {/* Step 1: h */}
                  <div className="p-3.5 rounded-lg border border-line bg-bg-2">
                    <h4 className="font-mono text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">1</span>
                      <span className="flex items-center gap-1.5">
                        <span>{t('simpson.step_1_title')}</span>
                        <MathInline tex="(h)" />
                      </span>
                    </h4>
                    <div
                      className="text-ink overflow-x-auto overflow-y-hidden text-sm [scrollbar-width:thin]"
                      dangerouslySetInnerHTML={{
                        __html: renderKatex(
                          `h = \\frac{b - a}{n} = \\frac{${format(result.b, 4)} - ${format(result.a, 4)}}{${result.n}} = ${format(result.h, 6)}`,
                        ),
                      }}
                    />
                  </div>

                  {/* Step 2: Sums */}
                  <div className="p-3.5 rounded-lg border border-line bg-bg-2">
                    <h4 className="font-mono text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">2</span>
                      {t('simpson.step_2_title')}
                    </h4>
                    <div
                      className="text-ink overflow-x-auto overflow-y-hidden text-sm [scrollbar-width:thin]"
                      dangerouslySetInnerHTML={{
                        __html: renderKatex(
                          `\\begin{aligned}
                          Y_{chet} &= y_0 + y_n = ${format(result.sumEnds, 6)} \\\\
                          \\sum Y_{toq} &= y_1 + y_3 + \\dots = ${format(result.sumOdd, 6)} \\\\
                          \\sum Y_{juft} &= y_2 + y_4 + \\dots = ${format(result.sumEven, 6)}
                          \\end{aligned}`,
                        ),
                      }}
                    />
                  </div>

                  {/* Step 3: Simpson formula */}
                  <div className="p-3.5 rounded-lg border border-line bg-bg-2">
                    <h4 className="font-mono text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">3</span>
                      {t('simpson.step_3_title')}
                    </h4>
                    <div
                      className="text-ink overflow-x-auto overflow-y-hidden text-sm [scrollbar-width:thin]"
                      dangerouslySetInnerHTML={{
                        __html: renderKatex(
                          `\\begin{aligned}
                          I &\\approx \\frac{h}{3} \\Big[ Y_{chet} + 4\\sum Y_{toq} + 2\\sum Y_{juft} \\Big] \\\\
                          I &\\approx \\frac{${format(result.h, 5)}}{3} \\Big[ ${format(result.sumEnds, 4)} + 4(${format(result.sumOdd, 4)}) + 2(${format(result.sumEven, 4)}) \\Big] \\\\
                          I &\\approx \\mathbf{${format(result.integral, 6)}}
                          \\end{aligned}`,
                        ),
                      }}
                    />
                  </div>

                  {/* Step 4: Error comparison */}
                  <div className="p-3.5 rounded-lg border border-brand/20 bg-brand-soft">
                    <h4 className="font-mono text-xs font-bold text-brand uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">4</span>
                      <span className="flex items-center gap-1.5">
                        <span>{t('simpson.step_4_title')}</span>
                        <MathInline tex="(\Delta)" />
                      </span>
                    </h4>
                    <div
                      className="text-ink overflow-x-auto overflow-y-hidden text-sm [scrollbar-width:thin]"
                      dangerouslySetInnerHTML={{
                        __html: renderKatex(
                          `\\begin{aligned}
                          I_{aniq} &\\approx \\int_{${format(result.a, 2)}}^{${format(result.b, 2)}} ${result.expressionTex} \\approx ${format(result.exactIntegral, 6)} \\\\
                          \\Delta &= |I - I_{aniq}| = \\mathbf{${result.errorScientific}}
                          \\end{aligned}`,
                        ),
                      }}
                    />
                  </div>
                </div>
              </PsPanel>

              {/* PLOT */}
              <PsPanel>
                <PsPanelHead eyebrow="Visual / Grafik" title="Funksiya va integrallash sohasi" idx="04" />
                <SimpsonPlot expression={expression} a={a} b={b} result={result} />
              </PsPanel>

              {/* TABLE */}
              <PsPanel>
                <PsPanelHead eyebrow={t('simpson.tbl_eyebrow')} title={t('simpson.tbl_title')} idx="05" />

                <div className="overflow-x-auto max-h-[360px] border border-line rounded-lg">
                  <table className="w-full font-mono text-xs text-left">
                    <thead className="sticky top-0 bg-panel border-b border-line text-muted uppercase tracking-wider text-[12.5px]">
                      <tr>
                        <th className="py-2.5 px-3">
                          <MathInline tex="i" />
                        </th>
                        <th className="py-2.5 px-3">
                          <MathInline tex="x_i" />
                        </th>
                        <th className="py-2.5 px-3">
                          <MathInline tex="y_i = f(x_i)" />
                        </th>
                        <th className="py-2.5 px-3">
                          <span className="mr-1">{t('simpson.tbl_coeff_label')}</span>
                          <MathInline tex="c_i" />
                        </th>
                        <th className="py-2.5 px-3">{t('simpson.tbl_type')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-bg-2">
                      {result.points.map((p) => {
                        const isEnd = p.type === 'end';
                        const isOdd = p.type === 'odd';

                        return (
                          <tr key={p.i} className="hover:bg-panel transition-colors">
                            <td className="py-2 px-3 font-bold text-muted">{p.i}</td>
                            <td className="py-2 px-3 text-ink">{format(p.x, 5)}</td>
                            <td className="py-2 px-3 font-semibold text-ink">{format(p.y, 6)}</td>
                            <td className="py-2 px-3 font-bold text-brand">{p.coeff}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-bold ${
                                  isEnd
                                    ? 'bg-brand-soft text-brand'
                                    : isOdd
                                      ? 'bg-cyan-soft text-cyan'
                                      : 'bg-line-2/20 text-muted'
                                }`}
                              >
                                <span>
                                  {isEnd
                                    ? t('simpson.type_end_label')
                                    : isOdd
                                      ? t('simpson.type_odd_label')
                                      : t('simpson.type_even_label')}
                                </span>
                                <MathInline
                                  tex={
                                    isEnd
                                      ? '(c = 1)'
                                      : isOdd
                                        ? '(c = 4)'
                                        : '(c = 2)'
                                  }
                                  className="font-normal opacity-90 text-[10px]"
                                />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </PsPanel>
            </>
          ) : (
            <PsPanel>
              <div className="text-center py-12 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-soft text-brand grid place-items-center">
                  <Sigma size={28} />
                </div>
                <h3 className="text-lg font-bold text-ink mb-1">{t('simpson.res_empty')}</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  {t('simpson.plot_empty')}
                </p>
              </div>
            </PsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimpsonMethod;
