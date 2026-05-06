import { NextRequest } from "next/server";

import { markNotificationRead } from "@/lib/server/services/farm-service";
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

    const notificationId = context.params.id;
    if (!notificationId) {
      return badRequest("Notification manquante.");
    }

    return json(await markNotificationRead(currentUser.id, notificationId));
  });
}
