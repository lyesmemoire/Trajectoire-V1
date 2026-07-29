# ETS-031 Knowledge Graph

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le graphe de connaissances du candidat qui capture les relations entre les projets, technologies, responsabilités, métriques, entreprises, dates et réalisations. Cela permet de détecter facilement les contradictions.

---

## Graphe de Connaissances

### Structure du Graphe

```
Projects
    ↓
Technologies
    ↓
Responsibilities
    ↓
Metrics
    ↓
Companies
    ↓
Dates
    ↓
Achievements
```

---

## Spécification du Graphe

### Knowledge Graph

```typescript
interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

interface KnowledgeNode {
  id: string;
  type: NodeType;
  data: NodeData;
  confidence: number;
  source: string;
  lastUpdated: Date;
}

interface KnowledgeEdge {
  from: string;
  to: string;
  type: EdgeType;
  weight: number;
  confidence: number;
}

type NodeType = 
  | 'project'
  | 'technology'
  | 'responsibility'
  | 'metric'
  | 'company'
  | 'date'
  | 'achievement';

type EdgeType = 
  | 'uses'
  | 'responsible_for'
  | 'measured_by'
  | 'worked_at'
  | 'achieved'
  | 'during'
  | 'before'
  | 'after';

interface NodeData {
  project?: ProjectData;
  technology?: TechnologyData;
  responsibility?: ResponsibilityData;
  metric?: MetricData;
  company?: CompanyData;
  date?: DateData;
  achievement?: AchievementData;
}
```

---

### Project Node

```typescript
interface ProjectData {
  name: string;
  description: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  duration: number;
  technologies: string[];
  responsibilities: string[];
  metrics: Metric[];
  achievements: Achievement[];
}

interface ProjectNode extends KnowledgeNode {
  type: 'project';
  data: ProjectData;
}
```

---

### Technology Node

```typescript
interface TechnologyData {
  name: string;
  category: TechnologyCategory;
  level: number;
  lastUsed: Date;
  projects: string[];
  years: number;
}

type TechnologyCategory = 
  | 'language'
  | 'framework'
  | 'database'
  | 'tool'
  | 'platform'
  | 'cloud';

interface TechnologyNode extends KnowledgeNode {
  type: 'technology';
  data: TechnologyData;
}
```

---

### Responsibility Node

```typescript
interface ResponsibilityData {
  description: string;
  project: string;
  role: string;
  impact: string;
  metrics: Metric[];
}

interface ResponsibilityNode extends KnowledgeNode {
  type: 'responsibility';
  data: ResponsibilityData;
}
```

---

### Metric Node

```typescript
interface MetricData {
  name: string;
  value: number;
  unit: string;
  project: string;
  responsibility?: string;
  measuredAt: Date;
  trend: 'up' | 'down' | 'stable';
}

interface MetricNode extends KnowledgeNode {
  type: 'metric';
  data: MetricData;
}
```

---

### Company Node

```typescript
_interface CompanyData {
  name: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  duration: number;
  projects: string[];
  technologies: string[];
}

interface CompanyNode extends KnowledgeNode {
  type: 'company';
  data: CompanyData;
}
```

---

### Date Node

```typescript
interface DateData {
  date: Date;
  type: DateType;
  project?: string;
  company?: string;
  achievement?: string;
}

type DateType = 
  | 'start'
  | 'end'
  | 'milestone'
  | 'achievement';

interface DateNode extends KnowledgeNode {
  type: 'date';
  data: DateData;
}
```

---

### Achievement Node

```typescript
interface AchievementData {
  description: string;
  project: string;
  company?: string;
  date: Date;
  metrics: Metric[];
  impact: string;
}

interface AchievementNode extends KnowledgeNode {
  type: 'achievement';
  data: AchievementData;
}
```

---

## Construction du Graphe

### Graph Builder

