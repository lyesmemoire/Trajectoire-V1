# Design Tokens — Règles d'usage des couleurs (Premium Professionnel)

## NOTE IMPORTANTE (à lire avant toute modification UI)

**RÈGLE DÉFINITIVE : Terracotta = warning réversible uniquement.  
Brick = danger/irréversible uniquement (variant='danger' du Button).  
Ces deux tokens ne se substituent jamais l'un à l'autre.**

---

## Bronze vs Ink — Règle de séparation

### Bronze (`bronze-*`)
**Usage : accent de marque PREMIUM et RARE**

Le bronze est réservé aux éléments qui signalent une valeur premium, une action à haute valeur, ou une distinction exclusive. Il ne doit apparaître que dans des contextes où l'utilisateur doit ressentir une émotion positive liée à l'excellence ou à l'upgrade.

**Contextes légitimes :**
- CTA d'upgrade premium (UpgradeCTA, pricing CTA)
- Badge PRO / plan recommandé (pricing)
- Stories / témoignages premium (behavioral-success-stories)
- Replay comportemental premium (replay-turning-points)
- Mutation / évolution premium (evolution-card)
- Badge section marketing **si usage rare / non répété** (section-badge)
- Glow holographique premium (dna-showcase)
- CTA final dans mini-pressure-test
- Shield premium (PrivacyConsent)

**Règle d'or :** Si un élément s'affiche en permanence sur chaque page (logo, nav, footer) ou plusieurs fois par session (spinner, loader, éléments répétés), il ne doit **JAMAIS** être bronze.

---

### Ink (`ink-*`)
**Usage : éléments structurels, neutres, et récurrents**

L'ink est la couleur par défaut pour tous les éléments structurels, de navigation, et fonctionnels. Il assure la cohérence visuelle sans surcharge émotionnelle.

**Contextes obligatoires :**
- Logo de marque (marketing-layout, dashboard-layout, footer)
- Navigation active state (texte ink-900 + soulignement fin)
- Spinners / loaders (ink-400 pour neutre)
- Liens de navigation standard (ink-600 → ink-900 hover)
- Barres de progression neutres (ink-800)
- Icônes fonctionnelles (micro, export, IA générique)
- Badges info neutres (ivoire-100 / ink-700)
- Étapes de progression active (ink-900)
- Hover states neutres (ivoire-100 / ink-500)

**Variations :**
- `ink-900` : titres, logos, navigation active, éléments forts
- `ink-700` : liens, badges info, icônes fonctionnelles
- `ink-600` : texte standard, hover states
- `ink-400` : spinners, loaders, éléments secondaires
- `ink-300` : placeholder text, éléments très secondaires

---

## Autres tokens sémantiques

### Forest (`forest-*`) — Performance et succès
- Métriques de performance positive
- Icônes de succès / validation
- États positifs dans tableaux / listes
- Scores élevés (si score >= seuil "bon")

### Terracotta (`terracotta-*`) — Warning (réversible, modéré)
- Alertes réversibles (ex: réseau instable, "à surveiller")
- Scores moyens (niveau "moyen")
- Interruptions / anomalies non critiques
- États non bloquants (l'utilisateur peut continuer)

### Brick (`brick-*`) — Danger / critique / irréversible
- **Variant `danger` pour boutons irréversibles** (suppression compte, reset définitif, action destructrice)
- Échecs critiques / erreurs fortes
- États bloquants / critiques (si l'action ou la situation ne doit pas être prise à la légère)

### Ivoire (`ivoire-*`) — Fonds neutres et badges info
- Fonds de badges info neutres
- Backgrounds de sections secondaires
- Hover states subtils

---

## Checklist de validation (Bronze)

Avant d'appliquer `bronze-*` à un élément, se poser la question :
1. Est-ce un CTA d'upgrade premium ?
2. Est-ce un badge PRO / distinction exclusive ?
3. Est-ce un élément marketing à forte valeur émotionnelle ?
4. Est-ce un élément **rare** (non structurel, non répété, non omniprésent) ?

Si la réponse est NON à toutes les questions → utiliser `ink-*` (ou tokens sémantiques si état).

---

## Arbre de décision — comment choisir une couleur

Suivre ces questions dans l'ordre, jusqu'à obtenir une réponse.

```text
Q1 — Fréquence (RÈGLE D'OR)
L'élément est-il structurel / permanent / répété ?
(ex: logo, nav, footer, spinner, loader, élément affiché à chaque interaction)
→ OUI : INK/IVOIRE (bronze interdit)
→ NON : Q2

Q2 — Est-ce un ÉTAT / STATUT (donnée qui varie) ?
(ex: score, gravité, warning, réseau, réussite/échec)
→ NON : Q5
→ OUI : Q3

Q3 — Est-ce POSITIF / SUCCÈS / PERFORMANCE ÉLEVÉE ?
→ OUI : FOREST
→ NON : Q4

Q4 — Est-ce CRITIQUE / IRRÉVERSIBLE / DANGEREUX ?
(ex: suppression, action destructrice, échec critique)
→ OUI : BRICK
→ NON : TERRACOTTA (warning réversible/modéré)

Q5 — Est-ce un ACCENT PREMIUM RARE ?
(ex: upgrade, badge PRO, mise en avant premium)
→ OUI : BRONZE
→ NON : INK (par défaut)
```

---

## Historique des corrections

**Cycle 1 (Amber → Bronze) :**
- Erreur : Mapping trop large de amber vers bronze
- Correction : Réduction aux seuls accents premium

**Cycle 2 (Blue → Bronze) :**
- Erreur : Mapping blue vers bronze sans distinction sémantique
- Correction : Repassage en ink-* des éléments structurels, création variant danger

**Cycle 2.5 (Clarification Terracotta/Brick) :**
- Suppression de l'ambiguïté sur le variant danger
- Fusion de l'arbre de décision dans la doc principale
- Confirmation : Terracotta = warning réversible uniquement, Brick = danger irréversible uniquement

**Cycle 3 (Règles définitives) :**
- Clarification Terracotta vs Brick (warning réversible vs danger irréversible)
- Arbre de décision pour choix couleur
- Règle de fréquence comme Q1 (bronze interdit sur éléments permanents/répétés)
