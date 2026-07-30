# AST Mutation Engine — Documentation Technique

## Vue d'ensemble

Le moteur de mutation AST remplace le système historique basé sur des fichiers JSON statiques
(`mutations.json`, `regressions.json`) qui utilisaient des **numéros de ligne fragiles**.

Le nouveau système analyse le code source via l'API TypeScript Compiler pour découvrir
automatiquement les cibles de mutation et de régression. Aucun numéro de ligne n'est stocké.

## Architecture

```
certification/
    ast-mutator.cjs          ← Moteur AST du pipeline
    mutation.cjs              ← Exécuteur de mutations (consomme le moteur AST)
    regression.cjs            ← Exécuteur de régressions (consomme le moteur AST)

laboratory/
    independent-ast-mutator.cjs  ← Moteur AST indépendant du laboratoire
    replay/mutation.cjs          ← Rejoue les mutations via le moteur labo
    replay/regression.cjs        ← Rejoue les régressions via le moteur labo
```

> **Principe ISO 17025** : Les deux moteurs (`ast-mutator.cjs` et `independent-ast-mutator.cjs`)
> sont des implémentations **séparées et indépendantes**. Le laboratoire n'importe jamais
> de module du dossier `certification/`.

## Identification Sémantique

Chaque mutation/régression reçoit un identifiant stable basé sur :

```
SHA-256(
    fileName
  + nodeKind        (ex: BinaryExpression, ExpressionStatement)
  + functionName    (ex: cycle, validate, run)
  + normalizedText  (ex: "this.statistics.instructionsExecuted++")
  + description     (ex: "Remove statement")
)
```

**Exemple d'ID** : `AST-MUT-03d02f907b162c94`

Cet identifiant **ne change jamais** tant que :
- Le fichier n'est pas renommé
- La fonction n'est pas renommée
- Le code sémantique du nœud n'est pas modifié

Les opérations suivantes **ne changent pas** l'identifiant :
- Reformater le code (Prettier, ESLint fix)
- Ajouter/supprimer des commentaires
- Ajouter/supprimer des lignes vides
- Déplacer des blocs de code dans le fichier

## Catégories de Mutations

### Mutations (opérateurs, booléens, littéraux)

| Type | Exemple | Remplacement |
|------|---------|--------------|
| Opérateur arithmétique | `a + b` | `a - b` |
| Opérateur de comparaison | `a === b` | `a !== b` |
| Opérateur relationnel | `a < b` | `a >= b` |
| Booléen | `true` | `false` |
| Littéral numérique | `0` | `1` |

### Régressions (transformations structurelles)

| Type | Exemple | Remplacement |
|------|---------|--------------|
| Suppression de statement | `this.statistics.errors++` | `/* statement removed */` |
| Modification de retour | `return this.getStatistics()` | `return undefined;` |
| Condition forcée false | `if (this.context.isHalted())` | `if (false)` |
| Condition forcée true | `if (!result.success)` | `if (true)` |

## Catalog de Mutations

À chaque exécution, le moteur produit un fichier `mutation-catalog.json` (et `regression-catalog.json`)
contenant l'intégralité des mutations/régressions découvertes :

```json
{
  "id": "AST-MUT-03d02f907b162c94",
  "category": "Mutation",
  "kind": "TrueKeyword",
  "file": "execution-pipeline.ts",
  "function": "global",
  "description": "true -> false",
  "original": "true",
  "replacement": "false",
  "hash": "03d02f907b162c94",
  "sourceSpan": {
    "start": 625,
    "end": 629
  }
}
```

## Convergence Pipeline ↔ Laboratoire

Le laboratoire redécouvre **exactement** les mêmes mutations avec des IDs identiques :

```
Pipeline: 71 entries
Lab:      71 entries
IDs:      100% identiques
Spans:    100% identiques
```

Ceci est garanti par :
1. L'utilisation de la même API TypeScript Compiler
2. Le même algorithme de parcours (depth-first, left-to-right)
3. Le même algorithme de normalisation de texte
4. Le même algorithme de hachage sémantique

## Benchmark

| Opération | Temps |
|-----------|-------|
| Parsing AST (TypeScript Compiler API) | < 50ms |
| Découverte de 71 mutations/régressions | < 10ms |
| Exécution Vitest par mutation | ~3-5s |
| Pipeline complet (11 mutations + 60 régressions) | ~4-6 min |
