# Stress-test P4.3 — 1000 interviews seedées

Total tours cumulés: 40000

## Bornage
- Violations bornes (Mind+Sim): 0 — PASS

## Drift (pente max |β| sur 2e moitié, seuil 0.05)
- suspicion: 0.0000 — PASS
- pression:  0.0000 — PASS

## Oscillation UX (énergie max |Δ|, seuil 0.25)
- toneShift:     0.0149 — PASS
- interruption:  0.0090 — PASS
- silence:       0.0060 — PASS

## Enveloppe (variance fin/début max fini, seuil 3)
- ratio: 0.0000 — PASS

## Path dependency (distance L1 max seeds adjacents, seuil 0.6)
- distance: 0.0000 — PASS

## Distribution des émotions finales
- annoyed: 1000 (100.0%)
