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

  if (!data) return <div className="grid place-items-center min-h-[160px] p-5 text-center text-muted font-mono text-[13.5px] font-medium border border-dashed border-line-2 rounded-lg">Grafik uchun to&apos;g&apos;ri funksiya va a &lt; b kiriting</div>;
  const W = 640, H = 280, P = { l: 68, r: 16, t: 24, b: 34 };
  const sx = (x: number) => P.l + ((x - data.x0) / (data.x1 - data.x0)) * (W - P.l - P.r);
  const sy = (y: number) => P.t + (1 - (y - data.y0) / (data.y1 - data.y0)) * (H - P.t - P.b);
  let d = '', pen = false;
  for (const p of data.pts) {
    if (!Number.isFinite(p.y) || p.y < data.y0 || p.y > data.y1) { pen = false; continue; }
    d += `${pen ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)} `; pen = true;
  }
  const zeroY = sy(0), zeroX = sx(0), hasYAxis = data.x0 <= 0 && data.x1 >= 0;
  const last = result?.steps[result.steps.length - 1];
  const xt = Array.from({ length: 5 }, (_, i) => data.x0 + ((data.x1 - data.x0) * i) / 4);
  const yt = Array.from({ length: 5 }, (_, i) => data.y0 + ((data.y1 - data.y0) * i) / 4);
  const short = (v: number) => {
    if (v === 0) return '0';
    const abs = Math.abs(v);
    return abs >= 10000 || abs < 0.001
      ? v.toExponential(1)
      : Number(v.toPrecision(4)).toString();
  };
  const pointY = (side: 'left' | 'right') => {
    const point = side === 'left' ? data.pts.find((p) => p.x >= data.left) : data.pts.slice().reverse().find((p) => p.x <= data.right);
    return Math.min(Math.max(sy(point?.y ?? 0), P.t), H - P.b);
  };

  return <svg className="block w-full h-auto border border-line rounded-lg bg-bg-2" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="f(x) funksiya grafigi">
    {xt.map((v, i) => <line key={`x${i}`} className="stroke-line stroke-1" x1={sx(v)} x2={sx(v)} y1={P.t} y2={H - P.b} />)}
    {yt.map((v, i) => <line key={`y${i}`} className="stroke-line stroke-1" x1={P.l} x2={W - P.r} y1={sy(v)} y2={sy(v)} />)}
    <rect className="fill-cyan opacity-10" x={sx(data.left)} y={P.t} width={sx(data.right) - sx(data.left)} height={H - P.t - P.b} />
    {last && <rect className="fill-brand opacity-[0.22]" x={sx(Math.min(last.nextA, last.nextB))} y={P.t} width={Math.max(2, Math.abs(sx(last.nextB) - sx(last.nextA)))} height={H - P.t - P.b} />}
    {zeroY >= P.t && zeroY <= H - P.b && <line stroke="var(--ink)" strokeWidth={2.2} x1={P.l} x2={W - P.r} y1={zeroY} y2={zeroY} />}
    {hasYAxis && <line stroke="var(--ink)" strokeWidth={2.2} x1={zeroX} x2={zeroX} y1={P.t} y2={H - P.b} />}
    {result?.steps.map((s) => <line key={s.iteration} className="stroke-brand stroke-1" strokeDasharray="3 3" x1={sx(s.c)} x2={sx(s.c)} y1={P.t} y2={H - P.b} style={{ opacity: 0.25 + 0.5 * (s.iteration / result.steps.length) }} />)}
    <path className="fill-none stroke-cyan stroke-[2.6px] stroke-linejoin-round stroke-linecap-round" d={d} />
    <circle className="fill-panel stroke-ink stroke-2" cx={sx(data.left)} cy={pointY('left')} r={4} />
    <circle className="fill-panel stroke-ink stroke-2" cx={sx(data.right)} cy={pointY('right')} r={4} />
    {result && zeroY >= P.t && zeroY <= H - P.b && <g><circle className="fill-none stroke-brand stroke-[1.5px] opacity-50" cx={sx(result.root)} cy={zeroY} r={11} /><circle className="fill-brand" cx={sx(result.root)} cy={zeroY} r={5} /></g>}
    {xt.map((v, i) => <text key={`xt${i}`} className="font-mono text-xs font-semibold fill-ink-2" x={sx(v)} y={H - 13} textAnchor="middle">{short(v)}</text>)}
    {yt.map((v, i) => <text key={`yt${i}`} className="font-mono text-xs font-semibold fill-ink-2" x={P.l - 9} y={sy(v) + 4} textAnchor="end">{short(v)}</text>)}
    {zeroY >= P.t && zeroY <= H - P.b && <text className="font-mono text-sm font-bold fill-ink" x={W - P.r + 5} y={zeroY - 8} textAnchor="end">X</text>}
    {hasYAxis && <text className="font-mono text-sm font-bold fill-ink" x={zeroX + (zeroX > W / 2 ? -7 : 7)} y={P.t + 13} textAnchor={zeroX > W / 2 ? 'end' : 'start'}>Y</text>}
    {hasYAxis && zeroY >= P.t && zeroY <= H - P.b && <text className="font-mono font-semibold text-[10px] fill-ink" x={zeroX + 7} y={zeroY + (zeroY > H - P.b - 24 ? -8 : 17)}>O(0,0)</text>}
  </svg>;
}
