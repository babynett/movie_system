//this context will contain functions and hooks that will display all favorite movies in the favorites page
//add a remove from favorite function
"use client";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
};

type FavoriteData = {
  movieId: number;
  movieTitle: string;
  posterPath: string;
};

type FavoritesContextType = {
  isFavorite: Movie[];
  toggleRating: (movie: Movie) => void;
  refreshFavorites: () => void;
  isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
); //use this for the provider "<FavoritesContext.Provider>"

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [isFavorite, setIsFavorite] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/favorites?userId=${user.id}`);
      const favoritesData = response.data.favorites || [];
      
      // Convert to the expected Movie format
      const movies = favoritesData.map((fav: FavoriteData) => ({
        id: fav.movieId,
        title: fav.movieTitle,
        overview: "", // Not stored in favorites
        poster_path: fav.posterPath
      }));
      
      setIsFavorite(movies);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const toggleRating = async (movie: Movie) => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    // Optimistic update
    const isCurrentlyFavorite = isFavorite.some((favorite) => favorite.id === movie.id);
    setIsFavorite((prev) => {
      return isCurrentlyFavorite
        ? prev.filter((favorite) => favorite.id !== movie.id) // remove if already favorited
        : [...prev, movie]; // add if not
    });

    try {
      const response = await axios.post("/api/favorites", {
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        userId: user.id,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update on error
      setIsFavorite((prev) => {
        return isCurrentlyFavorite
          ? [...prev, movie] // add back if we removed it
          : prev.filter((favorite) => favorite.id !== movie.id); // remove if we added it
      });
    }
  };

  const refreshFavorites = () => {
    fetchFavorites();
  };

  // Load favorites when user changes
  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    } else {
      setIsFavorite([]);
    }
  }, [user?.id, fetchFavorites]);

  return (
    <FavoritesContext.Provider value={{ 
      isFavorite, 
      toggleRating, 
      refreshFavorites, 
      isLoading 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// export custom hook to use the context

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
