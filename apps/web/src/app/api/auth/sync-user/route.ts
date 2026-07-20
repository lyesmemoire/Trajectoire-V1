import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier le token Supabase dans les headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header manquant" }, { status: 401 });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Rate limiting
    const rateLimitResult = await checkRateLimit(user.id, "sync_user");
    if (rateLimitResult.blocked) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { 
          status: 429,
          headers: rateLimitResult.headers
        }
      );
    }

    const body = await req.json();
    const { fullName } = body;

    // 3. Utiliser user.id du TOKEN (source de vérité), pas du body
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: fullName,
      },
      create: {
        id: user.id,
        email: user.email!,
        name: fullName,
        referralCode: generateReferralCode(),
      },
    });

    console.info("[SyncUser] User DB synchronisé:", { userId: user.id });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[SyncUser] Échec sync DB:", {
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json({ error: "Erreur de synchronisation" }, { status: 500 });
  }
}
