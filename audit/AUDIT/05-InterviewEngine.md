# 05 - Audit Moteur d'Entretiens (SIL)

- **Phase 1 (Accueil)** : Prompt orienté "Brise-glace". Memory vide.
- **Phase 2 (Pression)** : Le LLM reçoit une variable `stressLevel=high`. Le prompt force des interruptions (via WebSocket).
- **Phase 3 (Débriefing)** : Agrégation des scores via une évaluation formelle (Mistral-Large) retournant un JSON strict (Confidence, Stress, Preparedness).
- **Statut** : GO.\n