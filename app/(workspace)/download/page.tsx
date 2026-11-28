import type { Metadata } from 'next';
import { DownloadPage } from '@/components/download-page';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Yuklab olish | Скачать | Download',
  description: "Sonli Usullar ilovasining eng oxirgi versiyasini Windows, Android, macOS va Linux uchun yuklab oling.",
  alternates: { canonical: '/download' },
  openGraph: {
    title: 'Yuklab olish | Sonli Usullar',
    description: 'Sonli Usullar ilovasining eng oxirgi versiyasini yuklab oling.',
    url: `${siteConfig.url}/download`,
    images: [{ url: '/images/og/main.png', width: 1200, height: 630, alt: 'Sonli Usullar' }],
  },
};

export default function Page() {
  return <DownloadPage />;
}
