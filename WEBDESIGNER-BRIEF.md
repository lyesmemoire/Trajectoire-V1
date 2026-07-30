# 🎨 Brief Technique - Trajectoire
## Pour Webdesigner Externe

---

## 📋 Vue d'ensemble du projet

**Trajectoire** est une plateforme SaaS B2C de préparation aux entretiens d'embauche propulsée par l'IA.

### Fonctionnalités principales
- **Analyse de CV** : Scoring ATS, identification des points faibles, recommandations personnalisées
- **Simulations d'entretien** : Entretiens RH, techniques, managériaux avec feedback en temps réel
- **Dashboard utilisateur** : Suivi de progression, historique des simulations, évolution des scores
- **Système d'abonnement** : Intégration Stripe pour la facturation (Starter, Pro, Expert)

### Positionnement
- **Cible** : Candidats actifs en recherche d'emploi (junior à senior)
- **Tone** : Professionnel, direct, orienté résultat (copywriting en français)
- **Approche** : PLG (Product-Led Growth) - Essai gratuit sans carte bancaire

---

## 🛠 Stack Technique

### Frontend
- **Framework** : Next.js 13 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **State Management** : React hooks (useState, useEffect)
- **Optimisation images** : Next.js Image component

### Backend
- **Framework** : Next.js API Routes
- **Base de données** : PostgreSQL via Prisma ORM
- **Authentification** : Supabase Auth
- **File Storage** : Supabase Storage
- **Payment** : Stripe
- **AI/ML** : OpenAI API (GPT-4) pour l'analyse de CV et les simulations

### Infrastructure
- **Hosting** : Vercel (recommandé) ou équivalent
- **Database** : Supabase (PostgreSQL managé)
- **CDN** : Vercel Edge Network

---

## 📁 Structure du projet

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage (landing)
│   │   ├── login/             # Authentification
│   │   ├── signup/
│   │   ├── analyze/           # Page d'analyse CV
│   │   ├── dashboard/         # Dashboard utilisateur
│   │   ├── simulation/        # Configuration simulation
│   │   ├── history/           # Historique des simulations
│   │   ├── report/[id]/       # Rapport de simulation
│   │   ├── pricing/           # Page tarifs
│   │   ├── contact/           # Page contact
│   │   ├── settings/          # Paramètres compte
│   │   ├── terms/             # CGV
│   │   ├── privacy/           # Politique confidentialité
│   │   └── layout.tsx         # Layout racine
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Navigation globale
│   │   │   └── Footer.tsx     # Footer global
│   │   ├── analyze/
│   │   │   ├── CVUploader.tsx # Upload CV
│   │   │   ├── JobInput.tsx   # Input offre d'emploi
│   │   │   ├── AnalyzeButton.tsx # Bouton action
│   │   │   └── ScoreReveal.tsx # Animation score
│   │   ├── dashboard/
│   │   │   └── StatsOverview.tsx # Cartes stats
│   │   ├── audio/
│   │   │   ├── MicrophoneCheck.tsx
│   │   │   └── MicrophoneRecoveryModal.tsx
│   │   └── admin/             # Composants admin
│   │
│   └── lib/
│       ├── supabase/          # Client Supabase
│       ├── prisma.ts          # Client Prisma
│       └── quota/             # Logique quota utilisateur
│
└── public/
    └── images/                # Assets statiques
```

---

## 🎨 Design System Actuel

### Palette de couleurs (SaaS Tech)

```css
/* Fond */
--bg-primary: #F9FAFB (slate-50)
--bg-card: white

/* Texte */
--text-primary: slate-900
--text-secondary: slate-600
--text-muted: slate-500

/* Accent principal */
--accent-primary: indigo-600
--accent-hover: indigo-700
--accent-focus: indigo-500

/* Bordures */
--border: slate-200
--border-hover: slate-300

/* Boutons */
--btn-primary: slate-900
--btn-primary-hover: slate-800
--btn-secondary: indigo-600
--btn-secondary-hover: indigo-700
--btn-radius: rounded-xl (ou rounded-full pour CTA principal)

/* États */
--success: green-600
--error: red-600
--warning: amber-600
```

### Typographie

```css
/* Headings */
--font-heading: Georgia, "Times New Roman", serif (pour titres premium)
--font-display: system-ui, sans-serif (pour UI moderne)

/* Body */
--font-body: system-ui, sans-serif

