import { NextRequest } from "next/server";

import { finishCouvaison } from "@/lib/server/services/farm-service";
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

    const couvaisonId = context.params.id;
    if (!couvaisonId) {
      return badRequest("Couvaison manquante.");
    }

    const body = await parseJsonBody(request);
    return json(
      await finishCouvaison(currentUser.id, couvaisonId, {
        nombrePoussins: Number(
          (body as { nombrePoussins: number }).nombrePoussins,
        ),
        note: (body as { note?: string }).note,
      }),
    );
  });
}
