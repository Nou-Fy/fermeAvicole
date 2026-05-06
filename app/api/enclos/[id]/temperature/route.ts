import { NextRequest } from "next/server";

import { updateEnclosClimate } from "@/lib/server/services/farm-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function PUT(
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
    return json(
      await updateEnclosClimate(currentUser.id, enclosId, {
        temperature:
          (body as { temperature?: number }).temperature !== undefined
            ? Number((body as { temperature?: number }).temperature)
            : undefined,
        humidite:
          (body as { humidite?: number }).humidite !== undefined
            ? Number((body as { humidite?: number }).humidite)
            : undefined,
      }),
    );
  });
}
