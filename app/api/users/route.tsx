import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0] });
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: user.firstName ?? "New User",
        email,
      })
      .returning();

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}