import { initInterviewPipeline, runInterviewPipeline } from "../core/simulation/pipeline";
import { buildCandidateProfile } from "../core/v2/candidate-profile";
import { syntheticAnswer } from "./synthetic-candidate";

for (const arch of ["strong","weak","bluffer"] as const) {
  const profile = buildCandidateProfile({ strengths:["react","node"], gaps:["aws"], matchScore:60, targetRole:"SE" });
  let { state } = initInterviewPipeline({ profile, persona:"neutral" });
  console.log(`\n### ${arch}`);
  for (let t=0;t<4;t++){
    const tr = syntheticAnswer(arch,1,t);
    const r = runInterviewPipeline(state, tr);
    console.log(`t${t}: score=${r.v2.evaluationScore} spec=${r.v2.signals.specificity.toFixed(2)} bluff=${r.v2.bluff.bluffProbability.toFixed(2)} contra=${!!r.v2.contradiction} | "${tr.slice(0,40)}"`);
    state = r.state;
  }
}
