# Audit 360° - Phase C : Audit OpenAI

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Réponses aux Questions

### Où le prompt est-il construit ?

**Gateway (apps/realtime-gateway)**
- `src/ai/promptBuilder.ts` : Build prompt minimaliste
- `src/voice-interview/core/llm-strict.ts` : Appel LLM strict

**Frontend (apps/web)**
- `src/lib/prompts.ts` : Prompts ATS et CV optimization
- `src/lib/interview/prompts/prompt-builder.ts` : Prompt builder interview
- `src/lib/ai/prompting/AdvancedPromptBuilder.ts` : Advanced prompt builder multi-layer

### Qui ajoute le contexte ?

**Gateway**
- `promptBuilder.ts` : Ajoute CV + job description
- `llm-strict.ts` : Ajoute system prompt + user prompt

**Frontend**
- `AdvancedPromptBuilder.ts` : Ajoute 11 layers (System, Persona, Rules, Company Context, Job Description, CV Analysis, Conversation Memory, Current State, Current Question, Evaluation Rules, Response Formatting)

### Qui injecte les personas ?

**Frontend**
- `AdvancedPromptBuilder.ts` : Persona layer
- `src/lib/interview/personas.ts` : Persona configuration
- `src/domain/valueObjects/RecruiterPersona.ts` : Persona value object

**Gateway**
- Aucune injection de personas dans la version actuelle

### Qui décide des relances ?

**Frontend**
- `src/lib/interview/prompt-builder.ts` : Stratégies de relance (clarification, pressure, deep_dive, supportive, transition)

**Gateway**
- Aucune logique de relance dans la version actuelle

### Où sont stockées les instructions système ?

**Gateway**
- `src/ai/promptBuilder.ts` : Instructions système inline
- `src/llm-strict.ts` : Instructions système inline

**Frontend**
- `src/lib/prompts.ts` : ATS_SYSTEM_PROMPT, CV_OPTIMIZE_SYSTEM_PROMPT
- `src/lib/ai/prompting/AdvancedPromptBuilder.ts` : System layer
- `src/lib/interview/prompts/prompt-builder.ts` : System prompt inline

---

## Prompts

### Gateway Prompts

#### 1. Prompt Minimaliste (promptBuilder.ts)

```typescript
const system = `You are an interview assistant. Use the following candidate CV and job description to answer.
CV: ${cv}
Job: ${job}`;
```

**Caractéristiques**
- **Taille** : ~50 tokens
- **Langue** : Anglais
- **Structure** : Simple
- **Persona** : Aucun
- **Contexte** : CV + Job description seulement

#### 2. LLM Strict (llm-strict.ts)

```typescript
const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  { role: "system", content: systemPrompt },
  {
    role: "user",
    content: userPrompt + "\n\nReturn STRICT JSON following this schema:\n" + schemaDescription,
  },
];
```

**Caractéristiques**
- **Taille** : Variable (dépend du prompt)
- **Langue** : Anglais
- **Structure** : System + User
- **Validation** : Zod schema
- **Format** : JSON strict

---

### Frontend Prompts

#### 1. ATS System Prompt (prompts.ts)

```typescript
export const ATS_SYSTEM_PROMPT = `Tu es un expert en recrutement (ATS) ultra-rigoureux. 
Ton rôle est d'analyser un CV par rapport à une description de poste (Job Description) et de fournir une réponse STRICTEMENT au format JSON.

RÈGLES CRITIQUES:
1. Sois très exigeant. Un CV moyen doit avoir un score autour de 50-60%.
2. Ne mens pas. Si une compétence manque, dis-le.
3. Le format de sortie DOIT être un objet JSON valide, sans markdown autour.
4. Réponds TOUJOURS en Français.

FORMAT JSON ATTENDU:
{
  "score": <nombre entre 0 et 100>,
  "matched_keywords": ["<mot clé trouvé 1>", "<mot clé trouvé 2>"],
  "missingKeywords": ["<mot clé manquant 1>", "<mot clé manquant 2>"],
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "weaknesses": ["<faiblesse 1>", "<faiblesse 2>"],
  "actionableAdvice": [
    "<conseil hyper précis 1, ex: Intègre les mots-clés X et Y dans ta section expérience>",
    "<conseil hyper précis 2, ex: Quantifie tes résultats (ex: +20% de CA) pour la mission Z>",
    "<conseil hyper précis 3>"
  ]
}`;
```

