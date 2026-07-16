"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Calendar, Clock, CheckCircle, FileText, Zap, Target, TrendingUp, Star, Shield, Lightbulb, BarChart3, RefreshCw, Briefcase, Award, TrendingDown, Brain, CheckCircle2, XCircle, User, Settings, MessageSquare, Heart, Compass, Flag, MapPin, Rocket, AlertTriangle, History, Zap as ZapIcon, Database, Search, FileCheck, FileX, Lock, Unlock, ArrowRight, Ban, Plus, Minus, BookOpen, Archive, Eye, Flame, Clock as ClockIcon, BookOpen as BookIcon, Sparkles, User as UserIcon, Fingerprint, Activity, GitBranch, Radar, Scale, AlertOctagon, Route, CheckSquare, Layers } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "completed" | "upcoming" | "pending";
  type: "session" | "deadline" | "milestone" | "ats" | "cv" | "plan" | "strategy" | "priority" | "commitment" | "conclusion" | "confidence" | "synchronization" | "goal" | "market" | "opportunity" | "application" | "outcome" | "recommendation_validated" | "hypothesis_confirmed" | "hypothesis_invalidated" | "new_evidence" | "roi_confirmed" | "new_learning" | "action_became_effective" | "action_abandoned" | "coaching_adapted" | "learning_profile_refined" | "new_pattern_detected" | "coaching_style_changed" | "accelerated_progression" | "simplification_needed" | "personalization_updated" | "mission_created" | "mission_revised" | "milestone_reached" | "phase_completed" | "new_phase" | "deviation_detected" | "mission_accelerated" | "mission_delayed" | "mission_completed" | "evidence_created" | "evidence_confirmed" | "evidence_strengthened" | "evidence_contradicted" | "evidence_obsolete" | "evidence_critical" | "conclusion_updated" | "evidence_sufficient" | "evidence_insufficient" | "constraint_detected" | "constraint_confirmed" | "constraint_lifted" | "constraint_modified" | "strategy_adapted" | "mission_recalibrated" | "opportunity_discarded" | "new_freedom_detected" | "resource_added" | "resource_lost" | "resource_critical" | "resource_optimized" | "resource_overloaded" | "resource_available" | "resource_exhausted" | "resource_invested" | "resource_saved" | "resource_reallocated" | "knowledge_confirmed" | "knowledge_strengthened" | "knowledge_weakened" | "knowledge_obsolete" | "knowledge_replaced" | "knowledge_created" | "knowledge_unused" | "knowledge_critical" | "knowledge_refreshed" | "knowledge_reviewed" | "career_story_updated" | "narrative_improved" | "career_identity_updated" | "career_transition_explained" | "narrative_confidence_updated" | "narrative_fingerprint_updated" | "narrative_consistency_updated" | "narrative_evolution_detected" | "narrative_evidence_updated" | "reflection_completed" | "recommendation_improved" | "blind_spot_detected" | "alternative_generated" | "confidence_recalibrated" | "evidence_strengthened" | "reflection_updated" | "planning_generated" | "milestone_planning_reached" | "planning_updated" | "priority_changed" | "dependency_resolved" | "checkpoint_completed" | "planning_adapted";
  reason?: string; // Pourquoi cet événement s'est produit
  impact?: string; // Impact de cet événement
  recommendation?: string; // Recommandation suite à cet événement
  oldStrategy?: string; // Ancienne stratégie (pour type strategy)
  newStrategy?: string; // Nouvelle stratégie (pour type strategy)
  oldPriority?: string; // Ancienne priorité (pour type priority)
  newPriority?: string; // Nouvelle priorité (pour type priority)
  commitmentState?: string; // État de l'engagement (pour type commitment)
  commitmentDescription?: string; // Description de l'engagement (pour type commitment)
  commitmentReason?: string; // Raison de l'engagement (pour type commitment)
  conclusionType?: string; // Type de changement de conclusion (pour type conclusion)
  oldConclusion?: string; // Ancienne conclusion (pour type conclusion)
  newConclusion?: string; // Nouvelle conclusion (pour type conclusion)
  conclusionReason?: string; // Raison du changement (pour type conclusion)
  confidenceType?: string; // Type de changement de confiance (pour type confidence)
  oldConfidence?: number; // Ancienne confiance (pour type confidence)
  newConfidence?: number; // Nouvelle confiance (pour type confidence)
  confidenceReason?: string; // Raison du changement (pour type confidence)
  syncType?: string; // Type de synchronisation (pour type synchronization)
  syncDescription?: string; // Description de la synchronisation (pour type synchronization)
  syncInvolvedAnalyses?: string[]; // Analyses impliquées (pour type synchronization)
  syncResult?: string; // Résultat de la synchronisation (pour type synchronization)
  goalType?: string; // Type d'événement d'objectif (pour type goal)
  goalDescription?: string; // Description de l'événement d'objectif (pour type goal)
  oldGoal?: string; // Ancien objectif (pour type goal)
  newGoal?: string; // Nouvel objectif (pour type goal)
  goalReason?: string; // Raison du changement d'objectif (pour type goal)
  marketType?: string; // Type d'événement marché (pour type market)
  marketDescription?: string; // Description de l'événement marché (pour type market)
  marketImpact?: string; // Impact de l'événement marché (pour type market)
  opportunityType?: string; // Type d'événement opportunité (pour type opportunity)
  opportunityDescription?: string; // Description de l'événement opportunité (pour type opportunity)
  opportunityTitle?: string; // Titre de l'opportunité (pour type opportunity)
  opportunityAction?: string; // Action recommandée (pour type opportunity)
  opportunityReason?: string; // Raison de l'événement opportunité (pour type opportunity)
  applicationType?: string; // Type d'événement candidature (pour type application)
  applicationDescription?: string; // Description de l'événement candidature (pour type application)
  applicationTitle?: string; // Titre de la candidature (pour type application)
  applicationAction?: string; // Action recommandée (pour type application)
  applicationReason?: string; // Raison de l'événement candidature (pour type application)
  applicationState?: string; // État de la candidature (pour type application)
}

