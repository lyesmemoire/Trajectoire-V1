import * as React from "react";
import { DigitalTwinProps } from "./types";
import { CurrentPortrait } from "./sections/CurrentPortrait";
import { DominantStrengths } from "./sections/DominantStrengths";
import { Fragilities } from "./sections/Fragilities";
import { Habits } from "./sections/Habits";
import { ProfessionalStyle } from "./sections/ProfessionalStyle";
import { WhatChanges } from "./sections/WhatChanges";
import { TemporalComparison } from "./sections/TemporalComparison";
import { NaturalSynthesis } from "./sections/NaturalSynthesis";
import { PriorityDecision } from "./sections/PriorityDecision";
import { BehavioralHabits } from "./sections/BehavioralHabits";
import { ConfirmedBeliefs } from "./sections/ConfirmedBeliefs";
import { RevisedBeliefs } from "./sections/RevisedBeliefs";
import { CertainKnowledge } from "./sections/CertainKnowledge";
import { ProbableTrends } from "./sections/ProbableTrends";
import { ToConfirm } from "./sections/ToConfirm";
import { SynchronizationStatus } from "./sections/SynchronizationStatus";
import { GoalStatus } from "./sections/GoalStatus";
import { MarketContext } from "./sections/MarketContext";
import { OutcomeInsights } from "./sections/OutcomeInsights";
import { LearningProfile } from "./sections/LearningProfile";
import { Resources } from "./sections/Resources";
import { MissionProgression } from "./sections/MissionProgression";
import { EvidenceKnowledge } from "./sections/EvidenceKnowledge";
import { ConstraintInfluences } from "./sections/ConstraintInfluences";
import { KnowledgeEvolution } from "./sections/KnowledgeEvolution";
import { CareerNarrativeContext } from "./sections/CareerNarrativeContext";
import { ReflectionContext } from "./sections/ReflectionContext";
import { PlanningContext } from "./sections/PlanningContext";

export default function DigitalTwin({ twin }: DigitalTwinProps) {
  return (
    <div className="space-y-6">
      <CurrentPortrait twin={twin} />
      <DominantStrengths twin={twin} />
      <Fragilities twin={twin} />
      <Habits twin={twin} />
      <ProfessionalStyle twin={twin} />
      <WhatChanges twin={twin} />
      <TemporalComparison twin={twin} />
      <NaturalSynthesis twin={twin} />
      <PriorityDecision twin={twin} />
      <BehavioralHabits twin={twin} />
      <ConfirmedBeliefs twin={twin} />
      <RevisedBeliefs twin={twin} />
      <CertainKnowledge twin={twin} />
      <ProbableTrends twin={twin} />
      <ToConfirm twin={twin} />
      <SynchronizationStatus twin={twin} />
      <GoalStatus twin={twin} />
      <MarketContext twin={twin} />
      <OutcomeInsights twin={twin} />
      <LearningProfile twin={twin} />
      <Resources twin={twin} />
      <MissionProgression twin={twin} />
      <EvidenceKnowledge twin={twin} />
      <ConstraintInfluences twin={twin} />
      <KnowledgeEvolution twin={twin} />
      <CareerNarrativeContext twin={twin} />
      <ReflectionContext twin={twin} />
      <PlanningContext twin={twin} />
    </div>
  );
}
