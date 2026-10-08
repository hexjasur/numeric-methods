'use client';

import { useMemo, useState } from 'react';
import katex from 'katex';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Calculator, Info } from 'lucide-react';
import { solveEulerMethods, type EulerResult } from '@/lib/euler';

const initialInputs = {
  expression: 'x - 2*y',
  x0: '-1',
  y0: '1',
  xEnd: '2',
  h: '0.6',
};

const formulaMarkup = {
  euler: katex.renderToString(
    String.raw`y_{i+1}=y_i+h\,f(x_i,y_i)`,
    { throwOnError: false, displayMode: true },
  ),
  improved: katex.renderToString(
    String.raw`\begin{aligned}\bar{y}_{i+1}&=y_i+h\,f(x_i,y_i)\\y_{i+1}&=y_i+\frac{h}{2}\Bigl[f(x_i,y_i)+f(x_{i+1},\bar{y}_{i+1})\Bigr]\end{aligned}`,
    { throwOnError: false, displayMode: true },
  ),
  exact: katex.renderToString(
    String.raw`\begin{aligned}y(x)&=\frac{x}{2}-\frac{1}{4}+C e^{-2(x-x_0)}\\C&=y_0-\frac{x_0}{2}+\frac{1}{4}\end{aligned}`,
    { throwOnError: false, displayMode: true },
  ),
  steps: katex.renderToString(
    String.raw`n=\left\lceil\frac{x_{\mathrm{end}}-x_0}{h}\right\rceil`,
    { throwOnError: false },
  ),
  difference: katex.renderToString(
    String.raw`\Delta y=\left|y_{\mathrm{takomil}}-y_{\mathrm{eyler}}\right|`,
    { throwOnError: false },
  ),
};

const tableHeadings = [
  [String.raw`i`, 'i'],
  [String.raw`x_i`, 'x_i'],
  [String.raw`y_i^{\text{Eyler}}`, 'y_i Eyler'],
  [String.raw`y_i^{\text{Takomil}}`, 'y_i Takomil'],
  [String.raw`y(x_i)^{\text{Aniq}}`, 'y(x_i) aniq'],
  [String.raw`\Delta y`, 'Δy'],
].map(([tex, label]) => ({
  label,
  html: katex.renderToString(tex, { throwOnError: false }),
}));

const numeric = (value: number | null) =>
  value === null || !Number.isFinite(value) ? '—' : value.toFixed(6);

