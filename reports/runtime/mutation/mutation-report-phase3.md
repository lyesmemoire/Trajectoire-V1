# Audit par mutation ciblée - execution-pipeline (Phase 3)

## Objectif

Mutations sur getters/setters et cache pour éviter les timeouts.

## Résultats

| KILLED | 12 |
| SURVIVED | 0 |
| INVALID | 10 |
| Mutation Score | 100.00% |
| Nombre total de mutations valides | 12 |

## Détail des mutations

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
