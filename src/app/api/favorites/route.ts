import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    const favorites = db.collection("favorites");

    const body = await req.json();
    const { movieId, title, poster_path } = body;

    // Optional: prevent duplicate favorites
    const exists = await favorites.findOne({ movieId });
    if (exists) {
      return NextResponse.json(
        { message: "Already favorited" },
        { status: 409 }
      );
    }

    await favorites.insertOne({
      movieId,
      title,
      poster_path,
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
