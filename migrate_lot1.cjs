const fs = require('fs');

const modifications = {
  'app/api/interview/generate/route.ts': {
    schema: `const RequestSchema = z.object({
  messages: z.array(z.any()),
  personaId: z.string().min(1),
  jobContext: z.any().optional(),
  sessionId: z.string().uuid(),
});`,
    replaceFrom: /const body = await req\.json\(\);\s*const \{\s*messages,\s*personaId,\s*jobContext,\s*sessionId\s*\} = body;/,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { messages, personaId, jobContext, sessionId } = parsed.data;`
  },
  'app/api/interview/start/route.ts': {
    schema: `const RequestSchema = z.object({
  job_title: z.string().min(1).max(200),
  job_description: z.string().max(8000).optional().nullable(),
  cv_id: z.string().uuid().optional().nullable(),
});`,
    replaceFrom: /const \{\s*job_title,\s*job_description,\s*cv_id\s*\} = await req\.json\(\);/,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { job_title, job_description, cv_id } = parsed.data;`
  },
  'app/api/interview/premium/start/route.ts': {
    schema: `const RequestSchema = z.object({
  jobTitle: z.string().min(1).max(200),
  company: z.string().max(200).optional().nullable(),
  persona: z.string().min(1).max(100).optional().nullable(),
  difficulty: z.string().min(1).max(50).optional().nullable(),
});`,
    replaceFrom: /const body = await req\.json\(\);\s*const \{\s*jobTitle,\s*company,\s*persona,\s*difficulty\s*\} = body;/,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { jobTitle, company, persona, difficulty } = parsed.data;`
  },
  'app/api/interview/answer/route.ts': {
    schema: `const RequestSchema = z.object({
  session_id: z.string().uuid(),
  answer: z.string().min(1).max(8000).optional().nullable(),
});`,
    replaceFrom: /const \{\s*session_id,\s*answer\s*\} = await req\.json\(\);/,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { session_id, answer } = parsed.data;`
  },
  'app/api/interview/analyze/route.ts': {
    schema: `const RequestSchema = z.object({
  session_id: z.string().uuid(),
});`,
    replaceFrom: /const \{\s*session_id\s*\} = await req\.json\(\);/,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { session_id } = parsed.data;`
  },
  'app/api/interview/question/route.ts': {
    schema: `const RequestSchema = z.object({
  phase: z.string().min(1),
  context: z.string().optional().nullable(),
  stress: z.any().optional().nullable(),
  lastAnswer: z.string().optional().nullable(),
  dominantPosture: z.string().optional().nullable(),
});`,
    replaceFrom: /const \{\s*phase,\s*context,\s*stress,\s*lastAnswer,\s*dominantPosture\s*\}\s*=\s*await req\.json\(\);/m,
    replaceTo: `const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { phase, context, stress, lastAnswer, dominantPosture } = parsed.data;`
  },
  'app/api/interview/transcribe/route.ts': {
    schema: null,
    replaceFrom: /const formData = await req\.formData\(\);/,
    replaceTo: `const formData = await req.formData();`
  },
  'app/api/speech/transcribe/route.ts': {
    schema: null,
    replaceFrom: /const formData = await req\.formData\(\);/,
    replaceTo: `const formData = await req.formData();`
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Skip if already applied
    if (content.includes('RequestSchema')) continue;

    if (config.schema) {
      // Import zod
      if (!content.includes('import { z }')) {
        content = content.replace(/(import.*)/, `import { z } from "zod";\n$1`);
      }
      
      // Inject schema before export function POST
      content = content.replace(/export (?:async )?function POST/, `${config.schema}\n\nexport async function POST`);
      
      // Inject safeParse
      content = content.replace(config.replaceFrom, config.replaceTo);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
