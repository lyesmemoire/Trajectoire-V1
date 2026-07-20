# Sprint 5 - Migration Manager

## Overview
Migration Manager pour gérer les migrations de base de données de manière versionnée, rejouable et rollbackable. Jamais de SQL manuel en production.

## Structure des Migrations

### Convention de nommage
```
YYYYMMDDHHMMSS_description.sql
```

Exemple:
```
20240117120000_create_audit_logs_table.sql
20240117120001_add_index_audit_logs_user_id.sql
20240117120002_add_feature_flags_table.sql
```

### Structure d'une migration
```sql
-- Migration: 20240117120000_create_audit_logs_table.sql
-- Description: Create audit_logs table for tracking sensitive operations
-- Author: System
-- Version: 1.0.0

-- UP: Apply migration
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  result VARCHAR(20) NOT NULL CHECK (result IN ('success', 'failure', 'partial')),
  error_message TEXT,
  before_value JSONB,
  after_value JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- DOWN: Rollback migration
-- DROP TABLE IF EXISTS audit_logs CASCADE;
```

## Table de suivi des migrations

### SQL
```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(14) NOT NULL UNIQUE, -- YYYYMMDDHHMMSS
  name VARCHAR(255) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rollbackable BOOLEAN DEFAULT TRUE,
  checksum VARCHAR(64) NOT NULL -- SHA-256 hash of migration content
);

CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at DESC);
```

## Migration Manager Service

### Fonctionnalités
- Liste des migrations disponibles
- Liste des migrations appliquées
- Appliquer les migrations en attente
- Rollback d'une migration spécifique
- Vérification de l'intégrité (checksum)
- Validation des migrations avant application

### Commandes
```bash
# Lister les migrations disponibles
npm run migration:list

# Lister les migrations appliquées
npm run migration:status

# Appliquer les migrations en attente
npm run migration:up

# Appliquer une migration spécifique
npm run migration:up 20240117120000

# Rollback d'une migration
npm run migration:down 20240117120000

# Rollback de la dernière migration
npm run migration:down

# Créer une nouvelle migration
npm run migration:create create_audit_logs_table
```

## Bonnes Pratiques

### 1. Toujours inclure UP et DOWN
Chaque migration doit avoir:
- **UP:** Le SQL pour appliquer la migration
- **DOWN:** Le SQL pour rollback la migration (commenté)

### 2. Utiliser IF NOT EXISTS / IF EXISTS
Pour éviter les erreurs si la migration est rejouée:
```sql
CREATE TABLE IF NOT EXISTS ...
CREATE INDEX IF NOT EXISTS ...
DROP TABLE IF EXISTS ... CASCADE
```

### 3. Ne jamais modifier de données existantes
Les migrations ne doivent modifier que la structure:
- ✅ CREATE TABLE
- ✅ ALTER TABLE
- ✅ CREATE INDEX
- ✅ DROP TABLE
- ❌ UPDATE data
- ❌ DELETE data
- ❌ INSERT data

Pour les modifications de données, utiliser des scripts de migration de données séparés.

### 4. Tester les migrations
- Toujours tester en développement
- Tester le rollback
- Vérifier l'intégrité après rollback

### 5. Versionner les migrations
- Les migrations doivent être dans le repository
- Jamais de SQL manuel en production
- Toujours passer par le Migration Manager

### 6. Ordre des migrations
- Les migrations sont appliquées par ordre chronologique
- Ne jamais modifier une migration déjà appliquée
- Créer une nouvelle migration pour corriger

## Exemple de Migration Complète

### Migration: Ajouter feature_flags table
```sql
-- Migration: 20240117120003_add_feature_flags_table.sql
-- Description: Add feature_flags table for dynamic feature toggling
-- Author: System
-- Version: 1.0.0

-- UP: Apply migration
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  percentage INTEGER CHECK (percentage >= 0 AND percentage <= 100),
  target_users TEXT[], -- Array of user IDs
  target_environments TEXT[], -- Array of environments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Insert default feature flags
INSERT INTO feature_flags (key, enabled, description) VALUES
  ('NEW_REPORT', false, 'Enable new report generation system'),
  ('NEW_INTERVIEW', false, 'Enable new interview system'),
  ('STREAMING', false, 'Enable streaming responses')
ON CONFLICT (key) DO NOTHING;

-- DOWN: Rollback migration
-- DROP TABLE IF EXISTS feature_flags CASCADE;
```

## Intégration avec CI/CD

### Pipeline GitHub Actions
```yaml
- name: Run database migrations
  run: npm run migration:up
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Vérification avant déploiement
- Vérifier qu'il n'y a pas de migrations en attente
- Vérifier l'intégrité des migrations appliquées
- Tester les migrations en staging avant production

## Sécurité

### Permissions
- Les migrations doivent être exécutées avec des permissions administrateur
- Limiter l'accès au Migration Manager
- Logger toutes les opérations de migration

### Audit
- Enregistrer chaque migration dans audit_logs
- Inclure qui, quand, quelle migration, résultat

## Outils Recommandés

### Pour Node.js
- **node-pg-migrate**: Migrations PostgreSQL pour Node.js
- **db-migrate**: Migrations multi-base de données
- **knex.js**: Query builder avec migrations intégrées

### Pour Supabase
- **Supabase CLI**: `supabase db push`
- **Supabase Migrations**: Dossier `supabase/migrations`

## Conclusion

Le Migration Manager garantit:
- ✅ Migrations versionnées et traçables
- ✅ Rollback possible en cas d'erreur
- ✅ Pas de SQL manuel en production
- ✅ Intégration avec CI/CD
- ✅ Audit complet des changements
