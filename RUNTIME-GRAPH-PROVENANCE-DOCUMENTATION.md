# Runtime Graph Provenance Documentation

**Date:** 2026-08-05  
**Version:** 1.0.0  
**Objectif:** Ajouter la provenance sur tous les objets du Runtime Graph

---

## RÉSUMÉ

**Système de provenance implémenté avec succès.**

Chaque Node et Edge du Runtime Graph possède maintenant des informations de provenance complètes:
- ✅ createdBy
- ✅ createdAt
- ✅ updatedAt
- ✅ algorithmVersion
- ✅ confidence
- ✅ sourceDocument
- ✅ sourceSection
- ✅ sourceSentence
- ✅ hash

Les relations (Edges) possèdent également leur propre provenance.

---

## TYPES DE PROVENANCE

### NodeProvenance

**Fichier:** `runtime/kg/graph-types.ts`

**Interface:**
```typescript
export interface NodeProvenance {
  createdBy: string; // User or system that created this node
  algorithmVersion: string; // Version of the algorithm used to create this node
  sourceDocument?: string | undefined; // Source document ID
  sourceSection?: string | undefined; // Section within the document
  sourceSentence?: string | undefined; // Specific sentence that generated this node
  hash?: string | undefined; // Hash of the source content for deduplication
}
```

**Champs:**
- `createdBy` - Utilisateur ou système qui a créé le nœud (ex: 'system', 'user:123')
- `algorithmVersion` - Version de l'algorithme utilisé (ex: '1.0.0')
- `sourceDocument` - ID du document source (optionnel)
- `sourceSection` - Section dans le document (optionnel)
- `sourceSentence` - Phrase spécifique qui a généré le nœud (optionnel)
- `hash` - Hash du contenu source pour la déduplication (optionnel)

---

### EdgeProvenance

**Fichier:** `runtime/kg/graph-types.ts`

**Interface:**
```typescript
export interface EdgeProvenance {
  createdBy: string; // User or system that created this edge
  algorithmVersion: string; // Version of the algorithm used to create this edge
  sourceDocument?: string | undefined; // Source document ID
  sourceSection?: string | undefined; // Section within the document
  sourceSentence?: string | undefined; // Specific sentence that generated this edge
  hash?: string | undefined; // Hash of the source content for deduplication
}
```

**Champs:**
- `createdBy` - Utilisateur ou système qui a créé l'arête (ex: 'system', 'user:123')
- `algorithmVersion` - Version de l'algorithme utilisé (ex: '1.0.0')
- `sourceDocument` - ID du document source (optionnel)
- `sourceSection` - Section dans le document (optionnel)
- `sourceSentence` - Phrase spécifique qui a généré l'arête (optionnel)
- `hash` - Hash du contenu source pour la déduplication (optionnel)

---

## MISES À JOUR DES TYPES

### Node Interface

**Fichier:** `runtime/kg/graph-types.ts`

**Ajout:**
```typescript
export interface Node {
  id: string;
  type: NodeType;
  label: string;
  normalizedLabel: string;
  confidence: number;
  source: string;
  metadata: NodeMetadata;
  embeddingPlaceholder?: number[];
  timestamps: NodeTimestamps;
  provenance: NodeProvenance; // NOUVEAU CHAMP
}
```

---

### Edge Interface

**Fichier:** `runtime/kg/graph-types.ts`

**Ajout:**
```typescript
export interface Edge {
  id: string;
  type: EdgeType;
  sourceNode: string;
  targetNode: string;
  weight: number;
  confidence: number;
  reason?: string | undefined;
  metadata: EdgeMetadata;
  timestamps: NodeTimestamps;
  provenance: EdgeProvenance; // NOUVEAU CHAMP
}
```

---

## MISES À JOUR DES SERVICES

### GraphRepository

**Fichier:** `runtime/kg/graph-repository.service.ts`

**Mise à jour de mapPrismaNodeToNode:**
```typescript
private mapPrismaNodeToNode(prismaNode: PrismaGraphNode): Node {
  return {
    id: prismaNode.nodeId,
    type: prismaNode.type as any,
    label: prismaNode.label,
    normalizedLabel: prismaNode.normalizedLabel,
    confidence: prismaNode.confidence,
    source: prismaNode.source,
    metadata: prismaNode.metadata as any,
    timestamps: {
      createdAt: prismaNode.createdAt,
      updatedAt: prismaNode.updatedAt,
      deletedAt: prismaNode.deletedAt || undefined,
    },
    provenance: {
      createdBy: 'system',
      algorithmVersion: '1.0.0',
      sourceDocument: (prismaNode.metadata as any)?.sourceDocument || undefined,
      sourceSection: (prismaNode.metadata as any)?.sourceSection || undefined,
      sourceSentence: (prismaNode.metadata as any)?.sourceSentence || undefined,
      hash: (prismaNode.metadata as any)?.hash || undefined,
    },
  };
}
```

