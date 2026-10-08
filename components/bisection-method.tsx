"use client";

import { useMemo, useState } from "react";
import { all, create } from "mathjs";
import katex from "katex";

const math = create(all, {});
type Step = { iteration: number; a: number; b: number; c: number; fa: number; fb: number; fc: number; width: number; done: boolean };
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
    try { return katex.renderToString(`f(x) = ${math.parse(normalizeExpression(expression)).toTex({ parenthesis: "keep", implicit: "hide" })}`, { throwOnError: false }); }
    catch { return ""; }
  }, [expression]);

  function calculate() {
    setError(""); setResult(null);
    try {
      const left = Number(a), right = Number(b), tolerance = Number(epsilon);
      if (![left, right, tolerance].every(Number.isFinite) || tolerance <= 0 || left >= right) throw new Error("a < b bo‘lishi va aniqlik 0 dan katta bo‘lishi kerak.");
      const code = math.compile(normalizeExpression(expression));
      const f = (x: number) => Number(code.evaluate({ x }));
      let low = left, high = right, fa = f(low), fb = f(high);
      if (!Number.isFinite(fa) || !Number.isFinite(fb)) throw new Error("Funksiya berilgan nuqtalarda aniqlanmagan.");
      if (fa === 0) return setResult({ root: low, iterations: 0, steps: [] });
      if (fb === 0) return setResult({ root: high, iterations: 0, steps: [] });
      if (fa * fb > 0) throw new Error(`f(a) va f(b) ishoralari bir xil: f(a) = ${format(fa, 4)}, f(b) = ${format(fb, 4)}. Oraliqda ildiz bo‘lishi uchun ishoralar qarama-qarshi bo‘lishi kerak.`);
      const steps: Step[] = [];
      for (let iteration = 1; iteration <= 100; iteration++) {
        const c = (low + high) / 2, fc = f(c), width = high - low, done = width <= tolerance || Math.abs(fc) < 1e-15;
        steps.push({ iteration, a: low, b: high, c, fa, fb, fc, width, done });
        if (done) return setResult({ root: c, iterations: iteration, steps });
        if (fa * fc < 0) { high = c; fb = fc; } else { low = c; fa = fc; }
      }
      setResult({ root: (low + high) / 2, iterations: steps.length, steps });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Formula yoki parametrlarni tekshiring."); }
  }

  return <div className="method-layout">
    <section className="method-intro"><div><span className="eyebrow">NUMERICAL ROOT FINDING / 001</span><h1>Biseksiya <em>usuli</em></h1><p>Oraliqni teng ikkiga bo‘lib, tenglama ildiziga ishonchli yaqinlashish usuli.</p></div><div className="method-equation"><span>f(a) · f(b) &lt; 0</span><small>oraliq sharti</small></div></section>
    <section className="guide-strip"><div className="guide-icon">i</div><div><strong>Qanday ishlaydi?</strong><p>f(a) va f(b) qarama-qarshi ishorali bo‘lsa, o‘rta nuqta <code>c = (a + b) / 2</code> hisoblanadi va ildiz joylashgan yarim oraliq tanlanadi.</p></div><div className="guide-rule" /></section>
    <div className="calculator-grid">
      <section className="control-card"><div className="card-heading"><div><span className="eyebrow">INPUT / PARAMETRLAR</span><h2>Masalani sozlang</h2></div><span className="card-index">01</span></div>
        <label>f(x) funksiya <span>Math.js sintaksisi</span><input value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="x^3 + x - 1" /></label>
        <div className="formula-preview">{formula ? <span dangerouslySetInnerHTML={{ __html: formula }} /> : <span className="invalid-formula">Formula ko‘rinishi uchun ifodani tekshiring</span>}</div>
        <div className="field-row"><label>a <span>boshi</span><input type="number" step="any" value={a} onChange={(event) => setA(event.target.value)} /></label><label>b <span>oxiri</span><input type="number" step="any" value={b} onChange={(event) => setB(event.target.value)} /></label></div>
        <label>Aniqlik <span>ε / epsilon</span><input type="number" step="any" min="0.000001" value={epsilon} onChange={(event) => setEpsilon(event.target.value)} /></label>
        <button className="primary-button calculate-button" onClick={calculate}>Hisoblashni boshlash <span>↗</span></button>
        <div className="syntax-hint"><strong>Qabul qilinadi</strong><span>sin(x) · cos(x) · sqrt(x) · log(x) · x^2</span></div>
      </section>
      <section className="result-column"><div className={`result-card ${result ? "result-visible" : ""}`}><div><span className="eyebrow">NATIJA / ROOT</span><strong>{result ? format(result.root, 8) : "—"}</strong></div><div className="result-meta"><span>Iteratsiyalar</span><b>{result?.iterations ?? "—"}</b></div></div>
        {error && <div className="error-card"><b>Hisoblashni davom ettirib bo‘lmaydi</b><p>{error}</p></div>}
        <div className="steps-card"><div className="card-heading"><div><span className="eyebrow">TRACE / ITERATIONS</span><h2>Bosqichma-bosqich</h2></div><span className="card-index">02</span></div>{!result && !error && <div className="empty-state"><span>∿</span><p>Parametrlarni kiriting va hisoblashni boshlang.<br />Har bir qadam shu yerda ko‘rinadi.</p></div>}{result?.steps.length === 0 && <div className="empty-state compact"><span>✓</span><p>Ildiz oraliq chetida topildi.</p></div>}{result?.steps.map((step) => <article className={`step-item ${step.done ? "step-done" : ""}`} key={step.iteration}><div className="step-top"><b>QADAM {String(step.iteration).padStart(2, "0")}</b><span>{step.done ? "Aniqlikka erishildi ✓" : `|b − a| = ${format(step.width)}`}</span></div><div className="step-values"><span>a <b>{format(step.a)}</b></span><span>c <b>{format(step.c)}</b></span><span>b <b>{format(step.b)}</b></span></div><p>f(c) = <strong className={step.fc < 0 ? "negative" : "positive"}>{format(step.fc, 8)}</strong>{!step.done && <span> · Qarama-qarshi ishorali yarim oraliq tanlandi.</span>}</p></article>)}</div>
      </section>
    </div>
  </div>;
}
