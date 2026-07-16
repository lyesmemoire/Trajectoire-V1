import { redirect } from "next/navigation";

// Redirect legacy career-copilot dashboard to new copilot page
export default async function CareerCopilotPage() {
  redirect("/copilot");
}

export const dynamic = "force-dynamic";
