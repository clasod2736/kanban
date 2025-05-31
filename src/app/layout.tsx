'use client'

import { Providers } from "@/providers";

import "./globals.css";
import { NavigationMenu, type ItemProps } from "@/ui/components/Navbar";

const NavigationMenuItems: ItemProps = {
  items: [
    {
      label: "Home",
      href: "/",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col justify-start items-center w-full min-h-screen">
        <Providers>
          <div className="w-full h-16">
            <NavigationMenu items={NavigationMenuItems.items} />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