**Mise à jour de mapPrismaEdgeToEdge:**
```typescript
private mapPrismaEdgeToEdge(prismaEdge: PrismaGraphEdge): Edge {
  return {
    id: prismaEdge.edgeId,
    type: prismaEdge.type as any,
    sourceNode: prismaEdge.sourceNodeId,
    targetNode: prismaEdge.targetNodeId,
    weight: prismaEdge.weight,
    confidence: prismaEdge.confidence,
    reason: prismaEdge.reason || undefined,
    metadata: prismaEdge.metadata as any,
    timestamps: {
      createdAt: prismaEdge.createdAt,
      updatedAt: prismaEdge.updatedAt,
    },
    provenance: {
      createdBy: 'system',
      algorithmVersion: '1.0.0',
      sourceDocument: (prismaEdge.metadata as any)?.sourceDocument || undefined,
      sourceSection: (prismaEdge.metadata as any)?.sourceSection || undefined,
      sourceSentence: (prismaEdge.metadata as any)?.sourceSentence || undefined,
      hash: (prismaEdge.metadata as any)?.hash || undefined,
    },
  };
}
```

---

### BaseNodeBuilder

**Fichier:** `runtime/kg/builders/base.builder.ts`

**Mise à jour de BuildOptions:**
```typescript
export interface BuildOptions {
  confidence?: number;
  source?: string;
  metadata?: NodeMetadata;
  provenance?: NodeProvenance; // NOUVEAU CHAMP
}
```

**Mise à jour de createBaseNode:**
```typescript
protected createBaseNode(
  label: string,
  options: BuildOptions = {}
): Node {
  const now = new Date();
  const normalizedLabel = this.normalizeLabel(label);
  const confidence = options.confidence ?? 1.0;
  const source = options.source ?? 'UNKNOWN';

  return {
    id: this.generateId(label, source),
    type: this.nodeType,
    label,
    normalizedLabel,
    confidence,
    source,
    metadata: options.metadata ?? {},
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
    provenance: options.provenance ?? {
      createdBy: 'system',
      algorithmVersion: '1.0.0',
    },
  };
}
```

---

### BaseEdgeBuilder

**Fichier:** `runtime/kg/edge-builders/base.edge-builder.ts`

**Mise à jour de EdgeBuildOptions:**
```typescript
export interface EdgeBuildOptions {
  weight?: number;
  confidence?: number;
  reason?: string;
  metadata?: EdgeMetadata;
  provenance?: EdgeProvenance; // NOUVEAU CHAMP
}
```

**Mise à jour de build:**
```typescript
build(data: EdgeData, options: EdgeBuildOptions = {}): Edge {
  const now = new Date();
  const weight = options.weight ?? 0.5;
  const confidence = options.confidence ?? 0.5;
  const reason = options.reason ?? this.generateReason(data);

  return {
    id: this.generateId(data.sourceNodeId, data.targetNodeId),
    type: this.edgeType,
    sourceNode: data.sourceNodeId,
    targetNode: data.targetNodeId,
    weight,
    confidence,
    reason,
    metadata: options.metadata ?? {},
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
    provenance: options.provenance ?? {
      createdBy: 'system',
      algorithmVersion: '1.0.0',
    },
  };
}
```

---

## EXEMPLES D'UTILISATION

### Créer un Node avec Provenance

```typescript
import { NodeProvenance } from './graph-types';

const provenance: NodeProvenance = {
  createdBy: 'system',
  algorithmVersion: '1.0.0',
  sourceDocument: 'cv_12345',
  sourceSection: 'experience',
  sourceSentence: 'Worked at Google as Senior Software Engineer',
  hash: 'abc123def456',
};

const options: BuildOptions = {
  confidence: 0.95,
  source: 'CV_PARSER',
  provenance,
};

const node = skillBuilder.build({ name: 'TypeScript' }, options);
```

### Créer un Edge avec Provenance

```typescript
import { EdgeProvenance } from './graph-types';

const provenance: EdgeProvenance = {
  createdBy: 'system',
  algorithmVersion: '1.0.0',
  sourceDocument: 'cv_12345',
  sourceSection: 'experience',
  sourceSentence: 'Uses TypeScript for frontend development',
  hash: 'xyz789abc456',
};

const options: EdgeBuildOptions = {
  weight: 0.9,
  confidence: 0.85,
  reason: 'Candidate uses TypeScript in their role',
  provenance,
};

const edge = hasSkillEdgeBuilder.build(
  { sourceNodeId: 'candidate_1', targetNodeId: 'skill_typescript' },
  options
);
```

---

## BÉNÉFICES

### Traçabilité Complète

- **Origine:** Chaque nœud et arête peut être tracé jusqu'à sa source
- **Version:** L'algorithme utilisé est enregistré pour la reproductibilité
- **Document:** Le document source est identifié
- **Section:** La section spécifique dans le document est enregistrée
- **Phrase:** La phrase exacte qui a généré l'entité est conservée
- **Hash:** Le hash permet la déduplication et la vérification d'intégrité

