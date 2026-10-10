import type { Metadata } from 'next';
import { EulerMethod } from '@/components/euler-method';

export const metadata: Metadata = {
  title: 'Euler Methods',
  description:
    'Solve and compare differential equations using the standard and improved Euler methods.',
};

export default function EulerPage() {
  return <EulerMethod />;
}
