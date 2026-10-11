'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/components/i18n-provider';
import { checkForAppUpdates, type UpdateInfo } from '@/lib/updater';
import packageJson from '@/package.json';

interface UpdateContextType {
  updateInfo: UpdateInfo | null;
  isChecking: boolean;
  showModal: boolean;
  isUpdating: boolean;
  progress: number;
  statusText: string;
  toastMessage: string | null;
  checkForUpdates: (manual?: boolean) => Promise<void>;
  startUpdate: () => Promise<void>;
  closeModal: () => void;
}

const UpdateContext = createContext<UpdateContextType | null>(null);

const SNOOZE_KEY = 'numeric_update_snoozed';

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const checkForUpdates = useCallback(
    async (manual = false) => {
      if (isChecking) return;
      setIsChecking(true);

      try {
        const info = await checkForAppUpdates();
        if (info?.available) {
          setUpdateInfo(info);
          const snoozedVersion = typeof window !== 'undefined' ? sessionStorage.getItem(SNOOZE_KEY) : null;
          // If manual check, always show modal. If automatic, only show if not snoozed in this session.
          if (manual || snoozedVersion !== info.latestVersion) {
            setShowModal(true);
          }
        } else if (manual) {
          showToast(t('updater.status_up_to_date', { version: `v${packageJson.version}` }));
        }
      } catch {
        if (manual) {
          showToast(t('updater.status_error'));
        }
      } finally {
        setIsChecking(false);
      }
    },
    [isChecking, showToast, t],
  );

  useEffect(() => {
    // Initial quiet check after mount
    const timer = setTimeout(() => {
      checkForUpdates(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [checkForUpdates]);

  const closeModal = useCallback(() => {
    if (updateInfo) {
      try {
        sessionStorage.setItem(SNOOZE_KEY, updateInfo.latestVersion);
      } catch {}
    }
    setShowModal(false);
  }, [updateInfo]);

  const startUpdate = useCallback(async () => {
    if (!updateInfo) return;

    // Mark as snoozed so subsequent page refreshes don't immediately pop up modal
    try {
      sessionStorage.setItem(SNOOZE_KEY, updateInfo.latestVersion);
    } catch {}

    // 1. If running inside Tauri Desktop with native updater support
    if (updateInfo.isTauriDesktop && updateInfo.tauriAvailable) {
      setShowModal(false);
      setIsUpdating(true);
      setProgress(5);
      setStatusText(t('updater.status_checking'));

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
      setIsUpdating(false);
    }

    // 2. Direct browser / Android APK download
    setShowModal(false);
    if (updateInfo.downloadUrl) {
      showToast(t('updater.downloading_started'));
      // Trigger download via anchor element
      const link = document.createElement('a');
      link.href = updateInfo.downloadUrl;
      link.download = updateInfo.assetName || '';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [updateInfo, showToast, t]);

  return (
    <UpdateContext.Provider
      value={{
        updateInfo,
        isChecking,
        showModal,
        isUpdating,
        progress,
        statusText,
        toastMessage,
        checkForUpdates,
        startUpdate,
        closeModal,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}

export function useAppUpdate() {
  const ctx = useContext(UpdateContext);
  if (!ctx) throw new Error('useAppUpdate must be used within UpdateProvider');
  return ctx;
}
