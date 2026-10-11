import type { Metadata } from 'next';
import { BisectionMethod } from '@/components/bisection-method';

export const metadata: Metadata = {
  title: 'Bisection Method',
  description:
    'Find the root of the equation interactively using the bisection method.',
};

export default function BisectionPage() {
  return <BisectionMethod />;
}
