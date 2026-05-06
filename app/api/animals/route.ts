import { NextRequest, NextResponse } from "next/server";

import { createAnimal, listAnimals } from "@/lib/server/services/farm-service";
import { created, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

import { prisma } from "@/lib/prisma"; // Assure-toi que ton instance Prisma est bien importée

export const dynamic = "force-dynamic";

export async function GET() {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    return json(await listAnimals(currentUser.id));
  });
}

export async function POST(request: NextRequest) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const body = await parseJsonBody(request);
    return created(
      await createAnimal(
        currentUser.id,
        body as Parameters<typeof createAnimal>[1],
      ),
    );
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json(); // Récupère les données envoyées (status, raison)

    // Mise à jour directe en base de données
    const updatedAnimal = await prisma.animal.update({
      where: { id: id },
      data: {
        status: body.status,
        deathDate: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Animal mis à jour avec succès", data: updatedAnimal },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'animal" },
      { status: 500 },
    );
  }
}
