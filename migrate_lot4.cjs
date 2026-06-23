const fs = require('fs');

const modifications = {
  'app/api/admin/prompts/route.ts': {
    importZod: true,
    from: /const user = await getAuthenticatedUser\(\);\s*if \(!user\)\s*return NextResponse\.json\(\{ error: "Unauthorized" \}, \{ status: 401 \}\);\s*const \{\s*type,\s*content,\s*version\s*\} = await req\.json\(\);\s*const supabase = await createSupabaseServerClient\(\);/m,
    to: `const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const RequestSchema = z.object({
      type:    z.string().min(1).max(100),
      content: z.string().min(1).max(20000),
      version: z.string().min(1).max(50),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { type, content, version } = parsed.data;`
  },
  'app/api/career/update/route.ts': {
    importZod: true,
    extraImports: `import { createSupabaseServerClient } from "@/lib/supabase-server";\n`,
    from: /const body = await req\.json\(\);\s*const \{\s*userId,\s*sessionId,\s*interviewAnalysis,\s*uxFingerprint,\s*securitySignals,\s*\} = body;\s*if \(!userId \|\| !interviewAnalysis\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Missing required fields"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/m,
    to: `const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const userId = user.id;

    const RequestSchema = z.object({
      sessionId:         z.string().uuid().optional(),
      interviewAnalysis: z.object({
        communicationScore: z.number().min(0).max(100).optional(),
        confidenceScore:    z.number().min(0).max(100).optional(),
        technicalScore:     z.number().min(0).max(100).optional(),
        leadershipScore:    z.number().min(0).max(100).optional(),
        verbosity:          z.number().min(0).optional(),
        interruptionCount:  z.number().int().min(0).optional(),
        recoveryCount:      z.number().int().min(0).optional(),
        freezeCount:        z.number().int().min(0).optional(),
        completionRate:     z.number().min(0).max(100).optional(),
      }).optional(),
      uxFingerprint:   z.record(z.string(), z.unknown()).optional(),
      securitySignals: z.record(z.string(), z.unknown()).optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      sessionId,
      interviewAnalysis,
      uxFingerprint,
      securitySignals,
    } = parsed.data;

    if (!interviewAnalysis) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }`
  },
  'app/api/upload/route.ts': {
    from: /const formData = await req\.formData\(\);\s*const file = formData\.get\("file"\) as File;\s*if \(!file\) \{\s*return NextResponse\.json\(\{ error: "Fichier manquant" \}, \{ status: 400 \}\);\s*\}/m,
    to: `const formData = await req.formData();
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
      .replace(/\\.\\./g, "")
      .replace(/[^a-zA-Z0-9.\\-_]/g, "_")
      .slice(0, 100);`,
    additionalReplaces: [
      { from: /const filePath = `\$\{user\.id\}\/\$\{Date\.now\(\)\}-\$\{file\.name\}`;/, to: 'const filePath = `${user.id}/${Date.now()}-${safeName}`;' },
      { from: /file_name: file\.name,/g, to: 'file_name: safeName,' }
    ]
  },
  'app/api/ai/tts/route.ts': {
    importZod: true,
    extraImports: `import { envServer } from "@/lib/env.server";\n`,
    from: /const \{\s*textChunk\s*\} = await req\.json\(\);\s*if \(!textChunk\) \{\s*return NextResponse\.json\(\{ error: "Text chunk is required" \}, \{ status: 400 \}\);\s*\}\s*const ELEVENLABS_API_KEY = process\.env\.ELEVENLABS_API_KEY;\s*const ELEVENLABS_VOICE_ID = process\.env\.ELEVENLABS_VOICE_ID;/m,
    to: `const RequestSchema = z.object({
      textChunk: z.string().min(1).max(2000),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { textChunk } = parsed.data;

    const ELEVENLABS_API_KEY = envServer.ELEVENLABS_API_KEY;
    const ELEVENLABS_VOICE_ID = envServer.ELEVENLABS_VOICE_ID;`
  },
  'app/api/ai/stream/route.ts': {
    importZod: true,
    from: /const \{\s*transcript,\s*context\s*\} = await req\.json\(\);\s*if \(!transcript\) \{\s*return NextResponse\.json\(\{ error: "Transcript is required" \}, \{ status: 400 \}\);\s*\}/m,
    to: `const RequestSchema = z.object({
      transcript: z.string().min(1).max(10000),
      context:    z.string().max(200).optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { transcript, context } = parsed.data;`
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (config.importZod && !content.includes('import { z }')) {
      content = content.replace(/(import.*)/, `import { z } from "zod";\n$1`);
    }

    if (config.extraImports && !content.includes(config.extraImports.trim())) {
       content = content.replace(/(import.*)/, `${config.extraImports}$1`);
    }

    let changed = false;
    if (config.from.test(content)) {
      content = content.replace(config.from, config.to);
      changed = true;
    } else {
      console.log(`Failed to match regex in ${file}`);
    }

    if (config.additionalReplaces) {
      for (const replace of config.additionalReplaces) {
        if (replace.from.test(content)) {
          content = content.replace(replace.from, replace.to);
          changed = true;
        } else {
           console.log(`Failed to match additional regex in ${file}`);
        }
      }
    }

    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}
