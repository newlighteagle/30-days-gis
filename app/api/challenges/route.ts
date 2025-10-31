import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/challenges
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { day: "asc" },
    });
    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/challenges
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const challenge = await prisma.challenge.create({ data: body });
    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
