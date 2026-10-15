'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Info, Waves } from 'lucide-react';
import { calculateIteration, formatIteration, type IterationResult } from '@/lib/iteration';
import { normalizeExpression } from '@/lib/math';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { ResultActions } from '@/components/ui/result-actions';

function Formula({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, displayMode: display }), [tex, display]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function IterationMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState('x^3 + x - 1');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [epsilon, setEpsilon] = useState('0.01');
  const [result, setResult] = useState<IterationResult | null>(null);
  const [error, setError] = useState('');
  const formula = useMemo(() => {
    try { return katex.renderToString(`f(x) = ${normalizeExpression(expression)}`, { throwOnError: false }); } catch { return ''; }
  }, [expression]);
  function calculate() {
    setError('');
    try { setResult(calculateIteration(expression, a, b, epsilon, t)); }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : t('iteration.err_calc')); }
  }
  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="ROOT / MK-5" id="ITERATION" name={t('nav.iteration')} />
      <PsHero eyebrow={t('iteration.hero_eyebrow')} title={t('iteration.hero_title')} titleHighlight={t('iteration.hero_highlight')} lead={t('iteration.hero_lead')} conditionMain={<Formula tex={String.raw`x_{k+1}=x_k-\frac{f(x_k)}{M}`} />} conditionSub={t('iteration.hero_condition')} />
      <PsMap title={t('iteration.map_title')} steps={[
        { n: '01', t: t('iteration.map_1_title'), s: t('iteration.map_1_desc') },
        { n: '02', t: t('iteration.map_2_title'), s: t('iteration.map_2_desc') },
        { n: '03', t: t('iteration.map_3_title'), s: t('iteration.map_3_desc') },
      ]} />
      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(300px,.82fr)_minmax(0,1.4fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('iteration.panel_input')} idx="01" />
          <PsNote icon={<Info size={18} />}><p><b>{t('iteration.note_fn_title')}</b> — {t('iteration.note_fn')} <code>x^3 + x - 1</code></p></PsNote>
          <label className="mb-4 block"><span className="flex justify-between text-[13.5px] font-[650] text-ink">{t('iteration.label_fn')} <em className="font-mono text-xs font-medium not-italic text-muted">Math.js</em></span><div className="mt-2 flex items-center gap-2.5 rounded-lg border border-brand bg-brand-soft px-3.5 focus-within:ring-4 focus-within:ring-brand-soft"><b className="whitespace-nowrap text-[15px] text-brand">f(x) =</b><input value={expression} onChange={(event) => setExpression(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent py-[15px] font-mono text-[16px] font-semibold text-ink outline-0" /></div></label>
          <div className="mb-[18px] grid min-h-[56px] place-items-center overflow-x-auto rounded-lg border border-dashed border-line-2 bg-bg-2 p-2.5 text-cyan">{formula && <span dangerouslySetInnerHTML={{ __html: formula }} />}</div>
          <div className="mb-4 grid grid-cols-2 gap-3"><label className="block"><span className="text-[13px] font-semibold text-ink">a <em className="font-mono text-xs font-normal text-muted">{t('iteration.label_a')}</em></span><input value={a} onChange={(event) => setA(event.target.value)} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] text-ink outline-none focus:border-brand" /></label><label className="block"><span className="text-[13px] font-semibold text-ink">b <em className="font-mono text-xs font-normal text-muted">{t('iteration.label_b')}</em></span><input value={b} onChange={(event) => setB(event.target.value)} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] text-ink outline-none focus:border-brand" /></label></div>
          <label className="mb-4 block"><span className="text-[13px] font-semibold text-ink">{t('iteration.label_eps')}</span><input type="number" step="any" value={epsilon} onChange={(event) => setEpsilon(event.target.value)} className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] text-ink outline-none focus:border-brand" /></label>
          <button onClick={calculate} className="flex w-full items-center justify-between gap-3 rounded-lg border border-ink bg-ink p-[16px_18px] text-[15px] font-[650] text-brand-ink transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white">{t('iteration.btn_calc')} <ArrowUpRight size={20} /></button>
        </PsPanel>
        <div className="grid min-w-0 gap-[18px]">
          {result ? <>
            <ResultActions summaryText={`${t('nav.iteration')}: f(x) = ${expression}, M = ${result.M}, x ≈ ${formatIteration(result.root)}`} csvData={result.steps.map((step) => ({ [t('iteration.step_title')]: step.iteration, x_k: formatIteration(step.previousX), f_xk: formatIteration(step.fx), x_next: formatIteration(step.nextX), residual: formatIteration(step.nextFx) }))} csvFileName="oddiy-iteratsiya-qadamlar.csv" imageFileName="oddiy-iteratsiya-hisobot.png" />
            <PsPanel><PsPanelHead eyebrow={t('iteration.result_eyebrow')} title={t('iteration.result_title')} idx="02" /><div className="rounded-lg border border-brand bg-brand-soft p-5"><span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">{t('iteration.result_root')}</span><strong className="mt-2 block overflow-x-auto font-mono text-4xl text-brand">{formatIteration(result.root, 10)}</strong><p className="mt-2 text-sm text-muted">{t('iteration.result_residual')}: <b className="font-mono text-ink">{formatIteration(result.residual, 8)}</b> · {result.steps.length} {t('iteration.result_steps')}</p></div></PsPanel>
            <PsPanel><PsPanelHead eyebrow={t('iteration.method_eyebrow')} title={t('iteration.method_title')} idx="03" /><div className="space-y-3"><section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand">01 · {t('iteration.step_condition')}</h3><div className="overflow-x-auto text-center"><Formula display tex={String.raw`|f'(${formatIteration(result.a)})|=${formatIteration(result.derivativeAtA)},\quad |f'(${formatIteration(result.b)})|=${formatIteration(result.derivativeAtB)}`} /></div><div className="mt-3 rounded-lg border border-dashed border-line-2 bg-panel p-3 text-center"><Formula display tex={String.raw`M=\lceil\max(${formatIteration(result.derivativeAtA)},${formatIteration(result.derivativeAtB)})\rceil+1=\mathbf{${result.M}}`} /></div></section><section className="rounded-lg border border-line bg-bg-2 p-4"><h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand">02 · {t('iteration.step_formula')}</h3><div className="overflow-x-auto rounded-lg border border-dashed border-line-2 bg-panel p-4 text-center"><Formula display tex={String.raw`x_{k+1}=x_k-\frac{f(x_k)}{${result.M}},\quad x_0=${formatIteration(result.b)}`} /></div></section></div></PsPanel>
            <PsPanel><PsPanelHead eyebrow={t('iteration.trace_eyebrow')} title={t('iteration.trace_title')} idx="04" /><div className="space-y-3">{result.steps.map((step) => <article key={step.iteration} className={`rounded-lg border-l-4 border border-line bg-bg-2 p-4 ${step.converged ? 'border-l-brand bg-brand-soft/40' : 'border-l-line-2'}`}><div className="flex flex-wrap justify-between gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand"><span>{t('iteration.step_title')} {step.iteration}</span><span>|f(x)| {step.converged ? '≤' : '>'} ε</span></div><div className="my-3 overflow-x-auto rounded-lg border border-dashed border-line-2 bg-panel p-3 text-center"><Formula display tex={String.raw`x_${step.iteration}=${formatIteration(step.previousX)}-\frac{${formatIteration(step.fx)}}{${result.M}}=${formatIteration(step.nextX)}`} /></div><div className="flex flex-wrap justify-between gap-2 font-mono text-sm text-muted"><span>{t('iteration.step_error')}: <b className="text-ink">|f(x_{step.iteration})| = {formatIteration(Math.abs(step.nextFx))}</b></span><b className={step.converged ? 'text-pos' : 'text-brand'}>{step.converged ? t('iteration.step_done') : t('iteration.step_continue')}</b></div></article>)}</div></PsPanel>
          </> : <PsPanel className="grid min-h-[420px] place-items-center text-center"><div className="max-w-sm text-muted"><Waves size={46} className="mx-auto mb-3 text-cyan" /><b className="text-ink">{t('iteration.empty_title')}</b><p className="mt-2 text-sm">{t('iteration.empty_desc')}</p></div></PsPanel>}
          {error && <div className="rounded-lg border border-neg/30 bg-neg/10 p-4 font-mono text-sm text-neg" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
}
