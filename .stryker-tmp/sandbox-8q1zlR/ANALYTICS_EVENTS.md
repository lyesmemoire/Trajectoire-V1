# Module Analytics

**Status: IMPLEMENTED**

**Event:**
- `recovery_conversion`

**Trigger:**
- `scoreDelta >= 10`

**Payload:**
- userId
- tenantId
- sessionId
- timestamp
- questionId
- recoveryType (normalisé: "confidence" | "technical" | "communication" | "stress")
- scoreBefore
- scoreAfter
- scoreDelta

**GDPR:**
- validated through `sanitizeAnalyticsPayload()`

---

## État actuel
Le module d'analytics est centralisé autour du fichier `lib/analytics.ts`.
Toutes les remontées de données passent par la fonction `track(event, properties)`, qui inclut une étape obligatoire de sanitisation GDPR (`sanitizeAnalyticsPayload`). Le tracking est conçu pour utiliser *PostHog* côté client. Divers modules métiers (comme `track-replay-engagement.ts`) encapsulent les appels à `track` pour offrir des fonctions fortement typées.

## Fonctionnalités détectées
- Définition d'un dictionnaire central `EVENTS` pour les actions clés (ex: `INTERVIEW_COMPLETE`, `HERO_CTA_CLICK`).
- Filtrage GDPR natif sur les propriétés (anonymisation).
- Fonctionnalités d'engagement (Replay Analytics) : `opened`, `momentRewatched`, `completed`, `abandoned`.

## Gaps identifiés (Maintenant résolus)
- [OK] Infrastructure globale d'analytics (Posthog + GDPR filter).
- [OK] Tracking des moments "Wow" et de complétion dans le replay.
- [OK] Tracking spécifique de l'événement `recovery_conversion`. La métrique évalue le moment précis où un candidat retourne une situation (scoreBefore -> scoreAfter) avec un seuil de delta minimal de 10.
- [OK] Payload `recovery_conversion` structuré et déclaré avec tous les attributs nécessaires.

## Risques
- **Risque Données/Privacy** : Traité. L'événement est conçu pour être passé via `track` et bénéficie donc de `sanitizeAnalyticsPayload()`. La pseudonymisation se fait au niveau de cette fonction centrale.
- **Risque Logique** : Traité. La limite de déclenchement `scoreDelta >= RECOVERY_MIN_DELTA` évite le bruit analytique.

## Recommandations (Appliquées)
1. **Création de l'encapsulation** dans `lib/analytics/recovery-analytics.ts`.
2. **Création de la fonction** `trackConversion(payload)` qui valide le seuil `RECOVERY_MIN_DELTA` et appelle `track("recovery_conversion", payload)`.
