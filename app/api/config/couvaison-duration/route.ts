import { NextRequest } from "next/server";

import {
  getCouvaisonDuration,
  updateCouvaisonDuration,
} from "@/lib/server/services/farm-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    return json(await getCouvaisonDuration());
  });
}

export async function PUT(request: NextRequest) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const body = await parseJsonBody(request);
    return json(
      await updateCouvaisonDuration(
        Number((body as { durationDays: number }).durationDays),
      ),
    );
  });
}
