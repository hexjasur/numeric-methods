import type { Metadata } from 'next';
import { SweepMethod } from '@/components/sweep-method';

export const metadata: Metadata = {
  title: 'Haydash (Thomas) Method',
  description:
    'Solve tridiagonal linear systems with the Thomas algorithm and inspect every forward, backward, and residual-check step.',
};

export default function SweepPage() {
  return <SweepMethod />;
}
