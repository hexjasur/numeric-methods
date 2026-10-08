'use client';

import { useMemo, useState } from 'react';
import { all, create } from 'mathjs';
import katex from 'katex';
import { ArrowUpRight, Check, Info, Waves } from 'lucide-react';

const math = create(all, {});
type Step = { iteration: number; a: number; b: number; c: number; fa: number; fb: number; fc: number; width: number; done: boolean; interval: string; explanation: string; decision: string };
type Result = { root: number; iterations: number; steps: Step[] };
function normalizeExpression(expression: string) { const parts = expression.split('='); return parts.length === 2 ? `(${parts[0].trim()}) - (${parts[1].trim()})` : expression.trim(); }
function format(value: number, digits = 6) { return Number.isFinite(value) ? value.toFixed(digits) : '—'; }

export function BisectionMethod() {
  const [expression, setExpression] = useState('x^3 + x - 1');
  const [a, setA] = useState('0'); const [b, setB] = useState('1'); const [epsilon, setEpsilon] = useState('0.01');
  const [result, setResult] = useState<Result | null>(null); const [error, setError] = useState('');
  const formula = useMemo(() => { try { return katex.renderToString(`f(x) = ${math.parse(normalizeExpression(expression)).toTex({ parenthesis: 'keep', implicit: 'hide' })}`, { throwOnError: false }); } catch { return ''; } }, [expression]);
  const renderKatex = (value: string) => katex.renderToString(value, { throwOnError: false });

  function calculate() {
    setError(''); setResult(null);
    try {
      const left = Number(a), right = Number(b), tolerance = Number(epsilon);
      if (![left, right, tolerance].every(Number.isFinite) || tolerance <= 0 || left >= right) throw new Error('a < b bo‘lishi va aniqlik (ε) 0 dan katta bo‘lishi kerak.');
      const code = math.compile(normalizeExpression(expression)); const f = (x: number) => Number(code.evaluate({ x }));
      let low = left, high = right, fa = f(low), fb = f(high);
      if (!Number.isFinite(fa) || !Number.isFinite(fb)) throw new Error('Funksiya berilgan nuqtalarda aniqlanmagan.');
      if (fa === 0) return setResult({ root: low, iterations: 0, steps: [] });
      if (fb === 0) return setResult({ root: high, iterations: 0, steps: [] });
      if (fa * fb > 0) throw new Error(`f(a) va f(b) ishoralari bir xil: f(a) = ${format(fa, 4)}, f(b) = ${format(fb, 4)}. Ildizni qamrab olish uchun f(a) · f(b) < 0 bo‘lishi kerak.`);
      const steps: Step[] = [];
      for (let iteration = 1; iteration <= 100; iteration++) {
        const c = (low + high) / 2, fc = f(c), width = high - low, done = width <= tolerance || Math.abs(fc) < 1e-15, leftHasRoot = fa * fc < 0;
        const interval = leftHasRoot ? `[${format(low)}, ${format(c)}]` : `[${format(c)}, ${format(high)}]`;
        const explanation = done ? 'Oraliq uzunligi ε dan kichik — hisoblash to‘xtadi.' : leftHasRoot ? 'f(a) va f(c) ishoralari qarama-qarshi. Ildiz chap yarim oraliqda qoldi.' : 'f(c) va f(b) ishoralari qarama-qarshi. Ildiz o‘ng yarim oraliqda qoldi.';
        const decision = done ? `|b - a| = ${format(width)} ≤ ε — aniqlikka erishildi.` : leftHasRoot ? `f(a) · f(c) < 0 bo‘lgani uchun yangi oraliq [a, c] = ${interval}` : `f(c) · f(b) < 0 bo‘lgani uchun yangi oraliq [c, b] = ${interval}`;
        steps.push({ iteration, a: low, b: high, c, fa, fb, fc, width, done, interval, explanation, decision });
        if (done) return setResult({ root: c, iterations: iteration, steps });
        if (leftHasRoot) { high = c; fb = fc; } else { low = c; fa = fc; }
      }
      setResult({ root: (low + high) / 2, iterations: steps.length, steps });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Formula yoki parametrlarni tekshiring.'); }
  }

  const inputLabel = 'mb-4 block text-xs font-semibold text-ink';
  const inputClass = 'mt-2 w-full rounded-md border border-line bg-surface-soft px-3 py-3 font-mono text-[13px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15';
  return <div className="mx-auto max-w-[1130px]">
    <section className="flex items-end justify-between gap-8 max-[620px]:block"><div><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted">NUMERICAL ROOT FINDING / 001</span><h1 className="my-3 text-[clamp(40px,6vw,76px)] font-semibold leading-[.95] tracking-[-.075em]">Biseksiya <em className="text-cyan not-italic">usuli</em></h1><p className="text-[15px] text-muted">Oraliqni teng ikkiga bo‘lib, tenglama ildizini kafolatli tarzda yaqinlashtiring.</p></div><div className="rounded-[10px] border border-line bg-surface p-4 shadow-[var(--shadow)] max-[620px]:mt-5"><span className="block font-mono text-xl text-brand">f(a) · f(b) &lt; 0</span><small className="mt-2 block font-mono text-[10px] text-muted">1 / ildizni qamrab olish sharti</small></div></section>
    <section className="my-7 flex items-center gap-4 border border-line bg-surface p-4 shadow-[var(--shadow)] max-[900px]:flex-wrap max-[620px]:grid"><div className="grid shrink-0 gap-1.5 max-[900px]:basis-full"><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted">METHOD MAP</span><strong className="text-xs">3 ta oddiy qadam</strong></div><div className="flex flex-1 items-start gap-2.5"><span className="font-mono text-[11px] text-brand">01</span><div className="grid gap-1"><b className="text-[11px]">Qamrab oling</b><small className="text-[10px] leading-snug text-muted">f(a) va f(b) ishoralarini tekshiring</small></div></div><i className="h-px w-6 bg-line max-[620px]:hidden" /><div className="flex flex-1 items-start gap-2.5"><span className="font-mono text-[11px] text-brand">02</span><div className="grid gap-1"><b className="text-[11px]">Markazni toping</b><small className="text-[10px] leading-snug text-muted">c = (a + b) / 2 ni hisoblang</small></div></div><i className="h-px w-6 bg-line max-[620px]:hidden" /><div className="flex flex-1 items-start gap-2.5"><span className="font-mono text-[11px] text-brand">03</span><div className="grid gap-1"><b className="text-[11px]">Yarmini qoldiring</b><small className="text-[10px] leading-snug text-muted">ildiz bor tomonni tanlang</small></div></div></section>
    <div className="grid grid-cols-[minmax(280px,.82fr)_minmax(0,1.4fr)] items-start gap-[18px] max-[900px]:grid-cols-1">
      <section className="open-corner rounded-[10px] bg-surface p-6 shadow-sm">
        <div className="mb-7 flex items-start justify-between"><div><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted">INPUT / PARAMETRLAR</span><h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">Masalani sozlang</h2></div><span className="font-mono text-[11px] text-muted">01</span></div>
        <div className="mb-3 flex items-start gap-2 border-l-2 border-cyan bg-cyan/7 p-2.5 text-[10px] leading-snug text-muted"><Info size={16} className="shrink-0 text-cyan" /><p><b className="text-ink">Funksiya</b> — ildizini topmoqchi bo‘lgan tenglama. Masalan: <code className="font-mono text-brand">x^3 + x - 1</code></p></div>
        <label className={inputLabel}>f(x) funksiya <span className="float-right font-mono text-[10px] font-normal text-muted">Math.js sintaksisi</span><div className="mt-2 flex items-center gap-2 rounded-lg border border-brand bg-brand/8 px-3.5 shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_8%,transparent)] focus-within:ring-4 focus-within:ring-brand/15"><b className="whitespace-nowrap font-mono text-[13px] text-brand">f(x) =</b><input className="w-full bg-transparent py-3.5 font-mono text-sm font-semibold text-ink outline-none" value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="x^3 + x - 1" aria-label="Funksiya ifodasi" /></div></label>
        <div className="mb-5 grid min-h-12 place-items-center overflow-x-auto rounded-md bg-surface-soft p-2 text-brand">{formula ? <span dangerouslySetInnerHTML={{ __html: formula }} /> : <span className="font-mono text-[10px] text-danger">Formula ko‘rinishi uchun ifodani tekshiring</span>}</div>
        <div className="grid grid-cols-2 gap-2"><label className={inputLabel}><span>a <i className="ml-1.5 font-mono text-[10px] font-normal text-muted not-italic">boshi</i></span><input className={inputClass} type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label><label className={inputLabel}><span>b <i className="ml-1.5 font-mono text-[10px] font-normal text-muted not-italic">oxiri</i></span><input className={inputClass} type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label></div>
        <div className="mb-3 flex items-start gap-2 border-l-2 border-brand bg-brand/6 p-2.5 text-[10px] leading-snug text-muted"><span className="font-mono text-brand">ε</span><p><b className="text-ink">Aniqlik</b> — oraliq uzunligi shu qiymatdan kichik bo‘lganda to‘xtaymiz.</p></div>
        <label className={inputLabel}>Aniqlik <span className="float-right font-mono text-[10px] font-normal text-muted">ε / epsilon</span><input className={inputClass} type="number" step="any" min="0.000001" value={epsilon} onChange={(event) => setEpsilon(event.target.value)} /></label>
        <button className="mt-1 inline-flex w-full items-center justify-center gap-4 rounded-md bg-brand px-4 py-3.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110" onClick={calculate}>Hisoblashni boshlash <ArrowUpRight size={18} /></button>
        <div className="mt-6 border-t border-line pt-4"><strong className="mb-2 block text-[10px] text-muted">Formula yozish namunasi</strong><span className="font-mono text-[10px] leading-7 text-brand">sin(x) · cos(x) · sqrt(x) · log(x) · x^2</span></div>
      </section>
      <section className="grid min-w-0 gap-4">
        <div className={`open-corner flex min-h-[138px] items-center justify-between rounded-[10px] p-6 shadow-sm ${result ? 'bg-brand/10' : 'bg-surface'}`}><div><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted">NATIJA / ROOT</span><strong className="mt-3 block font-mono text-[clamp(28px,4vw,42px)] tracking-[-.08em] text-brand">{result ? format(result.root, 8) : '—'}</strong><small className="mt-1 block text-[10px] text-muted">{result ? 'taxminiy ildiz' : 'hisoblash kutilmoqda'}</small></div><div className="border-l border-line pl-6 text-right"><span className="block text-[10px] text-muted">Iteratsiyalar</span><b className="mt-2 block font-mono text-2xl">{result?.iterations ?? '—'}</b></div></div>
        {error && <div className="rounded-md border-l-4 border-danger bg-danger/10 p-4"><b className="text-xs">Hisoblashni davom ettirib bo‘lmaydi</b><p className="mt-1.5 text-[11px] leading-relaxed text-muted">{error}</p></div>}
        <div className="open-corner rounded-[10px] bg-surface p-6 shadow-sm"><div className="mb-0 flex items-start justify-between border-b border-line pb-[18px]"><div><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted">TRACE / ITERATIONS</span><h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">Har bir qaror ko‘rinadi</h2></div><span className="font-mono text-[11px] text-muted">02</span></div>
          {!result && !error && <div className="grid min-h-[300px] place-content-center text-center text-muted"><Waves size={48} className="mx-auto mb-2 text-brand" /><p className="text-xs leading-7"><b className="text-ink">Hali hisoblash yo‘q</b><br />Chap tomondagi parametrlarni kiriting,<br />so‘ng tugmani bosing.</p></div>}
          {result?.steps.length === 0 && <div className="grid min-h-[100px] place-content-center text-center text-xs leading-7 text-muted"><Check size={30} className="mx-auto text-cyan" /><p><b className="text-ink">Ildiz oraliq chetida topildi.</b><br />Qo‘shimcha iteratsiya kerak emas.</p></div>}
          {result?.steps.map((step) => <article className={`border-b border-line py-[18px] pl-4 ${step.done ? 'border-l-2 border-l-cyan' : 'border-l-2 border-l-line'}`} key={step.iteration}><div className="flex justify-between gap-2 font-mono text-[10px] text-muted max-[620px]:flex-col"><b className="text-brand">QADAM #{step.iteration}</b><span>{`Oraliq uzunligi |b - a| = ${format(step.width)} ${step.done ? '≤' : '>'} ε`}</span></div><div className="my-3 grid gap-0.5 border border-dashed border-line bg-surface-soft p-3 font-mono text-xs leading-relaxed"><div>a = {format(step.a)} <b>→ f(a) = <i className={step.fa < 0 ? 'text-danger not-italic' : 'text-emerald-500 not-italic'}>{format(step.fa)}</i></b></div><div>b = {format(step.b)} <b>→ f(b) = <i className={step.fb < 0 ? 'text-danger not-italic' : 'text-emerald-500 not-italic'}>{format(step.fb)}</i></b></div><div className="mt-1.5 grid gap-1 border-t border-dashed border-line pt-2"><span>Markaz: <span dangerouslySetInnerHTML={{ __html: renderKatex(`c = \\frac{a + b}{2} = ${format(step.c)}`) }} /></span><span>Qiymat: f(c) = <i className={step.fc < 0 ? 'text-danger not-italic' : 'text-emerald-500 not-italic'}>{format(step.fc, 8)}</i></span></div></div><p className="text-[11px] leading-relaxed text-muted"><b className="text-ink">{step.done ? 'Natija:' : 'Qaror:'}</b> {step.decision}<br /><span className="text-[10px]">{step.explanation}</span></p></article>)}
        </div></section>
    </div>
  </div>;
}
