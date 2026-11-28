'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';

export type ToastKind = 'error' | 'success';

type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastContextValue = {
  showToast: (kind: ToastKind, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const AUTO_DISMISS_MS = 6000;
const MAX_VISIBLE_TOASTS = 2;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current.slice(-(MAX_VISIBLE_TOASTS - 1)), { id, kind, message }]);
    window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+72px)] z-[60] flex flex-col items-center gap-2.5 px-4"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} closeLabel={t('toast.close')} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss, closeLabel }: { item: ToastItem; onDismiss: () => void; closeLabel: string }) {
  const isError = item.kind === 'error';
  const Icon = isError ? CircleAlert : CircleCheck;
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="toast-frame pointer-events-auto relative w-full max-w-[460px] rounded-xl p-[1.5px] shadow-[var(--shadow)]"
    >
      <div className="toast-spin" aria-hidden="true" />
      <div className="relative flex items-start gap-3 rounded-[10.5px] bg-panel px-4 py-3">
        <Icon size={18} className={`mt-0.5 shrink-0 ${isError ? 'text-neg' : 'text-pos'}`} aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink">{item.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={closeLabel}
          className="shrink-0 rounded-md p-1 text-muted hover:bg-bg-2 hover:text-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
