import type { Metadata } from 'next';
import { SweepMethod } from '@/components/sweep-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Progonka usuli (Quvib ötiş) | Метод прогонки | Thomas Algorithm",
  description: "Uç diagonalli çiziqli algebraik tenglamalar sistemasini (SLAU) Progonka (Tomas algoritmi / TDMA) usuli bilan yeçiş. Töğri yuriş (α, β) va teskari yuriş koeffitsientlari, qadam-baqam yeçim va qoldiq tekşiruvi.",
  keywords: [
    'progonka usuli',
    'quvib otiş usuli',
    'uç diagonalli matritsa',
    'tomas algoritmi',
    'çiziqli algebraik tenglamalar sistemasi',
    'slau yeçiş',
    'togri va teskari yuriş',
    'метод прогонки',
    'трехдиагональная матрица онлайн',
    'алгоритм томаса',
    'решение слау методом прогонки',
    'прямой и обратный ход',
    'thomas algorithm',
    'tridiagonal matrix algorithm',
    'tdma solver online',
    'sweep method',
  ],
  alternates: {
    canonical: '/methods/sweep',
  },
  openGraph: {
    title: "Progonka usuli (Quvib ötiş) | Метод прогонки | Thomas Algorithm",
    description: "Uç diagonalli matritsalarni Progonka usulida töğri va teskari yuriş bosqiçlari bilan yeçing.",
    url: `${siteConfig.url}/methods/sweep`,
    images: [{ url: '/images/og/sweep.png', width: 1200, height: 630, alt: 'Progonka usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Progonka usuli (Quvib ötiş) | Метод прогонки | Thomas Algorithm",
    description: "Uç diagonalli matritsalarni Progonka usulida töğri va teskari yuriş bosqiçlari bilan yeçing.",
    images: ['/images/og/sweep.png'],
  },
};

export default function SweepPage() {
  return (
    <>
      <MethodJsonLd
        name="Progonka usuli (Tomas algoritmi / TDMA)"
        alternateName="Метод прогонки (трехдиагональная матрица) / Thomas Algorithm"
        description="Uç diagonalli tenglamalar sistemasini O(n) çiziqli murakkablikda töğri va teskari yuriş orqali yeçing."
        path="/methods/sweep"
        formula="x_i = \alpha_{i+1} x_{i+1} + \beta_{i+1}"
      />
      <SweepMethod />
    </>
  );
}
