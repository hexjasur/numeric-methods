'use client';

import { useAppUpdate } from './update-context';
import { UpdateModal } from './update-modal';
import { UpdatingScreen } from './updating-screen';
import { CheckCircle2 } from 'lucide-react';

export function UpdaterHost() {
  const {
    updateInfo,
    showModal,
    isUpdating,
    progress,
    statusText,
    toastMessage,
    startUpdate,
    closeModal,
  } = useAppUpdate();

  return (
    <>
      {showModal && updateInfo && (
        <UpdateModal
          updateInfo={updateInfo}
          onConfirm={startUpdate}
          onClose={closeModal}
        />
      )}

      {isUpdating && (
        <UpdatingScreen progress={progress} statusText={statusText} />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-4 py-3 shadow-[var(--shadow)] font-mono text-xs text-[var(--ink)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[var(--ok)] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default UpdaterHost;
