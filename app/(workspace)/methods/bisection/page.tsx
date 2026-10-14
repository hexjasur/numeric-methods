import type { Metadata } from 'next';
import { BisectionMethod } from '@/components/bisection-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Biseksiya usuli (Teng ikkiga bo'lish) | Метод бисекции | Bisection",
  description:
    "Tenglamalarning taqribiy ildizlarini Biseksiya (teng ikkiga bo'lish) usuli yordamida online hisoblash, qadam-baqam iteratsiyalar jadvali va interaktiv funksiya grafigi. f(a)·f(b) < 0 shartini tekshirish.",
  keywords: [
    'biseksiya usuli',
    'teng ikkiga bolish usuli',
    'ildiz topish',
    'chiziqli bolmagan tenglamalar',
    'biseksiya kalkulyator',
    'метод бисекции',
    'метод деления пополам онлайн',
    'поиск корней уравнений',
    'bisection method',
    'bisection root finding calculator',
    'numerical root solver',
  ],
  alternates: {
    canonical: '/methods/bisection',
  },
  openGraph: {
    title: "Biseksiya usuli (Teng ikkiga bo'lish) | Метод бисекции",
    description:
      "Tenglamalarning taqribiy ildizlarini Biseksiya usulida interaktiv hisoblash va jadvalini ko'rish.",
    url: `${siteConfig.url}/methods/bisection`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function BisectionPage() {
  return (
    <>
      <MethodJsonLd
        name="Biseksiya usuli (Teng ikkiga bo'lish)"
        alternateName="Метод бисекции / Bisection Method"
        description="Oraliqni teng ikkiga bo'lib, tenglama ildizini kafolatli tarzda yaqinlashtiring."
        path="/methods/bisection"
        formula="c = (a + b) / 2"
      />
      <BisectionMethod />
    </>
  );
}
