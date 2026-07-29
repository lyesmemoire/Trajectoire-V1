# Phase 0 - Audit de l'Existant

## Objectif

Documenter précisément tous les composants existants pour éviter toute perte lors de la migration vers V2.

---

## 1. Gateway Actuel (Fastify + WebSocket)

### Fichier principal
`apps/realtime-gateway/src/gateway.ts`

### Architecture
- **Framework** : Fastify
- **Transport** : WebSocket (`@fastify/websocket`)
- **Auth** : JWT verification via `verifyToken()`
- **Session management** : `createVoiceSession()`, `getVoiceSession()`, `removeVoiceSession()`
- **Runtime fonctionnel** : `voice-interview/`

### Messages WebSocket (JSON)

#### Messages entrants (Client → Gateway)

```typescript
// Auth
{
  type: "auth",
  token: string,
  sessionId: string
}

// Transcript
{
  type: "transcript",
  transcript: string,
  isFinal: boolean
}
```

#### Messages sortants (Gateway → Client)

```typescript
// Auth success
{
  type: "auth_ok",
  sessionId: string
}

// Error
{
  type: "error",
  code: "INVALID_JSON" | "MISSING_AUTH_FIELDS" | "AUTH_FAILED" | "NOT_AUTHENTICATED" | "PROCESSING_ERROR"
}
```

### Événements Gateway (EventEmitter)

`apps/realtime-gateway/src/events/bus.ts`

```typescript
interface GatewayEvents {
  transcript: (msg: TranscriptMessage) => void;
  ai_chunk: (msg: { sessionId: string; payload: string }) => void;
  ai_done: (msg: { sessionId: string }) => void;
  ai_error: (msg: { sessionId: string; error: string }) => void;
  ai_audio_chunk: (msg: { sessionId: string; payload: Uint8Array }) => void;
  ai_audio_done: (msg: { sessionId: string }) => void;
  interrupt: (msg: { sessionId: string }) => void;
}
```

### Contrats

`apps/realtime-gateway/src/contracts/events.ts`

```typescript
// Protocol version
export const PROTOCOL_VERSION = 1;

// Signaling message
{
  protocolVersion: 1,
  type: string,
  sessionId: string,
  payload: any,
  timestamp?: number
}

// Transcript message
{
  sequence: number,
  transcript: string,
  isFinal: boolean,
  confidence?: number
}
```

---

## 2. Runtime Vocal (Architecture)

### Fichier
`apps/realtime-gateway/src/voice-interview/ARCHITECTURE.md`

### Séparation Inbound / Outbound

#### InboundVoiceEvent (Entrant)
Événements générés par le candidat (subis par le système)
- `transcript`
- `user_silence` (futur, via VAD frontend)

#### OutboundVoiceSignal / VoiceInstruction (Sortant)
Décisions et actions générées par le moteur
- `thinking`
- `speak`
- `speaking_stop`
- `turn_done`

### Point de contact : le `sink`

```typescript
session.sink.dispatch({
  type: "transcript",
  text: msg.transcript,
  isFinal: true
})
```

### Flux de données

```
Gateway (WebSocket)              Session                   Runtime
       │                             │                        │
       │─── JSON msg ───────────────▶│                        │
       │                             │   sink.dispatch()      │
       │                             ├───────────────────────▶│
       │                             │                        │── nextStep()
       │                             │                        │
       │                             │   binding.send()       │
       │                             │◀───────────────────────┤
       │◀── JSON instr ──────────────┤                        │
```

### Invariants (certifiés par CI)

1. Seule la couche réseau peut appeler `.dispatch()`
2. Seul le moteur `VoiceRuntime` peut écouter `.onEvent()`
3. Seule la couche I/O finale peut écouter `.onInstruction()`
4. Seul le moteur peut appeler `.send()` sur le binding
5. Aucun code legacy orienté objet (ex: `InterviewEngine`)

### Cycle de vie session

#### Création
- `SessionManager` crée l'état métier pur
- `VoiceRuntime` instancié et branché sur `TransportBinding`
- TTL bump à chaque instruction sortante

#### Interruption (Barge-in)
1. `AbortController` du tour courant déclenche `abort()`
2. `VoiceRuntime` attrape `AbortError`
3. Si `isSpeaking === true`, instruction `speaking_stop` émise
4. Nouveau transcript traité dans nouveau tour

