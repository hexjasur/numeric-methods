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
        url: '/images/og-thumbail-1280x640.png',
        width: 1280,
        height: 640,
        alt: 'Sonli Usullar platformasi',
      },
    ],
  },
};

export default function Home() {
  return <DashboardView />;
}
