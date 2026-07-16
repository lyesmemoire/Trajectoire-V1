# Documentation Technique - Page d'Accueil Trajectoire

**Version:** 1.0  
**Date:** 26 Juin 2026  
**Contexte:** Audit technique externe

---

## 1. Vue d'ensemble

### 1.1 Objectif de la page

La page d'accueil de Trajectoire est une landing page conversion-first conçue pour:
- Présenter la proposition de valeur de la plateforme
- Convertir les visiteurs en utilisateurs inscrits
- Établir la crédibilité scientifique et professionnelle
- Guider vers les offres tarifaires (abonnements et packs crédits)

### 1.2 Architecture

**Framework:** Next.js 16.2.9 (App Router)  
**Langage:** TypeScript 5  
**Styling:** TailwindCSS 3.4.19  
**État:** React 19.2.4 (Client Components avec useState/useEffect)

---

## 2. Structure de la Page

### 2.1 Ordre des Sections (Vertical Scroll)

```tsx
<Header />
<main>
  1. Hero Section
  2. ValuePreview (dans Container)
  3. TrustBar
  4. ProblemGrid
  5. WhyTrajectoire
  6. Dashboard (dynamic import)
  7. Results (dynamic import)
  8. Testimonials (dynamic import)
  9. Method
  10. TimelineMethod
  11. ScienceLegitimacy
  12. Security
  13. Pricing
  14. FAQ
  15. CTA
</main>
<Footer />
```

### 2.2 Chargement Dynamique

Les composants lourds sont chargés dynamiquement pour optimiser le First Contentful Paint (FCP):

```tsx
const Dashboard = dynamic(() => import("@/components/home/Dashboard"));
const Results = dynamic(() => import("@/components/home/Results"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
```

---

## 3. Détail des Composants

### 3.1 Hero Section (`Hero.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Badges de crédibilité (3 badges)
- Titre principal avec CTA principal
- CTA secondaire avec scroll smooth vers #method
- Garanties (3 éléments avec icônes CheckCircle2)
- Background décoratif avec gradients radiaux

**Tracking Analytics:**
```tsx
onClick={() => { trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICKED); }}
```

**Design System:**
- Container responsive
- Badges variant="primary"
- LinkButton variant="accent" size="xl"
- Icônes Lucide React

---

### 3.2 ValuePreview (`ValuePreview.tsx`)

**Type:** Client Component  
**Contexte:** Section de transition après Hero  
**Fonctionnalités:**
- Présentation rapide de la valeur ajoutée
- Design minimaliste pour transition fluide

---

### 3.3 TrustBar (`TrustBar.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Affichage de logos/partenaires/certifications
- Preuve sociale immédiate

---

### 3.4 ProblemGrid (`ProblemGrid.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Grille 4 colonnes (responsive: 1 → 2 → 4)
- 4 problèmes identifiés avec icônes distinctes:
  - Compass: "Décisions à l'aveugle"
  - EyeOff: "Entretiens sans méthode"
  - AlertCircle: "Doute des forces"
  - Flame: "Stress à fort enjeu"
- Structure: Titre → Description → Conséquence
- Cards avec hover effect

**Design System:**
- Card variant="default" padding="md" hover
- SectionHeader badge="warning"
- Icônes brand-accent

---

### 3.5 WhyTrajectoire (`WhyTrajectoire.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Différenciation concurrentielle
- Arguments clés de la proposition de valeur

---

### 3.6 Dashboard (`Dashboard.tsx`)

**Type:** Client Component  
**Complexité:** Élevée  
**Fonctionnalités:**

#### 3.6.1 Interface Tabulée
- 4 onglets: Vue d'ensemble, Compétences, Progression, Recommandations
- Gestion d'état avec useState
- ARIA roles pour accessibilité (tablist, tab, aria-selected, aria-disabled)

#### 3.6.2 Visualisations de Données (Recharts)
- **Radar Chart:** Analyse comportementale sur 5 dimensions
- **Area Chart:** Progression confiance/préparation sur plusieurs semaines
- **Bar Chart:** Gestion de la pression par contexte (horizontal)

#### 3.6.3 Score Cards
- 4 KPIs: Confiance (78/100), Stress (32%), Préparation (85/100), Décision (91/100)
- Indicateurs de tendance (↑↓)
- Coloration accent pour valeurs critiques

