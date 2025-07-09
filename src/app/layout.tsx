// src/app/layout.tsx
import type { ReactNode } from "react";
import "src/app/globals.css";
import Navbar from "../components/main_components/Navbar";
import { FavoritesProvider } from "./context/FavoritesContext";

export const metadata = {
  title: "MooReview",
  description: "A sample app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/60 flex justify-start items-center md:px-10 md:py-6">
          <Navbar />
        </div>
        <FavoritesProvider> {children}</FavoritesProvider>
      </body>
    </html>
  );
}
