import type { Metadata } from 'next';
import { CollocationMethod } from '@/components/collocation-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Collocation Method | Boundary Value Problem Solver',
  description: 'Solve second-order linear boundary value problems step by step using the collocation method.',
  keywords: ['collocation method', 'boundary value problem', 'ODE solver', 'numerical methods'],
  alternates: { canonical: '/methods/collocation' },
  openGraph: {
    title: 'Collocation Method Solver',
    description: 'Build basis functions, collocation equations, and a Gauss solution for a second-order ODE boundary problem.',
    url: `${siteConfig.url}/methods/collocation`,
  },
};

export default function CollocationPage() {
  return (
    <>
      <MethodJsonLd
        name="Collocation Method Boundary Value Problem Solver"
        alternateName="Collocation method ODE solver"
        description="Step-by-step collocation solution of a second-order linear boundary value problem."
        path="/methods/collocation"
        formula="u'' + P(x)u' + Q(x)u = f(x)"
      />
      <CollocationMethod />
    </>
  );
}
