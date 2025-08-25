"use client";
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Star, 
  Trash, 
  ChatCircle, 
  PencilSimple, 
  Eye, 
  MagnifyingGlass,
  SortAscending,
  SortDescending,
  Funnel,
  GridFour,
  ListBullets,
  FilmStrip as Film,
} from "phosphor-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date" | "rating">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    // Remove duplicates and filter out invalid entries
    const uniqueFavorites = isFavorite
      .filter(movie => movie && movie.id != null)
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );
    const filtered = uniqueFavorites.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort movies
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          // Assuming we don't have date, use title as fallback
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          // Assuming we don't have rating, use title as fallback
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [isFavorite, searchQuery, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart size={28} className="text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                Your personal movie collection • {filteredAndSortedMovies.length} of {isFavorite.length} movies
              </p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground transition-all duration-200"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Sorting and Filters */}
            <div className="flex gap-2">
              {/* Sort Button */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-200"
              >
                {sortOrder === "asc" ? (
                  <SortAscending size={18} className="text-muted-foreground" />
                ) : (
                  <SortDescending size={18} className="text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">Sort</span>
              </button>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                  showFilters 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card border-border hover:bg-muted"
                }`}
              >
                <Funnel size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === "grid" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GridFour size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListBullets size={18} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "title" | "date" | "rating")}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="title">Title</option>
                    <option value="date">Date Added</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Content */}
        {isFavorite.length === 0 ? (
          <Card className="p-12 bg-card/50 backdrop-blur-sm border border-border/50 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Film size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Favorites Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring movies and add them to your favorites to see them here. 
                Your personal cinema collection awaits!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                <MagnifyingGlass size={20} />
                Discover Movies
              </Link>
            </div>
          </Card>
        ) : filteredAndSortedMovies.length === 0 ? (
          <Card className="p-12 bg-card/50 backdrop-blur-sm border border-border/50 text-center">
            <div className="max-w-md mx-auto">
              <MagnifyingGlass size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                No movies match your search criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Clear Search
              </button>
            </div>
          </Card>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
              : "space-y-4"
          }>
            {filteredAndSortedMovies.map((movie) => (
              viewMode === "grid" ? (
                // Grid View Card
                <Card
                  className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="relative">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`Movie poster for ${movie.title}`}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        height={600}
                        width={400}
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                        <Film size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromFavorites(movie);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600/80 transition-colors duration-200 backdrop-blur-sm"
                        >
                          <Trash size={16} />
                          Remove from Favorites
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                        <Star size={14} className="text-yellow-400" weight="fill" />
                        <span className="text-white text-xs font-medium">4.5</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {movie.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {movie.overview}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                          title="Comments"
                        >
                          <ChatCircle size={16} className="text-muted-foreground" />
                        </button>
                        <button 
                          className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                          title="Notes"
                        >
                          <PencilSimple size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 text-sm font-medium"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                // List View Card
                <Card
                  className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 p-4"
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={`Movie poster for ${movie.title}`}
                          className="w-20 h-30 object-cover rounded-lg"
                          height={120}
                          width={80}
                        />
                      ) : (
                        <div className="w-20 h-30 bg-muted rounded-lg flex items-center justify-center">
                          <Film size={24} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-4">
                          <Star size={14} className="text-yellow-400" weight="fill" />
                          <span className="text-sm text-muted-foreground">4.5</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {movie.overview}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                            title="Comments"
                          >
                            <ChatCircle size={16} className="text-muted-foreground" />
                          </button>
                          <button 
                            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                            title="Notes"
                          >
                            <PencilSimple size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromFavorites(movie);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 text-sm"
                          >
                            <Trash size={14} />
                            Remove
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
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