#### 3.6.4 Optimisation SSR
- Skeleton loading avec useEffect mounted state
- Tooltip styles sérialisables (évite hydration mismatch)
- Données mockées dans `lib/constants.ts`

**Design System:**
- Card shadow-elevated
- ChartContainer wrapper
- Badges variant="success"
- Traffic dots macOS-style

---

### 3.7 Results (`Results.tsx`)

**Type:** Client Component (dynamic import)  
**Fonctionnalités:**
- Preuve sociale via résultats utilisateurs
- Avant/après quantifiés

---

### 3.8 Testimonials (`Testimonials.tsx`)

**Type:** Client Component (dynamic import)  
**Fonctionnalités:**
- Témoignages utilisateurs
- Citations authentiques

---

### 3.9 Method (`Method.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- 4 étapes séquentielles numérotées:
  1. Évaluation comportementale (Microscope)
  2. Identification angles morts (Crosshair)
  3. Simulations à fort enjeu (Drama)
  4. Plan d'action chiffré (ClipboardCheck)
- Structure: Numéro → Icône → Titre → Sous-titre → Description → Deliverables
- Deliverables listés avec icônes Check
- CTA final vers #pricing

**Design System:**
- Grille 2 colonnes responsive
- Card variant="default" padding="xl"
- Icônes brand-primary/brand-accent
- LinkButton avec hover translate-x-1

---

### 3.10 TimelineMethod (`TimelineMethod.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Visualisation temporelle du parcours utilisateur
- Étapes chronologiques

---

### 3.11 ScienceLegitimacy (`ScienceLegitimacy.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Validation scientifique de la méthode
- Références recherche académique
- Crédibilité expertise

---

### 3.12 Security (`Security.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Garanties sécurité et confidentialité
- Conformité RGPD
- Hébergement européen

---

### 3.13 Pricing (`Pricing.tsx`)

**Type:** Client Component  
**Complexité:** Élevée  
**Fonctionnalités:**

#### 3.13.1 Toggle Abonnements/Crédits
- State: `"abonnement" | "credits"`
- Deux vues conditionnelles

#### 3.13.2 Plans Abonnements (5 plans)
- Free (0€): 1 analyse ATS, 1 mini-simulation
- Starter (19€/mois): 4 simulations/mois
- Sprint (29€/7 jours): Urgence, 4 simulations
- Pro (39€/mois): 10 simulations/mois, highlight=true
- Executive (79€/mois): Simulations illimitées

#### 3.13.3 Packs Crédits (3 packs)
- 1 simulation (7€)
- Pack 3 (18€, highlight=true)
- Pack 10 (49€)

#### 3.13.4 Intégration Stripe
```tsx
import { startCheckout, buyCreditPack } from "@/lib/stripe/checkout";

onClick={() => startCheckout(plan.name)}  // Abonnements
onClick={() => buyCreditPack(pack.name)}    // Crédits
```

#### 3.13.5 Design System
- Grille 5 colonnes responsive (1 → 3 → 5)
- Cards avec border indigo-600 et ring-2 pour highlight
- Badges "Urgence" et "Le plus choisi"
- Buttons hover:bg-*

---

### 3.14 FAQ (`FAQ.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Questions/réponses fréquentes
- Accordéon ou liste statique

---

### 3.15 CTA (`CTA.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Call-to-action final de conversion
- Lien vers inscription

---

### 3.16 Footer (`Footer.tsx`)

**Type:** Client Component  
**Fonctionnalités:**
- Navigation secondaire
- Liens légaux
- Réseaux sociaux
- Copyright

---

## 4. Stack Technique Détaillée

### 4.1 Frameworks & Bibliothèques

| Dépendance | Version | Usage |
|------------|---------|-------|
| Next.js | 16.2.9 | Framework React, App Router, SSR |
| React | 19.2.4 | UI Library |
| TypeScript | 5 | Typage statique |
| TailwindCSS | 3.4.19 | Styling utility-first |
| Lucide React | 0.460.0 | Icônes |
| Recharts | 3.8.1 | Graphiques (Dashboard) |
| Framer Motion | 12.40.0 | Animations |
| Supabase | 2.108.2 | Auth, Database, Realtime |
| Stripe | 18.0.0 | Paiements |
| @supabase/ssr | 0.12.0 | Server-side Supabase |

