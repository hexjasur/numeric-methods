import type { Metadata } from 'next';
import { NewtonInterpolationMethod } from '@/components/newton-interpolation-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

const route = '/methods/newton-interpolation';
const pageTitle = 'Nyuton interpolyatsiyasi — bo‘lingan ayirmalar | Newton';
const pageDescription =
  'Nyuton ko‘phadini hisoblang: bo‘lingan yoki chekli ayirmalar va P(x*) qiymati. Har bir formula hamda sonli qo‘yish qadam-baqadam ko‘rsatiladi.';
const image = '/images/og/newton-interpolation.png';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'Nyuton interpolyatsiyasi',
    'bo‘lingan ayirmalar',
    'Nyuton interpolyatsion ko‘phadi',
    'chekli ayirmalar usuli',
    'интерполяция Ньютона',
    'разделённые разности онлайн',
    'Newton interpolation calculator',
    'divided differences polynomial',
  ],
  alternates: { canonical: route },
  openGraph: {
    type: 'article',
    title: 'Newton Interpolation Calculator | Nyuton interpolyatsiyasi',
    description: pageDescription,
    url: `${siteConfig.url}${route}`,
    siteName: siteConfig.name,
    images: [{ url: image, width: 1200, height: 630, alt: 'Newton divided differences interpolation calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newton Interpolation Calculator | Nyuton interpolyatsiyasi',
    description: pageDescription,
    images: [image],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: siteConfig.name, item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'Nyuton interpolyatsiyasi', item: `${siteConfig.url}${route}` },
  ],
};

export default function NewtonInterpolationPage() {
  return (
    <>
      <MethodJsonLd
        name="Nyuton interpolyatsiyasi"
        alternateName="Newton interpolation / Интерполяция Ньютона"
        description={pageDescription}
        path={route}
        formula="P_{n-1}(x) = a_0 + a_1(x-x_0) + ... + a_{n-1}(x-x_0)...(x-x_{n-2})"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <NewtonInterpolationMethod />
    </>
  );
}
