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

    // Normalize the username
    const normalizedFriendUsername = friendUsername.toLowerCase();

    // Check if user is trying to add themselves
    if (normalizedFriendUsername === currentUser.username) {
      return NextResponse.json(
        { error: "Cannot add yourself as a friend" },
        { status: 400 }
      );
    }

    // Check if the friend user exists
    const friendUser = await prisma.user.findUnique({
      where: { username: normalizedFriendUsername },
    });

    if (!friendUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already friends
    if (currentUser.friends.includes(normalizedFriendUsername)) {
      return NextResponse.json(
        { error: "Already friends with this user" },
        { status: 400 }
      );
    }

    // Add friend to the array
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        friends: {
          push: normalizedFriendUsername, // Adds the string to the array
        },
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "Friend added successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Add friend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
