import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface MovieInteractionQuery {
  userId: string;
  type?: string;
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("moviedatabase");
    const interactions = db.collection("movie_interactions");

    const body = await req.json();
    const { movieId, movieTitle, userId, type } = body;

    if (!movieId || !movieTitle || !userId || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await interactions.insertOne({
      movieId,
      movieTitle,
      userId,
      type, // "review", "chat_mention", "view"
      interactedAt: new Date(),
    });

    return NextResponse.json({ message: "Interaction tracked!" });
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
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ interactions: [] });
    }

    const client = await clientPromise;
    const db = client.db("moviedatabase");
    
    const query: MovieInteractionQuery = { userId };
    if (type) {
      query.type = type;
    }

    const interactions = await db.collection("movie_interactions")
      .find(query)
      .sort({ interactedAt: -1 })
      .toArray();

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