#### Destruction
Trois mécanismes invoquent `.dispose()` :
- Déconnexion propre (`ws_close`)
- TTL expiré (inactivité N minutes)
- Sweeper périodique

### Pattern Bypass & Bypass-Through

```
[Bypass Layer]      ← Détecte "repeat", "slower", "stop"
       │                 Si commande : state INTACT + texte généré
       ↓                 Si PAS de commande : laisse passer
[Evaluation Layer]  ← Score la réponse
       │
       ↓
[Selection Layer]   ← Choisit prochaine munition/question
```

**Invariants du Bypass**
1. État immuable (compteurs non progressent)
2. Scores neutres
3. Extensibilité (ajouter clé dans `UserCommand`)

---

## 3. Simulation Comportementale

### Fichier
`apps/realtime-gateway/src/voice-interview/core/simulation/index.ts`

### 4 Couches transverses

1. **Perception** : Ce que le recruteur perçoit (signaux, bluff, contradictions)
2. **Interviewer-brain** : Personnalité + stratégie (personas, banque, parcours, plan)
3. **Adaptive** : Adaptation dynamique (difficulté, arbre technique)
4. **Evaluation-layer** : Scores, crédibilité, rapport recruteur

### Modules

- `pressure.ts` - Gestion de la pression
- `memory.ts` - Mémoire de session
- `cross-session.ts` - Mémoire cross-session
- `hidden-eval.ts` - Évaluation invisible
- `persona-reactivity.ts` - Réactivité des personas
- `simulation-state.ts` - État de simulation
- `integration.ts` - Intégration des couches
- `pipeline.ts` - Pipeline d'orchestration
- `recruiter-mind.ts` - État mental unifié
- `stability.ts` - Invariants de stabilité
- `perception-ux.ts` - Projection UX
- `governor/index.js` - Contrôle émotionnel

### Core modules

- `interview-engine.ts` - Moteur d'entretien
- `question-generator.ts` - Génération de questions
- `scoring.ts` - Scoring
- `evaluation.ts` - Évaluation
- `feedback-text.ts` - Feedback textuel
- `intent-detector.ts` - Détection d'intention
- `voice-orchestrator.ts` - Orchestrateur vocal
- `voice-orchestrator-handlers.ts` - Handlers orchestrateur

### V2 / V3

- `v2/` - Moteur V2 (interview-engine-v2)
- `v3/` - Moteur V3

### ATS / CV

- `cv-diagnostic.ts` - Diagnostic CV
- `cv-rewriter.ts` - Réécriture CV
- `cv-structurer.ts` - Structuration CV

---

## 4. Personas Existant

### Fichier
`apps/realtime-gateway/src/voice-interview/core/v2/personas.ts`

### Personas disponibles

```typescript
type PersonaName =
  | "supportive"
  | "neutral"
  | "challenging"
  | "technical_lead"
  | "engineering_manager"
  | "hr"
  | "startup_founder";
```

### Paramètres

```typescript
interface InterviewerPersona {
  name: PersonaName;
  tone: "warm" | "neutral" | "direct" | "incisive";
  pressureLevel: number; // 0-5
  followupDepth: number; // 0-3
  technicalFocus: number; // 0-5
}
```

### Définitions

```typescript
PERSONAS = {
  supportive: { tone: "warm", pressureLevel: 1, followupDepth: 1, technicalFocus: 2 },
  neutral: { tone: "neutral", pressureLevel: 2, followupDepth: 2, technicalFocus: 3 },
  challenging: { tone: "direct", pressureLevel: 4, followupDepth: 3, technicalFocus: 4 },
  technical_lead: { tone: "direct", pressureLevel: 3, followupDepth: 3, technicalFocus: 5 },
  engineering_manager: { tone: "neutral", pressureLevel: 3, followupDepth: 3, technicalFocus: 3 },
  hr: { tone: "warm", pressureLevel: 2, followupDepth: 2, technicalFocus: 1 },
  startup_founder: { tone: "incisive", pressureLevel: 4, followupDepth: 2, technicalFocus: 3 }
}
```

### Fonctions

