'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    let frame = 0;
    let lastVisibility = false;

    const updateVisibility = () => {
      frame = 0;
      const nextVisibility = window.scrollY > 400;
      if (nextVisibility !== lastVisibility) {
        lastVisibility = nextVisibility;
        setVisible(nextVisibility);
      }
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={t('a11y.backToTop')}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth';
        window.scrollTo({ top: 0, behavior });
      }}
      className={`fixed bottom-[calc(22px+var(--sab))] right-4 z-40 grid size-12 place-items-center rounded-full border border-line bg-panel text-brand shadow-[var(--shadow)] transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:right-6 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp aria-hidden="true" size={20} />
    </button>
  );
}
