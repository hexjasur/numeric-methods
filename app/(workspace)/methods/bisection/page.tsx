import type { Metadata } from 'next';
import { BisectionMethod } from '@/components/bisection-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Biseksiya usuli (Teng ikkiga böliş) | Метод бисекции | Bisection",
  description: "Tenglamalarning taqribiy ildizlarini Biseksiya (teng ikkiga böliş) usuli yordamida online hisoblaş, qadam-baqam iteratsiyalar jadvali va interaktiv funksiya grafigi. f(a)·f(b) < 0 şartini tekşiriş.",
  keywords: [
    'biseksiya usuli',
    'teng ikkiga boliş usuli',
    'ildiz topiş',
    'çiziqli bolmagan tenglamalar',
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
    title: "Biseksiya usuli (Teng ikkiga böliş) | Метод бисекции",
    description: "Tenglamalarning taqribiy ildizlarini Biseksiya usulida interaktiv hisoblaş va jadvalini köriş.",
    url: `${siteConfig.url}/methods/bisection`,
    images: [{ url: '/images/og/bisection.png', width: 1200, height: 630, alt: 'Biseksiya usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Biseksiya usuli (Teng ikkiga böliş) | Метод бисекции",
    description: "Tenglamalarning taqribiy ildizlarini Biseksiya usulida interaktiv hisoblaş va jadvalini köriş.",
    images: ['/images/og/bisection.png'],
  },
};

export default function BisectionPage() {
  return (
    <>
      <MethodJsonLd
        name="Biseksiya usuli (Teng ikkiga bo'lish)"
        alternateName="Метод бисекции / Bisection Method"
        description="Oraliqni teng ikkiga bölib, tenglama ildizini kafolatli tarzda yaqinlaştiring."
        path="/methods/bisection"
        formula="c = (a + b) / 2"
      />
      <BisectionMethod />
    </>
  );
}
