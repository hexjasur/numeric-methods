import type { Metadata } from 'next';
import { RectangleMethod } from '@/components/rectangle-method';

export const metadata: Metadata = {
  title: 'To‘g‘ri to‘rtburchaklar usuli',
  description:
    'Aniq integralni chap va o‘ng to‘g‘ri to‘rtburchaklar usuli bilan qadamma-qadam hisoblang, grafik hamda xatoliklarni solishtiring.',
};

export default function RectanglesPage() {
  return <RectangleMethod />;
}
