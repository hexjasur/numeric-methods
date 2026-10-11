'use client';

import { useMemo } from 'react';
import { compile, type SimpsonResult } from '@/lib/simpson';
import { useI18n } from '@/components/i18n-provider';

export function SimpsonPlot({
  expression,
  a,
  b,
  result,
}: {
  expression: string;
  a: string;
  b: string;
  result: SimpsonResult | null;
}) {
  const { t } = useI18n();

  const data = useMemo(() => {
    const left = Number(a);
    const right = Number(b);
    if (!Number.isFinite(left) || !Number.isFinite(right) || left >= right) return null;

    const f = compile(expression);
    if (!f) return null;

    const span = right - left;
    const pad = Math.max(span * 0.15, 0.5);
    const x0 = left - pad;
    const x1 = right + pad;

    const pts: { x: number; y: number }[] = [];
    const samples = 260;

    for (let i = 0; i <= samples; i++) {
      const x = x0 + ((x1 - x0) * i) / samples;
      let y = NaN;
      try {
        y = f(x);
      } catch {
        y = NaN;
      }
      pts.push({ x, y });
    }

    const validYs = pts.map((p) => p.y).filter(Number.isFinite).sort((p, q) => p - q);
    if (validYs.length < 2) return null;

    let y0 = Math.min(validYs[Math.floor(validYs.length * 0.02)], 0);
    let y1 = Math.max(validYs[Math.ceil(validYs.length * 0.98) - 1], 0);

    if (y1 - y0 < 1e-6) {
      y0 -= 1;
      y1 += 1;
    }

    const ypad = (y1 - y0) * 0.15;
    return {
      pts,
      x0,
      x1,
      y0: y0 - ypad,
      y1: y1 + ypad,
      left,
      right,
    };
  }, [expression, a, b]);

  if (!data) {
    return (
      <div className="grid place-items-center min-h-[160px] p-5 text-center text-muted font-mono text-[13.5px] font-medium border border-dashed border-line-2 rounded-lg">
        {t('simpson.plot_empty')}
      </div>
    );
  }

  const W = 640;
  const H = 280;
  const P = { l: 68, r: 16, t: 24, b: 34 };

  const sx = (x: number) => P.l + ((x - data.x0) / (data.x1 - data.x0)) * (W - P.l - P.r);
  const sy = (y: number) => P.t + (1 - (y - data.y0) / (data.y1 - data.y0)) * (H - P.t - P.b);

  // Build SVG path for f(x)
  let d = '';
  let pen = false;
  for (const p of data.pts) {
    if (!Number.isFinite(p.y) || p.y < data.y0 || p.y > data.y1) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)} `;
    pen = true;
  }

  // Build shaded area polygon under the curve between [a, b]
  let areaPath = '';
  const areaPoints = data.pts.filter(
    (p) => p.x >= data.left && p.x <= data.right && Number.isFinite(p.y),
  );
  const zeroY = sy(0);

  if (areaPoints.length > 0) {
    const firstX = sx(areaPoints[0].x);
    const lastX = sx(areaPoints[areaPoints.length - 1].x);
    const clampedZeroY = Math.min(Math.max(zeroY, P.t), H - P.b);

    areaPath = `M ${firstX.toFixed(1)} ${clampedZeroY.toFixed(1)} `;
    for (const p of areaPoints) {
      areaPath += `L ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)} `;
    }
    areaPath += `L ${lastX.toFixed(1)} ${clampedZeroY.toFixed(1)} Z`;
  }

  const zeroX = sx(0);
  const hasYAxis = data.x0 <= 0 && data.x1 >= 0;

  const xt = Array.from({ length: 5 }, (_, i) => data.x0 + ((data.x1 - data.x0) * i) / 4);
  const yt = Array.from({ length: 5 }, (_, i) => data.y0 + ((data.y1 - data.y0) * i) / 4);

  const short = (v: number) => {
    if (v === 0) return '0';
    const abs = Math.abs(v);
    return abs >= 10000 || abs < 0.001
      ? v.toExponential(1)
      : Number(v.toPrecision(4)).toString();
  };

  return (
    <svg
      className="block w-full h-auto border border-line rounded-lg bg-bg-2"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="f(x) funksiya va Simpson integrali grafigi"
    >
      {/* Grid lines */}
      {xt.map((v, i) => (
        <line
          key={`x${i}`}
          className="stroke-line stroke-1"
          x1={sx(v)}
          x2={sx(v)}
          y1={P.t}
          y2={H - P.b}
        />
      ))}
      {yt.map((v, i) => (
        <line
          key={`y${i}`}
          className="stroke-line stroke-1"
          x1={P.l}
          x2={W - P.r}
          y1={sy(v)}
          y2={sy(v)}
        />
      ))}

      {/* Shaded Integral Area */}
      {areaPath && (
        <path
          className="fill-cyan opacity-20"
          d={areaPath}
        />
      )}

      {/* Integration bounds background highlight */}
      <rect
        className="fill-cyan opacity-[0.04]"
        x={sx(data.left)}
        y={P.t}
        width={sx(data.right) - sx(data.left)}
        height={H - P.t - P.b}
      />

      {/* Zero X Axis */}
      {zeroY >= P.t && zeroY <= H - P.b && (
        <line
          stroke="var(--ink)"
          strokeWidth={2}
          x1={P.l}
          x2={W - P.r}
          y1={zeroY}
          y2={zeroY}
        />
      )}

      {/* Zero Y Axis */}
      {hasYAxis && (
        <line
          stroke="var(--ink)"
          strokeWidth={2}
          x1={zeroX}
          x2={zeroX}
          y1={P.t}
          y2={H - P.b}
        />
      )}

      {/* Function curve */}
      <path
        className="fill-none stroke-cyan stroke-[2.6px] stroke-linejoin-round stroke-linecap-round"
        d={d}
      />

      {/* Simpson partition vertical dashes and points */}
      {result?.points.map((pt) => {
        const px = sx(pt.x);
        const py = sy(pt.y);
        const isEnd = pt.type === 'end';
        const isOdd = pt.type === 'odd';

        return (
          <g key={pt.i}>
            <line
              className="stroke-line-2 stroke-1"
              strokeDasharray="2 3"
              x1={px}
              x2={px}
              y1={zeroY >= P.t && zeroY <= H - P.b ? zeroY : H - P.b}
              y2={py}
            />
            <circle
              cx={px}
              cy={py}
              r={isEnd ? 5 : 3.5}
              className={`${
                isEnd
                  ? 'fill-brand stroke-panel stroke-2'
                  : isOdd
                    ? 'fill-cyan stroke-panel stroke-1.5'
                    : 'fill-ink stroke-panel stroke-1.5'
              }`}
            />
          </g>
        );
      })}

      {/* Axis text values */}
      {xt.map((v, i) => (
        <text
          key={`xt${i}`}
          className="font-mono text-xs font-semibold fill-ink-2"
          x={sx(v)}
          y={H - 13}
          textAnchor="middle"
        >
          {short(v)}
        </text>
      ))}
      {yt.map((v, i) => (
        <text
          key={`yt${i}`}
          className="font-mono text-xs font-semibold fill-ink-2"
          x={P.l - 9}
          y={sy(v) + 4}
          textAnchor="end"
        >
          {short(v)}
        </text>
      ))}

      {zeroY >= P.t && zeroY <= H - P.b && (
        <text
          className="font-mono text-sm font-bold fill-ink"
          x={W - P.r + 5}
          y={zeroY - 8}
          textAnchor="end"
        >
          X
        </text>
      )}
      {hasYAxis && (
        <text
          className="font-mono text-sm font-bold fill-ink"
          x={zeroX + (zeroX > W / 2 ? -7 : 7)}
          y={P.t + 13}
          textAnchor={zeroX > W / 2 ? 'end' : 'start'}
        >
          Y
        </text>
      )}
    </svg>
  );
}

export default SimpsonPlot;
