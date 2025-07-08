import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("moviedatabase");
  const movies = await db.collection("Movies").find({}).toArray();
  return NextResponse.json(movies);
}
