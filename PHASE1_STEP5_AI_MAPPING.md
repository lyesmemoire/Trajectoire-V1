# PHASE 1 — Étape 5: Cartographie IA

## Objectif
Identifier tous les pipelines IA, les générateurs de prompts, embeddings, mémoire, matching, scoring, reasoning, orchestration, providers et streaming.

---

## Pipeline IA Global

```
User Input
    ↓
Prompt Builder
    ↓
AI Provider (OpenAI/Mistral/Google)
    ↓
Embeddings (si RAG)
    ↓
Matching (pgvector)
    ↓
Scoring (déterministe)
    ↓
Reasoning (LLM)
    ↓
Streaming (si temps réel)
    ↓
Output
```

---

## 1. Prompts

### Emplacements
- `lib/prompts/` — Prompts génériques
- `lib/interview/prompts.ts` — Prompts interview
- `lib/interview/prompts/` — Prompts interview (dossier)
- `lib/interview/premium-prompt.ts` — Prompt premium
- `lib/interview/prompt-builder.ts` — Builder de prompts

### Structure de lib/prompts/
```
lib/prompts/
├── assembly/ (1 item)
├── fragments/ (3 items)
├── integrity.ts
└── system/ (1 item)
```

### Prompt Builder (lib/interview/prompts.ts)
**Fonction**: `buildPrompt(phase, context, stress, lastAnswer?, dominantPosture?)`

**Paramètres**:
- `phase`: InterviewPhase (positionnement, impact, contradiction, pression, codir)
- `context`: InterviewContext (direction, pression_strategique, codir)
- `stress`: number (0-1)
- `lastAnswer`: string? (optionnel)
- `dominantPosture`: string? (Operational, Managerial, Strategic, Transformational)

**Output**:
```typescript
{
  system: string,
  user: string
}
```

**Logique**:
- System prompt fixe: "Tu es un évaluateur de profils dirigeants..."
- User prompt dynamique basé sur:
  - Phase de l'entretien
  - Contexte
  - Niveau de pression (faible/modéré/élevé)
  - Objectif spécifique à la phase
  - Adaptation selon la posture dominante
  - Réponse précédente (si contradiction)

**Note**: Prompt bien structuré, adaptatif selon le contexte

---

### Premium Prompt (lib/interview/premium-prompt.ts)
**Fonction**: Prompt premium pour utilisateurs payants

**Note**: Prompt spécifique pour les fonctionnalités premium

---

### Prompt Builder (lib/interview/prompt-builder.ts)
**Fonction**: Builder de prompts plus avancé

**Note**: Alternative ou extension du prompt builder principal

---

## 2. Embeddings

### Emplacements
- `lib/ai/rag.ts` — Embeddings OpenAI + RAG

### Implementation (lib/ai/rag.ts)
**Fonction**: `getRelevantCVSections({ supabaseAdmin, cvId, jobDescription, topK })`

**Pipeline**:
1. **Embedding Generation**:
   - Provider: OpenAI
   - Model: `text-embedding-3-small`
   - Input: jobDescription

2. **Vector Matching**:
   - Database: Supabase (PostgreSQL + pgvector)
   - RPC: `match_cv_sections`
   - Parameters:
     - `query_embedding`: jobEmbedding
     - `match_cv_id`: cvId
     - `match_count`: topK (default: 5)

3. **Result Assembly**:
   - Combine les sections CV matching
   - Return: string (sections combinées)

**Note**: RAG bien implémenté avec pgvector

---

## 3. Mémoire

### Emplacements
- `lib/ai/career-memory.ts` — Mémoire carrière
- `lib/ai/cache.ts` — Cache IA

### Career Memory (lib/ai/career-memory.ts)
**Fonction**: `updateCareerProfile({ userId, interviewData, atsData })`

**Pipeline**:
1. **Profile Retrieval**:
   - Database: Prisma
   - Model: `careerProfile`
   - Query: `findUnique({ where: { userId } })`

2. **Profile Creation** (si inexistant):
   - Create new profile with userId

3. **Score Aggregation**:
   - Communication Score
   - Confidence Score
   - Technical Score
   - Leadership Score
   - Global Score (moyenne des 4)

4. **Profile Update**:
   - Update profile with aggregated scores

**Note**: Mémoire carrière bien structurée avec Prisma

---

### Cache (lib/ai/cache.ts)
**Fonction**: Cache pour les réponses IA

**Note**: Cache simple pour optimiser les appels IA

---

## 4. Matching

### Emplacements
- `lib/ai/rag.ts` — Matching vectoriel (pgvector)
- `lib/ats/scoring/` — Matching compétences

### Vector Matching (lib/ai/rag.ts)
**Implementation**: Voir section Embeddings

**Technique**: Cosine similarity via pgvector

**Note**: Matching vectoriel bien implémenté

---

### Skills Matching (lib/ats/scoring/)
**Emplacement**: `lib/ats/scoring/`

**Fonctions**:
- `calculateSkillScore` — Matching compétences
- `aggregateFinalScore` — Agrégation des scores

