import type { Metadata } from 'next';
import { NotFoundView } from '@/components/not-found-view';

export const metadata: Metadata = {
  title: '404 - Sahifa topilmadi | Sonli Usullar',
  description: "Qidirilayotgan sahifa mavjud emas, manzili özgartirilgan yoki öçirilgan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundView />;
}
