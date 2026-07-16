# ✅ QA Checklist — AI Career Copilot

> À compléter avant chaque déploiement en production

## 🔧 Configuration & Environnement

- [ ] Toutes les variables `.env.local` sont remplies (vérifier via /api/health)
- [ ] `/api/health` retourne `"overall": "HEALTHY"`
- [ ] Les clés Stripe sont bien en mode LIVE (pas TEST) pour la production
- [ ] L'URL du Webhook Stripe est mise à jour dans le dashboard Stripe

## 🏠 Landing Page (Homepage)

- [ ] La page se charge en moins de 3 secondes
- [ ] Le bouton "Commencer gratuitement" redirige vers `/auth/signup`
- [ ] Le bouton "Se connecter" redirige vers `/auth/login`
- [ ] Les accordéons FAQ s'ouvrent et se ferment
- [ ] Les liens de la navbar fonctionnent (ancres vers les sections)
- [ ] Le footer contient les liens CGU et Politique de confidentialité
- [ ] Responsive OK sur iPhone 12 (375px)
- [ ] Responsive OK sur iPad (768px)
- [ ] Responsive OK sur Desktop (1440px)

## 🔐 Authentification

- [ ] **Signup** : Créer un nouveau compte avec email/password → reçoit email de confirmation
- [ ] **Signup** : Tentative avec email déjà utilisé → message d'erreur
- [ ] **Google OAuth** : Cliquer sur "Continuer avec Google" → pop-up Google s'ouvre
- [ ] **Login** : Se connecter avec le compte créé → redirection vers Dashboard
- [ ] **Login** : Mauvais mot de passe → message d'erreur clair (pas de crash)
- [ ] **Logout** : Bouton de déconnexion → supprime la session et redirige vers /
- [ ] **Protection des routes** : Accéder à /dashboard sans être connecté → redirige vers /auth/login

## 📊 Dashboard

- [ ] Le compteur de crédits affiche le bon nombre (2 crédits à l'inscription)
- [ ] La navigation entre les sections fonctionne (ATS, Interview, Historique)
- [ ] Les données de l'utilisateur (nom, email) s'affichent correctement

## 📄 Module ATS (Analyseur de CV)

- [ ] Uploader un PDF de CV → analyse générée avec score, points forts, points faibles
- [ ] Uploader un fichier .docx → message d'erreur "Seuls les PDFs sont acceptés"
- [ ] Uploader un PDF de +5MB → message d'erreur de taille
- [ ] Laisser la description du poste vide → message d'erreur de validation
- [ ] Après une analyse : 1 crédit est bien débité du solde

## 🎙️ Mock Interview Lab

- [ ] Sélectionner un persona (Big Tech, Startup, DRH) → le formulaire accepte la sélection
- [ ] Cliquer "Lancer l'interview" → 1 crédit est débité AVANT le premier échange
- [ ] L'IA répond avec le bon persona (ton, style)
- [ ] Le texte de réponse s'affiche en streaming (effet frappe au clavier)
- [ ] Envoyer plusieurs messages → l'IA se souvient du contexte
- [ ] Cliquer "Terminer et obtenir mon feedback" → rapport final généré avec score et conseils
- [ ] La session est bien sauvegardée dans l'historique

## 💳 Paiement Stripe

- [ ] Cliquer sur un plan de prix → redirige vers Stripe Checkout
- [ ] Utiliser la carte de test `4242 4242 4242 4242` → paiement accepté
- [ ] Après paiement → les crédits sont bien ajoutés au compte Supabase
- [ ] Utiliser la carte de test `4000 0000 0000 9995` → paiement refusé → message d'erreur
- [ ] Le webhook Stripe reçoit bien l'événement (vérifier dans le dashboard Stripe → Webhooks → Logs)

## 🛡️ Sécurité & Performance

- [ ] Rate limiting actif : faire 15+ requêtes en 1 minute → 429 reçu
- [ ] Le webhook Stripe rejette les requêtes sans signature valide
- [ ] Les pages /dashboard/\* ne sont pas accessibles sans authentification
- [ ] Score Lighthouse Performance > 80
- [ ] Score Lighthouse Accessibility > 90
- [ ] Pas d'erreurs dans la console du navigateur (F12)
