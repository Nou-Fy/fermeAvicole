import { NextResponse } from "next/server";
import { services } from "@/lib/server/services";
import { ApplicationError } from "@/lib/server/services/errors"; // ✅ Importe les erreurs d'ici
import { getSessionFromCookies } from "@/lib/server/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionFromCookies();

    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Extraire les données envoyées par le client (le "input")
    const body = await req.json();

    const enclosureService = services.getEnclosureService();

    // 2. Passer les 3 arguments nécessaires : userId, enclosureId, et les données (body)
    await enclosureService.updateEnclosure(session.sub, params.id, body);

    return NextResponse.json(
      { message: "Enclosure updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionFromCookies();

    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Récupérer les services nécessaires
    const enclosureService = services.getEnclosureService();
    // const animalService = services.getAnimalService();

    // 2. Retirer l'ID de l'enclos pour tous les animaux concernés (via la boucle Promise.all)
    // await animalService.unassignAnimalsFromEnclosure(params.id);

    // 3. Supprimer définitivement l'enclos ensuite
    await enclosureService.deleteEnclosure(session.sub, params.id);

    return NextResponse.json(
      { message: "Enclosure and animal assignments deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    // Gestion des erreurs métier (ApplicationError)
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    // Gestion des erreurs génériques (ex: Error levée par le AnimalService)
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
