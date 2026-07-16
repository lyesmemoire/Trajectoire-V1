<!-- .cursor/ENV_UNKNOWN.md -->
# Variables d'Environnement Non Documentées

Ces variables existent dans le code mais leur usage n'est pas clarifié.
À investiguer avant d'ajouter à env.server.ts comme obligatoires.

| Variable | Occurrences | Hypothèse | Action |
|----------|-------------|-----------|--------|
| `STORE` | 3 | Flag de store Zustand ? Config Redis ? | git grep STORE pour contexte |
| `ABSTRACT_KEY` | 3 | Abstract API (email/phone validation) ? | Identifier la route qui l'utilise |
| `IPQS_KEY` | 3 | IP Quality Score — fraud detection | Documenter si feature active |
| `TURN_URL` | 2 | TURN server WebRTC pour l'entretien vocal | Confirmer si ElevenLabs ou custom |
| `VOICE_DEBUG` | 2 | Flag debug ElevenLabs | Confirmer, transformer en boolean |
| `DATABASE_URL` | 2 | Prisma ? Doublon Supabase ? | Vérifier si Prisma est encore utilisé |
| `OPENAI_BASE_URL` | 4 | Proxy OpenAI ou Azure OpenAI | Confirmer le provider |
