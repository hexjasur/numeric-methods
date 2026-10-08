'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ArrowUpRight, Check, Info, Waves } from 'lucide-react';
import { calculateBisection, format, normalizeExpression, type Result } from '@/lib/bisection';
import { BisectionPlot as Plot } from '@/components/bisection/plot';

/* ──────────────────────────────────────────────────────────────
   BISECTION METHOD  ·  single-file component
   Dizayn: "Print Stream" — porcelain oq korpus, matte qora panellar,
   ingichka texnik chiziqlar, cyan + olov-to'q-sariq belgilar.
   Dark/Light: tizim rejimiga (prefers-color-scheme) moslashadi.
   Majburlash uchun: <html class="dark"> / <html class="light">
   yoki data-theme="dark" | "light".
   ────────────────────────────────────────────────────────────── */

/* ───────────────────────── KOMPONENT ───────────────────────── */
export function BisectionMethod() {
  const [expression, setExpression] = useState('x^3 + x - 1');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [epsilon, setEpsilon] = useState('0.01');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const formula = useMemo(() => {
    try {
      return katex.renderToString(
        `f(x) = ${normalizeExpression(expression)}`,
        { throwOnError: false },
      );
    } catch {
      return '';
    }
  }, [expression]);

  function calculate() {
    setError('');
    try {
      setResult(calculateBisection(expression, a, b, epsilon));
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : 'Formula yoki parametrlarni tekshiring.');
    }
  }

  const renderKatex = (value: string) => katex.renderToString(value, { throwOnError: false });
  const sign = (v: number) => (v < 0 ? 'bm-neg' : 'bm-pos');

  return (
    <div className="bm">
      <style>{CSS}</style>

      {/* ── serial strip ── */}
      <div className="bm-strip">
        <span>BSC-001</span>
        <i className="bm-barcode" aria-hidden />
        <span>ROOT · FINDER / MK-1</span>
      </div>

      {/* ── hero ── */}
      <section className="bm-hero">
        <div>
          <span className="bm-eyebrow">Numerical root finding / 001</span>
          <h1 className="bm-title">
            Biseksiya <em>usuli</em>
          </h1>
          <p className="bm-lead">
            Oraliqni teng ikkiga bo‘lib, tenglama ildizini kafolatli tarzda
            yaqinlashtiring.
          </p>
        </div>
        <div className="bm-cond">
          <span className="bm-cond-main">
            f(a) · f(b) <b>&lt;</b> 0
          </span>
          <small>Ildizni qamrab olish sharti</small>
        </div>
      </section>

      {/* ── method map ── */}
      <section className="bm-map">
        <div className="bm-map-head">
          <span className="bm-eyebrow">Method map</span>
          <strong>3 ta oddiy qadam</strong>
        </div>
        {[
          ['01', 'Qamrab oling', 'f(a) va f(b) ishoralarini tekshiring'],
          ['02', 'Markazni toping', 'c = (a + b) / 2 ni hisoblang'],
          ['03', 'Yarmini qoldiring', 'ildiz bor tomonni tanlang'],
        ].map(([n, t, s], i) => (
          <div className="bm-map-item" key={n}>
            {i > 0 && <i className="bm-map-sep" aria-hidden />}
            <span className="bm-map-n">{n}</span>
            <div>
              <b>{t}</b>
              <small>{s}</small>
            </div>
          </div>
        ))}
      </section>

      <div className="bm-grid-2">
        {/* ───────── INPUT ───────── */}
        <section className="bm-panel">
          <header className="bm-panel-head">
            <div>
              <span className="bm-eyebrow">Input / Parametrlar</span>
              <h2>Masalani sozlang</h2>
            </div>
            <span className="bm-idx">01</span>
          </header>

          <div className="bm-note bm-note-cyan">
            <Info size={18} />
            <p>
              <b>Funksiya</b> — ildizini topmoqchi bo‘lgan tenglama. Masalan:{' '}
              <code>x^3 + x - 1</code>
            </p>
          </div>

          <label className="bm-field">
            <span className="bm-label">
              f(x) funksiya <em>Math.js sintaksisi</em>
            </span>
            <div className="bm-fx">
              <b>f(x) =</b>
              <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="x^3 + x - 1"
                aria-label="Funksiya ifodasi"
                spellCheck={false}
              />
            </div>
          </label>

          <div className="bm-formula">
            {formula ? (
              <span dangerouslySetInnerHTML={{ __html: formula }} />
            ) : (
              <span className="bm-formula-err">
                Formula ko‘rinishi uchun ifodani tekshiring
              </span>
            )}
          </div>

          <div className="bm-two">
            <label className="bm-field">
              <span className="bm-label">
                a <em>boshi</em>
              </span>
              <input
                className="bm-input"
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
              />
            </label>
            <label className="bm-field">
              <span className="bm-label">
                b <em>oxiri</em>
              </span>
              <input
                className="bm-input"
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
              />
            </label>
          </div>

          <div className="bm-note bm-note-orange">
            <span className="bm-eps">ε</span>
            <p>
              <b>Aniqlik</b> — oraliq uzunligi shu qiymatdan kichik bo‘lganda
              to‘xtaymiz.
            </p>
          </div>

          <label className="bm-field">
            <span className="bm-label">
              Aniqlik <em>ε / epsilon</em>
            </span>
            <input
              className="bm-input"
              type="number"
              step="any"
              min="0.000001"
              value={epsilon}
              onChange={(e) => setEpsilon(e.target.value)}
            />
          </label>

          <button className="bm-btn" onClick={calculate}>
            Hisoblashni boshlash <ArrowUpRight size={20} />
          </button>

          <div className="bm-hint">
            <strong>Formula yozish namunasi</strong>
            <div>
              {['sin(x)', 'cos(x)', 'sqrt(x)', 'log(x)', 'x^2', 'e^x'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="bm-chip"
                  onClick={() => setExpression((v) => (v.trim() ? `${v} + ${t}` : t))}
                  title="Ifodaga qo‘shish"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── OUTPUT ───────── */}
        <section className="bm-col">
          <div className={`bm-panel bm-result ${result ? 'is-on' : ''}`}>
            <div>
              <span className="bm-eyebrow">Natija / Root</span>
              <strong className="bm-root-val">
                {result ? format(result.root, 8) : '—'}
              </strong>
              <small>{result ? 'taxminiy ildiz' : 'hisoblash kutilmoqda'}</small>
            </div>
            <div className="bm-iter">
              <span>Iteratsiyalar</span>
              <b>{result?.iterations ?? '—'}</b>
            </div>
          </div>

          <div className="bm-panel">
            <header className="bm-panel-head">
              <div>
                <span className="bm-eyebrow">Plot / f(x)</span>
                <h2>Grafikda ko‘ring</h2>
              </div>
              <span className="bm-idx">02</span>
            </header>
            <Plot expression={expression} a={a} b={b} result={result} />
            <ul className="bm-legend">
              <li><i className="lg-curve" />f(x)</li>
              <li><i className="lg-ab" />[a, b]</li>
              <li><i className="lg-cut" />c nuqtalar</li>
              <li><i className="lg-root" />ildiz</li>
            </ul>
          </div>

          {error && (
            <div className="bm-error" role="alert">
              <b>Hisoblashni davom ettirib bo‘lmaydi</b>
              <p>{error}</p>
            </div>
          )}

          <div className="bm-panel">
            <header className="bm-panel-head">
              <div>
                <span className="bm-eyebrow">Trace / Iterations</span>
                <h2>Har bir qaror ko‘rinadi</h2>
              </div>
              <span className="bm-idx">03</span>
            </header>

            {!result && !error && (
              <div className="bm-empty">
                <Waves size={52} />
                <p>
                  <b>Hali hisoblash yo‘q</b>
                  <br />
                  Chap tomondagi parametrlarni kiriting,
                  <br />
                  so‘ng tugmani bosing.
                </p>
              </div>
            )}

            {result?.steps.length === 0 && (
              <div className="bm-empty bm-empty-sm">
                <Check size={34} />
                <p>
                  <b>Ildiz oraliq chetida topildi.</b>
                  <br />
                  Qo‘shimcha iteratsiya kerak emas.
                </p>
              </div>
            )}

            {result?.steps.map((step) => (
              <article
                className={`bm-step ${step.done ? 'is-done' : ''}`}
                key={step.iteration}
              >
                <div className="bm-step-top">
                  <b>QADAM #{step.iteration}</b>
                  <span>{`|b − a| = ${format(step.width)} ${step.done ? '≤' : '>'} ε`}</span>
                </div>
                <div className="bm-calc">
                  <div>
                    a = {format(step.a)}{' '}
                    <b>
                      → f(a) = <i className={sign(step.fa)}>{format(step.fa)}</i>
                    </b>
                  </div>
                  <div>
                    b = {format(step.b)}{' '}
                    <b>
                      → f(b) = <i className={sign(step.fb)}>{format(step.fb)}</i>
                    </b>
                  </div>
                  <div className="bm-calc-mid">
                    <span>
                      Markaz:{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderKatex(
                            `c = \\frac{a + b}{2} = ${format(step.c)}`,
                          ),
                        }}
                      />
                    </span>
                    <span>
                      Qiymat: f(c) ={' '}
                      <i className={sign(step.fc)}>{format(step.fc, 8)}</i>
                    </span>
                  </div>
                </div>
                <p className="bm-why">
                  <b>{step.done ? 'Natija:' : 'Qaror:'}</b> {step.decision}
                  <br />
                  <span>{step.explanation}</span>
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="bm-foot">
        <span>Bisection · O(log₂((b−a)/ε)) qadam</span>
        <span>Xato ≤ (b − a) / 2ⁿ</span>
      </footer>
    </div>
  );
}

export default BisectionMethod;

/* ───────────────────────── STYLES ───────────────────────── */
const DARK_VARS = `
  --bg:#0a0b0d; --bg-2:#0f1114; --panel:#14161a; --panel-2:#1a1d22;
  --ink:#eef0f2; --ink-2:#c3c8cf; --muted:#8d949d;
  --line:#272b32; --line-2:#363b44;
  --cyan:#22d3ee; --cyan-soft:rgba(34,211,238,.1);
  --brand:#ff6a2b; --brand-ink:#0a0b0d; --brand-soft:rgba(255,106,43,.1);
  --pos:#34d399; --neg:#fb7185;
  --shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 20px 40px -24px rgba(0,0,0,.8);
  --stripe: repeating-linear-gradient(135deg, transparent 0 7px, rgba(255,255,255,.035) 7px 8px);
  --page-glow: radial-gradient(900px 400px at 85% -10%, rgba(34,211,238,.08), transparent 60%);
`;

const CSS = `
.bm{
  --bg:#eceef0; --bg-2:#f6f7f8; --panel:#fbfbfc; --panel-2:#f1f2f4;
  --ink:#0d0f12; --ink-2:#2a2e35; --muted:#5d646e;
  --line:#d5d9de; --line-2:#b9bfc7;
  --cyan:#0891b2; --cyan-soft:rgba(8,145,178,.09);
  --brand:#e8480c; --brand-ink:#ffffff; --brand-soft:rgba(232,72,12,.08);
  --pos:#0f9d6b; --neg:#d6293e;
  --shadow:0 1px 0 #fff inset, 0 1px 2px rgba(13,15,18,.06), 0 18px 36px -26px rgba(13,15,18,.35);
  --stripe: repeating-linear-gradient(135deg, transparent 0 7px, rgba(13,15,18,.04) 7px 8px);
  --page-glow: radial-gradient(900px 400px at 85% -10%, rgba(8,145,178,.10), transparent 60%);
  --mono: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
  --sans: ui-sans-serif, "Inter", "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;

  position:relative; color:var(--ink); font-family:var(--sans);
  max-width:1160px; margin:0 auto; padding:20px 16px 48px;
  background:var(--page-glow), var(--bg);
  border-radius:14px; font-size:15px; line-height:1.5;
}
:root.dark .bm, [data-theme="dark"] .bm { ${DARK_VARS} }
@media (prefers-color-scheme: dark){
  :root:not(.light):not([data-theme="light"]) .bm { ${DARK_VARS} }
}
.bm *{ box-sizing:border-box; }
.bm b,.bm strong{ font-weight:650; }
.bm code{ font-family:var(--mono); color:var(--brand); font-size:13px; }

/* strip */
.bm-strip{ display:flex; align-items:center; gap:14px; font:600 12px/1 var(--mono);
  letter-spacing:.14em; text-transform:uppercase; color:var(--muted);
  padding:10px 14px; border:1px solid var(--line); border-radius:8px;
  background:var(--panel); box-shadow:var(--shadow); }
.bm-barcode{ flex:1; height:14px; opacity:.55;
  background:repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 3px,var(--ink) 3px 5px,transparent 5px 6px,var(--ink) 6px 7px,transparent 7px 11px); }

/* hero */
.bm-hero{ display:flex; align-items:flex-end; justify-content:space-between; gap:32px; margin:34px 0 8px; }
.bm-eyebrow{ display:block; font:600 12px/1.2 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.bm-title{ margin:12px 0; font-size:clamp(44px,7vw,84px); font-weight:700; line-height:.94; letter-spacing:-.06em; }
.bm-title em{ font-style:normal; color:var(--cyan); position:relative; }
.bm-title em::after{ content:""; position:absolute; left:0; right:0; bottom:-.06em; height:.07em; background:var(--brand); }
.bm-lead{ margin:0; color:var(--muted); font-size:17px; max-width:520px; }
.bm-cond{ border:1px solid var(--line); background:var(--panel); border-radius:10px; padding:16px 20px;
  box-shadow:var(--shadow); position:relative; overflow:hidden; white-space:nowrap; }
.bm-cond::before{ content:""; position:absolute; inset:0; background:var(--stripe); pointer-events:none; }
.bm-cond-main{ position:relative; display:block; font:600 24px/1 var(--mono); color:var(--ink); }
.bm-cond-main b{ color:var(--brand); }
.bm-cond small{ position:relative; display:block; margin-top:10px; font:500 12px/1.2 var(--mono); color:var(--muted); letter-spacing:.04em; }

/* map */
.bm-map{ display:flex; align-items:stretch; gap:18px; margin:26px 0; padding:16px 18px;
  background:var(--panel); border:1px solid var(--line); border-radius:10px; box-shadow:var(--shadow); }
.bm-map-head{ display:grid; gap:6px; align-content:center; padding-right:18px; border-right:1px dashed var(--line-2); flex-shrink:0; }
.bm-map-head strong{ font-size:15px; }
.bm-map-item{ position:relative; flex:1; display:flex; gap:12px; align-items:flex-start; }
.bm-map-sep{ position:absolute; left:-12px; top:11px; width:8px; height:1px; background:var(--line-2); }
.bm-map-n{ font:700 14px/1 var(--mono); color:var(--brand); padding:5px 7px; border:1px solid var(--brand); border-radius:5px; background:var(--brand-soft); }
.bm-map-item b{ display:block; font-size:14px; }
.bm-map-item small{ display:block; margin-top:3px; font-size:13px; color:var(--muted); line-height:1.4; }

/* layout */
.bm-grid-2{ display:grid; grid-template-columns:minmax(300px,.82fr) minmax(0,1.4fr); gap:18px; align-items:start; }
.bm-col{ display:grid; gap:18px; min-width:0; }

/* panel – "open corner" */
.bm-panel{ position:relative; padding:24px; background:var(--panel); border:1px solid var(--line); border-radius:10px; box-shadow:var(--shadow); overflow:hidden; }
.bm-panel::before{ content:""; position:absolute; top:0; left:0; width:46px; height:46px;
  background:linear-gradient(135deg,var(--ink) 0 50%,transparent 50%); opacity:.92; border-top-left-radius:10px; }
.bm-panel::after{ content:""; position:absolute; right:0; bottom:0; width:120px; height:120px; background:var(--stripe); pointer-events:none;
  -webkit-mask:linear-gradient(315deg,#000,transparent 70%); mask:linear-gradient(315deg,#000,transparent 70%); }
.bm-panel-head{ position:relative; display:flex; justify-content:space-between; align-items:flex-start;
  margin:0 0 20px; padding:6px 0 16px 28px; border-bottom:1px solid var(--line); }
.bm-panel-head h2{ margin:8px 0 0; font-size:22px; font-weight:650; letter-spacing:-.035em; }
.bm-idx{ font:600 13px/1 var(--mono); color:var(--muted); }
.bm-panel > *{ position:relative; z-index:1; }

/* notes */
.bm-note{ display:flex; gap:10px; align-items:flex-start; padding:12px 14px; margin:0 0 16px;
  font-size:13.5px; line-height:1.5; color:var(--muted); border-left:3px solid var(--cyan); background:var(--cyan-soft); border-radius:0 6px 6px 0; }
.bm-note p{ margin:0; } .bm-note b{ color:var(--ink); }
.bm-note svg{ flex-shrink:0; color:var(--cyan); margin-top:1px; }
.bm-note-orange{ border-left-color:var(--brand); background:var(--brand-soft); margin-top:6px; }
.bm-eps{ font:700 18px/1 var(--mono); color:var(--brand); }

/* fields */
.bm-field{ display:block; margin:0 0 16px; }
.bm-label{ display:flex; justify-content:space-between; align-items:baseline; font-size:13.5px; font-weight:650; color:var(--ink); }
.bm-label em{ font:500 12px/1 var(--mono); font-style:normal; color:var(--muted); }
.bm-input,.bm-fx{ margin-top:8px; width:100%; border:1px solid var(--line-2); background:var(--bg-2); border-radius:8px; color:var(--ink);
  font:500 15px/1.2 var(--mono); outline:none; transition:border-color .15s, box-shadow .15s, background .15s; }
.bm-input{ padding:13px 14px; }
.bm-input:focus,.bm-fx:focus-within{ border-color:var(--brand); box-shadow:0 0 0 4px var(--brand-soft); background:var(--panel); }
.bm-fx{ display:flex; align-items:center; gap:10px; padding:0 14px; border-color:var(--brand); background:var(--brand-soft); }
.bm-fx b{ color:var(--brand); font-size:15px; white-space:nowrap; }
.bm-fx input{ flex:1; min-width:0; border:0; outline:0; background:transparent; color:var(--ink); padding:15px 0; font:600 16px/1.2 var(--mono); }
.bm-formula{ display:grid; place-items:center; min-height:56px; margin:-4px 0 18px; padding:10px; overflow-x:auto;
  background:var(--bg-2); border:1px dashed var(--line-2); border-radius:8px; color:var(--cyan); font-size:1.1em; }
.bm-formula-err{ font:500 13px var(--mono); color:var(--neg); }
.bm-two{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }

/* button */
.bm-btn{ display:flex; width:100%; align-items:center; justify-content:space-between; gap:12px; margin-top:6px; padding:16px 18px;
  font:650 15px var(--sans); letter-spacing:-.01em; cursor:pointer; color:var(--brand-ink); background:var(--ink); border:1px solid var(--ink);
  border-radius:8px; box-shadow:0 0 0 0 var(--brand); transition:transform .15s, box-shadow .2s, background .2s; }
.bm-btn:hover{ transform:translateY(-2px); background:var(--brand); border-color:var(--brand); color:#fff; box-shadow:0 10px 22px -10px var(--brand); }
.bm-btn:active{ transform:translateY(0); }
.bm-btn:focus-visible,.bm-chip:focus-visible{ outline:3px solid var(--cyan); outline-offset:2px; }
:root.dark .bm-btn, [data-theme="dark"] .bm-btn{ background:var(--ink); color:#0a0b0d; }

.bm-hint{ margin-top:22px; padding-top:16px; border-top:1px solid var(--line); }
.bm-hint strong{ display:block; margin-bottom:10px; font:600 12px var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
.bm-hint div{ display:flex; flex-wrap:wrap; gap:8px; }
.bm-chip{ cursor:pointer; padding:6px 10px; border:1px solid var(--line-2); background:var(--bg-2); color:var(--brand); border-radius:6px;
  font:600 13px var(--mono); transition:all .15s; }
.bm-chip:hover{ border-color:var(--brand); background:var(--brand-soft); transform:translateY(-1px); }

/* result */
.bm-result{ display:flex; align-items:center; justify-content:space-between; gap:20px; min-height:150px; transition:background .3s, border-color .3s; }
.bm-result.is-on{ background:linear-gradient(135deg,var(--brand-soft),var(--panel) 70%); border-color:var(--brand); animation:bm-pop .5s ease; }
.bm-result > div:first-child{ padding-left:20px; }
.bm-root-val{ display:block; margin:12px 0 4px; font:600 clamp(30px,4.4vw,48px)/1 var(--mono); letter-spacing:-.06em; color:var(--brand); word-break:break-all; }
.bm-result small{ font-size:13.5px; color:var(--muted); }
.bm-iter{ text-align:right; padding-left:24px; border-left:1px solid var(--line); }
.bm-iter span{ display:block; font-size:13px; color:var(--muted); }
.bm-iter b{ display:block; margin-top:6px; font:600 32px/1 var(--mono); }
@keyframes bm-pop{ 0%{ transform:scale(.985); } 100%{ transform:scale(1); } }

/* plot */
.bm-plot{ display:block; width:100%; height:auto; border:1px solid var(--line); border-radius:8px; background:var(--bg-2); }
.bm-plot-empty{ display:grid; place-items:center; min-height:160px; padding:20px; text-align:center; color:var(--muted); font:500 13.5px var(--mono);
  border:1px dashed var(--line-2); border-radius:8px; }
.bm-grid{ stroke:var(--line); stroke-width:1; }
.bm-tick{ fill:var(--muted); font:500 11.5px var(--mono); }
.bm-zero{ stroke:var(--ink-2); stroke-width:1.2; stroke-dasharray:5 4; opacity:.7; }
.bm-curve{ fill:none; stroke:var(--cyan); stroke-width:2.6; stroke-linejoin:round; stroke-linecap:round; }
.bm-band-ab{ fill:var(--cyan); opacity:.07; }
.bm-band-last{ fill:var(--brand); opacity:.22; }
.bm-cut{ stroke:var(--brand); stroke-width:1; stroke-dasharray:3 3; }
.bm-pt{ fill:var(--panel); stroke:var(--ink); stroke-width:2; }
.bm-root{ fill:var(--brand); }
.bm-root-ring{ fill:none; stroke:var(--brand); stroke-width:1.5; opacity:.5; }
.bm-legend{ display:flex; flex-wrap:wrap; gap:8px 18px; margin:14px 0 0; padding:0; list-style:none; font:500 12.5px var(--mono); color:var(--muted); }
.bm-legend li{ display:flex; align-items:center; gap:8px; }
.bm-legend i{ display:inline-block; width:18px; height:0; border-top:2px solid var(--cyan); }
.bm-legend .lg-ab{ height:10px; border:1px solid var(--cyan); background:var(--cyan-soft); }
.bm-legend .lg-cut{ border-top:2px dashed var(--brand); }
.bm-legend .lg-root{ width:10px; height:10px; border:0; border-radius:50%; background:var(--brand); }

/* error */
.bm-error{ padding:16px 18px; border:1px solid var(--neg); border-left-width:5px; border-radius:8px; background:color-mix(in srgb,var(--neg) 10%,transparent); }
.bm-error b{ font-size:14.5px; } .bm-error p{ margin:6px 0 0; font-size:14px; color:var(--ink-2); }

/* empty */
.bm-empty{ display:grid; place-content:center; min-height:280px; text-align:center; color:var(--muted); font-size:14.5px; line-height:1.8; }
.bm-empty svg{ margin:0 auto 10px; color:var(--cyan); }
.bm-empty b{ color:var(--ink); }
.bm-empty-sm{ min-height:120px; }

/* steps */
.bm-step{ padding:18px 0 18px 16px; border-bottom:1px solid var(--line); border-left:3px solid var(--line-2); margin-left:2px; }
.bm-step:last-child{ border-bottom:0; }
.bm-step.is-done{ border-left-color:var(--brand); background:linear-gradient(90deg,var(--brand-soft),transparent 55%); }
.bm-step-top{ display:flex; justify-content:space-between; gap:8px; font:500 13px var(--mono); color:var(--muted); }
.bm-step-top b{ color:var(--brand); letter-spacing:.06em; }
.bm-calc{ display:grid; gap:4px; margin:12px 0; padding:14px; background:var(--bg-2); border:1px dashed var(--line-2); border-radius:8px; font:500 14px/1.6 var(--mono); }
.bm-calc i{ font-style:normal; font-weight:600; }
.bm-pos{ color:var(--pos); } .bm-neg{ color:var(--neg); }
.bm-calc-mid{ display:grid; gap:6px; margin-top:8px; padding-top:10px; border-top:1px dashed var(--line-2); }
.bm-why{ margin:0; font-size:14px; line-height:1.6; color:var(--ink-2); }
.bm-why b{ color:var(--ink); }
.bm-why span{ font-size:13px; color:var(--muted); }

.bm .katex{ font-size:1.05em; }

/* footer */
.bm-foot{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-top:26px; padding-top:14px; border-top:1px solid var(--line);
  font:500 12.5px var(--mono); letter-spacing:.06em; color:var(--muted); }

/* responsive */
@media (max-width:900px){
  .bm-grid-2{ grid-template-columns:1fr; }
  .bm-map{ flex-wrap:wrap; }
  .bm-map-head{ flex-basis:100%; border-right:0; border-bottom:1px dashed var(--line-2); padding:0 0 12px; }
  .bm-map-sep{ display:none; }
}
@media (max-width:620px){
  .bm-hero{ display:block; } .bm-cond{ margin-top:20px; display:inline-block; }
  .bm-map{ display:grid; } .bm-step-top{ flex-direction:column; }
  .bm-result{ flex-wrap:wrap; } .bm-iter{ border-left:0; padding-left:20px; text-align:left; }
  .bm-panel{ padding:18px; }
}
@media (prefers-reduced-motion:reduce){ .bm *{ animation:none !important; transition:none !important; } }
`;