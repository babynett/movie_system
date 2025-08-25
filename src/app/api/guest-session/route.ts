import { NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

// POST - Create a new guest session
export async function POST() {
  try {
    const guestSession = await tmdbService.createGuestSession();
    
    if (guestSession.success) {
      return NextResponse.json({
        success: true,
        guest_session_id: guestSession.guest_session_id,
        expires_at: guestSession.expires_at
      });
    } else {
      return NextResponse.json(
        { message: "Failed to create guest session" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating guest session:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
