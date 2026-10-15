import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { learningGuides } from '@/lib/learning-guides';

export const metadata: Metadata = {
  title: 'Sonli usullar qo‘llanmasi: formulalar va misollar',
  description:
    'Sonli usullarni o‘zbek tilida o‘rganing: biseksiya, Nyuton, integrallash, interpolyatsiya va differensial tenglamalar bo‘yicha formulalar, ishlangan misollar va kalkulyatorlar.',
  keywords: [
    'sonli usullar qo‘llanmasi',
    'sonli usullar misollar bilan',
    'hisoblash matematikasi',
    'sonli usullar darslari',
  ],
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    type: 'website',
    title: 'Sonli usullar qo‘llanmasi | Sonli Usullar',
    description:
      'O‘zbek tilidagi sonli usullar qo‘llanmasi: formulalar, ishlangan misollar va interaktiv hisoblash vositalari.',
    url: '/learn',
    siteName: 'Sonli Usullar',
  },
};

export default function LearningGuideIndexPage() {
  const guideGroups = [...new Set(learningGuides.map((guide) => guide.area))];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="rounded-xl border border-line bg-panel p-7 shadow-[var(--shadow)] sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-[.14em] text-brand">
          O‘zbekcha nazariya / formulalar / misollar
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Sonli usullar qo‘llanmasi
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
          Sonli usullar matematik masalalarni kompyuterda taqribiy yechishga
          yordam beradi. Quyidagi qo‘llanmalarda algoritmning g‘oyasi, formulasi,
          qadam-baqadam misoli va qachon ishlatish mumkinligi sodda o‘zbek tilida
          tushuntiriladi.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Mavzuni o‘qib bo‘lgach, shu sahifadagi interaktiv kalkulyatorda
          parametrlarni o‘zgartirib natijaga ta’sirini tekshirishingiz mumkin.
        </p>
      </header>

      <section aria-labelledby="choose-method" className="rounded-xl border border-line bg-bg-2 p-6 sm:p-8">
        <h2 id="choose-method" className="text-xl font-bold text-ink sm:text-2xl">
          Masalangizga mos usulni tanlang
        </h2>
        <p className="mt-2 max-w-3xl leading-7 text-muted">
          Avval masala turini aniqlang: tenglama ildizini qidiryapsizmi,
          integralni hisoblaysizmi yoki differensial tenglama yechyapsizmi?
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border border-line bg-panel p-4 text-sm leading-6 text-muted">
            <strong className="text-ink">Tenglama ildizi:</strong> ishonchli
            oraliq uchun <Link className="text-brand underline" href="/learn/biseksiya-usuli">biseksiya</Link>,
            hosila va yaxshi boshlang‘ich taxmin bo‘lsa <Link className="text-brand underline" href="/learn/nyuton-usuli">Nyuton usuli</Link>.
          </li>
          <li className="rounded-lg border border-line bg-panel p-4 text-sm leading-6 text-muted">
            <strong className="text-ink">Aniq integral:</strong> sodda baho
            uchun <Link className="text-brand underline" href="/learn/trapetsiyalar-usuli">trapetsiyalar</Link>,
            silliq funksiya va juft bo‘linish uchun <Link className="text-brand underline" href="/learn/simpson-usuli">Simpson usuli</Link>.
          </li>
          <li className="rounded-lg border border-line bg-panel p-4 text-sm leading-6 text-muted">
            <strong className="text-ink">Differensial tenglama:</strong>{' '}
            boshlang‘ich va sodda qadamlar uchun <Link className="text-brand underline" href="/learn/eyler-usuli">Eyler</Link>,
            yuqoriroq tartibli baho uchun <Link className="text-brand underline" href="/learn/runge-kutta-4-usuli">RK4</Link>.
          </li>
          <li className="rounded-lg border border-line bg-panel p-4 text-sm leading-6 text-muted">
            <strong className="text-ink">Jadval nuqtalari yoki sistema:</strong>{' '}
            qiymatlar orasini to‘ldirish uchun <Link className="text-brand underline" href="/learn/lagranj-interpolyatsiyasi">Lagranj</Link>,
            uch diagonalli sistemalar uchun <Link className="text-brand underline" href="/learn/haydash-usuli">haydash usuli</Link>.
          </li>
        </ul>
      </section>

      {guideGroups.map((area, groupIndex) => (
        <section key={area} aria-labelledby={`guide-group-${groupIndex}`}>
          <div className="mb-4 flex items-center gap-3">
            <BookOpenText aria-hidden="true" className="text-brand" size={20} />
            <h2 id={`guide-group-${groupIndex}`} className="text-xl font-bold text-ink">
              {area}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {learningGuides
              .filter((guide) => guide.area === area)
              .map((guide) => (
                <article key={guide.slug} className="rounded-xl border border-line bg-panel p-5 transition-colors hover:border-brand/50">
                  <h3 className="text-lg font-bold text-ink">
                    <Link className="hover:text-brand focus-visible:text-brand" href={`/learn/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{guide.summary}</p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand"
                    href={`/learn/${guide.slug}`}
                  >
                    Qo‘llanmani o‘qish <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
