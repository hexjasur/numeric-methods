import type { Metadata } from 'next';
import { LagrangeMethod } from '@/components/lagrange-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Lagranj interpolyatsiyasi | Интерполяция Лагранжа | Lagrange Polynomial',
  description: "Berilgan tugun nuqtalari orqali Lagranj interpolyatsiya köphadini va bazis polinomlarini qadam-baqam hisoblaş. Ixtiyoriy x nuqtadagi qiymatni topiş va interaktiv approksimatsiya grafigi.",
  keywords: [
    'lagranj interpolyatsiyasi',
    'lagranj kophadi',
    'interpolyatsiya online',
    'tugun nuqtalar boyiça polinom',
    'bazis polinomlar l_i(x)',
    'интерполяция лагранжа',
    'многочлен лагранжа онлайн',
    'полиномиальная интерполяция',
    'вычисление значений в точке',
    'lagrange interpolation',
    'lagrange polynomial calculator',
    'polynomial curve fitting online',
  ],
  alternates: {
    canonical: '/methods/lagrange',
  },
  openGraph: {
    title: 'Lagranj interpolyatsiyasi | Интерполяция Лагранжа | Lagrange Interpolation',
    description: "Nuqtalar orqali Lagranj interpolyatsion polinomini qadam-baqam hisoblang va grafigini köring.",
    url: `${siteConfig.url}/methods/lagrange`,
    images: [{ url: '/images/og/lagrange.png', width: 1200, height: 630, alt: 'Lagranj interpolyatsiyasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagranj interpolyatsiyasi | Интерполяция Лагранжа | Lagrange Interpolation',
    description: "Nuqtalar orqali Lagranj interpolyatsion polinomini qadam-baqam hisoblang va grafigini köring.",
    images: ['/images/og/lagrange.png'],
  },
};

export default function LagrangePage() {
  return (
    <>
      <MethodJsonLd
        name="Lagranj interpolyatsiyasi"
        alternateName="Интерполяционный многочлен Лагранжа / Lagrange Interpolation"
        description="Berilgan nuqtalar töplamidan ötuvçi yagona Lagranj interpolyatsiya köphadini quring."
        path="/methods/lagrange"
        formula="L(x) = \sum_{i=0}^n y_i \cdot \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}"
      />
      <LagrangeMethod />
    </>
  );
}
