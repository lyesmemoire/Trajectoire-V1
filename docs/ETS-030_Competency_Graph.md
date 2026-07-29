# ETS-030 Competency Graph

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le graphe de compétences qui définit comment chaque compétence influence les autres. Au lieu d'un simple score (ex: Leadership 75%), le graphe capture les relations et les dépendances entre les compétences.

---

## Graphe de Compétences

### Leadership

```
Leadership
    ↓
Communication
    ↓
Ownership
    ↓
Influence
    ↓
Conflict
    ↓
Decision Making
```

**Relations**
- Leadership → Communication (0.8) : Le leadership nécessite une bonne communication
- Leadership → Ownership (0.9) : Le leadership nécessite une forte ownership
- Leadership → Influence (0.7) : Le leadership nécessite de l'influence
- Leadership → Conflict (0.6) : Le leadership nécessite la gestion de conflits
- Leadership → Decision Making (0.8) : Le leadership nécessite la prise de décision

---

### Architecture

```
Architecture
    ↓
System Design
    ↓
Scalability
    ↓
Tradeoffs
    ↓
Patterns
    ↓
Evolution
```

**Relations**
- Architecture → System Design (0.9) : L'architecture nécessite le system design
- Architecture → Scalability (0.8) : L'architecture nécessite la scalabilité
- Architecture → Tradeoffs (0.9) : L'architecture nécessite la compréhension des tradeoffs
- Architecture → Patterns (0.7) : L'architecture nécessite la connaissance des patterns
- Architecture → Evolution (0.6) : L'architecture nécessite l'évolution

---

### Problem Solving

```
Problem Solving
    ↓
Debugging
    ↓
Analysis
    ↓
Creativity
    ↓
Root Cause
    ↓
Solution
```

**Relations**
- Problem Solving → Debugging (0.7) : Le problem solving nécessite le debugging
- Problem Solving → Analysis (0.9) : Le problem solving nécessite l'analyse
- Problem Solving → Creativity (0.6) : Le problem solving nécessite la créativité
- Problem Solving → Root Cause (0.8) : Le problem solving nécessite l'identification de la cause racine
- Problem Solving → Solution (0.9) : Le problem solving nécessite la solution

---

### Communication

```
Communication
    ↓
Clarity
    ↓
Listening
    ↓
Presentation
    ↓
Writing
    ↓
Technical
```

**Relations**
- Communication → Clarity (0.9) : La communication nécessite la clarté
- Communication → Listening (0.8) : La communication nécessite l'écoute
- Communication → Presentation (0.7) : La communication nécessite la présentation
- Communication → Writing (0.6) : La communication nécessite l'écriture
- Communication → Technical (0.8) : La communication nécessite la communication technique

---

### Product

```
Product
    ↓
User Empathy
    ↓
Prioritization
    ↓
Metrics
    ↓
Value
    ↓
Delivery
```

**Relations**
- Product → User Empathy (0.9) : Le product nécessite l'empathie utilisateur
- Product → Prioritization (0.8) : Le product nécessite la priorisation
- Product → Metrics (0.7) : Le product nécessite les métriques
- Product → Value (0.9) : Le product nécessite la valeur
- Product → Delivery (0.6) : Le product nécessite la delivery

---

## Spécification du Graphe

### Competency Graph

```typescript
interface CompetencyGraph {
  nodes: CompetencyNode[];
  edges: CompetencyEdge[];
}

interface CompetencyNode {
  id: string;
  name: string;
  category: CompetencyCategory;
  score: number;
  confidence: number;
  evidence: Evidence[];
  lastUpdated: Date;
}

interface CompetencyEdge {
  from: string;
  to: string;
  weight: number;
  type: EdgeType;
}

type EdgeType = 
  | 'influence'
  | 'dependency'
  | 'correlation';

type CompetencyCategory = 
  | 'technical'
  | 'behavioral'
  | 'leadership'
  | 'communication'
  | 'product';
```

### Competency Score

```typescript
interface CompetencyScore {
  competency: string;
  score: number;
  confidence: number;
  evidence: Evidence[];
  influences: CompetencyInfluence[];
  dependencies: CompetencyDependency[];
  lastUpdated: Date;
}

interface CompetencyInfluence {
  competency: string;
  weight: number;
  impact: number;
}

interface CompetencyDependency {
  competency: string;
  weight: number;
  required: boolean;
}
```

