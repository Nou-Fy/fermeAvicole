import { redirect } from "next/navigation";

export default function SantePage() {
  redirect("/dashboard/sante/vaccins");
}
