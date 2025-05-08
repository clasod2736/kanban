'use client'

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <SessionProvider>
        <ThemeProvider>
          <body className="w-full min-h-screen">
            {children}
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}
