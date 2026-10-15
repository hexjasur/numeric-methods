export function getPlotXDomain(
  left: number,
  right: number,
  paddingRatio: number,
  minimumPadding = 0,
): { min: number; max: number } {
  const span = right - left;
  const padding = Math.max(span * paddingRatio, minimumPadding);
  let min = left - padding;
  let max = right + padding;

  if (left > 0 && left <= span * 3) min = 0;
  if (right < 0 && Math.abs(right) <= span * 3) max = 0;

  return { min, max };
}

export function getAxisTicks(min: number, max: number, targetCount = 5): number[] {
  const range = max - min;
  if (!Number.isFinite(range) || range <= 0) return [];

  const rawStep = range / (targetCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalizedStep = rawStep / magnitude;
  const stepFactor = normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 5 ? 5 : 10;
  const step = stepFactor * magnitude;
  const firstTick = Math.ceil(min / step - 1e-10) * step;
  const ticks: number[] = [];

  for (let index = 0; index < targetCount + 2; index++) {
    const tick = firstTick + index * step;
    if (tick > max + step * 1e-10) break;
    ticks.push(Number(tick.toPrecision(12)));
  }

  return ticks;
}

export function formatAxisTick(value: number): string {
  if (value === 0) return '0';
  const absolute = Math.abs(value);
  return absolute >= 10_000 || absolute < 0.001
    ? value.toExponential(1)
    : Number(value.toPrecision(4)).toString();
}