- `getPersona(name)` - Récupérer persona
- `applyTone(text, persona)` - Appliquer ton à une phrase

---

## 5. Replay Actuel

### Fichier
`apps/web/src/lib/interview/types/replay.types.ts`

### Types d'événements replay

```typescript
type ReplayEventType =
  | "pressure_peak"      // Moment de haute tension
  | "interruption"       // IA a coupé l'utilisateur
  | "hesitation"         // Long silence ou fillers
  | "recovery"           // Reprise en main après moment faible
  | "strong_answer"      // Réponse particulièrement efficace
  | "evasion"            // L'utilisateur évite la question
  | "milestone";         // Changement de phase
```

### Structure ReplayEvent

```typescript
interface ReplayEvent {
  id: string;
  timestamp: number; // Secondes depuis début
  type: ReplayEventType;
  title: string;
  description: string;
  pressureLevel: number;
  triggerSignal?: string; // ex: "low_specificity"
  coachingAdvice?: string;
  originalText?: string;
  betterVersion?: string;
}
```

### Structure SessionReplay

```typescript
interface SessionReplay {
  sessionId: string;
  events: ReplayEvent[];
  pressureCurve: { time: number; level: number }[];
  archetype: string; // ex: "Analytical Thinker"
  overallCoaching: string;
}
```

### Composants replay

- `ReplayEngine.ts` - Moteur de replay
- `replay-generator.ts` - Générateur de replay
- `replay-event-card.tsx` - Carte d'événement
- `replay-timeline.tsx` - Timeline
- `ReplayTracker.tsx` - Tracker
- `replay-analytics/` - Analytics replay

---

## 6. Career DNA

### Emplacement
`apps/web/src/lib/archetypes/career-archetypes.ts`
`apps/web/src/lib/db/career-profile.service.ts`
`apps/web/src/lib/scoring/career-trajectory.ts`

### Composants

- `career-identity-card.tsx` - Carte identité carrière
- `career-score-card.tsx` - Carte score carrière
- `career-dna-card.tsx` - Carte DNA

---

## 7. ATS

### Emplacement
`apps/realtime-gateway/src/voice-interview/core/`

### Modules

- `cv-diagnostic.ts` - Diagnostic CV
- `cv-rewriter.ts` - Réécriture CV
- `cv-structurer.ts` - Structuration CV

---

## 8. Victor Mode (Stress)

### Emplacement
`apps/realtime-gateway/src/voice-interview/stress/`

### Modules

- `run-stress.ts` - Exécution stress test
- `_diag2.ts` - Diagnostic stress

### Utilisation

```typescript
const profile = buildCandidateProfile({
  strengths: ["react", "node"],
  gaps: ["aws"],
  matchScore: 60,
  targetRole: "SE"
});

let { state } = initInterviewPipeline({
  profile,
  persona: "neutral"
});
```

---

## 9. FSM Existante

### Emplacement
À déterminer (probablement dans `voice-interview/core/simulation/`)

### État actuel
- FSM implémentée dans le runtime vocal
- Transitions gérées par `VoiceRuntime`
- États gérés par `simulation-state.ts`

---

## 10. OpenAI Integration

### Emplacement
`apps/realtime-gateway/src/llm-strict.ts`

### Fonctionnalités

- Appels LLM avec prompts stricts
- Gestion des réponses
- Validation des réponses

---

## 11. Données stockées

### Replay actuel
- Audio
- Transcript
- Messages
- Events (pressure_peak, interruption, hesitation, recovery, strong_answer, evasion, milestone)
- Pressure curve
- Archetype

### Manquant pour V2
- Stage
- Director Decisions
- Planner State
- Persona State
- Difficulty
- Memory Snapshot
- Evaluation Snapshot
- Speech Metrics
- Events (complets)
- OpenAI Events

---

## 12. Questions en suspens

### À explorer

1. **Où est la FSM exacte ?**
   - Recherche dans `simulation-state.ts`
   - Recherche dans `v2/` et `v3/`

2. **Quels sont les types InboundVoiceEvent et VoiceInstruction ?**
   - Non trouvés dans la recherche
   - Probablement définis dans les modules v2/v3

3. **Comment fonctionne le Victor Mode exactement ?**
   - Exploration de `stress/`

