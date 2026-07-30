/**
 * HIIOS v4 Enterprise — TypeScript SDK
 *
 * Client officiel pour intégrer HIIOS dans les applications.
 */

// ─────────────────────────────────────────────
// TYPES SDK
// ─────────────────────────────────────────────

export interface HIIOSConfig {
  baseUrl:    string;
  apiKey:     string;
  timeout?:   number;
  version?:   string;
}

export interface CreateInterviewInput {
  candidateId:         string;
  targetRole:          string;
  interviewType:       "TECHNICAL" | "BEHAVIORAL" | "CULTURAL" | "COMPETENCY" | "FULL";
  durationMinutes?:    number;
  criticalSkills:      string[];
  eliminatoryCriteria?: string[];
  customInstructions?: string;
}

export interface InterviewSession {
  sessionId:     string;
  firstQuestion: QuestionResult;
  plan:          string;
  metadata: {
    criticalSkills:  string[];
    duration:        number;
    hypothesesCount: number;
  };
}

export interface QuestionResult {
  id:            string;
  text:          string;
  type:          string;
  pressureLevel: string;
  rationale:     string;
}

export interface TurnResult {
  turnNumber:   number;
  nextQuestion: QuestionResult;
  state: {
    phase:            string;
    coverageScore:    number;
    globalConfidence: number;
    canDecide:        boolean;
  };
  reasoning: {
    phaseDecision:     string;
    pressureDecision:  string;
    questionRationale: string;
    metaStatus:        string;
  };
}

export interface DecisionResult {
  recommendation:       string;
  confidence:           number;
  confidenceLevel:      string;
  summary:              string;
  keyStrengths:         string[];
  keyRisks:             string[];
  openQuestions:        string[];
  recommendedNextSteps: string[];
  skillAssessments:     SkillAssessmentResult[];
  validation: {
    isValid:    boolean;
    violations: number;
    warnings:   number;
  };
}

export interface SkillAssessmentResult {
  skill:      string;
  confidence: number;
  level:      string;
  summary:    string;
  isCritical: boolean;
}

export interface ExplainResult {
  sessionId:    string;
  phase:        string;
  hypotheses:   HypothesisResult[];
  evidence:     EvidenceResult[];
  contradictions: ContradictionResult[];
  coverage: {
    score:             number;
    covered:           number;
    total:             number;
    uncoveredCritical: string[];
  };
}

export interface HypothesisResult {
  id:              string;
  claim:           string;
  skill:           string;
  status:          string;
  confidence:      number;
  evidenceFor:     number;
  evidenceAgainst: number;
  priority:        string;
}

export interface EvidenceResult {
  id:          string;
  level:       string;
  content:     string;
  reliability: number;
  source:      string;
}

export interface ContradictionResult {
  description: string;
  severity:    string;
  resolved:    boolean;
}

// ─────────────────────────────────────────────
// STREAMING
// ─────────────────────────────────────────────

export type StreamEvent =
  | { type: "analysis_started";    data: { message: string } }
  | { type: "hypotheses_updated";  data: { count: number; summaries: unknown[] } }
  | { type: "contradiction_detected"; data: { count: number } }
  | { type: "coverage_updated";    data: { score: number; uncoveredCritical: string[] } }
  | { type: "next_question";       data: QuestionResult }
  | { type: "turn_complete";       data: { turnNumber: number; canDecide: boolean; reasoning: unknown } }
  | { type: "error";               data: { message: string } };

// ─────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────

export class HIIOSClient {

  private config:  HIIOSConfig;
  private headers: Record<string, string>;

  constructor(config: HIIOSConfig) {
    this.config = {
      timeout: 30000,
      version: "v1",
      ...config,
    };

    this.headers = {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
      "X-HIIOS-SDK":   "typescript/4.0.0",
    };
  }

  // ── Interviews ─────────────────────────────

  async createInterview(input: CreateInterviewInput): Promise<InterviewSession> {
    const response = await this.post("/interviews", input);
    return response as InterviewSession;
  }

  async getInterview(sessionId: string): Promise<unknown> {
    return this.get(`/interviews/${sessionId}`);
  }

  async processTurn(params: {
    sessionId:  string;
    response:   string;
    questionId: string;
    elapsedMinutes?: number;
  }): Promise<TurnResult> {
    const { sessionId, ...body } = params;
    return this.post(`/interviews/${sessionId}/turns`, body) as Promise<TurnResult>;
  }

  async processTurnStream(params: {
    sessionId:  string;
    response:   string;
    questionId: string;
    elapsedMinutes?: number;
    onEvent:    (event: StreamEvent) => void;
  }): Promise<void> {
    const { sessionId, onEvent, ...body } = params;

    const response = await fetch(
      `${this.config.baseUrl}/interviews/${sessionId}/turns/stream`,
      {
        method:  "POST",
        headers: this.headers,
        body:    JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json() as unknown;
      throw new HIIOSError(error.error ?? "Stream failed", response.status);
    }

    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer    = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          const eventType = line.slice(7);
          const nextLine  = lines[lines.indexOf(line) + 1];
          if (nextLine?.startsWith("data: ")) {
            try {
              const data = JSON.parse(nextLine.slice(6));
              onEvent({ type: eventType as unknown, data });
            } catch { /* skip malformed */ }
          }
        }
      }
    }
  }

  async computeDecision(sessionId: string): Promise<DecisionResult> {
    return this.post(`/interviews/${sessionId}/decision`, {}) as Promise<DecisionResult>;
  }

  async explain(sessionId: string): Promise<ExplainResult> {
    return this.get(`/interviews/${sessionId}/explain`) as Promise<ExplainResult>;
  }

  async getAuditTrail(sessionId: string): Promise<{ auditLog: unknown[] }> {
    return this.get(`/interviews/${sessionId}/audit`) as Promise<{ auditLog: unknown[] }>;
  }

  // ── HTTP helpers ───────────────────────────

  private async get(path: string): Promise<unknown> {
    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/${this.config.version}${path}`,
      { method: "GET", headers: this.headers }
    );
    return this.handleResponse(response);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const response = await this.fetchWithTimeout(
      `${this.config.baseUrl}/${this.config.version}${path}`,
      {
        method:  "POST",
        headers: this.headers,
        body:    JSON.stringify(body),
      }
    );
    return this.handleResponse(response);
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout    = setTimeout(
      () => controller.abort(),
      this.config.timeout
    );

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async handleResponse(response: Response): Promise<unknown> {
    const data = await response.json();

    if (!response.ok) {
      throw new HIIOSError(
        (data as unknown).error ?? "API error",
        response.status,
        data
      );
    }

    return data;
  }
}

// ─────────────────────────────────────────────
// ERREUR SDK
// ─────────────────────────────────────────────

export class HIIOSError extends Error {
  constructor(
    message:          string,
    public statusCode: number,
    public data?:     unknown
  ) {
    super(message);
    this.name = "HIIOSError";
  }

  get isNotFound():    boolean { return this.statusCode === 404; }
  get isUnauthorized(): boolean { return this.statusCode === 401; }
  get isForbidden():   boolean { return this.statusCode === 403; }
  get isRateLimited(): boolean { return this.statusCode === 429; }
  get isServerError(): boolean { return this.statusCode >= 500; }
}
