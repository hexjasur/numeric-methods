'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

// Short note that travels with a shared example: ?note=...
export const SHARE_NOTE_MAX = 140;
const NOTE_PARAM = 'note';

function readNote(search: string): string {
  return (new URLSearchParams(search).get(NOTE_PARAM) ?? '').trim().slice(0, SHARE_NOTE_MAX);
}

// Link for the current example, with the note added (or removed when empty)
export function buildShareUrl(note: string): string {
  const url = new URL(window.location.href);
  const trimmed = note.trim().slice(0, SHARE_NOTE_MAX);
  if (trimmed) url.searchParams.set(NOTE_PARAM, trimmed);
  else url.searchParams.delete(NOTE_PARAM);
  return url.toString();
}

const noopSubscribe = () => () => {};

// The note from the URL. Server render and first client render both see '' so hydration matches.
export function useSharedNote(): { note: string; dismiss: () => void } {
  const fromUrl = useSyncExternalStore(
    noopSubscribe,
    () => readNote(window.location.search),
    () => '',
  );
  const [dismissedNote, setDismissedNote] = useState<string | null>(null);
  return {
    note: dismissedNote === fromUrl ? '' : fromUrl,
    dismiss: () => setDismissedNote(fromUrl),
  };
}

export function SharedNoteBanner({ note, onDismiss }: { note: string; onDismiss: () => void }) {
  const { t } = useI18n();
  if (!note) return null;
  return (
    <div
      role="note"
      className="mb-4 flex items-start gap-3 rounded-lg border border-brand/40 bg-brand-soft px-4 py-3"
    >
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[.12em] text-brand">
          {t('share.banner_label')}
        </div>
        <p className="mt-1 break-words text-[14px] text-ink">{note}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('share.banner_dismiss')}
        className="shrink-0 rounded-md p-1 text-muted hover:text-ink"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ShareExampleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    areaRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(note));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [note]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-example-title"
        className="relative w-full max-w-md rounded-xl border border-line bg-panel p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="share-example-title" className="text-lg font-bold text-ink">
            {t('share.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('share.close')}
            className="rounded-md p-1 text-muted hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 flex items-center justify-between text-xs font-semibold text-ink">
            <span>{t('share.note_label')}</span>
            <span className="font-mono text-muted">
              {note.length}/{SHARE_NOTE_MAX}
            </span>
          </span>
          <textarea
            ref={areaRef}
            rows={2}
            maxLength={SHARE_NOTE_MAX}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('share.note_placeholder')}
            className="w-full resize-none rounded-lg border border-line bg-bg-2 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t('share.hint')}</p>

        <button
          type="button"
          onClick={copy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 font-semibold text-brand-ink hover:opacity-90"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t('share.copied') : t('share.copy')}
        </button>
      </div>
    </div>
  );
}
