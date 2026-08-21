/**
 * Shims temporaires pour faire compiler realtime-gateway.
 * Ces types placeholders (_string, _unknown, etc.) doivent être remplacés
 * par des vrais types plus tard.
 */

export {}

declare global {
  type _string = string
  type _number = number
  type _unknown = unknown
  type _undefined = undefined

  // placeholders "types" rencontrés
  type _FastifyInstance = import("fastify").FastifyInstance
  type _VoiceWsLike = any
  type _WsLike = any
  type _TTSAdapter = any
  type _VoiceMetrics = any

  type _StructuredScore = any
  type _StructuredCV = any
  type _FeedbackSignal = any
  type _TurnObservation = any

  type _InitV2Input = any
  type _PersonaName = any
  type _BuildRecruiterReportInput = any
  type _CandidateProfile = any

  type _AdaptiveControllerInput = any
  type _DecisionSimulationScores = any
  type _EscalationControllerInput = any
  type _ImpressionInput = any
  type _RiskEngineInput = any

  type _RunTurnInput = any
  type _MunitionSelectionContext = any

  type _GovernorDecision = any
  type _RuntimeDecision = any
  type _MindState = any
  type _MindSnapshot = any
  type _Transaction = any

  // placeholders "valeurs" rencontrés
  const _100: number
}
