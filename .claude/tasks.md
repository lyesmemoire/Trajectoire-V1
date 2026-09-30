# Tâches Trajectoire — fichier vivant

> Mis à jour manuellement en session. Pour l'état détaillé (architecture, pièges), voir `CLAUDE.md`.

## En cours
- [ ] **Module CV / ATS — Phase 3 : nouveau moteur d'analyse** (`lib/cv-analysis/`, noyau déterministe sans IA, tests de régression). Décision du 2026-10-01 : **reconstruire** (le `premium-orchestrator` ne discrimine pas les métiers : dev senior ↔ offre infirmier = 86, comme dev ↔ dev). Voir « Module CV / ATS » ci-dessous.

## Restant — par priorité

### Avant d'encaisser (bloquant)
- [ ] 🔴 **Mise en ligne de la tarification** : migration `20260930_pricing_plans_pack_pro` **appliquée** à Supabase le 2026-09-30 ; reste à faire (côté utilisateur) : créer les prix Stripe test (Pack 29 € TTC unique, Pro 19 €/mois sans essai), `STRIPE_PRICE_INTERVIEW_PACK`, `STRIPE_PRO_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` (`whsec_…` via `stripe listen`), installer le CLI Stripe, configurer le portail de facturation, puis dérouler la checklist E2E (16 parcours, corrigée : Pack = +3 mois, FREE = 0 simulation). Documenter les 3 variables de prix dans `ENV.md` / `.env.example`.
- [ ] 🔴 **Décision produit — paiement échoué** : aujourd'hui `past_due` retire immédiatement les droits PRO (`plan-access`). Recommandé : délai de grâce (accepter `past_due`).
- [ ] 🔴 **Simulation Realtime** (`useRealtimeInterview`, `simulation/[id]`) : le pipeline de rapport a été raccordé (`93329526` transcripts persistés, `a3c98841` fin via `/api/simulation/end`, `94253685` Map morte supprimée) mais **jamais testé de bout en bout** (entretien vocal → rapport → settings). `/api/interview/realtime-session` n'a ni quota ni rate-limit propre ; `POST /api/interview` renvoie 404 en production (route legacy).
- [ ] 🔴 **RGPD : la suppression de compte laisse `users` + `Subscription` en base** (`public.users` n'a aucune FK vers `auth.users` : `deleteAccount` supprime l'utilisateur Auth mais pas la ligne `users` ni `Subscription`). À faire : anonymiser ou supprimer, vérifier les cascades Prisma. L'abonnement Stripe est déjà annulé à la suppression (`lib/billing/cancel-user-subscription.ts`, `0df641f4`). Le texte intégral des CV est stocké en clair (`CVAnalysis.originalText`, doublé dans `optimizedText`) sans rétention : à traiter avec.
- [ ] **Purge des 33 aperçus expirés** de `PreviewAnalysis` (22 « simulés », `rawPayload` avec texte de CV) : `DELETE` sur la base distante, **en attente d'accord explicite**. Le nettoyage périodique (`/api/admin/cleanup-previews`) n'est pas planifié.

