//this context will contain functions and hooks that will display all favorite movies in the favorites page
//add a remove from favorite function
"use client";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import axios from "axios";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
};

type FavoritesContextType = {
  isFavorite: Movie[];
  toggleRating: (movie: Movie) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
); //use this for the provider "<FavoritesContext.Provider>"

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [isFavorite, setIsFavorite] = useState<Movie[]>([]);

  const toggleRating = async (movie: Movie) => {
    setIsFavorite((prev) => {
      const isFavorite = prev.some((favorite) => favorite.id === movie.id);
      return isFavorite
        ? prev.filter((favorite) => favorite.id !== movie.id) // remove if already favorited
        : [...prev, movie]; // add if not
    });

    try {
      const response = await axios.post("api/favorites", {
        movieId: movie.id,
        title: movie.title,
        image: movie.poster_path,
      });
      console.log(response.data.message);
    } catch (error) {
      console.log("heh error", error);
    }
  };

  useEffect(() => {
    console.log("Favorites updated:", isFavorite);
  }, [isFavorite]);

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleRating }}>
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
