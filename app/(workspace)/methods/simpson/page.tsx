import type { Metadata } from 'next';
import { SimpsonMethod } from '@/components/simpson-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Simpson usuli (Parabolalar) | Метод Симпсона | Simpson's Rule",
  description: "Aniq integrallarni Simpson (parabolalar / Simpson 1/3) formulasi yordamida yuqori aniqlikda sonli hisoblaş. Juft va toq indeksli ordinatalar yiğindisi, qadam-baqam jadval va interaktiv grafik.",
  keywords: [
    'simpson usuli',
    'parabolalar usuli',
    'simpson formulasi',
    'simpson 1/3 qoidasi',
    'aniq integral hisoblaş',
    'kvadratura formulasi',
    'метод симпсона',
    'метод парабол',
    'формула симпсона онлайн',
    'численное интегрирование симпсона',
    'simpson rule',
    'simpson 1/3 rule calculator',
    'numerical integration parabolic rule',
  ],
  alternates: {
    canonical: '/methods/simpson',
  },
  openGraph: {
    title: "Simpson usuli (Parabolalar) | Метод Симпсона | Simpson's Rule",
    description: "Aniq integrallarni Simpson formulasi orqali parabolik approksimatsiya bilan yuqori aniqlikda hisoblang.",
    url: `${siteConfig.url}/methods/simpson`,
    images: [{ url: '/images/og/simpson.png', width: 1200, height: 630, alt: 'Simpson usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Simpson usuli (Parabolalar) | Метод Симпсона | Simpson's Rule",
    description: "Aniq integrallarni Simpson formulasi orqali parabolik approksimatsiya bilan yuqori aniqlikda hisoblang.",
    images: ['/images/og/simpson.png'],
  },
};

export default function SimpsonPage() {
  return (
    <>
      <MethodJsonLd
        name="Simpson usuli (Parabolalar formulasi)"
        alternateName="Метод Симпсона (парабол) / Simpson's Rule"
        description="Integrallaş oraliqlarini parabolalar bilan almaştirib, yuqori tartibli O(h⁴) aniqlikda integralni hisoblang."
        path="/methods/simpson"
        formula="I \approx \frac{h}{3} [y_0 + 4\sum y_{toq} + 2\sum y_{juft} + y_n]"
      />
      <SimpsonMethod />
    </>
  );
}
