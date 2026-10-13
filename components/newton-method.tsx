'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Check, Info, Waves } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { ResultActions } from '@/components/ui/result-actions';
import {
  PsHero,
  PsMap,
  PsNote,
  PsPanel,
  PsPanelHead,
  PsStrip,
} from '@/components/ui/print-stream';
import { calculateNewton, formatNewton, type NewtonResult } from '@/lib/newton';
import { math, normalizeExpression } from '@/lib/math';

const examples = [
  { expression: 'x^3 + x - 1', a: '0', b: '1', epsilon: '0.000001', label: 'newton.example_1' },
  { expression: 'x^2 - 2', a: '1', b: '2', epsilon: '0.000001', label: 'newton.example_2' },
  { expression: 'exp(x) - 3*x', a: '0', b: '2', epsilon: '0.000001', label: 'newton.example_3' },
] as const;

function renderMath(value: string): string {
  return katex.renderToString(value, { throwOnError: false });
}

export function NewtonMethod() {
  const { t } = useI18n();
  const [expression, setExpression] = useState('x^3 + x - 1');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [epsilon, setEpsilon] = useState('0.000001');
  const [result, setResult] = useState<NewtonResult | null>(null);
  const [error, setError] = useState('');

  const formula = useMemo(() => {
    try {
      const node = math.parse(normalizeExpression(expression));
      return renderMath(`f(x) = ${node.toTex({ parenthesis: 'auto' })}`);
    } catch {
      return '';
    }
  }, [expression]);

  function calculate() {
    setError('');
    try {
      setResult(calculateNewton(expression, a, b, epsilon, t));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('newton.err_calc'));
    }
  }

  function applyExample(example: (typeof examples)[number]) {
    setExpression(example.expression);
    setA(example.a);
    setB(example.b);
    setEpsilon(example.epsilon);
    setResult(null);
    setError('');
  }

  const initialChoice = (value: NewtonResult) =>
    value.exactEndpoint
      ? t('newton.exact_endpoint', { endpoint: value.exactEndpoint })
      : t('newton.initial_choice', {
          endpoint: value.selectedEndpoint,
          value: formatNewton(value.selectionValue),
        });

  return (
    <div className="relative mx-auto max-w-[1160px] px-4 pb-12">
      <PsStrip eyebrow="NWT-001" id="ROOT" name={t('nav.newton')} />

      <PsHero
        eyebrow={t('newton.hero_eyebrow')}
        title={t('newton.hero_title')}
        titleHighlight={t('newton.hero_titleHighlight')}
        lead={t('newton.hero_lead')}
        conditionMain={<>xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)</>}
        conditionSub={t('newton.hero_condSub')}
      />

      <PsMap
        eyebrow="Method map"
        title={t('newton.map_title')}
        steps={[
          { n: '01', t: t('newton.map_1_t'), s: t('newton.map_1_s') },
          { n: '02', t: t('newton.map_2_t'), s: t('newton.map_2_s') },
          { n: '03', t: t('newton.map_3_t'), s: t('newton.map_3_s') },
        ]}
      />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(300px,.82fr)_minmax(0,1.4fr)]">
        <PsPanel>
          <PsPanelHead eyebrow="Input / Parametrlar" title={t('newton.panel_input')} idx="01" />

          <PsNote icon={<Info size={18} />}>
            <p><b>{t('newton.note_method_title')}</b> — {t('newton.note_method')}</p>
            <p className="mt-2">{t('newton.note_start')}</p>
            <p className="mt-2">{t('newton.note_derivative')}</p>
          </PsNote>

          <label className="mb-4 block">
            <span className="flex items-baseline justify-between text-[13.5px] font-[650] text-ink">
              {t('newton.label_fn')}
              <em className="font-mono text-xs font-medium not-italic text-muted">Math.js</em>
            </span>
            <div className="mt-2 flex w-full items-center gap-2.5 rounded-lg border border-brand bg-brand-soft px-3.5 transition-all focus-within:bg-panel focus-within:ring-4 focus-within:ring-brand-soft">
              <b className="whitespace-nowrap text-[15px] text-brand">f(x) =</b>
              <input
                value={expression}
                onChange={(event) => setExpression(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && calculate()}
                placeholder="x^3 + x - 1"
                aria-label={t('newton.label_fn')}
                spellCheck={false}
                className="min-w-0 flex-1 border-0 bg-transparent py-[15px] font-mono text-[16px] font-semibold text-ink outline-0"
              />
            </div>
          </label>

          <div className="mb-[18px] grid min-h-[56px] place-items-center overflow-x-auto rounded-lg border border-dashed border-line-2 bg-bg-2 p-2.5 text-[1.1em] text-cyan [&_.katex]:text-[1.05em]">
            {formula ? (
              <span dangerouslySetInnerHTML={{ __html: formula }} />
            ) : (
              <span className="font-mono text-[13px] font-medium text-neg">{t('errors.nwt_fn')}</span>
            )}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="flex items-baseline justify-between text-[13.5px] font-[650] text-ink">
                a <em className="font-mono text-xs font-medium not-italic text-muted">{t('newton.label_a')}</em>
              </span>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(event) => setA(event.target.value)}
                className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] font-medium text-ink outline-none transition-all focus:border-brand focus:bg-panel focus:ring-4 focus:ring-brand-soft"
              />
            </label>
            <label className="block">
              <span className="flex items-baseline justify-between text-[13.5px] font-[650] text-ink">
                b <em className="font-mono text-xs font-medium not-italic text-muted">{t('newton.label_b')}</em>
              </span>
              <input
                type="number"
                step="any"
                value={b}
                onChange={(event) => setB(event.target.value)}
                className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] font-medium text-ink outline-none transition-all focus:border-brand focus:bg-panel focus:ring-4 focus:ring-brand-soft"
              />
            </label>
          </div>

          <PsNote variant="orange" icon={<span className="font-mono text-lg font-bold leading-none">ε</span>}>
            <p><b>{t('newton.label_eps')}</b> — {t('newton.note_eps')}</p>
          </PsNote>

          <label className="mb-[16px] block">
            <span className="flex items-baseline justify-between text-[13.5px] font-[650] text-ink">
              {t('newton.label_eps')} <em className="font-mono text-xs font-medium not-italic text-muted">ε / epsilon</em>
            </span>
            <input
              type="number"
              min="0.0000000001"
              step="any"
              value={epsilon}
              onChange={(event) => setEpsilon(event.target.value)}
              className="mt-2 w-full rounded-lg border border-line-2 bg-bg-2 p-[13px_14px] font-mono text-[15px] font-medium text-ink outline-none transition-all focus:border-brand focus:bg-panel focus:ring-4 focus:ring-brand-soft"
            />
          </label>

          <button
            className="mt-1.5 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-ink bg-ink p-[16px_18px] font-sans text-[15px] font-[650] tracking-[-.01em] text-brand-ink transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_10px_22px_-10px_var(--brand)] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            onClick={calculate}
            type="button"
          >
            {t('newton.btn_calc')} <ArrowUpRight size={20} />
          </button>

          <div className="mt-[22px] border-t border-line pt-[16px]">
            <strong className="mb-2.5 block font-mono text-xs font-semibold uppercase tracking-[.1em] text-muted">{t('newton.examples_title')}</strong>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  className="cursor-pointer rounded-md border border-line-2 bg-bg-2 px-2.5 py-1.5 font-mono text-[12px] font-semibold text-brand transition-all hover:-translate-y-[1px] hover:border-brand hover:bg-brand-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  onClick={() => applyExample(example)}
                >
                  {t(example.label)}
                </button>
              ))}
            </div>
          </div>
        </PsPanel>

        <div className="grid min-w-0 gap-[18px]">
          {result && (
            <ResultActions
              summaryText={`Newton method: f(x) = ${expression}, [a, b] = [${a}, ${b}], ε = ${epsilon}; x ≈ ${formatNewton(result.root, 8)}, residual = ${formatNewton(result.residual, 8)} (${result.iterations} iterations)`}
              csvData={result.steps.map((step) => ({
                [t('newton.step_title')]: step.iteration,
                [t('newton.tbl_x')]: formatNewton(step.x),
                [t('newton.tbl_fx')]: formatNewton(step.fx),
                [t('newton.tbl_dfx')]: formatNewton(step.derivative),
                [t('newton.tbl_next')]: formatNewton(step.nextX),
                [t('newton.tbl_diff')]: formatNewton(step.delta),
              }))}
              csvFileName="newton-usuli-hisobot.csv"
              imageFileName="newton-usuli-hisobot.png"
            />
          )}

          <div className={`flex min-h-[130px] items-center justify-between gap-5 rounded-[10px] border p-6 shadow-[var(--shadow)] transition-all duration-300 ${result ? 'border-brand bg-[linear-gradient(135deg,var(--brand-soft),var(--panel)_70%)]' : 'border-line bg-panel'}`}>
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-xs font-semibold uppercase tracking-[.14em] text-muted">{t('newton.res_eyebrow')}</span>
              <strong className="my-2.5 block overflow-x-auto whitespace-nowrap font-mono text-[clamp(28px,3.8vw,44px)] leading-none tracking-[-.04em] text-brand [scrollbar-width:none]">
                {result ? formatNewton(result.root, 8) : t('newton.res_empty')}
              </strong>
              <small className="text-[13.5px] text-muted">{result ? t('newton.res_desc_done') : t('newton.res_desc_wait')}</small>
            </div>
            <div className="shrink-0 border-l border-line pl-6 text-right">
              <span className="block text-[13px] text-muted">{t('newton.res_iter')}</span>
              <b className="mt-1 block font-mono text-[36px] font-semibold leading-none text-ink">{result?.iterations ?? t('newton.res_empty')}</b>
            </div>
          </div>

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('newton.initial_title')} title={t('newton.initial_title')} idx="02" />
              <p className="text-[14px] leading-[1.7] text-ink-2">{initialChoice(result)}</p>
              {!result.exactEndpoint && (
                <div className="mt-3 grid gap-1 rounded-lg border border-dashed border-line-2 bg-bg-2 p-3.5 font-mono text-[13px]">
                  <span>{t('newton.initial_point')}: x₀ = {formatNewton(result.initialPoint)}</span>
                  <span>f(x₀) = {formatNewton(result.initialValue)}</span>
                  <span>f″(x₀) ≈ {formatNewton(result.initialSecondDerivative)}</span>
                </div>
              )}
            </PsPanel>
          )}

          {error && (
            <div className="rounded-lg border border-neg border-l-[5px] bg-[color-mix(in_srgb,var(--neg)_10%,transparent)] p-[16px_18px]" role="alert">
              <b className="text-[14.5px]">{t('newton.err_calc')}</b>
              <p className="mt-1.5 text-[14px] text-ink-2">{error}</p>
            </div>
          )}

          <PsPanel>
            <PsPanelHead eyebrow={t('newton.trace_title')} title={t('newton.trace_title')} idx="03" />
            {!result && !error && (
              <div className="grid min-h-[250px] place-content-center text-center text-[14.5px] leading-[1.8] text-muted">
                <Waves size={48} className="mx-auto mb-2.5 text-cyan" />
                <p><b className="text-ink">{t('newton.trace_empty_title')}</b><br />{t('newton.trace_empty_desc')}</p>
              </div>
            )}

            {result?.steps.length === 0 && (
              <div className="grid min-h-[130px] place-content-center text-center text-[14.5px] leading-[1.8] text-muted">
                <Check size={34} className="mx-auto mb-2.5 text-cyan" />
                <p><b className="text-ink">{t('newton.exact_title')}</b><br />{initialChoice(result)}</p>
              </div>
            )}

            {result?.steps.map((step) => (
              <article
                className={`ml-0.5 border-b border-l-[3px] border-line p-[18px_0_18px_16px] last:border-b-0 ${step.done ? 'border-l-brand bg-[linear-gradient(90deg,var(--brand-soft),transparent_55%)]' : 'border-l-line-2'}`}
                key={step.iteration}
              >
                <div className="flex justify-between gap-2 font-mono text-[13px] font-medium text-muted">
                  <b className="tracking-[.06em] text-brand">{t('newton.step_title')} #{step.iteration}</b>
                  <span>|Δx| {step.done ? '<' : '≥'} ε</span>
                </div>
                <div className="my-3 grid gap-2 rounded-lg border border-dashed border-line-2 bg-bg-2 p-3.5 font-mono text-[13px] leading-[1.7]">
                  <div>xₙ = {formatNewton(step.x)} <span className="text-muted">→</span> f(xₙ) = {formatNewton(step.fx)}</div>
                  <div className="text-muted" dangerouslySetInnerHTML={{ __html: renderMath(`f'(x_{${step.iteration - 1}}) \\approx ${formatNewton(step.derivative)}`) }} />
                  <div dangerouslySetInnerHTML={{ __html: renderMath(`x_{${step.iteration}} = ${formatNewton(step.x)} - \\frac{${formatNewton(step.fx)}}{${formatNewton(step.derivative)}} \\approx ${formatNewton(step.nextX)}`) }} />
                  <div className="border-t border-dashed border-line-2 pt-2" dangerouslySetInnerHTML={{ __html: renderMath(`|x_{${step.iteration}} - x_{${step.iteration - 1}}| = ${formatNewton(step.delta)} ${step.done ? '<' : '\\ge'} \\varepsilon`) }} />
                </div>
                <p className="m-0 text-[14px] leading-[1.6] text-ink-2">
                  <b className="text-ink">{step.done ? t('newton.step_done') : t('newton.step_continue')}</b>{' '}
                  {step.done ? t('newton.step_done_desc') : t('newton.step_continue_desc')}
                </p>
              </article>
            ))}
          </PsPanel>

          {result && (
            <PsPanel>
              <PsPanelHead eyebrow={t('newton.verify_title')} title={t('newton.verify_title')} idx="04" />
              <div className="grid gap-2 rounded-lg border border-dashed border-line-2 bg-bg-2 p-3.5 font-mono text-[14px]">
                <span>x ≈ {formatNewton(result.root, 8)}</span>
                <span>f(x) ≈ {formatNewton(result.residual, 10)}</span>
                <span>{t('newton.iteration_count')}: {result.iterations}</span>
              </div>
            </PsPanel>
          )}
        </div>
      </div>
    </div>
  );
}
