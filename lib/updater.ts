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

  try {
    // 1. Try checking via GitHub Releases API
    const response = await fetch(
      'https://api.github.com/repos/hexjasur/numeric-methods/releases/latest',
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }

    const release = (await response.json()) as GitHubRelease;
    const latestVersion = release.tag_name.replace(/^v/, '');
    const available = isNewerVersion(currentVersion, latestVersion);

    // Smart platform-aware asset selection (Android, Windows, Linux)
    const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
    const isWindows = typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent);

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

    let tauriAvailable = false;
    // Check if running inside Tauri
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
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
      downloadUrl: primaryAsset?.browser_download_url,
      tauriAvailable,
    };
  } catch {
    return null;
  }
}
