# Blueprint DSL CIR (Cognitive Intermediate Representation)

Le module CIR fournit une représentation intermédiaire cognitive pour le compilateur Blueprint V3.

## Composants

### Core IR Types (`ir-generator.ts`)
- `IRModule` - Module IR contenant des fonctions et des globales
- `IRFunction` - Fonction IR avec paramètres, blocs de base et type de retour
- `IRBasicBlock` - Bloc de base IR avec instructions et prédécesseurs/successeurs
- `IRInstruction` - Instruction IR avec type, opérandes et résultat
- `IRNode` - Nœud IR de base avec ID et type
- `IRNodeType` - Types de nœuds IR (FUNCTION, BASIC_BLOCK, INSTRUCTION, etc.)
- `IRInstructionType` - Types d'instructions IR (ADD, SUB, CALL, RET, etc.)
- `IRGenerator` - Générateur d'IR à partir de l'AST

### SSA Form (`ssa-form.ts`)
- `SSAForm` - Conversion de l'IR en forme SSA (Static Single Assignment)
- Calcul des frontières de dominance
- Insertion de nœuds PHI
- Renommage des variables

### CFG Builder (`cfg-builder.ts`)
- `CFGBuilder` - Construction du graphe de flux de contrôle
- `ControlFlowGraph` - Structure du CFG avec nœuds et arêtes
- Calcul des dominants
- Détection des boucles naturelles
- Validation du CFG

### Visitor Pattern (`ir-visitor.ts`)
- `IRVisitor` - Interface visiteur pour traverser l'IR
- `BaseIRVisitor` - Implémentation de base du visiteur
- `IRTraverser` - Traversée de l'IR avec un visiteur
- `IRTransformer` - Transformation de l'IR avec des passes
- `IRAnalyzer` - Analyse de l'IR et collecte de métriques
- `IRValidator` - Validation de la structure de l'IR
- `IRPrinter` - Impression de l'IR pour le débogage

### Serializer (`ir-serializer.ts`)
- `IRSerializer` - Sérialisation de l'IR en JSON
- Désérialisation de JSON vers IR
- Sérialisation binaire de l'IR
- Désérialisation binaire vers IR

### Pass Manager (`pass-manager.ts`)
- `PassManager` - Gestionnaire de passes d'optimisation
- `Pass` - Interface pour une passe d'optimisation
- `PassResult` - Résultat d'exécution d'une passe
- `DeadCodeEliminationPass` - Élimination du code mort
- `ConstantFoldingPass` - Pliage de constantes
- `InlinePass` - Inlining de fonctions
- `LoopInvariantCodeMotionPass` - Déplacement de code invariant de boucle
- `CommonSubexpressionEliminationPass` - Élimination de sous-expressions communes

### Graph Builder (`graph-builder.ts`)
- `GraphBuilder` - Construction de graphes pour visualisation
- `buildCFGGraph` - Construction d'un graphe à partir d'un CFG
- `buildFunctionGraph` - Construction d'un graphe de fonction
- `buildModuleGraph` - Construction d'un graphe de module
- `buildCallGraph` - Construction d'un graphe d'appels
- `buildDominanceTreeGraph` - Construction d'un arbre de dominance
- `exportToDOT` - Export en format DOT (Graphviz)
- `exportToJSON` - Export en format JSON
- `exportToMermaid` - Export en format Mermaid

### Optimizer (`optimizer.ts`)
- `Optimizer` - Optimiseur coordonnant les passes
- `OptimizationLevel` - Niveaux d'optimisation (O0, O1, O2, O3)
- `OptimizationResult` - Résultat d'optimisation
- `OptimizationPipeline` - Pipeline d'optimisation multi-étapes

### Region (`region.ts`)
- `RegionBuilder` - Construction de régions pour l'analyse
- `IRRegion` - Région IR regroupant des blocs
- `RegionType` - Types de régions (SIMPLE, LOOP, IF_THEN, etc.)
- Détection de boucles
- Détection de régions conditionnelles
- Calcul de complexité de région

### Pipeline (`pipeline.ts`)
- `IRPipeline` - Pipeline pour chaîner des opérations sur l'IR
- `PipelineStage` - Étape de pipeline
- `StageResult` - Résultat d'une étape
- `PipelineResult` - Résultat du pipeline
- `ValidationStage` - Étape de validation
- `SSAConversionStage` - Étape de conversion SSA
- `CFGConstructionStage` - Étape de construction CFG
- `OptimizationStage` - Étape d'optimisation
- `SerializationStage` - Étape de sérialisation
- `PrintingStage` - Étape d'impression
- `DefaultPipeline` - Pipeline par défaut
- `FastPipeline` - Pipeline rapide
- `AggressivePipeline` - Pipeline agressif

## Utilisation

### Génération d'IR
```typescript
import { IRGenerator } from './compiler/cir';

const generator = new IRGenerator();
const result = generator.generate(astNode);
```

### Conversion SSA
```typescript
import { SSAForm } from './compiler/cir';

const ssaForm = new SSAForm();
ssaForm.convertToSSA(irFunction);
```

### Construction CFG
```typescript
import { CFGBuilder } from './compiler/cir';

const cfgBuilder = new CFGBuilder();
const cfg = cfgBuilder.buildCFG(irFunction);
```

### Optimisation
```typescript
import { Optimizer } from './compiler/cir';

const optimizer = new Optimizer();
const result = optimizer.optimize(module, 'O2');
```

### Pipeline
```typescript
import { DefaultPipeline } from './compiler/cir';

const pipeline = new DefaultPipeline();
const result = pipeline.run(module);
```

## Niveaux d'Optimisation

- **O0** - Aucune optimisation
- **O1** - Optimisations de base (pliage de constantes, élimination de code mort)
- **O2** - Optimisations moyennes (O1 + inlining, élimination de sous-expressions communes)
- **O3** - Optimisations agressives (O2 + déplacement de code invariant de boucle)

## Formats d'Export

- **DOT** - Format Graphviz pour visualisation
- **JSON** - Format JSON pour sérialisation
- **Mermaid** - Format Mermaid pour documentation

## Métriques

Le module CIR collecte diverses métriques:
- Nombre d'instructions éliminées
- Nombre d'instructions pliées
- Nombre de fonctions inlinées
- Nombre d'expressions communes éliminées
- Temps d'exécution par étape
- Taille de l'IR sérialisée
