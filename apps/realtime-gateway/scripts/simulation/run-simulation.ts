import fs from "fs";
import path from "path";
import { initInterviewV3, nextV3Step } from "../../src/voice-interview/core/v3/interview-engine-v3";
import { simulateDecision } from "../../src/voice-interview/core/v3/decision-simulator";

const resultsDir = path.join(__dirname, "results");
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function runProfile(profile: unknown) {
  const context = {
    job_summary: profile.jobOffer,
    key_requirements: ["Scalability", "Leadership", "Technical depth"],
    cv_strengths: [profile.cv], // Using CV summary as a strength proxy
    cv_weaknesses: ["Missing specific KPIs in CV"],
    risk_flags: [],
    focus_zones: [],
    leadership_expectations: ["Cross-functional alignment"]
  };

  const { state: initialState } = initInterviewV3({ context, targetRole: profile.jobOffer });
  let state = initialState;

  const escalationActions = [];
  let pressureIncreases = 0;
  let previousPressure = 1;

  // Run the 10 turns
  for (let i = 0; i < profile.responses.length && i < 10; i++) {
    const transcript = profile.responses[i];
    const result = await nextV3Step(state, transcript);
    state = result.updatedState;
    
    escalationActions.push(state.lastAction);
    
    if (state.pressureLevel > previousPressure) {
      pressureIncreases++;
    }
    previousPressure = state.pressureLevel;

    if (result.finished) {
      break;
    }
  }

  // Calculate final metrics similar to voice-websocket-v3.ts
  const avgTech = state.techCount > 0 ? state.avgTech / state.techCount : 0;
  const avgComm = state.commCount > 0 ? state.avgComm / state.commCount : 0;
  const avgAlign = state.alignCount > 0 ? state.avgAlign / state.alignCount : 0;
  const avgQuant = state.quantCount > 0 ? state.avgQuant / state.quantCount : 0;

  let leadershipComposite = avgAlign; // fallback
  if (state.phase4Scores) {
    leadershipComposite = (
      state.phase4Scores.strategic_thinking_score + 
      state.phase4Scores.conflict_leadership_score + 
      state.phase4Scores.organizational_impact_score
    ) / 3;
  }

  const finalExecutiveScore =
    (0.25 * avgTech) +
    (0.20 * avgComm) +
    (0.15 * avgAlign) +
    (0.15 * avgQuant) +
    (0.15 * leadershipComposite) +
    (0.10 * (10 - (state.integrityRiskIndex * 10))); // Scaled 1-10

  const decisionSimulation = simulateDecision({
    technicalDepth: avgTech,
    integrityRisk: state.integrityRiskIndex * 10,
    leadership: leadershipComposite
  });

  const maxPressureLevel = Math.max(...(state.pressureTimeline.length > 0 ? state.pressureTimeline : [1]));

  return {
    profileId: profile.profileId,
    behaviorType: profile.behaviorType,
    finalExecutiveScore,
    integrityRiskIndex: state.integrityRiskIndex,
    maxPressureLevel,
    pressureIncreases,
    decisionSimulation,
    escalationActions
  };
}

async function main() {
  const profilesPath = path.join(__dirname, "datasets", "profiles.json");
  if (!fs.existsSync(profilesPath)) {
    console.error("No profiles.json found. Run generate-dataset.ts first.");
    process.exit(1);
  }

  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));
  console.log(`Starting DIRECT ENGINE simulation for ${profiles.length} profiles...`);

  const results: unknown[] = [];

  for (const profile of profiles) {
    console.log(`Simulating profile: ${profile.profileId}`);
    try {
      const record = await runProfile(profile);
      results.push(record);
      console.log(`  -> Score: ${record.finalExecutiveScore.toFixed(1)} | Integrity: ${record.integrityRiskIndex.toFixed(2)} | Max Pressure: ${record.maxPressureLevel}`);
    } catch (error) {
      console.error(`Error simulating ${profile.profileId}`, e);
    }
  }

  const outPath = path.join(resultsDir, "simulation-results.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  // Compute stats
  const scores = results.map(r => r.finalExecutiveScore);
  const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Standard Deviation
  const variance = scores.reduce((a, b) => a + Math.pow(b - meanScore, 2), 0) / scores.length;
  const stdDeviation = Math.sqrt(variance);

  // Median
  const sortedScores = [...scores].sort((a, b) => a - b);
  const medianScore = scores.length % 2 !== 0 
    ? sortedScores[Math.floor(scores.length / 2)] 
    : (sortedScores[scores.length / 2 - 1] + sortedScores[scores.length / 2]) / 2;

  const percentBelow5_5 = (scores.filter(s => s < 5.5).length / scores.length) * 100;
  const percentAbove8 = (scores.filter(s => s > 8).length / scores.length) * 100;
  
  const meanIntegrityRisk = results.reduce((a, r) => a + r.integrityRiskIndex, 0) / results.length;
  const meanMaxPressure = results.reduce((a, r) => a + r.maxPressureLevel, 0) / results.length;
  const meanPressureIncreaseRate = results.reduce((a, r) => a + r.pressureIncreases, 0) / results.length;

  const stats = {
    meanFinalScore: Number(meanScore.toFixed(2)),
    medianScore: Number(medianScore.toFixed(2)),
    stdDeviation: Number(stdDeviation.toFixed(2)),
    percentBelow5_5: Number(percentBelow5_5.toFixed(1)),
    percentAbove8: Number(percentAbove8.toFixed(1)),
    meanIntegrityRisk: Number(meanIntegrityRisk.toFixed(2)),
    meanMaxPressure: Number(meanMaxPressure.toFixed(2)),
    meanPressureIncreaseRate: Number(meanPressureIncreaseRate.toFixed(2))
  };

  console.log("\n=============================");
  console.log("🔥 SIMULATION SUMMARY 🔥");
  console.log(JSON.stringify(stats, null, 2));
  console.log("=============================");

  console.log("\n🚨 STRUCTURAL ANALYSIS ALERTS 🚨");
  if (stats.meanFinalScore > 7.2) console.log("⚠️ ALERTE : Moteur trop gentil (meanFinalScore > 7.2)");
  if (stats.percentBelow5_5 < 10) console.log("⚠️ ALERTE : Pas assez exigeant (percentBelow5_5 < 10%)");
  if (stats.percentAbove8 > 20) console.log("⚠️ ALERTE : Élitisme faux, trop de notes parfaites (percentAbove8 > 20%)");
  if (stats.meanIntegrityRisk > 0.7) console.log("⚠️ ALERTE : Moteur paranoïaque (meanIntegrityRisk > 0.7)");
  if (stats.meanIntegrityRisk < 0.3) console.log("⚠️ ALERTE : Moteur naïf (meanIntegrityRisk < 0.3)");
  if (stats.meanMaxPressure > 4.2) console.log("⚠️ ALERTE : Moteur trop agressif en moyenne (meanMaxPressure > 4.2)");
  console.log("Analyse terminée.");
}

main().catch(console.error);
