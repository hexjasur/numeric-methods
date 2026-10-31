import type { Metadata } from 'next';
import { TrapezoidMethod } from '@/components/trapezoid-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Trapetsiyalar usuli | Метод трапеций | Trapezoidal Rule',
  description: "Aniq integralni trapetsiyalar formulasi yordamida qadam-baqam sonli hisoblaş. Har bir tugun nuqtasi, oraliq trapetsiya yuzalari, yakuniy yiğindi va interaktiv grafik.",
  keywords: [
    'trapetsiyalar usuli',
    'trapetsiya formulasi',
    'aniq integral hisoblaş',
    'sonli integrallaş trapetsiya',
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
    description: "Aniq integrallarni trapetsiyalar usulida sonli hisoblang va qadam-baqam natijalarni köring.",
    url: `${siteConfig.url}/methods/trapezoid`,
    images: [{ url: '/images/og/trapezoid.png', width: 1200, height: 630, alt: 'Trapetsiyalar usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trapetsiyalar usuli | Метод трапеций | Trapezoidal Rule',
    description: "Aniq integrallarni trapetsiyalar usulida sonli hisoblang va qadam-baqam natijalarni köring.",
    images: ['/images/og/trapezoid.png'],
  },
};

export default function TrapezoidPage() {
  return (
    <>
      <MethodJsonLd
        name="Trapetsiyalar usuli"
        alternateName="Метод трапеций / Trapezoidal Rule"
        description="Egri çiziqli trapetsiyani töğri çiziqli trapetsiyalarga bölib, integral qiymatini hisoblang."
        path="/methods/trapezoid"
        formula="I \approx h [\frac{y_0 + y_n}{2} + \sum_{i=1}^{n-1} y_i]"
      />
      <TrapezoidMethod />
    </>
  );
}
