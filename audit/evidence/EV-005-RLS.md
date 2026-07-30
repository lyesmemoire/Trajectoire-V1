# Evidence: Validation RLS Financiers (COR-001)

- **Correction-ID** : `COR-001`
- **Risk-ID** : `RSK-001`, `RSK-004`
- **ADR** : `ADR-001`

## Preuves
- Migration `20260730000005_strict_rls.sql` exécutée.
- Cycle UP -> DOWN -> UP réussi en staging.
- Vérification que `service_role` peut manager les transactions et `public` n'y a plus accès.

---
- **Evidence-ID** : `EV-005`
- **Generated-At** : `2026-07-30T11:24:11Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
- **Checksum (SHA256)** : *(à générer en phase 5)*
