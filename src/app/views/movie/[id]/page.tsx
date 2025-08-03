"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, Calendar, Clock, Play, Heart } from "phosphor-react";
import Image from "next/image";
import { useFavorites } from "@/app/context/FavoritesContext";
import MovieNotes from "@/components/main_components/MovieNotes";
import MovieComments from "@/components/main_components/MovieComments";
import Link from "next/link";

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
  credits?: {
    cast?: Array<{
      id: number;
      name: string;
      character: string;
      profile_path?: string;
    }>;
  };
  videos?: {
    results?: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
};

type TabType = "details" | "cast" | "notes" | "comments";

const MovieDetailPage = () => {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const { isFavorite, toggleRating } = useFavorites();

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();

      if (data.success === false) {
        setError("Movie not found");
        return;
      }

      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to load movie details");
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

  const isFavoriteMovie = movie
    ? isFavorite.some((fav) => fav.id === movie.id)
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Movie Not Found
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-96 w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={`Backdrop image for ${movie.title}`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to Movies
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Movie poster for ${movie.title}`}
                    className="w-full rounded-lg shadow-lg"
                    height={600}
                    width={400}
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-muted rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-lg">
                      No Poster Available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            {/* Movie Info */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-muted-foreground italic mb-4">
                  `{movie.tagline}`
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                {movie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                )}

                {movie.vote_average && (
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" weight="fill" />
                    <span className="text-sm text-muted-foreground">
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-foreground leading-relaxed text-lg mb-6">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                  <Play size={20} />
                  Watch Trailer
                </button>

                <button
                  onClick={() => toggleRating(movie)}
                  className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <Heart
                    size={20}
                    weight={isFavoriteMovie ? "fill" : "regular"}
                    className={
                      isFavoriteMovie ? "text-red-500" : "text-muted-foreground"
                    }
                  />
                  {isFavoriteMovie
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </div>

              {/* Financial Info */}
              {(movie.budget || movie.revenue) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-lg">
                  {movie.budget && movie.budget > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Budget
                      </h4>
                      <p className="text-muted-foreground">
                        {formatCurrency(movie.budget)}
                      </p>
                    </div>
                  )}
                  {movie.revenue && movie.revenue > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Revenue
                      </h4>
                      <p className="text-muted-foreground">
                        {formatCurrency(movie.revenue)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-3 font-medium transition-colors duration-200 ${
                    activeTab === "details"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("cast")}
                  className={`py-3 font-medium transition-colors duration-200 ${
                    activeTab === "cast"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cast
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-3 font-medium transition-colors duration-200 ${
                    activeTab === "notes"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`py-3 font-medium transition-colors duration-200 ${
                    activeTab === "comments"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Comments
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "cast" && movie.credits?.cast && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.credits.cast.slice(0, 9).map((actor) => (
                    <Card key={actor.id} className="p-4">
                      <div className="flex items-center gap-3">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                            alt={`${actor.name} as ${actor.character}`}
                            className="w-12 h-12 rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              ?
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {actor.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "notes" && (
                <MovieNotes movieId={movie.id} movieTitle={movie.title} />
              )}

              {activeTab === "comments" && (
                <MovieComments movieId={movie.id} movieTitle={movie.title} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
