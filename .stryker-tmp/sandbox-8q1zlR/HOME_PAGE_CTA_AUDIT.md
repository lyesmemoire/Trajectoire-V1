# 🔍 HOME PAGE CTA AUDIT

Ce document est le résultat de l'audit systématique de tous les Call-To-Action (boutons, liens, redirections) présents dans les composants marketing et landing de la Home Page.

## 📊 Résultat de l'Audit

| Composant | Bouton / Lien | Action Détectée | Route / Cible | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **HeroSection** | Primaire (Commencer) | `<Link>` | `/onboarding` | ✅ OK |
| **HeroSection** | Secondaire (Produit) | `<Link>` | `/product` | ✅ OK |
| **Navbar** | Connexion | `<Link>` | `/auth/login` (dynamique) | ✅ OK |
| **Navbar** | Inscription | `<Link>` | `/auth/signup` (dynamique) | ✅ OK |
| **Navbar** | Ancres (Features, etc.) | `<a href>` | `#features`, `#how`, etc. | ✅ OK |
| **InstantInterviewDemo** | Lancer l'entraînement | `<Link>` | `/onboarding` | ✅ OK |
| **MiniPressureTest** | Test complet | `<Link>` | `/onboarding` | ✅ OK |
| **Pricing / Preview** | Commencer l'entraînement | `<Link>` | `/auth/signup` | ✅ OK |
| **Pricing / Preview** | Voir tous les plans | `<Link>` | `/pricing` | ✅ OK |
| **FinalCTA** | Révéler mon Career DNA | `<Link>` | `/auth/signup` | ✅ OK |
| **FAQSection** | Accordéon (Toggle) | `onClick` (State) | N/A (UI Locale) | ✅ OK |
| **WaitlistForm** | Soumission Email | `onClick` / `submit` | API Call (interne) | ✅ OK |
| **ExitIntent** | "Recevoir mon guide" | `onSubmit` | Formulaire Local | ✅ OK |
| **ExitIntent** | "Lancer mon Test Gratuit" (Success) | `onClick={() => setShow(false)}` | ⚠️ **Ferme juste la modale** | ❌ **BROKEN** |
| **ExposureTestButton** | Lancer le Test d'Exposition | `router.push("/signup")` | ⚠️ **`/signup` (n'existe pas)** | ❌ **BROKEN** |

---

## 🚨 Découvertes Critiques (Production Blockers)

L'audit révèle que ton niveau de prudence était justifié. Bien que la vaste majorité des CTA soient parfaitement opérationnels et pointent vers les bonnes routes (`/auth/signup`, `/onboarding`), **deux failles de conversion ont été détectées** :

### 1. Le "Dark Pattern" involontaire de l'ExitIntent
Dans le composant `ExitIntent.tsx`, lorsqu'un utilisateur soumet son email pour recevoir le guide, un écran de succès apparaît avec un bouton **"Lancer mon Test Gratuit"**. 
Cependant, ce bouton ne redirige nulle part. Son seul code est `onClick={() => setShow(false)}`. L'utilisateur retourne juste sur la home page au lieu d'être envoyé vers `/onboarding` ou `/auth/signup`. C'est une perte sèche de conversion.

### 2. Route inexistante dans ExposureTestButton
Dans le composant `exposure-test-button.tsx`, le bouton utilise `router.push("/signup")`. Or, l'arborescence Next.js de ce projet utilise le dossier `app/auth/signup`. Ce bouton mène donc vers une page 404.

## 🧭 Conclusion
Ton intuition était la bonne. Le travail de fond est fait, mais une passe de correction s'impose sur les CTA marginaux avant de lancer le trafic. Je me tiens prêt à corriger ces deux éléments !
