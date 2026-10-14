import type { Metadata } from 'next';
import { RungeKuttaMethod } from '@/components/runge-kutta-method';

export const metadata: Metadata = {
  title: 'Runge-Kutta 4th Order Method',
  description: 'Solve first-order initial value problems with the classical fourth-order Runge–Kutta method.',
};

export default function RungeKuttaPage() {
  return <RungeKuttaMethod />;
}
