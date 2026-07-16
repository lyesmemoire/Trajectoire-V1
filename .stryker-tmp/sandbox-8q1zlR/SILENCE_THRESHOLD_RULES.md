# Module Silence Thresholds

**Status: IMPLEMENTED**

**Files modified:**
- `lib/emotional-safety/silence-thresholds.ts`
- `lib/audio/hooks/useSilenceDetection.ts`

**Default level:**
- mid

**Thresholds:**
- junior: 10000 ms
- mid: 7500 ms
- senior: 5000 ms

---

## État actuel
Le module gère la détection de silence (freeze) lors de la prise de parole du candidat. 
Deux fichiers sont impliqués :
1. `lib/emotional-safety/silence-thresholds.ts` : Définit des seuils de durée selon l'expérience du candidat.
2. `lib/audio/hooks/useSilenceDetection.ts` : Hook React utilisé côté client pour déclencher le callback `onSilenceThreshold`.

## Fonctionnalités détectées
- Typage `SeniorityLevel` (`junior`, `mid`, `senior`).
- Variables associées à chaque profil : `freezeThresholdMs`, `frustrationThresholdMs`, `skeletonWordCount`, `recoveryHesitationRate`.
- Fonction d'inférence de la séniorité (`inferSeniority`) basée sur le titre du poste et l'archétype du recruteur.
- Détection du silence côté front-end via `AudioContext` (`useSilenceDetection`).

## Gaps identifiés (Maintenant résolus)
- [OK] Niveaux de séniorité : Ajout du niveau `mid`.
- [OK] Cohérence des seuils : Le hook `useSilenceDetection.ts` prend maintenant `freezeThresholdMs` via un objet de configuration au lieu du `5000` codé en dur.
- [OK] Alignement avec les règles métier : Les durées ont été modifiées pour refléter "Junior -> tolérant (10s), Mid -> intermédiaire (7.5s), Senior -> strict (5s)".

## Risques
- **Impact Interview** : Interventions de l'IA appropriées selon le profil.
- **Impact Replay** : Le nombre d'interruptions et de freezes variera selon le niveau.
- **Impact Progress & Career DNA** : Le `freezeCount` augmentera ou diminuera logiquement, influençant le `communicationScore` et le `confidenceScore`.

## Recommandations (Appliquées)
1. **Mettre à jour `silence-thresholds.ts`** :
   - Ajout du type `"mid"`.
   - Ajustement de la fonction `inferSeniority` pour renvoyer `"mid"` par défaut.
2. **Modifier `useSilenceDetection.ts`** :
   - Signature mise à jour : `useSilenceDetection({ stream, onSilenceThreshold, freezeThresholdMs })`.
