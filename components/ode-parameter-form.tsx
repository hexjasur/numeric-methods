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
  const stepCount = Number.isFinite(x0) && Number.isFinite(xEnd) && Number.isFinite(h) && h !== 0
    ? (xEnd - x0) / h
    : Number.NaN;

  const fields = [
    ['x0', t('odeForm.initial_x0')],
    ['xEnd', t('odeForm.final_xEnd')],
    ['y0', t('odeForm.initial_y0')],
    ['h', t('odeForm.step_h')],
  ] as const;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-semibold text-ink">
        {t('odeForm.function')}
        <span className="mt-1.5 flex w-full items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 focus-within:ring-2 focus-within:ring-brand/20">
          <span className="whitespace-nowrap font-mono text-brand">f(x, y) =</span>
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
        {expressionHint && <span className="mt-1 block text-xs font-normal text-muted">{expressionHint}</span>}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {fields.map(([key, label]) => (
          <label key={key} className="block text-sm font-semibold text-ink">
            {label}
            <input
              type="number"
              step="any"
              value={inputs[key]}
              onChange={(event) => onChange(key, event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 font-mono font-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              aria-label={label}
              required
            />
          </label>
        ))}
      </div>

      <PsNote icon={<Info size={15} />} variant="cyan">
        <div className="w-full space-y-1 font-mono text-sm">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-sans text-xs font-semibold text-ink-2">{t('odeForm.interval_bounds')}</span>
            <span className="font-semibold text-brand">[{formatNumber(x0)}, {formatNumber(xEnd)}]</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-sans text-xs font-semibold text-ink-2">{t('odeForm.step_count')}</span>
            <span className="font-semibold text-brand">n = {formatNumber(stepCount)}</span>
          </div>
        </div>
      </PsNote>

      <button type="submit" className={submitClassName}>
        <Calculator size={17} aria-hidden="true" /> {calculateLabel}
      </button>
      {error && (
        <p role="alert" className="rounded-lg border border-neg/30 bg-neg/10 px-3 py-2 text-sm text-neg">
          {error}
        </p>
      )}
    </form>
  );
}
