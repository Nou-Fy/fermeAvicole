// Example: Refactored animals API route - Demonstrates SOLID principles in action
// BEFORE: Direct Prisma calls, mixed concerns
// AFTER: Using service layer, clean separation of concerns

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { services } from "@/lib/server/services";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ GOOD: Using AnimalService (SRP) instead of direct Prisma
    const animalService = services.getAnimalService();
    const animals = await animalService.listAnimals(session.user.id);

    return NextResponse.json(animals);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // ✅ GOOD: Service handles validation, authorization, and business logic
    const animalService = services.getAnimalService();
    const animal = await animalService.addAnimal(session.user.id, body);

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
