'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Download, ExternalLink, Monitor, Smartphone, Apple, Terminal } from 'lucide-react';
import { useI18n } from '@/components/i18n-provider';
import { PsHero, PsStrip, PsPanel, PsPanelHead } from '@/components/ui/print-stream';
import {
  PLATFORMS,
  RELEASES_PAGE_URL,
  assetsByPlatform,
  detectPlatform,
  fetchLatestRelease,
  type LatestRelease,
  type PlatformId,
  type ReleaseAsset,
} from '@/lib/github-release';

const ICONS: Record<PlatformId, typeof Monitor> = {
  windows: Monitor,
  android: Smartphone,
  macos: Apple,
  linux: Terminal,
};

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function DownloadPage() {
  const { t } = useI18n();
  const [release, setRelease] = useState<LatestRelease | null>(null);
  const [failed, setFailed] = useState(false);
  // Browser-only value; the server snapshot is null so the static HTML has no platform guess.
  const platform = useSyncExternalStore(() => () => {}, () => detectPlatform(navigator.userAgent), () => null as PlatformId | null);

  useEffect(() => {
    const controller = new AbortController();
    fetchLatestRelease(controller.signal)
      .then(setRelease)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const assets = useMemo(() => (release ? assetsByPlatform(release.assets) : null), [release]);
  const recommended: ReleaseAsset | null = platform && assets ? assets[platform] : null;
  const recommendedLabel = PLATFORMS.find((p) => p.id === platform)?.label ?? null;

  return (
    <div className="relative mx-auto max-w-[1160px] px-0 sm:px-2 md:px-4 pb-12">
      <PsStrip eyebrow="DWN-001" id="APP" name={t('download.strip')} />

      <PsHero
        eyebrow={t('download.eyebrow')}
        title={<>{t('download.title')}</>}
        titleHighlight={t('download.titleHighlight')}
        lead={t('download.lead')}
      />

      <PsPanel>
        <PsPanelHead eyebrow={t('download.recommend_eyebrow')} title={t('download.recommend_title')} idx="01" />

        {!release && !failed && <p className="text-sm text-muted">{t('download.loading')}</p>}

        {failed && (
          <p className="text-sm text-muted">
            {t('download.error')}{' '}
            <a href={RELEASES_PAGE_URL} target="_blank" rel="noreferrer" className="text-brand underline">
              {t('download.open_releases')}
            </a>
          </p>
        )}

        {release && (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-brand/25 bg-brand-soft p-5">
              <div className="min-w-0">
                <span className="block font-mono text-xs font-semibold uppercase tracking-[.12em] text-muted">
                  {t('download.latest_version', { version: release.tag_name })}
                </span>
                <strong className="mt-1 block text-lg text-ink">
                  {recommendedLabel ?? t('download.choose_platform')}
                </strong>
                {recommended && (
                  <small className="font-mono text-xs text-muted">{recommended.name} · {formatSize(recommended.size)}</small>
                )}
              </div>
              {recommended ? (
                <a
                  href={recommended.browser_download_url}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-semibold text-brand-ink hover:opacity-90"
                >
                  <Download size={18} aria-hidden="true" />
                  {t('download.button', { platform: recommendedLabel ?? '' })}
                </a>
              ) : (
                <a
                  href={release.html_url || RELEASES_PAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-2 bg-panel px-5 py-2.5 font-semibold text-ink hover:border-brand"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  {t('download.open_releases')}
                </a>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PLATFORMS.map((p) => {
                const Icon = ICONS[p.id];
                const asset = assets?.[p.id] ?? null;
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-line bg-bg-2 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon size={20} className="shrink-0 text-cyan" aria-hidden="true" />
                      <div className="min-w-0">
                        <b className="block text-sm text-ink">{p.label}</b>
                        <small className="block truncate font-mono text-xs text-muted">
                          {asset ? asset.name : t('download.not_available')}
                        </small>
                      </div>
                    </div>
                    {asset && (
                      <a
                        href={asset.browser_download_url}
                        download
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line-2 px-3 py-1.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                      >
                        <Download size={14} aria-hidden="true" />
                        {t('download.download_short')}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted">
              {t('download.release_page')}{' '}
              <a href={release.html_url || RELEASES_PAGE_URL} target="_blank" rel="noreferrer" className="text-cyan underline">
                {t('download.open_releases')}
              </a>
            </p>
          </div>
        )}
      </PsPanel>
    </div>
  );
}
