export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { validateEmail } from "@/lib/email-validator";
import { evaluateFraud } from "@/lib/security/fraud-engine";

const isProduction = process.env.NODE_ENV === "production";

/* -----------------------------
   ✅ Redis + Rate Limit
----------------------------- */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
    })
  : null;

/* -----------------------------
   ✅ Supabase Admin Client
----------------------------- */

import { createSupabaseServiceClient } from "@/lib/supabase-server";

/* -----------------------------
   ✅ Helpers
----------------------------- */

/* -----------------------------
   ✅ POST /api/register
----------------------------- */

export async function POST(req: NextRequest) {
  console.log("REGISTER ROUTE HIT");
  try {
    const supabaseAdmin = createSupabaseServiceClient();
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // 1. Rate Limiting par IP (fail-open)
    if (ratelimit) {
      try {
        const { success } = await ratelimit.limit(`register:${ip}`);
        if (!success) {
          return NextResponse.json(
            { error: "Trop de tentatives. Veuillez réessayer plus tard." },
            { status: 429 },
          );
        }
      } catch (rateLimitError) {
        console.warn(
          "[Register] Rate limiter indisponible, requête autorisée:",
          (rateLimitError as Error).message,
        );
      }
    }

    const body = await req.json();
    console.log("FETCH BODY:", { ...body, password: "***" });
    const { email, password, fingerprint, company, fullName } = body;

    // ✅ HONEYPOT (Anti-Bot)
    if (company) {
      console.warn(`[BOT DETECTED] Honeypot filled by IP: ${ip}`);
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 },
      );
    }

    const validation = validateEmail(email);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Mot de passe trop court (min 8 caractères)" },
        { status: 400 },
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();

    // ✅ Abstract API (strict en production)
    if (isProduction && !process.env.ABSTRACT_KEY) {
      throw new Error("ABSTRACT_KEY manquante en production");
    }

    if (process.env.ABSTRACT_KEY) {
      try {
        const verify = await fetch(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_KEY}&email=${email}`,
        );
        const data = await verify.json();

        if (
          data.is_disposable_email?.value === true ||
          data.deliverability === "UNDELIVERABLE"
        ) {
          return NextResponse.json(
            { error: "Email jetable ou invalide" },
            { status: 400 },
          );
        }
      } catch (err) {
        console.error("ABSTRACT API ERROR:", err);
      }
    }

    /* ✅ 3️⃣ Création utilisateur dans Supabase */
    console.log("FETCH URL: Supabase Auth (create user)");
    const { data: userData, error } = await supabaseAdmin.auth.admin.createUser(
      {
        email,
        password,
        email_confirm: false, // ⚠️ confirm obligatoire
      },
    );

    if (error) {
      console.error("SUPABASE CREATE USER ERROR:", error);

      // Prevent leaking raw Node.js fetch errors like "fetch failed" to the frontend
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("Failed to fetch")
      ) {
        return NextResponse.json(
          {
            error:
              "Impossible de contacter le service d'authentification (vérifiez les variables d'environnement SUPABASE_URL).",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    /* ✅ 4️⃣ Création profile sans crédits */
    await supabaseAdmin.from("profiles").insert({
      id: userData.user.id,
      full_name: fullName,
      credits: 0, // ✅ crédits donnés uniquement après confirmation email
      banned: false, // Par défaut
    });

    /* ✅ 6️⃣ Mise à jour IP Activity */
    await supabaseAdmin.rpc("increment_ip_activity", {
      ip_address_input: ip,
    });
    // Si rpc non existante, on le fait manuellement:
    const { data: ipData } = await supabaseAdmin
      .from("ip_activity")
      .select("*")
      .eq("ip_address", ip)
      .single();
    if (ipData) {
      await supabaseAdmin
        .from("ip_activity")
        .update({ registration_count: ipData.registration_count + 1 })
        .eq("ip_address", ip);
    } else {
      await supabaseAdmin
        .from("ip_activity")
        .insert({ ip_address: ip, registration_count: 1 });
    }

    /* ✅ 7️⃣ Sauvegarde du Device */
    if (fingerprint) {
      await supabaseAdmin.from("user_devices").insert({
        user_id: userData.user.id,
        fingerprint: fingerprint,
        ip_address: ip,
      });
    }

    /* ✅ 7️⃣ Évaluation Centralisée Fraude */
    try {
      const fraudEval = await evaluateFraud({
        userId: userData.user.id,
        ip,
        fingerprint,
      });

      if (fraudEval.fraudFlag) {
        console.warn(
          `[FRAUD ALERT] User ${userData.user.id} flagged with score ${fraudEval.risk}`,
        );
      }
    } catch (fraudErr) {
      console.error("FRAUD ENGINE ERROR:", fraudErr);
    }

    /* ✅ 9️⃣ Audit log */
    await supabaseAdmin.from("audit_logs").insert({
      user_id: userData.user.id,
      action: "user_registered",
      metadata: {
        email,
        ip,
        user_agent: req.headers.get("user-agent"),
        fingerprint,
      },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: "Compte créé. Vérifiez votre email pour activer votre compte.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur serveur inattendue",
      },
      { status: 500 },
    );
  }
}
