import { NextRequest, NextResponse } from "next/server";
import { tmdbService, getImageUrl, getBackdropUrl } from "@/lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    // Get comprehensive movie data
    const movieDetails = await tmdbService.getEnhancedMovieDetails(movieId);
    
    // Get similar movies and recommendations
    const [similarMovies, recommendations] = await Promise.all([
      tmdbService.getSimilarMovies(movieId),
      tmdbService.getMovieRecommendations(movieId)
    ]);

    // Enhance the response with additional computed data
    const enhancedMovie = {
      ...movieDetails,
      poster_url: getImageUrl(movieDetails.poster_path, 'w500'),
      poster_url_large: getImageUrl(movieDetails.poster_path, 'original'),
      backdrop_url: getBackdropUrl(movieDetails.backdrop_path, 'w1280'),
      backdrop_url_large: getBackdropUrl(movieDetails.backdrop_path, 'original'),
      rating_percentage: movieDetails.vote_average ? Math.round(movieDetails.vote_average * 10) : null,
      rating_color: movieDetails.vote_average 
        ? movieDetails.vote_average >= 7 ? 'green' 
        : movieDetails.vote_average >= 5 ? 'yellow' 
        : 'red'
        : 'gray',
      release_year: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null,
      runtime_formatted: movieDetails.runtime 
        ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`
        : null,
      budget_formatted: movieDetails.budget 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movieDetails.budget)
        : null,
      revenue_formatted: movieDetails.revenue 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movieDetails.revenue)
        : null,
      director: movieDetails.credits.crew.find(person => person.job === 'Director'),
      main_cast: movieDetails.credits.cast.slice(0, 10).map(actor => ({
        ...actor,
        profile_url: getImageUrl(actor.profile_path, 'w200')
      })),
      writers: movieDetails.credits.crew.filter(person => 
        person.job === 'Writer' || person.job === 'Screenplay' || person.job === 'Story'
      ).slice(0, 3),
      producers: movieDetails.credits.crew.filter(person => 
        person.job === 'Producer' || person.job === 'Executive Producer'
      ).slice(0, 3),
      similar_movies: similarMovies.results.slice(0, 6).map(movie => ({
        ...movie,
        poster_url: getImageUrl(movie.poster_path, 'w300'),
        rating_percentage: movie.vote_average ? Math.round(movie.vote_average * 10) : null
      })),
      recommendations: recommendations.results.slice(0, 6).map(movie => ({
        ...movie,
        poster_url: getImageUrl(movie.poster_path, 'w300'),
        rating_percentage: movie.vote_average ? Math.round(movie.vote_average * 10) : null
      })),
      genres_formatted: movieDetails.genres?.map(g => g.name).join(', ') || '',
      countries_formatted: movieDetails.production_countries?.map(c => c.name).join(', ') || '',
      languages_formatted: movieDetails.spoken_languages?.map(l => l.english_name).join(', ') || '',
      companies_formatted: movieDetails.production_companies?.map(c => c.name).join(', ') || ''
    };

    return NextResponse.json(enhancedMovie);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
