# FEATURE_B5: Real Supabase Runtime Persistence

## Overview

FEATURE_B5 activates real Supabase persistence for Runtime sessions. This replaces the stub implementation with a production-ready Supabase implementation while preserving the existing architecture.

## Architecture

The implementation follows Clean Architecture principles with strict separation of concerns:

```
Runtime (Domain)
  ↓ (events)
PersistenceEventHandler (Application)
  ↓ (commands)
SessionPersistenceIntegration (Application)
  ↓ (orchestration with retry)
SessionPersistenceService (Application)
  ↓ (interface)
SessionPersistence (Interface)
  ↓ (implementation)
SupabaseSessionRepository (Infrastructure)
  ↓ (data access)
Supabase (External)
```

**Key Principles**:
- Runtime remains completely independent of Supabase
- Communication is event-driven
- Persistence errors never crash Runtime
- All operations are non-blocking
- Single Responsibility Principle (SRP) strictly enforced
- Dependency Inversion Principle (DIP) respected

## Folder Structure

```
core/persistence/
├── builders/              # Snapshot construction
│   └── SessionSnapshotBuilder.ts
├── events/                # Event handling
│   └── PersistenceEventHandler.ts
├── integration/           # Integration coordination
│   └── SessionPersistenceIntegration.ts
├── interfaces/           # Persistence interfaces
│   └── SessionPersistence.ts
├── mappers/              # Data transformation
│   └── SessionSnapshotMapper.ts
├── policies/             # Cross-cutting policies
│   └── RetryPolicy.ts
├── repositories/         # Data access
│   └── SupabaseSessionRepository.ts
├── services/             # Application services
│   ├── SessionPersistenceService.ts
│   ├── SessionRestoreService.ts
│   ├── ChecksumService.ts
│   └── SessionIdGenerator.ts
├── errors/               # Domain errors
│   └── PersistenceError.ts
├── __tests__/            # Test suite
│   ├── SupabaseSessionRepository.test.ts
│   └── SessionPersistenceIntegration.test.ts
└── types.ts              # Shared types
```

## Environment Variables

