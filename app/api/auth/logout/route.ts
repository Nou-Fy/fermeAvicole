import { NextRequest } from "next/server";

import { logoutUser } from "@/lib/server/services/auth-service";
import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "@/lib/server/auth";
import { json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  return handleApiRequest(async () => {
    await logoutUser(getRefreshTokenFromCookies());
    const response = json({ message: "Déconnexion effectuée." });
    clearAuthCookies(response);
    return response;
  });
}
