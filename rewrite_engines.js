const fs = require('fs');

const filePath = 'app/(app)/dashboard/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('  // Generate daily coach using existing engine with brain context');
const endIndex = content.indexOf('  // Helper function to safely calculate score change');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find boundaries');
    process.exit(1);
}

const beforeBlock = content.substring(0, startIndex);
const afterBlock = content.substring(endIndex);

const newBlock = \
  // Stage 1: Core Intelligence & Analysis (Parallel)
  let digitalTwin = null, autonomousIntelligence = null, outcomeIntelligence = null, 
      personalizationIntelligence = null, missionIntelligence = null, evidenceIntelligence = null, 
      constraintIntelligence = null, resourceIntelligence = null, scenarioIntelligence = null, 
      decisionIntelligence = null, adaptiveStrategy = null, accountability = null;

  try {
    const currentEvent = { type: "dashboard_load", description: "User loaded dashboard", timestamp: new Date() };
    
    [
      digitalTwin, autonomousIntelligence, outcomeIntelligence, personalizationIntelligence, 
      missionIntelligence, evidenceIntelligence, constraintIntelligence, resourceIntelligence, 
      scenarioIntelligence, decisionIntelligence, adaptiveStrategy, accountability
    ] = await Promise.all([
      CareerCopilotDigitalTwinEngine.generateDigitalTwin({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotAutonomousIntelligenceEngine.orchestrate({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotOutcomeIntelligenceEngine.analyzeOutcomeIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotPersonalizationIntelligenceEngine.analyzePersonalizationIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotMissionIntelligenceEngine.analyzeMissionIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotEvidenceIntelligenceEngine.analyzeEvidenceIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotConstraintIntelligenceEngine.analyzeConstraintIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotResourceIntelligenceEngine.analyzeResourceIntelligence({ candidateGraph, currentEvent }).catch(e => { console.error(e); return null; }),
      CareerCopilotScenarioIntelligenceEngine.generateScenarios({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotDecisionIntelligenceEngine.determinePriority({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotAdaptiveStrategyEngine.detectAndAdaptStrategy({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotAccountabilityEngine.trackCommitments({ candidateGraph }).catch(e => { console.error(e); return null; })
    ]);
  } catch (error) {
    console.error("Failed Stage 1 Core Intelligence:", error);
  }

  // Get current state for intelligence outputs
  const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy();
  const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
  const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
  const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory();
  const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
  const commitmentHistory = CareerCopilotAccountabilityEngine.getCommitmentHistory();

  // Stage 2: Planning & Forecast (Parallel)
  let progressionPlan = null, careerForecast = null, proactiveInitiatives = [];
  try {
    const [planRes, forecastRes, proactiveRes] = await Promise.all([
      CareerCopilotProgressionPlanEngine.generateProgressionPlan({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotForecastEngine.generateForecast({ candidateGraph }).catch(e => { console.error(e); return null; }),
      CareerCopilotProactiveEngine.generateInitiatives({ candidateGraph }).catch(e => { console.error(e); return { initiatives: [] }; })
    ]);
    progressionPlan = planRes;
    careerForecast = forecastRes;
    proactiveInitiatives = proactiveRes?.initiatives || [];
  } catch (error) {
    console.error("Failed Stage 2 Planning:", error);
  }

  // Stage 3: Summary & Coach (Parallel)
  let dailyCoachData = null, dailySummary = null;
  try {
    const lastSummaryObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-daily-summary")
      .slice(-1);
    const lastVisit = lastSummaryObservations.length > 0 && lastSummaryObservations[0]
      ? lastSummaryObservations[0].timestamp
      : undefined;

    [dailyCoachData, dailySummary] = await Promise.all([
      DailyCoachAIEngine.generateDailyCoach({
        candidateProfile: \\, \\,
        strengths: candidateGraph.strengths.map(s => s.category),
        weaknesses: candidateGraph.weaknesses.map(w => w.category),
        careerLevel: candidateGraph.career.careerLevel,
        experience: \\ ans\,
        currentGoals: brainGoals.filter(g => g.status === "in_progress").map(g => g.description),
        recentProgress: candidateGraph.progress.timeline.length > 0 
          ? \\ entretiens complétés\
          : "Début du parcours",
        overallScore: candidateGraph.overallScore,
        previousScore: candidateGraph.progress.previousScore,
        scoreChange: candidateGraph.progress.change,
        recommendedSkills: candidateGraph.recommendedSkills.map(s => s.title),
        recommendedInterviews: candidateGraph.recommendedInterviews.map(i => i.title),
        recentInsights: brainInsights.slice(0, 5).map(i => i.description),
        weeklySummary: \Score actuel: \/100. \ améliorations détectées.\,
      }).catch(e => { console.error(e); return null; }),
      CareerCopilotDailySummaryEngine.generateDailySummary({ candidateGraph, lastVisit }).catch(e => { console.error(e); return null; })
    ]);
  } catch (error) {
    console.error("Failed Stage 3 Summary:", error);
  }

\;

const finalContent = beforeBlock + newBlock + afterBlock;
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully updated page.tsx');