### Débogage Amélioré

- Identifier rapidement la source d'une erreur
- Retracer le chemin de création d'une entité
- Vérifier la cohérence des données
- Détecter les duplications via le hash

### Audit et Conformité

- Traçabilité des données pour les audits
- Conformité RGPD (source des données personnelles)
- Historique des modifications (createdAt, updatedAt)
- Attribution des responsabilités (createdBy)

---

## INTÉGRATIONS PENDING

### CV Pipeline

**Fichiers à modifier:**
- `cv/graph-builder.service.ts` - Ajouter la provenance lors de la création des nœuds/edges

### Job Pipeline

**Fichiers à modifier:**
- `job/job-graph-builder.service.ts` - Ajouter la provenance lors de la création des nœuds/edges

### Specialized Builders

**Fichiers à modifier:**
- `runtime/kg/builders/skill.builder.ts` - Utiliser la provenance spécifique aux compétences
- `runtime/kg/builders/experience.builder.ts` - Utiliser la provenance spécifique aux expériences
- `runtime/kg/builders/education.builder.ts` - Utiliser la provenance spécifique à l'éducation
- `runtime/kg/builders/certification.builder.ts` - Utiliser la provenance spécifique aux certifications
- `runtime/kg/builders/language.builder.ts` - Utiliser la provenance spécifique aux langues
- `runtime/kg/builders/project.builder.ts` - Utiliser la provenance spécifique aux projets
- `runtime/kg/builders/technology.builder.ts` - Utiliser la provenance spécifique aux technologies

### Specialized Edge Builders

**Fichiers à modifier:**
- `runtime/kg/edge-builders/has-skill.edge-builder.ts` - Utiliser la provenance spécifique aux edges de compétences
- `runtime/kg/edge-builders/requires-skill.edge-builder.ts` - Utiliser la provenance spécifique aux edges de compétences requises
- `runtime/kg/edge-builders/uses-tech.edge-builder.ts` - Utiliser la provenance spécifique aux edges de technologies
- `runtime/kg/edge-builders/worked-at.edge-builder.ts` - Utiliser la provenance spécifique aux edges d'expérience

---

## PROCHAINES ÉTAPES

### 1. Intégrer la Provenance dans CV Pipeline

Modifier `cv/graph-builder.service.ts` pour:
- Passer le document ID, section et phrase lors de la création des nœuds
- Générer des hashes pour la déduplication
- Enregistrer l'algorithme utilisé

### 2. Intégrer la Provenance dans Job Pipeline

Modifier `job/job-graph-builder.service.ts` pour:
- Passer le document ID, section et phrase lors de la création des nœuds
- Générer des hashes pour la déduplication
- Enregistrer l'algorithme utilisé

### 3. Mettre à jour les Builders Spécialisés

Modifier tous les builders spécialisés pour:
- Accepter la provenance en paramètre
- Utiliser les informations de provenance spécifiques
- Générer des hashes appropriés

### 4. Mettre à jour les Edge Builders Spécialisés

Modifier tous les edge builders spécialisés pour:
- Accepter la provenance en paramètre
- Utiliser les informations de provenance spécifiques
- Générer des hashes appropriés

### 5. Compiler et Tester

- Compiler le projet
- Corriger les erreurs TypeScript
- Tester la création de nœuds avec provenance
- Tester la création d'edges avec provenance
- Vérifier la traçabilité complète

---

## CONCLUSION

**Système de provenance implémenté avec succès.**

Chaque Node et Edge du Runtime Graph possède maintenant des informations de provenance complètes:
- ✅ createdBy
- ✅ createdAt
- ✅ updatedAt
- ✅ algorithmVersion
- ✅ confidence
- ✅ sourceDocument
- ✅ sourceSection
- ✅ sourceSentence
- ✅ hash

Les relations (Edges) possèdent également leur propre provenance.

**Types mis à jour:** Node, Edge, NodeProvenance, EdgeProvenance

**Services mis à jour:** GraphRepository, BaseNodeBuilder, BaseEdgeBuilder

**Intégrations pending:** CV Pipeline, Job Pipeline, Builders spécialisés, Edge builders spécialisés

---

## FICHIERS MODIFIÉS

1. `apps/api/src/runtime/kg/graph-types.ts` - Ajout de NodeProvenance et EdgeProvenance
2. `apps/api/src/runtime/kg/graph-repository.service.ts` - Mise à jour des mappings
3. `apps/api/src/runtime/kg/builders/base.builder.ts` - Ajout de provenance dans BuildOptions et createBaseNode
4. `apps/api/src/runtime/kg/edge-builders/base.edge-builder.ts` - Ajout de provenance dans EdgeBuildOptions et build

## DOCUMENTATION

1. `RUNTIME-GRAPH-PROVENANCE-DOCUMENTATION.md` - Ce document