function Formula({ html }: { html: string }) {
  return (
    <div
      className="w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain text-[clamp(.72rem,1.1vw,.9rem)] text-[var(--ink)] [&_.katex-display]:!my-0 [&_.katex-display]:!w-max [&_.katex-display]:!min-w-full [&_.katex]:!max-w-none [&_.katex]:!overflow-visible [&_.katex]:!px-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function MathInline({ html }: { html: string }) {
  return (
    <span
      className="[&_.katex]:!px-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function EulerMethod() {
  const [inputs, setInputs] = useState(initialInputs);
  const [calculationInputs, setCalculationInputs] = useState(initialInputs);
  const calculation = useMemo(() => {
    try {
      const result = solveEulerMethods(
        calculationInputs.expression,
        Number(calculationInputs.x0),
        Number(calculationInputs.y0),
        Number(calculationInputs.xEnd),
        Number(calculationInputs.h),
      );
      return { result, error: '' };
    } catch (cause) {
      return {
        result: null,
        error:
          cause instanceof Error
            ? cause.message
            : 'Parametrlarni tekshirib qayta urinib ko‘ring.',
      };
    }
  }, [calculationInputs]);

  const result = calculation.result;
  const rows = result?.rows ?? [];
  const intervalMarkup = useMemo(() => {
    const formatEndpoint = (value: string) => {
      if (!value.trim() || !Number.isFinite(Number(value))) return String.raw`\text{—}`;
      return Number(Number(value).toFixed(4)).toString();
    };
    return katex.renderToString(
      String.raw`\left[${formatEndpoint(inputs.x0)},\,${formatEndpoint(inputs.xEnd)}\right]`,
      { throwOnError: false },
    );
  }, [inputs.x0, inputs.xEnd]);
  const setValue = (key: keyof typeof initialInputs, value: string) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <div className="mx-auto max-w-[1160px] space-y-6 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
            Numerical ODE / 002
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">
            Eyler <span className="text-[var(--brand)]">usullari</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Oddiy va takomillashgan Eyler usullarini analitik yechim bilan
            taqqoslab, har bir qadamdagi farqni kuzating.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-2 font-mono text-xs text-[var(--muted)]">
          <Activity size={16} className="text-[var(--brand)]" />
          <span>ODE · INITIAL VALUE</span>
        </div>
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-2">
        <form
          className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setCalculationInputs({ ...inputs });
          }}
        >
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
                Input / Parametrlar
              </span>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Masalani sozlang
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--muted)]">01</span>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold">
              <span>f(x, y) funksiya</span>
              <span className="font-mono text-[11px] font-normal text-[var(--muted)]">
                Math.js sintaksisi
              </span>
            </span>
            <span className="flex items-center gap-3 rounded-lg border border-[var(--brand)]/60 bg-[var(--brand)]/5 px-3.5 transition focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[var(--brand)]/10">
              <b className="shrink-0 font-mono text-sm text-[var(--brand)]">
                f(x, y) =
              </b>
              <input
                value={inputs.expression}
                onChange={(event) => setValue('expression', event.target.value)}
                aria-label="f(x, y) funksiyasi"
                className="h-12 min-w-0 flex-1 bg-transparent font-mono text-sm font-semibold text-[var(--ink)] outline-none"
                placeholder="x - 2*y"
                spellCheck={false}
              />
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['x0', 'Boshlanish x₀'],
                ['y0', 'Boshlang‘ich y₀'],
                ['xEnd', 'Oxirgi x_end'],
                ['h', 'Qadam h'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block min-w-0">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--ink-2)]">
                  {label}
                </span>
                <input
                  type="number"
                  step="any"
                  value={inputs[key]}
                  onChange={(event) => setValue(key, event.target.value)}
                  aria-label={label}
                  className="h-11 w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-2)] px-3 font-mono text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:bg-[var(--panel)] focus:ring-4 focus:ring-[var(--brand)]/10"
                />
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Info size={15} className="shrink-0 text-[var(--cyan)]" />
              Boshlang‘ich oraliq
            </span>
            <span
              className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-sm text-[var(--brand)]"
              aria-label={`Interval: ${inputs.x0} dan ${inputs.xEnd} gacha`}
            >
              <MathInline html={intervalMarkup} />
            </span>
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
          >
            <Calculator size={17} />
            Hisoblash
          </button>

          {calculation.error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]"
            >
              {calculation.error}
            </div>
          )}
        </form>

        <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted)]">
                Method / Formulalar
              </span>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Hisoblash usullari
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--muted)]">02</span>
          </div>
          <div className="grid min-w-0 gap-3">
            <article className="min-w-0 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
                Oddiy Eyler
              </span>
              <div className="mt-3 min-h-10">
                <Formula html={formulaMarkup.euler} />
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Hosila joriy nuqtada baholanadi.
              </p>
            </article>
            <article className="min-w-0 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
                Takomillashgan · Heun
              </span>
              <div className="mt-3 min-h-10">
                <Formula html={formulaMarkup.improved} />
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Pretsenzor bashorati va korrektor aniqlashtirishi.
              </p>
            </article>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.25fr)] xl:items-stretch">
        <section className="grid grid-cols-1 gap-4">
          <article className="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
              Aniq yechim
            </span>
            <div className="mt-4 min-h-12">
              <Formula html={formulaMarkup.exact} />
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              C = y₀ − x₀/2 + 1/4; standart boshlang‘ich qiymatlarda C = 7/4.
            </p>
          </article>
          <article className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
              Qadamlar soni
            </span>
            <strong className="mt-3 block font-mono text-3xl text-[var(--brand)]">
              {result ? result.steps : '—'}
            </strong>
            <p className="mt-2 min-w-0 overflow-hidden text-xs text-[var(--muted)]">
              <MathInline html={formulaMarkup.steps} />
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              {result
                ? `${numeric(Number(calculationInputs.xEnd) - Number(calculationInputs.x0))} oraliq, oxirgi qadam chegaraga moslanadi.`
                : 'Parametrlarni tekshiring.'}
            </p>
          </article>
        </section>

        <section className="flex min-h-[500px] flex-col rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5 xl:min-h-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Yechimlar grafigi</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Nuqtalar ustiga olib borib qiymatlarni solishtiring.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-2 text-[#ef4444]">
                <i className="h-0.5 w-5 border-t-2 border-dashed border-current" />
                Oddiy Eyler
              </span>
              <span className="inline-flex items-center gap-2 text-[#3b82f6]">
                <i className="h-0.5 w-5 bg-current" />
                Takomillashgan
              </span>
              {result?.hasExactSolution && (
                <span className="inline-flex items-center gap-2 text-[#22a06b]">
                  <i className="h-0.5 w-5 border-t-2 border-dotted border-current" />
                  Aniq yechim
                </span>
              )}
            </div>
          </div>
          <div className="min-h-[380px] w-full flex-1">
            {result && <EulerChart result={result} />}
          </div>
          {!result?.hasExactSolution && result && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Aniq yechim faqat f(x, y) = x − 2y tenglamasi uchun mavjud.
            </p>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] p-5">
          <div>
            <h2 className="text-lg font-semibold">Qadamlar jadvali</h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
              <span>ȳ — pretsenzor bashorati</span>
              <MathInline html={formulaMarkup.difference} />
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--muted)]">
            {rows.length ? `${rows.length} ta nuqta` : 'Natija yo‘q'}
          </span>
        </div>
        <div className="max-h-[460px] overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-right font-mono text-xs">
            <thead className="sticky top-0 z-10 bg-[var(--bg-2)] text-[var(--muted)]">
              <tr>
                {tableHeadings.map(({ label, html }) => (
                  <th className="border-b border-[var(--line)] px-4 py-3 font-semibold" key={label}>
                    <MathInline html={html} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b border-[var(--line)]/70 last:border-0" key={row.step}>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.step}</td>
                  <td className="px-4 py-3">{numeric(row.x)}</td>
                  <td className="px-4 py-3 text-[#ef4444]">{numeric(row.yEuler)}</td>
                  <td className="px-4 py-3 text-[#3b82f6]">{numeric(row.yImproved)}</td>
                  <td className="px-4 py-3 text-[#22a06b]">{numeric(row.yExact)}</td>
                  <td className="px-4 py-3">{numeric(row.difference)}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={6}>
                    Hisoblash uchun parametrlarni kiriting.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function EulerChart({ result }: { result: EulerResult }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <LineChart data={result.rows} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 5" />
        <XAxis
          dataKey="x"
          type="number"
          domain={['dataMin', 'dataMax']}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          tickLine={{ stroke: 'var(--line-2)' }}
          axisLine={{ stroke: 'var(--line-2)' }}
          tickFormatter={(value: number) => Number(value).toFixed(2)}
          label={{ value: 'x', position: 'insideBottomRight', offset: -2, fill: 'var(--muted)' }}
        />
        <YAxis
          width={54}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          tickLine={{ stroke: 'var(--line-2)' }}
          axisLine={{ stroke: 'var(--line-2)' }}
          tickFormatter={(value: number) => Number(value).toFixed(2)}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            color: 'var(--ink)',
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--muted)', marginBottom: 4 }}
          labelFormatter={(value) => `x = ${Number(value).toFixed(6)}`}
          formatter={(value, name) => [
            Number(value).toFixed(8),
            name === 'yEuler'
              ? 'Oddiy Eyler'
              : name === 'yImproved'
                ? 'Takomillashgan Eyler'
                : 'Aniq yechim',
          ]}
        />
        <Legend
          formatter={(value) =>
            value === 'yEuler'
              ? 'Oddiy Eyler'
              : value === 'yImproved'
                ? 'Takomillashgan Eyler'
                : 'Aniq yechim'
          }
        />
        <Line
          name="yEuler"
          type="linear"
          dataKey="yEuler"
          stroke="#ef4444"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={{ r: 3, fill: '#ef4444' }}
          activeDot={{ r: 6 }}
        />
        <Line
          name="yImproved"
          type="linear"
          dataKey="yImproved"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#3b82f6' }}
          activeDot={{ r: 6 }}
        />
        {result.hasExactSolution && (
          <Line
            name="yExact"
            type="monotone"
            dataKey="yExact"
            stroke="#22a06b"
            strokeWidth={1.75}
            strokeDasharray="2 4"
            dot={{ r: 2, fill: '#22a06b' }}
            activeDot={{ r: 5 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
