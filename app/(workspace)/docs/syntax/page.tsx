import type { Metadata } from 'next';
import { SyntaxGuide } from '@/components/syntax-guide';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Matematik sintaksis va formulalar | Синтаксис формул | Math Syntax',
  description:
    "Funksiya va tenglamalarni kiritish boʻyicha toʻliq yoʻriqnoma: trigonometrik (sin, cos, tg), logarifmik (log, ln), darajalar (^), oʻzgarmaslar (pi, e) va Math.js operatorlari sintaksisi.",
  keywords: [
    'matematik formulalar sintaksisi',
    'formulalarni togri kiritish',
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
    description:
      'Formulalar, trigonometriya, darajalar va oʻzgarmaslarni kiritish boʻyicha batafsil qoʻllanma.',
    url: `${siteConfig.url}/docs/syntax`,
    images: [{ url: '/images/og-thumbail-1280x640.png', width: 1280, height: 640 }],
  },
};

export default function Page() {
  return <SyntaxGuide />;
}
