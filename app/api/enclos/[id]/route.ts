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

    const enclosureService = services.getEnclosureService();
    await enclosureService.deleteEnclosure(session.sub, params.id);

    return NextResponse.json(
      { message: "Enclosure deleted successfully" },
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
