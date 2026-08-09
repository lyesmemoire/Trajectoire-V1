/**
 * Script d'extraction offline de questions depuis les docs RH
 * Transforme les documents Markdown en JSON structuré selon QuestionTemplate
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function extractFromDoc(docPath: string): Promise<any[]> {
  const content = await fs.readFile(docPath, "utf8");
  const systemPrompt = await fs.readFile(
    path.join(__dirname, "../docs/PROMPT-QUESTION-EXTRACTION.md"),
    "utf8"
  );

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content }
    ]
  });

  const json = JSON.parse(res.choices[0].message.content!);
  
  // Le prompt retourne directement un tableau ou un objet avec une propriété questions
  if (Array.isArray(json)) {
    return json;
  } else if (json.questions && Array.isArray(json.questions)) {
    return json.questions;
  } else {
    console.warn(`Format inattendu pour ${docPath}:`, json);
    return [];
  }
}

async function main() {
  const docs = [
    "docs/rh/DOC-013-03-Bibliotheque-Questions-Expert.md",
    "docs/rh/DOC-014-03-Questions-Observation-Comportementale.md",
    "docs/rh/DOC-016-05-Scenarios-Candidat.md",
    "docs/rh/DOC-020-02-Guide-Prise-References-Expert.md",
    "docs/rh/DOC-032-03-Bibliotheque-200-Rebonds.md",
    "docs/rh/DOC-035-03-Bibliotheque-Formulations-Naturelles.md",
    "docs/rh/DOC-038-02-Bibliotheque-Protocoles-Desescalade.md",
    "docs/rh/DOC-039-02-Bibliotheque-Questions-Inattendues.md"
  ];

  // Charger les questions existantes
  const existingQuestionsPath = path.join(
    __dirname,
    "../apps/realtime-gateway/src/voice-interview/core/question-db/questions.fr.json"
  );
  
  let all: any[] = [];
  
  try {
    const existingContent = await fs.readFile(existingQuestionsPath, "utf8");
    all = JSON.parse(existingContent);
    console.log(`Chargé ${all.length} questions existantes`);
  } catch (error) {
    console.log("Pas de questions existantes, création d'une nouvelle base");
  }

  // Extraire depuis chaque doc
  for (const doc of docs) {
    const fullPath = path.join(__dirname, "../", doc);
    console.log(`Traitement de ${doc}...`);
    
    try {
      const extracted = await extractFromDoc(fullPath);
      console.log(`  →提取 ${extracted.length} questions`);
      all = all.concat(extracted);
    } catch (error) {
      console.error(`  → Erreur sur ${doc}:`, error);
    }
  }

  // Dédupliquer par id
  const byId = new Map(all.map(q => [q.id, q]));
  const deduped = Array.from(byId.values());
  
  console.log(`Total avant déduplication: ${all.length}`);
  console.log(`Total après déduplication: ${deduped.length}`);

  // Sauvegarder
  await fs.writeFile(
    existingQuestionsPath,
    JSON.stringify(deduped, null, 2),
    "utf8"
  );
  
  console.log(`Questions sauvegardées dans ${existingQuestionsPath}`);
}

main().catch(console.error);
