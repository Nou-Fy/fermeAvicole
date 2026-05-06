import { NextRequest } from "next/server";

import { createCouvaison } from "@/lib/server/services/farm-service";
import { created } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import {
  parseJsonBody,
  requireUser,
  unauthorizedResponse,
} from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handleApiRequest(async () => {
    const currentUser = await requireUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    const body = await parseJsonBody(request);
    return created(
      await createCouvaison(
        currentUser.id,
        body as Parameters<typeof createCouvaison>[1],
      ),
    );
  });
}
