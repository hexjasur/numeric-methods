export const dynamic = 'force-static';
import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

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

    methodRoutes = methods.map((method) => ({
      url: `${baseUrl}/methods/${method}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (e) {
    //
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/docs/syntax`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...methodRoutes,
  ];
}

