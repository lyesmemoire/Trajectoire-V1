import { callLlmStrict } from "../../src/voice-interview/core/llm-strict";
import { z } from "zod";
import fs from "fs";
import path from "path";

const ProfileSchema = z.object({
  profileId: z.string(),
  jobOffer: z.string(),
  cv: z.string(),
  behaviorType: z.string(),
  responses: z.array(z.string())
});

const profilesDef = [
  // 5 profils très solides
  ...Array(5).fill(0).map((_, i) => ({ id: `solid-${i+1}`, type: "très solide" })),
  // 5 profils CV gonflés mais faibles oralement
  ...Array(5).fill(0).map((_, i) => ({ id: `bluff-${i+1}`, type: "CV gonflé mais faible oralement" })),
  // 5 profils honnêtes mais imprécis
  ...Array(5).fill(0).map((_, i) => ({ id: `vague-${i+1}`, type: "honnête mais imprécis" })),
  // 5 profils stress fragiles
  ...Array(5).fill(0).map((_, i) => ({ id: `fragile-${i+1}`, type: "stress fragile" })),
  // 5 profils très techniques
  ...Array(5).fill(0).map((_, i) => ({ id: `tech-${i+1}`, type: "très technique" })),
  // 5 profils leadership forts mais techniques moyens
  ...Array(5).fill(0).map((_, i) => ({ id: `lead-${i+1}`, type: "leadership fort mais technique moyen" })),
];

async function main() {
  const datasetDir = path.join(__dirname, "datasets");
  if (!fs.existsSync(datasetDir)) {
    fs.mkdirSync(datasetDir, { recursive: true });
  }

  const generatedProfiles: any[] = [];
  
  console.log("Generating 30 profiles via LLM with strict human noise constraints...");

  for (const def of profilesDef) {
    console.log(`Generating [${def.id}] -> Behavior: ${def.type}`);
    
    const systemPrompt = `You are an expert dataset generator creating realistic interview simulations.
Generate exactly 10 responses for a candidate profile matching BehaviorType: "${def.type}".

CRITICAL RULE: DO NOT GENERATE PERFECT, CLEAN AI RESPONSES.
You must introduce REALISTIC HUMAN NOISE depending on the profile:
- Realistic errors and grammatical slips
- Hesitations (e.g., "uh", "well", "I mean")
- Vague rambling or losing train of thought
- Use of buzzwords to mask lack of knowledge
- Slight inconsistencies or backtracking

Behavior instructions:
- très solide: Clear, quantified, trade-off aware, but still speaks like a human.
- CV gonflé mais faible oralement: Heavy jargon, but falls apart on deep questions, deflects.
- honnête mais imprécis: Admits what they don't know, but struggles to give precise metrics or deep details.
- stress fragile: Starts strong for turns 1-3, then panics, becomes defensive or overly short as pressure mounts.
- très technique: Goes deep into architecture and code, ignores business or leadership impact.
- leadership fort mais technique moyen: Focuses on team, agility, and business impact, but gives superficial technical answers.

Output format must match the JSON schema.`;

    const userPrompt = `Generate profile ${def.id} with behavior "${def.type}".`;

    try {
      const data = await callLlmStrict(
        systemPrompt,
        userPrompt,
        ProfileSchema,
        `{ "profileId": "${def.id}", "jobOffer": "string", "cv": "string", "behaviorType": "${def.type}", "responses": ["string"] }`
      );
      generatedProfiles.push(data);
    } catch (e) {
      console.error(`Failed to generate ${def.id}`, e);
    }
  }

  const outPath = path.join(datasetDir, "profiles.json");
  fs.writeFileSync(outPath, JSON.stringify(generatedProfiles, null, 2));
  console.log(`\n✅ Generated ${generatedProfiles.length} profiles to ${outPath}`);
}

main().catch(console.error);
