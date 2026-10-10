'use client';

import { useI18n } from '@/components/i18n-provider';
import { Languages, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LangToggle() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'uz', label: 'UZB' },
    { value: 'ru', label: 'RUS' },
    { value: 'en', label: 'ENG' },
  ];

  const currentLabel = options.find((o) => o.value === locale)?.label;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-[var(--panel)] px-3 font-mono text-xs font-semibold tracking-wide transition focus-visible:outline-2 focus-visible:outline-[var(--cyan)] ${
          open 
            ? 'border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-soft)] shadow-sm' 
            : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]'
        }`}
        aria-label="Tilni o'zgartirish"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Languages size={16} />
          <span>{currentLabel}</span>
        </div>
        <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[96px] rounded-lg border border-[var(--line)] bg-[var(--panel)] p-1.5 shadow-[var(--shadow)] animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => {
            const active = opt.value === locale;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setLocale(opt.value as any);
                  setOpen(false);
                }}
                className={`group flex w-full items-center justify-center rounded-md px-2 py-2 font-mono text-xs font-bold transition-all ${
                  active 
                    ? 'bg-[var(--ink)] text-[var(--brand)] shadow-[0_4px_12px_-6px_var(--ink)]' 
                    : 'text-[var(--muted)] hover:bg-[var(--bg-2)] hover:text-[var(--ink)] hover:-translate-y-[1px] hover:shadow-sm font-semibold'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
