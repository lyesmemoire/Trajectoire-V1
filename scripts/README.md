# Scripts d'extraction et de maintenance

## extract-questions-from-doc.ts

Script offline pour extraire les questions depuis les docs RH et les ajouter à la base de questions.

### Prérequis

```bash
npm install openai dotenv
```

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
OPENAI_API_KEY=your_openai_api_key
```

### Utilisation

```bash
# Compiler le script (si nécessaire)
npx tsx scripts/extract-questions-from-doc.ts

# Ou avec ts-node
npx ts-node scripts/extract-questions-from-doc.ts
```

### Comportement

1. Charge les questions existantes depuis `apps/realtime-gateway/src/voice-interview/core/question-db/questions.fr.json`
2. Traite chaque document RH listé dans le script
3. Utilise GPT-4o-mini avec le prompt `PROMPT-QUESTION-EXTRACTION.md`
4. Fusionne et déduplique les questions par ID
5. Sauvegarde le résultat dans le fichier JSON

### Documents traités par défaut

- `docs/rh/DOC-013-03-Bibliotheque-Questions-Expert.md`
- `docs/rh/DOC-032-03-Bibliotheque-200-Rebonds.md`
- `docs/rh/DOC-039-02-Bibliotheque-Questions-Inattendues.md`
- `docs/rh/DOC-014-03-Questions-Observation-Comportementale.md`
- `docs/rh/DOC-C1-02-Bibliotheque-60-Questions-Creusage.md`

### Contrôle qualité

Après extraction, vérifier manuellement :

- **Rôle/tone/phase** cohérents
- **Difficulty** raisonnable (1-5)
- **Target_profile** crédible
- **Tags** pertinents
- **Triggers** appropriés

Lancer quelques entretiens de test pour vérifier :

- Questions trop vagues ?
- Doublons évidents ?
- Questions inadaptées au profil ?

### Itération recommandée

1. Lancer sur 3-5 docs
2. Relire le JSON produit
3. Corriger à la main si nécessaire
4. Élargir progressivement aux autres docs
