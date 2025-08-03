"use client";
//child component for movie list
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Heart, Eye } from "phosphor-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import Image from "next/image";
import MovieDetailsModal from "./MovieDetailsModal";
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
};

const API_BASE_URL = "https://api.themoviedb.org/3";

const Movies = () => {
  // create an error message if the data in the api is being called
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFavorite, toggleRating } = useFavorites();

  useEffect(() => {
    const fetchMovies = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      // console.log("env:", process.env);
      setIsLoading(true);
      setErrorMessage("");

      if (!API_KEY) {
        console.error("API key is missing");
        setErrorMessage("API key is missing");
        return;
      }

      const API_OPTIONS = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      };
      try {
        //first call the endpoint
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        //if there is an endpoint, try to call it by using a response var
        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();

        if (data.response === "False") {
          setErrorMessage(data.Error || "Failed to fetch movies");
          setMovieList([]);
          return;
        }
        setMovieList(data.results.slice(0, 12));
        return;

        // console.log("Fetched movies:", data);
      } catch (error) {
        console.error(`Heh error: ${error}`);
        setErrorMessage("Error fetching movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const changeStatus = (movieId: number) => {
    return isFavorite.find((movie) => movie.id === movieId) ? true : false;
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToFavorites = (movie: Movie) => {
    toggleRating(movie);
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-hero py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text mb-4 bg-foreground">
              Most Popular Movies
            </h1>
            <p className="text-muted-foreground text-3xl">
              Discover the latest blockbusters and fan favorites
            </p>
          </div>

          {/* Loading/Error State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {errorMessage && !isLoading && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <p className="text-destructive">{errorMessage}</p>
            </div>
          )}

          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movieList.map((movie) => (
              <Card
                key={movie.id}
                className="group bg-gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                {/* Movie Poster */}
                                 <div className="relative overflow-hidden">
                   {movie.poster_path ? (
                     <Image
                       src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                       alt={`Movie poster for ${movie.title}`}
                       className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                       height={750}
                       width={500}
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                   ) : (
                     <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                       <span className="text-muted-foreground text-sm">No Poster</span>
                     </div>
                   )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <Eye size={20} className="text-white" />
                      <span className="text-white text-sm font-medium">View Details</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {movie.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mt-2">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-4 border-t mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRating(movie);
                      }}
                      className="w-full flex items-center justify-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:bg-primary/5 group/btn"
                    >
                      <Heart 
                        color={changeStatus(movie.id) ? "red" : "gray"} 
                        weight={changeStatus(movie.id) ? "fill" : "regular"}
                      />
                      <span className="text-sm font-medium text-accent-foreground group-hover/btn:text-primary transition-colors duration-300">
                        {changeStatus(movie.id)
                          ? "Added to Favorites"
                          : "Add to Favorites"}
                      </span>
                    </button>
                    
                    <Link
                      href={`/movie/${movie.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                    >
                      <Eye size={16} />
                      <span className="text-sm font-medium">Full Details</span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToFavorites={handleAddToFavorites}
          isFavorite={changeStatus(selectedMovie.id)}
        />
      )}
    </>
  );
};
export default Movies;
