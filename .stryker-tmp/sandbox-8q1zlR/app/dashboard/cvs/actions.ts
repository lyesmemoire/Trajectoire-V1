// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCv(cvId: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("cvs").delete().eq("id", cvId);

  if (error) {
    console.error("Failed to delete CV:", error);
    throw new Error("Impossible de supprimer le CV");
  }

  revalidatePath("/dashboard/cvs");
}