```typescript
interface GraphBuilder {
  addProject(project: ProjectData): void;
  addTechnology(technology: TechnologyData): void;
  addResponsibility(responsibility: ResponsibilityData): void;
  addMetric(metric: MetricData): void;
  addCompany(company: CompanyData): void;
  addDate(date: DateData): void;
  addAchievement(achievement: AchievementData): void;
  build(): KnowledgeGraph;
}

class KnowledgeGraphBuilder implements GraphBuilder {
  private nodes: KnowledgeNode[] = [];
  private edges: KnowledgeEdge[] = [];

  addProject(project: ProjectData): void {
    const projectId = `project-${project.name}`;
    this.nodes.push({
      id: projectId,
      type: 'project',
      data: { project },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });

    // Connect to technologies
    project.technologies.forEach(tech => {
      const techId = `technology-${tech}`;
      this.edges.push({
        from: projectId,
        to: techId,
        type: 'uses',
        weight: 1.0,
        confidence: 1.0
      });
    });

    // Connect to responsibilities
    project.responsibilities.forEach(resp => {
      const respId = `responsibility-${resp}`;
      this.edges.push({
        from: projectId,
        to: respId,
        type: 'responsible_for',
        weight: 1.0,
        confidence: 1.0
      });
    });

    // Connect to metrics
    project.metrics.forEach(metric => {
      const metricId = `metric-${metric.name}`;
      this.edges.push({
        from: projectId,
        to: metricId,
        type: 'measured_by',
        weight: 1.0,
        confidence: 1.0
      });
    });

    // Connect to achievements
    project.achievements.forEach(achievement => {
      const achievementId = `achievement-${achievement.description}`;
      this.edges.push({
        from: projectId,
        to: achievementId,
        type: 'achieved',
        weight: 1.0,
        confidence: 1.0
      });
    });
  }

  addTechnology(technology: TechnologyData): void {
    const techId = `technology-${technology.name}`;
    this.nodes.push({
      id: techId,
      type: 'technology',
      data: { technology },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });
  }

  addResponsibility(responsibility: ResponsibilityData): void {
    const respId = `responsibility-${responsibility.description}`;
    this.nodes.push({
      id: respId,
      type: 'responsibility',
      data: { responsibility },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });
  }

  addMetric(metric: MetricData): void {
    const metricId = `metric-${metric.name}`;
    this.nodes.push({
      id: metricId,
      type: 'metric',
      data: { metric },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });
  }

  addCompany(company: CompanyData): void {
    const companyId = `company-${company.name}`;
    this.nodes.push({
      id: companyId,
      type: 'company',
      data: { company },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });

    // Connect to projects
    company.projects.forEach(project => {
      const projectId = `project-${project}`;
      this.edges.push({
        from: companyId,
        to: projectId,
        type: 'worked_at',
        weight: 1.0,
        confidence: 1.0
      });
    });
  }

  addDate(date: DateData): void {
    const dateId = `date-${date.date.toISOString()}`;
    this.nodes.push({
      id: dateId,
      type: 'date',
      data: { date },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });
  }

  addAchievement(achievement: AchievementData): void {
    const achievementId = `achievement-${achievement.description}`;
    this.nodes.push({
      id: achievementId,
      type: 'achievement',
      data: { achievement },
      confidence: 1.0,
      source: 'cv',
      lastUpdated: new Date()
    });
  }

  build(): KnowledgeGraph {
    return {
      nodes: this.nodes,
      edges: this.edges
    };
  }
}
```

---

## Détection des Contradictions

### Contradiction Detection

