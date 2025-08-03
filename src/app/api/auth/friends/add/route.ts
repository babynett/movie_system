import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);

    if (!currentUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { friendUsername } = await request.json();

    if (!friendUsername) {
      return NextResponse.json(
        { error: "Friend username is required" },
        { status: 400 }
      );
    }

    // Check if friend exists
    const friend = await prisma.user.findUnique({
      where: { username: friendUsername.toLowerCase() },
    });

    if (!friend) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if trying to add self
    if (friend.id === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot add yourself as a friend" },
        { status: 400 }
      );
    }

    // Check if already friends
    if (currentUser.friends.includes(friendUsername.toLowerCase())) {
      return NextResponse.json(
        { error: "Already friends with this user" },
        { status: 400 }
      );
    }

    // Add friend
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        friends: {
          push: friendUsername.toLowerCase(),
        },
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Add friend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
