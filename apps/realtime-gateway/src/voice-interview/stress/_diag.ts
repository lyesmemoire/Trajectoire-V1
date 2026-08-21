// @ts-nocheck
import { runOneInterview } from "./run-stress.js";
for (const arch of ["strong","weak","bluffer"] as const) {
  const r = runOneInterview(1, arch);
  console.log(`\n### ${arch} (${r.trajectory.length} tours)`);
  r.trajectory.slice(0,6).forEach((p: unknown, i: number)=>{
    const m=p.mind;
    console.log(`t${i}: emo=${m.emotion} susp=${m.suspicion.toFixed(2)} trust=${m.trust.toFixed(2)} press=${m.pressure.toFixed(2)} eng=${m.engagement.toFixed(2)} conf=${m.confidenceInCandidate.toFixed(2)}`);
  });
}
