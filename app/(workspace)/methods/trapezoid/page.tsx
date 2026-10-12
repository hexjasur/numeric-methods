import type { Metadata } from 'next';
import { TrapezoidMethod } from '@/components/trapezoid-method';

export const metadata: Metadata = {
  title: 'Trapetsiya usuli',
  description:
    'Aniq integralni trapetsiya usuli bilan hisoblang va har bir tugun hamda oraliq yuzasini qadamma-qadam tekshiring.',
};

export default function TrapezoidPage() {
  return <TrapezoidMethod />;
}
