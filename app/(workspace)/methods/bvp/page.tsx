import type { Metadata } from 'next';
import { BvpFiniteDifferenceMethod } from '@/components/bvp-finite-difference-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Boundary Value Problem Solver | Finite Difference & Thomas Algorithm',
  description: 'Solve second-order linear boundary value problems step by step using finite differences and the Thomas tridiagonal algorithm.',
  keywords: ['boundary value problem solver', 'finite difference method', 'Thomas algorithm', 'two-point boundary conditions', 'ODE BVP solver'],
  alternates: { canonical: '/methods/bvp' },
  openGraph: {
    title: 'Finite Difference BVP Solver | Thomas Algorithm',
    description: 'Discretize and solve second-order linear boundary value problems, inspect Thomas coefficients, residuals, and the solution graph.',
    url: `${siteConfig.url}/methods/bvp`,
  },
};

export default function BvpPage() {
  return (
    <>
      <MethodJsonLd
        name="Finite Difference Boundary Value Problem Solver"
        alternateName="Thomas algorithm BVP solver"
        description="Step-by-step finite difference solution of second-order linear two-point boundary value problems."
        path="/methods/bvp"
        formula="y'' + P(x)y' + Q(x)y = f(x)"
      />
      <BvpFiniteDifferenceMethod />
    </>
  );
}
