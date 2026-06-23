const fs = require('fs');

const modifications = {
  'app/api/interview/analyze/route.ts': {
    from: /const \{\s*text\s*\} = await generateText\(\{\s*model:\s*mistralModel,\s*temperature:\s*0\.1,\s*prompt:\s*`\$\{ANALYSIS_PROMPT\}\\n\\nSession:\\n\$\{compact\}`,\s*\}\);\s*const parsed = JSON\.parse\(\s*text\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);/m,
    to: `// NOTE: scores calculés par le LLM — acceptable pour ce module démo sans auth.
    // À migrer vers calcul TypeScript si ce module devient une feature core.
    const AnalysisSchema = z.object({
      scores: z.object({
        clarity:    z.number().min(0).max(100),
        relevance:  z.number().min(0).max(100),
        confidence: z.number().min(0).max(100),
        structure:  z.number().min(0).max(100),
        depth:      z.number().min(0).max(100),
        finalScore: z.number().min(0).max(100),
      }),
      strengths:    z.array(z.string().max(500)).max(10),
      improvements: z.array(z.string().max(500)).max(10),
      detailedFeedback: z.array(z.object({
        question: z.string().max(1000),
        score:    z.number().min(0).max(100),
        comment:  z.string().max(2000),
      })).max(20),
      level: z.preprocess(
        (val) => {
          if (typeof val !== "string") return val;
          const map: Record<string, string> = {
            "débutant":      "Débutant",
            "debutant":      "Débutant",
            "intermédiaire": "Intermédiaire",
            "intermediaire": "Intermédiaire",
            "confirmé":      "Confirmé",
            "confirme":      "Confirmé",
            "expert":        "Expert",
          };
          return map[val.toLowerCase().trim()] ?? val;
        },
        z.enum(["Débutant", "Intermédiaire", "Confirmé", "Expert"])
      ),
      tips: z.array(z.string().max(500)).max(10),
    });

    const { object: parsedData } = await generateObject({
      model: mistralModel,
      schema: AnalysisSchema,
      temperature: 0.1,
      prompt: \`\${ANALYSIS_PROMPT}\\n\\nSession:\\n\${compact}\`,
    });`,
    replaceParsed: true,
  },
  'app/api/cv/analyze/route.ts': {
    from: /const \{\s*text\s*\} = await generateText\(\{\s*model:\s*mistralModel,\s*temperature:\s*0\.2,\s*prompt:\s*OPTIMIZE_PROMPT \+ "\\n\\nCV:\\n" \+ originalText,\s*\}\);\s*const optimizationData = JSON\.parse\(\s*text\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);/m,
    to: `// NOTE: atsScore inventé par le LLM pour cet endpoint démo.
    // Ne pas utiliser comme score ATS de référence produit.
    const CvAnalysisSchema = z.object({
      optimizedText: z.string().max(20000),
      improvements: z.array(z.object({
        type:        z.enum(["strength", "addition", "rewrite", "warning"]),
        section:     z.string().max(100),
        description: z.string().max(2000),
      })).max(15),
      atsScore: z.object({
        before: z.number().min(0).max(100),
        after:  z.number().min(0).max(100),
      }).refine(
        (d) => d.after >= d.before,
        { message: "Score après optimisation doit être >= score avant." }
      ),
      keywords: z.object({
        added:    z.array(z.string().max(100)).max(30),
        existing: z.array(z.string().max(100)).max(30),
      }),
    });

    const { object: optimizationData } = await generateObject({
      model: mistralModel,
      schema: CvAnalysisSchema,
      temperature: 0.2,
      prompt: OPTIMIZE_PROMPT + "\\n\\nCV:\\n" + originalText,
    });`,
  },
  'app/api/optimize/route.ts': {
    from: /const \{\s*text\s*\} = await generateText\(\{\s*model:\s*mistralModel,\s*temperature:\s*0\.2,\s*system:\s*"Expert CV\. Réponds UNIQUEMENT en JSON valide\.",\s*prompt:\s*`Analyse et optimise ce CV pour cette offre\.\\n\\nCV:\\n\$\{cvTextForAI\}\\n\\nOffre:\\n\$\{safeJobDesc\}\\n\\nRetourne ce format JSON :\\n\{ "improvedSummary": "string", "improvedBullets": \[\{ "original": "string", "improved": "string" \}\], "keywordsAdded": \["string"\], "generalAdvice": "string" \}`,\s*\}\);\s*parsed = JSON\.parse\(\s*text\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);/m,
    to: `const OptimizeSchema = z.object({
          improvedSummary: z.string().max(3000),
          improvedBullets: z.array(z.object({
            original: z.string().max(500),
            improved: z.string().max(800),
          })).max(15),
          keywordsAdded: z.array(z.string().max(100)).max(30),
          generalAdvice: z.string().max(3000),
        });

        const { object } = await generateObject({
          model: mistralModel,
          schema: OptimizeSchema,
          temperature: 0.2,
          system: "Expert CV. Réponds UNIQUEMENT en JSON valide.",
          prompt: \`Analyse et optimise ce CV pour cette offre.\\n\\nCV:\\n\${cvTextForAI}\\n\\nOffre:\\n\${safeJobDesc}\\n\\nRetourne ce format JSON :\\n{ "improvedSummary": "string", "improvedBullets": [{ "original": "string", "improved": "string" }], "keywordsAdded": ["string"], "generalAdvice": "string" }\`,
        });

        parsed = object;`,
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Change generateText to generateObject
    if (!content.includes('generateObject')) {
      content = content.replace(/import \{.*?\} from "ai";/, (match) => {
          if (match.includes("generateText")) {
              return match.replace("generateText", "generateObject");
          }
          return match;
      });
    }

    if (config.from.test(content)) {
      content = content.replace(config.from, config.to);
      if (config.replaceParsed) {
          // Replace subsequent usages of 'parsed' from the JSON.parse
          // since 'parsedData' was used instead.
          // In interview/analyze/route.ts, these are in the supabase update and json response.
          content = content.replace(/analysis: parsed,/g, 'analysis: parsedData,');
          content = content.replace(/score: parsed\.scores\.finalScore,/g, 'score: parsedData.scores.finalScore,');
          content = content.replace(/return NextResponse\.json\(parsed\);/g, 'return NextResponse.json(parsedData);');
      }
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    } else {
      console.log(`Failed to match regex in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}
