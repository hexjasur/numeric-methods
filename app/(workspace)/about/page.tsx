import type { Metadata } from 'next';
import { AboutPage } from '@/components/about-page';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Loyiha haqida | О проекте | About Sonli Usullar',
  description:
    "Sonli Usullar platformasi — talabalar, oʻqituvchilar va muhandislar uchun moʻljallangan bepul, interaktiv matematik tahlil vositasi. Loyiha maqsadi, arxitekturasi va muallif haqida maʼlumot.",
  keywords: [
    'sonli usullar loyihasi',
    'loyiha haqida',
    'jasurbek haydarov',
    'matematik dasturlar',
    'interaktiv ta\'lim',
    'о проекте численные методы',
    'about numeric methods',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Loyiha haqida | Sonli Usullar platformasi',
    description:
      'Sonli Usullar interaktiv matematik hisoblash platformasining maqsadi, arxitekturasi va jamoasi.',
    url: `${siteConfig.url}/about`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function Page() {
  return <AboutPage />;
}
