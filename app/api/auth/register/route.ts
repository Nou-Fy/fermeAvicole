import { NextRequest } from "next/server";

import { registerUser } from "@/lib/server/services/auth-service";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { parseJsonBody, successWithCookies } from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handleApiRequest(async () => {
    const body = await parseJsonBody(request);
    const result = await registerUser(
      body as Parameters<typeof registerUser>[0],
    );

    return successWithCookies(
      { user: result.user },
      result.accessToken,
      result.refreshToken,
    );
  });
}