interface TimelineWidgetProps {
  items: TimelineItem[];
}

export function TimelineWidget({ items }: TimelineWidgetProps) {
  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "upcoming":
        return "bg-gray-900 text-white";
      case "pending":
        return "bg-gray-100 text-gray-400";
    }
  };

  const getTypeIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "session":
        return <Clock className="w-4 h-4" />;
      case "deadline":
        return <Calendar className="w-4 h-4" />;
      case "milestone":
        return <CheckCircle className="w-4 h-4" />;
      case "ats":
        return <Target className="w-4 h-4" />;
      case "cv":
        return <FileText className="w-4 h-4" />;
      case "plan":
        return <Zap className="w-4 h-4" />;
      case "strategy":
        return <TrendingUp className="w-4 h-4" />;
      case "priority":
        return <Star className="w-4 h-4" />;
      case "commitment":
        return <Shield className="w-4 h-4" />;
      case "conclusion":
        return <Lightbulb className="w-4 h-4" />;
      case "confidence":
        return <BarChart3 className="w-4 h-4" />;
      case "synchronization":
        return <RefreshCw className="w-4 h-4" />;
      case "goal":
        return <Target className="w-4 h-4" />;
      case "market":
        return <BarChart3 className="w-4 h-4" />;
      case "opportunity":
        return <Briefcase className="w-4 h-4" />;
      case "application":
        return <Briefcase className="w-4 h-4" />;
      case "outcome":
        return <Award className="w-4 h-4" />;
      case "recommendation_validated":
        return <CheckCircle2 className="w-4 h-4" />;
      case "hypothesis_confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "hypothesis_invalidated":
        return <XCircle className="w-4 h-4" />;
      case "new_evidence":
        return <Brain className="w-4 h-4" />;
      case "roi_confirmed":
        return <TrendingUp className="w-4 h-4" />;
      case "new_learning":
        return <Lightbulb className="w-4 h-4" />;
      case "action_became_effective":
        return <TrendingUp className="w-4 h-4" />;
      case "action_abandoned":
        return <TrendingDown className="w-4 h-4" />;
      case "coaching_adapted":
        return <Settings className="w-4 h-4" />;
      case "learning_profile_refined":
        return <Brain className="w-4 h-4" />;
      case "new_pattern_detected":
        return <Lightbulb className="w-4 h-4" />;
      case "coaching_style_changed":
        return <User className="w-4 h-4" />;
      case "accelerated_progression":
        return <Zap className="w-4 h-4" />;
      case "simplification_needed":
        return <MessageSquare className="w-4 h-4" />;
      case "personalization_updated":
        return <Heart className="w-4 h-4" />;
      case "mission_created":
        return <Compass className="w-4 h-4" />;
      case "mission_revised":
        return <History className="w-4 h-4" />;
      case "milestone_reached":
        return <Flag className="w-4 h-4" />;
      case "phase_completed":
        return <CheckCircle className="w-4 h-4" />;
      case "new_phase":
        return <MapPin className="w-4 h-4" />;
      case "deviation_detected":
        return <AlertTriangle className="w-4 h-4" />;
      case "mission_accelerated":
        return <Rocket className="w-4 h-4" />;
      case "mission_delayed":
        return <Clock className="w-4 h-4" />;
      case "mission_completed":
        return <Award className="w-4 h-4" />;
      case "evidence_created":
        return <Database className="w-4 h-4" />;
      case "evidence_confirmed":
        return <FileCheck className="w-4 h-4" />;
      case "evidence_strengthened":
        return <TrendingUp className="w-4 h-4" />;
      case "evidence_contradicted":
        return <FileX className="w-4 h-4" />;
      case "evidence_obsolete":
        return <Clock className="w-4 h-4" />;
      case "evidence_critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "conclusion_updated":
        return <RefreshCw className="w-4 h-4" />;
      case "evidence_sufficient":
        return <CheckCircle className="w-4 h-4" />;
      case "evidence_insufficient":
        return <Search className="w-4 h-4" />;
      case "constraint_detected":
        return <Lock className="w-4 h-4" />;
      case "constraint_confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "constraint_lifted":
        return <Unlock className="w-4 h-4" />;
      case "constraint_modified":
        return <RefreshCw className="w-4 h-4" />;
      case "strategy_adapted":
        return <ArrowRight className="w-4 h-4" />;
      case "mission_recalibrated":
        return <Compass className="w-4 h-4" />;
      case "opportunity_discarded":
        return <Ban className="w-4 h-4" />;
      case "new_freedom_detected":
        return <Unlock className="w-4 h-4" />;
      case "resource_added":
        return <Plus className="w-4 h-4" />;
      case "resource_lost":
        return <Minus className="w-4 h-4" />;
      case "resource_critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "resource_optimized":
        return <TrendingUp className="w-4 h-4" />;
      case "resource_overloaded":
        return <ZapIcon className="w-4 h-4" />;
      case "resource_available":
        return <CheckCircle className="w-4 h-4" />;
      case "resource_exhausted":
        return <XCircle className="w-4 h-4" />;
      case "resource_invested":
        return <ArrowRight className="w-4 h-4" />;
      case "resource_saved":
        return <Shield className="w-4 h-4" />;
      case "resource_reallocated":
        return <RefreshCw className="w-4 h-4" />;
      case "knowledge_confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "knowledge_strengthened":
        return <TrendingUp className="w-4 h-4" />;
      case "knowledge_weakened":
        return <TrendingDown className="w-4 h-4" />;
      case "knowledge_obsolete":
        return <Archive className="w-4 h-4" />;
      case "knowledge_replaced":
        return <RefreshCw className="w-4 h-4" />;
      case "knowledge_created":
        return <BookOpen className="w-4 h-4" />;
      case "knowledge_unused":
        return <Eye className="w-4 h-4" />;
      case "knowledge_critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "knowledge_refreshed":
        return <Flame className="w-4 h-4" />;
      case "knowledge_reviewed":
        return <ClockIcon className="w-4 h-4" />;
      case "career_story_updated":
        return <BookIcon className="w-4 h-4" />;
      case "narrative_improved":
        return <Sparkles className="w-4 h-4" />;
      case "career_identity_updated":
        return <UserIcon className="w-4 h-4" />;
      case "career_transition_explained":
        return <ArrowRight className="w-4 h-4" />;
      case "narrative_confidence_updated":
        return <Shield className="w-4 h-4" />;
      case "narrative_fingerprint_updated":
        return <Fingerprint className="w-4 h-4" />;
      case "narrative_consistency_updated":
        return <Activity className="w-4 h-4" />;
      case "narrative_evolution_detected":
        return <GitBranch className="w-4 h-4" />;
      case "narrative_evidence_updated":
        return <CheckCircle2 className="w-4 h-4" />;
      case "reflection_completed":
        return <Brain className="w-4 h-4" />;
      case "recommendation_improved":
        return <TrendingUp className="w-4 h-4" />;
      case "blind_spot_detected":
        return <Radar className="w-4 h-4" />;
      case "alternative_generated":
        return <GitBranch className="w-4 h-4" />;
      case "confidence_recalibrated":
        return <Scale className="w-4 h-4" />;
      case "evidence_strengthened":
        return <FileCheck className="w-4 h-4" />;
      case "reflection_updated":
        return <AlertOctagon className="w-4 h-4" />;
      case "planning_generated":
        return <Route className="w-4 h-4" />;
      case "milestone_planning_reached":
        return <Flag className="w-4 h-4" />;
      case "planning_updated":
        return <RefreshCw className="w-4 h-4" />;
      case "priority_changed":
        return <Zap className="w-4 h-4" />;
      case "dependency_resolved":
        return <CheckSquare className="w-4 h-4" />;
      case "checkpoint_completed":
        return <CheckCircle className="w-4 h-4" />;
      case "planning_adapted":
        return <Layers className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${getStatusColor(item.status)} flex items-center justify-center`}>
                  {getTypeIcon(item.type)}
                </div>
                {index < items.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                {item.reason && (
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Pourquoi:</span> {item.reason}
                  </p>
                )}
                {item.impact && (
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Impact:</span> {item.impact}
                  </p>
                )}
                {item.recommendation && (
                  <p className="text-xs text-blue-600">
                    <span className="font-medium">Recommandation:</span> {item.recommendation}
                  </p>
                )}
                {item.type === "strategy" && item.oldStrategy && item.newStrategy && (
                  <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="text-xs text-purple-900 mb-1">
                      <span className="font-medium">Changement de stratégie:</span>
                    </p>
                    <p className="text-xs text-purple-800 mb-1">
                      <span className="font-medium">Ancienne:</span> {item.oldStrategy}
                    </p>
                    <p className="text-xs text-purple-800">
                      <span className="font-medium">Nouvelle:</span> {item.newStrategy}
                    </p>
                  </div>
                )}
                {item.type === "priority" && item.oldPriority && item.newPriority && (
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-900 mb-1">
                      <span className="font-medium">Nouvelle priorité stratégique:</span>
                    </p>
                    <p className="text-xs text-amber-800 mb-1">
                      <span className="font-medium">Ancienne:</span> {item.oldPriority}
                    </p>
                    <p className="text-xs text-amber-800">
                      <span className="font-medium">Nouvelle:</span> {item.newPriority}
                    </p>
                  </div>
                )}
                {item.type === "commitment" && item.commitmentState && item.commitmentDescription && (
                  <div className="mt-2 p-2 bg-teal-50 rounded border border-teal-200">
                    <p className="text-xs text-teal-900 mb-1">
                      <span className="font-medium">Engagement:</span> {item.commitmentDescription}
                    </p>
                    <p className="text-xs text-teal-800 mb-1">
                      <span className="font-medium">État:</span> {item.commitmentState}
                    </p>
                    {item.commitmentReason && (
                      <p className="text-xs text-teal-800">
                        <span className="font-medium">Raison:</span> {item.commitmentReason}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "conclusion" && item.conclusionType && item.oldConclusion && item.newConclusion && (
                  <div className="mt-2 p-2 bg-indigo-50 rounded border border-indigo-200">
                    <p className="text-xs text-indigo-900 mb-1">
                      <span className="font-medium">Type:</span> {item.conclusionType}
                    </p>
                    <p className="text-xs text-indigo-800 mb-1">
                      <span className="font-medium">Ancienne conclusion:</span> {item.oldConclusion}
                    </p>
                    <p className="text-xs text-indigo-800 mb-1">
                      <span className="font-medium">Nouvelle conclusion:</span> {item.newConclusion}
                    </p>
                    {item.conclusionReason && (
                      <p className="text-xs text-indigo-800">
                        <span className="font-medium">Raison:</span> {item.conclusionReason}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "confidence" && item.confidenceType && item.oldConfidence !== undefined && item.newConfidence !== undefined && (
                  <div className="mt-2 p-2 bg-teal-50 rounded border border-teal-200">
                    <p className="text-xs text-teal-900 mb-1">
                      <span className="font-medium">Type:</span> {item.confidenceType}
                    </p>
                    <p className="text-xs text-teal-800 mb-1">
                      <span className="font-medium">Ancienne confiance:</span> {item.oldConfidence}%
                    </p>
                    <p className="text-xs text-teal-800 mb-1">
                      <span className="font-medium">Nouvelle confiance:</span> {item.newConfidence}%
                    </p>
                    {item.confidenceReason && (
                      <p className="text-xs text-teal-800">
                        <span className="font-medium">Raison:</span> {item.confidenceReason}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "synchronization" && item.syncType && item.syncDescription && (
                  <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="text-xs text-purple-900 mb-1">
                      <span className="font-medium">Type:</span> {item.syncType}
                    </p>
                    <p className="text-xs text-purple-800 mb-1">
                      <span className="font-medium">Description:</span> {item.syncDescription}
                    </p>
                    {item.syncInvolvedAnalyses && item.syncInvolvedAnalyses.length > 0 && (
                      <p className="text-xs text-purple-800 mb-1">
                        <span className="font-medium">Analyses impliquées:</span> {item.syncInvolvedAnalyses.join(", ")}
                      </p>
                    )}
                    {item.syncResult && (
                      <p className="text-xs text-purple-800">
                        <span className="font-medium">Résultat:</span> {item.syncResult}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "market" && item.marketType && item.marketDescription && (
                  <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-xs text-emerald-900 mb-1">
                      <span className="font-medium">Type:</span> {item.marketType}
                    </p>
                    <p className="text-xs text-emerald-800 mb-1">
                      <span className="font-medium">Description:</span> {item.marketDescription}
                    </p>
                    {item.marketImpact && (
                      <p className="text-xs text-emerald-800">
                        <span className="font-medium">Impact:</span> {item.marketImpact}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "opportunity" && item.opportunityType && item.opportunityDescription && (
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-900 mb-1">
                      <span className="font-medium">Type:</span> {item.opportunityType}
                    </p>
                    <p className="text-xs text-amber-800 mb-1">
                      <span className="font-medium">Description:</span> {item.opportunityDescription}
                    </p>
                    {item.opportunityTitle && (
                      <p className="text-xs text-amber-800 mb-1">
                        <span className="font-medium">Opportunité:</span> {item.opportunityTitle}
                      </p>
                    )}
                    {item.opportunityAction && (
                      <p className="text-xs text-amber-800 mb-1">
                        <span className="font-medium">Action recommandée:</span> {item.opportunityAction}
                      </p>
                    )}
                    {item.opportunityReason && (
                      <p className="text-xs text-amber-800">
                        <span className="font-medium">Raison:</span> {item.opportunityReason}
                      </p>
                    )}
                  </div>
                )}
                {item.type === "application" && item.applicationType && item.applicationDescription && (
                  <div className="mt-2 p-2 bg-pink-50 rounded border border-pink-200">
                    <p className="text-xs text-pink-900 mb-1">
                      <span className="font-medium">Type:</span> {item.applicationType}
                    </p>
                    <p className="text-xs text-pink-800 mb-1">
                      <span className="font-medium">Description:</span> {item.applicationDescription}
                    </p>
                    {item.applicationTitle && (
                      <p className="text-xs text-pink-800 mb-1">
                        <span className="font-medium">Candidature:</span> {item.applicationTitle}
                      </p>
                    )}
                    {item.applicationAction && (
                      <p className="text-xs text-pink-800 mb-1">
                        <span className="font-medium">Action recommandée:</span> {item.applicationAction}
                      </p>
                    )}
                    {item.applicationState && (
                      <p className="text-xs text-pink-800 mb-1">
                        <span className="font-medium">État:</span> {item.applicationState}
                      </p>
                    )}
                    {item.applicationReason && (
                      <p className="text-xs text-pink-800">
                        <span className="font-medium">Raison:</span> {item.applicationReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
