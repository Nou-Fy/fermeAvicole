import { NextRequest } from "next/server";

import { createOeuf, listOeufs } from "@/lib/server/services/farm-service";
import { created, json } from "@/lib/server/http";
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

    return json(await listOeufs(currentUser.id));
  });
}

export async function POST(request: NextRequest) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const body = await parseJsonBody(request);
    return created(
      await createOeuf(
        currentUser.id,
        body as Parameters<typeof createOeuf>[1],
      ),
    );
  });
}
