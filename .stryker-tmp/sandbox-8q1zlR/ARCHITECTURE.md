# 🏗️ Intervo / StudioEntretien — Architecture (P3.11)

> Recruiter AI Simulation System. État réel au commit P3.11.
> Invariants vérifiés par mesure (pas seulement affirmés) — voir AUDIT plus bas.

---

## Vue d'ensemble (4 couches conceptuelles)

```
┌──────────────────────────────────────────────────────────┐
│ UI LAYER                                                  │
│  app/product/interview (texte + VoiceMode)                │
│  lib/voice/client.ts (WS client, barge-in, playback)      │
└───────────────────────────┬──────────────────────────────┘
                            │  (consommation only, 0 logique métier)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ TRANSPORT LAYER  (apps/realtime-gateway/src/server)       │
│  ws.voice.ts : route /api/voice                           │
│   - sélecteur ?engine=v2 (opt-in)                         │
│   - audio → STT → pipeline → TTS → audio                  │
│   - barge-in / resume / eventId                           │
│  « bête » : aucune décision métier ni comportementale     │
└───────────────────────────┬──────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────┐
│ ORCHESTRATION  (core/simulation/pipeline.ts) — P3.10      │
│  runInterviewPipeline(state, transcript)                  │
│   1. V2 décide   2. simulation update                     │
│   3. mind derive 4. shape output                          │
│  Frontière d'intégration UNIQUE.                          │
└──────────┬───────────────────────────────┬───────────────┘
           ▼                               ▼
┌────────────────────────┐   ┌────────────────────────────┐
│ V2 ENGINE (cerveau pur) │   │ SIMULATION (comportement)  │
│ core/v2/                │   │ core/simulation/           │
│ - décision questions    │   │ pressure / memory /        │
│ - scoring / parcours    │   │ cross-session / hidden-eval│
│ - NE CONNAÎT PAS la     │   │ persona-reactivity /       │
│   simulation            │   │ simulation-state           │
└────────────────────────┘   └─────────────┬──────────────┘
                                            ▼
                            ┌────────────────────────────┐
                            │ RECRUITER MIND (P3.11)     │
                            │ recruiter-mind.ts          │
                            │ vue dérivée (read-only):   │
                            │ emotion/trust/suspicion/   │
                            │ engagement/pressure/fatigue│
                            │ /confidence/momentum       │
                            │ → personaFromMind()        │
                            └────────────────────────────┘
```

## Flux d'un tour
```
transcript → V2.nextV2Step (décision pure)
          → SimulationContract (V2Decision)
          → updateSimulation (pressure/memory/hidden-eval/persona)
          → deriveRecruiterMind (conscience)
          → applySimulationToQuestion (façonnage texte)
          → question finale → TTS
```

## Invariants (vérifiés)
1. **V2 remplaçable** : `core/v2` n'importe **aucun** module comportemental (`grep` = 0).
2. **Simulation remplaçable** : `core/simulation` ne dépend **pas** du transport (`grep` = 0).
3. **MindState dérivé** : aucune vérité métier n'en dépend (lecture seule).
4. **Pipeline = frontière unique** V2 ↔ Simulation (`SimulationContract`).
5. **Découplage runtime** : « supprime la simulation → V2 marche » (116 tests V2 purs).

## Tailles (indicatif)
- V2 core : ~1 270 lignes · Simulation : ~980 · Adapters voix : ~1 030 · Tests voice : ~1 450.
- Ratio test/code (moteur) ≈ **0,64** (1449/2254) — bon pour du déterministe.

## Métriques de santé
- **132 tests** verts · lint 0 erreur · gateway `tsc` strict EXIT 0 · `pnpm -r build` EXIT 0.
