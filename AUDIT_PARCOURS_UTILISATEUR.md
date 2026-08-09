# Audit Parcours Utilisateur - Que vit un candidat aujourd'hui ?

**Date :** 5 août 2026  
**Objectif :** Analyser le parcours utilisateur depuis l'arrivée sur la plateforme jusqu'à la première valeur

---

## Réponses aux Questions Critiques

### 1. Est-ce que la homepage permet déjà de déposer un CV ?
**✅ OUI**

La homepage (`apps/web/src/app/page.tsx`) inclut :
- Composant `CVUploader` fonctionnel avec drag & drop
- Validation des fichiers (PDF, DOCX, TXT, max 5MB)
- Champ optionnel pour la description du poste
- Bouton "Analyser" qui redirige vers `/analyze` si un fichier est sélectionné

**Code :** Ligne 145-160 de `page.tsx`
```tsx
<CVUploader file={file} onFile={setFile} />
<JobInput value={job} onChange={setJob} />
<Link href={canAnalyze ? "/analyze" : "#"} className={!canAnalyze ? "pointer-events-none block" : "block"}>
  <AnalyzeButton disabled={!canAnalyze} loading={loading} onClick={() => { if (canAnalyze) setLoading(true) }} />
</Link>
```

---

### 2. Est-ce que l'analyse ATS fonctionne réellement sans connexion ?
**✅ OUI**

L'API `/api/public/analyze-preview` fonctionne **SANS authentification** :
- Route publique (pas de vérification utilisateur)
- Rate limiting par IP (3 requêtes/heure via Upstash Redis)
- Validation du CV et de la description du poste
- Génération d'une preview avec score, forces, faiblesses
- Timeout de 8 secondes pour l'analyse IA

**Code :** `apps/web/src/app/api/public/analyze-preview/route.ts` - Ligne 9-96

**Preuve :** Aucune vérification Supabase ou middleware sur cette route

---

### 3. Est-ce que l'utilisateur est redirigé vers /signup avant l'analyse ?
**❌ NON**

