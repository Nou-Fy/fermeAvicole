import { NextRequest } from "next/server";

import { getAnimal, updateAnimal } from "@/lib/server/services/farm-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const animalId = context.params.id;
    if (!animalId) {
      return badRequest("Animal manquant.");
    }

    return json(await getAnimal(currentUser.id, animalId));
  });
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } },
) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const animalId = context.params.id;
    if (!animalId) {
      return badRequest("Animal manquant.");
    }

    const body = await parseJsonBody(request);

    return json(
      await updateAnimal(currentUser.id, animalId, {
        poids:
          (body as { poids?: number }).poids !== undefined
            ? Number((body as { poids?: number }).poids)
            : undefined,
        etat: (body as { etat?: Parameters<typeof updateAnimal>[2]["etat"] })
          .etat,
        notes: (body as { notes?: string }).notes,
      }),
    );
  });
}
