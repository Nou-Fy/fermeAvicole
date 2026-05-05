import { NextRequest } from "next/server";

import { createPayment } from "@/lib/server/services/subscription-service";
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
    const payload = body as {
      subscriptionId: string;
      amount: number;
      paymentMethod?: string;
    };

    return created(
      await createPayment(
        payload.subscriptionId,
        Number(payload.amount),
        payload.paymentMethod as Parameters<typeof createPayment>[2],
      ),
    );
  });
}
