// @ts-nocheck
import type { PressureMunition } from "../../../../../../lib/ats/contracts/munitions.js";
import type { InterviewState, InterviewPhase } from "../state.js";
import { LoggerProvider } from "../../../../../../lib/core/observability/logger/LoggerProvider.js";

export interface MunitionSelectionContext {
  state: InterviewState;
  currentPhase: InterviewPhase;
  currentTurnNumber: number;
}

export function selectNextMunition(
  ctx: MunitionSelectionContext
): PressureMunition | null {
  const { state, currentPhase, currentTurnNumber } = ctx;
  
  if (!isPressurePhase(currentPhase)) return null;
  
  const candidates = state.munitions.filter(m => 
    m.pressureReady && m.confidence >= 0.7
  );
  
  if (candidates.length === 0) return null;
  
  const scored = candidates.map(munition => ({
    munition,
    score: scoreMunition(munition, state, currentTurnNumber),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  const best = scored[0];

  const log = LoggerProvider.getLoggerWithContext({ component: 'munition-selector' });
  if (best && best.score > 0) {
    log.debug({ 
      event: 'munition_selected', 
      munitionId: best.munition.id,
      severity: best.munition.severity,
      remaining: candidates.length
    });
    return best.munition;
  }
  
  return null;
}

function scoreMunition(
  munition: PressureMunition, 
  state: InterviewState, 
  currentTurn: number
): number {
  let score = munition.severity * 10;
  
  const usage = state.munitionsUsage[munition.id];
  if (!usage) {
    score += 50; 
  } else {
    if (usage.lastResponse === 'deflected') {
      score -= 20 * usage.attempts;
    } else if (usage.lastResponse === 'engaged') {
      score = -1000;
    } else if (usage.lastResponse === 'silence') {
      score -= 10;
    }
  }
  
  return score;
}

function isPressurePhase(phase: InterviewPhase): boolean {
  return phase === "pressure";
}

export function formatMunitionQuestion(munition: PressureMunition): string {
  if (munition.suggestedQuestion) {
    return munition.suggestedQuestion;
  }
  
  return `${munition.hook} ${munition.evidence.snippet ? `(sur "${munition.evidence.snippet}")` : ''} ?`;
}
