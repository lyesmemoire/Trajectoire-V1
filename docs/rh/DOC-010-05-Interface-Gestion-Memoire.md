# DOC-010-05 : Interface de Gestion de la Mémoire (Consulter / Corriger / Effacer)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'interface de gestion de la mémoire personnalisée de MVP-010. Cette interface permet au recruteur de consulter sa mémoire, corriger les apprentissages erronés, et effacer tout ou partie de sa mémoire, conformément au RGPD (droits d'accès, de rectification et d'effacement).

---

## 2. Principe Fondateur

Transparence totale pour le recruteur :
- Il peut consulter sa mémoire à tout moment
- Il peut corriger un apprentissage erroné
- Il peut effacer tout ou partie de sa mémoire
- Il peut exporter sa mémoire (portabilité)

---

## 3. Accès à l'Interface

### 3.1 Emplacement

L'interface de gestion de la mémoire est accessible depuis :

- **Menu principal** : "Ma mémoire"
- **Paramètres** : "Gestion de la mémoire"
- **Raccourci** : Icône de mémoire dans l'en-tête

### 3.2 Authentification

L'accès nécessite une authentification forte (MFA) :

```typescript
interface MemoryAccess {
  requiresMFA: true;
  sessionTimeout: 30; // minutes
  reauthRequired: true;
}
```

---

## 4. Interface de Consultation

### 4.1 Vue d'Ensemble