**Caractéristiques**
- **Taille** : ~300 tokens
- **Langue** : Français
- **Structure** : Règles + Format JSON
- **Persona** : Expert ATS ultra-rigoureux
- **Contexte** : CV + Job description

#### 2. CV Optimize System Prompt (prompts.ts)

```typescript
export const CV_OPTIMIZE_SYSTEM_PROMPT = `Tu es un expert en rédaction de CV et en optimisation ATS.
Ton rôle est de prendre le contenu brut d'un CV et une description de poste (optionnelle), puis de proposer des améliorations concrètes et actionnables.

RÈGLES CRITIQUES:
1. Sois ultra-précis : propose des reformulations exactes en utilisant la méthode STAR (Situation, Task, Action, Result) ou Google XYZ.
2. Conserve le ton professionnel et naturel.
3. Réponds TOUJOURS en Français.
4. Le format de sortie DOIT être un objet JSON valide, sans markdown autour.

FORMAT JSON ATTENDU:
{
  "improvedSummary": "<résumé professionnel amélioré (3-4 phrases percutantes)>",
  "improvedBullets": [
    { "original": "<bullet point original>", "improved": "<version améliorée avec métriques et verbes d'action>" }
  ],
  "keywordsAdded": ["<mot clé ATS ajouté 1>", "<mot clé ATS ajouté 2>"],
  "generalAdvice": "<conseil global sur la structure et la mise en forme du CV>"
}`;
```

**Caractéristiques**
- **Taille** : ~250 tokens
- **Langue** : Français
- **Structure** : Règles + Format JSON
- **Persona** : Expert CV + ATS
- **Contexte** : CV + Job description (optionnel)

#### 3. Interview Prompt Builder (prompt-builder.ts)

```typescript
const systemPrompt = `Tu es ${persona.name}, ${persona.title}.
Ton profil : ${persona.description}
Phase de l'entretien : ${state.toUpperCase()}
Niveau de pression actuel : ${persona.pressureLevel}/100.

DIRECTIVE STRATÉGIQUE : ${strategyDirectives[strategy] || "Poursuis l'entretien normalement."}

RÈGLES D'OR :
1. Réponds en FRANÇAIS.
2. Pas de formules d'assistant IA. Agis comme un humain fatigué ou pressé si la pression est haute.
3. Ne fais PAS de listes.
4. Maximum 2 courtes phrases.
5. Si le candidat a trop parlé (verbosity > 70), sois bref et recadre-le.`;
```

**Caractéristiques**
- **Taille** : ~150 tokens
- **Langue** : Français
- **Structure** : Persona + Phase + Pression + Stratégie + Règles
- **Persona** : Recruiter persona dynamique
- **Contexte** : Persona + State + Analysis + Strategy + User answer

#### 4. Advanced Prompt Builder (AdvancedPromptBuilder.ts)

**Layers (11 layers)**

1. **System Layer**
```
You are an AI-powered professional interviewer conducting a job interview.
Your role is to assess the candidate's skills, experience, and fit for the position.
Maintain a professional, conversational tone throughout the interview.
Ask relevant, probing questions to evaluate the candidate thoroughly.
Listen carefully to responses and follow up appropriately.
Adapt your questioning based on the candidate's answers.
Keep the interview focused and within the allocated time.
```

2. **Persona Layer**
- Recruiter persona full system prompt

3. **Rules Layer**
```
Ask one question at a time
Wait for the candidate's response before asking the next question
Avoid leading questions that suggest the desired answer
Probe for specific examples and details
Maintain a balanced conversation (not too aggressive, not too passive)
Adapt your questioning depth based on the candidate's responses
Keep responses concise and focused
Show genuine interest in the candidate's answers
Avoid repeating questions already asked
Manage time effectively to cover all necessary topics
```