The following environment variables are required (already configured in `lib/env.server.ts`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

These variables are validated at startup by the environment validation system in `lib/env.server.ts`.

## Database Migration

### Migration File

Location: `supabase/migrations/20260711_runtime_sessions_persistence.sql`

### Table Schema

The `runtime_sessions` table stores complete Runtime session snapshots:

```sql
CREATE TABLE runtime_sessions (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Session timing
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  last_saved_at TIMESTAMP WITH TIME ZONE,
  save_count INTEGER NOT NULL DEFAULT 0,
  
  -- Complete snapshot data (JSONB)
  runtime_state JSONB NOT NULL,
  provider_state JSONB NOT NULL,
  audio_state JSONB NOT NULL,
  pipeline_state JSONB NOT NULL,
  timeline JSONB NOT NULL,
  correlation_ids TEXT[] NOT NULL,
  diagnostics JSONB NOT NULL,
  metadata JSONB NOT NULL,
  errors JSONB NOT NULL,
  events JSONB NOT NULL,
  
  -- Versioning
  version TEXT NOT NULL DEFAULT '1.0',
  checksum TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);
```

### Applying the Migration

1. **Via Supabase Dashboard**:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy and paste the migration file content
   - Execute

2. **Via Supabase CLI** (if configured):
   ```bash
   supabase db push
   ```

### Database Features

- **Row Level Security (RLS)**: Enabled, users can only access their own sessions
- **Automatic Timestamps**: `updated_at` and `last_saved_at` updated automatically
- **Save Count Tracking**: Automatically incremented on each save
- **Status Management**: Automatic `closed_at` timestamp when status changes to 'closed'
- **Checksum Verification**: Data integrity verification on restore

## Component Responsibilities

### PersistenceEventHandler
- **Responsibility**: Transform Runtime events into persistence commands
- **SRP**: ✅ Single responsibility (event handling only)
- **Dependencies**: RuntimeEventEmitter, SessionPersistenceService, SessionSnapshotBuilder, SessionIdGenerator, DiagnosticCollector
- **Forbidden**: Business logic, repository access, validation, mapping

### SessionPersistenceIntegration
- **Responsibility**: Thin wrapper for PersistenceEventHandler
- **SRP**: ✅ Single responsibility (delegation only)
- **Dependencies**: PersistenceEventHandler, DiagnosticCollector
- **Forbidden**: Business logic, event handling, persistence logic

### SessionPersistenceService
- **Responsibility**: Orchestrate persistence operations with retry
- **SRP**: ✅ Single responsibility (persistence orchestration)
- **Dependencies**: SessionPersistence, DiagnosticCollector, RetryPolicy
- **Forbidden**: Business logic, repository access, retry algorithm (delegated to RetryPolicy)

### RetryPolicy
- **Responsibility**: Execute operations with retry logic and exponential backoff
- **SRP**: ✅ Single responsibility (retry execution)
- **Dependencies**: None
- **Configuration**: maxRetries, initialDelay, maxDelay, backoffMultiplier

### SupabaseSessionRepository
- **Responsibility**: Execute Supabase queries and translate errors
- **SRP**: ✅ Single responsibility (Supabase data persistence)
- **Dependencies**: SessionSnapshotMapper, ChecksumService, getServerDb
- **Forbidden**: Business logic, mapping (delegated to mapper), checksum calculation (delegated to service), retry logic

### SessionSnapshotMapper
- **Responsibility**: Transform between SessionSnapshot and DatabaseDTO
- **SRP**: ✅ Single responsibility (data transformation)
- **Dependencies**: None
- **Methods**: toDatabaseDTO, fromDatabaseDTO, fromSupabaseRecord
- **Forbidden**: Validation, checksum, repository logic, runtime logic

### ChecksumService
- **Responsibility**: Calculate and verify checksums for data integrity
- **SRP**: ✅ Single responsibility (checksum operations)
- **Dependencies**: None
- **Forbidden**: Business logic, validation, repository logic

### SessionIdGenerator
- **Responsibility**: Generate unique session IDs
- **SRP**: ✅ Single responsibility (ID generation)
- **Dependencies**: None
- **Forbidden**: Business logic, validation

### SessionSnapshotBuilder
- **Responsibility**: Build session snapshots from Runtime state
- **SRP**: ✅ Single responsibility (snapshot construction)
- **Dependencies**: RuntimeEngine, RuntimeManager, DiagnosticCollector
- **Forbidden**: Business logic, validation, persistence logic
- **Note**: ONLY component allowed to construct SessionSnapshot objects

## Implementation Details

### Files Modified (Architecture Hardening)

1. **`core/persistence/services/SessionPersistenceService.ts`**
   - Removed inline retry logic
   - Now uses RetryPolicy for retry operations
   - Constructor updated to inject RetryPolicy

2. **`core/persistence/integration/SessionPersistenceIntegration.ts`**
   - Simplified to thin wrapper for PersistenceEventHandler
   - Removed event handling logic (moved to PersistenceEventHandler)
   - Removed session state management (moved to PersistenceEventHandler)
   - Removed snapshot building (moved to PersistenceEventHandler)

3. **`core/persistence/mappers/SessionSnapshotMapper.ts`**
   - Added `fromSupabaseRecord` method to map raw Supabase records
   - Repository no longer manually constructs DTOs

4. **`core/persistence/repositories/SupabaseSessionRepository.ts`**
   - Removed checksum calculation (delegated to ChecksumService)
   - Removed manual DTO construction (delegated to mapper)
   - Now uses ChecksumService and SessionSnapshotMapper.fromSupabaseRecord

5. **`core/container.ts`**
   - Added RetryPolicy instantiation
   - Added PersistenceEventHandler instantiation
   - Updated SessionPersistenceService constructor to inject RetryPolicy
   - Updated SessionPersistenceIntegration constructor to inject PersistenceEventHandler
   - Updated imports for new components

6. **`core/persistence/SessionSnapshotBuilder.ts`**
   - Moved to `core/persistence/builders/` folder for better organization

### Files Created (Architecture Hardening)

1. **`core/persistence/policies/RetryPolicy.ts`**
   - Extracted retry logic from SessionPersistenceService
   - Configurable retry count, delays, exponential backoff
   - Timeout handling

2. **`core/persistence/events/PersistenceEventHandler.ts`**
   - Extracted event handling from SessionPersistenceIntegration
   - Transforms Runtime events into persistence commands
   - Executes persistence commands
   - Manages session state
   - Builds snapshots using SessionSnapshotBuilder

3. **`core/persistence/services/ChecksumService.ts`**
   - Extracted checksum calculation from repository
   - Calculate and verify checksums for data integrity

4. **`core/persistence/services/SessionIdGenerator.ts`**
   - Extracted ID generation from integration
   - Generates unique session IDs

5. **`core/persistence/builders/`**
   - New folder for snapshot construction
   - Contains SessionSnapshotBuilder.ts

## Operations

### Save Session

```typescript
const snapshot = sessionSnapshotBuilder.build();
const sessionId = await repository.saveSession(snapshot);
```

**What happens**:
1. SessionSnapshot mapped to DatabaseDTO
2. Unique ID generated
3. Data inserted into Supabase with status 'active'
4. Checksum calculated and stored
5. Session ID returned

### Update Session

```typescript
const snapshot = sessionSnapshotBuilder.build();
await repository.updateSession(snapshot);
```

**What happens**:
1. SessionSnapshot mapped to DatabaseDTO
2. Data updated in Supabase
3. `last_saved_at` and `save_count` updated automatically by triggers
4. Checksum recalculated and stored

### Close Session

```typescript
const snapshot = sessionSnapshotBuilder.build();
snapshot.endedAt = new Date();
await repository.closeSession(snapshot);
```

**What happens**:
1. Status changed to 'closed'
2. `ended_at` and `closed_at` timestamps set automatically
3. Final snapshot saved
4. Session marked as complete

### Restore Session

```typescript
const snapshot = await repository.restoreSession(sessionId);
if (snapshot) {
  // Session restored successfully
  // Runtime can continue from restored state
}
```

**What happens**:
1. Session fetched from Supabase
2. Only active sessions can be restored
3. Checksum verified for data integrity
4. DatabaseDTO mapped to SessionSnapshot
5. Returns null if session not found or closed

### Delete Session

```typescript
await repository.deleteSession(sessionId);
```

**What happens**:
1. Session deleted from Supabase
2. Cascade delete if user is deleted (RLS)

### Get Persistence Status

```typescript
const status = await repository.getPersistenceStatus(sessionId);
console.log(status.isPersisted, status.saveCount, status.syncStatus);
```

**What happens**:
1. Session metadata fetched
2. Returns persistence status including:
   - `isPersisted`: Whether session exists in database
   - `lastSavedAt`: Last save timestamp
   - `saveCount`: Number of saves
   - `syncStatus`: 'synced', 'pending', or 'error'
   - `lastError`: Last error message (if any)

## Error Handling

### Error Types

- **Connection**: Network or connection errors (recoverable)
- **Timeout**: Request timeout (recoverable)
- **NotFound**: Session not found (non-recoverable)
- **Conflict**: Duplicate session (recoverable)
- **Corruption**: Checksum mismatch (non-recoverable)
- **Database**: Generic database errors (recoverable)
- **Unknown**: Unexpected errors (recoverable)

### Non-Blocking Errors

Persistence errors are designed to never crash the Runtime:

1. Errors are caught and logged
2. Diagnostic events are emitted
3. Runtime continues execution
4. User is notified of persistence issues

### Error Recovery

- **Connection/Timeout**: Automatic retry by SessionPersistenceService
- **Conflict**: Session already exists, can be updated instead
- **Corruption**: Session cannot be restored, user notified
- **NotFound**: Session doesn't exist, can be created

## Testing

### Unit Tests

Location: `core/persistence/__tests__/SupabaseSessionRepository.test.ts`

Run tests:
```bash
npm test -- SupabaseSessionRepository.test.ts
```

Test coverage:
- ✅ Save session
- ✅ Update session
- ✅ Close session
- ✅ Restore session
- ✅ Delete session
- ✅ Get persistence status
- ✅ Checksum calculation
- ✅ Error handling (connection, timeout, not found, conflict, corruption)
- ✅ Edge cases (null data, closed sessions, checksum mismatch)

### Integration Tests

To run integration tests with real Supabase:

1. Set up test environment variables
2. Run migration on test database
3. Run integration test suite (to be created)

### E2E Tests

To run E2E tests:

1. Start development server
2. Run full Runtime session
3. Verify persistence in Supabase
4. Restart server
5. Verify session restoration

## Architecture Validation

### Runtime Independence

✅ **Verified**: Runtime has no direct dependency on Supabase

**Evidence**:
- Runtime components don't import Supabase
- Runtime communicates only through events
- Persistence is completely decoupled

### Clean Architecture

✅ **Verified**: Clean Architecture principles respected

**Evidence**:
- Presentation → Application → Domain → Infrastructure → External
- Dependencies point inward
- No circular dependencies
- Domain layer independent

### SOLID Principles

✅ **Verified**: SOLID principles followed

**Evidence**:
- **S**: Single Responsibility (each class has one responsibility)
- **O**: Open/Closed (open for extension, closed for modification)
- **L**: Liskov Substitution (implementations are substitutable)
- **I**: Interface Segregation (focused interfaces)
- **D**: Dependency Inversion (depend on abstractions)

### Event-Driven Architecture

✅ **Verified**: Event-driven communication

**Evidence**:
- Runtime emits events
- SessionPersistenceIntegration listens to events
- Loose coupling through events

## Quality Metrics

### TypeScript

- ✅ 0 TypeScript errors
- ✅ Strict mode enabled
- ✅ No `any` types (except in test mocks)
- ✅ Proper type definitions

### ESLint

- ✅ 0 ESLint errors
- ✅ Code formatted with Prettier
- ✅ No console.log in production code

### Test Coverage

- ✅ Unit tests for all repository operations
- ✅ Error handling tests
- ✅ Edge case tests
- ✅ Checksum verification tests

## Deployment Checklist

### Pre-Deployment

- [ ] Run migration on production database
- [ ] Verify environment variables are set
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Run ESLint: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Verify RLS policies are correct
- [ ] Verify indexes are created

### Post-Deployment

- [ ] Monitor persistence errors in diagnostics
- [ ] Verify session persistence works
- [ ] Verify session restoration works
- [ ] Check database performance
- [ ] Monitor save count growth
- [ ] Verify checksum verification works

## Troubleshooting

### Session Not Persisting

**Symptoms**: Sessions not appearing in database

**Possible Causes**:
1. Environment variables not set
2. Migration not applied
3. RLS policies blocking access
4. Network connectivity issues

**Solutions**:
1. Verify environment variables
2. Run migration
3. Check RLS policies in Supabase dashboard
4. Check network connectivity

### Session Not Restoring

**Symptoms**: Restore returns null

**Possible Causes**:
1. Session doesn't exist
2. Session is closed
3. Checksum mismatch
4. User doesn't have access (RLS)

**Solutions**:
1. Verify session exists in database
2. Check session status (must be 'active')
3. Verify checksum matches
4. Check RLS policies

### Checksum Mismatch

**Symptoms**: Corruption error on restore

**Possible Causes**:
1. Data corruption in database
2. Concurrent modifications
3. Schema version mismatch

**Solutions**:
1. Verify data integrity
2. Implement versioned snapshots (future)
3. Check schema version

## Future Enhancements

### Incremental Snapshots (FEATURE_B6)

Instead of saving complete snapshots on every update, implement incremental snapshots:

- `buildInitialSnapshot()`: Save complete snapshot
- `buildIncrementalSnapshot()`: Save only changes
- `buildFinalSnapshot()`: Save complete snapshot with final state
- Replay from incrementals: Reconstruct full state from incrementals

### Versioned Snapshots

Support schema evolution while maintaining backward compatibility:

- Version field in snapshot
- Version-specific mappers
- Migration logic for old versions

### Compression

Compress large JSONB fields to reduce storage costs:

- Compress timeline
- Compress events
- Compress diagnostics

## Related Documentation

- `PROJECT_BRIEF.md` - Complete project documentation
- `core/persistence/README.md` - Persistence layer documentation
- `lib/env.server.ts` - Environment variable validation
- `supabase/migrations/` - Database migrations

## Support

For issues or questions:
1. Check troubleshooting section
2. Review diagnostic logs
3. Check Supabase dashboard
4. Review test cases for examples
