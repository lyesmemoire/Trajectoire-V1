import { describe, it, expect, beforeEach } from "vitest";
import { GetDashboardDataQueryImpl } from "../../../modules/dashboard/infrastructure/queries/get-dashboard-data.query.impl";
import { DashboardData, Objective, PriorityAction, ActivityEvent, IntelligenceEngine } from "../../../modules/dashboard/domain/entities/dashboard.entity";

describe("GetDashboardDataQueryImpl", () => {
  let query: GetDashboardDataQueryImpl;

  beforeEach(() => {
    query = new GetDashboardDataQueryImpl();
  });

  it("should return dashboard data for a user", async () => {
    const result = await query.execute({ userId: "user-123" });

    expect(result.isSuccess()).toBe(true);
    
    const data = result.unwrap();
    expect(data).toBeDefined();
    expect(data.userId).toBe("user-123");
    expect(data.userName).toBeDefined();
    expect(data.userEmail).toBeDefined();
    expect(data.careerProgression).toBeDefined();
    expect(data.careerCopilot).toBeDefined();
    expect(data.objectives).toBeInstanceOf(Array);
    expect(data.priorityActions).toBeInstanceOf(Array);
    expect(data.recentActivity).toBeInstanceOf(Array);
    expect(data.intelligenceEngines).toBeInstanceOf(Array);
  });

  it("should return career progression with required fields", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    expect(data.careerProgression.globalScore).toBeGreaterThanOrEqual(0);
    expect(data.careerProgression.globalScore).toBeLessThanOrEqual(100);
    expect(data.careerProgression.progressionPercentage).toBeGreaterThanOrEqual(0);
    expect(data.careerProgression.progressionPercentage).toBeLessThanOrEqual(100);
    expect(data.careerProgression.currentLevel).toBeDefined();
  });

  it("should return career copilot with availability status", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    expect(data.careerCopilot.available).toBeDefined();
    expect(typeof data.careerCopilot.available).toBe("boolean");
  });

  it("should return objectives with valid status", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    data.objectives.forEach((objective: Objective) => {
      expect(["active", "completed", "delayed"]).toContain(objective.status);
      expect(objective.progress).toBeGreaterThanOrEqual(0);
      expect(objective.progress).toBeLessThanOrEqual(100);
      expect(objective.id).toBeDefined();
      expect(objective.title).toBeDefined();
    });
  });

  it("should return priority actions with valid priority", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    data.priorityActions.forEach((action: PriorityAction) => {
      expect(["high", "medium", "low"]).toContain(action.priority);
      expect(action.id).toBeDefined();
      expect(action.title).toBeDefined();
      expect(action.dueDate).toBeInstanceOf(Date);
    });
  });

  it("should return recent activity with valid event types", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    data.recentActivity.forEach((event: ActivityEvent) => {
      expect(["analysis", "objective_completed", "action_completed", "profile_updated"]).toContain(event.type);
      expect(event.id).toBeDefined();
      expect(event.title).toBeDefined();
      expect(event.timestamp).toBeInstanceOf(Date);
    });
  });

  it("should return intelligence engines with valid status", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    data.intelligenceEngines.forEach((engine: IntelligenceEngine) => {
      expect(["active", "inactive", "error"]).toContain(engine.status);
      expect(engine.id).toBeDefined();
      expect(engine.name).toBeDefined();
    });
  });

  it("should return lastUpdated timestamp", async () => {
    const result = await query.execute({ userId: "user-123" });
    const data = result.unwrap() as DashboardData;

    expect(data.lastUpdated).toBeInstanceOf(Date);
    expect(data.lastUpdated.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
