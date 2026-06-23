const fs = require('fs');

const modifications = {
  'app/api/register/route.ts': {
    from1: /const body = await req\.json\(\);\s*console\.log\("FETCH BODY:", \{ \.\.\.body, password: "\*\*\*" \}\);\s*const \{\s*email,\s*password,\s*fingerprint,\s*company,\s*fullName\s*\} = body;\s*\/\/\s*✅ HONEYPOT \(Anti-Bot\)\s*if \(company\) \{\s*console\.warn\(`\[BOT DETECTED\] Honeypot filled by IP: \$\{ip\}`\);\s*return NextResponse\.json\(\{ error: "Bot detected" \}, \{ status: 400 \}\);\s*\}\s*if \(!email \|\| !password\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Email et mot de passe requis"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/s,
    to1: `const RequestSchema = z.object({
      email:       z.string().email("Email invalide"),
      password:    z.string().min(8, "Mot de passe trop court").max(128, "Mot de passe trop long"),
      fingerprint: z.string().max(500).optional(),
      company:     z.string().optional(),
      fullName:    z.string().max(100).optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, fingerprint, company, fullName } = parsed.data;
    console.log("FETCH BODY:", { email, fingerprint, company, fullName, password: "***" });

    // ✅ HONEYPOT (Anti-Bot)
    if (company) {
      console.warn(\`[BOT DETECTED] Honeypot filled by IP: \${ip}\`);
      return NextResponse.json(
        { message: "Si cette adresse est valide, un email de confirmation a été envoyé." },
        { status: 200 }
      );
    }`,
    from2: /if \(error\) \{\s*console\.error\("SUPABASE CREATE USER ERROR:", error\);\s*\/\*[\s\S]*?\*\/\s*if \([\s\S]*?error\.message\.includes\("fetch failed"\)[\s\S]*?\s*\)\s*\{\s*return NextResponse\.json\([\s\S]*?status: 500[\s\S]*?\);\s*\}\s*return NextResponse\.json\(\{ error: error\.message \}, \{ status: 400 \}\);\s*\}/s,
    to2: `if (error) {
      console.error("[Register] Supabase error:", error.code, error.message);

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

      // ANTI-ORACLE: Return success for user enumeration errors
      return NextResponse.json(
        { message: "Si cette adresse est valide, un email de confirmation a été envoyé." },
        { status: 200 }
      );
    }`
  },
  'app/api/recovery/send/route.ts': {
    from1: /const body = \(await req\.json\(\)\) as RecoveryEmailInput;\s*if \(!body\.userId \|\| !body\.email\) \{\s*return NextResponse\.json\(\s*\{\s*error: "userId et email requis"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/,
    to1: `const RequestSchema = z.object({
      userId: z.string().uuid("userId doit être un UUID valide"),
      email:  z.string().email("Email invalide"),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data as unknown as RecoveryEmailInput;`
  },
  'app/api/waitlist/apply/route.ts': {
    from1: /const body = await req\.json\(\);\s*const \{\s*email,\s*pressureType,\s*weakness,\s*intentReason,\s*isWillingToRetry\s*\}\s*=\s*body;\s*if \(!email\)\s*return NextResponse\.json\(\{ error: "Email requis" \}, \{ status: 400 \}\);/s,
    to1: `const RequestSchema = z.object({
      email:            z.string().email("Email invalide"),
      pressureType:     z.string().max(200).optional(),
      weakness:         z.string().max(500).optional(),
      intentReason:     z.string().max(500).optional(),
      isWillingToRetry: z.boolean().optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, pressureType, weakness, intentReason, isWillingToRetry } = parsed.data;`
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('RequestSchema')) {
      console.log(`Skipping ${file} (already modified)`);
      continue;
    }

    if (!content.includes('import { z }')) {
      content = content.replace(/(import.*)/, `import { z } from "zod";\n$1`);
    }

    let changed = false;
    if (config.from1 && config.from1.test(content)) {
      content = content.replace(config.from1, config.to1);
      changed = true;
    }
    if (config.from2 && config.from2.test(content)) {
      content = content.replace(config.from2, config.to2);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Failed to match regex in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}

// Special manual handling for stripe/checkout/route.ts
const stripePath = 'app/api/stripe/checkout/route.ts';
if (fs.existsSync(stripePath)) {
  let content = fs.readFileSync(stripePath, 'utf8');
  if (!content.includes('RequestSchema')) {
    if (!content.includes('import { z }')) {
      content = content.replace(/(import.*)/, `import { z } from "zod";\nimport { envServer } from "@/lib/env.server";\n$1`);
    }

    const setRegex = /const VALID_PRICE_IDS = new Set\(\[\s*"price_starter_5credits",\s*"price_pro_15credits",\s*"price_executive_analysis",\s*"price_premium_access"(?: \/\* Logical price ID sent by frontend \*\/)?\s*\]\);/;
    
    if (setRegex.test(content)) {
        content = content.replace(
          setRegex,
          `// Configuration de paiement dynamique via envServer
const VALID_PRICE_IDS = [
  envServer.STRIPE_PRICE_EARLY,
  envServer.STRIPE_PRO_PRICE_ID,
  envServer.STRIPE_EXPERT_PRICE_ID,
  "price_starter_5credits",
  "price_executive_analysis",
  "price_premium_access" // Logical ID
].filter((id): id is string => typeof id === "string" && id.startsWith("price_"));`
        );
    } else {
        console.log("Failed to match setRegex in stripe/checkout/route.ts");
    }

    const bodyRegex = /const \{\s*priceId\s*\} = await request\.json\(\);[\s\S]*?if \(!priceId \|\| !VALID_PRICE_IDS\.has\(priceId\)\) \{\s*return NextResponse\.json\(\{ error: "Invalid price ID" \}, \{ status: 400 \}\);\s*\}/;
    if (bodyRegex.test(content)) {
        content = content.replace(
          bodyRegex,
          `if (VALID_PRICE_IDS.length === 0) {
    console.error("[Checkout] Aucun price ID configuré dans envServer");
    return NextResponse.json(
      { error: "Configuration paiement invalide." },
      { status: 503 }
    );
  }

  const RequestSchema = z.object({
    priceId: z.string().refine(
      (id) => VALID_PRICE_IDS.includes(id),
      { message: "Plan invalide." }
    ),
  });

  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { priceId } = parsed.data;`
        );
    } else {
        console.log("Failed to match bodyRegex in stripe/checkout/route.ts");
    }

    fs.writeFileSync(stripePath, content);
    console.log(`Updated ${stripePath}`);
  }
}