4. **Comment est stocké le Career DNA ?**
   - Exploration de `career-profile.service.ts`

5. **Comment fonctionne l'ATS ?**
   - Exploration de `cv-diagnostic.ts`

6. **Quels sont les messages JSON complets ?**
   - Audit des messages WebSocket
   - Audit des messages internes

---

## 13. OpenAI Prompts

### Fichier
`apps/realtime-gateway/src/ai/promptBuilder.ts`

### Structure actuelle

```typescript
function buildPrompt(
  cv: string,
  job: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): { role: "system" | "user" | "assistant"; content: string }[]
```

### Prompt système

```
You are an interview assistant. Use the following candidate CV and job description to answer.
CV: ${cv}
Job: ${job}
```

### Observation
Le prompt est **très minimal** :
- Pas de persona
- Pas de stratégie
- Pas de contexte de phase
- Pas de paramètres de pression
- Pas de contraintes
- Juste CV + job + historique

### Pour V2
Ce prompt doit être remplacé par un **Prompt Orchestrator** qui assemble :
- Current Stage
- Current Objective
- Current Persona
- Current Difficulty
- Current Memory Snapshot
- Current Evaluation
- Forbidden Behaviors
- Allowed Strategies

---

## 14. Types Inbound/Outbound

### Observation importante
Les types `InboundVoiceEvent` et `VoiceInstruction` mentionnés dans `ARCHITECTURE.md` **n'existent pas** dans le code actuel.

### Réalité actuelle
Le système utilise des messages JSON simples via WebSocket :
- `type: "auth"`
- `type: "transcript"`
- `type: "error"`

### Pour V2
Il faudra créer ces types formellement pour garantir la séparation Inbound/Outbound.

---

## 15. FSM Existante

### Fichier
`apps/realtime-gateway/src/voice-interview/core/state.ts`

### États

```typescript
type InterviewPhase = "intro" | "deep" | "pressure" | "wrap";
```

### Ordre canonique

```typescript
const PHASE_ORDER: InterviewPhase[] = ["intro", "deep", "pressure", "wrap"];
```

### Fonction de transition

```typescript
function nextPhase(phase: InterviewPhase): InterviewPhase {
  const i = PHASE_ORDER.indexOf(phase);
  if (i < 0 || i >= PHASE_ORDER.length - 1) return "wrap";
  return PHASE_ORDER[i + 1] as InterviewPhase;
}
```

### État de l'entretien

```typescript
interface InterviewState {
  jobGap: string;
  currentTopic: string;
  askedQuestions: string[];
  scoreSignals: number[];
  phase: InterviewPhase;
  interviewerStyle: InterviewerStyle;
  munitions: PressureMunition[];
  munitionsUsage: Record<string, MunitionUsage>;
  currentMunitionId?: string;
}
```

### V2 Phases

```typescript
// Dans interview-plan-builder.ts
type V2Phase = "warmup" | "deep" | "pressure" | "closing";
const V2_PHASE_ORDER: V2Phase[] = ["warmup", "deep", "pressure", "closing"];
```

### Observation
La FSM existe mais est **simple** :
- 4 phases fixes
- Transition linéaire
- Pas de conditions de sortie complexes
- Pas de validation de transition
- Pas de versionnement

### Pour V2
La FSM doit être :
- Déterministe
- Versionnée
- Validée
- Avec conditions de sortie complexes
- Avec transitions conditionnelles

---

## 16. LLM Integration

### Fichier
`apps/realtime-gateway/src/llm-strict.ts`

### Fonctionnalités
- Multi-provider (OpenAI / Mistral)
- Fallback automatique OpenAI → Mistral
- Forçage JSON (response_format: { type: "json_object" })
- Validation Zod avec retry auto-correction (1 tentative)
- Timeout strict 15 secondes
- AbortSignal pour annulation immédiate

### Configuration

```typescript
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRY_ATTEMPTS = 1;
const DEFAULT_TEMPERATURE = 0.3;
```

### Providers
- OpenAI: `gpt-4o-mini` (défaut)
- Mistral: `mistral-small-latest` (fallback)

### Observation
L'intégration LLM est **robuste** mais :
- Pas de gestion du contexte
- Pas de limitation de taille
- Pas de versionnement de prompts
- Pas de cache de réponses

