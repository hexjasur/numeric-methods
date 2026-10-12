import type { Metadata } from 'next';
import { LagrangeMethod } from '@/components/lagrange-method';

export const metadata: Metadata = {
  title: 'Lagranj interpolyatsiyasi',
  description:
    'Nuqtalar orqali Lagranj bazis ko‘phadlarini va interpolyatsion polinomni qadamma-qadam hisoblang.',
};

export default function LagrangePage() {
  return <LagrangeMethod />;
}
