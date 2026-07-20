# Sprint 5 - Audit Log Migration

## Table: audit_logs

### Description
Table pour tracer toutes les opérations sensibles avec qui, quand, IP, action, résultat, avant, après.

### SQL Migration
```sql
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for common queries
  INDEX idx_audit_logs_user_id (user_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_created_at (created_at DESC),
  INDEX idx_audit_logs_result (result),
  
  -- Composite index for user activity queries
  INDEX idx_audit_logs_user_created (user_id, created_at DESC)
);

-- Comments
COMMENT ON TABLE audit_logs IS 'Audit log for sensitive operations';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action';
COMMENT ON COLUMN audit_logs.action IS 'Action performed (e.g., delete, update, create)';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity (e.g., session, message, report, user)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the requester';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent string';
COMMENT ON COLUMN audit_logs.result IS 'Result of the action (success, failure, partial)';
COMMENT ON COLUMN audit_logs.error_message IS 'Error message if action failed';
COMMENT ON COLUMN audit_logs.before_value IS 'State before action (JSON)';
COMMENT ON COLUMN audit_logs.after_value IS 'State after action (JSON)';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional metadata (JSON)';
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp of the action';
```

## Actions to Audit

### Critical Actions (Always Audit)
- User deletion
- Account deletion
- Profile update
- Quota modification
- Admin actions
- Payment processing
- Session deletion
- Report deletion

### Important Actions (Audit if Possible)
- Message creation
- Session creation
- Report generation
- Login/logout
- Password change
- Email change

### Optional Actions (Audit in Production)
- Session view
- Report view
- Message view

## Audit Service Integration

### Example Usage
```typescript
import { auditService } from '@/lib/audit/AuditService';

// Audit a deletion
await auditService.log({
  userId: user.id,
  action: 'delete',
  entityType: 'session',
  entityId: sessionId,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  result: 'success',
  beforeValue: sessionData,
  afterValue: null,
});

// Audit with error
await auditService.log({
  userId: user.id,
  action: 'update',
  entityType: 'profile',
  entityId: profileId,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  result: 'failure',
  errorMessage: error.message,
  beforeValue: oldProfile,
  afterValue: newProfile,
});
```

## Cleanup Policy

### Retention Period
- Production: 90 days
- Staging: 30 days
- Development: 7 days

### Cleanup Job
```sql
-- Delete old audit logs
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Security Considerations

- Audit logs should be write-only for application
- Only admin users should be able to read audit logs
- IP addresses should be stored in INET type for validation
- Sensitive data in before/after should be masked if necessary
