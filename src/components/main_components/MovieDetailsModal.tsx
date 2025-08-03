"use client";
import React, { useState, useEffect } from "react";
import { X, Star, Calendar, Clock, Play, Heart } from "phosphor-react";
import Image from "next/image";
import MovieNotes from "./MovieNotes";
import MovieComments from "./MovieComments";

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
};

interface MovieDetailsModalProps {
  movie: MovieDetails;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (movie: MovieDetails) => void;
  isFavorite?: boolean;
}

type TabType = "details" | "notes" | "comments";

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
  onAddToFavorites,
  isFavorite = false,
}) => {
  const [details, setDetails] = useState<MovieDetails>(movie);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("details");

  useEffect(() => {
    if (isOpen && movie.id) {
      fetchMovieDetails();
    }
  }, [isOpen, movie.id]);

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {details.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === "details"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === "notes"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === "comments"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Comments
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === "details" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Poster */}
                  <div className="lg:col-span-1">
                    <div className="relative">
                      {details.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                          alt={`Movie poster for ${details.title}`}
                          className="w-full rounded-lg"
                          height={600}
                          width={400}
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-lg">
                            No Poster Available
                          </span>
                        </div>
                      )}
                      {details.backdrop_path && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      {details.tagline && (
                        <p className="text-muted-foreground italic text-lg">
                          `{details.tagline}`
                        </p>
                      )}

                      <p className="text-foreground leading-relaxed">
                        {details.overview}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {details.release_date && (
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-muted-foreground">
                              {new Date(details.release_date).getFullYear()}
                            </span>
                          </div>
                        )}

                        {details.runtime && (
                          <div className="flex items-center gap-2">
                            <Clock
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-muted-foreground">
                              {formatRuntime(details.runtime)}
                            </span>
                          </div>
                        )}

                        {details.vote_average && (
                          <div className="flex items-center gap-2">
                            <Star
                              size={16}
                              className="text-yellow-500"
                              weight="fill"
                            />
                            <span className="text-sm text-muted-foreground">
                              {details.vote_average.toFixed(1)}/10
                            </span>
                          </div>
                        )}

                        {details.status && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {details.status}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Genres */}
                      {details.genres && details.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {details.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Financial Info */}
                    {(details.budget || details.revenue) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                        {details.budget && details.budget > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">
                              Budget
                            </h4>
                            <p className="text-muted-foreground">
                              {formatCurrency(details.budget)}
                            </p>
                          </div>
                        )}
                        {details.revenue && details.revenue > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">
                              Revenue
                            </h4>
                            <p className="text-muted-foreground">
                              {formatCurrency(details.revenue)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                        <Play size={16} />
                        Watch Trailer
                      </button>

                      {onAddToFavorites && (
                        <button
                          onClick={() => onAddToFavorites(details)}
                          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                        >
                          <Heart
                            size={16}
                            weight={isFavorite ? "fill" : "regular"}
                            className={
                              isFavorite
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }
                          />
                          {isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <MovieNotes movieId={details.id} movieTitle={details.title} />
              )}

              {activeTab === "comments" && (
                <MovieComments
                  movieId={details.id}
                  movieTitle={details.title}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
