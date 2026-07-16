# AI Bundle Analysis

## Objectif
Analyser les bundles Webpack générés dans `.next/static/chunks` pour comprendre précisément pourquoi et comment les modules IA sont embarqués côté client.

---

## 1. Composition des Chunks Client (Analyse de la Build)

L'audit des chunks produits par Next.js (ex: `1089.dc34906941a76cec.js` pesant 48.5 kB minifié) démontre que plusieurs modules IA internes, y compris des prompts et des moteurs, sont actuellement inclus dans des bundles client. Les chaînes d'import identifiées expliquent précisément cette inclusion.

### Contenu identifié dans les chunks JS du navigateur :
- Code source de la classe `CareerCopilotConstraintIntelligenceEngine`.
- Définition complète des Prompts (ex: *"You are the Career Mission Intelligence engine..."*).
- Code de l'orchestrateur `AIOrchestrator` gérant la logique d'appel LLM.
- Les parsers Zod ou schémas de validation associés aux prompts.

### Pourquoi Webpack inclut-il ces modules ?

Next.js utilise une analyse statique de l'arbre d'import pour déterminer la limite Client/Serveur. Webpack embarque ces modules pour deux raisons majeures identifiées dans le code :

#### Raison 1 : Import statique depuis un fichier "use client"
Dans `hooks/useInterviewReport.ts`, on trouve :
```typescript
import { InterviewAnalyzerAIEngine } from "@/core/intelligence/engines/interviewAnalyzerAIEngine";
```
Le hook étant appelé par la page client `interview-simulation/page.tsx`, Webpack est obligé de transcompiler `InterviewAnalyzerAIEngine` (et toutes ses dépendances récursives) en Javascript frontend pour que la fonction puisse s'exécuter dans le navigateur.

#### Raison 2 : Import dynamique (Lazy Loading Client)
Dans `career-copilot-chat.tsx` (ligne 539), on trouve :
```typescript
import("@/core/intelligence/engines/careerCopilotAutonomousIntelligenceEngine"),
import("@/core/intelligence/engines/careerCopilotOutcomeIntelligenceEngine"),
...
```
Bien qu'asynchrones, ces imports dynamiques s'exécutent dans une fonction client (`submitMessage`). Webpack génère donc un chunk séparé (ex: `1089.*.js`) contenant ces moteurs. Ce chunk sera téléchargé par le navigateur au moment où la fonction est déclenchée. Le poids global (410 kB First Load) inclut ces chunks dynamiques car ils sont critiques pour la route.

---

## 2. Dépendances transitives embarquées

En forçant l'inclusion des Moteurs d'IA, le bundle client subit l'inclusion en chaîne de toutes leurs dépendances transitives :
1. **Les Prompts** : De lourdes chaînes de caractères (jusqu'à 1000 lignes de contexte) chargées en mémoire navigateur.
2. **Les Schémas de validation (Zod)** : Logique de validation de sortie du LLM.
3. **Le SDK d'Intelligence** : Tout SDK importé par `AIOrchestrator` ou `EventBus`.

### Conclusion
Ces modules ne sont **pas des modules partagés** intentionnels, mais une **fuite directe** causée par le non-respect de la frontière Client/Serveur. L'UI (React) appelle directement la logique d'orchestration AI, au lieu de communiquer avec un backend par RPC / HTTP.