**Pipeline**:
1. Normalisation des compétences
2. Calcul du score de matching
3. Agrégation avec autres scores (XP, Seniority, Readability)

**Note**: Matching compétences déterministe

---

## 5. Scoring

### Emplacements
- `lib/ats/scoring/` — Scoring ATS
- `lib/scoring/` — Scoring générique

### ATS Scoring (lib/ats/scoring/)
**Fonctions**:
- `calculateSkillScore` — Score compétences
- `aggregateFinalScore` — Score final

**Métriques**:
- Skills Score
- Experience Score (mocké)
- Seniority Score (mocké)
- Readability Score
- Final Score (agrégation)

**Note**: Scoring ATS bien structuré

---

### Generic Scoring (lib/scoring/)
**Emplacement**: `lib/scoring/`

**Note**: Scoring générique pour autres domaines

---

## 6. Reasoning

### Emplacements
- `lib/ai/` — Reasoning via LLM
- `lib/orchestration/` — Orchestration du reasoning

### LLM Reasoning (lib/ai/)
**Providers**:
- OpenAI (GPT-4, GPT-4o-mini)
- Mistral AI (Mistral Small)
- Google Generative AI (Gemini)

**Implementation**:
- Via AI SDK (Vercel AI)
- Streaming support
- Schema validation (Zod)

**Note**: Reasoning délégué aux LLM providers

---

### Orchestration Reasoning (lib/orchestration/)
**Emplacement**: `lib/orchestration/`

**Fonctions**:
- `agent.evaluator.ts` — Évaluation d'agents
- `consensus.engine.ts` — Moteur de consensus
- `signal.router.ts` — Routage de signaux
- `decision-graph.builder.ts` — Construction de graphes de décision
- `decision-graph.repository.ts` — Repository de graphes
- `trace.context.ts` — Contexte de trace

**Note**: Orchestration avancée du reasoning

---

## 7. Orchestration

### Emplacements
- `lib/orchestration/` — Orchestration principale
- `lib/ai-routing/` — Routage des modèles IA

### Orchestration Principale (lib/orchestration/)
**Composants**:
- **Agent Evaluator**: Évaluation des agents IA
- **Consensus Engine**: Moteur de consensus multi-agents
- **Signal Router**: Routage des signaux
- **Decision Graph Builder**: Construction de graphes de décision
- **Decision Graph Repository**: Stockage des graphes
- **Trace Context**: Contexte de traçabilité

**Architecture**:
```
Input
    ↓
Signal Router
    ↓
Agent Evaluator
    ↓
Consensus Engine
    ↓
Decision Graph Builder
    ↓
Decision Graph Repository
    ↓
Output
```

**Note**: Orchestration sophistiquée avec consensus et graphes de décision

---

### AI Routing (lib/ai-routing/)
**Emplacement**: `lib/ai-routing/`

**Fonction**: Sélection du modèle IA optimal

**Logic**:
- Basé sur le plan (enterprise vs free/pro)
- Enterprise → GPT-4o
- Free/Pro → GPT-4o-mini (coût optimisé)

**Note**: Routing simple basé sur le plan utilisateur

---

## 8. Providers

### Emplacements
- `lib/openai.ts` — Client OpenAI
- `lib/mistral.ts` — Client Mistral
- `lib/ai/` — AI SDK (Vercel AI)

### OpenAI Provider (lib/openai.ts)
**Models**:
- GPT-4
- GPT-4o
- GPT-4o-mini
- text-embedding-3-small

**Features**:
- Streaming
- Embeddings
- Chat completion

**Note**: Provider OpenAI bien configuré

---

### Mistral Provider (lib/mistral.ts)
**Models**:
- Mistral Small

**Features**:
- Chat completion
- Schema validation

**Note**: Provider Mistral pour les tâches économiques

---

### AI SDK (Vercel AI)
**Emplacement**: `lib/ai/` (via import)

**Features**:
- Abstraction unifiée
- Streaming
- Schema validation
- Multi-provider support

**Note**: AI SDK comme couche d'abstraction

---

### Google Generative AI
**Emplacement**: `lib/ai/` (via import)

**Models**:
- Gemini

**Note**: Provider Google disponible

---

## 9. Streaming

### Emplacements
- `lib/ai/streaming.ts` — Streaming GPT-4o
- `lib/realtime/` — Streaming temps réel

### GPT-4o Streaming (lib/ai/streaming.ts)
**Fonction**: `streamFromGPT4o(prompt, onToken, signal?)`

**Pipeline**:
1. **Request**:
   - Endpoint: `/api/interview/stream`
   - Method: POST
   - Body: `{ prompt }`

2. **Response Processing**:
   - Stream reading
   - Buffer management
   - Line parsing (SSE format)

3. **Token Extraction**:
   - Parse `data: ` lines
   - Extract `content` from JSON
   - Handle `[DONE]` signal

4. **Callback**:
   - `onToken(content)` pour chaque token

**Note**: Streaming bien implémenté avec SSE

---

