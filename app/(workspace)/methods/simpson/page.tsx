import type { Metadata } from 'next';
import { SimpsonMethod } from '@/components/simpson-method';

export const metadata: Metadata = {
  title: "Simpson's Rule",
  description:
    "Evaluate definite integrals numerically with high precision using Simpson's parabolic quadrature rule.",
};

export default function SimpsonPage() {
  return <SimpsonMethod />;
}
