import { NextRequest } from "next/server";

import { checkIfUserExists } from "@/lib/server/services/auth-service";
import { badRequest, json } from "@/lib/server/http";
import { handleApiRequest } from "@/app/api/middleware/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleApiRequest(async () => {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return badRequest("Email manquant.");
    }

    return json(await checkIfUserExists(email));
  });
}
