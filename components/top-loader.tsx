'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextTopLoader, { useTopLoader } from 'nextjs-toploader';

function PathnameListener() {
  const pathname = usePathname();
  const loader = useTopLoader();

  useEffect(() => {
    loader.done();
  }, [pathname, loader]);

  return null;
}

export function TopLoader() {
  return (
    <>
      <NextTopLoader
        color="var(--brand)"
        initialPosition={0.12}
        crawlSpeed={160}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="cubic-bezier(0.2, 0.8, 0.2, 1)"
        speed={260}
        shadow="0 0 12px var(--brand), 0 0 6px var(--cyan)"
        zIndex={99999}
        showForHashAnchor={false}
      />
      <PathnameListener />
    </>
  );
}

export default TopLoader;
