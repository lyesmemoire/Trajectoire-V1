# ✅ P3.6.1 — Rapport d'exécution : Activation du moteur V2 dans le runtime

> Date : 2026-06-04 · V2 branché en OPT-IN. V1 (P3.2→P3.5) inchangé. Déterministe, sans LLM/DB.

---

## 🎯 Résultat

Le moteur V2 (P3.6) est désormais **activable dans le runtime vocal réel** :
```
params (CV/offre/ATS) → buildCandidateProfile → initInterviewV2 → STT → nextV2Step → TTS → audio → summary_v2
```
Le candidat peut donc passer un entretien piloté par le cerveau V2 (questions ciblées,
relances contextuelles, pièges, pression progressive, bilan multidimensionnel).

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.6.1 | ✅ **3/3** |
| Tous tests | ✅ **81/81** |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Ce qui a été fait

1. **`adapters/voice-websocket-v2.ts`** (NOUVEAU) — transport branché sur le moteur V2 :
   - `handleVoiceConnectionV2Engine(ws, deps, input)` : construit le `CandidateProfile`
     (via `buildCandidateProfile`), `initInterviewV2`, puis chaque `end_speech` → `nextV2Step`.
   - Émet `ready`, `transcript`, `feedback_text`, `next_question_audio`, `interrupted`,
     et **`summary_v2`** (rapport 6 dimensions + recommandation) en fin d'entretien.
   - Store d'état V2 **in-memory + TTL** local (pas de DB).
2. **`server/ws.voice.ts`** — sélecteur de moteur **opt-in** :
   - `?engine=v2` → moteur V2 (avec params `gap, strengths, score, role, cv, job, persona`).
   - Par défaut → moteur V1 inchangé (**zéro régression**).
3. **`index.ts`** — exporte `handleVoiceConnectionV2Engine` + types.
4. **Tests** `tests/voice-interview/p361-activation.test.ts` (3) : `ready` avec question V2,
   tour complet → `summary_v2` (report + recommendation), barge-in conservé.

---

## 🧩 Conformité au plan
- **CandidateProfile construit depuis l'analyse** (params ATS) ✅
- **Injecté dans `initInterviewV2`** ✅
- **`nextV2Step` remplace `nextStep`** dans le chemin V2 ✅
- **Rapport final exposé** côté transport (`summary_v2`) — affichage UI riche prévu au prochain incrément (décision validée) ✅

---

## 🚧 Choix validés avec toi
- **Opt-in via flag `?engine=v2`** : V1 reste le défaut → bascule progressive, aucun risque.
- **Profil depuis params WS → `buildCandidateProfile`** (pas de couplage direct au web ATS).
- **UI rapport différée** : P3.6.1 = activation runtime ; l'affichage 6 axes + reco viendra ensuite.

---

## ✨ Décisions d'archi signalées
- **Connexion V2 séparée** (`voice-websocket-v2.ts`) plutôt que de muter le transport V1 :
  l'état V2 (`InterviewStateV2`) diffère trop de l'état V1 du `SessionManager` ; un store V2
  dédié évite une refonte risquée et garde V1 100% intact.
- Contrat de messages stable (mêmes types que V1 + `summary_v2`) → l'UI vocale existante
  reste compatible.

---

## 🧪 Activer V2
```
ws://<gateway>/api/voice?engine=v2&gap=kubernetes&strengths=react,node&score=70&role=Dev&persona=technical_lead
```
Côté client : `VoiceClient({ url, ... })` — il suffit d'ajouter `engine=v2` (et les params profil)
à l'URL. Le mode texte et le mode V1 restent disponibles.

## ⏭️ Suite : afficher le `summary_v2` dans `/product/interview`, puis **P3.7** (contradictions CV↔réponses, détection bluff, difficulté dynamique, personas avancés, parcours métier, score de crédibilité).
