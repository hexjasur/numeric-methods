import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BookOpenText,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Library,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { LearningGuideJsonLd } from '@/components/seo/json-ld';
import { getLearningGuide, learningGuides } from '@/lib/learning-guides';
import { siteConfig } from '@/lib/config';

interface LearningGuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return learningGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: LearningGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getLearningGuide(slug);

  if (!guide) {
    return { title: 'Qo‘llanma topilmadi' };
  }

  const canonical = `/learn/${guide.slug}`;

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${guide.metaTitle} | Sonli Usullar`,
      description: guide.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: 'uz_UZ',
    },
    twitter: {
      card: 'summary',
      title: `${guide.metaTitle} | Sonli Usullar`,
      description: guide.description,
    },
  };
}

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

export default async function LearningGuidePage({ params }: LearningGuidePageProps) {
  const { slug } = await params;
  const guide = getLearningGuide(slug);
  if (!guide) notFound();

  const relatedGuides = learningGuides
    .filter((item) => item.slug !== guide.slug && item.area === guide.area)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-12">
      <LearningGuideJsonLd guide={guide} />

      <nav aria-label="Sahifa yo‘li">
        <Link
          href="/learn"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Barcha akademik qo‘llanmalar
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow)] sm:p-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-brand">
            <BookOpenText aria-hidden="true" size={14} />
            {guide.area}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2.5 py-1 text-xs font-medium text-muted">
            <Library aria-hidden="true" size={13} />
            Akademik darsliklar asosida
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          {guide.title}
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          {guide.summary}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href={guide.calculatorHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-panel transition-all hover:bg-brand hover:text-white"
          >
            <Calculator aria-hidden="true" size={17} />
            Interaktiv hisoblagichni ochish
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
          <a
            href="#manbalar"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-bg-2 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40"
          >
            <Library aria-hidden="true" size={16} className="text-brand" />
            Adabiyotlar ({guide.sources.length})
          </a>
        </div>
      </header>

      {/* Asosiy formula */}
      <section aria-labelledby="guide-formula" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="text-cyan" size={20} />
          <h2 id="guide-formula" className="text-xl font-bold text-ink">
            Asosiy formula
          </h2>
        </div>
        <div
          className="mt-4 overflow-x-auto rounded-xl border border-dashed border-line-2 bg-bg-2 p-5 text-center text-cyan [&_.katex-display]:my-0 [&_.katex]:text-lg sm:[&_.katex]:text-xl"
          dangerouslySetInnerHTML={{ __html: renderKatex(guide.formulaTex, true) }}
        />
        <p className="mt-3 font-mono text-xs text-muted">
          Matnli ifoda: {guide.formula}
        </p>
      </section>

      {/* Nazariy asoslar va teoremalar */}
      <section aria-labelledby="guide-theory" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <BookOpen aria-hidden="true" className="text-brand" size={20} />
          <h2 id="guide-theory" className="text-xl font-bold text-ink">
            Nazariy asoslar va teoremalar
          </h2>
        </div>
        <div className="mt-4 space-y-3">
          {guide.theory.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3.5 rounded-xl border border-line bg-bg-2 p-4 text-sm leading-relaxed text-muted"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-xs font-bold text-brand">
                {idx + 1}
              </span>
              <p className="text-ink-2">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yaqinlashish sharti va xatolik bahosi */}
      {(guide.convergenceTex || guide.errorEstimateTex) && (
        <section aria-labelledby="guide-convergence" className="grid gap-6 md:grid-cols-2">
          {guide.convergenceTex && (
            <div className="rounded-2xl border border-line bg-panel p-6">
              <h3 id="guide-convergence" className="text-base font-bold text-ink">
                Yaqinlashish sharti (Teorema)
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                {guide.convergenceCondition}
              </p>
              <div
                className="mt-3 overflow-x-auto rounded-lg border border-dashed border-line bg-bg-2 p-3 text-center text-sm text-cyan [&_.katex]:text-[1.05em]"
                dangerouslySetInnerHTML={{ __html: renderKatex(guide.convergenceTex, true) }}
              />
            </div>
          )}

          {guide.errorEstimateTex && (
            <div className="rounded-2xl border border-line bg-panel p-6">
              <h3 className="text-base font-bold text-ink">
                Xatolikni baholash formulasi
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Nazariy aprior va aposterior baholar:
              </p>
              <div
                className="mt-3 overflow-x-auto rounded-lg border border-dashed border-line bg-bg-2 p-3 text-center text-sm text-cyan [&_.katex]:text-[1.05em]"
                dangerouslySetInnerHTML={{ __html: renderKatex(guide.errorEstimateTex, true) }}
              />
            </div>
          )}
        </section>
      )}

      {/* Platformadagi qabul qilingan standart va konvensiyalar (Ziddiyatlar yechimi) */}
      <section
        aria-labelledby="guide-conventions"
        className="rounded-2xl border-2 border-brand/30 bg-brand-soft/20 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5 text-brand">
          <Lightbulb aria-hidden="true" size={22} />
          <h2 id="guide-conventions" className="text-xl font-bold text-ink">
            💡 Platformadagi qabul qilingan standart va kiritish qoidalari
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Klassik universitet darsliklarida turli mualliflar indekslar, formulalar va to‘xtash shartlarini
          turlicha belgilashgan bo‘lishi mumkin. Quyida ushbu tafovutlar{' '}
          <strong className="text-ink">Sonli Usullar interaktiv platformasida</strong> qanday ko‘rinishda kiritilishi
          va hisoblanishi aniq tushuntirilgan:
        </p>

        <div className="mt-5 space-y-4">
          {guide.platformConventions.map((conv, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-panel p-5 shadow-xs"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand">
                {conv.topic}
              </h3>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-bg-2 p-3">
                  <span className="block text-xs font-bold text-muted">Adabiyotlardagi an’anaviy holat:</span>
                  <p className="mt-1 text-xs leading-relaxed text-ink-2">
                    {conv.textbookStandard}
                  </p>
                </div>
                <div className="rounded-lg border border-brand/30 bg-brand-soft/30 p-3">
                  <span className="block text-xs font-bold text-brand">Platformadagi yechim va kiritish:</span>
                  <p className="mt-1 text-xs leading-relaxed text-ink font-medium">
                    {conv.platformImplementation}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                <strong className="text-ink">Nega shunday?</strong> {conv.whyChosen}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Qadam-baqadam algoritm */}
      <section aria-labelledby="guide-steps" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 id="guide-steps" className="text-xl font-bold text-ink">
          Qadam-baqadam hisoblash algoritmi
        </h2>
        <ol className="mt-4 grid gap-3">
          {guide.steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6 text-muted">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-xs font-bold text-brand">
                {index + 1}
              </span>
              <span className="text-ink-2">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Ishlangan namunaviy misol */}
      <section aria-labelledby="guide-example" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 id="guide-example" className="text-xl font-bold text-ink">
          Ishlangan namunaviy misol (Darslikdan)
        </h2>
        <div className="mt-4 rounded-xl border border-line bg-bg-2 p-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand">Masalaning qo‘yilishi</p>
          <p className="mt-1 text-sm font-semibold text-ink">{guide.example.problem}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Hisob-kitob jarayoni</p>
          <p className="mt-1 overflow-x-auto rounded-lg bg-bg-2 p-4 font-mono text-sm leading-relaxed text-ink">
            {guide.example.calculation}
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-ok/30 bg-ok/5 p-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-ok">Natija va tahlil</p>
          <p className="mt-1 text-sm font-semibold text-ink">{guide.example.result}</p>
        </div>
      </section>

      {/* Qo‘llanish va cheklovlar */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <div className="flex items-center gap-2 text-ok">
            <CheckCircle2 aria-hidden="true" size={18} />
            <h2 className="text-base font-bold text-ink">Qachon ishlatiladi?</h2>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {guide.whenToUse.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <div className="flex items-center gap-2 text-neg">
            <ShieldAlert aria-hidden="true" size={18} />
            <h2 className="text-base font-bold text-ink">Kamchiliklari va cheklovlari</h2>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {guide.limitations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Foydalanilgan adabiyotlar va manbalar */}
      <section id="manbalar" aria-labelledby="guide-sources" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <Library aria-hidden="true" className="text-brand" size={20} />
          <h2 id="guide-sources" className="text-xl font-bold text-ink">
            Foydalanilgan akademik adabiyotlar va manbalar
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Ushbu qo‘llanmadagi nazariya, teoremalar va misollar loyihadagi quyidagi tasdiqlangan darsliklardan olindi:
        </p>
        <div className="mt-4 divide-y divide-line">
          {guide.sources.map((src, idx) => (
            <div key={idx} className="py-4 first:pt-2 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-ink text-sm sm:text-base">
                  {idx + 1}. {src.authors} ({src.year})
                </h3>
                <span className="font-mono text-xs text-brand font-semibold">
                  {src.pages}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium italic text-ink-2">
                «{src.title}». {src.publisher}
              </p>
              <p className="mt-1 text-xs text-muted">
                <strong>Bo‘lim:</strong> {src.chapterSection}
              </p>
              {src.note && (
                <p className="mt-1 text-xs text-muted">
                  <strong>Izoh:</strong> {src.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ko‘p so‘raladigan savollar */}
      <section aria-labelledby="guide-questions" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <HelpCircle aria-hidden="true" className="text-cyan" size={20} />
          <h2 id="guide-questions" className="text-xl font-bold text-ink">
            Ko‘p so‘raladigan savollar va muammoli vaziyatlar
          </h2>
        </div>
        <div className="mt-4 divide-y divide-line">
          {guide.questions.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-2 last:pb-0">
              <h3 className="font-semibold text-ink text-sm sm:text-base">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA to calculator */}
      <div className="rounded-2xl border border-line bg-bg-2 p-6 sm:p-8 text-center">
        <h3 className="text-xl font-bold text-ink">Nazariyani amalda sinab ko‘ring</h3>
        <p className="mt-2 text-sm text-muted max-w-xl mx-auto">
          Ushbu mavzu bo‘yicha istalgan parametrlaringizni interaktiv kalkulyatorga kiriting va qadam-baqadam natijalarni oling.
        </p>
        <Link
          href={guide.calculatorHref}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Calculator aria-hidden="true" size={17} />
          {guide.title} kalkulyatorini ochish
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <nav aria-label="Tegishli qo‘llanmalar" className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">Mavzuga doir boshqa qo‘llanmalar</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {relatedGuides.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/learn/${related.slug}`}
                  className="inline-flex min-h-10 items-center rounded-xl border border-line bg-bg-2 px-4 text-sm font-semibold text-brand transition-colors hover:border-brand/50 hover:bg-panel"
                >
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
