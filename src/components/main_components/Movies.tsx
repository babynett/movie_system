"use client";
import { useEffect, useState, useCallback } from "react";
import { Card } from "../ui/card";
import { Heart, Funnel } from "phosphor-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSearch } from "@/app/context/SearchContext";
import Image from "next/image";
import MovieDetailsModal from "./MovieDetailsModal";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
};

type MovieSection = {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  error: string;
};

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Movie sections state
  const [popularMovies, setPopularMovies] = useState<MovieSection>({
    title: "Highest Rated Movies",
    movies: [],
    isLoading: false,
    error: ""
  });
  
  const [recommendedMovies, setRecommendedMovies] = useState<MovieSection>({
    title: "Recommended Movies",
    movies: [],
    isLoading: false,
    error: ""
  });
  
  const [continueRatingMovies, setContinueRatingMovies] = useState<MovieSection>({
    title: "Continue Rating Movies",
    movies: [],
    isLoading: false,
    error: ""
  });
  
  const [topSearchMovies, setTopSearchMovies] = useState<MovieSection>({
    title: "Top Searches",
    movies: [],
    isLoading: false,
    error: ""
  });

  const { isFavorite, toggleRating } = useFavorites();
  const { user } = useAuth();
  const { searchResults, isSearching, searchError, isSearchActive, searchQuery } = useSearch();

  // Fetch movies for each section
  const fetchMoviesSection = useCallback(async (sortBy: string, setSection: React.Dispatch<React.SetStateAction<MovieSection>>) => {
    setSection(prev => ({ ...prev, isLoading: true, error: "" }));
    
    try {
      const userId = user?.id || "";
      const response = await fetch(`/api/movies?sortBy=${sortBy}&userId=${userId}`);
      const data = await response.json();
      
      if (data.error) {
        setSection(prev => ({ ...prev, error: data.error, isLoading: false }));
        return;
      }
      
      setSection(prev => ({
        ...prev,
        movies: data.results || [],
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error fetching ${sortBy} movies:`, error);
      setSection(prev => ({
        ...prev,
        error: "Failed to fetch movies",
        isLoading: false
      }));
    }
  }, [user?.id]);



  // Load all movie sections on mount
  useEffect(() => {
    fetchMoviesSection("popular", setPopularMovies);
    fetchMoviesSection("recommended", setRecommendedMovies);
    fetchMoviesSection("continue_rating", setContinueRatingMovies);
    fetchMoviesSection("top_searches", setTopSearchMovies);
  }, [user?.id, fetchMoviesSection]);

  const changeStatus = (movieId: number) => {
    return isFavorite.find((movie) => movie.id === movieId) ? true : false;
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    
    // Track movie interaction
    if (user?.id) {
      fetch("/api/movie-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          movieTitle: movie.title,
          userId: user.id,
          type: "view"
        })
      }).catch(console.error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleAddToFavorites = (movie: Movie) => {
    toggleRating(movie);
  };

  const MovieGrid = ({ movies, isLoading, error, sectionId = "" }: { movies: Movie[], isLoading: boolean, error: string, sectionId?: string }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (movies.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>No movies found</p>
        </div>
      );
    }

    // Remove duplicates and null/undefined IDs within this section
    const uniqueMovies = movies
      .filter(movie => movie && movie.id != null)
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {uniqueMovies.map((movie) => (
          <Card
            key={sectionId ? `${sectionId}-${movie.id}` : movie.id}
            className="group bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer rounded-lg hover:scale-105"
            onClick={() => handleMovieClick(movie)}
          >
            {/* Movie Poster */}
            <div className="relative overflow-hidden">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`Movie poster for ${movie.title}`}
                  className="w-full aspect-[2/3] object-cover transition-transform duration-300"
                  height={750}
                  width={500}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Poster</span>
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-2 right-2">
                <div className="bg-black/70 text-purple-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className={`${movie.vote_average && movie.vote_average >= 7 ? 'text-green-400' : movie.vote_average && movie.vote_average >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>●</span>
                  <span>
                    {movie.vote_average ? (movie.vote_average * 10).toFixed(0) : 'N/A'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : '2024'}
              </p>
              
              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFavorites(movie);
                }}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  size={14}
                  color={changeStatus(movie.id) ? "red" : "#9333ea"}
                  weight={changeStatus(movie.id) ? "fill" : "regular"}
                />
                <span>
                  {changeStatus(movie.id) ? "Favorited" : "Add to Favorites"}
                </span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
              Sinemo Movies
            </h1>
          </div>

          {/* Search Results */}
          {isSearchActive && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <MovieGrid 
                movies={searchResults} 
                isLoading={isSearching} 
                error={searchError}
                sectionId="search"
              />
            </div>
          )}

          {/* Movie Sections - Only show when not searching */}
          {!isSearchActive && (
            <>
              {/* Most Popular Movies */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-purple-900">
                    {popularMovies.title}
                  </h2>
                  <button 
                    onClick={() => fetchMoviesSection("popular", setPopularMovies)}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Funnel size={16} />
                    Refresh
                  </button>
                </div>
                <MovieGrid 
                  movies={popularMovies.movies} 
                  isLoading={popularMovies.isLoading} 
                  error={popularMovies.error}
                  sectionId="popular"
                />
              </div>

              {/* Recommended Movies */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900">
                      {recommendedMovies.title}
                    </h2>
                    <p className="text-sm text-gray-600">Based on your favorites and genres</p>
                  </div>
                  <button 
                    onClick={() => fetchMoviesSection("recommended", setRecommendedMovies)}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Funnel size={16} />
                    Refresh
                  </button>
                </div>
                <MovieGrid 
                  movies={recommendedMovies.movies} 
                  isLoading={recommendedMovies.isLoading} 
                  error={recommendedMovies.error}
                  sectionId="recommended"
                />
              </div>

              {/* Continue Rating Movies */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900">
                      {continueRatingMovies.title}
                    </h2>
                    <p className="text-sm text-gray-600">Recently reviewed and discussed movies</p>
                  </div>
                  <button 
                    onClick={() => fetchMoviesSection("continue_rating", setContinueRatingMovies)}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Funnel size={16} />
                    Refresh
                  </button>
                </div>
                <MovieGrid 
                  movies={continueRatingMovies.movies} 
                  isLoading={continueRatingMovies.isLoading} 
                  error={continueRatingMovies.error}
                  sectionId="continue-rating"
                />
              </div>

              {/* Top Searches */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900">
                      {topSearchMovies.title}
                    </h2>
                    <p className="text-sm text-gray-600">Based on what everyone is searching for</p>
                  </div>
                  <button 
                    onClick={() => fetchMoviesSection("top_searches", setTopSearchMovies)}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Funnel size={16} />
                    Refresh
                  </button>
                </div>
                <MovieGrid 
                  movies={topSearchMovies.movies} 
                  isLoading={topSearchMovies.isLoading} 
                  error={topSearchMovies.error}
                  sectionId="top-searches"
                />
              </div>
            </>
          )}
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
