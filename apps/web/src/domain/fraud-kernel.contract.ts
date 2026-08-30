export interface FraudSignal {
  type:
    | "velocity"
    | "ip_anomaly"
    | "device_change"
    | "billing_inconsistency"
    | "behavioral_jump"
    | "replay_mismatch"

  severity: number // 0 → 1
  confidence: number // 0 → 1
  metadata: Record<string, unknown>
}

export interface FraudAssessment {
  userId: string
  riskScore: number // 0 → 1
  signals: FraudSignal[]
  veto: boolean
  reason: string
  timestamp: number
}

export interface FraudKernelConfig {
  hardVetoThreshold: number // ex: 0.85
  softFreezeThreshold: number // ex: 0.65
  velocityWindowMs: number
}
