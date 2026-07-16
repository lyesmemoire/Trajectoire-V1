import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CVEditorShell } from "@/components/cv-editor/CVEditorShell";
import prisma from "@/lib/prisma";

export default async function CVEditorPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login?redirect=/cv-editor");

  // Load the latest parsed CV from DB or start with a blank one
  const latestResume = await prisma.cVAnalysis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const initialCV = latestResume?.cvData || null;
  const aiCredits = 0; // Field does not exist on User model anymore

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
        Éditeur de CV Assisté par IA
      </h1>
      <CVEditorShell initialCV={initialCV} aiCredits={aiCredits} />
    </div>
  );
}
