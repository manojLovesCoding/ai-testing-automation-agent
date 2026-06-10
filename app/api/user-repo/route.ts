import { db, repositories } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      repoId,
      name,
      fullName,
      private_,
      description,
      language,
      htmlUrl,

      owner,
    } = await req.json();

    const result = await db
      .insert(repositories)
      .values({
        userId,
        repoId,
        name,
        fullName: fullName,
        description,
        language,
        htmlUrl,
        private: private_ ? 1 : 0,

        owner,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST /api/user-repo error:", error);

    return NextResponse.json(
      { error: "Failed to save repository" },
      { status: 500 },
    );
  }
}
