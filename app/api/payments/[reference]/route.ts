import { NextRequest } from "next/server";

import { listPayments } from "@/lib/server/services/subscription-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { requireUser, unauthorizedResponse } from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: { reference: string } },
) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const reference = context.params.reference;
    if (!reference) {
      return badRequest("Référence de paiement manquante.");
    }

    return json(await listPayments(reference));
  });
}
