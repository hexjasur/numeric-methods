import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { TopLoader } from "@/components/top-loader";
import { siteConfig } from "@/lib/config";
import { RootJsonLd } from "@/components/seo/json-ld";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: siteConfig.alternateLocales,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/images/og-thumbail-1280x640.png',
        width: 1280,
        height: 640,
        alt: `${siteConfig.name} — Matematik va Muhandislik Hisoblash Platformasi`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/og-thumbail-1280x640.png'],
    creator: '@hexjasur',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceef0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <RootJsonLd />
        <style>{`
          @font-face {
            font-family: "KaTeX_Main";
            src: url("/fonts/KaTeX_Main-Regular.woff2") format("woff2");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: "KaTeX_Math";
            src: url("/fonts/KaTeX_Math-Italic.woff2") format("woff2");
            font-weight: normal;
            font-style: italic;
            font-display: swap;
          }
          @font-face {
            font-family: "KaTeX_Size1";
            src: url("/fonts/KaTeX_Size1-Regular.woff2") format("woff2");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: "KaTeX_Size4";
            src: url("/fonts/KaTeX_Size4-Regular.woff2") format("woff2");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `try {
  const stored = localStorage.getItem("numeric-theme");
  const theme = stored === "dark" || stored === "light"
    ? stored
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
  const savedLocale = localStorage.getItem("app-locale");
  if (savedLocale) {
    document.documentElement.lang = savedLocale;
  }
} catch {
  document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
try {
  if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
    document.documentElement.style.setProperty("--sat", "max(env(safe-area-inset-top, 0px), 36px)");
    document.documentElement.style.setProperty("--sab", "max(env(safe-area-inset-bottom, 0px), 16px)");
  }
} catch {}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TopLoader />
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
