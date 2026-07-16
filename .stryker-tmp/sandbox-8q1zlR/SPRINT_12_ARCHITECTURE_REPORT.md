# SPRINT 12 — IA RÉELLE (OPENAI / ANTHROPIC)

## Architecture Créée

### 1. Core AI Layer (`core/ai/`)

#### Providers
- **AIProvider.ts** - Interface abstraite pour tous les providers IA
  - `generateCompletion()` - Complétion legacy
  - `generateChatCompletion()` - Chat completions
  - `isAvailable()` - Vérification disponibilité
  
- **OpenAIProvider.ts** - Implémentation OpenAI
  - Support GPT-4, GPT-3.5-turbo
  - Gestion erreurs retryables (429, 5xx)
  
- **AnthropicProvider.ts** - Implémentation Anthropic (Claude)
  - Support Claude 3 Opus, Sonnet, Haiku
  - Conversion messages OpenAI → Anthropic

#### Prompt Templates
- **PromptTemplates/PromptRenderer.ts**
  - Substitution variables `{{variable}}`
  - Validation variables requises
  - Formatage JSON pour prompts
  - Troncature pour limites tokens
  
- **PromptTemplates/PromptVersion.ts**
  - Gestion versioning prompts (v1, v2, etc.)
  - Rollout progressif (percentage)
  - Dépréciation versions
  - Rollback automatique

#### Utilities
- **JsonValidator.ts**
  - Validation JSON avec schéma
  - Extraction JSON depuis markdown
  - Création schéma depuis exemple
  - Erreurs détaillées
  
- **RetryPolicy.ts**
  - Retry avec backoff exponentiel
  - Max 2 essais (configurable)
  - Détection erreurs retryables
  - Délai configurable
  
- **CostTracker.ts**
  - Tracking tokens, latence, coût
  - Pricing par provider/model
  - Résumés par provider/model/version
  - Filtrage par date

#### Orchestration
- **AIOrchestrator.ts** - Couche orchestration principale
  - Pipeline complet: Render → Provider → Validate → Retry → Track
  - Gestion multi-provider
  - Validation JSON automatique
  - Retry automatique (max 2)
  - Tracking coûts/metrics
  - Singleton `aiOrchestrator`

---

### 2. Prompts Versionnés (`core/ai/Prompts/`)

Tous les prompts retournent **exclusivement du JSON**.

#### Prompts Créés (v1)

1. **ats-analysis-v1.ts**
   - Analyse CV vs job description
   - Score ATS (0-100)
   - Matching keywords/skills
   - Format analysis
   - Recommendations

2. **interview-analysis-v1.ts**
   - Analyse performance entretien
   - 6 dimensions: communication, leadership, confidence, structure, impact, synthesis
   - Key moments
   - Recommendations

3. **communication-analysis-v1.ts**
   - Analyse compétences communication
   - Clarté, écoute active, ton
   - Questionnement, storytelling
   - Feedback détaillé

4. **leadership-analysis-v1.ts**
   - Analyse leadership
   - Vision, décision-making, influence
   - Conflict resolution, accountability
   - Adaptabilité

5. **executive-summary-v1.ts**
   - Synthèse exécutive
   - Highlights, career trajectory
   - Fit assessment
   - Recommendation hire/consider/pass

6. **recruiter-notes-v1.ts**
   - Notes recruteur structurées
   - Key responses, flags
   - Skills assessment
   - Next steps

7. **decision-estimation-v1.ts**
   - Estimation probabilité hiring
   - Facteurs positifs/négatifs
   - Risk assessment
   - Competitive position

8. **career-analysis-v1.ts**
   - Analyse trajectoire carrière
   - Progression velocity
   - Role transitions
   - Leadership emergence
   - Future potential

9. **action-plan-v1.ts**
   - Plan développement actionnable
   - Development areas spécifiques
   - Timeline, resources
   - Progress tracking

10. **recommendations-v1.ts**
    - Recommandations personnalisées
    - Career path, skill development
    - Job search strategy
    - Personal branding, networking

---

## Pipeline Complet

```
UI / UseCases
    ↓
Intelligence Engines (orchestrateurs)
    ↓
AIOrchestrator
    ↓
PromptRenderer (substitution variables)
    ↓
AIProvider (OpenAI/Anthropic)
    ↓
LLM (réponse JSON)
    ↓
JsonValidator (validation schéma)
    ↓
RetryPolicy (retry si invalide, max 2)
    ↓
CostTracker (tracking tokens/latence/coût)
    ↓
Mapping → CandidateGraph
```

---

## Caractéristiques

### Validation JSON
- Extraction automatique depuis markdown code blocks
- Validation schéma strict
- Retry automatique si invalide (max 2 essais)
- Erreurs contrôlées

### Tracking
- Tokens (prompt/completion/total)
- Latence (ms)
- Coût (USD) - calculé automatiquement
- Provider utilisé
- Version du prompt
- Timestamp

### Retry Policy
- Backoff exponentiel
- Max 2 essais (configurable)
- Détection erreurs retryables (429, 5xx)
- Délai initial 1000ms, max 10000ms

### Versioning Prompts
- Gestion versions (v1, v2, etc.)
- Rollout progressif (percentage)
- Dépréciation versions
- Rollback automatique

---

## Pricing Configuré

### OpenAI
- GPT-4: $30/M input, $60/M output
- GPT-4 Turbo: $10/M input, $30/M output
- GPT-3.5 Turbo: $0.5/M input, $1.5/M output

### Anthropic
- Claude 3 Opus: $15/M input, $75/M output
- Claude 3 Sonnet: $3/M input, $15/M output
- Claude 3 Haiku: $0.25/M input, $1.25/M output

---

## Utilisation Exemple

```typescript
import { aiOrchestrator } from "./core/ai/AIOrchestrator";
import { interviewAnalysisV1 } from "./core/ai/Prompts/interview-analysis-v1";

const result = await aiOrchestrator.execute(
  interviewAnalysisV1,
  {
    transcript: interviewTranscript,
    context: interviewContext,
  },
  {
    provider: "openai",
    model: "gpt-4-turbo",
    promptId: "interview-analysis",
    promptVersion: "v1",
    temperature: 0.7,
    maxTokens: 2000,
  }
);

if (result.success) {
  console.log("Analysis:", result.data);
  console.log("Cost:", result.metrics?.cost);
  console.log("Attempts:", result.attempts);
}
```

---

## État

✅ **Architecture créée** - Core AI layer complete
✅ **Providers disponibles** - OpenAI, Anthropic
✅ **Prompts versionnés** - 10 prompts v1 créés
✅ **Validation JSON** - Avec retry automatique
✅ **Tracking complet** - Tokens, latence, coût, provider, version
✅ **Typecheck** - core/ai passe sans erreurs
✅ **Lint** - core/ai passe ESLint sans warnings

---

## Prochaines Étapes

1. **Intégrer AIOrchestrator** dans Intelligence Engines existants
2. **Remplacer logique mock** par appels IA réels
3. **Configurer API keys** dans environment
4. **Tester prompts** avec vrais providers
5. **Surveiller coûts** via CostTracker
6. **A/B testing** avec PromptVersionManager
