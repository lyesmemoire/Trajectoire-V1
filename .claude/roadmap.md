# Feuille de route jusqu'au lancement

Établie le 2026-10-02 à partir de `tasks.md`, `decisions.md` et des audits CTO et design du jour. Elle ne remplace pas `tasks.md` (suivi détaillé) : elle ordonne ce qui reste. Les tailles sont relatives (S ≈ quelques heures, M ≈ 1 journée, L ≈ plusieurs jours) et ne sont pas des engagements de date : elles dépendent surtout des retours de tests et des comptes externes.

Décisions figées à ne pas rouvrir : voir `.claude/decisions.md`. Stripe reste en dernier.

## Phase 0 : sécuriser l'existant (S)

| # | Action | Qui | État |
|---|---|---|---|
| 0.1 | Pousser les commits en avance | Claude | ✅ fait le 2026-10-02 |
| 0.2 | Régénérer les 3 clés privées Ed25519 du pipeline de certification (exposées dans l'historique GitHub), fournir celle du pipeline par `CERT_PRIVATE_KEY` en CI | Utilisateur (génération) + Claude (CI) | ☐ |
| 0.3 | Vérifier sur GitHub que le dépôt est **privé** (non vérifiable depuis l'environnement de travail) | Utilisateur | ☐ |

Sortie : code sauvegardé hors de la machine, clés remplacées.

## Phase 1 : décisions à trancher (utilisateur, S)

1. **Juridique** : identité réelle de l'éditeur (les numéros actuels ressemblent à des exemples), adresse du siège, e-mail de contact professionnel (aujourd'hui une adresse Gmail personnelle), médiateur de la consommation, renonciation au droit de rétractation pour le Pack de 29 €. À faire valider par un juriste.
2. **`ENABLE_ATS_BILLING`** : retirer ou garder les crédits (double emploi avec les plans).
3. **Analytique** : PostHog n'est branché nulle part. Le vouloir, avec bandeau de consentement ou en mode sans cookie ? Sinon retirer le fournisseur.
4. **`/login` et `/signup`** : restent sombres (décision actuelle) ou passent en clair ?
5. **Domaine de production et hébergeur** (Vercel, Docker/k8s, autre) : le dépôt contient les deux types de déploiement.
6. **Image de partage social** (Open Graph) à fournir (`public/og-image.*`).

## Phase 2 : code restant avant les tests (Claude, M à L)

| # | Tâche | Détail | Taille |
|---|---|---|---|
| 2.1 | Valeurs aléatoires | Examiner `application/human-presence`, `live-coaching`, `smart-notifications`, simulateurs `ai-quality` : supprimer ou brancher sur des données calculées (règle « aucun chiffre inventé ») | M | ✅
| 2.2 | Route orpheline | Retirer `/api/app/dashboard` et sa règle `/api/app` | S | ✅
| 2.3 | Un seul validateur d'upload | `cv/upload` et `analyze-preview` ont deux validateurs différents (PDF 8 Mo contre 5 Mo, DOCX refusé d'un côté, TXT probablement refusé) | M | ✅
| 2.4 | « Réécrire ce CV » | Le bouton mène à une page sans `?cv=id` | S | ✅
| 2.5 | Nettoyage périodique | Planifier `/api/admin/cleanup-previews` (jamais lancé aujourd'hui) | S | ✅
| 2.6 | RGPD | `AdminAuditLog` en `RESTRICT` peut bloquer la suppression d'un compte administrateur | S | ✅
| 2.7 | Export PDF/DOCX du CV | À reconstruire ; à décider s'il est nécessaire au lancement | L | ✅ fait (éditeur pré-rempli + DOCX/PDF ; non vérifié à l'écran)
| 2.8 | `lib/ats/*` | ~5 000 lignes mortes à supprimer (garder `doubt-engine`, `recruiter-grade` ; `contracts/munitions.ts` à la racine ne se touche pas) | M | ✅
| 2.9 | Pages légales | Mentions légales, mise à jour des CGU et de la confidentialité, dès que les informations réelles (phase 1) sont fournies | M | — **structure prête (2026-10-02)** : `lib/legal/publisher.ts` à compléter, page `/mentions-legales` 404 en production tant qu'incomplète ; reste la saisie des informations et la validation juridique
| 2.10 | Consentement | Selon la décision 3 | S à M |
| 2.11 | Design | Appliquer les décisions 4 et 6 ; harmoniser le clair de `/analyze` (violet, ivoire, bronze mélangés) si souhaité | S |
| 2.12 | Extension `vector` | Ne la déplacer hors de `public` que si les requêtes Prisma sont préfixées (sinon ne pas le faire) | S |

Sortie : aucun TODO connu côté code, tests verts, build de production vert, `tasks.md` à jour.

**État au 2026-10-02** : 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 et 2.8 sont faites (✅). Restent 2.7, 2.9, 2.10, 2.11 et 2.12, qui dépendent de décisions ou d'informations de l'utilisateur. Trouvaille en route (2.6) : la suppression de compte échouait pour tout utilisateur ayant lancé une simulation (corrigé). À définir en production : `CRON_SECRET`.

## Phase 3 : tests manuels (utilisateur), corrections (Claude)

**3.1 Auth de bout en bout**, avec de vrais e-mails : inscription → mail de confirmation → onboarding → connexion ; mot de passe oublié → réinitialisation ; erreurs en français (mauvais mot de passe, e-mail non confirmé).