```typescript
interface Contradiction {
  type: ContradictionType;
  nodeA: KnowledgeNode;
  nodeB: KnowledgeNode;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

type ContradictionType = 
  | 'timeline'
  | 'technology'
  | 'metric'
  | 'responsibility'
  | 'achievement';

function detectContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];

  // Detect timeline contradictions
  contradictions.push(...detectTimelineContradictions(graph));

  // Detect technology contradictions
  contradictions.push(...detectTechnologyContradictions(graph));

  // Detect metric contradictions
  contradictions.push(...detectMetricContradictions(graph));

  // Detect responsibility contradictions
  contradictions.push(...detectResponsibilityContradictions(graph));

  // Detect achievement contradictions
  contradictions.push(...detectAchievementContradictions(graph));

  return contradictions;
}

function detectTimelineContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const dateNodes = graph.nodes.filter(n => n.type === 'date');

  // Check for overlapping dates
  for (let i = 0; i < dateNodes.length; i++) {
    for (let j = i + 1; j < dateNodes.length; j++) {
      const dateA = dateNodes[i].data.date as DateData;
      const dateB = dateNodes[j].data.date as DateData;

      if (dateA.project === dateB.project) {
        if (dateA.type === 'start' && dateB.type === 'end') {
          if (dateA.date > dateB.date) {
            contradictions.push({
              type: 'timeline',
              nodeA: dateNodes[i],
              nodeB: dateNodes[j],
              description: `Start date (${dateA.date}) is after end date (${dateB.date}) for project ${dateA.project}`,
              severity: 'high'
            });
          }
        }
      }
    }
  }

  return contradictions;
}

function detectTechnologyContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const techNodes = graph.nodes.filter(n => n.type === 'technology');

  // Check for contradictory technology levels
  for (let i = 0; i < techNodes.length; i++) {
    for (let j = i + 1; j < techNodes.length; j++) {
      const techA = techNodes[i].data.technology as TechnologyData;
      const techB = techNodes[j].data.technology as TechnologyData;

      if (techA.name === techB.name) {
        if (Math.abs(techA.level - techB.level) > 2) {
          contradictions.push({
            type: 'technology',
            nodeA: techNodes[i],
            nodeB: techNodes[j],
            description: `Contradictory technology levels for ${techA.name}: ${techA.level} vs ${techB.level}`,
            severity: 'medium'
          });
        }
      }
    }
  }

  return contradictions;
}

function detectMetricContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const metricNodes = graph.nodes.filter(n => n.type === 'metric');

  // Check for contradictory metric values
  for (let i = 0; i < metricNodes.length; i++) {
    for (let j = i + 1; j < metricNodes.length; j++) {
      const metricA = metricNodes[i].data.metric as MetricData;
      const metricB = metricNodes[j].data.metric as MetricData;

      if (metricA.name === metricB.name && metricA.project === metricB.project) {
        if (Math.abs(metricA.value - metricB.value) > metricA.value * 0.5) {
          contradictions.push({
            type: 'metric',
            nodeA: metricNodes[i],
            nodeB: metricNodes[j],
            description: `Contradictory metric values for ${metricA.name}: ${metricA.value} vs ${metricB.value}`,
            severity: 'high'
          });
        }
      }
    }
  }

  return contradictions;
}

function detectResponsibilityContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const respNodes = graph.nodes.filter(n => n.type === 'responsibility');

  // Check for contradictory responsibilities
  for (let i = 0; i < respNodes.length; i++) {
    for (let j = i + 1; j < respNodes.length; j++) {
      const respA = respNodes[i].data.responsibility as ResponsibilityData;
      const respB = respNodes[j].data.responsibility as ResponsibilityData;

      if (respA.project === respB.project) {
        if (respA.role !== respB.role && respA.impact === 'high' && respB.impact === 'high') {
          contradictions.push({
            type: 'responsibility',
            nodeA: respNodes[i],
            nodeB: respNodes[j],
            description: `Contradictory high-impact responsibilities in different roles for project ${respA.project}`,
            severity: 'medium'
          });
        }
      }
    }
  }

  return contradictions;
}

function detectAchievementContradictions(graph: KnowledgeGraph): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const achievementNodes = graph.nodes.filter(n => n.type === 'achievement');

  // Check for contradictory achievements
  for (let i = 0; i < achievementNodes.length; i++) {
    for (let j = i + 1; j < achievementNodes.length; j++) {
      const achievementA = achievementNodes[i].data.achievement as AchievementData;
      const achievementB = achievementNodes[j].data.achievement as AchievementData;

      if (achievementA.project === achievementB.project) {
        if (achievementA.description.includes('improved') && achievementB.description.includes('degraded')) {
          contradictions.push({
            type: 'achievement',
            nodeA: achievementNodes[i],
            nodeB: achievementNodes[j],
            description: `Contradictory achievements for project ${achievementA.project}: improved vs degraded`,
            severity: 'high'
          });
        }
      }
    }
  }

  return contradictions;
}
```

---

## Requêtes sur le Graphe

### Graph Queries

