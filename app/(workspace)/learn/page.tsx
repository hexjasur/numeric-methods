import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookOpenText,
  Calculator,
  CheckCircle2,
  GraduationCap,
  Library,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { academicBibliography, learningGuides } from '@/lib/learning-guides';

export const metadata: Metadata = {
  title: 'Sonli usullar akademik qöllanmasi: formulalar, manbalar va misollar',
  description: 'Özbekiston darsliklari va ilmiy adabiyotlar asosida sonli usullarni örganing: biseksiya, Nyuton, Simpson, trapetsiya, Lagranj, Eyler, RK4 va haydaş usuli böyiça nazariya, formulalar va interaktiv kalkulyatorlar.',
  keywords: [
    'sonli usullar qöllanmasi',
    'hisoblaş usullari kitoblar',
    'sonli usullar darsliklari',
    'hisoblaş matematikasi',
    'sonli usullar formulalari',
    'sonli usullar adabiyotlar',
  ],
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    type: 'website',
    title: 'Sonli usullar akademik qöllanmasi | Sonli Usullar',
    description: 'Özbekiston oliy ta’lim darsliklari asosidagi sonli usullar nazariyasi, formulalari, işlangan misollari va interaktiv hisoblaş vositalari.',
    url: '/learn',
    siteName: 'Sonli Usullar',
  },
};

function renderKatex(tex: string, displayMode = false): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode,
    });
  } catch {
    return tex;
  }
}

