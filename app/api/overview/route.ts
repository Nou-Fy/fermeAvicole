import { listPlans, getActiveSubscription } from "@/lib/server/services/subscription-service";
import { getUserProfile } from "@/lib/server/services/auth-service";
import { getDashboardData } from "@/lib/server/services/farm-service";
import { requireCurrentUserFromCookies } from "@/lib/server/auth";
import { json, unauthorized, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await requireCurrentUserFromCookies();

    if (!currentUser) {
      return unauthorized();
    }

    const [profile, subscription, plans] = await Promise.all([
      getUserProfile(currentUser.id),
      getActiveSubscription(currentUser.id),
      listPlans(),
    ]);

    const overview = await getDashboardData(
      {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        farmName: profile.farmName,
        role: profile.role,
        createdAt: profile.createdAt,
        lastLogin: profile.lastLogin,
      },
      subscription,
      subscription?.payments ?? [],
    );

    return json({
      ...overview,
      plans,
    });
  } catch (error) {
    return serverError(error);
  }
}
