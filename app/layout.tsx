import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { TopLoader } from "@/components/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // title: {
  //   default: siteConfig.name,
  //   template: "%s | ${siteConfig.name}"
  // },
  title: {
    default: "Numeric Methods",
    template: "%s | Numeric Methods",
  },
  description: "Numeric Methods is a web application that provides a collection of numerical methods and algorithms for solving mathematical problems. It offers a user-friendly interface for performing calculations, visualizing results, and learning about various numerical techniques.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `try {
  const stored = localStorage.getItem("numeric-theme");
  const theme = stored === "dark" || stored === "light"
    ? stored
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
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