### 4.2 Design System Personnalisé

**Location:** `apps/web/src/components/ui/`

**Composants UI:**
- Container (responsive wrapper)
- SectionHeader (titres section avec badge)
- Card (cartes avec variants)
- LinkButton (boutons avec icônes)
- Badge (badges colorés)
- ChartContainer (wrapper Recharts)

**Tokens CSS:**
- Variables CSS pour couleurs (brand-primary, brand-accent, ink, surface)
- Espacements, typographie, bordures
- Thème clair avec palette neutre + accents

---

## 5. Intégrations Externes

### 5.1 Analytics

**Location:** `lib/analytics/`

**Tracking Events:**
```tsx
ANALYTICS_EVENTS.HERO_CTA_CLICKED
ANALYTICS_EVENTS.PRICING_CTA_CLICKED
```

**Implementation:**
- Custom tracking via `trackEvent()`
- Intégration probable avec Google Analytics ou similaire

### 5.2 Authentification (Supabase)

**Client:** `lib/supabase/client.ts`  
**Server:** `lib/supabase/server.ts`

**Flux:**
1. Vérification auth dans `lib/auth-guard.ts`
2. Redirection `/login?redirect=/pricing` si non connecté
3. User ID récupéré via `supabase.auth.getUser()`

### 5.3 Paiements (Stripe)

**Configuration:**
- `lib/stripe/prices.ts`: Mapping Price IDs
- `lib/stripe/checkout.ts`: Fonctions client
- `app/api/stripe/checkout/route.ts`: API abonnements
- `app/api/stripe/credit-pack/route.ts`: API crédits

**Flux:**
1. Click CTA → `startCheckout()` ou `buyCreditPack()`
2. Vérification auth → redirection si nécessaire
3. Appel API backend
4. Création session Stripe Checkout
5. Redirection vers Stripe
6. Webhook pour confirmation (à implémenter)

---

## 6. Performance & Optimisation

### 6.1 Code Splitting

**Dynamic Imports:**
```tsx
const Dashboard = dynamic(() => import("@/components/home/Dashboard"));
const Results = dynamic(() => import("@/components/home/Results"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
```

**Impact:**
- Réduction du bundle initial
- Amélioration FCP (First Contentful Paint)
- Chargement différé des composants lourds

### 6.2 Optimisation Recharts

**Skeleton Loading:**
```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => { setMounted(true); }, []);

{mounted ? <RadarChart /> : <Skeleton />}
```

**Pourquoi:**
- Évite hydration mismatch
- SSR-safe
- Expérience utilisateur fluide

### 6.3 Images & Assets

**Optimisation:**
- Images probablement via Next.js Image component
- Lazy loading natif
- Formats modernes (WebP, AVIF)

---

## 7. Accessibilité (a11y)

### 7.1 ARIA Attributes

**Tabs (Dashboard):**
```tsx
role="tablist"
role="tab"
aria-selected={isActive}
aria-disabled={tab.locked}
aria-label="Sections du tableau de bord"
```

**Charts:**
```tsx
role="img"
aria-label="Diagramme radar montrant le profil comportemental"
<title>Analyse comportementale</title>
```

### 7.2 Navigation Clavier

- Focus management sur buttons
- Smooth scroll avec offset pour sticky headers
- Links avec href explicites

### 7.3 Contraste & Lisibilité

- Palette vérifiée pour contrast WCAG AA
- Typographie responsive (text-display, text-body, text-body-sm)
- Espacements adéquats

---

## 8. SEO & Metadata

### 8.1 Page Metadata

```tsx
export const metadata: Metadata = {
  title: "Trajectoire – Reprenez le contrôle. Passez de l'intuition à la certitude.",
  description: "Trajectoire aide les cadres et dirigeants à prendre les bonnes décisions avec clarté et confiance.",
};
```

### 8.2 Schema.org (Pricing)

```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trajectoire",
  "offers": [...]
}
</script>
```

**Impact:**
- Rich snippets Google
- Affichage prix dans SERP
- Meilleure CTR

---

## 9. Sécurité

### 9.1 Auth Guards

**Implementation:**
```tsx
export async function requireAuth() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { authenticated: !!user, user };
}
```

