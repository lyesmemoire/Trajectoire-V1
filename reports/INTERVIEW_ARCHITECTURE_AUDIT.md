# Audit d'architecture — Interview Simulator

**Date :** 2026-07-13  
**Périmètre :** phase 1 uniquement — aucun code applicatif n'a été modifié.

## Conclusion

La fuite d'architecture est **confirmée**. Elle ne repose pas sur une simple présence ambiguë dans un chunk ni sur un défaut supposé de tree-shaking : la page `"use client"` de la simulation importe des hooks qui importent eux-mêmes des engines IA. Ces imports sont statiques et atteignent transitivement l'orchestrateur, les providers HTTP et sept prompts. Ils sont donc dans le graphe client au moment de la compilation.

La migration doit remplacer cette exécution locale par une unique frontière HTTP streaming : `POST /api/interview/chat` -> use case -> context builder -> engine -> provider. Les composants ne doivent conserver que l'état de présentation et `useChat()`.

## Méthode et limites

- Analyse statique avec `madge` et `tsconfig.json` : **135 modules** atteints depuis la page Interview.
- Recherche des imports directs, des imports dynamiques et des appels `/api/interview` dans l'UI.
- Lecture des routes Interview, du domaine `lib/interview` et du domaine Career Copilot de référence.
- Lecture des rapports de bundle existants ; aucune reconstruction de `.next` n'a été lancée, afin de ne pas mélanger les artefacts dans un arbre de travail déjà très modifié.

Les tailles ci-dessous sont donc une **baseline existante**, pas une mesure fraîche de l'état Git courant. Le graphe d'import, lui, a été vérifié sur les sources présentes.

## Surface auditée

### Entrée client

`app/(app)/dashboard/interview-simulation/page.tsx` est une page client. Elle charge :

- `useInterviewConversation`
- `useInterviewEvaluation`
- `useInterviewReport`
- `useRecruiterBehavior`
- `useAuthUser` et `useCandidateGraph` depuis `core/intelligence`

Les hooks n'ont pas nécessairement leur propre directive `"use client"`, mais ils sont dans la clôture d'import de cette page : ils sont donc exécutables et bundlés côté navigateur.

Les seuls imports dynamiques relevés sont les 14 composants de rendu du rapport (`ReportHero`, `GlobalScore`, `QuestionAnalysis`, etc.). Ils découpent la présentation en chunks différés ; aucun import dynamique IA n'a été trouvé dans la surface Interview. Ils ne sont pas la cause de la fuite.

### Composants client déclarés

Sept composants de la surface Interview déclarent `"use client"` :

- `components/interview/SpeechFeedback.tsx`
- `components/interview/CommitteeDecisionReveal.tsx`
- `components/interview/pressure-meter.tsx`
- `components/interview/persona-selector.tsx`
- `components/interview/InterviewResults.tsx`
- `components/interview/mobile/MobileVoiceInterface.tsx`
- `app/(app)/dashboard/interview-simulation/page.tsx`

Les composants et hooks importés par la page participent aussi au graphe client même lorsqu'ils ne déclarent pas eux-mêmes cette directive.

### Routes disponibles

Neuf Route Handlers existent sous `app/api/interview/` : `analyze`, `feedback`, `generate`, `history`, `orchestrate`, `premium/continue`, `premium/report`, `start` et `transcribe`. La route cible `app/api/interview/chat/route.ts` n'existe pas.

`generate/route.ts` possède déjà un flux AI SDK (`streamText()` puis `toTextStreamResponse()`), mais l'UI auditée ne contient aucun `fetch()` vers `/api/interview` ni aucun `useChat()`. Cette route n'est donc pas la frontière utilisée par la simulation actuelle. Elle construit en outre son prompt et appelle le modèle directement, sans le use case et les ports attendus.

`orchestrate/route.ts` utilise un use case existant et un presenter, mais la réponse est JSON non streamée et la route construit/résout ses dépendances via le conteneur global ; elle ne satisfait pas le contrat du futur chat.

## Graphe d'import vérifié

```text
page.tsx (Client)
├─ useInterviewConversation.ts
│  ├─ RecruiterQuestionAIEngine
│  │  ├─ AIOrchestrator
│  │  │  ├─ OpenAIProvider / AnthropicProvider / MockProvider
│  │  │  └─ fetch() vers les APIs fournisseur
│  │  └─ recruiter-question-v1 (prompt)
│  └─ CandidateAIBrain
│     └─ EventBus + mémoire + client Supabase
├─ useInterviewReport.ts
│  ├─ InterviewAnalyzerAIEngine
│  │  ├─ AIOrchestrator
│  │  └─ interview-analysis-v1, communication-analysis-v1,
│  │     leadership-analysis-v1 (prompts)
│  ├─ ExecutiveSummaryAIEngine -> executive-summary-v1 (prompt)
│  ├─ DecisionEstimationAIEngine -> decision-estimation-v1 (prompt)
│  └─ RecruiterNotesAIEngine -> recruiter-notes-v1 (prompt)
├─ useInterviewEvaluation.ts
│  └─ ScoreEngine
└─ useAuthUser / useCandidateGraph
   └─ core/intelligence + client Supabase
```

### Imports statiques responsables

