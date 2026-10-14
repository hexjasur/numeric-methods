import type { Metadata } from 'next';
import { NewtonMethod } from '@/components/newton-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Nyuton usuli (Urinmalar) | Метод Ньютона | Newton-Raphson',
  description:
    "Chiziqli bo'lmagan tenglamalarni Nyuton (urinmalar / Newton-Raphson) usuli yordamida tezkor yaqinlashish orqali online yechish. Qadam-baqam iteratsiyalar, hosila hisoblash va funksiya grafigi.",
  keywords: [
    'nyuton usuli',
    'urinmalar usuli',
    'nyuton rafson',
    'tenglama ildizini topish',
    'chiziqli bolmagan tenglamalar',
    'hosila bilan hisoblash',
    'метод ньютона',
    'метод касательных',
    'метод ньютона-рафсона',
    'быстрая сходимость корней',
    'newton raphson method',
    'newton method calculator',
    'tangent method solver',
  ],
  alternates: {
    canonical: '/methods/newton',
  },
  openGraph: {
    title: 'Nyuton usuli (Urinmalar) | Метод Ньютона | Newton-Raphson',
    description:
      "Chiziqli bo'lmagan tenglamalarni Nyuton (urinmalar) usuli bilan yuqori tezlikda aniq yeching.",
    url: `${siteConfig.url}/methods/newton`,
    images: [{ url: '/images/og/newton.png', width: 1200, height: 630, alt: 'Nyuton usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyuton usuli (Urinmalar) | Метод Ньютона | Newton-Raphson',
    description:
      "Chiziqli bo'lmagan tenglamalarni Nyuton (urinmalar) usuli bilan yuqori tezlikda aniq yeching.",
    images: ['/images/og/newton.png'],
  },
};

export default function NewtonPage() {
  return (
    <>
      <MethodJsonLd
        name="Nyuton usuli (Urinmalar / Newton-Raphson)"
        alternateName="Метод Ньютона (касательных) / Newton-Raphson Method"
        description="Hosila urinmasi orqali ildizga kvadratik tezlikda yaqinlashing."
        path="/methods/newton"
        formula="x_{n+1} = x_n - f(x_n) / f'(x_n)"
      />
      <NewtonMethod />
    </>
  );
}
