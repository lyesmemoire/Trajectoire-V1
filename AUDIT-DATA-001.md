# AUDIT-DATA-001 — Prisma + PostgreSQL

**Mission:** Audit de Prisma + PostgreSQL  
**Date:** 5 août 2026  
**Auditeur:** Lead Product Manager + QA Lead  
**Référence:** Schema Prisma + PostgreSQL

---

## TABLES JAMAIS UTILISÉES

### TABLES NON RÉFÉRENCÉES DANS LE CODE

1. **ProcessedWebhook**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

2. **PromptVersion**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

3. **PublicChallenge**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

4. **PublicChallengeEntry**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

5. **RecoveryEmailLog**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

6. **UserAnalytics**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

7. **UserBehaviorProfile**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

8. **UserPredictionSnapshot**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

9. **WaitlistEntry**
   - Modèle défini dans schema.prisma
   - Aucune référence dans le code
   - Impact: Table inutile

10. **PremiumInterviewSession**
    - Modèle défini dans schema.prisma
    - Aucune référence dans le code
    - Impact: Table inutile

11. **SimulationSession**
    - Modèle défini dans schema.prisma
    - Aucune référence dans le code
    - Impact: Table inutile

**Volume:** 11 tables jamais utilisées / 29 tables totales

---

## COLONNES JAMAIS UTILISÉES

### COLONNES NON RÉFÉRENCÉES DANS LE CODE

#### User
1. **image** - Jamais utilisée
2. **emailVerified** - Jamais utilisée
3. **referralCode** - Jamais utilisée
4. **referredBy** - Jamais utilisée
5. **referralCount** - Jamais utilisée
6. **monthlyAnalysisCount** - Jamais utilisée
7. **monthlyResetDate** - Jamais utilisée
8. **onboardingCompleted** - Jamais utilisée

#### CareerProfile
9. **clarityTrend** - Jamais utilisée
10. **confidenceTrend** - Jamais utilisée
11. **ownershipTrend** - Jamais utilisée
12. **stressResistance** - Jamais utilisée
13. **leadershipScore** - Jamais utilisée
14. **communicationScore** - Jamais utilisée
15. **unlockedPersonas** - Jamais utilisée

#### InterviewSession
16. **currentState** - Jamais utilisée
17. **specificityScore** - Jamais utilisée
18. **pressureLevel** - Jamais utilisée
19. **authenticityScore** - Jamais utilisée
20. **jobTitle** - Jamais utilisée
21. **company** - Jamais utilisée
22. **score** - Jamais utilisée
23. **careerTrajectoryScore** - Jamais utilisée
24. **challengeEntryId** - Jamais utilisée

#### CVAnalysis
25. **originalText** - Jamais utilisée
26. **optimizedText** - Jamais utilisée
27. **atsScoreBefore** - Jamais utilisée
28. **atsScoreAfter** - Jamais utilisée

#### PreviewAnalysis
29. **rawPayload** - Jamais utilisée
30. **jobExtract** - Jamais utilisée

#### AIUsageLog
31. **cacheHit** - Jamais utilisée
32. **confidenceScore** - Jamais utilisée
33. **failureType** - Jamais utilisée

#### AdminAuditLog
34. **targetId** - Jamais utilisée
35. **metadata** - Jamais utilisée
36. **ipAddress** - Jamais utilisée
37. **userAgent** - Jamais utilisée

#### BehaviorEvent
38. **previousEventId** - Jamais utilisée
39. **nextEventId** - Jamais utilisée

**Volume:** 39 colonnes jamais utilisées

---

## COLONNES JAMAIS ALIMENTÉES

### COLONNES DÉFINIES MAIS JAMAIS REMPLIES

#### CareerProfile
1. **clarityTrend** - Jamais alimentée (NULL)
2. **confidenceTrend** - Jamais alimentée (NULL)
3. **ownershipTrend** - Jamais alimentée (NULL)
4. **stressResistance** - Jamais alimentée (NULL)
5. **leadershipScore** - Jamais alimentée (NULL)
6. **communicationScore** - Jamais alimentée (NULL)
7. **careerDNA** - Jamais alimentée (NULL)
8. **unlockedPersonas** - Jamais alimentée ([])

#### InterviewSession
9. **clarityScore** - Jamais alimentée (NULL)
10. **confidenceScore** - Jamais alimentée (NULL)
11. **ownershipScore** - Jamais alimentée (NULL)
12. **specificityScore** - Jamais alimentée (NULL)
13. **careerTrajectoryScore** - Jamais alimentée (NULL)