/* Tailles */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
--text-4xl: 2.25rem
--text-5xl: 3rem
```

### Espacement

```css
--space-xs: 0.5rem (8px)
--space-sm: 1rem (16px)
--space-md: 1.5rem (24px)
--space-lg: 2rem (32px)
--space-xl: 3rem (48px)
--space-2xl: 4rem (64px)
```

### Arrondis

```css
--radius-sm: rounded-lg (8px)
--radius-md: rounded-xl (12px)
--radius-lg: rounded-2xl (16px)
--radius-full: rounded-full (9999px)
```

### Ombres

```css
--shadow-sm: shadow-sm
--shadow-md: shadow-md
--shadow-lg: shadow-lg
--shadow-xl: shadow-xl
```

---

## 📄 Pages existantes

### 1. Homepage (`/`)
- **Objectif** : Landing page PLG avec capture email/CV
- **Sections actuelles** :
  - Hero avec value proposition
  - Social proof (avatars + note)
  - Benefits list
  - Card upload CV + input offre
  - Preview résultat (simulation)
- **État** : Refaite récemment, design SaaS tech
- **Conformité design** : 90%

### 2. Login (`/login`)
- **Objectif** : Authentification utilisateur
- **Composants** : Email, password, lien mot de passe oublié
- **État** : Conforme design SaaS tech
- **Conformité design** : 100%

### 3. Signup (`/signup`)
- **Objectif** : Inscription utilisateur
- **Composants** : Email, password, confirmation, CGU checkbox
- **État** : Conforme design SaaS tech
- **Conformité design** : 100%

### 4. Analyze (`/analyze`)
- **Objectif** : Page d'analyse CV (après capture homepage)
- **Composants** : Upload CV, input offre, bouton analyser, résultat preview
- **État** : Partiellement conforme (indigo-500 au lieu de indigo-600)
- **Conformité design** : 80%

### 5. Dashboard (`/dashboard`)
- **Objectif** : Espace utilisateur avec progression
- **Sections** :
  - Welcome message
  - Score actuel (cercle animé)
  - Évolution score
  - Insight personnalisé
  - CTA nouvelle analyse
- **État** : **CRITIQUE** - En dark mode, doit passer en light mode
- **Conformité design** : 0%

### 6. History (`/history`)
- **Objectif** : Historique des simulations
- **Composants** : Tableau avec date, poste, niveau, type, durée, score, statut
- **État** : Utilise blue-600 au lieu de indigo-600
- **Conformité design** : 40%

### 7. Simulation (`/simulation`)
- **Objectif** : Configuration nouvelle simulation
- **Composants** : Form avec job title, niveau, type entretien, durée
- **État** : Utilise blue-600 au lieu de indigo-600
- **Conformité design** : 30%

### 8. Pricing (`/pricing`)
- **Objectif** : Page tarifs 3 plans
- **Sections** : Starter (29€), Pro (59€), Expert (99€)
- **État** : Fond white au lieu de slate-50
- **Conformité design** : 70%

### 9. Contact (`/contact`)
- **Objectif** : Page contact simple
- **Composants** : Email support, lien dashboard si connecté
- **État** : Utilise blue-600 au lieu de indigo-600
- **Conformité design** : 60%

### 10. Settings (`/settings`)
- **Objectif** : Gestion abonnement + suppression compte
- **Composants** : Bouton portail Stripe, bouton suppression
- **État** : Boutons rounded-lg au lieu de rounded-xl
- **Conformité design** : 80%

### 11. Terms (`/terms`)
- **Objectif** : CGV légales
- **État** : Conforme, pas d'accent (acceptable pour page légale)
- **Conformité design** : 80%

### 12. Privacy (`/privacy`)
- **Objectif** : Politique confidentialité
- **État** : Conforme, pas d'accent (acceptable pour page légale)
- **Conformité design** : 80%

---

## 🚨 Problèmes identifiés

### Critiques (à corriger en priorité)
1. **Dashboard** - Seule page en dark mode, rupture totale avec le reste
2. **History** - Utilise blue-600 au lieu de indigo-600
3. **Simulation** - Utilise blue-600 au lieu de indigo-600

### Moyens
4. **Contact** - Utilise blue-600 au lieu de indigo-600
5. **Analyze** - Accent indigo-500 au lieu de indigo-600
6. **Homepage** - Props theme="light" non supportées par les composants

### Mineurs
7. **Pricing** - Fond white au lieu de slate-50
8. **Settings** - Boutons rounded-lg au lieu de rounded-xl

---

## 🎯 Scope pour le webdesigner

### Mission principale
Harmoniser toutes les pages selon le design system SaaS Tech (slate-50/indigo-600) et atteindre 100% de cohérence visuelle.

### Livrables attendus

#### 1. Mise à jour des composants existants
- Corriger les incohérences de couleurs (blue → indigo)
- Uniformiser les arrondis (rounded-lg → rounded-xl)
- Harmoniser les fonds (white → slate-50)

#### 2. Refonte Dashboard (priorité #1)
- Passer du dark mode au light mode
- Adapter les composants (ScoreCircle, cartes stats)
- Maintenir la lisibilité et la hiérarchie visuelle

#### 3. Amélioration Homepage
- Intégrer les composants CVUploader, JobInput, AnalyzeButton
- Supprimer les props non supportées
- Ajouter la logique de navigation vers /analyze

#### 4. Création de composants réutilisables
Si nécessaire, créer des composants Tailwind pour :
- Boutons primaires/secondaires
- Cards
- Inputs
- Badges
- Tables

#### 5. Documentation
- Mettre à jour le design system
- Documenter les nouveaux composants
- Créer des guidelines pour les futures modifications

---

## 📐 Contraintes techniques

### Framework et outils
- **Tailwind CSS** : Utiliser uniquement les classes utilitaires Tailwind
- **Framer Motion** : Conserver les animations existantes
- **Next.js Image** : Utiliser le composant Image pour l'optimisation
- **TypeScript** : Respecter les types existants

### Performance
- Optimiser les images (WebP, compression)
- Éviter les CSS inutilisés
- Maintenir le Lighthouse score > 90

### Accessibilité
- Contraste WCAG AA minimum
- Navigation clavier
- Labels sur les inputs
- Alt text sur les images

### Responsive
- Mobile-first approach
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Test sur iOS et Android

### Browser support
- Chrome (dernières 2 versions)
- Firefox (dernières 2 versions)
- Safari (dernières 2 versions)
- Edge (dernières 2 versions)

---

## 🔧 Environnement de travail

### Installation
```bash
# Clone le repository
git clone [repository-url]
cd Trajectoire

