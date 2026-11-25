import type { Metadata } from 'next';
import { GalerkinMethod } from '@/components/galerkin-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Galerkin Method | Метод Галеркина | Galyorkin usuli',
  description:
    'Solve second-order linear boundary value problems step by step with the Galerkin method. Метод Галеркина для краевой задачи. Galyorkin usuli bilan chegaraviy masalani bosqichma-bosqich yeching.',
  keywords: [
    'galerkin method',
    'galerkin boundary value problem',
    'boundary value problem solver',
    'second order ODE solver',
    'numerical methods',
    'метод галеркина',
    'краевая задача метод галеркина',
    'galyorkin usuli',
    'chegaraviy masala galyorkin',
  ],
  alternates: { canonical: '/methods/galerkin' },
  openGraph: {
    title: 'Galerkin Method Solver | Метод Галеркина',
    description:
      'Build basis functions, Galerkin integrals, and a linear system for a second-order boundary value problem.',
    url: `${siteConfig.url}/methods/galerkin`,
    images: [{ url: '/images/og/collocation.png', width: 1200, height: 630, alt: 'Galyorkin usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galerkin Method | Метод Галеркина',
    description: 'Step-by-step Galerkin solution of a second-order boundary value problem.',
    images: ['/images/og/collocation.png'],
  },
};

export default function GalerkinPage() {
  return (
    <>
      <MethodJsonLd
        name="Galerkin Method Boundary Value Problem Solver"
        alternateName="Метод Галеркина | Galyorkin usuli | Galerkin method ODE solver"
        description="Step-by-step Galerkin solution of a second-order linear boundary value problem. Метод Галеркина для краевой задачи. Galyorkin usuli bilan chegaraviy masala."
        path="/methods/galerkin"
        formula="u'' + p(x)u' + q(x)u = f(x)"
      />
      <GalerkinMethod />
    </>
  );
}
