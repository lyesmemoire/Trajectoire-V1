# Sprint 6.4 — Heavy Routes Bundle Audit (ROI First)

## Phase 0 — Inventaire : Top 15 Routes les plus lourdes

| Rang | Route | First Load JS (Total) | First Load JS (Propre) | Shared JS |
|------|-------|-----------------------|------------------------|-----------|
| 1 | `/dashboard/career-copilot` | **410 kB** | 99.8 kB | 103 kB + chunks dynamiques |
| 2 | `/dashboard/interview-simulation` | **351 kB** | 21.5 kB | 103 kB + chunks dynamiques |
| 3 | `/dashboard/profile` | **323 kB** | 3.02 kB | 103 kB + dynamiques |
| 4 | `/dashboard/optimize` | **318 kB** | 4.92 kB | 103 kB + dynamiques |
| 5 | `/dashboard/ats` | **307 kB** | 6.9 kB | 103 kB + dynamiques |
| 6 | `/dashboard` | **251 kB** | 28.7 kB | 103 kB + dynamiques |
| 7 | `/dashboard/cvs` | **245 kB** | 13.4 kB | 103 kB + dynamiques |
| 8 | `/admin/health` | **235 kB** | 7.0 kB | 103 kB + dynamiques |
| 9 | `/waitlist` | **232 kB** | 4.29 kB | 103 kB + dynamiques |
| 10 | `/cv-editor` | **231 kB** | 3.23 kB | 103 kB + dynamiques |
| 11 | `/admin/recovery-dashboard` | **230 kB** | 2.68 kB | 103 kB + dynamiques |
| 12 | `/dashboard/billing` | **230 kB** | 1.78 kB | 103 kB + dynamiques |
| 13 | `/cv` | **225 kB** | 3.14 kB | 103 kB + dynamiques |
| 14 | `/onboarding` | **224 kB** | 5.49 kB | 103 kB + dynamiques |
| 15 | `/admin` | **224 kB** | 1.82 kB | 103 kB + dynamiques |

---

## Phase 1 — Focus sur les 2 plus lourdes

### 1. `/dashboard/career-copilot` (410 kB)
- **Arbre complet des imports** : `page.tsx` (RSC) → `dynamic(CareerCopilotChat)` (Client) → `CareerCopilotConversationEngine` (Backend).
- **Composants principaux** : `career-copilot-chat.tsx` (63 kB), `career-forecast.tsx` (55 kB), `planning-intelligence.tsx` (51 kB).
- **Le problème majeur (Leak)** : Le moteur `CareerCopilotConversationEngine.ts` (41 kB source) est importé **directement** dans le composant client `career-copilot-chat.tsx`. Tout le code de prompts, d'orchestration AI et de logique backend est injecté dans le navigateur.

### 2. `/dashboard/interview-simulation` (351 kB)
- **Arbre complet des imports** : `page.tsx` (Client) → Hook `useInterviewReport.ts` (Client) → `InterviewAnalyzerAIEngine`, `ExecutiveSummaryAIEngine`, `DecisionEstimationAIEngine` (Backend).
- **Composants principaux** : `InterviewTimeline.tsx`, `LanguageAnalysis.tsx`, `STARAnalysis.tsx`.
- **Le problème majeur (Leak)** : La génération des rapports d'entretien est effectuée directement sur le client via un Hook React, ce qui force Webpack à embarquer l'intégralité des classes AI (`core/intelligence/engines/*`) dans le First Load JS.

---

## Phase 2 — Décomposition des bundles (Estimations First Load JS)

| Package / Module | Taille estimée | % du bundle excessif | Explication |
|------------------|----------------|-----------------------|-------------|
| **AI Engines (Backend)** | ~120 kB | 40% | Conséquence des imports directs d'engines serveur vers des composants `"use client"`. |
| **framer-motion** | ~35 kB | 15% | Utilisé systématiquement via `import { m }` dans 100% des sous-composants. |
| **Code Métier (UI)** | ~100 kB | 30% | La taille massive du code source des composants (50 à 60 kB chacun). |
| **Supabase Client** | ~20 kB | 10% | Présent dans de nombreux Hooks (ex: `useCandidateGraph`). |
| **lucide-react** | ~10 kB | 5% | Optimisé nativement, mais les centaines d'icônes gardent une empreinte. |