### Realtime Streaming (lib/realtime/)
**Emplacement**: `lib/realtime/`

**Features**:
- Audio streaming
- WebSocket streaming
- Transcript streaming

**Note**: Streaming temps réel pour l'audio

---

## 10. Pipeline IA Complet

### Interview Pipeline
```
User Answer
    ↓
Interview Engine
    ↓
Prompt Builder (lib/interview/prompts.ts)
    ↓
AI Router (lib/ai-routing/)
    ↓
Provider Selection (OpenAI/Mistral)
    ↓
LLM Call (GPT-4o-mini/GPT-4o)
    ↓
Streaming (lib/ai/streaming.ts)
    ↓
Question Output
```

**Note**: Pipeline interview bien structuré

---

### ATS Pipeline
```
CV Buffer + Job Description
    ↓
Extraction (lib/ats/extraction/)
    ↓
Parsing IA (Mistral Small)
    ↓
Normalization (lib/ats/normalization/)
    ↓
Scoring (lib/ats/scoring/)
    ↓
Enrichment IA (Mistral Small)
    ↓
Feedback Output
```

**Note**: Pipeline ATS bien structuré avec Mistral

---

### RAG Pipeline
```
Job Description
    ↓
Embedding Generation (OpenAI text-embedding-3-small)
    ↓
Vector Matching (pgvector)
    ↓
CV Sections Retrieval
    ↓
Context Assembly
    ↓
LLM Call with Context
    ↓
Enhanced Output
```

**Note**: Pipeline RAG bien implémenté

---

### Career Memory Pipeline
```
Interview Data + ATS Data
    ↓
Score Aggregation
    ↓
Career Profile Update (Prisma)
    ↓
Database Storage
```

**Note**: Pipeline mémoire simple et efficace

---

## 11. Architecture IA

### Couches
```
┌─────────────────────────────────────┐
│ Presentation Layer                   │
│ - Streaming (lib/ai/streaming.ts)   │
│ - Realtime (lib/realtime/)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Orchestration Layer                 │
│ - AI Routing (lib/ai-routing/)      │
│ - Orchestration (lib/orchestration/)│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Reasoning Layer                     │
│ - LLM Providers (OpenAI/Mistral)    │
│ - AI SDK (Vercel AI)                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Memory Layer                        │
│ - Career Memory (lib/ai/career-memory.ts)│
│ - Cache (lib/ai/cache.ts)           │
│ - Database (Prisma/Supabase)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Vector Layer                        │
│ - Embeddings (OpenAI)               │
│ - pgvector (Supabase)               │
└─────────────────────────────────────┘
```

**Note**: Architecture IA bien structurée en couches

---

## 12. Optimisations IA

### Cost Optimization
- **AI Routing**: GPT-4o-mini pour free/pro, GPT-4o pour enterprise
- **Mistral Small**: Pour les tâches économiques (ATS parsing)
- **Cache**: Cache des réponses IA

### Performance Optimization
- **Streaming**: Réponse temps réel
- **Embeddings**: Vector matching rapide avec pgvector
- **Async**: Parallel processing (Promise.all)

### Quality Optimization
- **Schema Validation**: Zod pour la validation des réponses
- **Consensus Engine**: Multi-agent reasoning
- **Decision Graphs**: Structured reasoning

---

## 13. Sécurité IA

### Prompt Sanitization
**Emplacement**: `lib/security/prompt-sanitizer.ts`

**Fonction**: Sanitization des prompts pour éviter les injections

**Note**: Sécurité IA bien implémentée

---

### Content Moderation
**Emplacement**: `lib/emotional-safety/`

**Fonction**: Modération du contenu généré

**Note**: Modération pour la sécurité émotionnelle

---

## 14. Monitoring IA

### AI Monitoring
**Emplacement**: `lib/ai-monitoring/`

**Fonction**: Monitoring des performances IA

**Note**: Monitoring IA pour l'observabilité

---

## Conclusions de l'Étape 5

### Points Positifs
- ✅ **Pipeline IA bien structuré**: Couches clairement séparées
- ✅ **Multi-provider support**: OpenAI, Mistral, Google
- ✅ **Streaming**: Support temps réel
- ✅ **RAG**: Embeddings + vector matching
- ✅ **Cost optimization**: Routing intelligent
- ✅ **Schema validation**: Zod pour la qualité
- ✅ **Orchestration avancée**: Consensus engine, decision graphs

### Points à Améliorer
- ⚠️ **Documentation**: Manque de documentation sur les pipelines
- ⚠️ **Tests**: Tests IA limités
- ⚠️ **Fallback**: Pas de fallback si un provider échoue
- ⚠️ **Rate limiting**: Pas de rate limiting spécifique IA

### Recommandations
1. **Documenter les pipelines IA**
2. **Ajouter des tests IA**
3. **Implémenter un fallback provider**
4. **Ajouter un rate limiting IA**

### Prochaine Étape
Étape 6: Cartographie Runtime (Web → API → Gateway → Runtime → Engine → Simulation → Provider)
