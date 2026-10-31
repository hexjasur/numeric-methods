import type { Metadata } from 'next';
import { RectangleMethod } from '@/components/rectangle-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Töğri törtburçaklar usuli | Метод прямоугольников | Rectangles Rule",
  description: "Aniq integrallarni çap va öng töğri törtburçaklar usuli bilan qadam-baqam hisoblaş. Bölaklaş oraliqlari soni n, integral yiğindilari, xatolik bahosi va interaktiv grafik.",
  keywords: [
    'togri tortburçaklar usuli',
    'sonli integrallaş',
    'çap tortburçaklar usuli',
    'ong tortburçaklar usuli',
    'aniq integral hisoblaş',
    'riemann yigindilari',
    'метод прямоугольников',
    'численное интегрирование онлайн',
    'метод левых прямоугольников',
    'метод правых прямоугольников',
    'rectangles rule integration',
    'numerical integration rectangles',
    'riemann sums calculator',
  ],
  alternates: {
    canonical: '/methods/rectangles',
  },
  openGraph: {
    title: "Töğri törtburçaklar usuli | Метод прямоугольников",
    description: "Aniq integrallarni töğri törtburçaklar usuli yordamida online hisoblang va geometrik yuzalarni köring.",
    url: `${siteConfig.url}/methods/rectangles`,
    images: [{ url: '/images/og/rectangles.png', width: 1200, height: 630, alt: "To'g'ri to'rtburchaklar usuli" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Töğri törtburçaklar usuli | Метод прямоугольников",
    description: "Aniq integrallarni töğri törtburçaklar usuli yordamida online hisoblang va geometrik yuzalarni köring.",
    images: ['/images/og/rectangles.png'],
  },
};

export default function RectanglesPage() {
  return (
    <>
      <MethodJsonLd
        name="To'g'ri to'rtburchaklar usuli (Chap va O'ng)"
        alternateName="Метод прямоугольников / Rectangles Rule"
        description="Egri çiziqli trapetsiya yuzini töğri törtburçaklar yiğindisi sifatida sonli hisoblang."
        path="/methods/rectangles"
        formula="I \approx h \sum f(x_i)"
      />
      <RectangleMethod />
    </>
  );
}
