'use client';

import { useI18n } from '@/components/i18n-provider';
import { Sparkles, Terminal } from 'lucide-react';

interface UpdatingScreenProps {
  progress: number;
  statusText?: string;
}

export function UpdatingScreen({ progress, statusText }: UpdatingScreenProps) {
  const { t } = useI18n();

  const displayStatus =
    statusText ||
    t('updater.status_downloading', {
      percent: Math.min(100, Math.max(0, Math.round(progress))),
    });

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07080b] text-[#eef0f2] select-none overflow-hidden font-sans">
      {/* Ambient background glows matching user's design */}
      <div 
        className="pointer-events-none absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #e8480c 0%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute -right-[10%] bottom-[15%] h-[550px] w-[550px] rounded-full opacity-25 blur-[150px]"
        style={{ background: 'radial-gradient(circle, #0891b2 0%, #3b82f6 40%, transparent 70%)' }}
      />

      {/* Subtle diagonal background grid stripes */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 16px)',
        }}
      />

      {/* Center content container */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center animate-in fade-in duration-700">
        {/* Title typography */}
        <h1 className="flex items-baseline gap-2.5 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight text-white">
          <span className="text-[#ff6a2b] font-extrabold italic">
            {t('updater.screen_title_accent')}
          </span>
          <span className="font-serif font-bold text-[#f5f6f8] tracking-[-0.02em]">
            {t('updater.screen_title_rest')}
          </span>
        </h1>

        {/* Sleek horizontal progress bar */}
        <div className="mt-8 mb-6 h-[3px] w-[380px] max-w-[85vw] overflow-hidden rounded-full bg-white/10 shadow-[0_0_15px_rgba(255,106,43,0.2)]">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(100, Math.max(2, progress))}%`,
              background:
                'linear-gradient(90deg, #ff6a2b 0%, #fb923c 45%, #22d3ee 100%)',
              boxShadow: '0 0 12px rgba(255, 106, 43, 0.6), 0 0 20px rgba(34, 211, 238, 0.4)',
            }}
          />
        </div>

        {/* Status text */}
        <p className="font-mono text-[13px] tracking-wider text-[#9ba3af] transition-all duration-200">
          {displayStatus}
        </p>

        {/* Discrete technical badge */}
        <div className="mt-6 flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono text-[#6c7482]">
          <Terminal size={12} className="text-[#22d3ee]" />
          <span>OTA / BUNDLE VERIFICATION</span>
        </div>
      </div>

      {/* Bottom right discreet logo accent */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[11px] text-white/20">
        <Sparkles size={14} className="text-[#ff6a2b]/40 animate-pulse" />
        <span className="tracking-widest">NUMERIC LAB</span>
      </div>
    </div>
  );
}
