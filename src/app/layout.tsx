import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css"; // Changed from "src/app/globals.css" to "./globals.css"
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import ClientNavbarWrapper from "@/components/main_components/ClientNavbarWrapper";

export const metadata: Metadata = {
  title: "Sinemo",
  description: "A sample app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <SearchProvider>
            <ClientNavbarWrapper />
            <FavoritesProvider>{children}</FavoritesProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