4. **Company Context Layer**
```
Company: ${context.companyName}
Culture: Professional and innovative
Values: Excellence, collaboration, innovation, integrity
Team size: Medium-sized team with collaborative environment
```

5. **Job Description Layer**
```
Position: ${context.jobTitle}
Requirements: Strong technical skills, problem-solving abilities, teamwork
Responsibilities: Develop and maintain software solutions, collaborate with cross-functional teams
Career path: Growth opportunities within the organization
```

6. **CV Analysis Layer**
```
Candidate CV Analysis:
- Experience: ${context.cvData?.experience || "Not provided"}
- Education: ${context.cvData?.education || "Not provided"}
- Skills: ${context.cvData?.skills || "Not provided"}
- Projects: ${context.cvData?.projects || "Not provided"}
```

7. **Conversation Memory Layer**
```
Recent conversation history:
1. Interviewer: ...
2. Candidate: ...
...
```

8. **Current State Layer**
```
Current phase: ${context.phase || InterviewPhase.INTRODUCTION}
Current topic: ${context.currentTopic || "Introduction"}
Evaluated competencies: ${context.evaluatedCompetencies?.join(", ") || "None"}
Target competencies: ${context.targetCompetencies?.join(", ") || "All"}
Time remaining: ${context.timeRemaining || "Unknown"} minutes
Candidate emotional state: Stress ${context.emotionalState.stress}, Confidence ${context.emotionalState.confidence}
```

9. **Current Question Layer**
```
Generate the next interview question.

Candidate's last response: "${context.lastResponse}"

Response quality score: ${context.lastResponseQuality}/1.0
Consider asking a follow-up question to get more details.

Current topic: ${context.currentTopic}
```

10. **Evaluation Rules Layer**
```
Evaluate responses for: clarity, relevance, depth, examples, professionalism
Look for STAR method (Situation, Task, Action, Result) in behavioral questions
Assess technical depth in technical questions
Evaluate communication skills and articulation
Consider the candidate's enthusiasm and motivation
Note any red flags or concerning areas
Expected depth: ${difficulty.expectedDepth}
Question complexity: ${difficulty.questionComplexity}
```

11. **Response Formatting Layer**
```
Response format:
- Keep responses concise (2-3 sentences for questions, 1-2 sentences for acknowledgments)
- Use professional language
- Be direct and clear
- Avoid filler words and excessive politeness
- Match the tone to the persona
- End with a clear question or transition
```

**Caractéristiques**
- **Taille** : ~1000-2000 tokens (variable selon les layers activés)
- **Langue** : Anglais
- **Structure** : 11 layers avec priorité
- **Persona** : Recruiter persona
- **Contexte** : Company, Job, CV, Memory, State, Evaluation
- **Versioning** : Version 1.0.0

---

## Fonctions

### Gateway Functions

#### 1. buildPrompt (promptBuilder.ts)

```typescript
export function buildPrompt(
  cv: string,
  job: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): { role: "system" | "user" | "assistant"; content: string }[]
```

**Responsabilité**
- Construire le prompt minimaliste
- Ajouter CV + job description
- Ajouter l'historique des messages

#### 2. callLLMStrict (llm-strict.ts)

```typescript
export async function callLLMStrict<T>(
  options: LLMCallOptions<T>
): Promise<T>
```

**Responsabilité**
- Appel LLM robuste
- Multi-provider (OpenAI/Mistral)
- Validation Zod
- Retry auto-correction
- Timeout strict (15s)
- Abort signal support

#### 3. callLlmStrict (voice-interview/core/llm-strict.ts)

```typescript
export async function callLlmStrict<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodSchema<T>,
  schemaDescription: string,
  maxRetries = 2,
  options?: { signal?: AbortSignal }
): Promise<T>
```

**Responsabilité**
- Appel LLM strict pour scoring
- Validation Zod
- Retry avec feedback d'erreur
- Timeout 15s
- Abort signal support

---

### Frontend Functions

#### 1. generateText (openai.ts)

