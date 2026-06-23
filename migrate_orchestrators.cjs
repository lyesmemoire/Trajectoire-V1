const fs = require('fs');

const modifications = {
  'lib/ats/orchestrator.ts': {
    imports: `import { generateObject } from "ai";\nimport { JobOfferSchema, CVSkillsSchema } from "./schemas/orchestrator-schemas";\n`,
    replacements: [
      {
        from: /async function parseJobOffer\(text: string\) \{\s*const \{\s*text: response\s*\} = await generateText\(\{\s*model:\s*mistralSmallModel,\s*system:\s*'Extrait les compétences techniques requises\. JSON format: \{ "required": \[\] \}',\s*prompt:\s*text,\s*\}\);\s*return JSON\.parse\(\s*response\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);\s*\}/m,
        to: `async function parseJobOffer(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: JobOfferSchema,
    temperature: 0.1,
    system:
      'Extrait les compétences techniques requises. JSON format: { "required": [] }',
    prompt: text,
  });
  return object;
}`
      },
      {
        from: /async function parseCVSkills\(text: string\) \{\s*const \{\s*text: response\s*\} = await generateText\(\{\s*model:\s*mistralSmallModel,\s*system:\s*"Extrait toutes les compétences techniques du CV\. JSON format: \[\]",\s*prompt:\s*text,\s*\}\);\s*return JSON\.parse\(\s*response\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);\s*\}/m,
        to: `async function parseCVSkills(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: CVSkillsSchema,
    temperature: 0.1,
    system: "Extrait toutes les compétences techniques du CV. JSON format: []",
    prompt: text,
  });
  return object;
}`
      }
    ]
  },
  'lib/ats/premium-orchestrator.ts': {
    imports: `import { generateObject } from "ai";\nimport { JobIntelligenceSchema, AdvancedCVSchema, RecruiterFeedbackSchema } from "./schemas/orchestrator-schemas";\n`,
    replacements: [
      {
        from: /async function analyzeJobOfferIntelligence\(text: string\) \{\s*const \{\s*text: response\s*\} = await generateText\(\{\s*model:\s*mistralSmallModel,\s*system:\s*'Analyze job offer\. JSON format: \{ "title": "", "hard_skills": \[\], "seniority": "", "min_years": 0 \}',\s*prompt:\s*text,\s*\}\);\s*return JSON\.parse\(\s*response\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);\s*\}/m,
        to: `async function analyzeJobOfferIntelligence(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: JobIntelligenceSchema,
    temperature: 0.1,
    system:
      'Analyze job offer. JSON format: { "title": "", "hard_skills": [], "seniority": "", "min_years": 0 }',
    prompt: text,
  });
  return object;
}`
      },
      {
        from: /async function extractAdvancedCVProfile\(text: string\) \{\s*const \{\s*text: response\s*\} = await generateText\(\{\s*model:\s*mistralSmallModel,\s*system:\s*'Analyze CV\. JSON format: \{ "hard_skills": \[\], "seniority": 0, "leadership_score": 0, "impact_metrics_score": 0, "years_experience": 0 \}',\s*prompt:\s*text,\s*\}\);\s*return JSON\.parse\(\s*response\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);\s*\}/m,
        to: `async function extractAdvancedCVProfile(text: string) {
  const { object } = await generateObject({
    model: mistralSmallModel,
    schema: AdvancedCVSchema,
    temperature: 0.1,
    system:
      'Analyze CV. JSON format: { "hard_skills": [], "seniority": 0, "leadership_score": 0, "impact_metrics_score": 0, "years_experience": 0 }',
    prompt: text,
  });
  return object;
}`
      },
      {
        from: /async function simulateRecruiterFeedback\(cv: any, job: any, score: number\) \{\s*const \{\s*text: response\s*\} = await generateText\(\{\s*model:\s*mistralModel,\s*system:\s*'Act as a picky recruiter\. JSON: \{ "concerns": \[\], "strengths": \[\], "rewrites": \[\{ "original": "", "improved": "" \}\] \}',\s*prompt:\s*`Score: \$\{score\}`,\s*\}\);\s*return JSON\.parse\(\s*response\s*\.trim\(\)\s*\.replace\(\/\^```json\/,\s*""\)\s*\.replace\(\/```\$\/,\s*""\),\s*\);\s*\}/m,
        to: `async function simulateRecruiterFeedback(cv: any, job: any, score: number) {
  const { object } = await generateObject({
    model: mistralModel,
    schema: RecruiterFeedbackSchema,
    temperature: 0.1,
    system:
      'Act as a picky recruiter. JSON: { "concerns": [], "strengths": [], "rewrites": [{ "original": "", "improved": "" }] }',
    prompt: \`Score: \${score}\`,
  });
  return object;
}`
      }
    ]
  }
};

for (const [file, config] of Object.entries(modifications)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add imports
    content = content.replace(/import \{.*?\} from "ai";/, config.imports);

    for (const repl of config.replacements) {
      if (repl.from.test(content)) {
        content = content.replace(repl.from, repl.to);
        console.log(`Matched and replaced one function in ${file}`);
      } else {
        console.log(`Failed to match regex in ${file}`);
      }
    }
    
    fs.writeFileSync(file, content);
    console.log(`Saved ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
