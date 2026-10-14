import React from 'react';
import { siteConfig } from '@/lib/config';

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
