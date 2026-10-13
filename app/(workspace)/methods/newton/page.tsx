import type { Metadata } from 'next';
import { NewtonMethod } from '@/components/newton-method';

export const metadata: Metadata = {
  title: 'Urinma (Newton) Method',
  description:
    'Solve nonlinear equations with the Newton tangent method and inspect every numerical iteration.',
};

export default function NewtonPage() {
  return <NewtonMethod />;
}
