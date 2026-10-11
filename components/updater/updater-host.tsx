'use client';

import { useI18n } from '@/components/i18n-provider';
import { checkForAppUpdates, type UpdateInfo } from '@/lib/updater';
import { useEffect, useState } from 'react';
import { UpdateModal } from './update-modal';
import { UpdatingScreen } from './updating-screen';

export function UpdaterHost() {
  const { t } = useI18n();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    // Small delay to ensure smooth initial hydration and page paint
    const timer = setTimeout(async () => {
      try {
        const info = await checkForAppUpdates();
        if (mounted && info?.available) {
          setUpdateInfo(info);
          setShowModal(true);
        }
      } catch {
        // Silent catch for background check
      }
    }, 2500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleStartUpdate = async () => {
    if (!updateInfo) return;

    setShowModal(false);
    setIsUpdating(true);
    setProgress(5);
    setStatusText(t('updater.status_checking'));

    // Check if running inside Tauri Desktop
    const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

    if (isTauri && updateInfo.tauriAvailable) {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const update = await check();

        if (update?.available) {
          let downloaded = 0;
          let contentLength = 0;

          await update.downloadAndInstall((event) => {
            if (event.event === 'Started') {
              contentLength = event.data.contentLength ?? 0;
            } else if (event.event === 'Progress') {
              downloaded += event.data.chunkLength;
              const percent = contentLength > 0 ? (downloaded / contentLength) * 100 : 50;
              setProgress(percent);
              setStatusText(
                t('updater.status_downloading', {
                  percent: Math.min(99, Math.round(percent)),
                }),
              );
            } else if (event.event === 'Finished') {
              setProgress(100);
              setStatusText(t('updater.status_installing'));
            }
          });

          setStatusText(t('updater.status_ready'));
          setTimeout(async () => {
            try {
              const { relaunch } = await import('@tauri-apps/plugin-process');
              await relaunch();
            } catch {
              window.location.reload();
            }
          }, 1500);
          return;
        }
      } catch (err) {
        console.error('Tauri update error:', err);
      }
    }

    // Direct browser / simulated download fallback for web & Android
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setStatusText(t('updater.status_ready'));

        // If direct download link is available, trigger it
        setTimeout(() => {
          if (updateInfo.downloadUrl) {
            window.open(updateInfo.downloadUrl, '_blank');
          }
          setTimeout(() => {
            setIsUpdating(false);
          }, 2000);
        }, 1200);
      } else {
        setProgress(currentProgress);
        setStatusText(
          t('updater.status_downloading', {
            percent: Math.round(currentProgress),
          }),
        );
      }
    }, 300);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && updateInfo && (
        <UpdateModal
          updateInfo={updateInfo}
          onConfirm={handleStartUpdate}
          onClose={handleCloseModal}
        />
      )}

      {isUpdating && (
        <UpdatingScreen progress={progress} statusText={statusText} />
      )}
    </>
  );
}