Le parcours actuel :
1. Homepage → Upload CV → Clic "Analyser"
2. Redirection vers `/analyze` (pas `/signup`)
3. L'utilisateur voit le formulaire d'analyse
4. Clic "Analyser" → Appel API `/api/public/analyze-preview`
5. **Résultat affiché immédiatement** (pas d'inscription requise)

**Code :** `apps/web/src/app/page.tsx` - Ligne 148-160
```tsx
<Link href={canAnalyze ? "/analyze" : "#"} ...>
```

---

### 4. Est-ce que le résultat ATS est affiché avant la création du compte ?
**✅ OUI**

La page `/analyze` affiche les résultats **avant toute inscription** :
- Formulaire d'upload (si pas encore de fichier)
- Clic "Analyser" → Appel API
- Affichage du résultat : score, gapToOptimal, percentile, strengths, weakness, radarDimensions
- Bouton "Nouvelle analyse" pour recommencer
- **Aucun CTA vers l'inscription** dans les résultats

**Code :** `apps/web/src/app/analyze/page.tsx` - Ligne 80-96
```tsx
{preview ? (
  <div className="w-full bg-white p-8 rounded-2xl border border-ivoire-200 shadow-sm shadow-ivoire-200/50">
    <h2 className="text-2xl font-bold text-ink-900 mb-4">Résultat de l'analyse</h2>
    <div className="bg-ivoire-50 p-4 rounded-lg">
      <pre className="text-sm text-ink-700 whitespace-pre-wrap">{JSON.stringify(preview, null, 2)}</pre>
    </div>
    <button onClick={() => { setPreview(null); setFile(null); setJob("") }} ...>
      Nouvelle analyse
    </button>
  </div>
) : ...}
```

---

### 5. Est-ce que les données de l'analyse sont conservées après inscription ?
**❌ NON**

**Problème critique identifié :**
- L'analyse preview est stockée dans le state React local (`preview`)
- Pas de sauvegarde dans la base de données
- Pas de mécanisme pour "récupérer" l'analyse après inscription
- Si l'utilisateur s'inscrit après l'analyse, **les données sont perdues**

**Conséquence :** L'utilisateur doit refaire l'analyse après inscription, ce qui crée une friction inutile.

---

### 6. Combien de clics faut-il entre l'arrivée sur le site et la première valeur ?
**2-3 clics**

**Parcours optimal :**
1. **Clic 1** : Sélectionner/déposer le CV dans l'uploader
2. **Clic 2** : Cliquer sur le bouton "Analyser"
3. **Clic 3** (optionnel) : Cliquer sur "Analyser" dans la page `/analyze`

**Temps jusqu'à la première valeur :** ~30-60 secondes (upload + analyse IA)

---

## Parcours Utilisateur Complet

### Scénario 1 : Utilisateur qui veut juste tester (sans inscription)

```
1. Arrivée sur homepage
   ↓
2. Upload CV (drag & drop ou clic)
   ↓
3. Clic "Analyser" → Redirection vers /analyze
   ↓
4. Clic "Analyser" → Appel API /api/public/analyze-preview
   ↓
5. Affichage du résultat (score, forces, faiblesses)
   ↓
6. L'utilisateur voit la valeur mais ne peut pas la sauvegarder
   ↓
7. L'utilisateur quitte ou doit s'inscrire pour continuer
```

**Problème :** Pas de CTA clair vers l'inscription après avoir vu le résultat. L'utilisateur peut partir sans s'inscrire.

---

### Scénario 2 : Utilisateur qui s'inscrit après l'analyse

```
1. Arrivée sur homepage
   ↓
2. Upload CV + Analyse
   ↓
3. Voir le résultat
   ↓
4. L'utilisateur veut sauvegarder → Doit aller manuellement sur /signup
   ↓
5. Inscription (email + password)
   ↓
6. Confirmation email
   ↓
7. Connexion
   ↓
8. Redirection vers /onboarding (5 étapes)
   ↓
9. Dashboard
   ↓
10. L'utilisateur doit REFAIRE l'analyse (données perdues)
```

**Problème majeur :** Les données de l'analyse preview sont perdues après inscription.

---

## Problèmes Identifiés

### 🔴 Critiques

1. **Pas de conservation des données preview**
   - L'analyse est perdue après inscription
   - L'utilisateur doit refaire l'analyse
   - Friction inutile qui tue la conversion

2. **Pas de CTA vers l'inscription après le résultat**
   - L'utilisateur voit la valeur mais pas d'incitation à s'inscrire
   - Pas de "Créer un compte pour sauvegarder ce résultat"
   - Taux de conversion probablement très bas

3. **Pas de tracking du parcours**
   - Aucun événement tracé (signup, login, first_cv_upload, etc.)
   - Impossible de mesurer le taux de conversion
   - Impossible d'optimiser le funnel

### 🟡 Majeurs

4. **Résultat affiché en JSON brut**
   - Les résultats sont affichés en `JSON.stringify(preview, null, 2)`
   - Pas de mise en forme visuelle
   - Pas de graphiques ou visualisations
   - Expérience utilisateur pauvre

5. **Pas de réassurance avant l'analyse**
   - Pas de mention "Gratuit et sans engagement"
   - Pas de mention "Vos données ne sont pas conservées"
   - Peut effrayer certains utilisateurs

6. **Rate limiting trop restrictif**
   - 3 analyses/heure par IP
   - Peut bloquer des utilisateurs légitimes
   - Pas de message clair quand la limite est atteinte

### 🟢 Mineurs

7. **Pas de personnalisation du résultat**
   - Le même résultat pour tout le monde
   - Pas d'adaptation selon le profil
   - Pas de recommandations personnalisées

8. **Pas de social proof**
   - Pas de témoignages
   - Pas de nombre d'utilisateurs
   - Pas de logos d'entreprises

---

## Recommandations Prioritaires

### 1. Conserver les données de l'analyse preview (CRITIQUE)

**Solution :**
- Stocker l'analyse preview dans une table temporaire (avec un token)
- Passer le token dans l'URL après inscription
- Récupérer l'analyse et la sauvegarder dans le compte utilisateur
- Supprimer les données temporaires après 24h

**Impact :** Réduit la friction et augmente significativement le taux de conversion.

---

### 2. Ajouter un CTA clair vers l'inscription après le résultat (CRITIQUE)

**Solution :**
- Ajouter un bouton "Créer un compte pour sauvegarder ce résultat"
- Ajouter un bouton "Continuer sans compte" (pour la transparence)
- Mettre en avant les bénéfices de l'inscription

**Impact :** Augmente le taux de conversion de preview → signup.

---

### 3. Améliorer l'affichage des résultats (MAJEUR)

**Solution :**
- Remplacer l'affichage JSON par une interface visuelle
- Ajouter un graphique radar pour les dimensions
- Ajouter des barres de progression pour le score
- Mettre en avant les forces et faiblesses avec des icônes

**Impact :** Améliore l'expérience utilisateur et la perception de valeur.

---

### 4. Intégrer le tracking d'événements (MAJEUR)

**Solution :**
- Intégrer `useEventTracking` dans la homepage
- Tracer : homepage_view, cv_upload, analyze_click, preview_view, signup_click
- Utiliser les données pour optimiser le funnel

**Impact :** Permet de mesurer et d'optimiser le taux de conversion.

---

### 5. Ajouter de la réassurance (MAJEUR)

**Solution :**
- Ajouter "Gratuit et sans engagement" près du bouton analyser
- Ajouter "Vos données ne sont pas conservées sans votre accord"
- Ajouter des badges de sécurité

**Impact :** Réduit la friction et augmente la confiance.

---

## Conclusion

**Le parcours actuel :**
- ✅ Permet de tester sans inscription (bon pour l'acquisition)
- ✅ Affiche la valeur rapidement (2-3 clics)
- ❌ Perd les données après inscription (critique)
- ❌ Pas de CTA vers l'inscription (critique)
- ❌ Affichage des résultats pauvre (majeur)

**Le problème principal :**
Le candidat peut tester la plateforme gratuitement et voir la valeur, mais s'il veut s'inscrire, il perd son analyse et doit recommencer. C'est une friction majeure qui tue probablement le taux de conversion.

**Recommandation immédiate :**
1. Implémenter la conservation des données preview
2. Ajouter un CTA clair vers l'inscription
3. Améliorer l'affichage des résultats

**Estimation du taux de conversion actuel :** Probablement < 5% (preview → signup)  
**Estimation après corrections :** 15-25% (preview → signup)
