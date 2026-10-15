import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
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

export default async function LearningGuidePage({ params }: LearningGuidePageProps) {
  const { slug } = await params;
  const guide = getLearningGuide(slug);
  if (!guide) notFound();

  const relatedGuides = learningGuides
    .filter((item) => item.slug !== guide.slug && item.area === guide.area)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl">
      <LearningGuideJsonLd guide={guide} />
      <nav aria-label="Sahifa yo‘li" className="mb-6">
        <Link
          href="/learn"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Barcha qo‘llanmalar
        </Link>
      </nav>

      <header className="rounded-xl border border-line bg-panel p-7 shadow-[var(--shadow)] sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-[.14em] text-brand">
          {guide.area} / O‘zbekcha qo‘llanma
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted sm:text-lg">{guide.summary}</p>
        <Link
          href={guide.calculatorHref}
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-panel transition-colors hover:bg-brand hover:text-white"
        >
          Interaktiv hisoblagichni ochish
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </header>

      <div className="mt-8 grid gap-6">
        <section aria-labelledby="guide-formula" className="rounded-xl border border-line bg-bg-2 p-6 sm:p-8">
          <h2 id="guide-formula" className="text-xl font-bold text-ink">Asosiy formula</h2>
          <p className="mt-3 overflow-x-auto rounded-lg border border-line bg-panel p-4 font-mono text-sm leading-7 text-cyan">
            {guide.formula}
          </p>
        </section>

        <section aria-labelledby="guide-steps" className="rounded-xl border border-line bg-panel p-6 sm:p-8">
          <h2 id="guide-steps" className="text-xl font-bold text-ink">Qadam-baqadam algoritm</h2>
          <ol className="mt-4 grid gap-3">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="guide-example" className="rounded-xl border border-line bg-panel p-6 sm:p-8">
          <h2 id="guide-example" className="text-xl font-bold text-ink">Ishlangan misol</h2>
          <p className="mt-4 text-sm leading-6 text-muted">{guide.example.problem}</p>
          <p className="mt-3 overflow-x-auto rounded-lg bg-bg-2 p-4 font-mono text-sm leading-6 text-ink">
            {guide.example.calculation}
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-ink">{guide.example.result}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-ink">Qachon ishlatiladi?</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {guide.whenToUse.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-ink">Cheklovlari</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {guide.limitations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section aria-labelledby="guide-questions" className="rounded-xl border border-line bg-panel p-6 sm:p-8">
          <h2 id="guide-questions" className="text-xl font-bold text-ink">Ko‘p so‘raladigan savollar</h2>
          <div className="mt-4 divide-y divide-line">
            {guide.questions.map((item) => (
              <div key={item.question} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedGuides.length > 0 && (
          <nav aria-label="Tegishli qo‘llanmalar" className="rounded-xl border border-line bg-bg-2 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink">Tegishli mavzular</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {relatedGuides.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/learn/${related.slug}`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-line bg-panel px-4 text-sm font-semibold text-brand hover:border-brand/50"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
