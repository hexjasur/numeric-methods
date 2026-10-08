"use client";

import { useMemo, useState } from "react";
import { all, create } from "mathjs";
import katex from "katex";

const math = create(all, {});
type Step = { iteration: number; a: number; b: number; c: number; fa: number; fb: number; fc: number; width: number; done: boolean; interval: string; explanation: string; decision: string };
type Result = { root: number; iterations: number; steps: Step[] };

function normalizeExpression(expression: string) {
  const parts = expression.split("=");
  return parts.length === 2 ? `(${parts[0].trim()}) - (${parts[1].trim()})` : expression.trim();
}

function format(value: number, digits = 6) { return Number.isFinite(value) ? value.toFixed(digits) : "—"; }

export function BisectionMethod() {
  const [expression, setExpression] = useState("x^3 + x - 1");
  const [a, setA] = useState("0");
  const [b, setB] = useState("1");
  const [epsilon, setEpsilon] = useState("0.01");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const formula = useMemo(() => {
    try {
      return katex.renderToString(`f(x) = ${math.parse(normalizeExpression(expression)).toTex({ parenthesis: "keep", implicit: "hide" })}`, { throwOnError: false });
    } catch { return ""; }
  }, [expression]);

  function calculate() {
    setError("");
    setResult(null);
    try {
      const left = Number(a), right = Number(b), tolerance = Number(epsilon);
      if (![left, right, tolerance].every(Number.isFinite) || tolerance <= 0 || left >= right) {
        throw new Error("a < b bo‘lishi va aniqlik (ε) 0 dan katta bo‘lishi kerak.");
      }
      const code = math.compile(normalizeExpression(expression));
      const f = (x: number) => Number(code.evaluate({ x }));
      let low = left, high = right, fa = f(low), fb = f(high);
      if (!Number.isFinite(fa) || !Number.isFinite(fb)) throw new Error("Funksiya berilgan nuqtalarda aniqlanmagan.");
      if (fa === 0) return setResult({ root: low, iterations: 0, steps: [] });
      if (fb === 0) return setResult({ root: high, iterations: 0, steps: [] });
      if (fa * fb > 0) throw new Error(`f(a) va f(b) ishoralari bir xil: f(a) = ${format(fa, 4)}, f(b) = ${format(fb, 4)}. Ildizni qamrab olish uchun f(a) · f(b) < 0 bo‘lishi kerak.`);

      const steps: Step[] = [];
      for (let iteration = 1; iteration <= 100; iteration++) {
        const c = (low + high) / 2;
        const fc = f(c);
        const width = high - low;
        const done = width <= tolerance || Math.abs(fc) < 1e-15;
        const leftHasRoot = fa * fc < 0;
        const interval = leftHasRoot ? `[${format(low)}, ${format(c)}]` : `[${format(c)}, ${format(high)}]`;
        const explanation = done ? "Oraliq uzunligi ε dan kichik — hisoblash to‘xtadi." : leftHasRoot ? "f(a) va f(c) ishoralari qarama-qarshi. Ildiz chap yarim oraliqda qoldi." : "f(c) va f(b) ishoralari qarama-qarshi. Ildiz o‘ng yarim oraliqda qoldi.";
        const decision = done ? `|b - a| = ${format(width)} ≤ ε — aniqlikka erishildi.` : leftHasRoot ? `f(a) · f(c) < 0 bo‘lgani uchun yangi oraliq [a, c] = ${interval}` : `f(c) · f(b) < 0 bo‘lgani uchun yangi oraliq [c, b] = ${interval}`;
        steps.push({ iteration, a: low, b: high, c, fa, fb, fc, width, done, interval, explanation, decision });
        if (done) return setResult({ root: c, iterations: iteration, steps });
        if (leftHasRoot) { high = c; fb = fc; } else { low = c; fa = fc; }
      }
      setResult({ root: (low + high) / 2, iterations: steps.length, steps });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Formula yoki parametrlarni tekshiring.");
    }
  }

  return <div className="method-layout">
    <section className="method-intro">
      <div><span className="eyebrow">NUMERICAL ROOT FINDING / 001</span><h1>Biseksiya <em>usuli</em></h1><p>Oraliqni teng ikkiga bo‘lib, tenglama ildizini kafolatli tarzda yaqinlashtiring.</p></div>
      <div className="method-equation"><span>f(a) · f(b) &lt; 0</span><small>1 / ildizni qamrab olish sharti</small></div>
    </section>
    <section className="method-map" aria-label="Biseksiya usuli bosqichlari">
      <div className="map-title"><span className="eyebrow">METHOD MAP</span><strong>3 ta oddiy qadam</strong></div>
      <div className="map-step"><span>01</span><div><b>Qamrab oling</b><small>f(a) va f(b) ishoralarini tekshiring</small></div></div>
      <div className="map-line" /><div className="map-step"><span>02</span><div><b>Markazni toping</b><small>c = (a + b) / 2 ni hisoblang</small></div></div>
      <div className="map-line" /><div className="map-step"><span>03</span><div><b>Yarmini qoldiring</b><small>ildiz bor tomonni tanlang</small></div></div>
    </section>
    <div className="calculator-grid">
      <section className="control-card open-corner-card">
        <div className="card-heading"><div><span className="eyebrow">INPUT / PARAMETRLAR</span><h2>Masalani sozlang</h2></div><span className="card-index">01</span></div>
        <div className="field-explainer"><span className="field-bullet">ƒ</span><p><b>Funksiya</b> — ildizini topmoqchi bo‘lgan tenglama. Masalan: <code>x^3 + x - 1</code></p></div>
        <label>f(x) funksiya <span>Math.js sintaksisi</span><input value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="x^3 + x - 1" /></label>
        <div className="formula-preview">{formula ? <span dangerouslySetInnerHTML={{ __html: formula }} /> : <span className="invalid-formula">Formula ko‘rinishi uchun ifodani tekshiring</span>}</div>
        <div className="field-row"><label><span className="label-main">a <i>boshi</i></span><input type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label><label><span className="label-main">b <i>oxiri</i></span><input type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label></div>
        <div className="field-explainer slim"><span className="field-bullet">ε</span><p><b>Aniqlik</b> — oraliq uzunligi shu qiymatdan kichik bo‘lganda to‘xtaymiz.</p></div>
        <label>Aniqlik <span>ε / epsilon</span><input type="number" step="any" min="0.000001" value={epsilon} onChange={(event) => setEpsilon(event.target.value)} /></label>
        <button className="primary-button calculate-button" onClick={calculate}>Hisoblashni boshlash <span>↗</span></button>
        <div className="syntax-hint"><strong>Formula yozish namunasi</strong><span>sin(x) · cos(x) · sqrt(x) · log(x) · x^2</span></div>
      </section>
      <section className="result-column">
        <div className={`result-card open-corner-card ${result ? "result-visible" : ""}`}><div><span className="eyebrow">NATIJA / ROOT</span><strong>{result ? format(result.root, 8) : "—"}</strong><small>{result ? "taxminiy ildiz" : "hisoblash kutilmoqda"}</small></div><div className="result-meta"><span>Iteratsiyalar</span><b>{result?.iterations ?? "—"}</b></div></div>
        {error && <div className="error-card"><b>Hisoblashni davom ettirib bo‘lmaydi</b><p>{error}</p></div>}
        <div className="steps-card open-corner-card"><div className="card-heading"><div><span className="eyebrow">TRACE / ITERATIONS</span><h2>Har bir qaror ko‘rinadi</h2></div><span className="card-index">02</span></div>
          {!result && !error && <div className="empty-state"><span>⌁</span><p><b>Hali hisoblash yo‘q</b><br />Chap tomondagi parametrlarni kiriting,<br />so‘ng tugmani bosing.</p></div>}
          {result?.steps.length === 0 && <div className="empty-state compact"><span>✓</span><p><b>Ildiz oraliq chetida topildi.</b><br />Qo‘shimcha iteratsiya kerak emas.</p></div>}
          {result?.steps.map((step) => <article className={`step-item ${step.done ? "step-done" : ""}`} key={step.iteration}>
            <div className="step-top"><b>QADAM #{step.iteration}</b><span>{`Oraliq uzunligi |b - a| = ${format(step.width)} ${step.done ? "≤" : ">"} ε`}</span></div>
            <div className="step-formula"><div><span>a = {format(step.a)}</span><b> → f(a) = <i className={step.fa < 0 ? "negative" : "positive"}>{format(step.fa)}</i></b></div><div><span>b = {format(step.b)}</span><b> → f(b) = <i className={step.fb < 0 ? "negative" : "positive"}>{format(step.fb)}</i></b></div><div className="formula-center"><span>Markaz: c = (a + b) / 2 = <b>{format(step.c)}</b></span><span>Qiymat: f(c) = <i className={step.fc < 0 ? "negative" : "positive"}>{format(step.fc, 8)}</i></span></div></div>
            <p className="step-explanation"><b>{step.done ? "Natija:" : "Qaror:"}</b> {step.decision}<br /><span>{step.explanation}</span></p>
          </article>)}
        </div>
      </section>
    </div>
  </div>;
}
