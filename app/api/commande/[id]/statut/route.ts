import { NextRequest } from "next/server";
import { StatutCommande } from "@prisma/client";

import { updateCommandeStatus } from "@/lib/server/services/farm-service";
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

    const commandeId = context.params.id;
    if (!commandeId) {
      return badRequest("Commande manquante.");
    }

    const body = await parseJsonBody(request);
    return json(
      await updateCommandeStatus(
        currentUser.id,
        commandeId,
        (body as { statut: StatutCommande }).statut,
      ),
    );
  });
}
