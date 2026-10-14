import type { Metadata } from 'next';
import { SweepMethod } from '@/components/sweep-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Progonka usuli (Quvib o'tish) | Метод прогонки | Thomas Algorithm",
  description:
    "Uch diagonalli chiziqli algebraik tenglamalar sistemasini (SLAU) Progonka (Tomas algoritmi / TDMA) usuli bilan yechish. Toʻgʻri yurish (α, β) va teskari yurish koeffitsientlari, qadam-baqam yechim va qoldiq tekshiruvi.",
  keywords: [
    'progonka usuli',
    'quvib otish usuli',
    'uch diagonalli matritsa',
    'tomas algoritmi',
    'chiziqli algebraik tenglamalar sistemasi',
    'slau yechish',
    'togri va teskari yurish',
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
    title: "Progonka usuli (Quvib o'tish) | Метод прогонки | Thomas Algorithm",
    description:
      "Uch diagonalli matritsalarni Progonka usulida to'g'ri va teskari yurish bosqichlari bilan yeching.",
    url: `${siteConfig.url}/methods/sweep`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function SweepPage() {
  return (
    <>
      <MethodJsonLd
        name="Progonka usuli (Tomas algoritmi / TDMA)"
        alternateName="Метод прогонки (трехдиагональная матрица) / Thomas Algorithm"
        description="Uch diagonalli tenglamalar sistemasini O(n) chiziqli murakkablikda to'g'ri va teskari yurish orqali yeching."
        path="/methods/sweep"
        formula="x_i = \alpha_{i+1} x_{i+1} + \beta_{i+1}"
      />
      <SweepMethod />
    </>
  );
}
