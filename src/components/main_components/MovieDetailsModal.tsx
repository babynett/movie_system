"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Star, Calendar, Clock, Play, Heart, Users, Money, Globe } from "phosphor-react";
import Image from "next/image";
import MovieNotes from "./MovieNotes";
import MovieComments from "./MovieComments";
import StarRating from "../ui/StarRating";
import { guestSessionManager } from "@/lib/guestSession";
import { CastMember, CrewMember, TMDBMovie, ProductionCompany, ProductionCountry, SpokenLanguage } from "@/lib/tmdb";

// Extended types for enhanced movie details with URLs
interface EnhancedCastMember extends CastMember {
  profile_url?: string;
}

interface EnhancedTMDBMovie extends TMDBMovie {
  poster_url?: string;
  rating_percentage?: number;
}

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  poster_url?: string;
  backdrop_url?: string;
  rating_percentage?: number;
  rating_color?: string;
  release_year?: number;
  runtime_formatted?: string;
  budget_formatted?: string;
  revenue_formatted?: string;
  director?: CrewMember;
  main_cast?: EnhancedCastMember[];
  writers?: CrewMember[];
  producers?: CrewMember[];
  similar_movies?: EnhancedTMDBMovie[];
  recommendations?: EnhancedTMDBMovie[];
  genres_formatted?: string;
  countries_formatted?: string;
  languages_formatted?: string;
  companies_formatted?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
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
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/movies/${movie.id}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [movie.id]);

  useEffect(() => {
    if (isOpen && movie.id) {
      fetchMovieDetails();
    }
  }, [isOpen, movie.id, fetchMovieDetails]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };



  const handleRateMovie = async (rating: number) => {
    setIsRating(true);
    try {
      const success = await guestSessionManager.rateMovie(details.id, rating);
      if (success) {
        setUserRating(rating);
        // You might want to show a success message here
      }
    } catch (error) {
      console.error("Error rating movie:", error);
      // You might want to show an error message here
    } finally {
      setIsRating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-xl rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-border/50 shadow-2xl">
        {/* Header with Backdrop */}
        {details.backdrop_path && (
          <div className="relative h-64 overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
              alt={`Backdrop for ${details.title}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 bg-black/50 hover:bg-black/70 text-purple-200 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <X size={24} />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-purple-100 mb-2">
                {details.title}
              </h2>
              {details.tagline && (
                <p className="text-purple-200/80 italic text-lg">
                  &ldquo;{details.tagline}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Header for movies without backdrop */}
        {!details.backdrop_path && (
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {details.title}
              </h2>
              {details.tagline && (
                <p className="text-muted-foreground italic text-lg">
                  &ldquo;{details.tagline}&rdquo;
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border/50 bg-muted/20">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "details"
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
            }`}
          >
            Movie Details
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "notes"
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
            }`}
          >
            My Notes
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
              activeTab === "comments"
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
            }`}
          >
            Discussion
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-20rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading movie details...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "details" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Poster */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-6">
                        {details.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                            alt={`Movie poster for ${details.title}`}
                            className="w-full rounded-xl shadow-lg"
                            height={600}
                            width={400}
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-muted rounded-xl flex items-center justify-center border border-border">
                            <div className="text-center">
                              <Play size={48} className="text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground text-lg">
                                No Poster Available
                              </span>
                            </div>
                          </div>
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
                        {(details.release_date || details.release_year) && (
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-muted-foreground">
                              {details.release_year || new Date(details.release_date!).getFullYear()}
                            </span>
                          </div>
                        )}

                        {(details.runtime || details.runtime_formatted) && (
                          <div className="flex items-center gap-2">
                            <Clock
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm text-muted-foreground">
                              {details.runtime_formatted || formatRuntime(details.runtime!)}
                            </span>
                          </div>
                        )}

                        {details.vote_average && (
                          <div className="flex items-center gap-2">
                            <Star
                              size={16}
                              className={`${
                                details.rating_color === 'green' ? 'text-green-500' :
                                details.rating_color === 'yellow' ? 'text-yellow-500' :
                                details.rating_color === 'red' ? 'text-red-500' : 'text-gray-500'
                              }`}
                              weight="fill"
                            />
                            <span className="text-sm text-muted-foreground">
                              {details.rating_percentage || Math.round(details.vote_average * 10)}%
                            </span>
                            {details.vote_count && (
                              <span className="text-xs text-muted-foreground">
                                ({details.vote_count.toLocaleString()} votes)
                              </span>
                            )}
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

                      {/* User Rating Section */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-foreground">Rate this movie</h4>
                          {isRating && (
                            <div className="text-sm text-muted-foreground">Saving...</div>
                          )}
                        </div>
                        <StarRating
                          rating={userRating}
                          onRatingChange={handleRateMovie}
                          readonly={isRating}
                          size={24}
                          maxRating={10}
                        />
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

                    {/* Cast & Crew */}
                    {(details.main_cast || details.director || details.writers) && (
                      <div className="pt-6 border-t border-border space-y-6">
                        {/* Director */}
                        {details.director && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <Users size={16} />
                              Director
                            </h4>
                            <div className="flex items-center gap-3">
                              {details.director.profile_path && (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w200${details.director.profile_path}`}
                                  alt={details.director.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              )}
                              <span className="text-muted-foreground">{details.director.name}</span>
                            </div>
                          </div>
                        )}

                        {/* Main Cast */}
                        {details.main_cast && details.main_cast.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Users size={16} />
                              Main Cast
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {details.main_cast.slice(0, 6).map((actor: EnhancedCastMember) => (
                                <div key={`cast-${actor.id}`} className="flex items-center gap-2">
                                  {actor.profile_url && (
                                    <Image
                                      src={actor.profile_url}
                                      alt={actor.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full object-cover"
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {actor.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {actor.character}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Writers */}
                        {details.writers && details.writers.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Writers</h4>
                            <p className="text-muted-foreground text-sm">
                              {details.writers.map((writer: CrewMember) => writer.name).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Production Info */}
                    {(details.budget_formatted || details.revenue_formatted || details.countries_formatted || details.companies_formatted) && (
                      <div className="pt-6 border-t border-border space-y-4">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Globe size={16} />
                          Production Details
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {details.budget_formatted && (
                            <div>
                              <h5 className="font-medium text-foreground mb-1 flex items-center gap-2">
                                <Money size={14} />
                                Budget
                              </h5>
                              <p className="text-muted-foreground text-sm">
                                {details.budget_formatted}
                              </p>
                            </div>
                          )}
                          
                          {details.revenue_formatted && (
                            <div>
                              <h5 className="font-medium text-foreground mb-1 flex items-center gap-2">
                                <Money size={14} />
                                Revenue
                              </h5>
                              <p className="text-muted-foreground text-sm">
                                {details.revenue_formatted}
                              </p>
                            </div>
                          )}
                          
                          {details.countries_formatted && (
                            <div>
                              <h5 className="font-medium text-foreground mb-1">Countries</h5>
                              <p className="text-muted-foreground text-sm">
                                {details.countries_formatted}
                              </p>
                            </div>
                          )}
                          
                          {details.languages_formatted && (
                            <div>
                              <h5 className="font-medium text-foreground mb-1">Languages</h5>
                              <p className="text-muted-foreground text-sm">
                                {details.languages_formatted}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {details.companies_formatted && (
                          <div>
                            <h5 className="font-medium text-foreground mb-1">Production Companies</h5>
                            <p className="text-muted-foreground text-sm">
                              {details.companies_formatted}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Similar Movies & Recommendations */}
                    {(details.similar_movies || details.recommendations) && (
                      <div className="pt-6 border-t border-border space-y-6">
                        {details.recommendations && details.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Recommended Movies</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {details.recommendations.slice(0, 6).map((movie: EnhancedTMDBMovie) => (
                                <div key={`recommended-${movie.id}`} className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                  {movie.poster_url && (
                                    <Image
                                      src={movie.poster_url}
                                      alt={movie.title}
                                      width={60}
                                      height={90}
                                      className="rounded object-cover mb-2"
                                    />
                                  )}
                                  <p className="text-xs font-medium text-center text-foreground line-clamp-2">
                                    {movie.title}
                                  </p>
                                  {movie.rating_percentage && (
                                    <p className="text-xs text-muted-foreground">
                                      {movie.rating_percentage}%
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {details.similar_movies && details.similar_movies.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Similar Movies</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {details.similar_movies.slice(0, 6).map((movie: EnhancedTMDBMovie) => (
                                <div key={`similar-${movie.id}`} className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                  {movie.poster_url && (
                                    <Image
                                      src={movie.poster_url}
                                      alt={movie.title}
                                      width={60}
                                      height={90}
                                      className="rounded object-cover mb-2"
                                    />
                                  )}
                                  <p className="text-xs font-medium text-center text-foreground line-clamp-2">
                                    {movie.title}
                                  </p>
                                  {movie.rating_percentage && (
                                    <p className="text-xs text-muted-foreground">
                                      {movie.rating_percentage}%
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-purple-900 rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 font-medium">
                          <Play size={18} />
                          Watch Trailer
                        </button>

                        {onAddToFavorites && (
                          <button
                            onClick={() => onAddToFavorites(details)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                              isFavorite
                                ? "bg-red-500 text-purple-900 hover:bg-red-600"
                                : "border border-border hover:bg-muted"
                            }`}
                          >
                            <Heart
                              size={18}
                              weight={isFavorite ? "fill" : "regular"}
                              className={isFavorite ? "text-purple-900" : "text-muted-foreground"}
                            />
                            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="p-6">
                  <MovieNotes movieId={details.id} movieTitle={details.title} />
                </div>
              )}

              {activeTab === "comments" && (
                <div className="p-6">
                  <MovieComments
                    movieId={details.id}
                    movieTitle={details.title}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
