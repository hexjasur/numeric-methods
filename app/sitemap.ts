export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { siteConfig } from '@/lib/config';

function getFileMtime(relativeFilePath: string): Date {
  try {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    if (fs.existsSync(fullPath)) {
      return fs.statSync(fullPath).mtime;
    }
  } catch {
    // fallback
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const ogImage = `${baseUrl}/images/og-thumbail-1280x640.png`;

  let methodRoutes: MetadataRoute.Sitemap = [];
  try {
    const methodsDir = path.join(
      process.cwd(),
      'app',
      '(workspace)',
      'methods',
    );
    const methods = fs
      .readdirSync(methodsDir)
      .filter(
        (f) =>
          !f.startsWith('.') &&
          fs.statSync(path.join(methodsDir, f)).isDirectory(),
      );

    methodRoutes = methods.map((method) => {
      const pageFile = path.join('app', '(workspace)', 'methods', method, 'page.tsx');
      return {
        url: `${baseUrl}/methods/${method}`,
        lastModified: getFileMtime(pageFile),
        changeFrequency: 'weekly',
        priority: 0.9,
        images: [ogImage],
      };
    });
  } catch {
    // fallback
  }

  return [
    {
      url: baseUrl,
      lastModified: getFileMtime(path.join('app', '(workspace)', 'page.tsx')),
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [ogImage],
    },
    ...methodRoutes,
    {
      url: `${baseUrl}/docs/syntax`,
      lastModified: getFileMtime(path.join('app', '(workspace)', 'docs', 'syntax', 'page.tsx')),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [ogImage],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: getFileMtime(path.join('app', '(workspace)', 'about', 'page.tsx')),
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [ogImage],
    },
  ];
}