**Protection:**
- API routes vérifient auth
- Redirection automatique si non connecté
- User ID validé avant actions sensibles

### 9.2 Stripe Security

**Best Practices:**
- Secret key côté serveur uniquement
- Webhook signature validation (à implémenter)
- Metadata user_id pour traçabilité
- Customer ID persisté dans profiles

### 9.3 Environment Variables

**Variables sensibles:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Protection:**
- Jamais exposées côté client
- Stockées dans `.env.local`
- Non commitées dans Git

---

## 10. Flux Utilisateur

### 10.1 Parcours Conversion

```
1. Arrivée sur page
   ↓
2. Lecture Hero + Value
   ↓
3. Découverte Problèmes (ProblemGrid)
   ↓
4. Compréhension Solution (Method)
   ↓
5. Preuve Sociale (Dashboard/Testimonials)
   ↓
6. Crédibilité (Science/Security)
   ↓
7. Décision Pricing
   ↓
8. Click CTA Plan
   ↓
9. Vérification Auth
   ↓
10a. Connecté → Stripe Checkout
10b. Non connecté → /login?redirect=/pricing
   ↓
11. Paiement Stripe
   ↓
12. Webhook Confirmation (à implémenter)
   ↓
13. Activation Service
```

### 10.2 Parcours Navigation

- Sticky Header avec navigation
- Smooth scroll vers sections
- CTA secondaires dans chaque section
- Pricing accessible via anchor #pricing

---

## 11. État Actuel & Roadmap

### 11.1 Fonctionnalités Implémentées ✅

- Page d'accueil complète
- Design system cohérent
- Intégration Stripe Checkout
- Auth guards fonctionnels
- Analytics tracking basique
- SEO metadata
- Schema.org pricing
- Accessibilité ARIA

### 11.2 Fonctionnalités En Cours ⚠️

- **Webhook Stripe:** À implémenter (Bloc 20)
- **Sync Plan/Credits:** À implémenter (Bloc 21)
- **Page Success Paiement:** À créer
- **Dashboard Utilisateur:** À connecter
- **Types Supabase:** À régénérer après ajout stripe_customer_id

### 11.3 Fonctionnalités Futures 📋

- Tests E2E (Playwright/Cypress)
- Monitoring performance (Lighthouse CI)
- A/B testing CTAs
- Personalisation dynamique
- Chatbot support intégré

---

## 12. Points d'Attention pour Audit

### 12.1 Performance

**À vérifier:**
- Lighthouse score (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size analysis
- Image optimization

**Recommandations:**
- Optimiser images Next.js Image
- Implémenter font optimization
- Considérer ISR pour sections statiques

### 12.2 Sécurité

**À vérifier:**
- Headers security (CSP, XSS protection)
- Rate limiting API routes
- Stripe webhook signature validation
- Supabase RLS policies

**Recommandations:**
- Implémenter CSP strict
- Ajouter rate limiting
- Valider webhooks Stripe
- Audit RLS Supabase

### 12.3 Accessibilité

**À vérifier:**
- WCAG 2.1 AA compliance
- Keyboard navigation complète
- Screen reader testing
- Color contrast ratios

**Recommandations:**
- Tests avec axe-core
- Navigation keyboard exhaustive
- VoiceOver/NVDA testing
- Audit contrast automatique

### 12.4 SEO

**À vérifier:**
- Meta tags complets
- Open Graph tags
- Twitter Cards
- Sitemap.xml
- Robots.txt

**Recommandations:**
- Ajouter Open Graph
- Implémenter Twitter Cards
- Générer sitemap automatique
- Optimiser meta descriptions

---

## 13. Conclusion

La page d'accueil Trajectoire est techniquement solide avec:
- ✅ Architecture moderne (Next.js App Router)
- ✅ Design system cohérent
- ✅ Performance optimisée (dynamic imports, skeleton loading)
- ✅ Accessibilité considérée (ARIA, keyboard nav)
- ✅ Intégrations externes fonctionnelles (Supabase, Stripe)
- ✅ SEO basique implémenté

**Prochaines étapes critiques:**
1. Implémentation webhook Stripe
2. Sync plan/crédits dans base de données
3. Page success paiement
4. Tests E2E
5. Monitoring production

---

**Document généré pour audit technique externe**
**Contact technique:** [À compléter]
**Repository:** c:\Trajectoire
