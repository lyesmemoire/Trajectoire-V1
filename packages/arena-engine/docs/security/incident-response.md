# 🚨 Plan de Réponse aux Incidents — StudioEntretien.fr

Ce document définit les actions immédiates en cas de faille de sécurité ou de fuite de données.

## 🏃 Actions Immédiates (T=0)

1. **Isolation :** Couper les clés API Mistral et OpenAI si suspicion de fuite de prompts ou d'audio.
2. **Invalidation :** Forcer la déconnexion de toutes les sessions actives via Supabase/NextAuth.
3. **Rotation :** Changer les secrets d'environnement (`API_SIGNING_SECRET`, `STRIPE_WEBHOOK_SECRET`).

## 📞 Escalade & Communication

- **Interne :** Alerter le CTO et le responsable sécurité.
- **Externe (si PII affectées) :** Notification à la CNIL sous 72h. Information transparente des utilisateurs via email Resend.

## 🔍 Investigation post-mortem

- Analyse des logs `AdminAuditLog` pour identifier l'origine (interne vs externe).
- Revue du `Behavioral Graph` pour détecter des patterns d'exfiltration.
