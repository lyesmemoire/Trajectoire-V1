export interface CareerProgression {
  globalScore: number;
  progressionPercentage: number;
  lastAnalysis: Date | null;
  currentLevel: string;
}

export interface CareerCopilot {
  aiSummary: string | null;
  lastAnalysis: Date | null;
  available: boolean;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: Date;
  status: "active" | "completed" | "delayed";
}

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  category: string;
}

export interface ActivityEvent {
  id: string;
  type: "analysis" | "objective_completed" | "action_completed" | "profile_updated";
  title: string;
  description: string;
  timestamp: Date;
}

export interface IntelligenceEngine {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  lastProcessed: Date | null;
}

export interface DashboardData {
  userId: string;
  userName: string;
  userEmail: string;
  careerProgression: CareerProgression;
  careerCopilot: CareerCopilot;
  objectives: Objective[];
  priorityActions: PriorityAction[];
  recentActivity: ActivityEvent[];
  intelligenceEngines: IntelligenceEngine[];
  lastUpdated: Date;
}
