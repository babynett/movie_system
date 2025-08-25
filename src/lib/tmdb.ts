// TMDB API Service
// Comprehensive service to handle all TMDB API endpoints

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Types for TMDB API responses
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface GuestSession {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

export interface RatedMovie extends TMDBMovie {
  rating: number;
}

// API parameter types
export interface APIParams {
  [key: string]: string | number | boolean | undefined;
}

export interface MovieDetailsParams {
  [key: string]: string | number | boolean | undefined;
  append_to_response?: string;
}

export interface RatingResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}

export interface DiscoverMoviesParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  with_genres?: string;
  with_cast?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  'primary_release_year'?: number;
  sort_by?: string;
}

class TMDBService {
  private apiKey: string;

  constructor() {
    if (!API_KEY) {
      console.error("TMDB API key is missing. Please check your NEXT_PUBLIC_TMDB_API_KEY environment variable.");
      throw new Error("TMDB API key is required");
    }
    
    console.log(`TMDB API Key loaded: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)} (${API_KEY.length} chars)`);
    this.apiKey = API_KEY;
  }

  private async makeRequest<T>(endpoint: string, params: APIParams = {}): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    // Check if the API key looks like a bearer token (starts with 'eyJ' for JWT or is very long)
    const isBearerToken = this.apiKey.length > 50 || this.apiKey.startsWith('eyJ');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isBearerToken) {
      // Use Bearer token authentication
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else {
      // Use API key authentication
      url.searchParams.append('api_key', this.apiKey);
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} ${response.statusText}`);
      console.error(`Endpoint: ${endpoint}`);
      console.error(`URL: ${url.toString()}`);
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 1. Discover Movies API
  async discoverMovies(params: {
    sort_by?: string;
    with_genres?: string;
    vote_count_gte?: number;
    vote_average_gte?: number;
    release_date_gte?: string;
    release_date_lte?: string;
    with_cast?: string;
    with_crew?: string;
    page?: number;
  } = {}): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/discover/movie', params);
  }

  // 2. Movie Genre List API
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.makeRequest('/genre/movie/list');
  }

  // 3. Get Movie Details
  async getMovieDetails(movieId: number, appendToResponse?: string[]): Promise<TMDBMovie> {
    const params: MovieDetailsParams = {};
    if (appendToResponse && appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(',');
    }
    return this.makeRequest(`/movie/${movieId}`, params);
  }

  // 4. Get Movie Credits
  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    return this.makeRequest(`/movie/${movieId}/credits`);
  }

  // 5. Search Movies
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/search/movie', { query, page });
  }

  // 6. Create Guest Session
  async createGuestSession(): Promise<GuestSession> {
    return this.makeRequest('/authentication/guest_session/new');
  }

  // 7. Get Guest Session Rated Movies
  async getGuestRatedMovies(guestSessionId: string, page: number = 1): Promise<TMDBResponse<RatedMovie>> {
    return this.makeRequest(`/guest_session/${guestSessionId}/rated/movies`, { page });
  }

  // 8. Rate Movie (Guest Session)
  async rateMovieGuest(movieId: number, guestSessionId: string, rating: number): Promise<RatingResponse> {
    const url = new URL(`${API_BASE_URL}/movie/${movieId}/rating`);
    url.searchParams.append('guest_session_id', guestSessionId);
    
    // Check if the API key looks like a bearer token
    const isBearerToken = this.apiKey.length > 50 || this.apiKey.startsWith('eyJ');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isBearerToken) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else {
      url.searchParams.append('api_key', this.apiKey);
    }
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ value: rating })
    });

    return response.json();
  }

  // 9. Get Popular Movies
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/movie/popular', { page });
  }

  // 10. Get Top Rated Movies
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/movie/top_rated', { page });
  }

  // 11. Get Now Playing Movies
  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/movie/now_playing', { page });
  }

  // 12. Get Upcoming Movies
  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest('/movie/upcoming', { page });
  }

  // 13. Get Similar Movies
  async getSimilarMovies(movieId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest(`/movie/${movieId}/similar`, { page });
  }

  // 14. Get Movie Recommendations
  async getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.makeRequest(`/movie/${movieId}/recommendations`, { page });
  }

  // Enhanced movie discovery with all available data
  async getEnhancedMovieDetails(movieId: number): Promise<TMDBMovie & { credits: MovieCredits }> {
    const [details, credits] = await Promise.all([
      this.getMovieDetails(movieId, ['videos', 'images', 'keywords']),
      this.getMovieCredits(movieId)
    ]);

    return {
      ...details,
      credits
    };
  }

  // Get comprehensive movie data for recommendations
  async getMoviesWithFullDetails(movieIds: number[]): Promise<(TMDBMovie & { credits: MovieCredits })[]> {
    const promises = movieIds.map(id => this.getEnhancedMovieDetails(id));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<TMDBMovie & { credits: MovieCredits }> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Advanced movie discovery with multiple criteria
  async discoverMoviesAdvanced(criteria: {
    genres?: number[];
    actors?: number[];
    minRating?: number;
    minVoteCount?: number;
    releaseYear?: number;
    sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'revenue.desc';
    page?: number;
  }): Promise<TMDBResponse<TMDBMovie>> {
    const params: DiscoverMoviesParams = {
      page: criteria.page || 1,
      sort_by: criteria.sortBy || 'popularity.desc'
    };

    if (criteria.genres && criteria.genres.length > 0) {
      params.with_genres = criteria.genres.join(',');
    }

    if (criteria.actors && criteria.actors.length > 0) {
      params.with_cast = criteria.actors.join(',');
    }

    if (criteria.minRating) {
      params['vote_average.gte'] = criteria.minRating;
    }

    if (criteria.minVoteCount) {
      params['vote_count.gte'] = criteria.minVoteCount;
    }

    if (criteria.releaseYear) {
      params.year = criteria.releaseYear;
    }

    return this.discoverMovies(params);
  }
}

// Create singleton instance
export const tmdbService = new TMDBService();

// Helper functions for image URLs
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string | null => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
