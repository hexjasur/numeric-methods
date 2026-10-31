import type { Metadata } from 'next';
import { SyntaxGuide } from '@/components/syntax-guide';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Matematik sintaksis va formulalar | Синтаксис формул | Math Syntax',
  description: "Funksiya va tenglamalarni kiritiş böyiça töliq yöriqnoma: trigonometrik (sin, cos, tg), logarifmik (log, ln), darajalar (^), özgarmaslar (pi, e) va Math.js operatorlari sintaksisi.",
  keywords: [
    'matematik formulalar sintaksisi',
    'formulalarni togri kiritiş',
    'funksiyalar qollanmasi',
    'mathjs sintaksis',
    'darajalar va ildizlar',
    'синтаксис формул',
    'ввод функций онлайн',
    'правила записи выражений',
    'math syntax guide',
    'math expression input guidelines',
  ],
  alternates: {
    canonical: '/docs/syntax',
  },
  openGraph: {
    title: 'Matematik formulalar sintaksisi | Sonli Usullar',
    description: 'Formulalar, trigonometriya, darajalar va özgarmaslarni kiritiş böyiça batafsil qöllanma.',
    url: `${siteConfig.url}/docs/syntax`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function Page() {
  return <SyntaxGuide />;
}
