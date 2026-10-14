import type { Metadata } from 'next';
import { SimpsonMethod } from '@/components/simpson-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Simpson usuli (Parabolalar) | Метод Симпсона | Simpson's Rule",
  description:
    "Aniq integrallarni Simpson (parabolalar / Simpson 1/3) formulasi yordamida yuqori aniqlikda sonli hisoblash. Juft va toq indeksli ordinatalar yigʻindisi, qadam-baqam jadval va interaktiv grafik.",
  keywords: [
    'simpson usuli',
    'parabolalar usuli',
    'simpson formulasi',
    'simpson 1/3 qoidasi',
    'aniq integral hisoblash',
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
    description:
      "Aniq integrallarni Simpson formulasi orqali parabolik approksimatsiya bilan yuqori aniqlikda hisoblang.",
    url: `${siteConfig.url}/methods/simpson`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function SimpsonPage() {
  return (
    <>
      <MethodJsonLd
        name="Simpson usuli (Parabolalar formulasi)"
        alternateName="Метод Симпсона (парабол) / Simpson's Rule"
        description="Integrallash oraliqlarini parabolalar bilan almashtirib, yuqori tartibli O(h⁴) aniqlikda integralni hisoblang."
        path="/methods/simpson"
        formula="I \approx \frac{h}{3} [y_0 + 4\sum y_{toq} + 2\sum y_{juft} + y_n]"
      />
      <SimpsonMethod />
    </>
  );
}
