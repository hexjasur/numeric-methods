'use client';

import { useMemo, useState, type FormEvent } from 'react';
import katex from 'katex';
import { Calculator, Info } from 'lucide-react';
import { PsHero, PsMap, PsNote, PsPanel, PsPanelHead, PsStrip } from '@/components/ui/print-stream';
import { solveCollocation, texNumber, type CollocationInput, type CollocationResult } from '@/lib/collocation';

const INITIAL: CollocationInput = {
  a2: '1', a1: '0', a0: '-1', f: '2*x', a: '0', b: '1', alpha0: '1', alpha1: '0', alphaValue: '0', beta0: '1', beta1: '0', betaValue: '0', n: 3, points: ['1/4', '1/2', '3/4'],
};

function tex(value: string): string {
  return value.replaceAll('*', '\\,').replaceAll('~', '').replaceAll('u', 'u');
}

function MathDisplay({ value }: { value: string }) {
  const markup = useMemo(() => katex.renderToString(tex(value), { throwOnError: false, displayMode: true }), [value]);
  return <div className="w-full overflow-x-auto text-cyan [&_.katex-display]:!my-1 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full" dangerouslySetInnerHTML={{ __html: markup }} />;
}

function Chart({ result }: { result: CollocationResult }) {
  const width = 760;
  const height = 260;
  const pad = 32;
  const values = result.samples.map((sample) => sample.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = result.samples.map((sample, index) => {
    const x = pad + (index / (result.samples.length - 1)) * (width - 2 * pad);
    const y = height - pad - ((sample.value - min) / span) * (height - 2 * pad);
    return `${x},${y}`;
  }).join(' ');
  return <div className="overflow-x-auto rounded-lg border border-line bg-bg-2 p-2">
    <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[560px] w-full" role="img" aria-label="Taqribiy yechim grafigi">
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" opacity=".24" />
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" opacity=".24" />
      <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {result.input.points.map((point) => {
        const xValue = Number(point.includes('/') ? point.split('/')[0] : point) / Number(point.includes('/') ? point.split('/')[1] : 1);
        const index = Math.max(0, Math.min(40, Math.round(((xValue - Number(result.input.a)) / (Number(result.input.b) - Number(result.input.a))) * 40)));
        const [cx, cy] = points.split(' ')[index].split(',');
        return <circle key={point} cx={cx} cy={cy} r="4" fill="var(--brand)" />;
      })}
      <text x={pad} y={height - 8} fontSize="11" fill="currentColor">x = {result.input.a}</text>
      <text x={width - pad} y={height - 8} textAnchor="end" fontSize="11" fill="currentColor">x = {result.input.b}</text>
      <text x={pad + 6} y={pad + 14} fontSize="11" fill="currentColor">u~(x) ∈ [{values[0].toFixed(3)}, {values.at(-1)?.toFixed(3)}]</text>
    </svg>
  </div>;
}

export function CollocationMethod() {
  const [input, setInput] = useState(INITIAL);
  const [result, setResult] = useState<CollocationResult | null>(null);
  const [error, setError] = useState('');
  const update = (key: keyof CollocationInput, value: string | number | string[]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
  };
  const updatePoint = (index: number, value: string) => update('points', input.points.map((point, pointIndex) => pointIndex === index ? value : point));
  const distributePoints = () => {
    const a = Number(input.a);
    const b = Number(input.b);
    if (!Number.isFinite(a) || !Number.isFinite(b) || !(a < b)) return;
    update('points', Array.from({ length: input.n }, (_, index) => String(a + ((index + 1) * (b - a)) / (input.n + 1))));
  };
  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { setResult(solveCollocation(input)); setError(''); }
    catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Hisoblashda xatolik yuz berdi.'); }
  };
  const fields: Array<{ key: keyof CollocationInput; label: string }> = [
    { key: 'a2', label: 'A₂(x) · u″' }, { key: 'a1', label: 'A₁(x) · u′' }, { key: 'a0', label: 'A₀(x) · u' }, { key: 'f', label: 'f(x)' }, { key: 'a', label: 'a' }, { key: 'b', label: 'b' },
    { key: 'alpha0', label: 'α₀' }, { key: 'alpha1', label: 'α₁' }, { key: 'alphaValue', label: 'A' }, { key: 'beta0', label: 'β₀' }, { key: 'beta1', label: 'β₁' }, { key: 'betaValue', label: 'B' },
  ];
  return <div className="relative mx-auto max-w-[1200px] px-0 pb-12 sm:px-2 md:px-4">
    <PsStrip eyebrow="ODE / COLLOCATION" id="ODE" name="Kollokatsiya usuli" />
    <PsHero eyebrow="Ikkinchi tartibli ODT / Chegaraviy masala" title="Kollokatsiya" titleHighlight="usuli" lead="Chegaraviy masalani bazis funksiyalar va kollokatsiya nuqtalari orqali qadamma-qadam yeching." conditionMain={<>A₂(x)u″ + A₁(x)u′ + A₀(x)u = f(x)</>} conditionSub="Dirixle chegaralari: u(a)=A, u(b)=B" />
    <PsMap eyebrow="Usul xaritasi" title="6 bosqichli audit" steps={[{ n: '01', t: 'Bazislar', s: 'Chegaralarni qanoatlantiruvchi φᵢ(x) ni tanlash' }, { n: '02', t: 'Qoldiq', s: 'R(x,C) ni tuzish va guruhlash' }, { n: '03', t: 'Sistema', s: 'Nuqtalarda kollokatsiya va Gauss yechimi' }]} />
    <div className="grid min-w-0 items-start gap-[18px] lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-[18px] lg:sticky lg:top-4"><PsPanel><PsPanelHead eyebrow="Kiritish / Parametrlar" title="Masalani sozlang" idx="01" />
        <form onSubmit={calculate} className="space-y-4">
          <p className="text-xs leading-relaxed text-muted">Umumiy ko‘rinish: A₂(x)u″ + A₁(x)u′ + A₀(x)u = f(x). Math.js: <code>x^2</code>, <code>sin(x)</code>. Kasrlar uchun <code>1/4</code> yozing.</p>
          <div className="grid grid-cols-2 gap-2.5">{fields.map(({ key, label }) => <label key={key} className="min-w-0"><span className="mb-1 block text-xs font-semibold text-ink">{label}</span><input value={String(input[key])} onChange={(event) => update(key, event.target.value)} className="w-full rounded-lg border border-line bg-bg-2 px-2 py-2 font-mono text-sm text-ink outline-none focus:border-brand" /></label>)}</div>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-ink">n — bazislar soni (2–6)</span><select value={input.n} onChange={(event) => { const n = Number(event.target.value); update('n', n); update('points', Array.from({ length: n }, (_, index) => input.points[index] ?? String((index + 1) / (n + 1)))); }} className="w-full rounded-lg border border-line bg-bg-2 px-2 py-2 font-mono text-sm text-ink"><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option><option value={6}>6</option></select></label>
          <div className="rounded-lg border border-line bg-bg-2 p-3"><p className="mb-2 text-xs font-semibold text-ink">Kollokatsiya nuqtalari xᵢ ∈ (a,b)</p><div className="space-y-2">{input.points.map((point, index) => <input key={index} value={point} onChange={(event) => updatePoint(index, event.target.value)} aria-label={`${index + 1}-kollokatsiya nuqtasi`} className="w-full rounded-lg border border-line bg-panel px-2 py-2 font-mono text-sm text-ink outline-none focus:border-brand" />)}</div><button type="button" onClick={distributePoints} className="mt-3 w-full rounded-lg border border-brand/40 bg-brand-soft px-3 py-2 text-xs font-semibold text-brand">Avtomatik teng taqsimlash</button></div>
          <div className="rounded-lg border border-line bg-bg-2 p-3 text-xs leading-relaxed text-muted"><b className="text-ink">Chap:</b> α₀u(a)+α₁u′(a)=A<br /><b className="text-ink">O‘ng:</b> β₀u(b)+β₁u′(b)=B<br />Ushbu versiyada Dirixle holati uchun α₁=β₁=0.</div>
          <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-3 font-semibold text-brand-ink hover:opacity-90"><Calculator size={17} />Hisoblashni boshlash</button>
          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
        </form>
      </PsPanel><PsNote icon={<Info size={15} />}><span className="text-sm">Bazislar avtomatik ravishda u(a)=A va u(b)=B chegaralarini bajaradi. Har bir kasr ekranda taxminiy aniq kasr ko‘rinishida ham ko‘rsatiladi.</span></PsNote></aside>
      <div className="min-w-0 space-y-[18px]">{!result ? <PsPanel><PsPanelHead eyebrow="Natija / Kutish" title="Hali hisoblash bajarilmadi" idx="02" /><p className="py-10 text-center text-sm text-muted">Chapdagi parametrlarni kiriting va hisoblashni boshlang.</p></PsPanel> : <>
        <PsPanel><PsPanelHead eyebrow="Daftar / 6 bosqich" title="Qadamma-qadam yechim" idx="02" /><ol className="space-y-4">
          <li className="rounded-lg border border-line bg-bg-2 p-3"><h3 className="mb-2 text-sm font-semibold text-ink">1. Bazis funksiyalarni tanlash</h3><MathDisplay value={`\\varphi_0(x) = ${result.phi0}`} /><div className="space-y-2">{result.basis.map((item) => <MathDisplay key={item.index} value={`\\varphi_${item.index}(x) = ${item.expression}`} />)}</div></li>
          <li className="rounded-lg border border-line bg-bg-2 p-3"><h3 className="mb-2 text-sm font-semibold text-ink">2. Taqribiy yechim ko‘rinishi</h3><MathDisplay value={result.approximation} /></li>
          <li className="rounded-lg border border-line bg-bg-2 p-3"><h3 className="mb-2 text-sm font-semibold text-ink">3. Hosilalarni hisoblash</h3><MathDisplay value={result.derivative} /><MathDisplay value={result.secondDerivative} /></li>
          <li className="rounded-lg border border-line bg-bg-2 p-3"><h3 className="mb-2 text-sm font-semibold text-ink">4. Qoldiq funksiyasi</h3><MathDisplay value={result.residual} /><p className="mt-2 text-xs leading-relaxed text-muted">Qoldiq C₁, …, Cₙ bo‘yicha chiziqli ko‘rinishda guruhlangan.</p></li>
          <li className="rounded-lg border border-brand/30 bg-brand-soft/30 p-3"><h3 className="mb-3 text-sm font-semibold text-ink">5. Kollokatsiya nuqtalarida ChTS</h3><div className="space-y-3">{result.equations.map((equation, index) => <div key={equation.exactX} className="rounded-md border border-line bg-panel p-2"><p className="mb-1 text-xs font-mono text-muted">x_{index + 1} = {equation.exactX} ≈ {equation.x.toFixed(6)}</p><MathDisplay value={`${equation.coefficients.map((coefficient, coefficientIndex) => `${texNumber(coefficient)}C_${coefficientIndex + 1}`).join(' + ')} = ${texNumber(equation.rhs)}`} /><p className="overflow-x-auto font-mono text-xs text-muted">{equation.coefficients.map((coefficient, coefficientIndex) => `${coefficient.toFixed(8)}·C${coefficientIndex + 1}`).join(' + ')} = {equation.rhs.toFixed(8)}</p></div>)}</div><div className="mt-4 overflow-x-auto rounded-md bg-panel p-3"><MathDisplay value={`\\left\\{\\begin{aligned}${result.equations.map((equation) => `${equation.coefficients.map((coefficient, index) => `${texNumber(coefficient)}C_${index + 1}`).join(' + ')}&=${texNumber(equation.rhs)}`).join('\\\\')}\\end{aligned}\\right.`} /></div></li>
          <li className="rounded-lg border border-line bg-bg-2 p-3"><h3 className="mb-2 text-sm font-semibold text-ink">6. Gauss usuli va yakuniy yechim</h3><div className="mb-3 flex flex-wrap gap-2">{result.coefficients.map((coefficient, index) => <span key={index} className="rounded-md border border-brand/30 bg-brand/10 px-2 py-1 font-mono text-xs text-brand">C_{index + 1} = {texNumber(coefficient)} ≈ {coefficient.toFixed(8)}</span>)}</div><MathDisplay value={result.finalSolution} /></li>
        </ol></PsPanel>
        <PsPanel><PsPanelHead eyebrow="Grafik / u~(x)" title="Taqribiy yechim grafigi" idx="03" /><Chart result={result} /><div className="mt-4 overflow-x-auto rounded-lg border border-line"><table className="w-full min-w-[360px] text-left font-mono text-xs"><thead className="bg-bg-2 text-muted"><tr><th className="px-3 py-2">x</th><th className="px-3 py-2">u~(x)</th></tr></thead><tbody>{result.samples.filter((_, index) => index % 5 === 0 || index === result.samples.length - 1).map((sample) => <tr key={sample.x} className="border-t border-line"><td className="px-3 py-2">{sample.x.toFixed(6)}</td><td className="px-3 py-2 font-semibold text-brand">{sample.value.toFixed(8)}</td></tr>)}</tbody></table></div></PsPanel>
      </>}</div>
    </div>
  </div>;
}
