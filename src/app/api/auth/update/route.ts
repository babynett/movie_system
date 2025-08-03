import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getTokenFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  age?: number;
  preferredGenres?: string[];
};

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const currentUser = await getUserFromToken(token);

    if (!currentUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updateData = await request.json();

    // Only allow updating specific fields
    const allowedFields: (keyof UpdateUserData)[] = [
      "firstName",
      "lastName",
      "age",
      "preferredGenres",
    ];
    const filteredData: UpdateUserData = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // Validate age if provided
    if (filteredData.age && (filteredData.age < 13 || filteredData.age > 120)) {
      return NextResponse.json(
        { error: "Age must be between 13 and 120" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: filteredData,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
