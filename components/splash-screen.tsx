'use client';

import { useEffect, useState } from 'react';

const SHOW_MS = 2100;
const FADE_MS = 450;
const REDUCED_SHOW_MS = 150;

/**
 * Full-screen splash shown once per page load.
 *
 * Renders visible on the server, so the static HTML already contains it and
 * there is no flash of the app before hydration. Dismissed on the client
 * after the logo animation finishes.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showFor = reduced ? REDUCED_SHOW_MS : SHOW_MS;

    const fadeTimer = window.setTimeout(() => setLeaving(true), showFor);
    const removeTimer = window.setTimeout(
      () => setVisible(false),
      showFor + (reduced ? 0 : FADE_MS),
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <noscript>
        <style>{'#app-splash{display:none!important}'}</style>
      </noscript>
      <div
        id="app-splash"
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-6 bg-bg transition-opacity ease-out ${
          leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        <span className="sr-only">Yuklanmoqda</span>

        <svg
          viewBox="0 0 200 200"
          className="h-40 w-40 overflow-visible sm:h-52 sm:w-52"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Glass frame */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '0s' } as React.CSSProperties}
            d="M100 14C160 14 186 40 186 100C186 160 160 186 100 186C40 186 14 160 14 100C14 40 40 14 100 14Z"
            stroke="var(--line-2)"
            strokeWidth={3}
          />
          <path
            pathLength={1}
            className="splash-fill"
            style={{ '--d': '0.8s' } as React.CSSProperties}
            d="M100 14C160 14 186 40 186 100C186 160 160 186 100 186C40 186 14 160 14 100C14 40 40 14 100 14Z"
            fill="var(--panel)"
          />

          {/* Y axis + arrow */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '0.25s' } as React.CSSProperties}
            d="M72 172V34M64 46L72 34L80 46"
            stroke="var(--ink-2)"
            strokeWidth={3.5}
          />
          {/* X axis + arrow */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '0.4s' } as React.CSSProperties}
            d="M32 120H168M156 112L168 120L156 128"
            stroke="var(--ink-2)"
            strokeWidth={3.5}
          />

          {/* Ticks */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '0.7s' } as React.CSSProperties}
            d="M66 80H78M66 100H78M66 140H78M66 160H78M90 116V124M118 116V124M138 116V124"
            stroke="var(--ink-2)"
            strokeWidth={2.5}
          />

          {/* Sine curve */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '0.75s' } as React.CSSProperties}
            d="M34 64C58 64 86 176 104 120C122 64 146 176 170 120"
            stroke="var(--cyan)"
            strokeWidth={5}
          />

          {/* Guides from the point down to the X axis */}
          <path
            pathLength={1}
            className="splash-draw"
            style={{ '--d': '1.55s' } as React.CSSProperties}
            d="M88 126V150M120 126V150M90 150H100M118 150H108M100 150L92 146M100 150L92 154M108 150L116 146M108 150L116 154"
            stroke="var(--brand)"
            strokeWidth={2.5}
          />

          {/* Orange point */}
          <circle
            cx={104}
            cy={120}
            r={8}
            fill="var(--brand)"
            className="splash-pop"
            style={{ '--d': '1.45s' } as React.CSSProperties}
          />
        </svg>

        <p
          className="splash-fill font-mono text-[11px] uppercase tracking-[0.32em] text-ink-2"
          style={{ '--d': '1.2s' } as React.CSSProperties}
        >
          Numeric / Methods
        </p>
      </div>
    </>
  );
}

export default SplashScreen;
