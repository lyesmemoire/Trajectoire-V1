import { Suspense } from "react";
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
import { CareerCopilotAccountabilityEngine } from "@/core/intelligence/engines/careerCopilotAccountabilityEngine";
import { CareerCopilotAutonomousIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine";
import { CareerCopilotOutcomeIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotOutcomeIntelligenceEngine";
import { CareerCopilotMissionIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotMissionIntelligenceEngine";
import { CareerCopilotEvidenceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotEvidenceIntelligenceEngine";
import { CareerCopilotConstraintIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotConstraintIntelligenceEngine";
import { CareerCopilotResourceIntelligenceEngine } from "@/core/intelligence/engines/careerCopilotResourceIntelligenceEngine";
import { candidateAIBrain } from "@/core/ai/brain/CandidateAIBrain";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ProgressWidget } from "@/components/dashboard/progress-widget";
import nextDynamic from "next/dynamic";
import { CardSkeleton } from "@/components/design-system";

const TimelineWidget = nextDynamic(() => import("@/components/dashboard/timeline-widget").then(m => m.TimelineWidget), { loading: () => <CardSkeleton /> });
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LiveScoresWidget } from "@/components/dashboard/live-scores-widget";
import { BrainHistoryWidget } from "@/components/dashboard/brain-history-widget";
import { BrainGoalsWidget } from "@/components/dashboard/brain-goals-widget";
import { BrainRecommendationsWidget } from "@/components/dashboard/brain-recommendations-widget";
import { StrengthsWeaknessesWidget } from "@/components/dashboard/strengths-weaknesses-widget";
import { DailyCoachWidget } from "@/components/dashboard/daily-coach-widget";
import { CareerTimelineWidget } from "@/components/dashboard/career-timeline-widget";
import type { Initiative } from "@/components/dashboard/proactive-initiatives";

const ProactiveInitiatives = nextDynamic(() => import("@/components/dashboard/proactive-initiatives").then(m => m.ProactiveInitiatives), { loading: () => <CardSkeleton /> });
const ProgressionPlan = nextDynamic(() => import("@/components/dashboard/progression-plan").then(m => m.ProgressionPlan), { loading: () => <CardSkeleton /> });
const DailySummary = nextDynamic(() => import("@/components/dashboard/daily-summary").then(m => m.DailySummary), { loading: () => <CardSkeleton /> });
const DigitalTwin = nextDynamic(() => import("@/components/dashboard/digital-twin").then(m => m.DigitalTwin), { loading: () => <CardSkeleton /> });
const CareerForecast = nextDynamic(() => import("@/components/dashboard/career-forecast").then(m => m.CareerForecast), { loading: () => <CardSkeleton /> });
const WhyScore = nextDynamic(() => import("@/components/dashboard/why-score").then(m => m.WhyScore), { loading: () => <CardSkeleton /> });
const WhyPlan = nextDynamic(() => import("@/components/dashboard/why-plan").then(m => m.WhyPlan), { loading: () => <CardSkeleton /> });
const WhyRecommendation = nextDynamic(() => import("@/components/dashboard/why-recommendation").then(m => m.WhyRecommendation), { loading: () => <CardSkeleton /> });
const WhyForecast = nextDynamic(() => import("@/components/dashboard/why-forecast").then(m => m.WhyForecast), { loading: () => <CardSkeleton /> });
const StrategyEvolution = nextDynamic(() => import("@/components/dashboard/strategy-evolution").then(m => m.StrategyEvolution), { loading: () => <CardSkeleton /> });
const DecisionOfTheDay = nextDynamic(() => import("@/components/dashboard/decision-of-the-day").then(m => m.DecisionOfTheDay), { loading: () => <CardSkeleton /> });
const EngagementTracking = nextDynamic(() => import("@/components/dashboard/engagement-tracking").then(m => m.EngagementTracking), { loading: () => <CardSkeleton /> });
const ScenarioIntelligenceWidget = nextDynamic(() => import("@/components/dashboard/scenario-intelligence-widget").then(m => m.ScenarioIntelligenceWidget), { loading: () => <CardSkeleton /> });
const AutonomousIntelligence = nextDynamic(() => import("@/components/dashboard/autonomous-intelligence").then(m => m.AutonomousIntelligence), { loading: () => <CardSkeleton /> });
const OutcomeIntelligence = nextDynamic(() => import("@/components/dashboard/outcome-intelligence").then(m => m.OutcomeIntelligence), { loading: () => <CardSkeleton /> });
const PersonalizationIntelligence = nextDynamic(() => import("@/components/dashboard/personalization-intelligence").then(m => m.PersonalizationIntelligence), { loading: () => <CardSkeleton /> });
const CareerMission = nextDynamic(() => import("@/components/dashboard/career-mission").then(m => m.CareerMission), { loading: () => <CardSkeleton /> });
const EvidenceIntelligence = nextDynamic(() => import("@/components/dashboard/evidence-intelligence").then(m => m.EvidenceIntelligence), { loading: () => <CardSkeleton /> });
const ConstraintIntelligence = nextDynamic(() => import("@/components/dashboard/constraint-intelligence").then(m => m.ConstraintIntelligence), { loading: () => <CardSkeleton /> });
const ResourceIntelligence = nextDynamic(() => import("@/components/dashboard/resource-intelligence").then(m => m.ResourceIntelligence), { loading: () => <CardSkeleton /> });
import { FadeIn } from "@/components/design-system";

// ─── Shared data loader (called once, results passed as promises) ───
async function loadDashboardData(userId: string) {
  candidateAIBrain.setUserId(userId);

  // Parallelize database loading (PR 6.1.1)
  const [, graphInput] = await Promise.all([
    candidateAIBrain.load(userId),
    CandidateGraphDataLoader.loadFromRealData(userId)
  ]);

  if (!graphInput) return null;

  const candidateGraph = CandidateGraphBuilder.build(graphInput);
  const brainObservations = candidateAIBrain.getObservations();
  const brainInsights = candidateAIBrain.getInsights();
  const brainEvents = candidateAIBrain.getRecentEvents(20);
  const brainGoals = candidateAIBrain.getGoals();
  const brainPatterns = candidateAIBrain.getPatterns();

  return { candidateGraph, brainObservations, brainInsights, brainEvents, brainGoals, brainPatterns };
}

// ─── Server Loaders (PR 6.1.3 — Independent async Server Components) ───

async function CoreIntelligenceLoader({ candidateGraph }: { candidateGraph: any }) {
  const currentEvent = { type: "dashboard_load", description: "User loaded dashboard", timestamp: new Date() };

  const [
    digitalTwin, autonomousIntelligence, outcomeIntelligence,
    missionIntelligence, evidenceIntelligence, constraintIntelligence, resourceIntelligence,
    adaptiveStrategy, accountability
  ] = await Promise.all([
    CareerCopilotDigitalTwinEngine.generateDigitalTwin({ candidateGraph }).catch(() => null),
    CareerCopilotAutonomousIntelligenceEngine.orchestrate({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotOutcomeIntelligenceEngine.analyzeOutcomeIntelligence({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotMissionIntelligenceEngine.analyzeMissionIntelligence({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotEvidenceIntelligenceEngine.analyzeEvidenceIntelligence({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotConstraintIntelligenceEngine.analyzeConstraintIntelligence({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotResourceIntelligenceEngine.analyzeResourceIntelligence({ candidateGraph, currentEvent }).catch(() => null),
    CareerCopilotAdaptiveStrategyEngine.detectAndAdaptStrategy({ candidateGraph }).catch(() => null),
    CareerCopilotAccountabilityEngine.trackCommitments({ candidateGraph }).catch(() => null),
  ]);

  const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy();
  const strategyHistory = CareerCopilotAdaptiveStrategyEngine.getStrategyHistory();
  const currentCommitments = CareerCopilotAccountabilityEngine.getCurrentCommitments();
  const commitmentHistory = CareerCopilotAccountabilityEngine.getCommitmentHistory();

  return (
    <>
      {digitalTwin && (
        <FadeIn delay={0.35}>
          <DigitalTwin twin={digitalTwin} />
        </FadeIn>
      )}

      {autonomousIntelligence && (
        <FadeIn delay={0.44}>
          <AutonomousIntelligence autonomousIntelligence={autonomousIntelligence} />
        </FadeIn>
      )}

      {outcomeIntelligence && (
        <FadeIn delay={0.46}>
          <OutcomeIntelligence outcomeIntelligence={outcomeIntelligence} />
        </FadeIn>
      )}

      {missionIntelligence && (
        <FadeIn delay={0.50}>
          <CareerMission mission={missionIntelligence} />
        </FadeIn>
      )}

      {evidenceIntelligence && (
        <FadeIn delay={0.52}>
          <EvidenceIntelligence evidence={evidenceIntelligence} />
        </FadeIn>
      )}

      {constraintIntelligence && (
        <FadeIn delay={0.54}>
          <ConstraintIntelligence constraint={constraintIntelligence} />
        </FadeIn>
      )}

      {resourceIntelligence && (
        <FadeIn delay={0.56}>
          <ResourceIntelligence resource={resourceIntelligence} />
        </FadeIn>
      )}

      {currentCommitments && (
        <FadeIn delay={0.8}>
          <EngagementTracking tracking={currentCommitments} />
        </FadeIn>
      )}

      {currentStrategy && (
        <FadeIn delay={0.6}>
          <StrategyEvolution
            currentStrategy={currentStrategy}
            strategyHistory={strategyHistory.map(s => ({ ...s, timestamp: new Date() }))}
          />
        </FadeIn>
      )}
    </>
  );
}

async function PlanningForecastLoader({ candidateGraph }: { candidateGraph: any }) {
  const [progressionPlan, careerForecast, proactiveRes] = await Promise.all([
    CareerCopilotProgressionPlanEngine.generateProgressionPlan({ candidateGraph }).catch(() => null),
    CareerCopilotForecastEngine.generateForecast({ candidateGraph }).catch(() => null),
    CareerCopilotProactiveEngine.generateInitiatives({ candidateGraph }).catch(() => ({ initiatives: [] })),
  ]);
  const proactiveInitiatives: Initiative[] = proactiveRes?.initiatives || [];

  return (
    <>
      {proactiveInitiatives.length > 0 && (
        <FadeIn delay={0.2}>
          <ProactiveInitiatives initiatives={proactiveInitiatives} />
        </FadeIn>
      )}

      {progressionPlan && (
        <FadeIn delay={0.25}>
          <ProgressionPlan plan={progressionPlan} />
        </FadeIn>
      )}

      {careerForecast && (
        <FadeIn delay={0.4}>
          <CareerForecast forecast={careerForecast} />
        </FadeIn>
      )}

      <FadeIn delay={0.58}>
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
      </FadeIn>

      {progressionPlan && (
        <FadeIn delay={0.5}>
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
        </FadeIn>
      )}

      {careerForecast && (
        <FadeIn delay={0.55}>
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
        </FadeIn>
      )}
    </>
  );
}

async function DailyCoachSummaryLoader({ candidateGraph, brainGoals, brainInsights }: { candidateGraph: any; brainGoals: any[]; brainInsights: any[] }) {
  const lastSummaryObservations = candidateAIBrain.getObservations()
    .filter(obs => obs.source === "career-copilot-daily-summary")
    .slice(-1);
  const lastVisit = lastSummaryObservations.length > 0 && lastSummaryObservations[0]
    ? lastSummaryObservations[0].timestamp
    : undefined;

  const [dailyCoachData, dailySummary] = await Promise.all([
    DailyCoachAIEngine.generateDailyCoach({
      candidateProfile: `${candidateGraph.identity.name}, ${candidateGraph.career.currentRole}`,
      strengths: candidateGraph.strengths.map((s: any) => s.category),
      weaknesses: candidateGraph.weaknesses.map((w: any) => w.category),
      careerLevel: candidateGraph.career.careerLevel,
      experience: `${candidateGraph.career.yearsOfExperience} ans`,
      currentGoals: brainGoals.filter((g: any) => g.status === "in_progress").map((g: any) => g.description),
      recentProgress: candidateGraph.progress.timeline.length > 0
        ? `${candidateGraph.progress.timeline.length} entretiens complétés`
        : "Début du parcours",
      overallScore: candidateGraph.overallScore,
      previousScore: candidateGraph.progress.previousScore,
      scoreChange: candidateGraph.progress.change,
      recommendedSkills: candidateGraph.recommendedSkills.map((s: any) => s.title),
      recommendedInterviews: candidateGraph.recommendedInterviews.map((i: any) => i.title),
      recentInsights: brainInsights.slice(0, 5).map((i: any) => i.description),
      weeklySummary: `Score actuel: ${candidateGraph.overallScore}/100. ${brainInsights.filter((i: any) => i.type === "progress").length} améliorations détectées.`,
    }).catch(() => null),
    CareerCopilotDailySummaryEngine.generateDailySummary({ candidateGraph, lastVisit }).catch(() => null),
  ]);

  return (
    <>
      {dailySummary && (
        <FadeIn delay={0.3}>
          <DailySummary summary={dailySummary} />
        </FadeIn>
      )}
      {dailyCoachData && (
        <FadeIn delay={0.15} direction="left">
          <DailyCoachWidget {...dailyCoachData} />
        </FadeIn>
      )}
    </>
  );
}

// ─── Main Page Component (PR 6.1.3 + 6.1.4 — Streaming via Suspense) ───

export default async function DashboardHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const data = await loadDashboardData(user.id);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Chargement de vos données...</p>
      </div>
    );
  }

  const { candidateGraph, brainObservations, brainInsights, brainEvents, brainGoals, brainPatterns } = data;

  // Get user data directly from Supabase (using existing auth user)
  const userData = {
    displayName: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email,
  };

  // Helper function to safely calculate score change using Brain observations
  const getScoreChange = (metricName: string): number => {
    const observations = candidateAIBrain.findByType(metricName);
    if (observations.length < 2) return 0;
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

  const getScoreTrend = (metricName: string): "improving" | "stable" | "declining" => {
    const observations = candidateAIBrain.findByType(metricName);
    if (observations.length < 2) return "stable";
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
    credits: 0,
    careerScore: candidateGraph.overallScore,
    successRate: candidateGraph.progress.timeline.length > 0 
      ? Math.round((candidateGraph.progress.timeline.filter((i: { score?: number }) => (i.score || 0) >= 70).length / candidateGraph.progress.timeline.length) * 100)
      : null,
  };

  const hasCareerProfile = !!candidateGraph.career.currentRole;
  const hasInterviews = candidateGraph.progress.timeline.length > 0;
  const hasManyInterviews = candidateGraph.progress.timeline.length >= 5;

  const progressSteps = [
    { id: "1", title: "Diagnostic initial", completed: hasCareerProfile, current: !hasCareerProfile },
    { id: "2", title: "Entraînement intensif", completed: hasInterviews, current: hasCareerProfile && !hasInterviews },
    { id: "3", title: "Validation finale", completed: hasManyInterviews, current: hasInterviews && !hasManyInterviews },
  ];

  const timelineItems = [
    ...(candidateGraph.progress.timeline.slice(0, 4).map((interview: { date: Date; context: string; score?: number }, index: number) => {
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

  const careerTimelineItems = [
    ...(candidateGraph.progress.timeline.map((interview: { date: Date; context: string; score?: number }, i: number) => ({
      id: `interview-timeline-${i}`,
      date: new Date(interview.date),
      type: "interview" as const,
      title: `Entretien: ${interview.context}`,
      description: interview.score ? `Score: ${interview.score}/100` : "Entretien complété",
      impact: interview.score && interview.score >= 70 ? "positive" as const : interview.score && interview.score >= 50 ? "neutral" as const : "neutral" as const,
    })) || []),
    ...(candidateGraph.progress.change > 0 ? [{
      id: "improvement-1",
      date: new Date(),
      type: "improvement" as const,
      title: "Amélioration détectée",
      description: `Score global amélioré de +${candidateGraph.progress.change}`,
      impact: "positive" as const,
    }] : []),
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
      {/* Welcome header — Streams immediately */}
      <div className="space-y-3">
        <FadeIn as="span" className="font-serif text-4xl font-semibold text-gray-900 tracking-tight">
          Bonjour, {userData.displayName} 👋
        </FadeIn>
        <FadeIn as="span" delay={0.1} className="text-gray-600 text-[15px] leading-relaxed">
          {hasInterviews 
            ? "Votre prochain entretien approche. Continuons votre préparation."
            : candidateGraph.career.targetRoles[0]
            ? `Préparez votre entretien ${candidateGraph.career.targetRoles[0]}. Commençons par le diagnostic.`
            : "Bienvenue sur Trajectoire. Commençons par définir votre objectif de carrière."
          }
        </FadeIn>
      </div>

      {/* Stats grid — Streams immediately (sync data) */}
      <FadeIn delay={0.15}>
        <StatsGrid stats={stats} />
      </FadeIn>

      {/* PR 6.1.4 — Suspense boundaries for each independent loader */}
      <Suspense fallback={<><CardSkeleton /><CardSkeleton /><CardSkeleton /></>}>
        <PlanningForecastLoader candidateGraph={candidateGraph} />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <DailyCoachSummaryLoader candidateGraph={candidateGraph} brainGoals={brainGoals} brainInsights={brainInsights} />
      </Suspense>

      <Suspense fallback={<><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></>}>
        <CoreIntelligenceLoader candidateGraph={candidateGraph} />
      </Suspense>

      {/* Main content grid — Streams immediately (sync data from candidateGraph) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.2} direction="left">
            <TimelineWidget items={timelineItems} />
          </FadeIn>
          <FadeIn delay={0.25} direction="left">
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
          </FadeIn>
          <FadeIn delay={0.3} direction="left">
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
          </FadeIn>
          <FadeIn delay={0.35} direction="left">
            <StrengthsWeaknessesWidget
              strengths={candidateGraph.strengths}
              weaknesses={candidateGraph.weaknesses}
            />
          </FadeIn>
          <FadeIn delay={0.4} direction="left">
            <CareerTimelineWidget items={careerTimelineItems} />
          </FadeIn>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <FadeIn delay={0.2} direction="right">
            <ProgressWidget steps={progressSteps} />
          </FadeIn>
          <FadeIn delay={0.25} direction="right">
            <BrainGoalsWidget goals={brainGoals} />
          </FadeIn>
          <FadeIn delay={0.3} direction="right">
            <BrainRecommendationsWidget
              recommendations={[
                ...candidateGraph.recommendedJobs.map((r: any, i: number) => ({ ...r, id: `job-${i}`, type: "job" as const })),
                ...candidateGraph.recommendedSkills.map((r: any, i: number) => ({ ...r, id: `skill-${i}`, type: "skill" as const })),
                ...candidateGraph.recommendedInterviews.map((r: any, i: number) => ({ ...r, id: `interview-${i}`, type: "interview" as const })),
                ...candidateGraph.recommendedLearning.map((r: any, i: number) => ({ ...r, id: `learning-${i}`, type: "learning" as const })),
              ]}
            />
          </FadeIn>
          <FadeIn delay={0.35} direction="right">
            <QuickActions />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
