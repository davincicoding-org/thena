import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend_Giga } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { TRPCReactProvider } from "@/trpc/react";
import { BugReporter } from "@/ui/components/BugReporter";
import { ThemeProvider } from "@/ui/Theme";

import { Motion } from "./motion";

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
      <TRPCReactProvider>
        <html lang={locale} {...mantineHtmlProps}>
          <head>
            <ColorSchemeScript forceColorScheme="dark" />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${logoFont.variable}`}
          >
            <Motion>
              <ThemeProvider>
                <NextIntlClientProvider>
                  {children}
                  <BugReporter
                    className="fixed! top-2 right-2 z-[500]"
                    variant="subtle"
                    color="orange"
                    size="xl"
                  />
                </NextIntlClientProvider>
              </ThemeProvider>
            </Motion>
            <Analytics />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
