import { NextRequest, NextResponse } from "next/server";

import { createEnclos, listEnclos } from "@/lib/server/services/farm-service";
import { created, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";
import { AuthorizationService } from "@/lib/server/services/authorization-service";
import { dataStore } from "@/lib/server/data-store";
import { EnclosureService } from "@/lib/server/services/enclosure-service";
import { ApplicationError } from "@/lib/server/services/errors";
import { getSessionFromCookies } from "@/lib/server/auth";
import { services } from "@/lib/server/services";

const authService = new AuthorizationService(dataStore);
const enclosureService = new EnclosureService(dataStore, authService);

export const dynamic = "force-dynamic";

export async function GET() {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    return json(await listEnclos(currentUser.id));
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
      await createEnclos(
        currentUser.id,
        body as Parameters<typeof createEnclos>[1],
      ),
    );
  });
}

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
