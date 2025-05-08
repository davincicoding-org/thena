import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend_Giga } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { ReactQueryClientProvider } from "@/app/query-client";
import { ThemeProvider } from "@/ui/Theme";

import Shell from "./shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const logoFont = Lexend_Giga({
  variable: "--font-logo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THENA",
  description: "Where Deep Work Happens",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang={locale} {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript forceColorScheme="dark" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${logoFont.variable}`}
        >
          <ThemeProvider>
            <ReactQueryClientProvider>
              <NextIntlClientProvider>
                <Shell>{children}</Shell>
              </NextIntlClientProvider>
            </ReactQueryClientProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
