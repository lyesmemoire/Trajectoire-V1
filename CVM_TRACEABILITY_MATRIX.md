---
catalogVersion: 1.0
lastUpdated: 2026-07-29
propertyCatalogVersion: 1.0
laboratoryControlsVersion: 1.0
---

# CVM Traceability Matrix

This document provides traceability linking functional requirements to testing artifacts, particularly focusing on the Property-Based Testing (PBT) suite, the Fuzzing Engine, and Laboratory zero-trust checks for the Cognitive Virtual Machine (CVM).

> **Extensibility Note**
> Les identifiants R-xxx, P-xxx, F-xxx et L-xxx sont considérés comme stables.
> Les nouvelles exigences utiliseront les numéros suivants disponibles afin de préserver la traçabilité historique.

## Matrix

| Requirement | Criticality | Component | Unit | Mutation | PBT | Fuzz | Chaos | Lab | Status |
|---|---|---|---|---|---|---|---|---|---|
| **R-001** (Pipeline Invariant) | High | ExecutionPipeline | `✓` | `✓` | P-005 | F-004 | C-001 | L-033, L-041, L-050 | PASS |
| **R-002** (Exception Handling) | High | ExecutionPipeline | `✓` | `✓` | P-006 | F-004 | C-001 | L-034, L-042, L-051 | PASS |
| **R-003** (Deterministic State) | High | ExecutionPipeline | `✓` | `✓` | P-007 | F-004 | C-002 | L-035, L-043, L-052 | PASS |
| **R-004** (Rollback Consistency) | Medium | ExecutionPipeline | `✓` | `✓` | P-008 | F-004 | C-002 | L-036, L-044, L-053 | PASS |
| **R-005** (Execution Integrity) | High | ExecutionPipeline | `✓` | `✓` | P-009 | F-004 | C-003 | L-037, L-045, L-054 | PASS |
| **R-006** (Context Reset Isolation) | Medium | ExecutionContext | `✓` | `✓` | P-010 | F-003 | C-004 | L-038, L-046, L-055 | PASS |
| **R-007** (Memory Bounds) | Critical | ExecutionContext | `✓` | `✓` | P-011 | F-003 | C-004 | L-039, L-047, L-056 | PASS |
| **R-008** (Snapshot Stability) | High | ExecutionContext | `✓` | `✓` | P-012 | F-003 | C-005 | L-040, L-048, L-057 | PASS |
| **R-009** (Data Isolation) | High | ExecutionContext | `✓` | `✓` | P-013 | F-003 | C-006 | L-040, L-049, L-057 | PASS |

## Property Catalog Map (P-xxx)

- **P-005**: Cycle d'exécution invariant
- **P-006**: Absence d'exception inattendue
- **P-007**: Déterminisme avec snapshots
- **P-008**: Gestion des erreurs déterministe
- **P-009**: Intégrité du PC et de la stack
- **P-010**: Isolation lors d'un Reset
- **P-011**: Validation des tailles mémoire
- **P-012**: Stabilité des snapshots en l'absence de modifications
- **P-013**: Isolation des données lors du snapshot

## Fuzzing Catalog Map (F-xxx)

- **F-001**: Parser Target
- **F-002**: Compiler Target
- **F-003**: VM Target
- **F-004**: Pipeline Target
- **F-005**: Scheduler Strategy
- **F-006**: Corpus Manager
- **F-007**: Oracle Rules
- **F-008**: Coverage Tracker
- **F-009**: Crash Reporter

## Chaos Engineering Map (C-xxx)

- **C-001**: Process Resilience (SIGTERM, Kill)
- **C-002**: Disk Failures (ENOSPC, EACCES)
- **C-003**: Memory Exhaustion (OOM)
- **C-004**: System Constraints (Missing vars, EBUSY)
- **C-005**: Time Anomalies (Clock Drift, Gel)
- **C-006**: Network Failures (Timeout, DNS)

## Laboratory Rules Map (L-xxx)

### PBT Controls
- **L-033**: Exécution de la suite de propriétés.
- **L-034**: Seuil minimal de propriétés.
- **L-035**: Équilibre et qualité des générateurs.
- **L-036**: Résolution des contre-exemples trouvés.
- **L-037**: Stabilité et reproductibilité des seeds.
- **L-038**: Intégrité du catalogue de propriétés.
- **L-039**: Qualité statistique des générateurs.
- **L-040**: Garantie de reproductibilité des contre-exemples.

### Fuzzing Controls
- **L-041**: Corpus Regression.
- **L-042**: Crash Reproducibility.
- **L-043**: Coverage Growth.
- **L-044**: Corpus Integrity.
- **L-045**: Mutation Efficiency.
- **L-046**: Corpus Minimization.
- **L-047**: Campaign Reproducibility.
- **L-048**: Campaign Configuration Integrity.
- **L-049**: Fuzz Report Integrity.

### Chaos Controls
- **L-050**: Chaos campaign completed.
- **L-051**: All injected faults classified.
- **L-052**: Recovery verified.
- **L-053**: No orphan resources.
- **L-054**: Deterministic chaos replay.
- **L-055**: Cleanup completed.
- **L-056**: Snapshot integrity after recovery.
- **L-057**: DSSE integrity preserved.

### Independent Verification Controls
- **L-058**: Replay: PBT Semantic Match.
- **L-059**: Replay: Chaos Engineering Semantic Match.
- **L-060**: Replay: Fuzzing Semantic Match.
- **L-061**: Replay: Compiler Reproducibility.
- **L-062**: Audit Profile strict enforcement.
- **L-063**: Laboratory DSSE independent signature.
- **L-064**: Clean Room Isolation (No shared crypto dependencies).
- **L-065**: Zero-Trust Result Classification (IDENTICAL / CANONICAL_MATCH / SEMANTIC_MATCH / DIFF).

## Qualification Status

```text
Requirements Covered : 9 / 9
Properties Executed : 9 / 9
Fuzzing Targets    : 4 / 4
Chaos Scenarios    : 6 / 6
Mutation Covered   : 9 / 9
Laboratory Controls : 33 / 33
Overall Qualification : PASS
```
