import type { Metadata } from 'next';
import { EulerMethod } from '@/components/euler-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Eyler usullari (ODU) | Метод Эйлера | Euler Methods',
  description:
    "Oddiy differensial tenglamalarni (Koshi masalasi) standart va takomillashtirilgan Eyler usullari yordamida online yechish. Qadam-baqam jadval, analitik yechim bilan taqqoslash va trayektoriya grafigi.",
  keywords: [
    'eyler usuli',
    'takomillashtirilgan eyler usuli',
    'koshi masalasi',
    'differensial tenglamalar',
    'odu sonli yechish',
    'aniq yechim bilan taqqoslash',
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
    description:
      "Oddiy differensial tenglamalarni standart va takomillashtirilgan Eyler usullari bilan yeching.",
    url: `${siteConfig.url}/methods/euler`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function EulerPage() {
  return (
    <>
      <MethodJsonLd
        name="Eyler usuli (Standart va Takomillashtirilgan)"
        alternateName="Метод Эйлера / Euler Method"
        description="Differensial tenglamalar Koshi masalasini chekli ayirmalar orqali qadam-baqam yeching."
        path="/methods/euler"
        formula="y_{i+1} = y_i + h · f(x_i, y_i)"
      />
      <EulerMethod />
    </>
  );
}
