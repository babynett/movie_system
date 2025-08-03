"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Star, Trash, ChatCircle, PencilSimple, Eye } from "phosphor-react";
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

const FavoritePage = () => {
  const { isFavorite, toggleRating } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveFromFavorites = (movie: Movie) => {
    toggleRating(movie);
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Favorite Movies
            </h1>
            <p className="text-muted-foreground">
              Favorites in your collection ({isFavorite.length} movies)
            </p>
          </div>
        </div>

        {isFavorite.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">No Favorite Movies</p>
            <p className="text-muted-foreground text-sm mt-2">
              Start adding movies to your favorites to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isFavorite.map((movie) => (
              <Card
                className="flex flex-col justify-between p-4 bg-card hover:shadow-lg transition-all duration-300 h-full group cursor-pointer"
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
              >
                <div>
                                     <div className="relative overflow-hidden rounded mb-4">
                     {movie.poster_path ? (
                       <Image
                         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                         alt={`Movie poster for ${movie.title}`}
                         className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                         height={500}
                         width={500}
                       />
                     ) : (
                       <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                         <span className="text-muted-foreground text-sm">No Poster</span>
                       </div>
                     )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Eye size={20} className="text-white" />
                        <span className="text-white text-sm font-medium">View Details</span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-card-foreground mb-2 line-clamp-2">
                    {movie.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {movie.overview}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={16} color="#D9A299" weight="fill" />
                    <span className="text-sm text-muted-foreground">10/10</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavorites(movie);
                      }}
                      className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors duration-200"
                    >
                      <Trash size={16} />
                      Remove
                    </button>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 hover:bg-muted rounded transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChatCircle size={16} className="text-muted-foreground" />
                      </button>
                      <button 
                        className="p-2 hover:bg-muted rounded transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PencilSimple size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  
                  <Link
                    href={`/movie/${movie.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                  >
                    <Eye size={16} />
                    <span className="text-sm font-medium">Full Details</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToFavorites={handleAddToFavorites}
          isFavorite={true}
        />
      )}
    </div>
  );
};

export default FavoritePage;
