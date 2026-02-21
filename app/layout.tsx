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

export const metadata: Metadata = {
  title: "GitWrapped",
  description: "Generate you gitHub Unwrapped nowww",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${modernBold.variable} ${modernMono.variable} ${modernReg.variable} antialiased`}
      >
        
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
