import type { Metadata } from 'next';
import { SplineMethod } from '@/components/spline-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Splayn interpolatsiyasi | Cubic Spline Interpolation',
  description: 'Natural cubic splayn interpolatsiyasini nuqtalar, momentlar va har bir interval formulasi bilan qadam-baqadam hisoblang.',
  alternates: { canonical: '/methods/spline' },
  openGraph: { title: 'Splayn interpolatsiyasi', description: 'Qadam-baqadam cubic spline kalkulyatori', url: `${siteConfig.url}/methods/spline`, images: [{ url: '/images/og/spline.png', width: 1200, height: 630, alt: 'Splayn interpolatsiyasi' }] },
};

export default function SplinePage() {
  return <><MethodJsonLd name="Natural cubic spline interpolation" alternateName="Splayn interpolatsiyasi" description="Tugun nuqtalaridan natural cubic splaynni qadam-baqadam qurish." path="/methods/spline" /><SplineMethod /></>;
}
