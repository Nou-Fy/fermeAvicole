import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getCurrentUserFromCookies } from "@/lib/server/auth";

export default async function RegisterPage() {
  const currentUser = await getCurrentUserFromCookies();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-wrap">
      <AuthForm mode="register" />
    </main>
  );
}