| Source client | Import interdit par le standard | Conséquence directe |
| --- | --- | --- |
| `hooks/useInterviewConversation.ts` | `RecruiterQuestionAIEngine`, `candidateAIBrain` | engine, prompt, orchestrateur et état IA deviennent atteignables depuis le navigateur |
| `hooks/useInterviewReport.ts` | `InterviewAnalyzerAIEngine`, `ExecutiveSummaryAIEngine`, `DecisionEstimationAIEngine`, `RecruiterNotesAIEngine` | quatre engines et six prompts de rapport entrent dans le graphe client |
| `hooks/useInterviewEvaluation.ts` | `ScoreEngine` | violation de frontière ; `ScoreEngine` importe aussi les types de la page UI |
| `page.tsx` | `useAuthUser`, `useCandidateGraph` depuis `core/intelligence` | violation de la règle « 0 import core/intelligence » et accroissement du graphe client |

Le point important est que les engines ne sont pas simplement présents dans un module partagé : ils sont importés par des hooks effectivement appelés dans une page client. La transivité est attestée par le graphe `madge` et par les imports des engines vers `AIOrchestrator` et leurs prompts respectifs.

## Violations et risques

1. **P0 — logique IA dans le navigateur.** Les cinq engines IA sont importés directement par les hooks de la page client.
2. **P0 — prompts exposables.** Les prompts de question, analyse, communication, leadership, résumé exécutif, décision et notes recruteur sont accessibles transitivement depuis ces imports.
3. **P0 — providers exposés dans le graphe client.** `AIOrchestrator` instancie les providers OpenAI, Anthropic et Mock ; `OpenAIProvider` et `AnthropicProvider` effectuent leurs appels avec `fetch()`.
4. **P1 — fuite de couche métier.** `ScoreEngine` dépend de `app/(app)/dashboard/interview-simulation/types/interview`, ce qui inverse le sens de dépendance du coeur vers l'UI.
5. **P1 — surface HTTP fragmentée.** Les routes actuelles répartissent prompts, SDK, auth, persistance et orchestration dans plusieurs endpoints ; aucune ne matérialise le contrat de conversation cible.
6. **P1 — garde-fou insuffisant.** La règle `ui-ai-isolation` de `.dependency-cruiser.cjs` ne couvre que les chemins commençant par `components/` ou `hooks/`, alors que les hooks de cette page vivent sous `app/(app)/...`. Elle exclut aussi explicitement `useInterviewReport.ts`. Elle ne peut donc pas empêcher la violation observée.

## Mesure de bundle et interprétation

La baseline `build_output_baseline.txt` mesure `/dashboard/interview-simulation` à **21.5 kB de code route** et **351 kB de First Load JS**. `BUNDLE_FORENSICS.md` relève pour son chunk de page `18.84 kB gzip` / `73.39 kB parsed`.

Les rapports antérieurs corroborent la cause :

- `reports/AI_BUNDLE_ANALYSIS.md` documente l'import de `InterviewAnalyzerAIEngine` par `useInterviewReport` et l'inclusion de ses dépendances récursives.
- `reports/SPRINT6_4_AI_BUNDLE_PROOF.md` attribue environ **30 kB minifiés** aux moteurs de rapport et à `AIOrchestrator`, hors coût complet des prompts et dépendances partagées.

Ces documents ne suffisent pas seuls à prouver un build courant, mais les imports statiques actuels confirment le mécanisme. La mesure post-migration devra être faite sur un `.next` nettoyé, avec un seul build de production, puis comparée à cette baseline de 351 kB.

## Écart avec le standard AI Domain

| Élément attendu | État actuel | Décision de migration |
| --- | --- | --- |
| `domain/contracts` stricts | types UI et contrats fragmentés | créer les contrats Interview indépendants de React/HTTP |
| `domain/ports` | ports dispersés à `lib/interview/ports` | définir `InterviewEnginePort`, `InterviewContextBuilderPort`, `LLMProviderPort` dans `domain/ports` |
| `InterviewConversationUseCase` | use cases `start` et `orchestrate-step` non streamés | créer un use case dédié, sans Next/React/SDK |
| Context Builder | absent pour le chat cible | créer `SupabaseInterviewContextBuilder` en infrastructure |
| Conversation Engine streamé | logique répartie dans hooks, engines et routes | créer `InterviewEngine` côté serveur |
| Composition locale | module/conteneur global existant | créer `composition/interview.factory.ts` |
| `POST /api/interview/chat` | absent | route mince : auth, validation, use case, adapter, streaming |
| UI via `useChat()` | absent ; aucun appel HTTP Interview relevé | remplacer les imports IA par un client AI SDK |

## Validation de phase

- Analyse d'import : **OK** — 135 modules cartographiés.
- Exécution de `pnpm test:architecture` : **échec préexistant** avec 76 violations, principalement des cycles hors périmètre Interview. Ce contrôle ne constitue pas une porte de qualité exploitable pour cette migration en l'état ; aucune modification n'a été faite pour le masquer.
- Build, typecheck et tests fonctionnels : **non exécutés** en phase d'audit, car aucun code n'a changé et l'arbre de travail contient déjà de nombreuses modifications/suppressions indépendantes. Une future validation devra partir d'un `.next` nettoyé, conformément au protocole du projet.

## Recommandation

Choisir la migration complète vers le standard AI Domain, en conservant le streaming AI SDK dans `InterviewStreamAdapter`. Ne pas corriger cette fuite par des `dynamic()` supplémentaires : ils ne changeraient pas la frontière client, ne protégeraient pas les prompts et ne résoudraient pas la responsabilité mélangée des hooks.

La prochaine phase recommandée est **Phase 2 — contrats et ports uniquement**. Elle ne doit toucher ni Career Copilot, ni les composants UI, ni les routes existantes. Après validation, chaque couche suivante pourra être migrée et testée séparément.

