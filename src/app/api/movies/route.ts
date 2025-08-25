import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { tmdbService, TMDBMovie, Genre } from "@/lib/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sortBy') || 'popular';
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    if (!API_KEY) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    let movies = [];

    if (search) {
      // Handle search functionality using TMDB service
      const searchData = await tmdbService.searchMovies(search);
      movies = searchData.results || [];

      // Track search in database if userId provided
      if (userId) {
        const client = await clientPromise;
        const db = client.db("moviedatabase");
        await db.collection("searches").insertOne({
          query: search,
          userId,
          searchedAt: new Date()
        });
      }
    } else {
      // Handle different sorting methods
      switch (sortBy) {
        case 'popular':
          const popularData = await tmdbService.discoverMoviesAdvanced({
            sortBy: 'vote_average.desc',
            minVoteCount: 1000,
            minRating: 6.0
          });
          // Sort by highest rating (vote_average) first, then by vote count for ties
          movies = (popularData.results || []).sort((a: TMDBMovie, b: TMDBMovie) => {
            if (b.vote_average === a.vote_average) {
              return b.vote_count - a.vote_count;
            }
            return b.vote_average - a.vote_average;
          });
          break;

        case 'recommended':
          movies = await getRecommendedMovies(userId);
          break;

        case 'continue_rating':
          movies = await getContinueRatingMovies(userId);
          break;

        case 'top_searches':
          movies = await getTopSearchedMovies();
          break;

        default:
          const defaultResponse = await fetch(
            `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=1000`
          );
          const defaultData = await defaultResponse.json();
          movies = (defaultData.results || []).sort((a: TMDBMovie, b: TMDBMovie) => {
            if (b.vote_average === a.vote_average) {
              return b.vote_count - a.vote_count;
            }
            return b.vote_average - a.vote_average;
          });
      }
    }

    return NextResponse.json({ results: movies.slice(0, 12) });
  } catch (error) {
    console.error("Movies API error:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

async function getRecommendedMovies(userId: string | null): Promise<TMDBMovie[]> {
  if (!userId) {
    // Fallback to top rated movies if no user
    const data = await tmdbService.getTopRatedMovies();
    return data.results || [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    
    // Get user's favorite genres and actors
    const favorites = await db.collection("favorites").find({ userId }).toArray();
    
    if (favorites.length === 0) {
      // Fallback to top rated movies if no favorites
      const data = await tmdbService.getTopRatedMovies();
      return data.results || [];
    }

    // Extract genres from favorites
    const allGenres = favorites.flatMap(fav => fav.genres || []);
    
    const genreCounts = allGenres.reduce((acc: Record<string, number>, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    // Get most common genres
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([genre]) => genre);

    if (topGenres.length === 0) {
      const data = await tmdbService.getTopRatedMovies();
      return data.results || [];
    }

    // Get movie genre IDs from TMDB
    const genreData = await tmdbService.getGenres();
    const genreMap = genreData.genres.reduce((acc: Record<string, number>, genre: Genre) => {
      acc[genre.name.toLowerCase()] = genre.id;
      return acc;
    }, {});

    const genreIds = topGenres
      .map(genre => genreMap[genre.toLowerCase()])
      .filter(id => id);

    if (genreIds.length === 0) {
      const data = await tmdbService.getTopRatedMovies();
      return data.results || [];
    }

    // Use advanced discovery with genres and high ratings
    const data = await tmdbService.discoverMoviesAdvanced({
      genres: genreIds,
      sortBy: 'vote_average.desc',
      minVoteCount: 500,
      minRating: 7.0
    });

    return data.results || [];
  } catch (error) {
    console.error("Error getting recommended movies:", error);
    // Fallback to top rated movies
    const data = await tmdbService.getTopRatedMovies();
    return data.results || [];
  }
}

async function getContinueRatingMovies(userId: string | null): Promise<TMDBMovie[]> {
  if (!userId) {
    const data = await tmdbService.getNowPlayingMovies();
    return data.results || [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    
    // Get recently interacted movies
    const interactions = await db.collection("movie_interactions")
      .find({ userId })
      .sort({ interactedAt: -1 })
      .limit(10)
      .toArray();

    if (interactions.length === 0) {
      const data = await tmdbService.getNowPlayingMovies();
      return data.results || [];
    }

    // Get enhanced movie details for these interactions
    const moviePromises = interactions.map(async (interaction) => {
      try {
        return await tmdbService.getMovieDetails(interaction.movieId);
      } catch (error) {
        console.error(`Error fetching movie ${interaction.movieId}:`, error);
        return null;
      }
    });

    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is TMDBMovie => movie !== null);
  } catch (error) {
    console.error("Error getting continue rating movies:", error);
    const data = await tmdbService.getNowPlayingMovies();
    return data.results || [];
  }
}

async function getTopSearchedMovies(): Promise<TMDBMovie[]> {
  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    
    // Get most searched terms
    const searchAggregation = await db.collection("searches").aggregate([
      {
        $group: {
          _id: "$query",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]).toArray();

    if (searchAggregation.length === 0) {
      const data = await tmdbService.getPopularMovies();
      return data.results || [];
    }

    // Search for movies based on top searches
    const topSearch = searchAggregation[0]._id;
    const data = await tmdbService.searchMovies(topSearch);
    return data.results || [];
  } catch (error) {
    console.error("Error getting top searched movies:", error);
    const data = await tmdbService.getPopularMovies();
    return data.results || [];
  }
}
