# MIGRATION REGISTER
**Date** : 18 juillet 2026
**Scope** : Imports inter-apps

---

## TABLEAU DES IMPORTS INTER-APPS

| Fichier | Importe quoi | Destination | Critique | Remplaçable |
|---------|--------------|-------------|----------|-------------|
| apps/web/src/core/p7/trace-contract.ts | RuntimeTrace, TurnTrace | apps/realtime-gateway/src/runtime/collector/runtime-trace.js | OUI | OUI (types placeholder créés) |
| src/chaos/attacks/AttackRunner.ts | RuntimeOrchestrator | apps/realtime-gateway/src/voice-interview/runtime/fsm/orchestrator/RuntimeOrchestrator | NON | NON (module chaos engineering) |
| src/control-plane/RuntimeControlPlane.ts | HealingEngine | apps/realtime-gateway/src/voice-interview/runtime/fsm/distributed/healing/HealingEngine | NON | NON (module control plane) |
| src/replay/ReplayEngine.ts | (à vérifier) | apps/realtime-gateway | NON | NON (module replay) |
| packages/arena-engine/src/db/index.ts | @trajectoire/arena-engine | packages/arena-engine | NON | NON (auto-référence) |
| scripts/fix-imports.ts | @trajectoire/arena-engine | packages/arena-engine | NON | NON (script utilitaire) |

---

## IMPORTS RELATIFS INTER-APPS (tests uniquement)

| Fichier | Importe quoi | Destination | Critique | Remplaçable |
|---------|--------------|-------------|----------|-------------|
| apps/web/src/core/p6/orchestrator/tests/determinism.test.ts | ExecutionFacade, MindState, RuntimeDecision | apps/web/src/core/p5/* | NON | OUI (tests internes) |
| apps/web/src/core/p6/orchestrator/tests/happy-path.test.ts | ExecutionFacade, MindState, RuntimeDecision | apps/web/src/core/p5/* | NON | OUI (tests internes) |
| apps/web/src/core/p6/orchestrator/tests/lifecycle.test.ts | ExecutionFacade, RuntimeDecision | apps/web/src/core/p5/* | NON | OUI (tests internes) |
| apps/web/src/core/p6/orchestrator/tests/orchestration.test.ts | ExecutionFacade, MindState, RuntimeDecision | apps/web/src/core/p5/* | NON | OUI (tests internes) |
| apps/web/src/core/p6/orchestrator/tests/failure-path.test.ts | ExecutionFacade, RuntimeDecision | apps/web/src/core/p5/* | NON | OUI (tests internes) |
| apps/web/src/hiios/knowledge/skills/ownership/ownership.ts | EvidenceLevel | apps/web/src/core/constitution | NON | OUI (import relatif interne) |
| apps/web/src/hiios/knowledge/skills/leadership/leadership.ts | EvidenceLevel | apps/web/src/core/constitution | NON | OUI (import relatif interne) |
| apps/web/src/application/hiios/formatters/ReportFormatter.fr.ts | fr | apps/web/src/i18n/fr | NON | OUI (import relatif interne) |

---

## RÉSUMÉ

**Imports inter-apps critiques** : 1
- apps/web/src/core/p7/trace-contract.ts → apps/realtime-gateway

**Imports inter-apps non critiques** : 4
- src/chaos/attacks/AttackRunner.ts
- src/control-plane/RuntimeControlPlane.ts
- src/replay/ReplayEngine.ts
- packages/arena-engine/src/db/index.ts

**Imports relatifs internes** : 8 (tests et modules internes apps/web)

---

## STATUT

**Imports vers legacy/** : 0
**Imports vers arena-engine/** : 0 (hors auto-référence)
**Imports vers apps/realtime-gateway/** : 1 critique + 3 non critiques

---

## MIGRATION L2.2 — API CV Upload/Analyze

### Étape 1 — Correction /api/cv/analyze

| Fichier | Statut | Note |
|---------|--------|------|
| apps/web/src/app/api/cv/analyze/route.ts | ✅ Corrigé | Code billing cassé supprimé (lignes 93-112) |

**Décision documentée** :
- Raison : Variables billing non définies, Stripe non câblé (L1.1 Waiting External Dependency)
- Action : Suppression du code billing non fonctionnel
- TODO : Réintégrer checkSubscription() quand L1.1 = DONE
- Impact : La route fonctionne sans vérification d'abonnement pour la V1

### Étape 2 — Création /api/cv/upload

| Fichier | Statut | Note |
|---------|--------|------|
| apps/web/src/app/api/cv/upload/route.ts | ✅ Créé | Nouvelle route, pas de source legacy |

**Décision documentée** :
- Raison : Legacy n'a pas de route /api/cv/upload séparée
- Legacy utilise : /api/product/upload (non spécialisé CV)
- Référence : Comportement aligné sur /api/product/upload
- Extraction : pdf-parse + pdfjs-dist (fallback)
- Types acceptés : PDF, TXT, DOCX
- Taille max : 8 Mo

### Étape 3 — Choix du modèle LLM

| Décision | Raison |
|----------|--------|
| Mistral utilisé | Legacy et apps/web utilisent Mistral |
| OpenAI non utilisé | WAR ROOM mentionnait OpenAI par défaut générique |

**Décision documentée** :
- Suivre ce qui existe : Mistral
- Le WAR ROOM était une spécification générique, pas une loi
- Parité avec legacy maintenue

### Étape 4 — Structure BDD

| Table | Statut | Note |
|-------|--------|------|
| CVAnalysis | ✅ Utilisée | Sauvegarde analyse CV |
| CareerProfile | ✅ Utilisée | Sauvegarde profil carrière pour HIIOS |

**Décision documentée** :
- Schéma Prisma existant utilisé
- hiiosContext retourné dans la réponse pour HIIOS

---

## RÉSUMÉ MIGRATION L2.2

**Routes créées/corrigées** : 2
- /api/cv/upload (nouvelle)
- /api/cv/analyze (corrigée)

**Décisions documentées** : 3
1. Billing supprimé de /api/cv/analyze (Stripe non câblé)
2. /api/cv/upload créée sans source legacy (nouveau)
3. Mistral utilisé à la place d'OpenAI (parité legacy)

**TODO** : Réintégrer billing quand L1.1 = DONE
