import { NextRequest } from "next/server";

import { getSubscriptionStatus } from "@/lib/server/services/subscription-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { requireUser, unauthorizedResponse } from "@/app/api/middleware/auth";

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

    const subscriptionId = context.params.id;
    if (!subscriptionId) {
      return badRequest("Id d'abonnement manquant.");
    }

    return json(await getSubscriptionStatus(currentUser.id));
  });
}
