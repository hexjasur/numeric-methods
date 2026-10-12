import packageJson from '@/package.json';

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url?: string;
  assets: GitHubAsset[];
}

export interface UpdateInfo {
  available: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseTitle: string;
  releaseNotes: string;
  publishedAt: string;
  downloadUrl?: string;
  assetName?: string;
  isAndroid: boolean;
  isWindows: boolean;
  isTauriDesktop: boolean;
  tauriAvailable: boolean;
}

// Semver comparison: returns true if vB is strictly newer than vA
export function isNewerVersion(current: string, remote: string): boolean {
  const cleanCurrent = current.replace(/^v/, '').trim();
  const cleanRemote = remote.replace(/^v/, '').trim();

  const partsA = cleanCurrent.split('.').map((p) => Number.parseInt(p, 10) || 0);
  const partsB = cleanRemote.split('.').map((p) => Number.parseInt(p, 10) || 0);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] ?? 0;
    const b = partsB[i] ?? 0;
    if (b > a) return true;
    if (b < a) return false;
  }
  return false;
}

export async function checkForAppUpdates(): Promise<UpdateInfo | null> {
  const currentVersion = packageJson.version;

  // Platform detection
  const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  const isWindows = typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent);
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  const isTauriDesktop = isTauri && !isAndroid;

  try {
    // 1. Try checking via GitHub Releases API
    const response = await fetch(
      'https://api.github.com/repos/hexjasur/numeric-methods/releases/latest',
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      },
    );

    // If repository has no published releases yet, GitHub returns 404 Not Found.
    // In this case, the app is already on the latest available version.
    if (response.status === 404) {
      return {
        available: false,
        currentVersion,
        latestVersion: currentVersion,
        releaseTitle: `v${currentVersion}`,
        releaseNotes: '',
        publishedAt: '',
        isAndroid,
        isWindows,
        isTauriDesktop,
        tauriAvailable: false,
      };
    }

    if (!response.ok) {
      return null;
    }

    const release = (await response.json()) as GitHubRelease;
    const latestVersion = release.tag_name.replace(/^v/, '');
    const available = isNewerVersion(currentVersion, latestVersion);

    let primaryAsset: GitHubAsset | undefined;
    if (isAndroid) {
      primaryAsset =
        release.assets.find((a) => a.name.includes('arm64') && a.name.endsWith('.apk')) ||
        release.assets.find((a) => a.name.endsWith('.apk'));
    } else if (isWindows) {
      primaryAsset = release.assets.find((a) => a.name.endsWith('.exe') || a.name.endsWith('.msi'));
    } else {
      primaryAsset = release.assets.find(
        (a) => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.endsWith('.apk'),
      );
    }

    if (!primaryAsset && release.assets.length > 0) {
      primaryAsset = release.assets[0];
    }

    const fallbackUrl = release.html_url || 'https://github.com/hexjasur/numeric-methods/releases/latest';
    const downloadUrl = primaryAsset?.browser_download_url || fallbackUrl;

    let tauriAvailable = false;
    if (isTauriDesktop) {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const update = await check();
        if (update?.available) {
          tauriAvailable = true;
        }
      } catch {
        // Tauri updater not configured with signer or endpoint yet
      }
    }

    return {
      available,
      currentVersion,
      latestVersion,
      releaseTitle: release.name || `v${latestVersion}`,
      releaseNotes: release.body || '',
      publishedAt: release.published_at,
      downloadUrl,
      assetName: primaryAsset?.name,
      isAndroid,
      isWindows,
      isTauriDesktop,
      tauriAvailable,
    };
  } catch {
    return null;
  }
}

