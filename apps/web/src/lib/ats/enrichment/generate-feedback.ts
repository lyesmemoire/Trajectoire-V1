import { mistralSmallModel } from "@/lib/mistral";
import { generateText } from "ai";

const FEEDBACK_PROMPT = `Tu es un expert en recrutement. 
Analyse le matching entre un candidat et une offre d'emploi.
Explique pourquoi le score est élevé ou bas.
Sois précis, mentionne les technos clés manquantes.
Format: 2-3 phrases percutantes.`;

export async function generateATSFeedback(
  matched: string[],
  missing: string[],
  score: number,
): Promise<string> {
  try {
    const { text } = await generateText({
      model: mistralSmallModel,
      system: FEEDBACK_PROMPT,
      prompt: `Score: ${score}/100\nCompétences trouvées: ${matched.join(", ")}\nCompétences manquantes: ${missing.join(", ")}`,
    });
    return text.trim();
  } catch {
    return "Analyse de matching complétée.";
  }
}
