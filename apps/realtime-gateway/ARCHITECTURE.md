# Realtime Gateway V3 — Architecture Officielle

## Statut
Ce service est le **moteur exclusif** de l'entretien vocal de Trajectoire.
Toutes les routes d'entretien dans `app/api/interview/` sont dépréciées
au profit de ce Gateway.

## Stack Vocale

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| STT | Deepgram | nova-2 (fr) | Transcription streaming temps réel |
| TTS | ElevenLabs | eleven_turbo_v2_5 | Voix de l'avatar recruteur |
| Transport | WebSocket binaire | — | Audio PCM 16kHz bidirectionnel |
| Auth | JWT custom | — | verifyVoiceToken() |
| DB | Supabase | — | interview_sessions (table unifiée) |
| Cache | Redis | — | Circuit breaker + rate limiting |

## Flux de Connexion Client

```
1. POST /api/interviews/init
   Body : { job_offer_text, target_role, atsReportId? }
   Response : { sessionId (UUID), token (JWT), wsUrl }

2. WebSocket wsUrl?token=JWT
   → onopen : Gateway démarre le contexte d'entretien
   → send(PCM ArrayBuffer) : Audio micro du candidat
   → onmessage(ArrayBuffer) : Audio ElevenLabs (réponse recruteur)
   → onmessage(JSON) : { type: "transcript" | "state" | "score" }

3. Fin de session
   → ws.close(1000) : Fermeture propre
   → Gateway persiste voice_report dans interview_sessions
```

## Injection ATS (Bridge)

Si `atsReportId` est fourni dans /init :
- Le Gateway charge le `munition_pack` depuis `premium_ats_reports`
- Vérifie l'ownership (user_id = auth user)
- Injecte la première munition dans le prompt LLM
- La première question difficile cible la faille exacte détectée par l'ATS

## Variables d'Environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| ELEVENLABS_API_KEY | ✅ | Clé API ElevenLabs |
| ELEVENLABS_VOICE_ID | ✅ | ID de la voix du recruteur avatar |
| DEEPGRAM_API_KEY | ✅ | Clé API Deepgram |
| NEXT_PUBLIC_GATEWAY_URL | ✅ | URL publique du Gateway (front-end) |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | Accès admin Supabase (webhook/cron) |
| TURN_URL | ⬜ | TURN server WebRTC (optionnel) |

## Routes Dépréciées

Ces routes dans `app/api/interview/` sont dépréciées :

| Route | Statut | Consommateurs | Plan |
|-------|--------|---------------|------|
| /api/interview/transcribe | ⚠️ Déprécié | useSpeechAnalysis, VoiceResponsePanel | Migrer vers Gateway STT |
| /api/interview/start | ⚠️ Déprécié | session/page.tsx, E2E tests | Migrer vers /api/interviews/init |
| /api/interview/premium/start | ❌ Supprimé | — | — |
| /api/interview/answer | ❌ Supprimé | — | — |
| /api/interview/question | ❌ Supprimé | — | — |

## Résilience Frontend

Le hook `useVoiceInterview.ts` implémente :
- Reconnexion automatique : 3 tentatives, backoff exponentiel (1s, 2s, 4s)
- Fallback audio : AudioWorklet → ScriptProcessor si non supporté
- Erreurs typées : MIC_DENIED, MIC_NOT_FOUND, WS_FAILED, RECONNECT_EXHAUSTED
- Cleanup exhaustif : stream micro, AudioContext, WebSocket, timers

## Prochaine Migration

Pour supprimer les routes dépréciées restantes :
1. Migrer `VoiceResponsePanel.tsx` pour utiliser le hook `useVoiceInterview`
   au lieu d'appeler `/api/interview/transcribe`
2. Migrer `session/page.tsx` pour appeler `/api/interviews/init`
   au lieu de `/api/interview/start`
3. Mettre à jour `06-interview-module.spec.ts` avec les nouveaux endpoints
4. Supprimer les 2 routes dépréciées restantes