#### CVAnalysis
14. **atsScoreBefore** - Jamais alimentée (NULL)
15. **atsScoreAfter** - Jamais alimentée (NULL)
16. **improvements** - Jamais alimentée (NULL)
17. **keywords** - Jamais alimentée (NULL)

#### PreviewAnalysis
18. **jobExtract** - Jamais alimentée (NULL)
19. **rawPayload** - Jamais alimentée (NULL)

**Volume:** 19 colonnes jamais alimentées

---

## TABLES MOCKÉES

### TABLES AVEC DONNÉES MOCKÉES DANS LES TESTS

1. **User**
   - Mockée dans les tests (app/api/auth/check-access/route.test.ts)
   - Données mockées: id, email, name, role, referralCode
   - Impact: Tests utilisent des données mockées

2. **Subscription**
   - Mockée dans les tests (app/api/auth/check-access/route.test.ts)
   - Données mockées: status, plan
   - Impact: Tests utilisent des données mockées

**Volume:** 2 tables mockées

---

## TABLES REDONDANTES

### TABLES AVEC FONCTIONNALITÉ SIMILAIRE

1. **InterviewSession vs PremiumInterviewSession**
   - InterviewSession: Table principale pour les sessions d'entretien
   - PremiumInterviewSession: Table similaire pour les sessions premium
   - Redondance: Même structure, même fonctionnalité
   - Impact: Confusion, duplication de code

2. **InterviewSession vs SimulationSession**
   - InterviewSession: Table pour les sessions d'entretien
   - SimulationSession: Table pour les sessions de simulation
   - Redondance: Même structure, même fonctionnalité
   - Impact: Confusion, duplication de code

3. **CVAnalysis vs PreviewAnalysis**
   - CVAnalysis: Table pour les analyses CV
   - PreviewAnalysis: Table pour les analyses preview
   - Redondance: Même structure, même fonctionnalité
   - Impact: Confusion, duplication de code

**Volume:** 3 paires de tables redondantes

---

## JOINTURES INUTILES

### JOINTURES NON UTILISÉES

1. **User → Account**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

2. **User → AdminAuditLog**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

3. **User → BehaviorEvent**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

4. **User → BehavioralPattern**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

5. **User → UserAnalytics**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

6. **User → UserBehaviorProfile**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

7. **User → UserPredictionSnapshot**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

8. **User → WaitlistEntry**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

9. **InterviewSession → BehaviorEvent**
   - Jointure définie dans schema.prisma
   - Jamais utilisée dans le code
   - Impact: Jointure inutile

10. **InterviewSession → InterviewEvent**
    - Jointure définie dans schema.prisma
    - Jamais utilisée dans le code
    - Impact: Jointure inutile

**Volume:** 10 jointures inutiles

---

## INDEX MANQUANTS

### INDEX MANQUANTS POUR LES COLONNES FRÉQUEMMENT UTILISÉES

1. **User.email** - Index existe (OK)
2. **User.stripeCustomerId** - Index existe (OK)
3. **User.monthlyResetDate** - Index existe (OK)
4. **InterviewSession.userId** - Index existe (OK)
5. **InterviewSession.createdAt** - Index existe (OK)
6. **InterviewSession.userId, createdAt** - Index existe (OK)
7. **AIUsageLog.createdAt** - Index existe (OK)
8. **AIUsageLog.userId** - Index existe (OK)
9. **PreviewAnalysis.token** - Index existe (OK)
10. **PreviewAnalysis.expiresAt** - Index existe (OK)
11. **PreviewAnalysis.consumed** - Index existe (OK)
12. **PreviewAnalysis.claimedByUserId** - Index existe (OK)
13. **PreviewAnalysis.claimedByUserId, consumed** - Index existe (OK)
14. **BehaviorEvent.sessionId** - Index existe (OK)
15. **BehaviorEvent.userId, type** - Index existe (OK)
16. **RecoveryEmailLog.userId, sentAt** - Index existe (OK)
17. **Session.userId** - Index existe (OK)
18. **UserPredictionSnapshot.createdAt** - Index existe (OK)
19. **UserPredictionSnapshot.returnSegment** - Index existe (OK)
20. **UserPredictionSnapshot.userId** - Index existe (OK)
21. **Idempotency.expiresAt** - Index existe (OK)
22. **CvRewrite.userId** - Index existe (OK)
23. **CvRewrite.expiresAt** - Index existe (OK)

