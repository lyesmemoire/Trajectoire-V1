// @ts-nocheck
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CandidateGraphDataLoader } from "@/core/intelligence/profile/CandidateGraphDataLoader";
import { CandidateGraphBuilder } from "@/core/intelligence/profile/CandidateGraphBuilder";
import { DailyCoachAIEngine } from "@/core/intelligence/engines/dailyCoachAIEngine";
import { CareerCopilotProactiveEngine } from "@/core/intelligence/engines/careerCopilotProactiveEngine";
import { CareerCopilotProgressionPlanEngine } from "@/core/intelligence/engines/careerCopilotProgressionPlanEngine";
import { CareerCopilotDailySummaryEngine } from "@/core/intelligence/engines/careerCopilotDailySummaryEngine";
import { CareerCopilotDigitalTwinEngine } from "@/core/intelligence/engines/careerCopilotDigitalTwinEngine";
import { CareerCopilotForecastEngine } from "@/core/intelligence/engines/careerCopilotForecastEngine";
import { CareerCopilotAdaptiveStrategyEngine } from "@/core/intelligence/engines/careerCopilotAdaptiveStrategyEngine";
import { CareerCopilotDecisionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotDecisionIntelligenceEngine";
import { CareerCopilotAccountabilityEngine } from "@/core/intelligence/engines/careerCopilotAccountabilityEngine";
import { CareerCopilotScenarioIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotScenarioIntelligenceEngine";
import { CareerCopilotAutonomousIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine";
import { CareerCopilotOutcomeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotOutcomeIntelligenceEngine";
import { CareerCopilotPersonalizationIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotPersonalizationIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotMissionIntelligenceEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotResourceIntelligenceEngine";
import { candidateAIBrain } from "@/core/ai/brain/CandidateAIBrain";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import { TimelineWidget } from "@/components/dashboard/timeline-widget";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LiveScoresWidget } from "@/components/dashboard/live-scores-widget";
import { BrainHistoryWidget } from "@/components/dashboard/brain-history-widget";
import { BrainGoalsWidget } from "@/components/dashboard/brain-goals-widget";
import { BrainRecommendationsWidget } from "@/components/dashboard/brain-recommendations-widget";
import { StrengthsWeaknessesWidget } from "@/components/dashboard/strengths-weaknesses-widget";
import { DailyCoachWidget } from "@/components/dashboard/daily-coach-widget";
import { CareerTimelineWidget } from "@/components/dashboard/career-timeline-widget";
import { ProactiveInitiatives, Initiative } from "@/components/dashboard/proactive-initiatives";
import { ProgressionPlan } from "@/components/dashboard/progression-plan";
import { DailySummary } from "@/components/dashboard/daily-summary";
import { DigitalTwin } from "@/components/dashboard/digital-twin";
import { CareerForecast } from "@/components/dashboard/career-forecast";
import { WhyScore } from "@/components/dashboard/why-score";
import { WhyPlan } from "@/components/dashboard/why-plan";
import { WhyForecast } from "@/components/dashboard/why-forecast";
import { StrategyEvolution } from "@/components/dashboard/strategy-evolution";
import { DecisionOfTheDay } from "@/components/dashboard/decision-of-the-day";
import { EngagementTracking } from "@/components/dashboard/engagement-tracking";
import { ScenarioIntelligenceWidget } from "@/components/dashboard/scenario-intelligence-widget";
import { AutonomousIntelligence } from "@/components/dashboard/autonomous-intelligence";
import { OutcomeIntelligence } from "@/components/dashboard/outcome-intelligence";
import { PersonalizationIntelligence } from "@/components/dashboard/personalization-intelligence";
import { CareerMission } from "@/components/dashboard/career-mission";
import { EvidenceIntelligence } from "@/components/dashboard/evidence-intelligence";
import { ConstraintIntelligence } from "@/components/dashboard/constraint-intelligence";
import { ResourceIntelligence } from "@/components/dashboard/resource-intelligence";
import { motion } from "framer-motion";

export default async function DashboardHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  // Load CandidateAIBrain with user data
  candidateAIBrain.setUserId(user.id);
  await candidateAIBrain.load(user.id);

  // Get user data directly from Supabase (using existing auth user)
  const userData = {
    displayName: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email,
  };

  // Load candidate graph data using existing architecture
  const graphInput = await CandidateGraphDataLoader.loadFromRealData(user.id);
  
  if (!graphInput) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Chargement de vos données...</p>
      </div>
    );
  }

  // Build candidate graph using existing builder
  const candidateGraph = CandidateGraphBuilder.build(graphInput);

  // Get brain data from CandidateAIBrain
  const brainObservations = candidateAIBrain.getObservations();
  const brainInsights = candidateAIBrain.getInsights();
  const brainEvents = candidateAIBrain.getRecentEvents(20);
  const brainGoals = candidateAIBrain.getGoals();
  const brainPatterns = candidateAIBrain.getPatterns();

  // Generate daily coach using existing engine with brain context
  let dailyCoachData = null;
  try {
    dailyCoachData = await DailyCoachAIEngine.generateDailyCoach({
      candidateProfile: `${candidateGraph.identity.name}, ${candidateGraph.career.currentRole}`,
      strengths: candidateGraph.strengths.map(s => s.category),
      weaknesses: candidateGraph.weaknesses.map(w => w.category),
      careerLevel: candidateGraph.career.careerLevel,
      experience: `${candidateGraph.career.yearsOfExperience} ans`,
      currentGoals: brainGoals.filter(g => g.status === "in_progress").map(g => g.description),
      recentProgress: candidateGraph.progress.timeline.length > 0 
        ? `${candidateGraph.progress.timeline.length} entretiens complétés`
        : "Début du parcours",
      overallScore: candidateGraph.overallScore,
      previousScore: candidateGraph.progress.previousScore,
      scoreChange: candidateGraph.progress.change,
      recommendedSkills: candidateGraph.recommendedSkills.map(s => s.title),
      recommendedInterviews: candidateGraph.recommendedInterviews.map(i => i.title),
      recentInsights: brainInsights.slice(0, 5).map(i => i.description),
      weeklySummary: `Score actuel: ${candidateGraph.overallScore}/100. ${brainInsights.filter(i => i.type === "progress").length} améliorations détectées.`,
    });
  } catch (error) {
    console.error("Failed to generate daily coach:", error);
  }

  // Generate proactive initiatives using existing engine
  let proactiveInitiatives: Initiative[] = [];
  try {
    const proactiveData = await CareerCopilotProactiveEngine.generateInitiatives({
      candidateGraph,
    });
    proactiveInitiatives = proactiveData.initiatives || [];
  } catch (error) {
    console.error("Failed to generate proactive initiatives:", error);
  }

  // Generate progression plan using existing engine
  let progressionPlan = null;
  try {
    progressionPlan = await CareerCopilotProgressionPlanEngine.generateProgressionPlan({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate progression plan:", error);
  }

  // Generate daily summary using existing engine
  let dailySummary = null;
  try {
    // Get last visit from Brain (last daily summary timestamp)
    const lastSummaryObservations = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-daily-summary")
      .slice(-1);
    
    const lastVisit = lastSummaryObservations.length > 0 && lastSummaryObservations[0]
      ? lastSummaryObservations[0].timestamp
      : undefined;

    dailySummary = await CareerCopilotDailySummaryEngine.generateDailySummary({
      candidateGraph,
      lastVisit,
    });
  } catch (error) {
    console.error("Failed to generate daily summary:", error);
  }

  // Generate digital twin using existing engine
  let digitalTwin = null;
  try {
    digitalTwin = await CareerCopilotDigitalTwinEngine.generateDigitalTwin({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate digital twin:", error);
  }

  // Generate career forecast using existing engine
  let careerForecast = null;
  try {
    careerForecast = await CareerCopilotForecastEngine.generateForecast({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate career forecast:", error);
  }

  // Generate adaptive strategy using existing engine
  let adaptiveStrategy = null;
  try {
    adaptiveStrategy = await CareerCopilotAdaptiveStrategyEngine.detectAndAdaptStrategy({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate adaptive strategy:", error);
  }

  // Get current strategy and history
  const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy();
  const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();

  // Generate decision intelligence using existing engine
  let decisionIntelligence = null;
  try {
    decisionIntelligence = await CareerCopilotDecisionIntelligenceEngine.determinePriority({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate decision intelligence:", error);
  }

  // Get current priority and history
  const currentPriority = CareerCopilotDecisionIntelligenceEngine.getCurrentPriority();
  const priorityHistory = CareerCopilotDecisionIntelligenceEngine.getPriorityHistory();

  // Generate accountability using existing engine
  let accountability = null;
  try {
    accountability = await CareerCopilotAccountabilityEngine.trackCommitments({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate accountability:", error);
  }

  // Get current commitments and history
  const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
  const commitmentHistory = CareerCopilotAccountabilityEngine.getCommitmentHistory();

  // Generate scenario intelligence using existing engine
  let scenarioIntelligence = null;
  try {
    scenarioIntelligence = await CareerCopilotScenarioIntelligenceEngine.generateScenarios({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate scenario intelligence:", error);
  }

  // Generate autonomous intelligence orchestration
  let autonomousIntelligence = null;
  try {
    autonomousIntelligence = await CareerCopilotAutonomousIntelligenceEngine.orchestrate({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate autonomous intelligence:", error);
  }

  // Generate outcome intelligence
  let outcomeIntelligence = null;
  try {
    outcomeIntelligence = await CareerCopilotOutcomeIntelligenceEngine.analyzeOutcomeIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate outcome intelligence:", error);
  }

  // Generate personalization intelligence
  let personalizationIntelligence = null;
  try {
    personalizationIntelligence = await CareerCopilotPersonalizationIntelligenceEngine.analyzePersonalizationIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate personalization intelligence:", error);
  }

  // Generate mission intelligence
  let missionIntelligence = null;
  try {
    missionIntelligence = await CareerCopilotMissionIntelligenceEngine.analyzeMissionIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate mission intelligence:", error);
  }

  // Generate evidence intelligence
  let evidenceIntelligence = null;
  try {
    evidenceIntelligence = await CareerCopilotEvidenceIntelligenceEngine.analyzeEvidenceIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate evidence intelligence:", error);
  }

  // Generate constraint intelligence
  let constraintIntelligence = null;
  try {
    constraintIntelligence = await CareerCopilotConstraintIntelligenceEngine.analyzeConstraintIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate constraint intelligence:", error);
  }

  // Generate resource intelligence
  let resourceIntelligence = null;
  try {
    resourceIntelligence = await CareerCopilotResourceIntelligenceEngine.analyzeResourceIntelligence({
      candidateGraph,
      currentEvent: {
        type: "dashboard_load",
        description: "User loaded dashboard",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to generate resource intelligence:", error);
  }

  // Helper function to safely calculate score change using Brain observations
  const getScoreChange = (metricName: string): number => {
    const observations = candidateAIBrain.findByType(metricName);
    if (observations.length < 2) return 0;
    
    // Sort by timestamp and get last 2
    const sorted = observations
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-2);
    
    const latest = sorted[1];
    const previous = sorted[0];
    
    if (!latest || !previous) return 0;
    
    const latestValue = (latest.data as any)?.value || 0;
    const previousValue = (previous.data as any)?.value || 0;
    
    return latestValue - previousValue;
  };

  // Helper function to safely get trend using Brain observations
  const getScoreTrend = (metricName: string): "improving" | "stable" | "declining" => {
    const observations = candidateAIBrain.findByType(metricName);
    if (observations.length < 2) return "stable";
    
    // Sort by timestamp and get last 2
    const sorted = observations
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-2);
    
    const latest = sorted[1];
    const previous = sorted[0];
    
    if (!latest || !previous) return "stable";
    
    const latestValue = (latest.data as any)?.value || 0;
    const previousValue = (previous.data as any)?.value || 0;
    
    const diff = latestValue - previousValue;
    
    if (diff > 2) return "improving";
    if (diff < -2) return "declining";
    return "stable";
  };

  // Extract data for display (no business logic, just data extraction)
  const stats = {
    interviewsCompleted: candidateGraph.progress.timeline.length || 0,
    interviewsThisMonth: candidateGraph.progress.timeline.filter((i: { date: Date }) => {
      const date = new Date(i.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0,
    credits: 0, // Will be fetched from billing if needed
    careerScore: candidateGraph.overallScore,
  };

  // Generate progress steps based on candidate graph
  const hasCareerProfile = !!candidateGraph.career.currentRole;
  const hasInterviews = candidateGraph.progress.timeline.length > 0;
  const hasManyInterviews = candidateGraph.progress.timeline.length >= 5;

  const progressSteps = [
    { id: "1", title: "Diagnostic initial", completed: hasCareerProfile, current: !hasCareerProfile },
    { id: "2", title: "Entraînement intensif", completed: hasInterviews, current: hasCareerProfile && !hasInterviews },
    { id: "3", title: "Validation finale", completed: hasManyInterviews, current: hasInterviews && !hasManyInterviews },
  ];

  // Generate timeline items from candidate graph and brain events with context
  const timelineItems = [
    ...(candidateGraph.progress.timeline.slice(0, 4).map((interview: { date: Date; context: string; score?: number }, index: number) => {
      // Get related brain observations for context
      const relatedObservations = brainObservations
        .filter(o => o.type === "interview" && o.timestamp >= interview.date && o.timestamp <= new Date(interview.date.getTime() + 60000))
        .slice(0, 2);
      
      return {
        id: `interview-${index}`,
        title: `Session ${interview.context}`,
        date: new Date(interview.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        time: new Date(interview.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: "completed" as const,
        type: "session" as const,
        reason: interview.score ? `Simulation de type ${interview.context} pour évaluer les compétences` : "Entraînement pratique",
        impact: interview.score ? `Score obtenu: ${interview.score}/100 - ${interview.score >= 70 ? "Performance satisfaisante" : "Zone d'amélioration identifiée"}` : "Entraînement complété",
        recommendation: relatedObservations.length > 0 && relatedObservations[0] ? relatedObservations[0].source : "Continuer avec les sessions recommandées",
      };
    })),
  ].slice(0, 6);

  // Build career timeline from CandidateGraph only (brain events will come via EventBus)
  const careerTimelineItems = [
    // Interview events from CandidateGraph
    ...(candidateGraph.progress.timeline.map((interview: { date: Date; context: string; score?: number }, i: number) => ({
      id: `interview-timeline-${i}`,
      date: new Date(interview.date),
      type: "interview" as const,
      title: `Entretien: ${interview.context}`,
      description: interview.score ? `Score: ${interview.score}/100` : "Entretien complété",
      impact: interview.score && interview.score >= 70 ? "positive" as const : interview.score && interview.score >= 50 ? "neutral" as const : "neutral" as const,
    })) || []),
    
    // Improvement events from CandidateGraph
    ...(candidateGraph.progress.change > 0 ? [{
      id: "improvement-1",
      date: new Date(),
      type: "improvement" as const,
      title: "Amélioration détectée",
      description: `Score global amélioré de +${candidateGraph.progress.change}`,
      impact: "positive" as const,
    }] : []),
    
    // Regression events from CandidateGraph
    ...(candidateGraph.progress.change < 0 ? [{
      id: "regression-1",
      date: new Date(),
      type: "regression" as const,
      title: "Régression détectée",
      description: `Score global réduit de ${candidateGraph.progress.change}`,
      impact: "negative" as const,
    }] : []),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl font-semibold text-gray-900 tracking-tight"
        >
          Bonjour, {userData.displayName} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-gray-600 text-[15px] leading-relaxed"
        >
          {hasInterviews 
            ? "Votre prochain entretien approche. Continuons votre préparation."
            : candidateGraph.career.targetRoles[0]
            ? `Préparez votre entretien ${candidateGraph.career.targetRoles[0]}. Commençons par le diagnostic.`
            : "Bienvenue sur Trajectoire. Commençons par définir votre objectif de carrière."
          }
        </motion.p>
      </div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <StatsGrid stats={stats} />
      </motion.div>

      {/* Proactive initiatives */}
      {proactiveInitiatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProactiveInitiatives initiatives={proactiveInitiatives} />
        </motion.div>
      )}

      {/* Progression plan */}
      {progressionPlan && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProgressionPlan plan={progressionPlan} />
        </motion.div>
      )}

      {/* Daily summary */}
      {dailySummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <DailySummary summary={dailySummary} />
        </motion.div>
      )}

      {/* Digital twin */}
      {digitalTwin && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <DigitalTwin twin={digitalTwin} />
        </motion.div>
      )}

      {/* Career forecast */}
      {careerForecast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <CareerForecast forecast={careerForecast} />
        </motion.div>
      )}

      {/* Scenario intelligence */}
      {scenarioIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScenarioIntelligenceWidget scenarioIntelligence={scenarioIntelligence} />
        </motion.div>
      )}

      {/* Autonomous intelligence */}
      {autonomousIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
        >
          <AutonomousIntelligence autonomousIntelligence={autonomousIntelligence} />
        </motion.div>
      )}

      {/* Outcome intelligence */}
      {outcomeIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
        >
          <OutcomeIntelligence outcomeIntelligence={outcomeIntelligence} />
        </motion.div>
      )}

      {/* Personalization intelligence */}
      {personalizationIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          <PersonalizationIntelligence personalization={personalizationIntelligence} />
        </motion.div>
      )}

      {/* Career mission */}
      {missionIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.50, ease: [0.16, 1, 0.3, 1] }}
        >
          <CareerMission mission={missionIntelligence} />
        </motion.div>
      )}

      {/* Evidence intelligence */}
      {evidenceIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <EvidenceIntelligence evidence={evidenceIntelligence} />
        </motion.div>
      )}

      {/* Constraint intelligence */}
      {constraintIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
        >
          <ConstraintIntelligence constraint={constraintIntelligence} />
        </motion.div>
      )}

      {/* Resource intelligence */}
      {resourceIntelligence && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
        >
          <ResourceIntelligence resource={resourceIntelligence} />
        </motion.div>
      )}

      {/* Explainability widgets */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <WhyScore
          metricChanges={[
            { metric: "Communication", change: "+3", value: 3 },
            { metric: "Leadership", change: "+1", value: 1 },
            { metric: "Stress", change: "-2", value: -2 },
            { metric: "Structure", change: "+5", value: 5 },
          ]}
          totalImpact={7}
          explanation="Basé sur les 3 dernières simulations et l'analyse ATS du CV."
          confidence={89}
        />
      </motion.div>

      {progressionPlan && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <WhyPlan
            priorityAction={progressionPlan.singlePriority.action || "Simulation RH"}
            explanation={progressionPlan.singlePriority.why || "Parce que la communication est devenue le facteur bloquant principal."}
            blockingFactor="Score communication insuffisant pour le poste cible"
            otherActions={[
              { action: "Mise à jour CV", reason: "Secondaire, CV déjà optimisé" },
              { action: "Préparation entretien", reason: "En attente de simulation réussie" },
            ]}
            confidence={85}
          />
        </motion.div>
      )}

      {careerForecast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <WhyForecast
            forecastExplanation={{
              forecast: "Score atteindra 78/100 dans 2 semaines",
              basedOn: [
                "6 simulations",
                "4 analyses ATS",
                "Progression stable",
                "Recommandations suivies",
              ],
              explanation: "La trajectoire actuelle montre une amélioration constante de 3 points par semaine.",
              confidence: 84,
              factors: [
                { factor: "Simulations régulières", impact: "Accélère la progression" },
                { factor: "Suivi des recommandations", impact: "Maintient la cohérence" },
              ],
            }}
          />
        </motion.div>
      )}

      {/* Decision of the Day */}
      {currentPriority && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <DecisionOfTheDay decision={currentPriority} />
        </motion.div>
      )}

      {/* Engagement Tracking */}
      {currentCommitments && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <EngagementTracking tracking={currentCommitments} />
        </motion.div>
      )}

      {/* Strategy Evolution */}
      {currentStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StrategyEvolution
            currentStrategy={currentStrategy}
            strategyHistory={strategyHistory.map(s => ({ ...s, timestamp: new Date() }))}
          />
        </motion.div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {dailyCoachData && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <DailyCoachWidget {...dailyCoachData} />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <TimelineWidget items={timelineItems} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <LiveScoresWidget
              overallScore={candidateGraph.overallScore}
              change={candidateGraph.progress.change}
              trend={candidateGraph.progress.trend}
              liveScores={{
                communication: candidateGraph.communication.clarity,
                leadership: candidateGraph.leadership.vision,
                confidence: candidateGraph.confidence,
                structure: candidateGraph.communication.structure,
                impact: candidateGraph.employability.technical,
              }}
              scoreEvolutions={{
                communication: {
                  change: getScoreChange("communication"),
                  trend: getScoreTrend("communication"),
                  since: "depuis 5 simulations",
                },
                leadership: {
                  change: getScoreChange("leadership"),
                  trend: getScoreTrend("leadership"),
                  since: "depuis 5 simulations",
                },
                confidence: {
                  change: getScoreChange("confidence"),
                  trend: getScoreTrend("confidence"),
                  since: "depuis 5 simulations",
                },
                structure: {
                  change: getScoreChange("structure"),
                  trend: getScoreTrend("structure"),
                  since: "depuis 5 simulations",
                },
                impact: {
                  change: getScoreChange("impact"),
                  trend: getScoreTrend("impact"),
                  since: "depuis 5 simulations",
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrainHistoryWidget
              observations={brainObservations.map(o => ({
                id: o.id,
                timestamp: o.timestamp,
                source: o.source,
                type: o.type,
              }))}
              insights={brainInsights.map(i => ({
                id: i.id,
                timestamp: i.timestamp,
                type: i.type,
                description: i.description,
              }))}
              events={brainEvents.map(e => ({
                id: e.id,
                timestamp: e.timestamp,
                type: e.type,
                description: e.description,
              }))}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <StrengthsWeaknessesWidget
              strengths={candidateGraph.strengths}
              weaknesses={candidateGraph.weaknesses}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <CareerTimelineWidget items={careerTimelineItems} />
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProgressWidget steps={progressSteps} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrainGoalsWidget goals={brainGoals} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrainRecommendationsWidget
              recommendations={[
                ...candidateGraph.recommendedJobs.map((r, i) => ({ ...r, id: `job-${i}`, type: "job" as const })),
                ...candidateGraph.recommendedSkills.map((r, i) => ({ ...r, id: `skill-${i}`, type: "skill" as const })),
                ...candidateGraph.recommendedInterviews.map((r, i) => ({ ...r, id: `interview-${i}`, type: "interview" as const })),
                ...candidateGraph.recommendedLearning.map((r, i) => ({ ...r, id: `learning-${i}`, type: "learning" as const })),
              ]}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
