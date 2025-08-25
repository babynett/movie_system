"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Movies from "../components/main_components/Movies";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/landing");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600">Loading Sinemo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to landing page
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <Movies />
      </div>
    </ProtectedRoute>
  );
}

export default HomePage;
