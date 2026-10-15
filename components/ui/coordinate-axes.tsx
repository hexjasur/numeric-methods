import { formatAxisTick, getAxisTicks } from '@/lib/plot';

type PlotBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type CoordinateAxesProps = {
  width: number;
  height: number;
  bounds: PlotBounds;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  scaleX: (value: number) => number;
  scaleY: (value: number) => number;
};

export function CoordinateAxes({
  width,
  height,
  bounds,
  xMin,
  xMax,
  yMin,
  yMax,
  scaleX,
  scaleY,
}: CoordinateAxesProps) {
  const xTicks = getAxisTicks(xMin, xMax);
  const yTicks = getAxisTicks(yMin, yMax);
  const hasXAxis = yMin <= 0 && yMax >= 0;
  const hasYAxis = xMin <= 0 && xMax >= 0;
  const zeroX = scaleX(0);
  const zeroY = scaleY(0);
  const originLabelX = zeroX > width * 0.75 ? zeroX - 7 : zeroX + 7;
  const originLabelAnchor = zeroX > width * 0.75 ? 'end' : 'start';
  const originLabelY = zeroY < bounds.top + 22 ? zeroY + 17 : zeroY - 8;

  return (
    <g aria-hidden="true">
      {xTicks
        .filter((tick) => Math.abs(tick) > Number.EPSILON)
        .map((tick, index) => (
          <line
            key={`x-grid-${index}`}
            className="stroke-line stroke-1"
            x1={scaleX(tick)}
            x2={scaleX(tick)}
            y1={bounds.top}
            y2={height - bounds.bottom}
          />
        ))}
      {yTicks
        .filter((tick) => Math.abs(tick) > Number.EPSILON)
        .map((tick, index) => (
          <line
            key={`y-grid-${index}`}
            className="stroke-line stroke-1"
            x1={bounds.left}
            x2={width - bounds.right}
            y1={scaleY(tick)}
            y2={scaleY(tick)}
          />
        ))}

      {hasXAxis && (
        <line
          stroke="var(--ink)"
          strokeWidth={2}
          x1={bounds.left}
          x2={width - bounds.right}
          y1={zeroY}
          y2={zeroY}
        />
      )}
      {hasYAxis && (
        <line
          stroke="var(--ink)"
          strokeWidth={2}
          x1={zeroX}
          x2={zeroX}
          y1={bounds.top}
          y2={height - bounds.bottom}
        />
      )}

      {xTicks
        .filter((tick) => Math.abs(tick) > Number.EPSILON)
        .map((tick, index) => (
          <text
            key={`x-label-${index}`}
            className="fill-ink-2 font-mono text-[16px] font-semibold"
            x={scaleX(tick)}
            y={height - 12}
            textAnchor="middle"
          >
            {formatAxisTick(tick)}
          </text>
        ))}
      {yTicks
        .filter((tick) => Math.abs(tick) > Number.EPSILON)
        .map((tick, index) => (
          <text
            key={`y-label-${index}`}
            className="fill-ink-2 font-mono text-[16px] font-semibold"
            x={bounds.left - 9}
            y={scaleY(tick) + 4}
            textAnchor="end"
          >
            {formatAxisTick(tick)}
          </text>
        ))}

      {hasXAxis && (
        <text
          className="fill-ink font-mono text-[18px] font-bold"
          x={width - bounds.right - 4}
          y={zeroY - 8}
          textAnchor="end"
        >
          x
        </text>
      )}
      {hasYAxis && (
        <text
          className="fill-ink font-mono text-[18px] font-bold"
          x={zeroX > width * 0.75 ? zeroX - 7 : zeroX + 7}
          y={bounds.top + 14}
          textAnchor={zeroX > width * 0.75 ? 'end' : 'start'}
        >
          y
        </text>
      )}
      {hasXAxis && hasYAxis && (
        <text
          className="fill-ink font-mono text-[13px] font-semibold"
          x={originLabelX}
          y={originLabelY}
          textAnchor={originLabelAnchor}
          stroke="var(--bg-2)"
          strokeWidth={4}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          O(0, 0)
        </text>
      )}
    </g>
  );
}
