import type { Metadata } from 'next';
import { TrapezoidMethod } from '@/components/trapezoid-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Trapetsiyalar usuli | Метод трапеций | Trapezoidal Rule',
  description:
    "Aniq integralni trapetsiyalar formulasi yordamida qadam-baqam sonli hisoblash. Har bir tugun nuqtasi, oraliq trapetsiya yuzalari, yakuniy yigʻindi va interaktiv grafik.",
  keywords: [
    'trapetsiyalar usuli',
    'trapetsiya formulasi',
    'aniq integral hisoblash',
    'sonli integrallash trapetsiya',
    'oraliq yuzalari',
    'метод трапеций',
    'формула трапеций онлайн',
    'численное интегрирование трапециями',
    'геометрический смысл интеграла',
    'trapezoidal rule',
    'trapezoid method calculator',
    'trapezoid numerical integration',
  ],
  alternates: {
    canonical: '/methods/trapezoid',
  },
  openGraph: {
    title: 'Trapetsiyalar usuli | Метод трапеций | Trapezoidal Rule',
    description:
      "Aniq integrallarni trapetsiyalar usulida sonli hisoblang va qadam-baqam natijalarni ko'ring.",
    url: `${siteConfig.url}/methods/trapezoid`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function TrapezoidPage() {
  return (
    <>
      <MethodJsonLd
        name="Trapetsiyalar usuli"
        alternateName="Метод трапеций / Trapezoidal Rule"
        description="Egri chiziqli trapetsiyani to'g'ri chiziqli trapetsiyalarga bo'lib, integral qiymatini hisoblang."
        path="/methods/trapezoid"
        formula="I \approx h [\frac{y_0 + y_n}{2} + \sum_{i=1}^{n-1} y_i]"
      />
      <TrapezoidMethod />
    </>
  );
}
