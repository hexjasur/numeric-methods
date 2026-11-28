// Latest published release of the app, read from the public GitHub API.
export const RELEASES_REPO = 'hexjasur/numeric-methods';
export const RELEASES_PAGE_URL = `https://github.com/${RELEASES_REPO}/releases/latest`;
const LATEST_API_URL = `https://api.github.com/repos/${RELEASES_REPO}/releases/latest`;

export type ReleaseAsset = { name: string; browser_download_url: string; size: number };
export type LatestRelease = { tag_name: string; name: string | null; html_url: string; published_at: string | null; assets: ReleaseAsset[] };

export type PlatformId = 'windows' | 'android' | 'macos' | 'linux';

// Patterns are tried in order; the first pattern that matches an asset wins.
export const PLATFORMS: { id: PlatformId; label: string; patterns: RegExp[] }[] = [
  { id: 'windows', label: 'Windows', patterns: [/-setup\.exe$/i, /\.msi$/i] },
  { id: 'android', label: 'Android', patterns: [/universal\.apk$/i, /\.apk$/i] },
  { id: 'macos', label: 'macOS', patterns: [/\.dmg$/i] },
  { id: 'linux', label: 'Linux', patterns: [/\.AppImage$/i, /\.deb$/i, /\.rpm$/i] },
];

// Picks the preferred asset for each platform. Missing platforms map to null.
export function assetsByPlatform(assets: ReleaseAsset[]): Record<PlatformId, ReleaseAsset | null> {
  const result = { windows: null, android: null, macos: null, linux: null } as Record<PlatformId, ReleaseAsset | null>;
  for (const platform of PLATFORMS) {
    for (const pattern of platform.patterns) {
      const match = assets.find((asset) => pattern.test(asset.name));
      if (match) {
        result[platform.id] = match;
        break;
      }
    }
  }
  return result;
}

export function detectPlatform(userAgent: string): PlatformId | null {
  if (/Android/i.test(userAgent)) return 'android';
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macos';
  if (/Linux|X11/i.test(userAgent)) return 'linux';
  return null;
}

export async function fetchLatestRelease(signal?: AbortSignal): Promise<LatestRelease> {
  const response = await fetch(LATEST_API_URL, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  });
  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
  return (await response.json()) as LatestRelease;
}
