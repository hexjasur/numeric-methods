import React from 'react';
import { siteConfig } from '@/lib/config';
import type { LearningGuide } from '@/lib/learning-guides';

export function RootJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: siteConfig.url,
    inLanguage: ['uz', 'ru', 'en'],
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: siteConfig.url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All (Web, Windows, Linux, Android)',
    inLanguage: ['uz', 'ru', 'en'],
    description: siteConfig.description,
    image: `${siteConfig.url}/images/og-thumbail-1280x640.png`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    featureList: [
      "Biseksiya usuli (Teng ikkiga bo'lish orqali ildiz topish)",
      'Nyuton usuli (Urinmalar orqali tenglamalar yechish)',
      'Eyler usuli (Oddiy differensial tenglamalarni yechish)',
      'Runge-Kutta 4-tartibli usuli (Yuqori aniqlikdagi ODU yechish)',
      'Lagranj interpolyatsiya koʻphadi',
      'Simpson parabolalar formulasi bilan integrallash',
      'Trapetsiyalar usuli bilan integrallash',
      'Toʻgʻri toʻrtburchaklar usuli bilan integrallash',
      'Progonka usuli (Uch diagonalli matritsalarni yechish)',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  );
}

interface MethodJsonLdProps {
  name: string;
  alternateName?: string;
  description: string;
  path: string;
  formula?: string;
}

export function MethodJsonLd({
  name,
  alternateName,
  description,
  path,
  formula,
}: MethodJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name,
    alternateName,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: ['uz', 'ru', 'en'],
    learningResourceType: 'Interactive Calculator',
    educationalLevel: 'Higher Education / Engineering',
    teaches: formula || name,
    provider: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LearningGuideJsonLd({ guide }: { guide: LearningGuide }) {
  const url = `${siteConfig.url}/learn/${guide.slug}`;
  const resourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: guide.title,
    description: guide.description,
    url,
    inLanguage: 'uz',
    learningResourceType: 'Tutorial',
    educationalLevel: 'Higher Education',
    teaches: [guide.area, guide.title],
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteConfig.name,
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Qo‘llanmalar',
        item: `${siteConfig.url}/learn`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(resourceSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
