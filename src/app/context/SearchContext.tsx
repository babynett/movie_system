"use client";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
};

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Movie[];
  isSearching: boolean;
  searchError: string;
  isSearchActive: boolean;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const { user } = useAuth();

  const isSearchActive = searchQuery.trim().length > 0;

  // Search functionality with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");
      
      try {
        const userId = user?.id || "";
        const response = await fetch(`/api/movies?search=${encodeURIComponent(searchQuery)}&userId=${userId}`);
        const data = await response.json();
        
        if (data.error) {
          setSearchError(data.error);
          setSearchResults([]);
        } else {
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchError("Search failed");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, user?.id]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      searchError,
      isSearchActive,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