```typescript
export async function generateText(
  prompt: string,
  maxTokens = 1000,
): Promise<AIResponse<string>>
```

**Responsabilité**
- Génération de texte simple
- Modèle gpt-4o-mini
- Temperature 0.7
- Timeout 30s
- Max retries 2

#### 2. generateJSON (openai.ts)

```typescript
export async function generateJSON<T>(
  prompt: string,
  maxTokens = 1500,
): Promise<AIResponse<T>>
```

**Responsabilité**
- Génération JSON
- Modèle gpt-4o-mini
- Temperature 0.3
- Response format json_object
- Timeout 30s
- Max retries 2

#### 3. buildATSPrompt (prompts.ts)

```typescript
export function buildATSPrompt(
  resumeText: string,
  jobDescription: string,
): string
```

**Responsabilité**
- Construire le prompt ATS
- Ajouter CV + job description

#### 4. buildCVOptimizePrompt (prompts.ts)

```typescript
export function buildCVOptimizePrompt(
  cvText: string,
  jobDescription?: string,
): string
```

**Responsabilité**
- Construire le prompt CV optimization
- Ajouter CV + job description (optionnel)

#### 5. generateRecruiterPrompt (prompt-builder.ts)

```typescript
export async function generateRecruiterPrompt({
  persona,
  state,
  analysis,
  strategy,
  userAnswer,
}: PromptInputs): Promise<string>
```

**Responsabilité**
- Générer la réponse du recruteur
- Utiliser Mistral
- Intégrer persona + state + analysis + strategy

#### 6. buildPrompt (AdvancedPromptBuilder.ts)

```typescript
buildPrompt(context: PromptBuildContext): BuiltPrompt
```

**Responsabilité**
- Construire le prompt multi-layer
- 11 layers avec priorité
- Estimation des tokens
- Versioning

---

## Outils

### Gateway

- **Aucun outil** : Appel direct OpenAI/Mistral

### Frontend

- **AI SDK** : `@ai-sdk/mistral`, `ai`
- **OpenAI SDK** : `openai`
- **Zod** : Validation des réponses

---

## Appels

### Gateway

#### 1. LLM Strict (llm-strict.ts)

**Endpoint** : `https://api.openai.com/v1/chat/completions` ou `https://api.mistral.ai/v1/chat/completions`

**Modèles**
- OpenAI : `gpt-4o-mini` (défaut) ou `gpt-4o`
- Mistral : `mistral-small-latest`

**Configuration**
- Temperature : 0.3
- Response format : `{ type: "json_object" }`
- Timeout : 15s
- Max retries : 1 (auto-correction Zod)
- Fallback : OpenAI → Mistral

#### 2. LLM Strict (voice-interview/core/llm-strict.ts)

**Endpoint** : `https://api.openai.com/v1/chat/completions` ou `https://api.mistral.ai/v1/chat/completions`

**Modèles**
- OpenAI : `gpt-4o` (défaut)
- Mistral : `mistral-large-latest` (si configuré)

**Configuration**
- Temperature : 0.2
- Response format : `{ type: "json_object" }`
- Timeout : 15s
- Max retries : 2
- Abort signal : Supporté

---

### Frontend

#### 1. generateText (openai.ts)

**Endpoint** : `https://api.openai.com/v1/chat/completions`

**Modèle** : `gpt-4o-mini`

**Configuration**
- Temperature : 0.7
- Max tokens : 1000
- Timeout : 30s
- Max retries : 2

#### 2. generateJSON (openai.ts)

**Endpoint** : `https://api.openai.com/v1/chat/completions`

**Modèle** : `gpt-4o-mini`

**Configuration**
- Temperature : 0.3
- Response format : `{ type: "json_object" }`
- Max tokens : 1500
- Timeout : 30s
- Max retries : 2

#### 3. generateRecruiterPrompt (prompt-builder.ts)

**Endpoint** : Mistral API

**Modèle** : `mistral-large-latest`

**Configuration**
- AI SDK
- Temperature : Défaut
- Timeout : Défaut

---

## Modèles

### Gateway

