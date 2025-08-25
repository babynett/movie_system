"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import dynamic from "next/dynamic";

// Dynamically import Navbar to prevent SSR issues
const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="max-w-7xl px-6 py-4">
        <div className="h-16 flex items-center">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  )
});

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Check if current path should hide navbar
  const isAuthPage = pathname?.startsWith("/views/auth/") || false;
  const isLandingPage = pathname === "/landing";
  
  // Don't show navbar if:
  // 1. Currently on an auth page (login/signup), OR
  // 2. Currently on landing page, OR
  // 3. User is not authenticated and not on an auth or landing page
  const shouldShowNavbar = !isAuthPage && !isLandingPage && isAuthenticated;

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Only render navbar if user is authenticated and not on auth/landing pages
  if (shouldShowNavbar) {
    return (
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="max-w-7xl px-6 py-4">
          <Navbar />
        </div>
      </div>
    );
  }

  return null;
}
