import { NextRequest } from "next/server";

import { assignAnimalToEnclos } from "@/lib/server/services/farm-service";
import { created, badRequest } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const enclosId = context.params.id;
    if (!enclosId) {
      return badRequest("Enclos manquant.");
    }

    const body = await parseJsonBody(request);
    return created(
      await assignAnimalToEnclos(
        currentUser.id,
        enclosId,
        body as Parameters<typeof assignAnimalToEnclos>[2],
      ),
    );
  });
}