### Module CV / ATS (audit du 2026-09-30)
- [ ] **Phase 3 (en cours)** : moteur d'analyse — couverture des exigences de l'offre (mots entiers, accents, pluriels), expérience/séniorité comparées à l'offre, complétude/lisibilité, métriques d'impact ; refus de scorer si l'offre est absente ; IA réservée au qualitatif (français, entrées assainies) ; puis branchement API (`cv/analyze` réservée PACK/PRO) et persistance `CVAnalysis.atsScoreBefore/After`.
- [ ] Page authentifiée dédiée `(app)/cv` (historique des analyses, réécritures) — aujourd'hui aucune.
- [ ] Export PDF/DOCX du CV à reconstruire (l'ancien code était mort et a été supprimé).
- [ ] Un seul validateur d'upload (PDF/DOCX/TXT, une limite) : `cv/upload` (pdfjs, 8 Mo) et `analyze-preview` (pdf-parse, 5 Mo, DOCX « non supporté », TXT probablement rejeté par `file-type`).
- [ ] Design `/analyze` : encore clair + violet + ivoire/bronze ; passer en zinc-950 / indigo-500.
- [ ] `lib/ats/*` (~5 000 lignes, mort) : garder `doubt-engine`, `recruiter-grade`, `contracts/munitions` (munitions d'entretien, à assainir/plafonner), supprimer le reste une fois le nouveau moteur en place.
- [ ] **Décision** : crédits `ENABLE_ATS_BILLING` (désactivé par défaut, 10/2 crédits) — font double emploi avec les plans : retirer ou garder.

### Auth
- [ ] **Test manuel de bout en bout jamais fait** : inscription → confirmation → onboarding → reset mot de passe.
- [ ] Lots A1–A3 (erreurs Supabase en français, renvoi de l'e-mail de confirmation, redirection des utilisateurs connectés depuis les pages d'auth) et B3–B5 (longueur de mot de passe 6/8, validation/normalisation e-mail, chemin dev de signup).
- [ ] Fusionner `/signup-conversion` (claire, OAuth) dans `/signup` ; `/welcome` orpheline.

### Divers
- [ ] Chiffres inventés hors module CV : `lib/executive/executive-result-engine.ts` (percentile aléatoire), `components/share/career-dna-card.tsx` (« Top X % Mondial »), `emails/analysis-recap.tsx` (« mieux que X % des candidats »).
- [ ] Bouton « Commencer » de la Navbar violet (`bg-primary`) sur des pages indigo ; `hover:bg-slate-100` dans la Navbar.
- [ ] Deux enums de plans parallèles (`AuthorizationV2.SubscriptionPlan`, `types/subscription.SubscriptionPlan`) à fusionner.
- [ ] Un échec Vitest isolé non identifié (vu une fois, non reproduit en 5 exécutions).
- [ ] Deux suites bloquées par la garde `[SAFETY]` (`PreviewStorageService`, `PreviewAnalysisRepository`) : nécessitent une base locale — comportement voulu.

## Terminé ✅ (vérifié par `git log`)
- [x] `route POST /api/onboarding/complete` + règle AuthorizationV2 (`61ff73cc`)
- [x] Onboarding UI — 8 fichiers, layout plein écran + wizard (`721a9c5c`)
- [x] Tests onboarding — schéma Zod + route (`8b15a37c`)
- [x] Migration Prisma `onboardingData`/`onboardingCompletedAt` appliquée à Supabase (`a3d18660`, 2026-09-28)
- [x] Redirect nouveaux utilisateurs vers `/onboarding` (`4901929a`)
- [x] `/simulation` — résolu par `2bb297b8` (postérieur à `34865e31`) : `(app)/simulation/page.tsx` n'a plus de contenu propre, simple `redirect("/simulation/new")` ; la barrière `careerProfile` est devenue un bandeau non bloquant dans `/simulation/new`. Vérifié dans le code le 2026-09-29 : la note « décision ouverte » (garder distinct vs fusionner) documentait un état déjà dépassé avant le début de cette session.
- [x] `/discovery` — indigo local, chips emerald/amber, font-sans (`fae6a0b8`) ; 4 pastilles `bg-zinc-100 text-zinc-900` → `bg-zinc-700 text-zinc-100` (2026-09-29)
- [x] Login / signup — a11y (contraste, aria) (`4d5449d7`, `1dd53533`)
- [x] Button — variantes dark + dark-ghost (`f413b9be`)
- [x] `/history`, `/report`, `/dashboard` — dark tokens (`8b3d0ad8`, `2c0ea136`, `55558ac7`)
- [x] `/api/auth/callback` — échange code → session (`7489042a`)
- [x] `/forgot-password` (`4e741111`)
- [x] `/reset-password` — formulaire nouveau mot de passe, `supabase.auth.updateUser`, redirect `/login` (`ef30a9a7`)
- [x] Audit "Button violet" : sur les 4 fichiers listés, 3 étaient du code mort (jamais importés sous `app/`) → supprimés avec leur cluster complet (`components/ats/*` 11 fichiers + `types/ats.ts`, `components/interview/InterviewResults.tsx` + `CommitteeDecisionReveal.tsx` (dépendance devenue orpheline), `components/cv-editor/CVEditorShell.tsx` + `ExperienceEditor.tsx` + `types/cv.ts`), vérifié par grep récursif avant suppression. Le vrai bug live n'était pas un bouton violet mais `components/premium/PremiumModal.tsx` + `UpgradeCTA.tsx` (rendus 4× sur `/report/[id]`, page déjà dark) : entièrement en thème clair (`bg-white`, `ivoire`, `ink`, `bronze`) — réécrits en JSX + tokens zinc-900/indigo-500/`text-white/80` cohérents avec le reste de `/report`. `tsc --noEmit` et ESLint à 0 sur les deux fichiers. Non vérifié visuellement en navigateur (DB applicative cassée, voir `.env` ci-dessus) : à confirmer visuellement quand la connexion sera rétablie.
- [x] `check-access` — vérifié le 2026-09-29 : **pas d'action nécessaire**. La route (`app/api/auth/check-access/route.ts`) est une API JSON interne (garde `x-internal-request === 'middleware'`), jamais appelée par `middleware.ts` ni par aucun composant client (grep récursif sur `apps/web/src`) — son commentaire d'en-tête ("Appelée par le middleware") est obsolète. Ses seuls appelants sont des tests e2e qui attendent du JSON. Y ajouter un `redirect()` casserait ce contrat sans jamais atteindre le navigateur. La redirection `/onboarding` demandée existe déjà, correctement, via `(app)/layout.tsx` + `lib/onboarding/shouldRedirectToOnboarding.ts` (`4901929a`).
- [x] `components/premium/BlurOverlay.tsx` supprimé — confirmé mort par grep récursif (aucun importeur), ne cassait rien d'autre (`7619b60e`)
- [x] `.env` `DATABASE_URL`/`DIRECT_URL` — corrigés par l'utilisateur le 2026-09-29 : mot de passe pooler mis à jour dans `DATABASE_URL`, et `DIRECT_URL` repointé de l'hôte direct (DNS injoignable depuis cet environnement) vers le pooler en mode session (`aws-0-eu-west-1.pooler.supabase.com:5432`). `prisma migrate status` confirme : connecté, 8 migrations, schéma à jour.
- [x] Vitest groupe A — 2 suites bloquées par la garde `[SAFETY]` localhost-only : comportement voulu, confirmé une fois la DB distante reconnectée (la garde se déclenche exactement comme prévu). Rien à corriger.
- [x] Vitest groupe D — 2 bugs réels corrigés (`7eb87810`) : `sanitizeUrl` (`lib/security/ssrf.ts`) validait l'URL brute avant de retirer `user:pass@`, or `validateUrl` rejette tout `@` (anti-redirection) → toujours `null` dès qu'il y avait des identifiants à nettoyer. Fix : nettoyer d'abord, valider le résultat nettoyé. `report-generator.test.ts` (R5) attendait que le hash sha256 du PDF contienne le score en clair, structurellement impossible pour un vrai hash — c'est le test qui avait tort, pas `generatePDF` ; remplacé par une vraie vérification de cohérence inter-formats (`summary.globalScore` == `exports.json.evaluation.score` == `input.evaluation.score`). Les deux fichiers passent à 100 % (60/60) après fix.
- [x] Vitest groupe B — `PreviewTokenManager.test.ts` (6/6, `f3d557ce`) : `jsdom` n'est pas une dépendance du projet (`@vitest-environment jsdom` aurait échoué au chargement) ; le code source ne touche jamais au DOM (juste `typeof window !== 'undefined'` + le global `sessionStorage` nu), donc stubbé `window`/`sessionStorage` via `vi.stubGlobal` plutôt que d'ajouter jsdom pour un besoin qui n'existe pas.
- [x] Vitest groupe C — `centralized-rate-limit.service.test.ts` (20/20, `469cfc5d`) : 3 bugs empilés, révélés un par un. (1) `initializeRedis()` n'appelait jamais `new Redis(...)` faute de `UPSTASH_REDIS_REST_URL`/`TOKEN` → `vi.stubEnv`. (2) le mock `Redis` utilisait une fonction fléchée, non constructible → fonction classique. (3) **bug réel de production** : une fois `burstCount >= burstLimit`, `slidingWindowCheck()` ne bloquait pas, il retombait sur la vérification de la fenêtre principale qui autorisait si elle n'était pas pleine — le burst limit n'avait donc aucun effet une fois dépassé ; fix dans `centralized-rate-limit.service.ts` (bloquer immédiatement). Le test utilisait aussi un burst (75) ne correspondant pas au vrai `burstLimit` de `RouteType.API` (150) — corrigé. Enfin, `should log errors when Redis fails` espionnait `console.error` au lieu de `logger.error` (pino n'écrit jamais via `console.error`) — corrigé.
- [x] **Auth (2026-09-29/30)** : callback (`code`, `token_hash`+`type`, erreurs Supabase → codes) `1ccd567f` ; `/login` lit `?error=`/`?reason=` `6796cf7d` ; reset-password exige une session de récupération + déconnexion après succès `ea90ff32` ; signup transmet le jeton d'aperçu par cookie, rattaché au callback `16a09a10`. Trigger `on_auth_user_created` vérifié actif.
- [x] **Grille tarifaire (2026-09-30)** : `lib/plans.ts` `2ff91d11` ; enum `FREE/PACK/PRO` + `packExpiresAt`/`simulationsUsed` `ea8f10aa` (migration appliquée) ; `/pricing` refonte `d248b447` ; checkout/webhook PACK/PRO `3a935c93` ; quotas atomiques, PACK = PRO `25d4e8a4` ; `/settings` abonnement + portail `b1752bb2` ; annulation Stripe à la suppression de compte `0df641f4`. (Quota précédent comptait la mauvaise table : `InterviewSession` au lieu de `interview_sessions`.)
- [x] **Module CV — Phase 0/1/2 (2026-10-01)** : valeurs inventées retirées (radar aléatoire, percentile, métriques par défaut) `435a5b5f` ; plus de transfert de l'aperçu vers le profil, résultat réel persisté, texte du CV non conservé `b357ddc5` ; un seul chemin d'aperçu `3c495b30` ; 24 fichiers morts supprimés `50072409` ; analyse complète et réécriture réservées PACK/PRO `91509cc4` ; CSRF + rate-limit + assainissement des prompts `4b0f21e4`.

**Suite Vitest complète : 700/700 tests passent** (mesure du 2026-10-01 ; hors les 2 suites du groupe A, bloquées par la garde `[SAFETY]` localhost-only par design).
