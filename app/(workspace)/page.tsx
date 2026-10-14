import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Bosh sahifa | Sonli Usullar va Algoritmlar Laboratoriyasi',
  description:
    "Matematik tenglamalar, differensial tenglamalar (Eyler, Runge-Kutta 4), sonli integrallash (Simpson, Trapetsiya, To'g'ri to'rtburchak), Lagranj interpolyatsiyasi va Progonka usullarini bepul onlayn hisoblang.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sonli Usullar — Matematik va Muhandislik Hisoblash Platformasi',
    description:
      'Matematik modellashtirish, differensial tenglamalar va sonli usullarni qadam-baqam yechuvchi interaktiv online laboratoriya.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/images/og/main.png',
        width: 1200,
        height: 630,
        alt: 'Sonli Usullar platformasi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonli Usullar — Matematik va Muhandislik Hisoblash Platformasi',
    description:
      'Matematik modellashtirish, differensial tenglamalar va sonli usullarni qadam-baqam yechuvchi interaktiv online laboratoriya.',
    images: ['/images/og/main.png'],
  },
};

export default function Home() {
  return <DashboardView />;
}
