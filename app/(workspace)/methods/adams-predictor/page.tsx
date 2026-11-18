import type { Metadata } from 'next';
import { AdamsPredictorMethod } from '@/components/adams-predictor-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Adams başorat qiluvçi usuli | Adams Predictor ODE Solver',
  description: 'Koşi masalasini 3-tartibli çekli ayirmali Adams başorat qiluvçi usuli bilan yeçing. RK4 boşlanğiç nuqtalari, natijalar jadvali va misol hisob-kitobi.',
  keywords: ['Adams predictor method', 'Adams başorat qiluvçi usuli', 'Koşi masalasi', 'ODE solver', 'finite difference Adams method'],
  alternates: { canonical: '/methods/adams-predictor' },
  openGraph: {
    title: 'Adams başorat qiluvçi usuli',
    description: 'Koşi masalasini Adams başorat qiluvçi usuli bilan qadamma-qadam yeçing.',
    url: `${siteConfig.url}/methods/adams-predictor`,
    images: [{ url: '/images/og/adams-predictor.png', width: 1200, height: 630, alt: 'Adams bashorat qiluvchi usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adams bashorat qiluvchi usuli',
    description: 'Koshi masalasini Adams predictor usuli bilan qadamma-qadam yeching.',
    images: ['/images/og/adams-predictor.png'],
  },
};

export default function AdamsPredictorPage() {
  return (
    <>
      <MethodJsonLd
        name="3-tartibli çekli ayirmali Adams başorat qiluvçi usuli"
        alternateName="Third-order finite-difference Adams predictor method"
        description="Koşi masalasini törtinçi tartibli Runge-Kutta boşlanğiç qiymatlari bilan Adams predictor formulasi orqali yeçiş."
        path="/methods/adams-predictor"
        formula="Δy_i = q_i + 1/2 Δq_{i-1} + 5/12 Δ²q_{i-2} + 3/8 Δ³q_{i-3}"
      />
      <AdamsPredictorMethod />
    </>
  );
}
