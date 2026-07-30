# Audit de régression fonctionnelle - execution-pipeline

## Résumé

| Total régressions | 22 |
| Détectées | 0 |
| Non détectées | 0 |
| Build errors | 22 |
| Regression Detection Rate | 0.00% |
| Régressions manquées critiques | 0 |

## Certification

**FAILED**

## Tableau des régressions

| ID | Description | Catégorie | Critique | Compilation | Tests | Exit code | Status |
| R1 | Supprimer fetch() | Pipeline | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R2 | Supprimer decode() | Pipeline | Oui | KO | non | N/A | BUILD ERROR |
| R3 | Supprimer execute() | Pipeline | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R4 | Inverser fetch/decode (decode avant fetch) | Pipeline | Oui | KO | non | N/A | BUILD ERROR |
| R5 | Supprimer stop() | Control | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R6 | Supprimer reset() | Control | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R7 | validate() retourne toujours true | Validation | Oui | KO | non | N/A | BUILD ERROR |
| R8 | Supprimer throw sur erreur | Error Handling | Oui | KO | non | N/A | BUILD ERROR |
| R9 | Ne jamais incrémenter instructionsExecuted | Statistics | Non | OK | oui | SIGTERM | BUILD ERROR |
| R10 | Ne jamais incrémenter cycles | Statistics | Non | KO | non | N/A | BUILD ERROR |
| R11 | Ne jamais incrémenter errors | Statistics | Non | KO | non | N/A | BUILD ERROR |
| R12 | Ignorer branchTaken (ne pas incrémenter branchesTaken) | Branch | Non | KO | non | N/A | BUILD ERROR |
| R13 | Ignorer CALL (ne pas incrémenter calls) | Branch | Non | OK | oui | SIGTERM | BUILD ERROR |
| R14 | Ignorer RETURN (ne pas incrémenter returns) | Branch | Non | OK | oui | SIGTERM | BUILD ERROR |
| R15 | getStatistics() retourne {} | Statistics | Oui | KO | non | N/A | BUILD ERROR |
| R16 | getStatistics() retourne des statistiques fixes | Statistics | Oui | KO | non | N/A | BUILD ERROR |
| R17 | Ignorer halt (inverser condition) | Control | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R18 | Ignorer validation PC overflow | Validation | Oui | KO | non | N/A | BUILD ERROR |
| R19 | Supprimer remise à zéro des statistiques dans reset() | Control | Non | KO | non | N/A | BUILD ERROR |
| R20 | Inverser condition de validation (valid: errors.length !== 0) | Validation | Oui | KO | non | N/A | BUILD ERROR |
| R21 | Supprimer commit (ne pas mettre à jour les statistiques après exécution) | Pipeline | Oui | OK | oui | SIGTERM | BUILD ERROR |
| R22 | Ignorer branchNotTaken | Branch | Non | KO | non | N/A | BUILD ERROR |

## Détection par fonction


### Pipeline
- Total: 5
- Détectées: 0
- Non détectées: 0
- Build errors: 5
- Taux de détection: 0.00%


### Control
- Total: 4
- Détectées: 0
- Non détectées: 0
- Build errors: 4
- Taux de détection: 0.00%


### Validation
- Total: 3
- Détectées: 0
- Non détectées: 0
- Build errors: 3
- Taux de détection: 0.00%


### Error Handling
- Total: 1
- Détectées: 0
- Non détectées: 0
- Build errors: 1
- Taux de détection: 0.00%


### Statistics
- Total: 5
- Détectées: 0
- Non détectées: 0
- Build errors: 5
- Taux de détection: 0.00%


### Branch
- Total: 4
- Détectées: 0
- Non détectées: 0
- Build errors: 4
- Taux de détection: 0.00%


## SHA

| SHA avant | 3e22378 |
| SHA après | 3e22378 |
| Identique | OUI |

## Note

Cet audit simule de vraies régressions qu'un développeur pourrait introduire. Chaque régression a été appliquée, compilée et testée individuellement, puis le fichier a été restauré. Le SHA Git a été vérifié avant et après pour garantir l'intégrité du dépôt.
