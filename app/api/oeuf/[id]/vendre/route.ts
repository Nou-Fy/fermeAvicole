import { NextRequest } from "next/server";

import { sellOeuf } from "@/lib/server/services/farm-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { requireUser, unauthorizedResponse } from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const oeufId = context.params.id;
    if (!oeufId) {
      return badRequest("Oeuf manquant.");
    }

    return json(await sellOeuf(currentUser.id, oeufId));
  });
}
