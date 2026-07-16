// @ts-nocheck
import { UserIntent, UserCommand } from "../intent-detector.js";
import { pilotCommandsCount } from "../metrics.js";

export type PilotAction = UserCommand;

export interface PilotCommandResult {
  shouldSpeak: boolean;
  speakText?: string;
  finished?: boolean;
}

export function handlePilotCommand(
  action: PilotAction,
  lastQuestion: string
): PilotCommandResult {
  if (action in pilotCommandsCount) {
    pilotCommandsCount[action as keyof typeof pilotCommandsCount]++;
  }

  switch (action) {
    case "repeat":
      return {
        shouldSpeak: true,
        speakText: lastQuestion
          ? `Bien sûr, je répète : ${lastQuestion}`
          : "Je n'ai pas de question précédente à répéter.",
      };

    case "slower":
      return {
        shouldSpeak: true,
        speakText: `Bien sûr, je vais ralentir. ${lastQuestion}`,
      };

    case "next":
      return {
        shouldSpeak: true,
        speakText: "D'accord, passons à la question suivante.",
      };

    case "clarify":
      return {
        shouldSpeak: true,
        speakText: lastQuestion
          ? `Voici la question avec plus de contexte : ${lastQuestion}`
          : "Pouvez-vous préciser votre demande ?",
      };

    case "stop":
      return {
        shouldSpeak: true,
        speakText: "D'accord, nous allons arrêter l'entretien ici.",
        finished: true,
      };
      
    default:
      return {
        shouldSpeak: true,
        speakText: "Je n'ai pas compris votre demande.",
      };
  }
}

export function extractPilotAction(intent: UserIntent): PilotAction | null {
  if (intent.kind !== "command") return null;
  return intent.action as PilotAction;
}
