import type { Metadata } from 'next';
import { RectangleMethod } from '@/components/rectangle-method';
import { MethodJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "To'g'ri to'rtburchaklar usuli | Метод прямоугольников | Rectangles Rule",
  description:
    "Aniq integrallarni chap va oʻng toʻgʻri toʻrtburchaklar usuli bilan qadam-baqam hisoblash. Boʻlaklash oraliqlari soni n, integral yigʻindilari, xatolik bahosi va interaktiv grafik.",
  keywords: [
    'togri tortburchaklar usuli',
    'sonli integrallash',
    'chap tortburchaklar usuli',
    'ong tortburchaklar usuli',
    'aniq integral hisoblash',
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
    title: "To'g'ri to'rtburchaklar usuli | Метод прямоугольников",
    description:
      "Aniq integrallarni to'g'ri to'rtburchaklar usuli yordamida online hisoblang va geometrik yuzalarni ko'ring.",
    url: `${siteConfig.url}/methods/rectangles`,
    images: [{ url: '/images/og/rectangles.png', width: 1200, height: 630, alt: "To'g'ri to'rtburchaklar usuli" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "To'g'ri to'rtburchaklar usuli | Метод прямоугольников",
    description:
      "Aniq integrallarni to'g'ri to'rtburchaklar usuli yordamida online hisoblang va geometrik yuzalarni ko'ring.",
    images: ['/images/og/rectangles.png'],
  },
};

export default function RectanglesPage() {
  return (
    <>
      <MethodJsonLd
        name="To'g'ri to'rtburchaklar usuli (Chap va O'ng)"
        alternateName="Метод прямоугольников / Rectangles Rule"
        description="Egri chiziqli trapetsiya yuzini to'g'ri to'rtburchaklar yig'indisi sifatida sonli hisoblang."
        path="/methods/rectangles"
        formula="I \approx h \sum f(x_i)"
      />
      <RectangleMethod />
    </>
  );
}
