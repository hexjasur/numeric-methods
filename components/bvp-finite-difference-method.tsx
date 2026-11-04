'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Activity, Calculator, Info } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { solveBvp, type BvpInput, type BvpResult } from '@/lib/bvp-finite-difference';

const INITIAL: BvpInput = {
  p: '0', q: '0', f: '0', a: '0', b: '1', intervals: '10',
  m0: '1', m1: '0', m2: '0', g0: '1', g1: '0', g2: '1',
};
const fmt = (value: number) => Number(value.toFixed(6)).toString();

function SolutionPlot({ result }: { result: BvpResult }) {
  const width = 720;
  const height = 240;
  const pad = 28;
  const ys = result.rows.map((row) => row.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const points = result.rows.map((row, index) => {
    const x = pad + (index / Math.max(result.rows.length - 1, 1)) * (width - 2 * pad);
    const y = height - pad - ((row.y - min) / span) * (height - 2 * pad);
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-line bg-bg-2 p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[520px] w-full" role="img" aria-label="Numerical solution plot">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" opacity=".25" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" opacity=".25" />
        <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {result.rows.map((row, index) => {
          const x = pad + (index / Math.max(result.rows.length - 1, 1)) * (width - 2 * pad);
          const y = height - pad - ((row.y - min) / span) * (height - 2 * pad);
          return <circle key={row.index} cx={x} cy={y} r="3" fill="var(--brand)" />;
        })}
        <text x={pad} y={height - 7} fontSize="11" fill="currentColor">x = {fmt(result.rows[0].x)}</text>
        <text x={width - pad} y={height - 7} textAnchor="end" fontSize="11" fill="currentColor">x = {fmt(result.rows[result.rows.length - 1].x)}</text>
        <text x={pad + 5} y={pad + 13} fontSize="11" fill="currentColor">y ∈ [{fmt(min)}, {fmt(max)}]</text>
      </svg>
    </div>
  );
}

export function BvpFiniteDifferenceMethod() {
  const { t } = useI18n();
  const [input, setInput] = useState(INITIAL);
  const [result, setResult] = useState<BvpResult | null>(null);
  const [error, setError] = useState('');
  const update = (key: keyof BvpInput, value: string) => {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
  };
  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setResult(solveBvp(input));
      setError('');
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : t('bvp.error'));
    }
  };
  const applyExample = () => {
    setInput((current) => ({ ...current, p: '-x', q: '2*x', f: '0.8' }));
    setResult(null);
    setError('');
  };
  const fields: Array<{ key: keyof BvpInput; label: string; step?: string }> = [
    { key: 'p', label: 'P(x)' }, { key: 'q', label: 'Q(x)' }, { key: 'f', label: 'f(x)' },
    { key: 'a', label: 'a', step: 'any' }, { key: 'b', label: 'b', step: 'any' }, { key: 'intervals', label: 'n', step: '1' },
    { key: 'm0', label: 'm₀' }, { key: 'm1', label: 'm₁' }, { key: 'm2', label: 'm₂' },
    { key: 'g0', label: 'g₀' }, { key: 'g1', label: 'g₁' }, { key: 'g2', label: 'g₂' },
  ];
  const nodes = result?.rows ?? [];
  const backwards = result?.backward ?? [];
  const tableHeaders = useMemo(() => ['k', 'xₖ', 'aₖ', 'bₖ', 'cₖ', 'dₖ', 'uₖ', 'vₖ', 'yₖ', 'rₖ'], []);
  return (
    <div className="relative mx-auto max-w-[1160px] px-0 pb-12 sm:px-2 md:px-4">
      <PsStrip eyebrow="ODE / FD" id="ODE" name={t('nav.bvp')} />
      <PsHero eyebrow={t('bvp.eyebrow')} title={t('bvp.title')} titleHighlight={t('bvp.title_highlight')} lead={t('bvp.lead')} conditionMain={<>y″ + P(x)y′ + Q(x)y = f(x)</>} conditionSub={t('bvp.boundaries')} />
      <PsMap eyebrow={t('bvp.map_eyebrow')} title={t('bvp.map_title')} steps={[
        { n: '01', t: t('bvp.map_1'), s: t('bvp.map_1_desc') },
        { n: '02', t: t('bvp.map_2'), s: t('bvp.map_2_desc') },
        { n: '03', t: t('bvp.map_3'), s: t('bvp.map_3_desc') },
      ]} />
      <div className="grid min-w-0 items-start gap-[18px] lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-[18px] lg:sticky lg:top-4">
          <PsPanel>
            <PsPanelHead eyebrow={t('bvp.input_eyebrow')} title={t('bvp.input_title')} idx="01" />
            <form onSubmit={calculate} className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted">{t('bvp.expression_hint')}</p>
                <button type="button" onClick={applyExample} className="inline-flex min-h-10 max-w-full items-center justify-center rounded-lg border border-brand/40 bg-brand-soft px-3 py-2 text-left text-xs font-semibold leading-snug text-brand transition-colors hover:bg-brand/15">
                  {t('bvp.example_button')}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {fields.map(({ key, label, step }) => (
                  <label key={key} className="min-w-0">
                    <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
                    <input type={['a', 'b', 'intervals'].includes(key) ? 'number' : 'text'} step={step ?? 'any'} min={key === 'intervals' ? 2 : undefined} max={key === 'intervals' ? 80 : undefined} value={input[key]} onChange={(event) => update(key, event.target.value)} required className="w-full rounded-lg border border-line bg-bg-2 px-2.5 py-2 font-mono text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft" />
                  </label>
                ))}
              </div>
              <div className="rounded-lg border border-line bg-bg-2 p-3 text-xs leading-relaxed text-muted">
                <strong className="text-ink">{t('bvp.left')}:</strong> m₀y(a) + m₁y′(a) = m₂<br />
                <strong className="text-ink">{t('bvp.right')}:</strong> g₀y(b) + g₁y′(b) = g₂
              </div>
              <button type="submit" className="flex min-h-12 w-full flex-wrap items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 text-center font-semibold leading-snug text-brand-ink transition-opacity hover:opacity-90"><Calculator size={17} className="shrink-0" /><span className="min-w-0">{t('bvp.calculate')}</span></button>
              {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
            </form>
          </PsPanel>
          <PsNote icon={<Info size={15} />} variant="cyan"><span className="text-sm">{t('bvp.note')}</span></PsNote>
        </aside>
        <div className="min-w-0 space-y-[18px]">
          <PsPanel>
            <PsPanelHead eyebrow={t('bvp.matrix_eyebrow')} title={t('bvp.matrix_title')} idx="02" />
            {!result ? <p className="py-8 text-center text-sm text-muted">{t('bvp.empty')}</p> : <>
              <p className="mb-3 text-xs text-muted">h = ({input.b} − {input.a}) / {input.intervals} = <strong className="text-brand">{fmt(result.h)}</strong></p>
              <div className="overflow-x-auto rounded-lg border border-line">
                <table className="w-full min-w-[700px] text-right font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr>{tableHeaders.map((head) => <th key={head} className="px-2 py-2">{head}</th>)}</tr></thead><tbody>{nodes.map((row) => <tr key={row.index} className="border-t border-line"><td className="px-2 py-2">{row.index}</td><td className="px-2 py-2">{fmt(row.x)}</td><td className="px-2 py-2">{fmt(row.a)}</td><td className="px-2 py-2">{fmt(row.b)}</td><td className="px-2 py-2">{fmt(row.c)}</td><td className="px-2 py-2">{fmt(row.d)}</td><td className="px-2 py-2">{fmt(row.u)}</td><td className="px-2 py-2">{fmt(row.v)}</td><td className="px-2 py-2 font-bold text-brand">{fmt(row.y)}</td><td className="px-2 py-2">{row.residual.toExponential(2)}</td></tr>)}</tbody></table>
              </div>
            </>}
          </PsPanel>
          {result && <>
            <PsPanel>
              <PsPanelHead eyebrow={t('bvp.backward_eyebrow')} title={t('bvp.backward_title')} idx="03" />
              <p className="mb-3 font-mono text-xs text-muted">yₖ = uₖ · yₖ₊₁ + vₖ, &nbsp; yₙ₊₁ = vₙ₊₁</p>
              <div className="space-y-1.5">{backwards.map((step) => <div key={step.index} className="rounded-md bg-bg-2 px-3 py-2 font-mono text-xs"><span className="text-muted">{step.nextY === null ? `y${step.index} = v${step.index}` : `y${step.index} = u${step.index} · ${fmt(step.nextY)} + v${step.index}`} = </span><strong className="text-brand">{fmt(step.y)}</strong></div>)}</div>
            </PsPanel>
            <PsPanel>
              <PsPanelHead eyebrow={t('bvp.result_eyebrow')} title={t('bvp.result_title')} idx="04" />
              <div className="mb-4 flex items-center gap-2 text-sm"><Activity size={17} className="text-brand" />{t('bvp.max_residual')}: <strong className="font-mono text-brand">{result.maxResidual.toExponential(3)}</strong></div>
              <SolutionPlot result={result} />
              <div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[280px] text-left font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2">xₖ</th><th className="px-3 py-2">yₖ</th></tr></thead><tbody>{nodes.map((row) => <tr key={row.index} className="border-t border-line"><td className="px-3 py-2">{fmt(row.x)}</td><td className="px-3 py-2 font-semibold text-brand">{fmt(row.y)}</td></tr>)}</tbody></table></div>
            </PsPanel>
          </>}
        </div>
      </div>
    </div>
  );
}
