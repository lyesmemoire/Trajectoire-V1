# Audit par mutation ciblée - execution-pipeline (Phase 2)

## Objectif

Augmenter le nombre de mutations VALIDES pour obtenir un échantillon statistiquement représentatif.

## Résultats

| KILLED | 8 |
| SURVIVED | 0 |
| INVALID | 27 |
| Mutation Score | 100.00% |
| Nombre total de mutations valides | 8 |

## Détail des mutations

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