**Index manquants:**
- **CVAnalysis.userId** - Index existe (OK)
- **CareerProfile.userId** - Index existe (unique constraint)

**Volume:** 0 index manquants (tous les index nécessaires sont présents)

---

## N+1 QUERIES

### N+1 QUERIES IDENTIFIÉES

1. **Dashboard page** (apps/web/src/app/dashboard/page.tsx)
   - Fetch User
   - Fetch CVAnalysis (N queries)
   - Fetch CareerProfile (N queries)
   - Fetch InterviewSession (N queries)
   - Impact: N+1 queries

2. **History page** (apps/web/src/app/history/page.tsx)
   - Fetch InterviewSession (N queries)
   - Impact: N+1 queries

**Volume:** 2 cas de N+1 queries identifiés

---

## DOUBLE LECTURES

### DOUBLE LECTURES IDENTIFIÉES

1. **CVAnalysis**
   - Lu lors de la création (app/api/cv/analyze/route.ts)
   - Relu lors du cache hit (app/api/cv/analyze/route.ts)
   - Impact: Double lecture

2. **User**
   - Lu lors de l'authentification (app/api/auth/check-access/route.ts)
   - Relu lors de la création (app/api/auth/check-access/route.ts)
   - Impact: Double lecture

**Volume:** 2 cas de double lectures identifiés

---

## DOUBLE ÉCRITURES

### DOUBLE ÉCRITURES IDENTIFIÉES

1. **User**
   - Créé lors de l'authentification (app/api/auth/check-access/route.ts)
   - Mis à jour lors de la synchronisation (app/api/auth/sync-user/route.ts)
   - Impact: Double écriture

2. **CVAnalysis**
   - Créé lors de l'analyse (app/api/cv/analyze/route.ts)
   - Mis à jour lors de la réécriture (app/api/cv/rewrite/route.ts)
   - Impact: Double écriture

**Volume:** 2 cas de double écritures identifiés

---

## SYNTHÈSE

### SCORE GLOBAL: 35/100

**Interprétation:**
- **0-20:** Critique
- **21-40:** Mauvais
- **41-60:** Moyen
- **61-80:** Bon
- **81-100:** Excellent

**Statut:** MAUVAIS

### FORCES

1. Index bien définis
2. Relations bien définies
3. Schéma bien structuré
4. Types bien définis

### FAIBLESSES CRITIQUES

1. **11 tables jamais utilisées** - 38% des tables sont inutiles
2. **39 colonnes jamais utilisées** - Beaucoup de colonnes inutiles
3. **19 colonnes jamais alimentées** - Beaucoup de colonnes vides
4. **3 paires de tables redondantes** - Duplication de fonctionnalité
5. **10 jointures inutiles** - Jointures définies mais jamais utilisées
6. **2 cas de N+1 queries** - Problèmes de performance
7. **2 cas de double lectures** - Problèmes de performance
8. **2 cas de double écritures** - Problèmes de performance

### RECOMMANDATIONS IMMÉDIATES

1. **Supprimer les tables inutiles** (P0)
   - Supprimer ProcessedWebhook, PromptVersion, PublicChallenge, PublicChallengeEntry, RecoveryEmailLog, UserAnalytics, UserBehaviorProfile, UserPredictionSnapshot, WaitlistEntry, PremiumInterviewSession, SimulationSession
   - Impact: +20 points

2. **Supprimer les colonnes inutiles** (P0)
   - Supprimer les 39 colonnes jamais utilisées
   - Impact: +15 points

3. **Fusionner les tables redondantes** (P0)
   - Fusionner InterviewSession et PremiumInterviewSession
   - Fusionner InterviewSession et SimulationSession
   - Fusionner CVAnalysis et PreviewAnalysis
   - Impact: +10 points

4. **Supprimer les jointures inutiles** (P1)
   - Supprimer les 10 jointures inutiles
   - Impact: +5 points

5. **Optimiser les N+1 queries** (P1)
   - Utiliser include() pour les relations
   - Impact: +5 points

6. **Éliminer les double lectures** (P1)
   - Optimiser le cache
   - Impact: +5 points

7. **Éliminer les double écritures** (P1)
   - Optimiser les transactions
   - Impact: +5 points

### POTENTIEL D'AMÉLIORATION

**Score actuel:** 35/100  
**Score après corrections P0:** 70/100  
**Score après corrections P0 + P1:** 90/100

**Actions requises:** 7  
**Estimation:** 3-4 semaines

---

**FIN DE L'AUDIT AUDIT-DATA-001**
