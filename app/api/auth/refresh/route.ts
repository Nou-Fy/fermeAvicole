import { NextRequest } from "next/server";

import { refreshUserSession } from "@/lib/server/services/auth-service";
import { getRefreshTokenFromCookies } from "@/lib/server/auth";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";
import { parseJsonBody, successWithCookies } from "@/app/api/middleware/auth";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  return handleApiRequest(async () => {
    const result = await refreshUserSession(getRefreshTokenFromCookies());

    return successWithCookies(
      { user: result.user },
      result.accessToken,
      result.refreshToken,
    );
  });
}
