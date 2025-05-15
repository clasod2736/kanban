"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </DndProvider>
    </SessionProvider>
  );
}