# Install dependencies
pnpm install
# ou
npm install

# Démarrer le dev server
pnpm dev
# ou
npm run dev
```

### Structure des branches
- `main` : Production
- `develop` : Intégration
- `feature/design-update` : Branche pour les modifications design

### Processus de commit
```bash
git checkout -b feature/design-update
git add .
git commit -m "feat: harmoniser design system sur toutes les pages"
git push origin feature/design-update
```

---

## 📞 Contact

**Pour toute question technique :**
- Email : [contact@trajectoire.app]
- Repository : [GitHub URL]
- Notion : [Documentation URL]

---

## 📅 Timeline estimée

| Phase | Tâches | Temps estimé |
|-------|--------|--------------|
| **Phase 1** | Dashboard, History, Simulation | 2-3 jours |
| **Phase 2** | Contact, Analyze, Homepage | 1-2 jours |
| **Phase 3** | Pricing, Settings, Documentation | 1 jour |
| **Total** | Harmonisation complète | **4-6 jours** |

---

## ✅ Checklist de validation

- [ ] Toutes les pages utilisent slate-50 comme fond principal
- [ ] Toutes les pages utilisent indigo-600 comme accent principal
- [ ] Toutes les bordures utilisent slate-200
- [ ] Tous les boutons utilisent rounded-xl (ou rounded-full pour CTA)
- [ ] Dashboard passé en light mode
- [ ] Homepage fonctionnelle avec navigation vers /analyze
- [ ] Props theme="light" supprimées
- [ ] Design system documenté
- [ ] Tests responsive effectués
- [ ] Tests accessibilité effectués
- [ ] Performance Lighthouse > 90

---

## 🎨 Assets disponibles

### Images
- `/images/hero-professional.jpg` - Image hero homepage
- `/avatars/1.jpg`, `/avatars/2.jpg`, `/avatars/3.jpg` - Avatars social proof

### Icônes
- Lucide React (installé)
- Utiliser les icônes existantes ou en ajouter si nécessaire

### Fonts
- System fonts (Georgia pour headings, system-ui pour body)
- Pas de fonts externes requises

---

*Document généré le 22 juillet 2026*
*Version : 1.0*
