import type { Metadata } from 'next';
import { IterationMethod } from '@/components/iteration-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Oddiy iteratsiya usuli | Simple Iteration Method',
  description: 'Oddiy iteratsiya usulida tenglama ildizini M konstantasi va har bir hisoblash qadami bilan toping.',
  alternates: { canonical: '/methods/iteration' },
  openGraph: { title: 'Oddiy iteratsiya usuli', description: 'Qadam-baqadam iteratsiya kalkulyatori', url: `${siteConfig.url}/methods/iteration`, images: [{ url: '/images/og/iteration.png', width: 1200, height: 630, alt: 'Oddiy iteratsiya usuli' }] },
};

export default function IterationPage() {
  return <><MethodJsonLd name="Oddiy iteratsiya usuli" alternateName="Simple Iteration Method" description="M konstantasi yordamida algebraik tenglama ildizini qadam-baqadam topish." path="/methods/iteration" /><IterationMethod /></>;
}
