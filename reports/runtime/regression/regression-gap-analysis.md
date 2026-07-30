# Analyse des gaps - Régressions non détectées

## Régressions analysées

### R5 - Supprimer stop()

**Fonction concernée:** `stop()` (ligne 127)

**Test censé la couvrir:** `should stop pipeline` (Run Modes)

**Pourquoi le test passe malgré la régression:**
- Le test existant `should stop pipeline` ne vérifie pas explicitement que l'appel à `stop()` arrête effectivement le pipeline
- Le test ne vérifie pas qu'après `stop()`, aucun cycle supplémentaire ne peut être exécuté
- Le test ne vérifie pas que les statistiques restent inchangées après `stop()`

**Assertion manquante:**
- Vérifier que `stop()` met `running` à `false`
- Vérifier qu'après `stop()`, `cycle()` ne modifie pas les statistiques
- Vérifier qu'après `stop()`, `runCycles(n)` n'exécute aucun cycle

**Scénario métier manquant:**
- Test d'intégration: exécuter quelques cycles, appeler `stop()`, puis tenter d'exécuter d'autres cycles et vérifier que les statistiques n'ont pas changé

---

### R6 - Supprimer reset()

**Fonction concernée:** `reset()` (ligne 133)

**Test censé la couvrir:** `should reset pipeline state`, `should reset context`, `should clear fetch cache` (Reset)

**Pourquoi le test passe malgré la régression:**
- Les tests existants vérifient que `reset()` est appelé mais ne vérifient pas explicitement que `reset()` fait son travail
- Si `reset()` est vide (fonction vide), les tests passent quand même car ils ne vérifient pas l'effet réel de `reset()`
- Le test `should reset statistics on flush` vérifie seulement `instructionsExecuted` et `cycles`, pas toutes les statistiques

**Assertion manquante:**
- Vérifier que `reset()` remet toutes les statistiques à zéro (pas seulement instructionsExecuted et cycles)
- Vérifier que `reset()` remet le contexte à zéro
- Vérifier que `reset()` vide le cache du fetch

**Scénario métier manquant:**
- Test d'intégration: exécuter plusieurs cycles, accumuler des statistiques, appeler `reset()`, puis vérifier que TOUTES les statistiques sont à zéro

---

### R10 - Ne jamais incrémenter cycles

**Fonction concernée:** `cycle()` - ligne 75

**Test censé la couvrir:** `should track cycles` (Statistics)

**Pourquoi le test passe malgré la régression:**
- Le test `should track cycles` est dans un bloc `try/catch` qui masque les erreurs
- Le test utilise du bytecode invalide (`[0x00, 0x01, 0x02, 0x03]`) qui peut causer des exceptions avant que `cycles` ne soit incrémenté
- Le test ne vérifie pas explicitement que `cycles` est incrémenté de +1 exactement

**Assertion manquante:**
- Vérifier que `cycles` est incrémenté de +1 exactement par appel à `cycle()`
- Vérifier que `cycles` n'est jamais +0 ou +2
- Utiliser du bytecode valide pour garantir que le test atteigne le code d'incrémentation

**Scénario métier manquant:**
- Test unitaire: appeler `cycle()` une fois et vérifier que `cycles` est exactement 1
- Test unitaire: appeler `cycle()` N fois et vérifier que `cycles` est exactement N

---

### R19 - Supprimer remise à zéro des statistiques dans reset()

**Fonction concernée:** `reset()` - ligne 135

**Test censé la couvrir:** `should reset statistics on flush` (Flush)

**Pourquoi le test passe malgré la régression:**
- Le test `should reset statistics on flush` vérifie seulement `instructionsExecuted` et `cycles`
- Il ne vérifie pas toutes les statistiques: `branchesTaken`, `branchesNotTaken`, `calls`, `returns`, `errors`
- Si la ligne `this.statistics = this.initializeStatistics()` est supprimée, le test passe car les deux statistiques vérifiées peuvent être à 0 par hasard

**Assertion manquante:**
- Vérifier que TOUTES les statistiques sont remises à zéro après `reset()`
- Vérifier explicitement: `branchesTaken`, `branchesNotTaken`, `calls`, `returns`, `errors`

**Scénario métier manquant:**
- Test d'intégration: exécuter des cycles qui génèrent des branches, calls, returns, errors, puis appeler `reset()` et vérifier que toutes ces statistiques sont à 0

---

## Résumé

| Régression | Fonction | Test existant | Problème principal | Tests à ajouter |
|-----------|----------|---------------|-------------------|-----------------|
| R5 | stop() | should stop pipeline | Pas de vérification explicite de l'effet de stop() | Test d'intégration stop() + vérification statistiques inchangées |
| R6 | reset() | should reset pipeline state | Pas de vérification explicite que reset() fait son travail | Test d'intégration reset() + vérification TOUTES statistiques à 0 |
| R10 | cycle() | should track cycles | try/catch masque les erreurs, bytecode invalide | Test unitaire avec bytecode valide, vérification +1 exact |
| R19 | reset() | should reset statistics on flush | Vérifie seulement 2 statistiques sur 7 | Vérifier toutes les 7 statistiques après reset() |

## Recommandations

1. **Pour R5 (stop()):** Ajouter un test qui exécute des cycles, appelle `stop()`, puis tente d'exécuter d'autres cycles et vérifie que les statistiques n'ont pas changé.

2. **Pour R6 (reset()):** Ajouter un test qui exécute des cycles accumulant toutes les statistiques, appelle `reset()`, puis vérifie que toutes les statistiques sont à 0.

3. **Pour R10 (cycles):** Remplacer ou compléter le test existant avec un test utilisant du bytecode valide et vérifiant que `cycles` est incrémenté de +1 exactement.

4. **Pour R19 (reset() statistiques):** Modifier le test existant pour vérifier toutes les 7 statistiques après `reset()`, pas seulement `instructionsExecuted` et `cycles`.
