'use client';

import type { FormEvent } from 'react';
import { Calculator, Info } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsNote } from '@/components/ui/print-stream';

export interface ODEInputs {
  expression: string;
  x0: string;
  xEnd: string;
  y0: string;
  h: string;
}

interface ODEParameterFormProps {
  inputs: ODEInputs;
  onChange: (key: keyof ODEInputs, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  calculateLabel: string;
  error?: string;
  expressionHint?: string;
  submitClassName?: string;
}

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(6)).toString();
};

export function ODEParameterForm({
  inputs,
  onChange,
  onSubmit,
  calculateLabel,
  error,
  expressionHint,
  submitClassName = 'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90 cursor-pointer',
}: ODEParameterFormProps) {
  const { t } = useI18n();
  const x0 = Number(inputs.x0);
  const xEnd = Number(inputs.xEnd);
  const h = Number(inputs.h);
  const stepCount =
    Number.isFinite(x0) && Number.isFinite(xEnd) && Number.isFinite(h) && h !== 0
      ? (xEnd - x0) / h
      : Number.NaN;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Differential equation f(x, y) */}
      <label className="block text-sm font-semibold text-ink">
        {t('odeForm.function')}
        <span className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 focus-within:ring-2 focus-within:ring-brand/20">
          <span className="whitespace-nowrap font-mono text-brand font-semibold">f(x, y) =</span>
          <input
            type="text"
            value={inputs.expression}
            onChange={(event) => onChange('expression', event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent py-3 font-mono font-normal text-ink outline-none"
            aria-label={t('odeForm.function')}
            placeholder="x - 2*y"
            spellCheck={false}
            required
          />
        </span>
        {expressionHint && (
          <span className="mt-1 block text-xs font-normal text-muted">{expressionHint}</span>
        )}
      </label>

      {/* Integration Interval / Kesma [x₀, x_end] */}
      <div className="rounded-xl border border-line-2/70 bg-panel-2/50 p-3 sm:p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 items-center justify-center rounded border border-brand/30 bg-brand-soft px-1.5 font-mono text-[10px] font-bold text-brand">
              [ a , b ]
            </span>
            <span className="text-xs font-semibold text-ink">
              {t('odeForm.interval_title')}
            </span>
          </div>
          <span className="rounded bg-bg px-2 py-0.5 font-mono text-xs font-semibold text-brand border border-line">
            [{formatNumber(x0)}, {formatNumber(xEnd)}]
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <label className="block min-w-0">
            <span className="flex items-center justify-between text-xs font-semibold text-ink">
              <span className="truncate">{t('odeForm.initial_x0')}</span>
              <span className="ml-1 shrink-0 font-mono text-[11px] font-bold text-brand">a</span>
            </span>
            <div className="mt-1 flex w-full items-center rounded-lg border border-line bg-bg px-2.5 sm:px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <span className="mr-1.5 shrink-0 font-mono text-xs font-bold text-brand">x₀ =</span>
              <input
                type="number"
                step="any"
                value={inputs.x0}
                onChange={(event) => onChange('x0', event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent font-mono text-sm text-ink outline-none"
                aria-label={t('odeForm.initial_x0')}
                required
              />
            </div>
          </label>

          <label className="block min-w-0">
            <span className="flex items-center justify-between text-xs font-semibold text-ink">
              <span className="truncate">{t('odeForm.final_xEnd')}</span>
              <span className="ml-1 shrink-0 font-mono text-[11px] font-bold text-brand">b</span>
            </span>
            <div className="mt-1 flex w-full items-center rounded-lg border border-line bg-bg px-2.5 sm:px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <span className="mr-1.5 shrink-0 font-mono text-xs font-bold text-brand">x_end =</span>
              <input
                type="number"
                step="any"
                value={inputs.xEnd}
                onChange={(event) => onChange('xEnd', event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent font-mono text-sm text-ink outline-none"
                aria-label={t('odeForm.final_xEnd')}
                required
              />
            </div>
          </label>
        </div>
      </div>

      {/* Initial condition y0 and Step size h */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className="block min-w-0">
          <span className="flex items-center justify-between text-xs font-semibold text-ink">
            <span className="truncate">{t('odeForm.initial_y0')}</span>
            <span className="ml-1 shrink-0 font-mono text-[11px] font-normal text-muted">y(x₀)</span>
          </span>
          <div className="mt-1 flex w-full items-center rounded-lg border border-line bg-bg px-2.5 sm:px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="mr-1.5 shrink-0 font-mono text-xs font-bold text-brand">y₀ =</span>
            <input
              type="number"
              step="any"
              value={inputs.y0}
              onChange={(event) => onChange('y0', event.target.value)}
              className="w-full min-w-0 border-0 bg-transparent font-mono text-sm text-ink outline-none"
              aria-label={t('odeForm.initial_y0')}
              required
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="flex items-center justify-between text-xs font-semibold text-ink">
            <span className="truncate">{t('odeForm.step_h')}</span>
            <span className="ml-1 shrink-0 font-mono text-[11px] font-normal text-muted">Δx</span>
          </span>
          <div className="mt-1 flex w-full items-center rounded-lg border border-line bg-bg px-2.5 sm:px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="mr-1.5 shrink-0 font-mono text-xs font-bold text-brand">h =</span>
            <input
              type="number"
              step="any"
              value={inputs.h}
              onChange={(event) => onChange('h', event.target.value)}
              className="w-full min-w-0 border-0 bg-transparent font-mono text-sm text-ink outline-none"
              aria-label={t('odeForm.step_h')}
              required
            />
          </div>
        </label>
      </div>

      <PsNote icon={<Info size={15} />} variant="cyan">
        <div className="w-full space-y-1 font-mono text-sm">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-sans text-xs font-semibold text-ink-2">
              {t('odeForm.interval_bounds')}
            </span>
            <span className="font-semibold text-brand">
              [{formatNumber(x0)}, {formatNumber(xEnd)}]
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-sans text-xs font-semibold text-ink-2">
              {t('odeForm.step_count')}
            </span>
            <span className="font-semibold text-brand">n = {formatNumber(stepCount)}</span>
          </div>
        </div>
      </PsNote>

      <button type="submit" className={submitClassName}>
        <Calculator size={17} aria-hidden="true" /> {calculateLabel}
      </button>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg"
        >
          {error}
        </p>
      )}
    </form>
  );
}
