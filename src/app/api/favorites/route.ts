import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Genre, CastMember } from "@/lib/tmdb";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    const favorites = db.collection("favorites");

    const body = await req.json();
    const { movieId, title, poster_path, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if already favorited by this user
    const exists = await favorites.findOne({ movieId, userId });
    if (exists) {
      // Remove from favorites
      await favorites.deleteOne({ movieId, userId });
      return NextResponse.json({ message: "Removed from favorites!" });
    }

    // Fetch additional movie details from TMDB
    let genres = [];
    let actors = [];
    
    if (API_KEY) {
      try {
        // Get movie details including genres
        const movieResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
        );
        const movieData = await movieResponse.json();
        genres = movieData.genres?.map((g: Genre) => g.name) || [];

        // Get movie credits for actors
        const creditsResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        const creditsData = await creditsResponse.json();
        actors = creditsData.cast?.slice(0, 5).map((actor: CastMember) => actor.name) || [];
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    await favorites.insertOne({
      movieId,
      movieTitle: title,
      posterPath: poster_path,
      genres,
      actors,
      userId,
      addedAt: new Date(),
    });

    return NextResponse.json({ message: "Added to favorites!" });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const client = await clientPromise;
    const db = client.db("moviedatabase");
    const favorites = await db.collection("favorites")
      .find({ userId })
      .sort({ addedAt: -1 })
      .toArray();

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
