/**
 * Pipeline Inspector
 *
 * Passive inspector for Pipeline state.
 * Read-only access to Pipeline internal state and visual reconstruction.
 */

import { PipelineState, PipelineStage } from "./types";

export class PipelineInspector {
  private readonly STAGE_ORDER = [
    "Candidate",
    "Job Offer",
    "Matching",
    "Transferable Skills",
    "Gap",
    "Interview Preparation",
    "Voice Interview",
    "Runtime",
    "Provider",
    "Audio",
    "Live Analysis",
    "Coaching",
    "Final Report",
  ];

  /**
   * Get current Pipeline state
   * Read-only access to Pipeline state
   */
  getPipelineState(): PipelineState {
    return {
      stages: this.getStages(),
      currentStage: null,
      overallProgress: 0,
      startTime: null,
      endTime: null,
      duration: 0,
    };
  }

  /**
   * Get all pipeline stages
   * Read-only access to pipeline stages
   */
  getStages(): PipelineStage[] {
    return this.STAGE_ORDER.map(name => ({
      name,
      status: "pending" as const,
      startTime: null,
      endTime: null,
      duration: 0,
      metadata: {},
    }));
  }

  /**
   * Get current stage
   * Read-only access to current stage
   */
  getCurrentStage(): string | null {
    const state = this.getPipelineState();
    return state.currentStage;
  }

  /**
   * Get overall progress
   * Read-only access to pipeline progress
   */
  getOverallProgress(): number {
    const state = this.getPipelineState();
    return state.overallProgress;
  }

  /**
   * Build visual pipeline representation
   * Read-only visual reconstruction of pipeline
   */
  buildVisualPipeline(): string {
    const state = this.getPipelineState();
    const lines: string[] = [];

    for (let i = 0; i < state.stages.length; i++) {
      const stage = state.stages[i];
      const statusIcon = this.getStatusIcon(stage.status);
      
      lines.push(`${statusIcon} ${stage.name}`);
      
      if (i < state.stages.length - 1) {
        lines.push(`↓`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Get status icon for stage
   */
  private getStatusIcon(status: PipelineStage["status"]): string {
    switch (status) {
      case "pending":
        return "○";
      case "running":
        return "◉";
      case "completed":
        return "✓";
      case "failed":
        return "✗";
      case "skipped":
        return "⊘";
    }
  }

  /**
   * Get stage by name
   * Read-only access to specific stage
   */
  getStageByName(name: string): PipelineStage | null {
    const state = this.getPipelineState();
    return state.stages.find(s => s.name === name) ?? null;
  }

  /**
   * Get completed stages
   * Read-only access to completed stages
   */
  getCompletedStages(): PipelineStage[] {
    const state = this.getPipelineState();
    return state.stages.filter(s => s.status === "completed");
  }

  /**
   * Get failed stages
   * Read-only access to failed stages
   */
  getFailedStages(): PipelineStage[] {
    const state = this.getPipelineState();
    return state.stages.filter(s => s.status === "failed");
  }

  /**
   * Get Pipeline state summary
   * Read-only summary of Pipeline state
   */
  getStateSummary(): string {
    const state = this.getPipelineState();
    const completed = state.stages.filter(s => s.status === "completed").length;
    const total = state.stages.length;
    return `Progress: ${state.overallProgress.toFixed(0)}% | Current: ${state.currentStage || "None"} | Completed: ${completed}/${total}`;
  }
}
