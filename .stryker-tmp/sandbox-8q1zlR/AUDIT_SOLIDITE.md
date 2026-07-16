# 🔬 Audit de solidité — Intervo (post P3.11)

> Audit honnête d'ingénieur senior : où ça peut casser à l'échelle, la dette réelle,
> les risques de drift. Basé sur des **mesures**, pas des impressions.

---

## ✅ Ce qui est solide (vérifié)

| Invariant | Méthode | Résultat |
| :-- | :-- | :-: |
| V2 ignore la simulation | `grep` imports comportementaux dans `core/v2` | ✅ 0 |
| Core ne dépend pas du transport | `grep` ws/deepgram/tts dans `core` | ✅ 0 |
| Découplage runtime | 116 tests V2 purs après retrait du binding | ✅ |
| Déterminisme | tests `toEqual` sur entrées identiques (V2, sim, mind) | ✅ |
| Anti-boucle | `MAX_TURNS` + quota `closing` borné | ✅ |
| Build strict | gateway `tsc` (exactOptionalPropertyTypes) | ✅ EXIT 0 |

---

## 🟠 Dette / risques réels (à traiter, par priorité)

### 1. Couplage conceptuel inversé V2 → `simulation/index` (PRIORITÉ 1)
- **Fait** : `interview-engine-v2.ts` importe son **évaluation / banque de questions / rapport**
  via `../simulation/index` (héritage du refactor P3.7 où la couche `simulation` regroupe aussi
  l'évaluation).
- **Risque** : ce sont de la **logique V2** (pas du comportement), mais l'import passe par la
  couche simulation → lecture trompeuse + cycle d'import latent si la simulation venait à importer V2.
- **Impact actuel** : faible (pas de cycle réel, build OK). **Mais c'est une bombe à retardement**
  quand P4 enrichira la simulation.
- **Correctif recommandé** : extraire une couche `core/v2/contracts` (évaluation, banque, rapport,
  plan) importée **directement** par V2, et que la simulation réexporte si besoin. Refactor
  iso-comportement (tests = filet).

### 2. Doublon V1 / V2 (PRIORITÉ 2)
- **Fait** : le moteur V1 (`core/interview-engine.ts`, P3.1→3.5) coexiste avec V2.
  Le transport route V1 par défaut, V2 via `?engine=v2`.
- **Risque** : deux moteurs à maintenir ; divergence de comportement possible ; confusion contributeurs.
- **Recommandation** : décider une **date de bascule V2 par défaut**, puis déprécier V1
  (le garder en `legacy/` ou le supprimer). Tant que V2 n'est pas l'unique chemin, on paie double.

### 3. `interview-engine-v2.ts` = 339 lignes (PRIORITÉ 3)
- **Risque** : fichier le plus gros, fait décision + état + mémoire + sélection + rapport.
  Complexité cognitive croissante.
- **Recommandation** : extraire `question-selection.ts` et `turn-reducer.ts` du moteur
  (sélection vs transition d'état). Iso-comportement.

### 4. Heuristiques à seuils magiques (PRIORITÉ 3)
- **Fait** : seuils dispersés (`score < 55`, `specificity < 0.25`, `bluff >= 0.55`, décroissance
  mémoire `0.05`, pression `+15/+25/+30`…).
- **Risque** : **drift comportemental** difficile à calibrer ; un changement de seuil casse des tests
  sans qu'on sache pourquoi.
- **Recommandation** : centraliser dans `core/simulation/tuning.ts` (constantes nommées + commentées),
  versionné, pour calibrage et A/B futurs.

---

## 🔴 Risques à l'échelle (runtime réel, pas encore éprouvé)

### A. Latence audio / codec (NON testé en charge)
- Le pipeline core est synchrone et rapide (< 1 ms/tour mesuré). **Le vrai goulot = STT/TTS réseau**.
- MediaRecorder (webm/opus) ↔ `encoding` Deepgram : alignement à valider en prod réelle.
- **Aucun test de charge** existant → angle mort.

### B. Mémoire sessions (in-memory + TTL)
- `SessionManager` et le store V2 sont **in-memory par process**. À scale horizontal (plusieurs
  instances gateway), **pas de session partagée** → reprise (`resume`) casse derrière un load balancer.
- **Recommandation avant prod multi-instance** : sticky sessions OU store partagé (Redis) —
  mais **derrière l'interface `SessionManager`** pour ne pas polluer le core.

### C. Drift comportemental (le plus subtil)
- Avec P4 (silences, émotions), les boucles de feedback (pression → persona → question → score →
  pression) peuvent **diverger** (recruteur qui s'emballe ou se fige).
- **Recommandation** : ajouter des **invariants de stabilité** testés (ex. « la pression ne peut
  pas rester à 100 plus de N tours sans redescente possible ») AVANT P4.

### D. Pas de tests E2E du chemin vocal réel
- Les tests couvrent le core (déterministe) + des mocks WS. **Le chemin audio réel
  (micro → Deepgram → orchestrateur → TTS → playback) n'a aucun test d'intégration.**

---

## 🎯 Recommandation de séquencement (avis senior)

**Avant P4**, je ferais 2 verrous rapides (faible risque, fort ROI) :
1. **Dette #1** (extraire les contrats V2 de `simulation/index`) — sinon P4 aggrave le couplage.
2. **Risque C** (invariants de stabilité comportementale testés) — sinon P4 introduit du drift invisible.

**P4 ensuite** devient sûr : silences/émotions = mapping `RecruiterMindState → UX`, sans toucher V2,
avec des garde-fous de stabilité déjà en place.

**Dette #2 (V1/V2)** et **Risque B (store partagé)** : à planifier avant la **mise en prod réelle**,
pas avant P4.

---

## 📊 Verdict
Architecture **saine et bien découplée** pour un système de cette ambition. Les invariants clés
tiennent. La dette est **identifiée et localisée** (pas diffuse), donc maîtrisable. Les vrais
risques sont à l'échelle runtime (latence, sessions distribuées, drift) — normaux à ce stade,
mais à adresser avec méthode avant la prod et avant d'empiler P4.
