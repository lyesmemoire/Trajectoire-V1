const fs = require('fs');

const modifications = {
  'app/api/cv/analyze/route.ts': {
    from: /const formData = await req\.formData\(\);\s*const file = formData\.get\("file"\) as File \| null;\s*if \(!file\)\s*return NextResponse\.json\(\{ error: "Fichier manquant" \}, \{ status: 400 \}\);/,
    to: `const formData = await req.formData();
    const rawFile = formData.get("file");

    const RequestSchema = z.object({
      file: z.custom<Blob>(
        (val) => val instanceof Blob || (typeof val === "object" && val !== null),
        { message: "Le fichier CV est requis." }
      ),
    });

    const parsed = RequestSchema.safeParse({ file: rawFile });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const file = parsed.data.file as File;`
  },
  'app/api/cv/export/route.ts': {
    from: /const body = await req\.json\(\);\s*const \{\s*cvData,\s*options\s*\} = body as \{\s*cvData: CVData;\s*options: ExportOptions;\s*\};\s*if \(!cvData\?\.personalInfo\?\.name\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Données CV invalides"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/,
    to: `const RequestSchema = z.object({
      cvData: z.object({
        personalInfo: z.object({
          name: z.string().min(1, "Le nom est requis"),
        }).passthrough(),
      }).passthrough(),
      options: z.object({
        template: z.string().default("modern"),
      }).passthrough().optional(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { cvData, options } = parsed.data as any as { cvData: CVData; options: ExportOptions };`
  },
  'app/api/cv/export-docx/route.ts': {
    from: /const body = await req\.json\(\);\s*const parsed = ParsedCVSchema\.safeParse\(body\.cv\);\s*if \(!parsed\.success\) \{\s*return NextResponse\.json\(\s*\{\s*error: "Invalid CV data",\s*details: parsed\.error\s*\},\s*\{ status: 400 \},\s*\);\s*\}\s*const cv: ParsedCV = parsed\.data;/,
    to: `const RequestSchema = z.object({
      cv: ParsedCVSchema,
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données CV invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { cv } = parsed.data;`
  },
  'app/api/optimize/route.ts': {
    from: /const body = await req\.json\(\);\s*const \{\s*cvId,\s*jobDescription\s*\} = body;\s*if \(!cvId\)\s*return NextResponse\.json\(\{ error: "cvId requis" \}, \{ status: 400 \}\);/,
    to: `const RequestSchema = z.object({
      cvId: z.string().uuid("cvId doit être un UUID valide"),
      jobDescription: z.string().min(10).max(8000).optional().nullable(),
    });

    const parsed = RequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { cvId, jobDescription } = parsed.data;`
  },
  'app/api/ats/analyze/route.ts': {
    from: /const formData = await req\.formData\(\);\s*const file = formData\.get\("file"\) as File \| null;\s*const jobDescription = formData\.get\("jobDescription"\) as string;\s*if \(!file \|\| !jobDescription\) \{\s*return NextResponse\.json\(\s*\{\s*error: "CV et Description requis"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/,
    to: `const formData = await req.formData();
    const rawFile = formData.get("file");
    const rawJobDescription = formData.get("jobDescription");

    const RequestSchema = z.object({
      file: z.custom<Blob>(
        (val) => val instanceof Blob || (typeof val === "object" && val !== null),
        { message: "Le fichier CV est requis." }
      ),
      jobDescription: z.string().min(10, "Description de l'offre requise.").max(8000),
    });

    const parsed = RequestSchema.safeParse({ file: rawFile, jobDescription: rawJobDescription });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const file = parsed.data.file as File;
    const jobDescription = parsed.data.jobDescription;`
  },
  'app/api/ats/analyze-premium/route.ts': {
    from: /const formData = await req\.formData\(\);\s*const file = formData\.get\("file"\) as File \| null;\s*const jobDescription = formData\.get\("jobDescription"\) as string;\s*if \(!file \|\| !jobDescription\) \{\s*return NextResponse\.json\(\s*\{\s*error: "CV et Description requis"\s*\},\s*\{ status: 400 \},\s*\);\s*\}/,
    to: `const formData = await req.formData();
    const rawFile = formData.get("file");
    const rawJobDescription = formData.get("jobDescription");

    const RequestSchema = z.object({
      file: z.custom<Blob>(
        (val) => val instanceof Blob || (typeof val === "object" && val !== null),
        { message: "Le fichier CV est requis." }
      ),
      jobDescription: z.string().min(10, "Description de l'offre requise.").max(8000),
    });

    const parsed = RequestSchema.safeParse({ file: rawFile, jobDescription: rawJobDescription });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const file = parsed.data.file as File;
    const jobDescription = parsed.data.jobDescription;`
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
