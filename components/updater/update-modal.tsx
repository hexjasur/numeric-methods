'use client';

import { useI18n } from '@/components/i18n-provider';
import type { UpdateInfo } from '@/lib/updater';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onConfirm: () => void;
  onClose: () => void;
}

export function UpdateModal({ updateInfo, onConfirm, onClose }: UpdateModalProps) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[520px] rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--line)',
        }}
      >
        {/* Print Stream corner cut decoration */}
        <div 
          className="pointer-events-none absolute top-0 left-0 h-10 w-10 opacity-80"
          style={{
            background: 'linear-gradient(135deg, var(--ink) 0 50%, transparent 50%)',
          }}
        />

        {/* Header strip */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2 pl-3">
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[var(--brand)]">
              {t('updater.modal_eyebrow')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--muted)] transition hover:bg-[var(--bg-2)] hover:text-[var(--ink)]"
            aria-label="Yopish"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="font-sans text-[18px] font-bold text-[var(--ink)] leading-snug">
                {t('updater.modal_title')}
              </h2>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                <span className="rounded bg-[var(--bg-2)] px-2 py-0.5 text-[var(--muted)]">
                  v{updateInfo.currentVersion}
                </span>
                <span className="text-[var(--brand)] font-bold">→</span>
                <span className="rounded bg-[var(--brand-soft)] px-2 py-0.5 font-bold text-[var(--brand)]">
                  v{updateInfo.latestVersion}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--muted)]">
            {t('updater.modal_desc', {
              version: `v${updateInfo.latestVersion}`,
              current: `v${updateInfo.currentVersion}`,
            })}
          </p>

          {/* Release notes block */}
          {updateInfo.releaseNotes && (
            <div className="mt-4">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {t('updater.changelog_title')}
              </span>
              <div className="max-h-[140px] overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-3 font-mono text-xs text-[var(--ink-2)] leading-relaxed whitespace-pre-wrap">
                {updateInfo.releaseNotes}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 font-mono text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--bg-2)] hover:text-[var(--ink)]"
          >
            {t('updater.btn_later')}
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-lg bg-[var(--ink)] px-5 py-2.5 font-mono text-xs font-bold text-[var(--panel)] shadow-sm transition hover:bg-[var(--brand)] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('updater.btn_update')}</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
