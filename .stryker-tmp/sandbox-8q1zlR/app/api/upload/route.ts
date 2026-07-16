// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import OpenAI from "openai";
import { chunkText } from "@/lib/ai/chunker";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { getStrictUser } from "@/lib/auth/get-user";
import { uploadLimiter } from "@/lib/security/rate-limit";
import { envServer } from "@/lib/env.server";

let openai: OpenAI;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: envServer.OPENAI_API_KEY || "dummy" });
  }
  return openai;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { success } = await uploadLimiter.limit(`upload:${user.id}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const supabase = await createServerClient();

    const formData = await req.formData();
    const file = formData.get("file");

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const ALLOWED_MIME  = ["application/pdf"];

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux. Max 10MB." }, { status: 413 });
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporté. PDF uniquement." }, { status: 415 });
    }

    const rawName  = (file as File).name ?? "upload.pdf";
    const safeName = rawName
      .replace(/\.\./g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .slice(0, 100);

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Extraction texte PDF
    const pdfData = await pdf(buffer);
    const extractedText = pdfData.text;

    // ✅ Limites PDF (anti token explosion)
    const MAX_CHARS = 30000;
    const MAX_CHUNKS = 20;
    const safeText = extractedText.slice(0, MAX_CHARS);

    // Ensure the "cvs" bucket exists and perform actions using the admin client for maximum robustness
    const supabaseAdmin = createAdminClientSupabase();

    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const hasCvsBucket = buckets?.some((b: any) => b.name === "cvs");
      if (!hasCvsBucket) {
        await supabaseAdmin.storage.createBucket("cvs", {
          public: false,
        });
      }
    } catch (err) {
      console.warn("Failed to check/create 'cvs' bucket:", err);
    }

    // ✅ Upload storage (using admin client to bypass Storage RLS constraints on newly created bucket)
    const filePath = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("cvs")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // ✅ Save DB (using admin client for robustness, user_id is explicitly set for safety)
    const { data: inserted, error: dbError } = await supabaseAdmin
      .from("cvs")
      .insert({
        user_id: user.id,
        file_name: safeName,
        storage_path: filePath,
        extracted_text: safeText,
      })
      .select("id, file_name")
      .single();

    if (dbError) throw dbError;

    // =========================================
    // ✅ GENERATE EMBEDDINGS (RAG)
    // =========================================

    // 1. Chunking
    const chunks = chunkText(safeText, 1000, 50).slice(0, MAX_CHUNKS);

    if (chunks.length > 0) {
      // 2. Batch generate embeddings for all chunks
      let embeddingResponse;
      try {
        embeddingResponse = await getOpenAI().embeddings.create({
          model: "text-embedding-3-small",
          input: chunks,
        });
      } catch (e: any) {
        if (e?.status === 429) {
          const ADMIN_EMAILS = ["anislamine1980@gmail.com"];
          const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
          if (isAdmin) {
            console.warn(
              "Quota OpenAI dépassé, tentative de retry dans 2s pour admin...",
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
              embeddingResponse = await getOpenAI().embeddings.create({
                model: "text-embedding-3-small",
                input: chunks,
              });
            } catch (retryError) {
              return NextResponse.json(
                {
                  error:
                    "Service temporairement indisponible, réessayez dans quelques secondes.",
                },
                { status: 503 },
              );
            }
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }

      // 3. Prepare inserts
      const embeddingInserts = chunks.map((chunk, index) => ({
        cv_id: inserted.id,
        section_text: chunk,
        embedding: embeddingResponse?.data[index]?.embedding,
      }));

      // 4. Save to DB (using service_role since policy on insert with join can be tricky)
      const supabaseAdmin = createAdminClientSupabase();

      const { error: embedError } = await supabaseAdmin
        .from("cv_embeddings")
        .insert(embeddingInserts);

      if (embedError) {
        console.error("Failed to save embeddings", embedError);
        // We do not fail the upload just because embeddings failed,
        // though in production we might want a retry queue.
      }
    }

    return NextResponse.json({
      success: true,
      cvId: inserted?.id,
      fileName: inserted?.file_name,
    });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 },
    );
  }
}