**3.2 Voix Realtime** (micro, vrai compte) : Alexandra parle en premier ; 3-4 répliques ; « Terminer » ; `interview_messages` complet puis `/report/<id>` s'ouvre. À tester aussi sur **téléphone** (tiroir de navigation et simulation en colonne unique, jamais vérifiés à l'écran). La première vraie inscription confirme aussi le déclencheur `handle_new_auth_user` après la révocation d'EXECUTE.

**3.3 Parcours produit** : aperçu gratuit → inscription → l'aperçu est rattaché au compte ; analyse de CV PACK/PRO, réécriture, opportunité et analyse ; suppression de compte.

**3.4 Accessibilité** : navigation au clavier, lecteur d'écran sur 3 pages clés.

Les retours sont corrigés un commit par correction. Sortie : les parcours passent sans erreur, sans donnée fausse affichée.

## Phase 4 : préparation de la production (utilisateur et Claude, M)

| Domaine | Action |
|---|---|
| Variables | `NEXT_PUBLIC_APP_URL` (vrai domaine), `NEXT_PUBLIC_ALLOWED_ORIGINS` (prévisualisations), `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` (obligatoires : le démarrage échoue sinon), DSN Sentry réelle, clés Supabase et OpenAI de production |
| Supabase | activer « mots de passe compromis », vérifier la restauration à un instant donné (PITR), décider des sauvegardes, faire tourner les clés si elles ont été partagées |
| Coûts | plafond de dépense mensuel OpenAI, alertes de budget |
| Observabilité | Sentry reçoit bien un événement de test ; alertes sur erreurs ; réduire le bruit de journal « Dynamic server usage » |
| CI/CD | passer les workflows au vert sur GitHub (le job `web-tests` n'a jamais tourné là-bas) ; décider du sort des workflows de certification et k8s |
| Sécurité | test d'intrusion léger : routes `/api` sans session, accès aux données d'un autre utilisateur (opportunités, CV, rapports) ; en-têtes (HSTS, CSP) sur le domaine réel |
| Reprise | procédure de retour arrière (code et migrations), contact d'astreinte |

Sortie : un environnement de production qui démarre sans alerte, avec Sentry, Upstash et sauvegardes vérifiés.

## Phase 5 : Stripe (en dernier)

**Prérequis (utilisateur)** : 2 prix test (Pack 29 € paiement unique, Pro 19 €/mois sans essai) ; `STRIPE_PRICE_INTERVIEW_PACK` ; `STRIPE_PRO_PRICE_ID` ; `STRIPE_WEBHOOK_SECRET` (`whsec_…` via `stripe listen` ; le format actuel dans le `.env` local est invalide) ; CLI Stripe ; portail client configuré ; **relances de paiement** (3 tentatives sur 7 jours puis annulation : sans cela, `past_due` peut durer indéfiniment).

**Les 16 parcours** (cartes de test Stripe)
1. Pack : achat réussi (4242…), 5 simulations, expiration à 3 mois
2. Pack : carte refusée (4000 0000 0000 0002)
3. Pack : 3D Secure requis
4. Pack : abandon au paiement
5. Pack : quota épuisé puis nouvel achat
6. Pack : expiration (simulée), retour au plan Gratuit
7. Pro : souscription réussie, simulations illimitées
8. Pro : carte refusée à la souscription
9. Pro : renouvellement réussi
10. Pro : échec de renouvellement (4000 0000 0000 0341), `past_due`, droits maintenus
11. Pro : fin des relances, annulation, retour au plan Gratuit
12. Pro : résiliation par le portail client
13. Double abonnement refusé (déjà Pro ou en période de grâce)
14. Webhook rejoué (idempotence) et signature invalide
15. Suppression de compte avec abonnement actif
16. Remboursement depuis le tableau de bord Stripe

Sortie : les 16 parcours passent, aucun droit accordé sans paiement, aucun paiement sans droit.

## Phase 6 : lancement

| # | Étape |
|---|---|
| 6.1 | Passage en mode live Stripe (nouveaux prix live, nouveau webhook), **une carte réelle testée puis remboursée** |
| 6.2 | Lancement restreint (quelques utilisateurs), surveillance rapprochée pendant 48 h |
| 6.3 | Revue à J+1 et J+7 : erreurs Sentry, coûts OpenAI, taux de rapports générés, conversion |
| 6.4 | Ouverture publique |

## Critères go / no-go avant la phase 6

- [ ] Mentions légales, CGU et confidentialité validées et publiées
- [ ] Tests manuels Auth et voix réussis, y compris sur téléphone
- [ ] Sentry, Upstash, sauvegardes et plafond OpenAI vérifiés
- [ ] 16 parcours Stripe réussis
- [ ] `tsc`, tests, build et CI au vert sur GitHub
- [ ] Clés régénérées, dépôt privé
- [ ] Aucun chiffre inventé ni donnée fictive exposée

## Risques principaux

- **Juridique** : bloque le lancement tant que l'éditeur et les mentions ne sont pas réels.
- **Voix sur téléphone** : jamais testée ; risque le plus élevé sur le produit lui-même.
- **Coûts IA** : sans plafond OpenAI, un pic de trafic ou un abus coûte sans limite.
- **Relances Stripe non configurées** : une période de grâce sans fin donnerait un accès Pro gratuit.
