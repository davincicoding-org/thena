import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend_Giga } from "next/font/google";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${logoFont.variable}`}
      >
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
