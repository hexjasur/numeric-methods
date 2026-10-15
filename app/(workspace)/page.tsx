import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Sonli Usullar — Onlayn kalkulyator va o‘zbekcha qo‘llanma',
  description:
    "Sonli usullarni o‘zbek tilida o‘rganing va hisoblang: biseksiya, Nyuton, Eyler, Runge–Kutta, Simpson, trapetsiyalar va Lagranj usullari bo‘yicha bepul kalkulyatorlar hamda ishlangan misollar.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sonli Usullar — Onlayn kalkulyator va o‘zbekcha qo‘llanma',
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
    title: 'Sonli Usullar — Onlayn kalkulyator va o‘zbekcha qo‘llanma',
    description:
      'Matematik modellashtirish, differensial tenglamalar va sonli usullarni qadam-baqam yechuvchi interaktiv online laboratoriya.',
    images: ['/images/og/main.png'],
  },
};

export default function Home() {
  return <DashboardView />;
}