| Modèle | Provider | Usage | Temperature | Max Tokens |
|--------|----------|-------|-------------|------------|
| gpt-4o-mini | OpenAI | Défaut | 0.3 | Variable |
| gpt-4o | OpenAI | Configurable | 0.2 | Variable |
| mistral-small-latest | Mistral | Fallback | 0.3 | Variable |

### Frontend

| Modèle | Provider | Usage | Temperature | Max Tokens |
|--------|----------|-------|-------------|------------|
| gpt-4o-mini | OpenAI | Génération texte/JSON | 0.7 / 0.3 | 1000 / 1500 |
| mistral-large-latest | Mistral | Interview | Défaut | Variable |
| mistral-small-latest | Mistral | ATS | Défaut | Variable |

---

## Tokens

### Estimations

**Gateway**
- Prompt minimaliste : ~50 tokens
- LLM strict : ~200-500 tokens (variable)
- Total par appel : ~250-550 tokens

**Frontend**
- ATS prompt : ~300 tokens + CV + Job
- CV optimize prompt : ~250 tokens + CV + Job
- Interview prompt : ~150 tokens + Persona + State + Answer
- Advanced prompt : ~1000-2000 tokens (11 layers)

**Coûts estimés** (gpt-4o-mini)
- Input : $0.00015 / 1K tokens
- Output : $0.00060 / 1K tokens
- Par appel : ~$0.0001 - $0.001

---

## Erreurs

### Types d'erreurs

1. **LLM_TIMEOUT** : Timeout 15s dépassé
2. **Invalid JSON** : Réponse non parseable en JSON
3. **Zod validation error** : Réponse ne match pas le schéma
4. **API error** : Erreur API (4xx, 5xx)
5. **Missing API key** : Clé API manquante
6. **AbortError** : Session abortée

### Gestion des erreurs

**Gateway (llm-strict.ts)**
- Retry auto-correction : 1 tentative
- Fallback OpenAI → Mistral
- Abort signal support
- Logging des erreurs

**Frontend (openai.ts)**
- Max retries : 2
- Timeout : 30s
- Error propagation

---

## Retries

### Gateway

**llm-strict.ts**
- Max retries : 1 (auto-correction Zod)
- Strategy : Réinjection des erreurs Zod
- Fallback : OpenAI → Mistral

**voice-interview/core/llm-strict.ts**
- Max retries : 2
- Strategy : Réinjection des erreurs Zod
- Timeout : 15s par tentative

### Frontend

**openai.ts**
- Max retries : 2
- Strategy : Retry automatique
- Timeout : 30s

---

## Sessions

### Gateway

- **Session management** : `session-manager.ts`
- **Session storage** : In-memory
- **Session lifecycle** : Create → Update → Remove
- **Session data** : State, history, metrics

### Frontend

- **Session management** : Supabase
- **Session storage** : Database
- **Session lifecycle** : Create → Update → Complete
- **Session data** : Transcript, events, metrics

---

## Conclusion

### Points forts

1. **Multi-provider** : OpenAI + Mistral avec fallback
2. **Validation stricte** : Zod avec retry auto-correction
3. **Timeout strict** : 15s pour éviter les appels longs
4. **Abort signal** : Support pour annulation immédiate
5. **Advanced prompt builder** : 11 layers avec priorité

### Points faibles

1. **Pas de Prompt Orchestrator** : Pas de séparation claire entre construction et orchestration
2. **Pas de Context Builder** : Pas de filtrage intelligent du contexte
3. **Pas de AI Guard** : Pas de validation des réponses avant envoi
4. **Pas de versioning** : Pas de versioning des prompts
5. **Pas de monitoring** : Pas de métriques détaillées sur les appels OpenAI

### Recommandations

1. **Implémenter Prompt Orchestrator** : Séparer la construction de l'orchestration
2. **Implémenter Context Builder** : Filtrer intelligemment le contexte
3. **Implémenter AI Guard** : Valider les réponses avant envoi
4. **Versionner les prompts** : A/B testing et rollback
5. **Ajouter le monitoring** : Métriques détaillées sur les appels OpenAI

**Prochaine phase** : Audit Audio
