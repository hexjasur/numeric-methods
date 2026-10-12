'use client';

import { useMemo } from 'react';
import { math, normalizeExpression } from '@/lib/math';
import type { TrapezoidResult } from '@/lib/trapezoid';

function shortNumber(value: number): string {
  if (value === 0) return '0';
  const absolute = Math.abs(value);
  return absolute >= 10_000 || absolute < 0.001
    ? value.toExponential(1)
    : Number(value.toPrecision(4)).toString();
}

export function TrapezoidPlot({
  expression,
  a,
  b,
  result,
  emptyLabel,
}: {
  expression: string;
  a: string;
  b: string;
  result: TrapezoidResult | null;
  emptyLabel: string;
}) {
  const data = useMemo(() => {
    const left = Number(a);
    const right = Number(b);
    if (!Number.isFinite(left) || !Number.isFinite(right) || left >= right) return null;

    let evaluate: (x: number) => number;
    try {
      const code = math.compile(normalizeExpression(expression));
      evaluate = (x) => Number(code.evaluate({ x, dx: 1 }));
    } catch {
      return null;
    }

    const span = right - left;
    const padding = Math.max(span * 0.12, 0.15);
    const x0 = left - padding;
    const x1 = right + padding;
    const curve = Array.from({ length: 241 }, (_, index) => {
      const x = x0 + ((x1 - x0) * index) / 240;
      let y = Number.NaN;
      try {
        y = evaluate(x);
      } catch {
        // Leave discontinuities as gaps in the curve.
      }
      return { x, y };
    });

    const finiteValues = [
      ...curve.map((point) => point.y),
      ...(result?.points.map((point) => point.y) ?? []),
    ]
      .filter(Number.isFinite)
      .sort((first, second) => first - second);
    if (finiteValues.length < 2) return null;

    const low = Math.min(finiteValues[Math.floor(finiteValues.length * 0.02)], 0);
    const high = Math.max(finiteValues[Math.ceil(finiteValues.length * 0.98) - 1], 0);
    const extent = high - low || 1;
    return {
      curve,
      x0,
      x1,
      y0: low - extent * 0.14,
      y1: high + extent * 0.14,
      left,
      right,
    };
  }, [expression, a, b, result]);

  if (!data) {
    return (
      <div className="grid min-h-[190px] place-items-center rounded-lg border border-dashed border-line-2 p-5 text-center font-mono text-[13px] text-muted">
        {emptyLabel}
      </div>
    );
  }

  const width = 640;
  const height = 290;
  const pad = { left: 66, right: 20, top: 22, bottom: 36 };
  const scaleX = (x: number) =>
    pad.left + ((x - data.x0) / (data.x1 - data.x0)) * (width - pad.left - pad.right);
  const scaleY = (y: number) =>
    pad.top + (1 - (y - data.y0) / (data.y1 - data.y0)) * (height - pad.top - pad.bottom);
  const baseline = Math.min(Math.max(scaleY(0), pad.top), height - pad.bottom);

  let curvePath = '';
  let penDown = false;
  for (const point of data.curve) {
    if (!Number.isFinite(point.y) || point.y < data.y0 || point.y > data.y1) {
      penDown = false;
      continue;
    }
    curvePath += `${penDown ? 'L' : 'M'}${scaleX(point.x).toFixed(1)} ${scaleY(point.y).toFixed(1)} `;
    penDown = true;
  }

  const xTicks = Array.from({ length: 5 }, (_, index) => data.x0 + ((data.x1 - data.x0) * index) / 4);
  const yTicks = Array.from({ length: 5 }, (_, index) => data.y0 + ((data.y1 - data.y0) * index) / 4);
  const hasYAxis = data.x0 <= 0 && data.x1 >= 0;
  const hasZeroAxis = scaleY(0) >= pad.top && scaleY(0) <= height - pad.bottom;

  return (
    <svg
      className="block h-auto w-full rounded-lg border border-line bg-bg-2"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="f(x) grafigi va trapetsiya usuli bilan hisoblangan yuzalar"
    >
      {xTicks.map((tick, index) => (
        <line key={`x-grid-${index}`} className="stroke-line" x1={scaleX(tick)} x2={scaleX(tick)} y1={pad.top} y2={height - pad.bottom} />
      ))}
      {yTicks.map((tick, index) => (
        <line key={`y-grid-${index}`} className="stroke-line" x1={pad.left} x2={width - pad.right} y1={scaleY(tick)} y2={scaleY(tick)} />
      ))}

      <rect
        className="fill-cyan opacity-[0.04]"
        x={scaleX(data.left)}
        y={pad.top}
        width={scaleX(data.right) - scaleX(data.left)}
        height={height - pad.top - pad.bottom}
      />

      {result?.slices.map((slice) => {
        const top0 = Math.min(Math.max(slice.y0, data.y0), data.y1);
        const top1 = Math.min(Math.max(slice.y1, data.y0), data.y1);
        const points = [
          `${scaleX(slice.x0).toFixed(1)},${baseline.toFixed(1)}`,
          `${scaleX(slice.x0).toFixed(1)},${scaleY(top0).toFixed(1)}`,
          `${scaleX(slice.x1).toFixed(1)},${scaleY(top1).toFixed(1)}`,
          `${scaleX(slice.x1).toFixed(1)},${baseline.toFixed(1)}`,
        ].join(' ');
        return <polygon key={slice.index} className="fill-cyan/15 stroke-cyan/60 stroke-[1.2px]" points={points} />;
      })}

      {hasZeroAxis && (
        <line className="stroke-ink stroke-2" x1={pad.left} x2={width - pad.right} y1={scaleY(0)} y2={scaleY(0)} />
      )}
      {hasYAxis && (
        <line className="stroke-ink stroke-2" x1={scaleX(0)} x2={scaleX(0)} y1={pad.top} y2={height - pad.bottom} />
      )}

      <path className="fill-none stroke-cyan stroke-[2.6px] stroke-linejoin-round stroke-linecap-round" d={curvePath} />

      {result?.points.map((point) => (
        <g key={point.index}>
          <line
            className="stroke-line-2 stroke-1"
            strokeDasharray="3 3"
            x1={scaleX(point.x)}
            x2={scaleX(point.x)}
            y1={baseline}
            y2={scaleY(Math.min(Math.max(point.y, data.y0), data.y1))}
          />
          <circle
            className={point.index === 0 || point.index === result.n ? 'fill-brand stroke-panel stroke-2' : 'fill-cyan stroke-panel stroke-1.5'}
            cx={scaleX(point.x)}
            cy={scaleY(Math.min(Math.max(point.y, data.y0), data.y1))}
            r={point.index === 0 || point.index === result.n ? 4.5 : 3}
          />
        </g>
      ))}

      {xTicks.map((tick, index) => (
        <text key={`x-label-${index}`} className="fill-ink-2 font-mono text-xs font-semibold" x={scaleX(tick)} y={height - 12} textAnchor="middle">
          {shortNumber(tick)}
        </text>
      ))}
      {yTicks.map((tick, index) => (
        <text key={`y-label-${index}`} className="fill-ink-2 font-mono text-xs font-semibold" x={pad.left - 9} y={scaleY(tick) + 4} textAnchor="end">
          {shortNumber(tick)}
        </text>
      ))}
    </svg>
  );
}
