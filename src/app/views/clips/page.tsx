"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  ChatCircle as MessageCircle, 
  Share, 
  BookmarkSimple,
  ThumbsUp,
  Eye,
  VideoCamera,
  MagnifyingGlass,
  Funnel,
  FilmStrip as Film,
  Television
} from "phosphor-react";
import Image from "next/image";

type ClipType = "movie" | "series" | "trailer";
type SortOption = "latest" | "popular" | "trending" | "title";

interface MovieClip {
  id: string;
  title: string;
  movieTitle: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  type: ClipType;
  createdAt: string;
  description: string;
  tags: string[];
  uploader: {
    name: string;
    avatar: string;
  };
}

const ClipsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ClipType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const clips: MovieClip[] = [
    {
      id: "1",
      title: "Epic Final Battle Scene",
      movieTitle: "Avengers: Endgame",
      thumbnail: "/api/placeholder/400/225",
      duration: "3:45",
      views: 125000,
      likes: 8900,
      dislikes: 120,
      comments: 342,
      type: "movie",
      createdAt: "2024-01-15",
      description: "The most epic final battle in MCU history with all heroes united.",
      tags: ["action", "superhero", "epic", "finale"],
      uploader: {
        name: "CinemaClips",
        avatar: "/api/placeholder/40/40"
      }
    },
    {
      id: "2",
      title: "House of the Dragon - Dragon Scene",
      movieTitle: "House of the Dragon",
      thumbnail: "/api/placeholder/400/225",
      duration: "2:30",
      views: 98000,
      likes: 7200,
      dislikes: 89,
      comments: 256,
      type: "series",
      createdAt: "2024-01-14",
      description: "Incredible dragon sequence from the latest episode.",
      tags: ["fantasy", "dragons", "hbo", "epic"],
      uploader: {
        name: "SeriesSpot",
        avatar: "/api/placeholder/40/40"
      }
    },
    {
      id: "3",
      title: "Dune: Part Two Official Trailer",
      movieTitle: "Dune: Part Two",
      thumbnail: "/api/placeholder/400/225",
      duration: "2:56",
      views: 2100000,
      likes: 45000,
      dislikes: 890,
      comments: 1200,
      type: "trailer",
      createdAt: "2024-01-13",
      description: "The official trailer for the highly anticipated sequel.",
      tags: ["trailer", "sci-fi", "dune", "official"],
      uploader: {
        name: "Warner Bros",
        avatar: "/api/placeholder/40/40"
      }
    }
  ];

  const filteredClips = clips.filter(clip => {
    const matchesSearch = clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clip.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || clip.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedClips = [...filteredClips].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
        return b.views - a.views;
      case "trending":
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTypeIcon = (type: ClipType) => {
    switch (type) {
      case "movie": return <Film size={16} />;
      case "series": return <Television size={16} />;
      case "trailer": return <VideoCamera size={16} />;
    }
  };

  const getTypeColor = (type: ClipType) => {
    switch (type) {
      case "movie": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "series": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "trailer": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <VideoCamera size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Movie Clips & Snippets
              </h1>
              <p className="text-muted-foreground">
                Discover and discuss the best moments from movies and series
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search clips, movies, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground transition-all duration-200"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Type Filters */}
            <div className="flex gap-2 flex-wrap">
              {["all", "movie", "series", "trailer"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as typeof selectedType)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center gap-2 ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  {type !== "all" && getTypeIcon(type as ClipType)}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Viewed</option>
                <option value="trending">Trending</option>
                <option value="title">Title A-Z</option>
              </select>
              
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
          </div>

          {/* Extended Filters Panel */}
          {showFilters && (
            <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Any duration</option>
                    <option value="short">Under 2 minutes</option>
                    <option value="medium">2-5 minutes</option>
                    <option value="long">Over 5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Genre</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">All genres</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="sci-fi">Sci-Fi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Upload Date</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {sortedClips.length} clips {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>

        {/* Clips Grid */}
        {sortedClips.length === 0 ? (
          <Card className="p-12 bg-card/50 backdrop-blur-sm border border-border/50 text-center">
            <VideoCamera size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Clips Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all clips.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Show All Clips
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedClips.map((clip) => (
              <Card
                key={clip.id}
                className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <Image
                    src={clip.thumbnail}
                    alt={clip.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <Play size={24} className="text-white ml-1" weight="fill" />
                    </button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-white text-xs font-medium">
                    {clip.duration}
                  </div>

                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getTypeColor(clip.type)}`}>
                    {getTypeIcon(clip.type)}
                    {clip.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title and Movie */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {clip.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {clip.movieTitle}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{formatNumber(clip.views)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        <span>{formatNumber(clip.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{formatNumber(clip.comments)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploader */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={clip.uploader.avatar}
                        alt={clip.uploader.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">{clip.uploader.name}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200" title="Like">
                        <ThumbsUp size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200" title="Save">
                        <BookmarkSimple size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200" title="Share">
                        <Share size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipsPage;
