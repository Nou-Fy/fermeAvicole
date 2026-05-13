import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    console.log("🔍 ID reçu:", id);
    console.log("🔍 Prisma client disponible?", !!Prisma);
    console.log("🔍 prisma.animal disponible?", !!prisma.animal);

    const body = await request.json();
    console.log("🔍 Body reçu:", body);

    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data: {
        etat: "DECEDE",
        deathDate: new Date(),
      },
    });

    return NextResponse.json(
      { message: "OK", data: updatedAnimal },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Erreur complète:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}
