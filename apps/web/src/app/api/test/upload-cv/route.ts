import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Test endpoint disabled in production",
      },
      { status: 403 },
    );
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userId = user?.id;

    if (!userId) {
      const {
        data: { user: newUser },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: "test@trajectoire.com",
        password: "test123456",
      });

      if (signInError || !newUser) {
        return NextResponse.json(
          {
            error: "Authentication failed",
            details: signInError?.message,
          },
          { status: 401 },
        );
      }

      userId = newUser.id;
    }

    const cvPath = join(
      process.cwd(),
      "../../test_cv.txt",
    );

    const cvContent = await readFile(
      cvPath,
      "utf-8",
    );

    const {
      data: cvData,
      error: cvError,
    } = await supabase
      .from("CVAnalysis")
      .insert({
        id: randomUUID(),
        userId,
        fileName: "test_cv.txt",
        originalText: cvContent,
        optimizedText: cvContent,
        cvData: {
          content: cvContent,
        },
        atsScoreBefore: 50,
        atsScoreAfter: 75,
      })
      .select()
      .single();

    if (cvError) {
      return NextResponse.json(
        {
          error: "CV insert failed",
          details: cvError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      cv: cvData,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    const stack =
      error instanceof Error
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: message,
        ...(stack ? { stack } : {}),
      },
      { status: 500 },
    );
  }
}