### Score Calculation

```typescript
function calculateCompetencyScore(
  competency: string,
  graph: CompetencyGraph,
  evidence: Evidence[]
): CompetencyScore {
  // 1. Calculer le score de base
  const baseScore = calculateBaseScore(evidence);
  
  // 2. Calculer l'influence des compétences dépendantes
  const influences = calculateInfluences(competency, graph);
  
  // 3. Calculer le score ajusté
  const adjustedScore = adjustScore(baseScore, influences);
  
  // 4. Calculer la confiance
  const confidence = calculateConfidence(evidence);
  
  return {
    competency,
    score: adjustedScore,
    confidence,
    evidence,
    influences,
    dependencies: getDependencies(competency, graph),
    lastUpdated: new Date()
  };
}

function calculateBaseScore(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0;
  
  const totalStrength = evidence.reduce((sum, e) => sum + e.strength, 0);
  const averageStrength = totalStrength / evidence.length;
  
  return Math.min(100, averageStrength * 100);
}

function calculateInfluences(competency: string, graph: CompetencyGraph): CompetencyInfluence[] {
  const edges = graph.edges.filter(e => e.to === competency);
  
  return edges.map(edge => {
    const fromNode = graph.nodes.find(n => n.id === edge.from);
    if (!fromNode) return { competency: edge.from, weight: edge.weight, impact: 0 };
    
    const impact = fromNode.score * edge.weight;
    return { competency: edge.from, weight: edge.weight, impact };
  });
}

function adjustScore(baseScore: number, influences: CompetencyInfluence[]): number {
  const totalImpact = influences.reduce((sum, i) => sum + i.impact, 0);
  const averageImpact = influences.length > 0 ? totalImpact / influences.length : 0;
  
  // Le score ajusté est une moyenne pondérée entre le score de base et l'impact
  return (baseScore * 0.7) + (averageImpact * 0.3);
}

function calculateConfidence(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0;
  
  const totalStrength = evidence.reduce((sum, e) => sum + e.strength, 0);
  const averageStrength = totalStrength / evidence.length;
  
  return Math.min(1, averageStrength);
}
```

---

## Graphe Complet

### Technical Competencies

```
Architecture
    ↓ (0.9)
System Design
    ↓ (0.8)
Scalability
    ↓ (0.9)
Tradeoffs
    ↓ (0.7)
Patterns
    ↓ (0.6)
Evolution

Debugging
    ↓ (0.7)
Problem Solving
    ↓ (0.9)
Analysis
    ↓ (0.6)
Creativity
    ↓ (0.8)
Root Cause
    ↓ (0.9)
Solution

Coding
    ↓ (0.8)
Quality
    ↓ (0.7)
Readability
    ↓ (0.6)
Maintainability
    ↓ (0.8)
Performance
```

### Behavioral Competencies

```
Leadership
    ↓ (0.8)
Communication
    ↓ (0.9)
Clarity
    ↓ (0.8)
Listening
    ↓ (0.7)
Presentation
    ↓ (0.6)
Writing
    ↓ (0.8)
Technical

Leadership
    ↓ (0.9)
Ownership
    ↓ (0.7)
Influence
    ↓ (0.6)
Conflict
    ↓ (0.8)
Decision Making

Teamwork
    ↓ (0.8)
Collaboration
    ↓ (0.7)
Communication
    ↓ (0.6)
Conflict
    ↓ (0.8)
Trust

Adaptability
    ↓ (0.7)
Learning
    ↓ (0.8)
Change
    ↓ (0.6)
Resilience
    ↓ (0.9)
Flexibility
```

### Product Competencies

```
Product
    ↓ (0.9)
User Empathy
    ↓ (0.8)
Prioritization
    ↓ (0.7)
Metrics
    ↓ (0.9)
Value
    ↓ (0.6)
Delivery

Product
    ↓ (0.8)
Business Acumen
    ↓ (0.7)
ROI
    ↓ (0.9)
Strategy
    ↓ (0.6)
Market
```

---

## Propagation des Scores

### Score Propagation

