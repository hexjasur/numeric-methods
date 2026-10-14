import type { Metadata } from 'next';
import { RungeKuttaMethod } from '@/components/runge-kutta-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Runge-Kutta 4-tartibli usuli (RK4) | Метод Рунге-Кутты 4 | RK4 Solver',
  description:
    "Birinchi tartibli oddiy differensial tenglamalar (Koshi masalasi)ni klassik 4-tartibli Runge-Kutta (RK4) usuli yordamida yuqori aniqlikda yechish. k₀, k₁, k₂, k₃ qiyalik koeffitsientlari, qadam-baqam jadval va analitik taqqoslash grafigi.",
  keywords: [
    'runge kutta usuli',
    'rk4 usuli',
    'differensial tenglamalar rk4',
    'koshi masalasi',
    'yuqori tartibli sonli usul',
    'rk4 kalkulyator',
    'метод рунге кутты',
    'метод рунге-кутты 4 порядка',
    'рк4 онлайн',
    'дифференциальные уравнения рк4',
    'runge kutta 4th order method',
    'rk4 solver',
    'classical runge kutta calculator',
    'initial value problem rk4',
  ],
  alternates: {
    canonical: '/methods/runge-kutta',
  },
  openGraph: {
    title: 'Runge-Kutta 4-tartibli usuli (RK4) | Метод Рунге-Кутты 4',
    description:
      "Oddiy differensial tenglamalarni klassik Runge-Kutta 4 usuli bilan yuqori aniqlikda online yeching.",
    url: `${siteConfig.url}/methods/runge-kutta`,
    images: [{ url: '/images/og/runge-kutta.png', width: 1200, height: 630, alt: 'Runge-Kutta 4 usuli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Runge-Kutta 4-tartibli usuli (RK4) | Метод Рунге-Кутты 4',
    description:
      "Oddiy differensial tenglamalarni klassik Runge-Kutta 4 usuli bilan yuqori aniqlikda online yeching.",
    images: ['/images/og/runge-kutta.png'],
  },
};

export default function RungeKuttaPage() {
  return (
    <>
      <MethodJsonLd
        name="Runge-Kutta 4-tartibli usuli (RK4)"
        alternateName="Классический метод Рунге-Кутты 4-го порядка / Runge-Kutta 4th Order"
        description="To'rt bosqichli og'irlik koeffitsiyentlari bilan O(h⁴) aniqlikda differensial tenglamalarni yeching."
        path="/methods/runge-kutta"
        formula="y_{i+1} = y_i + (h/6) · (k_0 + 2k_1 + 2k_2 + k_3)"
      />
      <RungeKuttaMethod />
    </>
  );
}