### Pour V2
L'intégration LLM doit être :
- Gérée par le Prompt Orchestrator
- Avec limitation de contexte (1-2k tokens max)
- Avec versionnement de prompts
- Avec cache de réponses
- Avec AI Guard pour validation

---

## 17. Résumé de l'Audit

### Composants existants à conserver

✅ **Gateway (Fastify + WebSocket)**
- Architecture solide
- Séparation Inbound/Outbound (conceptuelle)
- Session management
- JWT verification
- Event bus (EventEmitter)

✅ **Runtime vocal**
- Architecture bien pensée
- Bypass pattern
- Interruption (barge-in)
- TTL management
- Graceful shutdown

✅ **Personas**
- 7 personas bien définis
- Paramètres clairs
- Fonction applyTone

✅ **Simulation comportementale**
- 4 couches transverses
- Perception
- Interviewer-brain
- Adaptive
- Evaluation-layer

✅ **V2 Engine**
- nextV2Step() déterministe
- InterviewStateV2 complet
- AnswerSignals
- Bluff detection
- Contradiction detection
- Difficulty adaptation

✅ **LLM Integration**
- Multi-provider
- Fallback automatique
- Validation Zod
- Timeout strict
- AbortSignal

✅ **Replay**
- Events bien définis
- Pressure curve
- Archetypes

### Composants à améliorer/refondre

⚠️ **FSM**
- Trop simple
- Pas de conditions de sortie complexes
- Pas de versionnement
- Pas de validation

⚠️ **Prompts**
- Trop minimal
- Pas de persona
- Pas de contexte de phase
- Pas de contraintes

⚠️ **Memory**
- Pas structurée (juste askedQuestions, answeredTopics)
- Pas de snapshot
- Pas de contradiction tracking avancé

⚠️ **Evaluation**
- Pas continue (seulement à la fin)
- Pas de confidence par compétence
- Pas de trend

⚠️ **Replay**
- Pas d'Event Sourcing
- Pas de Director Decisions
- Pas de Planner State
- Pas de Persona State
- Pas de Difficulty tracking

### Composants manquants pour V2

❌ **Interview Orchestrator (NestJS)**
- Coordination des moteurs
- Communication avec Gateway via Event Bus

❌ **Conversation Director**
- Décisions stratégiques
- Ne génère pas de texte

❌ **Prompt Orchestrator**
- Assemblage du contexte
- Gestion de la taille
- Versionnement des prompts

❌ **Context Builder**
- Sélection des informations pertinentes
- Filtrage par stage

❌ **AI Guard**
- Validation des réponses
- Contrôle des comportements

❌ **Memory Engine structurée**
- Projects, Companies, Skills
- Achievements, Failures
- Leadership examples
- STAR elements
- Communication profile
- Stress profile

❌ **Evaluation Engine continu**
- Scores par compétence
- Confidence
- Trend
- Evidence

❌ **Speech Analyzer**
- Fillers
- Hesitations
- Speech rate
- Clarity
- Energy
- Emotion

❌ **STAR Detector**
- Détection automatique
- Demande éléments manquants

❌ **Difficulty Engine**
- Évolution dynamique
- Basé sur réponses, temps, stress

❌ **Event Bus (Redis Streams + BullMQ)**
- Communication asynchrone
- Event Sourcing

---

## 18. Prochaines étapes

1. ✅ Gateway actuel
2. ✅ Events Gateway
3. ✅ Replay actuel
4. ✅ Simulation comportementale
5. ✅ Personas existants
6. ✅ Career DNA (emplacement)
7. ✅ ATS (emplacement)
8. ✅ Victor Mode (emplacement)
9. ✅ Documenter tous les événements émis
10. ✅ Documenter tous les messages JSON
11. ✅ Types Inbound/Outbound (inexistants)
12. ✅ OpenAI prompts
13. ✅ FSM existante
14. ⏳ Plan de migration sans régression
15. ⏳ Adapter replay pour V2
16. ⏳ Event Sourcing
17. ⏳ Ajouter Prompt Orchestrator à l'architecture
18. ⏳ Ajouter Context Builder à l'architecture
19. ⏳ Ajouter AI Guard à l'architecture
20. ⏳ Blueprint V3 complet
