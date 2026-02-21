import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/Providers/Providers";
import { Toaster } from "@/components/ui/toaster";

const modernBold = localFont({
  src: "./fonts/modern-bold.otf",
  variable: "--font-modern-bold",
  weight: "900",
});
const modernMono = localFont({
  src: "./fonts/modern-mono.otf",
  variable: "--font-modern-mono",
  weight: "900",
});
const modernReg = localFont({
  src: "./fonts/modern-reg.otf",
  variable: "--font-modern-reg",
  weight: "900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gitwrapped.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GitWrapped — Your GitHub Year in Review",
    template: "%s | GitWrapped",
  },
  description:
    "Generate your GitHub Unwrapped: contribution stats, streaks, top languages, achievements, and a shareable bento-style dashboard. See your year in code.",
  keywords: [
    "GitHub",
    "GitWrapped",
    "GitHub stats",
    "contribution graph",
    "GitHub wrapped",
    "developer stats",
    "coding streak",
    "GitHub achievements",
  ],
  authors: [{ name: "Jonathan Rao", url: "https://github.com/jonathanrao99" }],
  creator: "Jonathan Rao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GitWrapped",
    title: "GitWrapped — Your GitHub Year in Review",
    description:
      "Generate your GitHub Unwrapped: contribution stats, streaks, top languages, and a shareable bento dashboard. See your year in code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitWrapped — Your GitHub Year in Review",
    description:
      "Generate your GitHub Unwrapped: contribution stats, streaks, and a shareable bento dashboard.",
    creator: "@jonathanrao99",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GitWrapped",
    description: "Generate your GitHub Unwrapped: contribution stats, streaks, top languages, and a shareable bento dashboard.",
    url: siteUrl,
    applicationCategory: "DeveloperApplication",
    author: { "@type": "Person", name: "Jonathan Rao", url: "https://github.com/jonathanrao99" },
  };

  return (
    <html lang="en">
      <body
        className={`${modernBold.variable} ${modernMono.variable} ${modernReg.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
