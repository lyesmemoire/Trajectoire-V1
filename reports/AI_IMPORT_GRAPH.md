# AI Import Graph

## Objectif
Reconstruire l'arbre complet des dépendances pour chaque domaine afin d'identifier précisément l'endroit où la frontière serveur est rompue.

---

## 1. Graphe d'import compromis : Career Copilot

Ce graphe illustre la chaîne d'inclusion responsable de la taille massive de la page `/dashboard/career-copilot`.

```mermaid
flowchart TD
    UI[Page RSC: app/dashboard/career-copilot/page.tsx]
    CC[Client Component: components/dashboard/career-copilot-chat.tsx]
    Engine1[AI Engine: CareerCopilotConversationEngine]
    Engine2[AI Engine: CareerCopilotNarrativeIntelligenceEngine]
    Prompt[Prompt: careerCopilotConversationV1]
    Orchestrator[LLM Provider: AIOrchestrator]
    LLM[API: Anthropic Claude / OpenAI]

    UI -- "next/dynamic()" --> CC
    CC -- "import { ... }" --> Engine1
    CC -- "await import(...)" --> Engine2
    Engine1 -- "import" --> Prompt
    Engine1 -- "import" --> Orchestrator
    Orchestrator -- "fetch()" --> LLM
```

**Point de rupture** : L'import depuis `career-copilot-chat.tsx` (marqué `"use client"`) vers `core/intelligence/engines/*`. En important statiquement et dynamiquement les moteurs depuis l'UI, Webpack inclut tout le sous-graphe (Prompts, Orchestrator, Zod, etc.) dans le bundle client.

---

## 2. Graphe d'import compromis : Interview Simulation

Ce graphe illustre comment la génération du rapport de fin d'entretien pollue le First Load JS.

```mermaid
flowchart TD
    UI[Client Component: app/dashboard/interview-simulation/page.tsx]
    Hook[Client Hook: hooks/useInterviewReport.ts]
    Engine1[AI Engine: InterviewAnalyzerAIEngine]
    Engine2[AI Engine: ExecutiveSummaryAIEngine]
    Prompt[Prompt: interviewAnalysisV1]
    Orchestrator[LLM Provider: AIOrchestrator]

    UI -- "import" --> Hook
    Hook -- "import" --> Engine1
    Hook -- "import" --> Engine2
    Engine1 -- "import" --> Prompt
    Engine1 -- "import" --> Orchestrator
```

**Point de rupture** : Le hook custom `useInterviewReport.ts` est consommé par un Client Component. Il importe directement les moteurs d'IA pour exécuter l'analyse localement (ce qui déclenche l'appel réseau vers l'API du LLM depuis le client ou depuis une route générique `AIOrchestrator`, mais toute la logique de prompt reste côté client).

---

## 3. Graphe d'import valide : ATS (Référence)

Ce graphe illustre l'architecture correcte utilisée sur d'autres parties de l'application (ex: Dashboard ATS).

```mermaid
flowchart TD
    UI[Client Component: dashboard/ats/client.tsx]
    ServerAction[Server Action: dashboard/ats/actions.ts]
    Engine[AI Engine: ATSAIEngine]
    Prompt[Prompt: atsAnalysisV1]
    Orchestrator[LLM Provider: AIOrchestrator]

    UI -- "await runATSAnalysis()" --> ServerAction
    ServerAction -- "import" --> Engine
    Engine -- "import" --> Prompt
    Engine -- "import" --> Orchestrator
```

**Explication** : La frontière est fermée par le fichier `actions.ts` contenant la directive `"use server"`. Le composant client ne connaît que la signature de la Server Action. Webpack crée un point d'entrée RPC et **n'inclut pas** le graphe sous-jacent dans le bundle client.
