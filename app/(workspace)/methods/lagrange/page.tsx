import type { Metadata } from 'next';
import { LagrangeMethod } from '@/components/lagrange-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Lagranj interpolyatsiyasi | Интерполяция Лагранжа | Lagrange Polynomial',
  description:
    "Berilgan tugun nuqtalari orqali Lagranj interpolyatsiya koʻphadini va bazis polinomlarini qadam-baqam hisoblash. Ixtiyoriy x nuqtadagi qiymatni topish va interaktiv approksimatsiya grafigi.",
  keywords: [
    'lagranj interpolyatsiyasi',
    'lagranj kophadi',
    'interpolyatsiya online',
    'tugun nuqtalar boyicha polinom',
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
    description:
      "Nuqtalar orqali Lagranj interpolyatsion polinomini qadam-baqam hisoblang va grafigini ko'ring.",
    url: `${siteConfig.url}/methods/lagrange`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function LagrangePage() {
  return (
    <>
      <MethodJsonLd
        name="Lagranj interpolyatsiyasi"
        alternateName="Интерполяционный многочлен Лагранжа / Lagrange Interpolation"
        description="Berilgan nuqtalar to'plamidan o'tuvchi yagona Lagranj interpolyatsiya ko'phadini quring."
        path="/methods/lagrange"
        formula="L(x) = \sum_{i=0}^n y_i \cdot \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}"
      />
      <LagrangeMethod />
    </>
  );
}
