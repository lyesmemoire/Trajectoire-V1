const fs = require('fs');

const modifications = {
  'app/api/executive/session/route.ts': {
    importZod: true,
    from: /const id = req\.nextUrl\.searchParams\.get\("id"\);\s*if \(!id \|\| typeof id !== "string"\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Missing session ID"\s*\},\s*\{ status: 400 \}\s*\);\s*\}/s,
    to: `const RequestSchema = z.object({
    id: z.string().min(1).max(100),
  });
  const parsed = RequestSchema.safeParse({
    id: req.nextUrl.searchParams.get("id"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "ID de session invalide." }, { status: 400 });
  }
  const { id } = parsed.data;`
  },
  'app/api/executive/simulate/route.ts': {
    importZod: true,
    from: /let body: Record<string, unknown>;\s*try \{\s*body = await req\.json\(\);\s*\} catch \{\s*return NextResponse\.json\(\s*\{\s*error: "Invalid JSON body"\s*\},\s*\{ status: 400 \}\s*\);\s*\}\s*const rawScores = \{\s*strategicThinking: clamp\(Number\(body\.strategicThinking\) \|\| 0\),\s*stakeholderInfluence: clamp\(Number\(body\.stakeholderInfluence\) \|\| 0\),\s*decisionClarity: clamp\(Number\(body\.decisionClarity\) \|\| 0\),\s*authorityProjection: clamp\(Number\(body\.authorityProjection\) \|\| 0\),\s*pressureStability: clamp\(Number\(body\.pressureStability\) \|\| 0\),\s*\};/s,
    to: `const RequestSchema = z.object({
      strategicThinking:    z.number().min(0).max(100).optional().default(0),
      stakeholderInfluence: z.number().min(0).max(100).optional().default(0),
      decisionClarity:      z.number().min(0).max(100).optional().default(0),
      authorityProjection:  z.number().min(0).max(100).optional().default(0),
      pressureStability:    z.number().min(0).max(100).optional().default(0),
    });

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = RequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rawScores = {
      strategicThinking: clamp(parsed.data.strategicThinking),
      stakeholderInfluence: clamp(parsed.data.stakeholderInfluence),
      decisionClarity: clamp(parsed.data.decisionClarity),
      authorityProjection: clamp(parsed.data.authorityProjection),
      pressureStability: clamp(parsed.data.pressureStability),
    };`
  },
  'app/api/product/analyze/route.ts': {
    importZod: true,
    from: /let body: unknown;\s*try \{\s*body = await req\.json\(\);\s*\} catch \{\s*return NextResponse\.json\(\s*\{\s*error: "Corps de requête JSON invalide."\s*\},\s*\{ status: 400 \},\s*\);\s*\}\s*const \{\s*cvText,\s*jobText\s*\} = \(body \?\? \{\}\) as \{\s*cvText\?: unknown;\s*jobText\?: unknown;\s*\};\s*if \(typeof cvText !== "string" \|\| typeof jobText !== "string"\) \{\s*return NextResponse\.json\(\s*\{\s*error: "cvText et jobText \(string\) sont requis."\s*\},\s*\{ status: 400 \},\s*\);\s*\}\s*if \(!cvText\.trim\(\) \|\| !jobText\.trim\(\)\) \{\s*return NextResponse\.json\(\s*\{\s*error: "cvText et jobText ne peuvent pas être vides."\s*\},\s*\{ status: 400 \},\s*\);\s*\}/s,
    to: `let rawBody;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const RequestSchema = z.object({
    cvText:  z.string().min(10, "CV trop court.").max(15000),
    jobText: z.string().min(10, "Description trop courte.").max(8000),
  });

  const parsed = RequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cvText, jobText } = parsed.data;`
  },
  'app/api/product/interview/evaluate/route.ts': {
    importZod: true,
    from: /let body: unknown;\s*try \{\s*body = await req\.json\(\);\s*\} catch \{\s*return NextResponse\.json\(\s*\{\s*error: "Corps de requête JSON invalide."\s*\},\s*\{ status: 400 \},\s*\);\s*\}\s*const \{\s*answer,\s*gap\s*\} = \(body \?\? \{\}\) as \{\s*answer\?: unknown;\s*gap\?: unknown\s*\};\s*if \(typeof answer !== "string"\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Le champ « answer » \(string\) est requis."\s*\},\s*\{ status: 400 \},\s*\);\s*\}/s,
    to: `let rawBody;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const RequestSchema = z.object({
    answer: z.string().min(1, "La réponse est requise.").max(10000),
    gap:    z.string().max(5000).optional(),
  });

  const parsed = RequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { answer, gap } = parsed.data;`
  },
  'app/api/product/upload/route.ts': {
    from: /const file = form\.get\("file"\);\s*if \(!file \|\| !\(file instanceof File\)\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Aucun fichier fourni \(champ « file » requis\)."\s*\},\s*\{ status: 400 \},\s*\);\s*\}\s*\/\/ Sécurité : type & taille\.\s*const isPdf =\s*file\.type === "application\/pdf" \|\|\s*file\.name\.toLowerCase\(\)\.endsWith\("\.pdf"\);\s*if \(!isPdf\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Format non supporté : merci d'envoyer un PDF."\s*\},\s*\{ status: 415 \},\s*\);\s*\}\s*if \(file\.size > MAX_BYTES\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Fichier trop volumineux \(max 8 Mo\)."\s*\},\s*\{ status: 413 \},\s*\);\s*\}/s,
    to: `const file = form.get("file");

  const ALLOWED_MIME  = ["application/pdf"];

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux. Max 8MB." },
      { status: 413 }
    );
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. PDF uniquement." },
      { status: 415 }
    );
  }
  
  const rawName  = (file as File).name ?? "document.pdf";
  const safeName = rawName
    .replace(/\\.\\./g, "")
    .replace(/[^a-zA-Z0-9.\\-_]/g, "_")
    .slice(0, 100);`
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (config.importZod && !content.includes('import { z }')) {
      content = content.replace(/(import.*)/, `import { z } from "zod";\n$1`);
    }

    if (config.from.test(content)) {
      content = content.replace(config.from, config.to);
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Failed to match regex in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}
