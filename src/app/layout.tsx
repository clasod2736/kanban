'use client'

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
    lang="en"
    className="min-h-screnn w-full bg-bakcground"
    >
      <SessionProvider>
        <ThemeProvider>
          <body
          >
            {children}
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}
