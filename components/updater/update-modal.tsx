'use client';

import { useI18n } from '@/components/i18n-provider';
import type { UpdateInfo } from '@/lib/updater';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { MarkdownViewer } from './markdown-viewer';

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onConfirm: () => void;
  onClose: () => void;
}

export function UpdateModal({ updateInfo, onConfirm, onClose }: UpdateModalProps) {
  const { t } = useI18n();

  const buttonLabel = updateInfo.isAndroid
    ? t('updater.btn_download_apk')
    : updateInfo.isWindows && !updateInfo.isTauriDesktop
      ? t('updater.btn_download_exe')
      : t('updater.btn_update');

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[540px] rounded-xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
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
                {updateInfo.isAndroid && (
                  <span className="ml-1 rounded border border-[var(--cyan)]/30 bg-[var(--cyan-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--cyan)]">
                    Android APK
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--muted)]">
            {t('updater.modal_desc', {
              version: `v${updateInfo.latestVersion}`,
              current: `v${updateInfo.currentVersion}`,
            })}
          </p>

          {/* Formatted Release notes block */}
          {updateInfo.releaseNotes && (
            <div className="mt-4">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {t('updater.changelog_title')}
              </span>
              <MarkdownViewer content={updateInfo.releaseNotes} />
            </div>
          )}

          {updateInfo.isAndroid && (
            <div className="mt-3 rounded-lg border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-2.5 text-[11.5px] text-[var(--ink-2)] flex items-start gap-2">
              <span className="text-[var(--brand)] font-bold shrink-0 mt-0.5">ℹ</span>
              <span className="leading-snug">{t('updater.android_install_tip')}</span>
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
            <span>{buttonLabel}</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
