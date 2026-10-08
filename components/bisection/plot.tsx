'use client';

import { useMemo } from 'react';
import { compile, type Result } from '@/lib/bisection';

export function BisectionPlot({ expression, a, b, result }: { expression: string; a: string; b: string; result: Result | null }) {
  const data = useMemo(() => {
    const left = Number(a), right = Number(b);
    if (!Number.isFinite(left) || !Number.isFinite(right) || left >= right) return null;
    const f = compile(expression);
    if (!f) return null;
    const pad = (right - left) * 0.12, x0 = left - pad, x1 = right + pad;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 260; i++) {
      const x = x0 + ((x1 - x0) * i) / 260;
      let y = NaN;
      try { y = f(x); } catch { y = NaN; }
      pts.push({ x, y });
    }
    const ys = pts.map((p) => p.y).filter(Number.isFinite).sort((p, q) => p - q);
    if (ys.length < 2) return null;
    let y0 = Math.min(ys[Math.floor(ys.length * 0.02)], 0), y1 = Math.max(ys[Math.ceil(ys.length * 0.98) - 1], 0);
    if (y1 - y0 < 1e-9) { y0 -= 1; y1 += 1; }
    const ypad = (y1 - y0) * 0.12;
    return { pts, x0, x1, y0: y0 - ypad, y1: y1 + ypad, left, right };
  }, [expression, a, b]);

  if (!data) return <div className="bm-plot-empty">Grafik uchun to‘g‘ri funksiya va a &lt; b kiriting</div>;
  const W = 640, H = 280, P = { l: 46, r: 16, t: 16, b: 30 };
  const sx = (x: number) => P.l + ((x - data.x0) / (data.x1 - data.x0)) * (W - P.l - P.r);
  const sy = (y: number) => P.t + (1 - (y - data.y0) / (data.y1 - data.y0)) * (H - P.t - P.b);
  let d = '', pen = false;
  for (const p of data.pts) {
    if (!Number.isFinite(p.y) || p.y < data.y0 || p.y > data.y1) { pen = false; continue; }
    d += `${pen ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)} `; pen = true;
  }
  const zeroY = sy(0), last = result?.steps[result.steps.length - 1];
  const xt = Array.from({ length: 5 }, (_, i) => data.x0 + ((data.x1 - data.x0) * i) / 4);
  const yt = Array.from({ length: 5 }, (_, i) => data.y0 + ((data.y1 - data.y0) * i) / 4);
  const short = (v: number) => Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0) ? v.toExponential(1) : Number(v.toFixed(2)).toString();
  const pointY = (side: 'left' | 'right') => {
    const point = side === 'left' ? data.pts.find((p) => p.x >= data.left) : data.pts.slice().reverse().find((p) => p.x <= data.right);
    return Math.min(Math.max(sy(point?.y ?? 0), P.t), H - P.b);
  };

  return <svg className="bm-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="f(x) funksiya grafigi">
    {xt.map((v, i) => <g key={`x${i}`}><line className="bm-grid" x1={sx(v)} x2={sx(v)} y1={P.t} y2={H - P.b} /><text className="bm-tick" x={sx(v)} y={H - 10} textAnchor="middle">{short(v)}</text></g>)}
    {yt.map((v, i) => <g key={`y${i}`}><line className="bm-grid" x1={P.l} x2={W - P.r} y1={sy(v)} y2={sy(v)} /><text className="bm-tick" x={P.l - 8} y={sy(v) + 4} textAnchor="end">{short(v)}</text></g>)}
    <rect className="bm-band-ab" x={sx(data.left)} y={P.t} width={sx(data.right) - sx(data.left)} height={H - P.t - P.b} />
    {last && <rect className="bm-band-last" x={sx(Math.min(last.nextA, last.nextB))} y={P.t} width={Math.max(2, Math.abs(sx(last.nextB) - sx(last.nextA)))} height={H - P.t - P.b} />}
    {zeroY >= P.t && zeroY <= H - P.b && <line className="bm-zero" x1={P.l} x2={W - P.r} y1={zeroY} y2={zeroY} />}
    {result?.steps.map((s) => <line key={s.iteration} className="bm-cut" x1={sx(s.c)} x2={sx(s.c)} y1={P.t} y2={H - P.b} style={{ opacity: 0.25 + 0.5 * (s.iteration / result.steps.length) }} />)}
    <path className="bm-curve" d={d} /><circle className="bm-pt" cx={sx(data.left)} cy={pointY('left')} r={4} /><circle className="bm-pt" cx={sx(data.right)} cy={pointY('right')} r={4} />
    {result && zeroY >= P.t && zeroY <= H - P.b && <g><circle className="bm-root-ring" cx={sx(result.root)} cy={zeroY} r={11} /><circle className="bm-root" cx={sx(result.root)} cy={zeroY} r={5} /></g>}
  </svg>;
}
