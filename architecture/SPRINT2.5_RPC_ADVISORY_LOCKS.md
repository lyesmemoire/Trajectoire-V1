# Sprint 2.5 - PostgreSQL RPC for Advisory Locks

## Overview
Ce document contient les fonctions RPC PostgreSQL pour implémenter le Distributed Lock.

## Fonction: try_advisory_lock

### Description
Essaie d'acquérir un advisory lock. Retourne true si le lock est acquis, false sinon.

### SQL
```sql
CREATE OR REPLACE FUNCTION try_advisory_lock(p_lock_key BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Try to acquire advisory lock (non-blocking)
  -- pg_try_advisory_lock returns true if lock acquired, false otherwise
  RETURN pg_try_advisory_lock(p_lock_key);
END;
$$;
```

---

## Fonction: release_advisory_lock

### Description
Libère un advisory lock.

### SQL
```sql
CREATE OR REPLACE FUNCTION release_advisory_lock(p_lock_key BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Release advisory lock
  PERFORM pg_advisory_unlock(p_lock_key);
END;
$$;
```

---

## Notes

- Les advisory locks PostgreSQL sont automatiquement libérés à la fin de la transaction
- Ils sont persistants entre les connexions (contrairement aux locks de transaction)
- Ils sont utiles pour implémenter des verrous distribués au niveau application
- La clé du lock est un BIGINT (hash de la clé string)

## Utilisation

### Acquérir un lock
```typescript
const { data } = await supabase.rpc("try_advisory_lock", {
  p_lock_key: 12345,
});
```

### Libérer un lock
```typescript
await supabase.rpc("release_advisory_lock", {
  p_lock_key: 12345,
});
```

## Alternative: pg_advisory_xact_lock

Si vous voulez des locks automatiquement libérés à la fin de la transaction:

```sql
CREATE OR REPLACE FUNCTION try_advisory_xact_lock(p_lock_key BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN pg_try_advisory_xact_lock(p_lock_key);
END;
$$;
```

Les xact_locks sont automatiquement libérés à la fin de la transaction, ce qui peut être plus simple pour certaines opérations.
