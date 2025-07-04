// src/app/layout.tsx
import type { ReactNode } from "react";
import "src/app/globals.css";
import Navbar from "../components/main_components/Navbar";

export const metadata = {
  title: "MooReview",
  description: "A sample app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center md:p-5 relative z-10">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