export default function LearningGuideIndexPage() {
  const guideGroups = [...new Set(learningGuides.map((guide) => guide.area))];

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-16">
      {/* Hero Header */}
      <header className="rounded-2xl border border-line bg-panel p-7 shadow-[var(--shadow)] sm:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-brand">
            <GraduationCap aria-hidden="true" size={14} />
            Akademik nazariya &amp; Amaliyot
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1 text-xs font-medium text-muted">
            <Library aria-hidden="true" size={13} />
            O‘zbekiston darsliklari bazasi
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Sonli usullar qo‘llanmasi
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
          Ushbu bo‘limda hisoblash matematikasining asosiy usullari O‘zbekiston oliy o‘quv yurtlari
          darsliklari va ilmiy o‘quv qo‘llanmalari (Ismoilov, Irisqulov, Ismatullayev, Isroilov)
          asosida tizimlashtirilgan. Har bir usul uchun nazariy teoremalar, formulalar, qadam-baqadam
          algoritmlar va platformamizdagi hisoblash standartlari keltirilgan.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#usullar-katalogi"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-panel transition-all hover:bg-brand hover:text-white"
          >
            <BookOpen aria-hidden="true" size={17} />
            Usullar katalogiga o‘tish
          </a>
          <a
            href="#adabiyotlar-kutubxonasi"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-bg-2 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40"
          >
            <Library aria-hidden="true" size={17} className="text-brand" />
            Adabiyotlar kutubxonasi ({academicBibliography.length})
          </a>
          <a
            href="#standartlar-va-konvensiyalar"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-bg-2 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40"
          >
            <Lightbulb aria-hidden="true" size={17} className="text-cyan" />
            Platforma standartlari
          </a>
        </div>
      </header>

      {/* Masalangizga mos usulni tanlang */}
      <section aria-labelledby="choose-method" className="rounded-2xl border border-line bg-bg-2 p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <Sparkles aria-hidden="true" className="text-brand" size={20} />
          <h2 id="choose-method" className="text-xl font-bold text-ink sm:text-2xl">
            Masalangizga mos usulni tanlang
          </h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          Avval masala turini aniqlang: algebraik tenglama ildizini qidiryapsizmi, aniq integralni
          hisoblaysizmi, matritsali sistemani yechasizmi yoki Koshi masalasini diskretlashtirasizmi?
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-panel p-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand">1. Tenglama ildizlari</span>
            <h3 className="mt-1 text-base font-bold text-ink">Biseksiya va Nyuton usullari</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ishonchli va kafolatlangan oraliq uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/biseksiya-usuli">biseksiya</Link>,
              hosila mavjud bo‘lib tezkor kvadratik yaqinlashish kerak bo‘lsa{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/nyuton-usuli">Nyuton (urinmalar)</Link> usuli.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan">2. Aniq integrallar</span>
            <h3 className="mt-1 text-base font-bold text-ink">Kvadraturalar (Trapetsiya va Simpson)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Tezkor va barqaror baho uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/trapetsiyalar-usuli">trapetsiyalar</Link> yoki{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/togri-tortburchaklar-usuli">to‘g‘ri to‘rtburchaklar</Link>,
              silliq funksiyalar va 4-tartibli yuqori aniqlik uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/simpson-usuli">Simpson usuli</Link>.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ok">3. Differensial tenglamalar</span>
            <h3 className="mt-1 text-base font-bold text-ink">Koshi masalasi (Eyler va RK4)</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Birinchi tartibli qadamlar uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/eyler-usuli">Eyler usuli</Link>,
              muhandislik va ilmiy hisoblashlardagi standart yuqori aniqlik uchun esa{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/runge-kutta-4-usuli">Runge-Kutta 4 (RK4)</Link>.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-600">4. Interpolyatsiya &amp; Matritsalar</span>
            <h3 className="mt-1 text-base font-bold text-ink">Lagranj va Progonka usullari</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Jadval nuqtalari orasini silliq to‘ldirish uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/lagranj-interpolyatsiyasi">Lagranj ko‘phadi</Link>,
              uch diagonalli katta sistemalarni O(n) da yechish uchun{' '}
              <Link className="text-brand font-semibold hover:underline" href="/learn/haydash-usuli">haydash (progonka)</Link> usuli.
            </p>
          </div>
        </div>
      </section>

      {/* Usullar katalogi (Grouped by area) */}
      <div id="usullar-katalogi" className="space-y-10">
        <div className="border-b border-line pb-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand">Qo‘llanmalar to‘plami</p>
          <h2 className="text-2xl font-black text-ink sm:text-3xl">Usullar bo‘yicha to‘liq darslar</h2>
        </div>

        {guideGroups.map((area, groupIndex) => (
          <section key={area} aria-labelledby={`guide-group-${groupIndex}`} className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpenText aria-hidden="true" className="text-brand" size={22} />
              <h3 id={`guide-group-${groupIndex}`} className="text-xl font-bold text-ink">
                {area}
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {learningGuides
                .filter((guide) => guide.area === area)
                .map((guide) => (
                  <article
                    key={guide.slug}
                    className="flex flex-col justify-between rounded-2xl border border-line bg-panel p-6 transition-all hover:border-brand/50 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-lg font-bold text-ink">
                          <Link
                            className="hover:text-brand focus-visible:text-brand"
                            href={`/learn/${guide.slug}`}
                          >
                            {guide.title}
                          </Link>
                        </h4>
                        <span className="shrink-0 rounded-md border border-line bg-bg-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted">
                          {guide.sources[0]?.year ?? '2025'}
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed text-muted">
                        {guide.summary}
                      </p>

                      {/* Formula preview with KaTeX */}
                      <div
                        className="mt-4 overflow-x-auto rounded-lg border border-dashed border-line bg-bg-2 p-3 text-center text-xs text-cyan [&_.katex]:text-[1.05em]"
                        dangerouslySetInnerHTML={{
                          __html: renderKatex(guide.formulaTex, false),
                        }}
                      />

                      {/* Primary Source badge */}
                      {guide.sources.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                          <Library aria-hidden="true" size={13} className="text-brand shrink-0" />
                          <span className="truncate">
                            Manba: {guide.sources[0].authors} ({guide.sources[0].year})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                      <Link
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
                        href={`/learn/${guide.slug}`}
                      >
                        Qo‘llanmani o‘qish
                        <ArrowRight aria-hidden="true" size={15} />
                      </Link>

                      <Link
                        className="inline-flex items-center gap-1 rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand/40"
                        href={guide.calculatorHref}
                      >
                        <Calculator aria-hidden="true" size={13} />
                        Kalkulyator
                        <ArrowUpRight aria-hidden="true" size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Darsliklar va Interaktiv Platforma o‘rtasidagi konvensiyalar (Ziddiyatlar yechimi) */}
      <section
        id="standartlar-va-konvensiyalar"
        aria-labelledby="conventions-heading"
        className="rounded-2xl border-2 border-brand/30 bg-brand-soft/20 p-6 sm:p-10"
      >
        <div className="flex items-center gap-3 text-brand">
          <Lightbulb aria-hidden="true" size={24} />
          <h2 id="conventions-heading" className="text-2xl font-black text-ink">
            Darsliklar va Interaktiv Platforma konvensiyalari
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Har xil mualliflarning darsliklarida formulalar, indekslar va to‘xtash mezonlari turlicha
          berilgani talabalar orasida tez-tez tushunmovchilik keltirib chiqaradi.
          <strong className="text-ink"> Sonli-usullar interaktiv platformasi</strong> ushbu ziddiyatlarni
          quyidagi yagona, xalqaro hisoblash standartlari orqali bartaraf etgan:
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-bold text-ink">1. Avtomatik simvolik hosila</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Darsliklarda talaba Nyuton usuli uchun f′(x) hosilani qo‘lda hisoblab kiritishi kerak.
              Platformamizda esa foydalanuvchi faqat f(x) ni kiritadi, analitik hosila Math.js dvigateli
              orqali <strong className="text-ink">avtomatik hisoblanadi</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-bold text-ink">2. Simpson usulida bo‘linishlar soni n</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Ismoilov (2025) va Irisqulov (2013) kitoblarida oraliq «2n ta bo‘lak» deb olinib h=(b-a)/(2n)
              deb belgilanadi. Platformamizda xalqaro standart: <strong className="text-ink">n umumiy bo‘laklar soni</strong> bo‘lib,
              u albatta juft son bo‘lishi lozim (h = (b-a)/n, n = 2, 4, 6...).
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-bold text-ink">3. Ikki tomonlama to‘xtash mezoni</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Adabiyotlarda ba’zan faqat qadam uzunligi |x_{'{n+1}'} − x_n| &lt; ε, ba’zan esa qoldiq |f(x)| &lt; ε
              tekshiriladi. Platformamizda <strong className="text-ink">har ikkala shart birgalikda</strong> tekshirilib,
              soxta yaqinlashishlarning oldi olinadi.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-bold text-ink">4. Haydash (progonka) kanonik shakli</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Turli darsliklardagi turli harflar va ishoralar o‘rniga platformada yagona kanonik ko‘rinish:
              a_i x_{'{i-1}'} + b_i x_i + c_i x_{'{i+1}'} = d_i qabul qilingan. Diagonal ustunlik
              avtomatik tekshirilib, turg‘unlik kafolatlanadi.
            </p>
          </div>
        </div>
      </section>

      {/* Akademik adabiyotlar va darsliklar bazasi (Bibliografiya kutubxonasi) */}
      <section
        id="adabiyotlar-kutubxonasi"
        aria-labelledby="library-heading"
        className="rounded-2xl border border-line bg-panel p-7 shadow-[var(--shadow)] sm:p-10"
      >
        <div className="flex items-center gap-3">
          <Library aria-hidden="true" className="text-brand" size={24} />
          <div>
            <h2 id="library-heading" className="text-2xl font-black text-ink sm:text-3xl">
              Foydalanilgan akademik adabiyotlar bazasi
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ushbu platforma va qo‘llanmalarni tuzishda foydalanilgan asosiy darsliklar (v2/adabiyotlar kolleksiyasi):
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {academicBibliography.map((book, idx) => (
            <div
              key={book.id}
              className="rounded-xl border border-line bg-bg-2 p-5 sm:p-6 transition-colors hover:border-brand/40"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
                  #{idx + 1} Asosiy darslik
                </span>
                <span className="font-mono text-xs font-semibold text-muted bg-panel px-2.5 py-0.5 rounded-md border border-line">
                  {book.year}-yil • {book.pages}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-bold text-ink">
                {book.authors}. «{book.title}»
              </h3>

              <p className="mt-1 text-xs font-medium text-brand">
                {book.degree}
              </p>

              <p className="mt-1 text-xs text-muted">
                <strong>Nashriyot:</strong> {book.publisher}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {book.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {book.topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-panel px-2.5 py-1 text-[11px] font-medium text-muted"
                  >
                    <CheckCircle2 aria-hidden="true" size={11} className="text-ok" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
