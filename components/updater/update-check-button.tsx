'use client';

import { useI18n } from '@/components/i18n-provider';
import { useAppUpdate } from './update-context';
import { RotateCw } from 'lucide-react';

export function UpdateCheckButton() {
  const { t } = useI18n();
  const { isChecking, checkForUpdates } = useAppUpdate();

  return (
    <button
      onClick={() => checkForUpdates(true)}
      disabled={isChecking}
      className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)] disabled:opacity-75 disabled:cursor-not-allowed"
      aria-label={t('updater.btn_check_update')}
      title={t('updater.btn_check_update')}
    >
      <RotateCw
        size={16}
        className={`transition-transform duration-200 ${
          isChecking ? 'animate-spin text-[var(--brand)]' : ''
        }`}
      />
    </button>
  );
}

export default UpdateCheckButton;
