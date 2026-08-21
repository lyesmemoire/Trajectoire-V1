import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * The former `matching_history` table is not part of the current database
 * contract.
 *
 * Keep the API endpoint and its frontend response contract alive while
 * returning an empty history until matching persistence is implemented
 * against a supported domain model.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({ history: [] });
  } catch (error) {
    console.error("[Matching History] Unexpected error:", error);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
