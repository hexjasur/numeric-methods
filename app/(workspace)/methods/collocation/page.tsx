import type { Metadata } from 'next';
import { CollocationMethod } from '@/components/collocation-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Collocation Method | Метод коллокаций | Kollokatsiya usuli',
  description: 'Solve second-order linear boundary value problems step by step using the collocation method. Метод коллокаций для краевой задачи. Ikkinchi tartibli ODT uchun kollokatsiya usuli.',
  keywords: [
    'collocation method',
    'collocation points',
    'boundary value problem',
    'second order ODE solver',
    'numerical methods',
    'метод коллокаций',
    'метод колокаций',
    'точки коллокации',
    'краевая задача метод коллокаций',
    'kollokatsiya usuli',
    'kollokatsiya nuqtalari',
    'chegaraviy masala kollokatsiya',
  ],
  alternates: { canonical: '/methods/collocation' },
  openGraph: {
    title: 'Collocation Method Solver | Метод коллокаций',
    description: 'Build basis functions, collocation equations, and a Gauss solution for a second-order ODE boundary problem.',
    url: `${siteConfig.url}/methods/collocation`,
    images: [{ url: '/images/og/collocation.png', width: 1200, height: 630, alt: 'Kollokatsiya usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collocation Method | Метод коллокаций',
    description: 'Step-by-step collocation solution of a second-order boundary value problem.',
    images: ['/images/og/collocation.png'],
  },
};

export default function CollocationPage() {
  return (
    <>
      <MethodJsonLd
        name="Collocation Method Boundary Value Problem Solver"
        alternateName="Метод коллокаций | Kollokatsiya usuli | Collocation method ODE solver"
        description="Step-by-step collocation solution of a second-order linear boundary value problem. Метод коллокаций для краевой задачи. Ikkinchi tartibli ODT uchun kollokatsiya usuli."
        path="/methods/collocation"
        formula="u'' + P(x)u' + Q(x)u = f(x)"
      />
      <CollocationMethod />
    </>
  );
}
