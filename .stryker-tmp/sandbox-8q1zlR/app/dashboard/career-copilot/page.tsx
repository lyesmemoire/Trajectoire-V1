// @ts-nocheck
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CandidateGraphDataLoader } from "@/core/intelligence/profile/CandidateGraphDataLoader";
import { CandidateGraphBuilder } from "@/core/intelligence/profile/CandidateGraphBuilder";
import { CareerAnalysisAIEngine } from "@/core/intelligence/engines/careerAnalysisAIEngine";
import { RecommendationsAIEngine } from "@/core/intelligence/engines/recommendationsAIEngine";
import { ActionPlanAIEngine } from "@/core/intelligence/engines/actionPlanAIEngine";
import { CareerCopilotProactiveEngine } from "@/core/intelligence/engines/careerCopilotProactiveEngine";
import { CareerCopilotProgressionPlanEngine } from "@/core/intelligence/engines/careerCopilotProgressionPlanEngine";
import { CareerCopilotKnowledgeEvolutionEngine } from "@/core/intelligence/engines/careerCopilotKnowledgeEvolutionEngine";
import { CareerCopilotCareerNarrativeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotCareerNarrativeIntelligenceEngine";
import { CareerCopilotReflectionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotReflectionIntelligenceEngine";
import { CareerCopilotPlanningIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotPlanningIntelligenceEngine";
import { CareerCopilotExecutionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotExecutionIntelligenceEngine";
import { CareerCopilotCoachingIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotCoachingIntelligenceEngine";
import { candidateAIBrain } from "@/core/ai/brain/CandidateAIBrain";
import { BrainGoal, BrainInsight } from "@/core/ai/brain/BrainMemory";
import { motion } from "framer-motion";
import { CareerCopilotChat } from "@/components/dashboard/career-copilot-chat";
import { ProactiveInitiatives, Initiative } from "@/components/dashboard/proactive-initiatives";
import { ProgressionPlan } from "@/components/dashboard/progression-plan";
import { KnowledgeEvolution } from "@/components/dashboard/knowledge-evolution";
import { CareerNarrativeIntelligence } from "@/components/dashboard/career-narrative-intelligence";
import { ReflectionIntelligence } from "@/components/dashboard/reflection-intelligence";
import { PlanningIntelligence } from "@/components/dashboard/planning-intelligence";
import { ExecutionIntelligence } from "@/components/dashboard/execution-intelligence";
import { CoachingIntelligence } from "@/components/dashboard/coaching-intelligence";

export default async function CareerCopilotPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/career-copilot");
  }

  // Load CandidateAIBrain with user data
  candidateAIBrain.setUserId(user.id);
  await candidateAIBrain.load(user.id);

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

  // Run career analysis using AI engine
  let careerAnalysis = null;
  try {
    careerAnalysis = await CareerAnalysisAIEngine.analyzeCareer({
      careerHistory: `${candidateGraph.career.currentRole}, ${candidateGraph.career.yearsOfExperience} ans d'expérience, niveau: ${candidateGraph.career.careerLevel}`,
      skillsEvolution: candidateGraph.strengths.map(s => s.category).join(", "),
      achievements: candidateGraph.progress.timeline.length > 0 ? `${candidateGraph.progress.timeline.length} entretiens complétés, score global: ${candidateGraph.overallScore}/100` : "Début du parcours",
      candidateId: user.id,
    });
  } catch (error) {
    console.error("Failed to run career analysis:", error);
  }

  // Run recommendations using AI engine
  let aiRecommendations = null;
  try {
    aiRecommendations = await RecommendationsAIEngine.generateRecommendations({
      candidateProfile: `${candidateGraph.identity.name}, ${candidateGraph.career.currentRole}`,
      assessmentResults: `Score global: ${candidateGraph.overallScore}/100, forces: ${candidateGraph.strengths.map(s => s.category).join(", ")}`,
      careerGoals: candidateGraph.career.targetRoles.join(", "),
      marketContext: "Marché actuel en France",
      candidateId: user.id,
    });
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
  }

  // Run action plan using AI engine
  let actionPlan = null;
  try {
    actionPlan = await ActionPlanAIEngine.generateActionPlan({
      assessmentResults: `Score global: ${candidateGraph.overallScore}/100, faiblesses: ${candidateGraph.weaknesses.map(w => w.category).join(", ")}`,
      gaps: candidateGraph.weaknesses.map(w => w.category).join(", "),
      strengths: candidateGraph.strengths.map(s => s.category).join(", "),
      targetRole: candidateGraph.career.targetRoles[0] || "Senior Developer",
    });
  } catch (error) {
    console.error("Failed to generate action plan:", error);
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

  // Generate knowledge evolution using existing engine
  let knowledgeEvolution = null;
  try {
    knowledgeEvolution = await CareerCopilotKnowledgeEvolutionEngine.analyzeKnowledgeEvolution({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate knowledge evolution:", error);
  }

  // Generate career narrative intelligence using existing engine
  let careerNarrative = null;
  try {
    careerNarrative = await CareerCopilotCareerNarrativeIntelligenceEngine.analyzeCareerNarrative({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate career narrative intelligence:", error);
  }

  // Generate reflection intelligence using existing engine
  let reflection = null;
  try {
    reflection = await CareerCopilotReflectionIntelligenceEngine.performReflection({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate reflection intelligence:", error);
  }

  // Generate planning intelligence using existing engine
  let planning = null;
  try {
    planning = await CareerCopilotPlanningIntelligenceEngine.generatePlanning({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate planning intelligence:", error);
  }

  // Generate execution intelligence using existing engine
  let execution = null;
  try {
    execution = await CareerCopilotExecutionIntelligenceEngine.generateExecution({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate execution intelligence:", error);
  }

  // Generate coaching intelligence using existing engine
  let coaching = null;
  try {
    coaching = await CareerCopilotCoachingIntelligenceEngine.generateCoaching({
      candidateGraph,
    });
  } catch (error) {
    console.error("Failed to generate coaching intelligence:", error);
  }

  // Note: CandidateAIBrain is now fed exclusively via EventBus from AI engines
  // Direct calls to candidateAIBrain are removed to follow architecture constraints
  // Brain data will be consumed via EventBus when available

  // Extract data for display (no business logic, just data extraction)
  const profileSummary = {
    name: candidateGraph.identity.name,
    currentRole: candidateGraph.career.currentRole || "Non défini",
    careerLevel: candidateGraph.career.careerLevel,
    targetRoles: candidateGraph.career.targetRoles,
    yearsOfExperience: candidateGraph.career.yearsOfExperience,
  };

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

  const mainStrengths = candidateGraph.strengths
    .filter(s => s.priority === "high")
    .slice(0, 3);

  const priorityWeaknesses = candidateGraph.weaknesses
    .filter(w => w.priority === "high")
    .slice(0, 3);

  const recentProgress = candidateGraph.progress;
  const detectedRisks = candidateGraph.riskAnalysis.risks.slice(0, 3);
  
  // Get data from CandidateAIBrain
  const brainGoals: BrainGoal[] = candidateAIBrain.getGoals();
  const brainInsights: BrainInsight[] = candidateAIBrain.getInsights();
  
  const currentGoal = brainGoals.find((g: BrainGoal) => g.status === "in_progress") || null;
  const nextAction = brainInsights.find((i: BrainInsight) => i.actionable) || null;
  const recommendedSkills = candidateGraph.recommendedSkills.slice(0, 5);
  const recommendedInterviews = candidateGraph.recommendedInterviews.slice(0, 3);
  const recommendedJobs = candidateGraph.recommendedJobs.slice(0, 5);
  const globalScore = candidateGraph.overallScore;
  const employability = candidateGraph.employability.overall;

  // Generate daily plan from brain insights
  const dailyPlan = brainInsights
    .filter((i: BrainInsight) => i.actionable && i.coaching)
    .slice(0, 5)
    .map((i: BrainInsight) => ({
      action: i.coaching || i.description,
      priority: i.confidence > 0.8 ? "high" : "medium",
      estimatedTime: "15-30 min",
    }));

  // Generate weekly plan from brain goals
  const weeklyPlan = brainGoals
    .filter((g: BrainGoal) => g.status === "pending" || g.status === "in_progress")
    .slice(0, 5)
    .map((g: BrainGoal) => ({
      goal: g.description,
      target: g.target,
      current: g.current,
      targetValue: g.targetValue,
      unit: g.unit,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <h1 className="font-serif text-4xl font-semibold text-gray-900 tracking-tight">
          Career Copilot
        </h1>
        <p className="text-gray-600 text-[15px] leading-relaxed">
          Que dois-je faire aujourd'hui pour augmenter mes chances d'être recruté ?
        </p>
      </motion.div>

      {/* Career Copilot Chat */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CareerCopilotChat candidateGraph={candidateGraph} />
      </motion.div>

      {/* Proactive initiatives */}
      {proactiveInitiatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <ProactiveInitiatives initiatives={proactiveInitiatives} />
        </motion.div>
      )}

      {/* Progression plan */}
      {progressionPlan && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ProgressionPlan plan={progressionPlan} />
        </motion.div>
      )}

      {/* Knowledge Evolution */}
      {knowledgeEvolution && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <KnowledgeEvolution knowledge={knowledgeEvolution} />
        </motion.div>
      )}

      {/* Career Narrative Intelligence */}
      {careerNarrative && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CareerNarrativeIntelligence narrative={careerNarrative} />
        </motion.div>
      )}

      {/* Reflection Intelligence */}
      {reflection && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <ReflectionIntelligence reflection={reflection} />
        </motion.div>
      )}

      {/* Planning Intelligence */}
      {planning && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <PlanningIntelligence planning={planning} />
        </motion.div>
      )}

      {/* Execution Intelligence */}
      {execution && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <ExecutionIntelligence execution={execution} />
        </motion.div>
      )}

      {/* Coaching Intelligence */}
      {coaching && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <CoachingIntelligence coaching={coaching} />
        </motion.div>
      )}

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Résumé du profil</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-medium text-gray-900">{profileSummary.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rôle actuel</p>
            <p className="font-medium text-gray-900">{profileSummary.currentRole}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Niveau</p>
            <p className="font-medium text-gray-900 capitalize">{profileSummary.careerLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Expérience</p>
            <p className="font-medium text-gray-900">{profileSummary.yearsOfExperience} ans</p>
          </div>
        </div>
      </motion.div>

      {/* Score and Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-semibold">Score global</h2>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {getScoreTrend("overall") === "improving" ? "↑ Amélioration" : getScoreTrend("overall") === "declining" ? "↓ Régression" : "→ Stable"}
            </span>
          </div>
          <p className="text-5xl font-bold">{globalScore}</p>
          <p className="text-blue-100 text-sm mt-2">
            {getScoreChange("overall") !== 0 ? `${getScoreChange("overall") >= 0 ? "+" : ""}${getScoreChange("overall")} depuis 5 simulations` : "sur 100"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-semibold">Estimation d'employabilité</h2>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {getScoreTrend("employability") === "improving" ? "↑ Amélioration" : getScoreTrend("employability") === "declining" ? "↓ Régression" : "→ Stable"}
            </span>
          </div>
          <p className="text-5xl font-bold">{employability}%</p>
          <p className="text-emerald-100 text-sm mt-2">
            {getScoreChange("employability") !== 0 ? `${getScoreChange("employability") >= 0 ? "+" : ""}${getScoreChange("employability")}% depuis 5 simulations` : "probabilité de recrutement"}
          </p>
        </motion.div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Forces principales</h2>
          {mainStrengths.length > 0 ? (
            <ul className="space-y-3">
              {mainStrengths.map((strength) => (
                <li key={strength.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="font-medium text-gray-900">{strength.category}</p>
                    <p className="text-sm text-gray-600">{strength.evidence}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">Pas encore de forces détectées</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Faiblesses prioritaires</h2>
          {priorityWeaknesses.length > 0 ? (
            <ul className="space-y-3">
              {priorityWeaknesses.map((weakness) => (
                <li key={weakness.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <div>
                    <p className="font-medium text-gray-900">{weakness.category}</p>
                    <p className="text-sm text-gray-600">{weakness.suggestion}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">Pas encore de faiblesses détectées</p>
          )}
        </motion.div>
      </div>

      {/* Recent Progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Progression récente</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Score actuel</p>
            <p className="text-3xl font-bold text-gray-900">{recentProgress.overallScore}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Score précédent</p>
            <p className="text-3xl font-bold text-gray-900">{recentProgress.previousScore}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Évolution</p>
            <p className={`text-3xl font-bold ${recentProgress.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {recentProgress.change >= 0 ? "+" : ""}{recentProgress.change}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Tendance</p>
            <p className="text-3xl font-bold capitalize text-gray-900">{recentProgress.trend}</p>
          </div>
        </div>
      </motion.div>

      {/* Detected Risks */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Risques détectés</h2>
        {detectedRisks.length > 0 ? (
          <ul className="space-y-3">
            {detectedRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  risk.severity === "high" ? "bg-red-500" : 
                  risk.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{risk.category}</p>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Mitigation: {risk.mitigation}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucun risque détecté</p>
        )}
      </motion.div>

      {/* Current Goal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Objectif actuel</h2>
        {currentGoal ? (
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-900">{currentGoal.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-gray-900">{currentGoal.current} / {currentGoal.targetValue} {currentGoal.unit}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-2xl font-bold capitalize text-gray-900">{currentGoal.status}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Aucun objectif actif</p>
        )}
      </motion.div>

      {/* Next Action */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <h2 className="font-semibold mb-4">Prochaine action recommandée</h2>
        {nextAction ? (
          <div className="space-y-3">
            <p className="text-xl font-medium">{nextAction.description}</p>
            <p className="text-blue-100 text-sm">Type: {nextAction.type}</p>
            {nextAction.coaching && (
              <p className="text-blue-100 text-sm mt-2">Coaching: {nextAction.coaching}</p>
            )}
          </div>
        ) : (
          <p className="text-blue-100">Aucune action recommandée pour le moment</p>
        )}
      </motion.div>

      {/* Daily Plan */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Plan du jour</h2>
        {dailyPlan.length > 0 ? (
          <ul className="space-y-3">
            {dailyPlan.map((item, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-600">Temps estimé: {item.estimatedTime}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.priority === "high" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {item.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucune action planifiée pour aujourd'hui</p>
        )}
      </motion.div>

      {/* Weekly Plan */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Plan de la semaine</h2>
        {weeklyPlan.length > 0 ? (
          <ul className="space-y-3">
            {weeklyPlan.map((item, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.goal}</p>
                  <p className="text-sm text-gray-600">Cible: {item.target}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{item.current} / {item.targetValue} {item.unit}</p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(item.current / item.targetValue) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucun objectif planifié pour cette semaine</p>
        )}
      </motion.div>

      {/* Recommended Simulations */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Simulations recommandées</h2>
        {recommendedInterviews.length > 0 ? (
          <ul className="space-y-3">
            {recommendedInterviews.map((interview, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{interview.title}</p>
                  <p className="text-sm text-gray-600">{interview.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  interview.priority === "high" ? "bg-red-100 text-red-700" : 
                  interview.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {interview.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucune simulation recommandée pour le moment</p>
        )}
      </motion.div>

      {/* Priority Skills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Compétences prioritaires</h2>
        {recommendedSkills.length > 0 ? (
          <ul className="space-y-3">
            {recommendedSkills.map((skill, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{skill.title}</p>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  skill.priority === "high" ? "bg-red-100 text-red-700" : 
                  skill.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {skill.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucune compétence prioritaire identifiée</p>
        )}
      </motion.div>

      {/* Matching Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Offres correspondant au profil</h2>
        {recommendedJobs.length > 0 ? (
          <ul className="space-y-3">
            {recommendedJobs.map((job, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.priority === "high" ? "bg-red-100 text-red-700" : 
                  job.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {job.priority}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">Aucune offre correspondante identifiée</p>
        )}
      </motion.div>
    </div>
  );
}

export const dynamic = "force-dynamic";
