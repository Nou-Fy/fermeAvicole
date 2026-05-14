// app/api/enclos/[id]/route.ts

import { NextResponse } from "next/server";
import { services } from "@/lib/server/services";
import {
  ApplicationError,
  EnclosureNotFoundError,
  ForbiddenError,
  EnclosureNotEmptyError,
} from "@/lib/server/services/errors"; // ✅ Importe les erreurs d'ici
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

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