```
┌─────────────────────────────────────────┐
│ MA MÉMOIRE                             │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÉSUMÉ                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Statut : ✅ Mémoire active              │
│ Activée le : 15/01/2026                 │
│ Dernière mise à jour : 03/08/2026       │
│                                         │
│ Données stockées :                      │
│ • Préférences explicites : 12           │
│ • Préférences implicites : 8            │
│ • Décisions historisées : 47            │
│ • Apprentissages accumulés : 15          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ COUCHES DE MÉMOIRE                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [COUCHE 1] Profil de préférence         │
│ [COUCHE 2] Historique de décisions      │
│ [COUCHE 3] Contexte organisationnel    │
│ [COUCHE 4] Apprentissages accumulés    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTIONS RAPIDES                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [Exporter ma mémoire]                   │
│ [Réinitialiser les apprentissages]      │
│ [Effacer ma mémoire]                    │
│ [Désactiver la mémoire]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Consultation COUCHE 1 — Profil de Préférence

```
┌─────────────────────────────────────────┐
│ COUCHE 1 — PROFIL DE PRÉFÉRENCE        │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PRÉFÉRENCES EXPLICITES                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Secteurs d'expertise préférés :          │
│ • Tech / Software                      │
│ • FinTech                              │
│                                         │
│ Types de postes habituels :             │
│ • Développeur                          │
│ • DevOps                               │
│ • Data Engineer                        │
│                                         │
│ Critères éliminatoires déclarés :       │
│ • Absence de certifications cloud       │
│ • Expérience < 2 ans                   │
│                                         │
│ Pondérations personnalisées :            │
│ • Compétences techniques : 45%          │
│ • Expérience : 35%                     │
│ • Soft skills : 10%                    │
│ • Contexte : 10%                       │
│                                         │
│ [Modifier les préférences explicites]   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PRÉFÉRENCES IMPLICITES                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Patterns de décision observés :         │
│ • Préférence pour les profils avec      │
│   expérience startup (fréquence : 85%)  │
│ • Surpondération de l'autonomie (delta :│
│   +15%)                                 │
│ • Sous-pondération des certifications  │
│   formelles (delta : -10%)              │
│                                         │
│ Signaux auxquels vous êtes sensible :   │
│ • Capacité d'apprentissage rapide      │
│ • Expérience de management              │
│ • Projets open source                  │
│                                         │
│ [Corriger les préférences implicites]   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ALERTES DE BIAIS                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ ✅ Aucune alerte de biais détectée       │
│                                         │
│ [Retour]                                │
└─────────────────────────────────────────┘
```

### 4.3 Consultation COUCHE 2 — Historique de Décisions

```
┌─────────────────────────────────────────┐
│ COUCHE 2 — HISTORIQUE DE DÉCISIONS      │
├─────────────────────────────────────────┤
│                                         │
│ Filtre : [Toutes] [Réussis] [Ratés]    │
│ Recherche : [________________] [🔍]       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉCISIONS (47)                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ 03/08/2026 — Candidat CAND-a1b2c3d4    │
│ Décision : ✅ Accepté                   │
│ Profil : DevOps senior 5 ans             │
│ Compétences : Python, Docker, Kubernetes│
│                                         │
│ 02/08/2026 — Candidat CAND-e5f6g7h8    │
│ Décision : ❌ Refusé                     │
│ Profil : Développeur junior 1 an         │
│ Raison : Expérience insuffisante         │
│                                         │
│ 01/08/2026 — Candidat CAND-i9j0k1l2    │
│ Décision : ✅ Accepté                   │
│ Profil : Data Engineer senior 6 ans     │
│ Compétences : SQL, Python, Spark        │
│                                         │
│ [Charger plus de décisions]              │
│ [Exporter l'historique]                 │
│                                         │
│ [Retour]                                │
└─────────────────────────────────────────┘
```

### 4.4 Consultation COUCHE 3 — Contexte Organisationnel

```
┌─────────────────────────────────────────┐
│ COUCHE 3 — CONTEXTE ORGANISATIONNEL    │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ MANAGERS                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Manager A (CTO)                         │
│ Style de management préféré :            │
│ • Autonomie élevée                      │
│ • Communication directe                │
│                                         │
| Critères de culture fit :               │
│ • Esprit startup                        │
│ • Capacité d'innovation                │
│                                         │
| Postes récurrents :                    │
│ • Développeur senior                   │
│ • DevOps                               │
│                                         │
| Collaboration : 12 recrutements, 92%    │
| succès                                  │
│                                         │
│ [Modifier le profil du manager]         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ÉQUIPES CIBLES                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Équipe Platform                         │
│ Composition actuelle :                   │
│ • Taille : 8 personnes                  │
│ • Compétences couvertes : Python,       │
│   Docker, Kubernetes, AWS               │
│ • Seniorité : 2 junior, 3 mid, 3 senior│
│                                         │
| Gaps à combler :                        │
│ • Priorité haute : Kubernetes avancé    │
│ • Priorité moyenne : CI/CD              │
│                                         │
| Dynamique d'équipe :                    │
│ • Collaboration : Agile / Scrum         │
│ • Communication : Asynchrone           │
│ • Style de travail : Remote-first       │
│                                         │
│ [Modifier le profil de l'équipe]         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ORGANISATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Secteur : Tech / Software                │
│ Culture : Innovation / Autonomie         │
│ Stade : Scale-up                        │
│                                         │
| Contraintes organisationnelles :         │
│ • Remote-first                          │
│ • Budget limité                         │
│                                         │
| Historique des recrutements :            │
│ • Total : 47 recrutements               │
│ • Temps moyen d'embauche : 28 jours     │
│ • Taux de rétention : 85%               │
│                                         │
| [Modifier le profil de l'organisation]  │
│                                         │
│ [Retour]                                │
└─────────────────────────────────────────┘
```

### 4.5 Consultation COUCHE 4 — Apprentissages Accumulés

```
┌─────────────────────────────────────────┐
│ COUCHE 4 — APPRENTISSAGES ACCUMULÉS    │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÈGLES CONTEXTUELLES VALIDÉES          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ CR-001 : Docker > Certifications cloud  │
│ Description : Dans cette entreprise,    │
│ la maîtrise de Docker est plus          │
│ importante que les certifications       │
│ malgré ce que la fiche de poste         │
│ indique.                                │
│                                         │
| Context : Organisation: TechCorp,       │
│ Équipe: Platform                        │
│                                         │
| Confiance : 85%                         │
| Validations : 15                        │
| Taux de succès : 80%                   │
| Statut : ✅ Active                      │
│                                         │
| [Voir les détails] [Corriger]           │
│                                         │
│ CR-002 : Expérience startup > Diplôme  │
│ Description : L'expérience en           │
│ environnement startup est plus          │
│ importante que le diplôme.              │
│                                         │
| Confiance : 78%                         │
| Validations : 12                        │
| Taux de succès : 75%                   │
| Statut : ✅ Active                      │
│                                         │
│ [Voir les détails] [Corriger]           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PATTERNS PRÉDICTEURS LOCAUX            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ PP-001 : Profil startup réussi          │
| Caractéristiques :                      │
│ • Expérience en environnement startup    │
│ • Capacité d'autonomie élevée           │
│ • Soft skills de communication forts    │
│                                         │
| Taux de succès : 90%                    │
| Échantillon : 20                        │
| Confiance : 88%                         │
│                                         │
│ [Voir les détails]                       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ANTI-PATTERNS IDENTIFIÉS               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ AP-001 : Profil grande entreprise       │
| Caractéristiques :                      │
│ • Expérience uniquement en grandes      │
│   entreprises                           │
│ • Manque d'autonomie                    │
│ • Attente de processus structurés       │
│                                         │
| Taux d'échec : 75%                      │
| Échantillon : 8                         │
| Confiance : 70%                         │
│                                         │
| Atténuation : Vérifier l'adaptabilité   │
│ au contexte startup en entretien        │
│                                         │
│ [Voir les détails]                       │
│                                         │
│ [Retour]                                │
└─────────────────────────────────────────┘
```

---

## 5. Interface de Correction

### 5.1 Correction des Préférences Explicites

```
┌─────────────────────────────────────────┐
│ MODIFIER LES PRÉFÉRENCES EXPLICITES     │
├─────────────────────────────────────────┤
│                                         │
│ Secteurs d'expertise préférés :          │
│ [✓] Tech / Software                    │
│ [✓] FinTech                            │
│ [ ] HealthTech                          │
│ [ ] EdTech                             │
│ [+ Ajouter un secteur]                  │
│                                         │
│ Types de postes habituels :             │
│ [✓] Développeur                        │
│ [✓] DevOps                             │
│ [✓] Data Engineer                     │
│ [ ] Product Manager                    │
│ [+ Ajouter un type de poste]             │
│                                         │
│ Critères éliminatoires déclarés :       │
│ [✓] Absence de certifications cloud     │
│ [✓] Expérience < 2 ans                 │
│ [ ] Absence d'expérience remote        │
│ [+ Ajouter un critère]                   │
│                                         │
│ Pondérations personnalisées :            │
│ Compétences techniques : [45] %          │
│ Expérience : [35] %                     │
│ Soft skills : [10] %                    │
│ Contexte : [10] %                       │
│                                         │
| Total : 100%                            │
│                                         │
│ [Annuler]              [Enregistrer]     │
└─────────────────────────────────────────┘
```

### 5.2 Correction des Préférences Implicites

```
┌─────────────────────────────────────────┐
│ CORRIGER LES PRÉFÉRENCES IMPLICITES    │
├─────────────────────────────────────────┤
│                                         │
│ Pattern de décision observé :            │
│ "Préférence pour les profils avec       │
│  expérience startup"                    │
│                                         │
| Fréquence : 85%                         │
| Confiance : Élevée                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTION                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Que souhaitez-vous faire ?               │
│                                         │
| ○ Conserver ce pattern                  │
│   (le moteur continuera à l'utiliser)   │
│                                         │
| ○ Ignorer ce pattern                   │
│   (le moteur ne l'utilisera plus)       │
│                                         │
| ○ Corriger ce pattern                  │
│   (indiquer la correction souhaitée)    │
│                                         │
│ Correction :                            │
│ [________________________________]       │
│                                         │
| [Annuler]              [Appliquer]      │
└─────────────────────────────────────────┘
```

### 5.3 Correction des Apprentissages

```
┌─────────────────────────────────────────┐
│ CORRIGER UN APPRENTISSAGE               │
├─────────────────────────────────────────┤
│                                         │
│ Règle contextuelle : CR-001             │
│ "Docker > Certifications cloud"         │
│                                         │
| Description actuelle :                  │
│ Dans cette entreprise, la maîtrise de   │
│ Docker est plus importante que les      │
│ certifications malgré ce que la fiche   │
│ de poste indique.                       │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CORRECTION                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Pourquoi corriger cet apprentissage ?    │
│                                         │
| ○ L'apprentissage est incorrect          │
| ○ L'apprentissage n'est plus pertinent  │
| ○ L'apprentissage est biaisé            │
| ○ Autre (préciser) :                    │
│   [_____________________________]         │
│                                         │
│ Action souhaitée :                      │
│ ○ Désactiver cette règle                │
│ ○ Modifier la description              │
│ ○ Supprimer cette règle                │
│                                         │
| Nouvelle description (si modification) :│
│ [________________________________]       │
│ [________________________________]       │
│ [________________________________]       │
│                                         │
│ [Annuler]              [Appliquer]      │
└─────────────────────────────────────────┘
```

---

## 6. Interface d'Effacement

### 6.1 Effacement Partiel

```
┌─────────────────────────────────────────┐
│ EFFACEMENT PARTIEL DE LA MÉMOIRE        │
├─────────────────────────────────────────┤
│                                         │
│ Sélectionnez les données à effacer :     │
│                                         │
│ [✓] Préférences explicites              │
│ [✓] Préférences implicites              │
│ [✓] Historique de décisions             │
│ [✓] Contexte organisationnel           │
│ [✓] Apprentissages accumulés            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONFIRMATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Les données sélectionnées seront        │
| définitivement supprimées. Cette        │
| action est irréversible.               │
│                                         │
| ☑ Je confirme que je souhaite effacer   │
|   les données sélectionnées             │
│                                         │
│ [Annuler]              [Effacer]        │
└─────────────────────────────────────────┘
```

### 6.2 Effacement Total

```
┌─────────────────────────────────────────┐
│ EFFACEMENT TOTAL DE LA MÉMOIRE           │
├─────────────────────────────────────────┤
│                                         │
│ ⚠️ ATTENTION                           │
│                                         │
| Vous êtes sur le point d'effacer        │
| l'intégralité de votre mémoire.         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONSÉQUENCES                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| • Toutes vos préférences seront         │
│   supprimées                             │
│ • Tout votre historique sera effacé      │
│ • Tous vos apprentissages seront         │
│   supprimés                             │
│ • Les recommandations redeviendront     │
│   génériques                            │
│                                         │
│ Cette action est irréversible.          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONFIRMATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Pour confirmer, tapez "EFFACER" :        │
│ [_____________________________]           │
│                                         │
│ ☑ Je comprends les conséquences et      │
│   confirme l'effacement total            │
│                                         │
│ [Annuler]              [Effacer tout]    │
└─────────────────────────────────────────┘
```

### 6.3 Réinitialisation

```
┌─────────────────────────────────────────┐
│ RÉINITIALISATION DE LA MÉMOIRE          │
├─────────────────────────────────────────┤
│                                         │
│ La réinitialisation efface les          │
| apprentissages implicites mais conserve │
| les préférences explicites.             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ OPTIONS DE RÉINITIALISATION             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| ○ Réinitialiser les préférences         │
│   implicites uniquement                │
│                                         │
| ○ Réinitialiser les apprentissages     │
│   accumulés uniquement                 │
│                                         │
| ○ Réinitialiser tout (implicites +     │
│   apprentissages)                       │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONFIRMATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| ☑ Je confirme la réinitialisation       │
│                                         │
│ [Annuler]              [Réinitialiser]   │
└─────────────────────────────────────────┘
```

---

## 7. Interface d'Export

### 7.1 Export de la Mémoire

```
┌─────────────────────────────────────────┐
│ EXPORTER MA MÉMOIRE                    │
├─────────────────────────────────────────┤
│                                         │
│ Sélectionnez les données à exporter :   │
│                                         │
│ [✓] Préférences explicites              │
│ [✓] Préférences implicites              │
│ [✓] Historique de décisions             │
│ [✓] Contexte organisationnel           │
│ [✓] Apprentissages accumulés            │
│                                         │
│ Format d'export :                       │
│ ○ JSON                                 │
│ ○ CSV                                  │
│ ○ PDF                                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PORTABILITÉ                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Vous pouvez utiliser ce fichier pour :   │
│ • Transférer votre mémoire vers un       │
│   autre système                         │
│ • Analyser vos données                   │
│ • Conserver une copie de sauvegarde     │
│                                         │
| [Annuler]              [Exporter]       │
└─────────────────────────────────────────┘
```

### 7.2 Structure du Fichier d'Export

```typescript
interface MemoryExport {
  exportId: string;
  recruiterId: string;
  exportDate: Date;
  version: string;
  
  layers: {
    layer1: RecruiterPreferenceProfile;
    layer2: DecisionHistory[];
    layer3: OrganizationalContext;
    layer4: AccumulatedLearnings;
  };
  
  metadata: {
    totalSize: number;
    format: string;
    checksum: string;
  };
}
```

---

## 8. API de Gestion

### 8.1 Endpoints

```typescript
// Consultation
GET /api/memory/layer1
GET /api/memory/layer2
GET /api/memory/layer3
GET /api/memory/layer4

// Correction
PUT /api/memory/layer1/preferences
PUT /api/memory/layer1/implicit/{patternId}
PUT /api/memory/layer4/rules/{ruleId}

// Effacement
DELETE /api/memory/partial
DELETE /api/memory/total
POST /api/memory/reset

// Export
GET /api/memory/export
```

### 8.2 Exemple d'API

```typescript
// Consulter la mémoire
async function getMemoryLayer(recruiterId: string, layer: number): Promise<any> {
  const response = await fetch(`/api/memory/layer${layer}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    }
  });
  
  return response.json();
}

// Corriger une préférence implicite
async function correctImplicitPreference(
 patternId: string,
 correction: string
): Promise<void> {
  const response = await fetch(`/api/memory/layer1/implicit/${patternId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    },
    body: JSON.stringify({ correction })
  });
  
  return response.json();
}

// Effacer la mémoire
async function deleteMemory(deletionOption: DeletionOption): Promise<void> {
  const response = await fetch('/api/memory/partial', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    },
    body: JSON.stringify(deletionOption)
  });
  
  return response.json();
}

// Exporter la mémoire
async function exportMemory(format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
  const response = await fetch(`/api/memory/export?format=${format}`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    }
  });
  
  return response.blob();
}
```

---

## 9. Journalisation des Actions

### 9.1 Journal des Actions

Toutes les actions sur la mémoire sont journalisées :

```sql
CREATE TABLE memory_management_log (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  action_type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  details JSON,
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memory_log_recruiter ON memory_management_log(recruiter_id);
CREATE INDEX idx_memory_log_type ON memory_management_log(action_type);
CREATE INDEX idx_memory_log_timestamp ON memory_management_log(timestamp);
```

### 9.2 Types d'Actions Journalisées

| Action | Description |
|--------|-------------|
| CONSULT_LAYER1 | Consultation du profil de préférence |
| CONSULT_LAYER2 | Consultation de l'historique |
| CONSULT_LAYER3 | Consultation du contexte |
| CONSULT_LAYER4 | Consultation des apprentissages |
| CORRECT_EXPLICIT | Correction des préférences explicites |
| CORRECT_IMPLICIT | Correction des préférences implicites |
| CORRECT_RULE | Correction d'une règle |
| DELETE_PARTIAL | Effacement partiel |
| DELETE_TOTAL | Effacement total |
| RESET | Réinitialisation |
| EXPORT | Export de la mémoire |

---

## 10. Notifications

### 10.1 Notification de Confirmation

Après chaque action significative, une notification est envoyée :

```
┌─────────────────────────────────────────┐
│ CONFIRMATION                           │
├─────────────────────────────────────────┤
│                                         │
| ✅ Action réussie                      │
│                                         │
| Votre mémoire a été correctement        │
| modifiée.                               │
│                                         │
| Détails :                              │
| • Type : Correction                    │
| • Élément : Préférence implicite PP-001│
| • Date : 03/08/2026 14:30              │
│                                         │
│ [OK]                                   │
└─────────────────────────────────────────┘
```

### 10.2 Notification d'Alerte

En cas d'action critique, une alerte est envoyée :

```
┌─────────────────────────────────────────┐
│ ⚠️ ALERTE                              │
├─────────────────────────────────────────┤
│                                         │
| Action critique détectée.               │
│                                         │
| Détails :                              │
| • Type : Effacement total              │
| • Date : 03/08/2026 14:30              │
│                                         │
| Cette action a été notifiée au DPO.   │
│                                         │
│ [OK]                                   │
└─────────────────────────────────────────┘
```

---

## 11. Conclusion

L'interface de gestion de la mémoire garantit :

- **Transparence totale** pour le recruteur
- **Consultation facile** de toutes les couches de mémoire
- **Correction** des apprentissages erronés
- **Effacement** total ou partiel
- **Export** et portabilité
- **Journalisation** de toutes les actions
- **Conformité RGPD** (droits d'accès, rectification, effacement)
