"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChatCircle, 
  User, 
  Users,
  SignOut, 
  Heart, 
  FilmStrip as Film,
  VideoCamera,
  House,
  MagnifyingGlass,
  Bell,
  CaretDown,
  List,
  X
} from "phosphor-react";
import { useAuth } from "@/app/context/AuthContext";
import { useSearch } from "@/app/context/SearchContext";
import { useSSRSafeRef } from "@/lib/ssr-safe-hooks";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery, clearSearch, isSearching } = useSearch();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Use SSR-safe ref
  const searchInputRef = useSSRSafeRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsSearchOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home", icon: <House size={20} /> },
    { href: "/views/favorites", label: "Favorites", icon: <Heart size={20} /> },
    { href: "/views/clips", label: "Clips", icon: <VideoCamera size={20} /> },
    { href: "/views/chat", label: "Chat", icon: <ChatCircle size={20} /> },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center mr-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                <Film size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sinemo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActiveLink(item.href)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {React.cloneElement(item.icon, { 
                  size: 18,
                  className: isActiveLink(item.href) ? "text-white" : "text-gray-500"
                })}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              {isSearching && (
                <div className="absolute inset-y-0 right-10 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-200 border-t-purple-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            {/* Mobile Search Button */}
            <button 
              onClick={handleSearchToggle}
              className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <MagnifyingGlass size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <List size={20} />
            </button>
          </div>

          {/* Right Side Actions - Farthest Right */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName || user.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{user.username}
                    </p>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">
                      {user.firstName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <CaretDown size={16} className="text-gray-400 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-xl z-20 p-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/views/profile"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                      
                      <Link
                        href="/views/friends"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Users size={18} className="text-gray-500" />
                        <span className="font-medium">Friends</span>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors duration-200 text-red-600 w-full text-left"
                      >
                        <SignOut size={18} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/views/auth/signin"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg shadow-purple-200"
              >
                <User size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" 
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 z-50 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-2xl p-6 md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              {isSearching && (
                <div className="absolute inset-y-0 right-12 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-purple-600"></div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 z-50 bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-2xl p-4 md:hidden">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActiveLink(item.href)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {React.cloneElement(item.icon, { 
                    size: 20,
                    className: isActiveLink(item.href) ? "text-white" : "text-gray-500"
                  })}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}


