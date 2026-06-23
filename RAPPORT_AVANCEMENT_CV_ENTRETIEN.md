# 📋 RAPPORT D'AVANCEMENT — Moteur CV & Entretien Structuré
> Date : 2026-06-21  
> Session : Refonte complète CV V2 + Pont Entretien Vocal  
> Statut global : **Boucle fermée — Pipeline complet**

---

## 🏗️ Architecture Globale Implémentée

```
CV écrit
  → Parsing Zod + Score déterministe (Phase A)
    → Réécriture chirurgicale anti-hallucination (Phase B)
      → Offre collée → Gap Analysis hybride (Phase C)
        → 3 questions ciblées anti-génériques (Phase D)
          → Simulation vocale Q1 + Q2 + Q3
            → Transcription Whisper par réponse
              → Score LLM contraint par réponse
                → Rapport Final (agrégat mathématique + narration LLM)
                    ├── READY        → Confiance donnée
                    ├── NEEDS_WORK   → 3 actions précises
                    └── NOT_READY    → Retour CV immédiat
                              ↓
                        [Corriger mon CV] ──→ Module CV
                              ↑_________________________|
```

---

## 📁 FICHIERS CRÉÉS OU MODIFIÉS

### 🔧 Types & Schémas
| Fichier | Action | Contenu |
|---|---|---|
| `types/cv.ts` | MODIFIÉ | Ajout `InterviewPreparationSchema`, `AlignmentScore.narrativeSynthesis` |
| `lib/interview/scoring.ts` | CRÉÉ | `ResponseScoreSchema` (coherence, depth, clarity, factual_alerts) |
| `lib/interview/report.ts` | CRÉÉ | `FinalReportSchema`, `PersistedResponseSchema`, fonctions `computeAggregateScores`, `hasCriticalInconsistency`, `computeVerdict` |

### 🧠 Moteur CV (lib/)
| Fichier | Action | Contenu |
|---|---|---|
| `lib/cv/scoring.ts` | MODIFIÉ | Patch anti-placeholder `[X]` dans le scoring de quantification |
| `lib/cv/matching.ts` | MODIFIÉ | Ajout synthèse narrative déterministe, regex word-boundary |

### 🌐 Routes API
| Fichier | Action | Contenu |
|---|---|---|
| `app/api/cv/extract-job/route.ts` | CRÉÉ | Extraction structurée d'offre d'emploi → `JobTarget` |
| `app/api/cv/rewrite-bullet/route.ts` | MODIFIÉ | Prompt anti-contournement renforcé (interdiction concepts indirects) |
| `app/api/interview/generate-questions/route.ts` | CRÉÉ | Génération 3 questions ciblées + validation anti-générique + session DB |
| `app/api/interview/transcribe/route.ts` | CRÉÉ | Transcription Whisper-1 (FormData, validation taille, garde-fou longueur) |
| `app/api/interview/score-response/route.ts` | CRÉÉ | Scoring LLM contraint (température 0.1, comparaison CV factuelle) |
| `app/api/interview/generate-report/route.ts` | CRÉÉ | Agrégation déterministe + narration LLM + idempotence + persistance |

### 🖥️ Pages & Composants UI
| Fichier | Action | Contenu |
|---|---|---|
| `app/cv/components/CVAnalyzer.tsx` | MODIFIÉ | Bloc tension "Moment de vérité", bouton génération questions, CTA simulation, synthèse narrative |
| `app/interview/session/[id]/page.tsx` | CRÉÉ | Page serveur : auth guard, chargement session DB, header sombre |
| `app/interview/session/[id]/InterviewSimulationClient.tsx` | CRÉÉ | Client : intégration VoiceResponsePanel, progression, navigation questions |
| `app/interview/session/[id]/report/page.tsx` | CRÉÉ | Page serveur : chargement rapport, génération lazy si absent |
| `components/interview/VoiceResponsePanel.tsx` | CRÉÉ | Capture micro, transcription live, affichage score avec barres + alertes factuelles |
| `components/interview/ReportPageClient.tsx` | CRÉÉ | Verdict final (READY/NEEDS_WORK/NOT_READY), scores agrégés, failles, plan d'action, CTA retour CV |

### 🪝 Hooks
| Fichier | Action | Contenu |
|---|---|---|
| `hooks/useAudioRecorder.ts` | CRÉÉ | MediaRecorder API, mono 16kHz, chunks 250ms, timer 3min max, gestion permissions |

### 🗄️ Migrations Supabase
| Fichier | Action | Contenu |
|---|---|---|
| `supabase/migrations/20260621200000_interview_responses.sql` | CRÉÉ | Table `interview_responses` (session_id, question_index, transcription, score JSONB, RLS) |
| `supabase/migrations/20260621210000_interview_final_report.sql` | CRÉÉ | Colonnes `final_report` JSONB + `completed_at` sur `interview_sessions` |

---

## ✅ PHASES COMPLÉTÉES

### Phase A — Scoring Déterministe
- Parsing structuré Zod (`ParsedCV`)
- Score mathématique : Impact×0.4 + Clarté×0.3 + Quantification×0.3
- Détection verbes faibles et absence de métriques
- Patch anti-placeholder `[X]`

### Phase B — Réécriture Chirurgicale
- Correction bullet par bullet
- Anti-hallucination : placeholders `[X]%` pour les chiffres manquants
- Score recalculé live après correction
- Explication pédagogique de chaque correction

### Phase C — Ciblage Offre & Gap Analysis
- Extraction structurée offre → `JobTarget`
- Matching hybride (normalisation + alias + word-boundary regex)
- Synthèse narrative déterministe (pas de LLM)
- Affichage `(X/Y requis trouvés)`
- Prompt "Adapter à l'Offre" avec interdiction concepts indirects

### Phase D — Pont vers la Simulation
- Génération 3 questions ciblées (vulnérabilité, profondeur technique, comportementale)
- Validation serveur anti-générique (intersection sémantique forcée)
- Session persistée en DB (interview_sessions)
- UX tension : bloc "Moment de vérité" + CTA rouge

### Capture Vocale & Scoring
- Hook `useAudioRecorder` (MediaRecorder, mono, 16kHz, 3min max)
- Route Whisper `/api/interview/transcribe`
- Route scoring `/api/interview/score-response` (température 0.1, factual_alerts)
- `VoiceResponsePanel` avec progression et affichage scores

### Rapport Final
- Agrégation mathématique pondérée (Q0×0.4, Q1×0.35, Q2×0.25)
- Verdict déterministe (CONTRADICTION → NOT_READY automatique)
- Narration LLM contrainte (pas de compliments vagues)
- UI verdict avec plan d'action 3 priorités + CTA retour CV

---

## 🔜 PROCHAINES ÉTAPES POSSIBLES

1. **Polish UX** — Animations, responsive mobile, micro-interactions
2. **Analytics Interne** — Tracking conversion CV→Entretien, score progression
3. **Monétisation** — Crédits par session, freemium, premium
4. **Boucle Retour CV** — Deep-link depuis le rapport vers le bullet exact à corriger
5. **Relance Adaptative** — Si le candidat ne mentionne pas un chiffre clé, l'IA relance