```typescript
interface ScorePropagation {
  competency: string;
  oldScore: number;
  newScore: number;
  delta: number;
  propagatedTo: PropagatedScore[];
}

interface PropagatedScore {
  competency: string;
  oldScore: number;
  newScore: number;
  delta: number;
  weight: number;
}

function propagateScoreChange(
  competency: string,
  oldScore: number,
  newScore: number,
  graph: CompetencyGraph
): ScorePropagation {
  const delta = newScore - oldScore;
  const propagatedTo: PropagatedScore[] = [];
  
  // Trouver les compétences influencées
  const edges = graph.edges.filter(e => e.from === competency);
  
  edges.forEach(edge => {
    const toNode = graph.nodes.find(n => n.id === edge.to);
    if (!toNode) return;
    
    const impact = delta * edge.weight;
    const newInfluencedScore = Math.max(0, Math.min(100, toNode.score + impact));
    
    propagatedTo.push({
      competency: edge.to,
      oldScore: toNode.score,
      newScore: newInfluencedScore,
      delta: impact,
      weight: edge.weight
    });
  });
  
  return {
    competency,
    oldScore,
    newScore,
    delta,
    propagatedTo
  };
}
```

---

## Détection des Contradictions

### Contradiction Detection

```typescript
interface CompetencyContradiction {
  competency: string;
  evidenceA: Evidence;
  evidenceB: Evidence;
  conflict: string;
  severity: 'low' | 'medium' | 'high';
}

function detectCompetencyContradictions(
  competency: string,
  evidence: Evidence[]
): CompetencyContradiction[] {
  const contradictions: CompetencyContradiction[] = [];
  
  for (let i = 0; i < evidence.length; i++) {
    for (let j = i + 1; j < evidence.length; j++) {
      const evidenceA = evidence[i];
      const evidenceB = evidence[j];
      
      const contradiction = checkContradiction(evidenceA, evidenceB);
      if (contradiction) {
        contradictions.push({
          competency,
          evidenceA,
          evidenceB,
          conflict: contradiction,
          severity: calculateSeverity(evidenceA, evidenceB)
        });
      }
    }
  }
  
  return contradictions;
}

function checkContradiction(evidenceA: Evidence, evidenceB: Evidence): string | null {
  // Vérifier si les preuves sont contradictoires
  if (evidenceA.strength > 0.7 && evidenceB.strength > 0.7) {
    if (evidenceA.description.includes('excellent') && evidenceB.description.includes('poor')) {
      return 'Contradictory evidence: excellent vs poor';
    }
    if (evidenceA.description.includes('strong') && evidenceB.description.includes('weak')) {
      return 'Contradictory evidence: strong vs weak';
    }
  }
  
  return null;
}

function calculateSeverity(evidenceA: Evidence, evidenceB: Evidence): 'low' | 'medium' | 'high' {
  const combinedStrength = (evidenceA.strength + evidenceB.strength) / 2;
  
  if (combinedStrength > 0.8) return 'high';
  if (combinedStrength > 0.5) return 'medium';
  return 'low';
}
```

---

## Visualisation du Graphe

### Graph Visualization

```typescript
interface GraphVisualization {
  nodes: VisualNode[];
  edges: VisualEdge[];
  layout: GraphLayout;
}

interface VisualNode {
  id: string;
  label: string;
  score: number;
  category: CompetencyCategory;
  position: Position;
  size: number;
  color: string;
}

interface VisualEdge {
  from: string;
  to: string;
  weight: number;
  type: EdgeType;
  width: number;
  color: string;
}

interface Position {
  x: number;
  y: number;
}

interface GraphLayout {
  type: 'force' | 'hierarchical' | 'circular';
  parameters: LayoutParameters;
}

interface LayoutParameters {
  iterations?: number;
  spacing?: number;
  gravity?: number;
}
```

---

## Conclusion

Le Competency Graph spécifie comment chaque compétence influence les autres avec :

1. **Graphe de compétences** : Leadership, Architecture, Problem Solving, Communication, Product
2. **Spécification du graphe** : Competency Graph, Competency Score, Score Calculation
3. **Graphe complet** : Technical Competencies, Behavioral Competencies, Product Competencies
4. **Propagation des scores** : Score Propagation, Propagated Score
5. **Détection des contradictions** : Competency Contradiction, Contradiction Detection
6. **Visualisation du graphe** : Graph Visualization, Visual Node, Visual Edge

Ce document fournit une spécification exécutable pour implémenter le graphe de compétences.
