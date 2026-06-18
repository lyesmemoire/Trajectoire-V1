/**
 * stress/report.ts — Génère le rapport de distribution sur N interviews (P4.3).
 * Usage : pnpm exec tsx .../stress/report.ts [n]
 */
import { runStress } from "./run-stress.js";
import { STABILITY_THRESHOLDS } from "./metrics.js";

const n = Number(process.argv[2] ?? 1000);
const r = runStress(n, 1);

const pass = (ok: boolean) => (ok ? "PASS" : "FAIL");
const lines: string[] = [];
lines.push(`# Stress-test P4.3 — ${n} interviews seedées\n`);
lines.push(`Total tours cumulés: ${r.runs.reduce((a: number, x: any) => a + x.trajectory.length, 0)}\n`);
lines.push(`## Bornage`);
lines.push(`- Violations bornes (Mind+Sim): ${r.totalBoundViolations} — ${pass(r.totalBoundViolations === 0)}\n`);
lines.push(`## Drift (pente max |β| sur 2e moitié, seuil ${STABILITY_THRESHOLDS.maxAbsDrift})`);
lines.push(`- suspicion: ${r.maxAbsDriftSuspicion.toFixed(4)} — ${pass(r.maxAbsDriftSuspicion <= STABILITY_THRESHOLDS.maxAbsDrift)}`);
lines.push(`- pression:  ${r.maxAbsDriftPressure.toFixed(4)} — ${pass(r.maxAbsDriftPressure <= STABILITY_THRESHOLDS.maxAbsDrift)}\n`);
lines.push(`## Oscillation UX (énergie max |Δ|, seuil ${STABILITY_THRESHOLDS.maxOscToneShift})`);
lines.push(`- toneShift:     ${r.maxOscToneShift.toFixed(4)} — ${pass(r.maxOscToneShift <= STABILITY_THRESHOLDS.maxOscToneShift)}`);
lines.push(`- interruption:  ${r.maxOscInterruption.toFixed(4)} — ${pass(r.maxOscInterruption <= STABILITY_THRESHOLDS.maxOscInterruption)}`);
lines.push(`- silence:       ${r.maxOscSilence.toFixed(4)} — ${pass(r.maxOscSilence <= STABILITY_THRESHOLDS.maxOscSilence)}\n`);
lines.push(`## Enveloppe (variance fin/début max fini, seuil ${STABILITY_THRESHOLDS.maxEnvelopeRatio})`);
lines.push(`- ratio: ${r.maxEnvelopeRatioFinite.toFixed(4)} — ${pass(r.maxEnvelopeRatioFinite <= STABILITY_THRESHOLDS.maxEnvelopeRatio)}\n`);
lines.push(`## Path dependency (distance L1 max seeds adjacents, seuil ${STABILITY_THRESHOLDS.maxPathDistance})`);
lines.push(`- distance: ${r.maxPathDistance.toFixed(4)} — ${pass(r.maxPathDistance <= STABILITY_THRESHOLDS.maxPathDistance)}\n`);
lines.push(`## Distribution des émotions finales`);
for (const [emo, count] of (Object.entries(r.emotionDistribution) as [string, number][]).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${emo}: ${count} (${(((count as number) / n) * 100).toFixed(1)}%)`);
}
console.log(lines.join("\n"));
