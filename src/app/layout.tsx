import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css"; // Changed from "src/app/globals.css" to "./globals.css"
import Navbar from "../components/main_components/Navbar";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "MooReview",
  description: "A sample app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/60 flex justify-start items-center md:px-10 md:py-6">
            <Navbar />
          </div>
          <FavoritesProvider>{children}</FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