*Note: `recharts` et `@react-pdf` ne sont pas responsables sur ces deux routes, ils n'apparaissent pas dans l'arbre principal First Load.*

---

## Phase 3 — Analyse des composants (Top Costly)

| Composant | Taille (Source) | Lazy ? | SSR ? | RSC ? |
|-----------|-----------------|--------|-------|-------|
| `career-copilot-chat.tsx` | 63.9 kB | Oui | Oui | ❌ Non (`"use client"`) |
| `career-forecast.tsx` | 55.3 kB | Oui | Oui | ❌ Non |
| `planning-intelligence.tsx` | 51.8 kB | Oui | Oui | ❌ Non |
| `careerCopilotConversationEngine.ts` | 41.1 kB | Non | N/A | ❌ Backend Leaké |
| `progression-plan.tsx` | 38.4 kB | Oui | Oui | ❌ Non |
| `career-narrative-intelligence.tsx` | 38.6 kB | Oui | Oui | ❌ Non |
| `useInterviewReport.ts` (Hook) | 20.5 kB | Non | N/A | ❌ Non (Importe l'IA) |

---

## Phase 4 — Opportunités par Composant

| Composant / Problème | Classification | Gain Estimé (First Load) | Hydratation |
|----------------------|----------------|--------------------------|-------------|
| **Fuite AI (useInterviewReport)** | 🟢 Quick Win | **-60 kB** JS | 🟢 Forte baisse |
| **Fuite AI (CareerCopilotChat)** | 🟢 Quick Win | **-40 kB** JS | 🟢 Baisse CPU |
| **Monolithes React (UI lourde)** | 🟡 Moyen | -30 kB JS | 🟡 Moyenne |
| **Framer Motion (`m`) abusif** | 🟡 Moyen | -15 kB JS | 🟢 Baisse CPU |
| **Data Fetching Client-side** | 🔴 Faible ROI | -10 kB JS | 🟡 Moyenne |

---

## Phase 5 — Plan : Top 10 Optimisations (Roadmap Sprint 6.4 → 6.8)

### Sprint 6.4 : Arrêter les fuites (ROI Immense)

1. **[PR 6.4.1] Refactorisation `useInterviewReport.ts` (Simulation)**
   - **Objectif** : Retirer tous les imports de `core/intelligence/engines/` du Hook React.
   - **Fichiers** : `useInterviewReport.ts`, création de `app/api/interview/report/route.ts`.
   - **Gain estimé** : ~60 kB JS. **Risque** : Faible. **Temps** : 2h.

2. **[PR 6.4.2] Refactorisation `CareerCopilotChat` (Copilot)**
   - **Objectif** : Déplacer l'appel à `CareerCopilotConversationEngine` vers un endpoint API / Server Action.
   - **Fichiers** : `career-copilot-chat.tsx`, `app/api/...`
   - **Gain estimé** : ~40 kB JS. **Risque** : Moyen (State management du chat). **Temps** : 3h.

3. **[PR 6.4.3] Audit Dashboard ATS (307 kB)**
   - **Objectif** : Identifier pourquoi `ats/client.tsx` pèse lourd (fuite AI similaire ou librairie tierce ?).
   - **Risque** : N/A (Investigation). **Temps** : 1h.

### Sprints Suivants (6.5 → 6.8)

4. **[PR 6.5.1] RSC Migration des Data Loaders**
   - Transférer `useCandidateGraph` vers le serveur dans `page.tsx` et passer les données en pur JSON aux composants clients.
5. **[PR 6.5.2] Nettoyage Framer Motion**
   - Remplacer les animations d'opacité simples par des classes Tailwind `animate-in fade-in`.
6. **[PR 6.6.1] Virtualisation des composants Copilot**
   - Rendre les gros composants (Planning, Forecast) asynchrones ou activables au scroll (Intersection Observer).
7. **[PR 6.6.2] Nettoyage Dashboard Profile**
8. **[PR 6.7.1] Optimisation des formulaires lourds**
9. **[PR 6.7.2] Nettoyage Lucide-react (spritesheet)**
10. **[PR 6.8.1] Amélioration du LCP sur les pages simulées**
