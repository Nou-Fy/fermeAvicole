import { NextRequest } from "next/server";

import { softDeleteAnimal } from "@/lib/server/services/farm-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { requireUser, unauthorizedResponse } from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
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

    return json(await softDeleteAnimal(currentUser.id, animalId));
  });
}
