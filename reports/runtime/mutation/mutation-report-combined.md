# Audit par mutation ciblée - execution-pipeline (Rapport Combiné)

## Objectif

Augmenter le nombre de mutations VALIDES pour obtenir un échantillon statistiquement représentatif (30+ mutations valides).

## Résumé des phases

| Phase | Total | KILLED | SURVIVED | INVALID | Valides |
|-------|-------|--------|----------|---------|---------|
| Phase 2 | 35 | 8 | 0 | 27 | 8 |
| Phase 3 | 22 | 12 | 0 | 10 | 12 |
| Phase 4 | 26 | 17 | 0 | 9 | 17 |
| **TOTAL** | **83** | **37** | **0** | **46** | **37** |

## Résultats globaux

| KILLED | 37 |
| SURVIVED | 0 |
| INVALID | 46 |
| Mutation Score | 100.00% |
| Nombre total de mutations valides | 37 |

## Certification

**GOLD**

## Survivants

Aucune mutation survivante

## Détail de toutes les mutations

### Phase 2 (35 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
| 1 | 74 | +=2 instead of ++ | KILLED |
| 2 | 75 | +=2 instead of ++ | KILLED |
| 3 | 78 | +=2 instead of ++ | INVALID |
| 4 | 80 | +=2 instead of ++ | INVALID |
| 5 | 84 | +=2 instead of ++ | INVALID |
| 6 | 88 | +=2 instead of ++ | INVALID |
| 7 | 92 | +=2 instead of ++ | INVALID |
| 8 | 77 | invert branchTaken | INVALID |
| 9 | 79 | !== instead of === | INVALID |
| 10 | 83 | invert isCall | INVALID |
| 11 | 87 | invert isReturn | INVALID |
| 12 | 43 | 0 → 1 | INVALID |
| 13 | 44 | 0 → 1 | INVALID |
| 14 | 45 | 0 → 1 | INVALID |
| 15 | 46 | 0 → 1 | INVALID |
| 16 | 47 | 0 → 1 | INVALID |
| 17 | 48 | 0 → 1 | INVALID |
| 18 | 49 | 0 → 1 | INVALID |
| 19 | 234 | < → <= | INVALID |
| 20 | 239 | >= → > | KILLED |
| 21 | 244 | === → !== | INVALID |
| 22 | 144 | +1 to instructionsExecuted in return | INVALID |
| 23 | 144 | +1 to cycles in return | INVALID |
| 24 | 144 | +1 to branchesTaken in return | INVALID |
| 25 | 144 | +1 to errors in return | INVALID |
| 26 | 116 | < → <= | KILLED |
| 27 | 116 | i = 0 → i = 1 | KILLED |
| 28 | 105 | && → || | INVALID |
| 29 | 116 | && → || | INVALID |
| 30 | 28 | false → true | INVALID |
| 31 | 103 | true → false | INVALID |
| 32 | 137 | false → true | KILLED |
| 33 | 74 | +=3 instead of ++ | KILLED |
| 34 | 75 | +=3 instead of ++ | KILLED |
| 35 | 78 | +=3 instead of ++ | INVALID |

### Phase 3 (22 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
| 36 | 151 | return decode instead of fetch | INVALID |
| 37 | 151 | return execute instead of fetch | INVALID |
| 38 | 158 | return fetch instead of decode | INVALID |
| 39 | 158 | return execute instead of decode | INVALID |
| 40 | 165 | return fetch instead of execute | INVALID |
| 41 | 165 | return decode instead of execute | INVALID |
| 42 | 172 | return null instead of context | INVALID |
| 43 | 179 | remove setBytecode call | INVALID |
| 44 | 180 | remove reset call | KILLED |
| 45 | 187 | return empty array | INVALID |
| 46 | 208 | remove enableCache call | KILLED |
| 47 | 215 | remove disableCache call | KILLED |
| 48 | 222 | remove setCacheSize call | KILLED |
| 49 | 222 | size * 2 | KILLED |
| 50 | 222 | size + 1 | KILLED |
| 51 | 201 | return null | KILLED |
| 52 | 201 | return empty stats | KILLED |
| 53 | 134 | remove context.reset | INVALID |
| 54 | 135 | remove clearCache | KILLED |
| 55 | 136 | remove statistics reset | KILLED |
| 56 | 127 | remove stop | KILLED |
| 57 | 194 | return null instead of cycle | KILLED |

### Phase 4 (26 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
| 58 | 74 | +=4 instead of ++ | KILLED |
| 59 | 74 | +=5 instead of ++ | KILLED |
| 60 | 75 | +=4 instead of ++ | KILLED |
| 61 | 75 | +=5 instead of ++ | KILLED |
| 62 | 116 | i < n → i < n - 1 | KILLED |
| 63 | 116 | i < n → i < n + 1 | KILLED |
| 64 | 116 | i = 0 → i = 2 | KILLED |
| 65 | 116 | i++ → i += 2 | KILLED |
| 66 | 144 | +2 to instructionsExecuted in return | INVALID |
| 67 | 144 | +2 to cycles in return | INVALID |
| 68 | 144 | +1 to branchesNotTaken in return | INVALID |
| 69 | 144 | +1 to calls in return | INVALID |
| 70 | 144 | +1 to returns in return | INVALID |
| 71 | 222 | size * 3 | KILLED |
| 72 | 222 | size + 2 | KILLED |
| 73 | 222 | size - 1 | KILLED |
| 74 | 134 | remove context.reset | INVALID |
| 75 | 135 | remove clearCache | KILLED |
| 76 | 136 | remove statistics reset | KILLED |
| 77 | 127 | remove stop | KILLED |
| 78 | 201 | return stats with hits=1 | KILLED |
| 79 | 201 | return stats with misses=1 | KILLED |
| 80 | 201 | return stats with hits=1, misses=1 | KILLED |
| 81 | 194 | return undefined instead of cycle | INVALID |
| 82 | 43 | 0 → 2 | INVALID |
| 83 | 44 | 0 → 2 | INVALID |
