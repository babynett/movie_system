import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

// GET - Get user's rated movies (from guest session)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const guestSessionId = searchParams.get('guest_session_id');

    if (!guestSessionId) {
      return NextResponse.json({ ratings: [] });
    }

    const ratedMovies = await tmdbService.getGuestRatedMovies(guestSessionId);
    return NextResponse.json({ ratings: ratedMovies.results || [] });
  } catch (error) {
    console.error("Error fetching rated movies:", error);
    return NextResponse.json(
      { message: "Failed to fetch rated movies" },
      { status: 500 }
    );
  }
}

// POST - Rate a movie using guest session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieId, rating, guestSessionId } = body;

    if (!movieId || !rating || !guestSessionId) {
      return NextResponse.json(
        { message: "Missing required fields: movieId, rating, guestSessionId" },
        { status: 400 }
      );
    }

    if (rating < 0.5 || rating > 10) {
      return NextResponse.json(
        { message: "Rating must be between 0.5 and 10" },
        { status: 400 }
      );
    }

    const result = await tmdbService.rateMovieGuest(movieId, guestSessionId, rating);
    
    if (result.success) {
      return NextResponse.json({ 
        message: "Movie rated successfully",
        rating: rating,
        movieId: movieId
      });
    } else {
      return NextResponse.json(
        { message: result.status_message || "Failed to rate movie" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error rating movie:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
