import type { Metadata } from 'next';
import { EulerMethod } from '@/components/euler-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Eyler usullari (ODU) | Метод Эйлера | Euler Methods',
  description: "Oddiy differensial tenglamalarni (Koşi masalasi) standart va takomillaştirilgan Eyler usullari yordamida online yeçiş. Qadam-baqam jadval, analitik yeçim bilan taqqoslaş va trayektoriya grafigi.",
  keywords: [
    'eyler usuli',
    'takomillaştirilgan eyler usuli',
    'koşi masalasi',
    'differensial tenglamalar',
    'odu sonli yeçiş',
    'aniq yeçim bilan taqqoslaş',
    'метод эйлера',
    'модифицированный метод эйлера',
    'задача коши онлайн',
    'дифференциальные уравнения',
    'euler method',
    'improved euler method',
    'heun method',
    'ode initial value problem solver',
  ],
  alternates: {
    canonical: '/methods/euler',
  },
  openGraph: {
    title: 'Eyler usullari (ODU) | Метод Эйлера | Euler Methods',
    description: "Oddiy differensial tenglamalarni standart va takomillaştirilgan Eyler usullari bilan yeçing.",
    url: `${siteConfig.url}/methods/euler`,
    images: [{ url: '/images/og/euler.png', width: 1200, height: 630, alt: 'Eyler usullari' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eyler usullari (ODU) | Метод Эйлера | Euler Methods',
    description: "Oddiy differensial tenglamalarni standart va takomillaştirilgan Eyler usullari bilan yeçing.",
    images: ['/images/og/euler.png'],
  },
};

export default function EulerPage() {
  return (
    <>
      <MethodJsonLd
        name="Eyler usuli (Standart va Takomillashtirilgan)"
        alternateName="Метод Эйлера / Euler Method"
        description="Differensial tenglamalar Koşi masalasini çekli ayirmalar orqali qadam-baqam yeçing."
        path="/methods/euler"
        formula="y_{i+1} = y_i + h · f(x_i, y_i)"
      />
      <EulerMethod />
    </>
  );
}