```typescript
interface GraphQuery {
  findProjectsByTechnology(technology: string): ProjectData[];
  findProjectsByCompany(company: string): ProjectData[];
  findTechnologiesByProject(project: string): TechnologyData[];
  findMetricsByProject(project: string): MetricData[];
  findAchievementsByProject(project: string): AchievementData[];
  findTimelineByProject(project: string): DateData[];
  findContradictions(): Contradiction[];
}

class KnowledgeGraphQuery implements GraphQuery {
  constructor(private graph: KnowledgeGraph) {}

  findProjectsByTechnology(technology: string): ProjectData[] {
    const techNode = this.graph.nodes.find(n => 
      n.type === 'technology' && 
      (n.data.technology as TechnologyData).name === technology
    );

    if (!techNode) return [];

    const edges = this.graph.edges.filter(e => e.to === techNode.id && e.type === 'uses');
    const projectIds = edges.map(e => e.from);

    return projectIds.map(id => {
      const node = this.graph.nodes.find(n => n.id === id);
      return node ? node.data.project as ProjectData : null;
    }).filter(p => p !== null) as ProjectData[];
  }

  findProjectsByCompany(company: string): ProjectData[] {
    const companyNode = this.graph.nodes.find(n => 
      n.type === 'company' && 
      (n.data.company as CompanyData).name === company
    );

    if (!companyNode) return [];

    const edges = this.graph.edges.filter(e => e.from === companyNode.id && e.type === 'worked_at');
    const projectIds = edges.map(e => e.to);

    return projectIds.map(id => {
      const node = this.graph.nodes.find(n => n.id === id);
      return node ? node.data.project as ProjectData : null;
    }).filter(p => p !== null) as ProjectData[];
  }

  findTechnologiesByProject(project: string): TechnologyData[] {
    const projectNode = this.graph.nodes.find(n => 
      n.type === 'project' && 
      (n.data.project as ProjectData).name === project
    );

    if (!projectNode) return [];

    const edges = this.graph.edges.filter(e => e.from === projectNode.id && e.type === 'uses');
    const techIds = edges.map(e => e.to);

    return techIds.map(id => {
      const node = this.graph.nodes.find(n => n.id === id);
      return node ? node.data.technology as TechnologyData : null;
    }).filter(t => t !== null) as TechnologyData[];
  }

  findMetricsByProject(project: string): MetricData[] {
    const projectNode = this.graph.nodes.find(n => 
      n.type === 'project' && 
      (n.data.project as ProjectData).name === project
    );

    if (!projectNode) return [];

    const edges = this.graph.edges.filter(e => e.from === projectNode.id && e.type === 'measured_by');
    const metricIds = edges.map(e => e.to);

    return metricIds.map(id => {
      const node = this.graph.nodes.find(n => n.id === id);
      return node ? node.data.metric as MetricData : null;
    }).filter(m => m !== null) as MetricData[];
  }

  findAchievementsByProject(project: string): AchievementData[] {
    const projectNode = this.graph.nodes.find(n => 
      n.type === 'project' && 
      (n.data.project as ProjectData).name === project
    );

    if (!projectNode) return [];

    const edges = this.graph.edges.filter(e => e.from === projectNode.id && e.type === 'achieved');
    const achievementIds = edges.map(e => e.to);

    return achievementIds.map(id => {
      const node = this.graph.nodes.find(n => n.id === id);
      return node ? node.data.achievement as AchievementData : null;
    }).filter(a => a !== null) as AchievementData[];
  }

  findTimelineByProject(project: string): DateData[] {
    const projectNode = this.graph.nodes.find(n => 
      n.type === 'project' && 
      (n.data.project as ProjectData).name === project
    );

    if (!projectNode) return [];

    const dateNodes = this.graph.nodes.filter(n => 
      n.type === 'date' && 
      (n.data.date as DateData).project === project
    );

    return dateNodes.map(n => n.data.date as DateData);
  }

  findContradictions(): Contradiction[] {
    return detectContradictions(this.graph);
  }
}
```

---

## Mise à jour du Graphe

### Graph Update

```typescript
interface GraphUpdate {
  addNode(node: KnowledgeNode): void;
  removeNode(nodeId: string): void;
  addEdge(edge: KnowledgeEdge): void;
  removeEdge(edgeId: string): void;
  updateNode(nodeId: string, data: NodeData): void;
  mergeGraph(graph: KnowledgeGraph): void;
}

class KnowledgeGraphUpdate implements GraphUpdate {
  constructor(private graph: KnowledgeGraph) {}

  addNode(node: KnowledgeNode): void {
    this.graph.nodes.push(node);
  }

  removeNode(nodeId: string): void {
    this.graph.nodes = this.graph.nodes.filter(n => n.id !== nodeId);
    this.graph.edges = this.graph.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
  }

  addEdge(edge: KnowledgeEdge): void {
    this.graph.edges.push(edge);
  }

  removeEdge(edgeId: string): void {
    this.graph.edges = this.graph.edges.filter(e => `${e.from}-${e.to}-${e.type}` !== edgeId);
  }

  updateNode(nodeId: string, data: NodeData): void {
    const node = this.graph.nodes.find(n => n.id === nodeId);
    if (node) {
      node.data = data;
      node.lastUpdated = new Date();
    }
  }

  mergeGraph(graph: KnowledgeGraph): void {
    this.graph.nodes.push(...graph.nodes);
    this.graph.edges.push(...graph.edges);
  }
}
```

---

## Conclusion

Le Knowledge Graph spécifie le graphe de connaissances du candidat avec :

1. **Structure du graphe** : Projects, Technologies, Responsibilities, Metrics, Companies, Dates, Achievements
2. **Spécification du graphe** : Knowledge Graph, KnowledgeNode, KnowledgeEdge, NodeData
3. **Construction du graphe** : Graph Builder, KnowledgeGraphBuilder
4. **Détection des contradictions** : Contradiction Detection, Timeline, Technology, Metric, Responsibility, Achievement
5. **Requêtes sur le graphe** : Graph Queries, KnowledgeGraphQuery
6. **Mise à jour du graphe** : Graph Update, KnowledgeGraphUpdate

Ce document fournit une spécification exécutable pour implémenter le graphe de connaissances.
