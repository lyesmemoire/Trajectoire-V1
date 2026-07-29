# Audit 360° - Phase I : Audit Sécurité

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## JWT

### Implementation

**Gateway**
- `gateway/services/auth.ts` : CryptoJwtVerifier
- Algorithme : HS256
- Vérification : Signature, expiration
- Payload : sub, tenantDid, roles

**Web**
- Supabase Auth (JWT géré par Supabase)
- Vérification via Supabase client

**Packages**
- `packages/hiios-api/src/middleware/auth.ts` : JWT verification simplifiée

### Payload Structure

**Gateway**
```typescript
{
  sub: string;           // User ID
  tenantDid: string;     // Tenant DID
  iat: number;           // Issued at
  exp: number;           // Expiration
  roles?: string[];      // Roles (Phase 2-H.3)
}
```

**Web**
- Géré par Supabase

### Security Measures

**Gateway**
- Signature verification (HMAC-SHA256)
- Expiration check
- Anti-tampering (signature mismatch)
- Privilege escalation prevention

**Web**
- Supabase Auth (managed)

**Packages**
- Signature verification
- Role-based access control

### Vulnerabilities

**Gateway**
- ✅ Signature verification implémentée
- ✅ Expiration check implémentée
- ✅ Anti-tampering implémenté
- ✅ Privilege escalation prevention implémenté

**Web**
- ✅ Supabase Auth (managed)

**Packages**
- ⚠️ JWT verification simplifiée (pas de production-ready)

### Recommendations

1. **Gateway** : Utiliser jose ou jsonwebtoken en production
2. **Web** : Vérifier la configuration Supabase Auth
3. **Packages** : Implémenter JWT verification production-ready

---

## Permissions

### RBAC Implementation

**Gateway**
- `gateway/services/rbac.ts` : AuthorizationService
- Roles : tenant_admin, interviewer, candidate, auditor
- Permissions : session:create, session:start, session:event:write, report:read, report:delete, tenant:manage

**Web**
- Supabase RLS (Row Level Security)
- Policies par table

**Packages**
- `packages/hiios-api/src/middleware/rbac.ts` : RBAC middleware
- Roles : admin, recruiter, candidate
- Permissions : interviews:create, interviews:read, interviews:update, interviews:decide, interviews:audit, interviews:delete

### Permission Matrix

**Gateway**
| Role | session:create | session:start | session:event:write | report:read | report:delete | tenant:manage |
|------|----------------|---------------|---------------------|-------------|---------------|--------------|
| tenant_admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| interviewer | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| candidate | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| auditor | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

**Web**
- RLS : Users can access own data
- Service role : Full access

**Packages**
| Role | interviews:create | interviews:read | interviews:update | interviews:decide | interviews:audit | interviews:delete |
|------|-------------------|------------------|-------------------|-------------------|------------------|-------------------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| recruiter | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| candidate | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Security Measures

**Gateway**
- Tenant isolation
- Role-based permissions
- Audit logging

**Web**
- RLS sur toutes les tables
- Service role pour backend

**Packages**
- RBAC middleware
- Permission checks

### Vulnerabilities

**Gateway**
- ✅ Tenant isolation implémenté
- ✅ RBAC implémenté
- ✅ Audit logging implémenté

**Web**
- ✅ RLS activé sur toutes les tables
- ✅ Service role configuré

**Packages**
- ✅ RBAC middleware implémenté
- ⚠️ Pas d'audit logging

### Recommendations

1. **Gateway** : Ajouter permission caching
2. **Web** : Vérifier les policies RLS
3. **Packages** : Ajouter audit logging

---

## Replay

### Security Measures

**Tamper Detection**
- Signature verification sur les événements
- Hash chain pour l'intégrité
- Timestamp verification

**Replay Protection**
- Event ID unique
- Idempotency key
- Versioning

### Vulnerabilities

- ⚠️ Pas de replay protection explicite
- ⚠️ Pas de checksum sur les replays
- ⚠️ Pas de signature sur les replays

### Recommendations

1. **Ajouter signature** : Signer les replays
2. **Ajouter checksum** : Vérifier l'intégrité des replays
3. **Ajouter TTL** : Expirer les replays

---

## Storage

### Supabase Storage

**Security Measures**
- RLS sur buckets
- Private buckets (non public)
- Owner-based access

**Buckets**
- `resumes` : Private, RLS sur owner

### Vulnerabilities

- ✅ RLS activé
- ✅ Buckets privés
- ⚠️ Pas d'encryption côté client
- ⚠️ Pas de versioning

### Recommendations

1. **Ajouter encryption** : Encrypter les fichiers avant upload
2. **Ajouter versioning** : Versionner les fichiers
3. **Ajouter scanning** : Scanner les fichiers uploadés

---

## Secrets

### Environment Variables

**Required**
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `MISTRAL_API_KEY`
- `STRIPE_SECRET_KEY`

**Optional**
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_EARLY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_EXPERT_PRICE_ID`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `DEEPGRAM_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REDIS_URL`
- `CRON_SECRET`
- `POSTHOG_API_KEY`
- `IPQS_KEY`

### Security Measures

- ✅ Variables d'environnement
- ✅ Validation Zod
- ⚠️ Pas de secret manager (Vault, AWS Secrets Manager)
- ⚠️ Pas de rotation automatique

### Vulnerabilities

- ⚠️ Secrets en clair dans .env
- ⚠️ Pas de secret manager
- ⚠️ Pas de rotation automatique

### Recommendations

1. **Utiliser Vault** : Utiliser HashiCorp Vault ou AWS Secrets Manager
2. **Rotation automatique** : Implémenter la rotation automatique des secrets
3. **Encryption** : Encrypter les secrets au repos

---

## OpenAI Keys

### Usage

**Gateway**
- `apps/realtime-gateway/src/llm-strict.ts`
- `apps/realtime-gateway/src/voice-interview/core/llm-strict.ts`

**Web**
- `apps/web/src/lib/openai.ts`
- `apps/web/src/lib/ai/client.ts`

### Security Measures

- ✅ Environment variable
- ✅ Validation Zod
- ⚠️ Pas de rate limiting côté client
- ⚠️ Pas de monitoring des coûts

### Vulnerabilities

- ⚠️ Pas de rate limiting explicite
- ⚠️ Pas de monitoring des coûts
- ⚠️ Pas de quota par utilisateur

### Recommendations

1. **Rate limiting** : Implémenter rate limiting côté client
2. **Monitoring coûts** : Monitorer les coûts OpenAI
3. **Quota utilisateur** : Implémenter quota par utilisateur

---

## Rate Limit

### Implementation

**Web**
- `lib/security/rate-limit.ts` : Upstash Redis
- Limiters :
  - cvRewriteLimiter : 5/min
  - interviewStartLimiter : 10/min
  - premiumContinueLimiter : 30/min
  - executiveSimulateLimiter : 3/min

**Gateway**
- `p0/api-gateway/middleware/rate-limit.middleware.ts` : Mock (non implémenté)

**Packages**
- `packages/hiios-api/src/middleware/rateLimiter.ts` : In-memory (mock)

### Security Measures

**Web**
- ✅ Upstash Redis
- ✅ Sliding window
- ⚠️ Pas de rate limiting par IP
- ⚠️ Pas de rate limiting par tenant

**Gateway**
- ❌ Non implémenté

**Packages**
- ❌ In-memory (non production-ready)

### Vulnerabilities

**Web**
- ⚠️ Pas de rate limiting par IP
- ⚠️ Pas de rate limiting par tenant
- ⚠️ Pas de rate limiting par endpoint

**Gateway**
- ❌ Non implémenté

**Packages**
- ❌ In-memory (non production-ready)

### Recommendations

1. **Web** : Ajouter rate limiting par IP
2. **Web** : Ajouter rate limiting par tenant
3. **Gateway** : Implémenter rate limiting production-ready
4. **Packages** : Implémenter rate limiting avec Redis

---

## Prompt Injection

### Security Measures

**Web**
- `apps/web/src/lib/security/prompt-sanitizer.ts` : Sanitization des prompts
- `apps/web/src/lib/security/request-scrubber.ts` : Scrubbing des requêtes

**Gateway**
- ⚠️ Pas de sanitization explicite

### Vulnerabilities

**Web**
- ✅ Prompt sanitizer implémenté
- ✅ Request scrubber implémenté
- ⚠️ Pas de validation Zod sur les prompts

**Gateway**
- ❌ Pas de sanitization

### Recommendations

1. **Web** : Ajouter validation Zod sur les prompts
2. **Gateway** : Implémenter prompt sanitizer
3. **Global** : Ajouter rate limiting sur les prompts

---

## PII

### PII Data

**Données stockées**
- Email (profiles)
- Full name (profiles)
- CV content (cvs)
- Transcript (premium_interview_sessions)

### Security Measures

**Supabase**
- ✅ RLS sur toutes les tables
- ✅ Encryption au repos (Supabase)
- ⚠️ Pas d'encryption côté client
- ⚠️ Pas de masking

**Logs**
- ⚠️ Pas de PII scrubbing dans les logs
- ⚠️ Sentry peut contenir des PII

### Vulnerabilities

- ⚠️ Pas d'encryption côté client
- ⚠️ Pas de masking des PII
- ⚠️ Pas de PII scrubbing dans les logs

### Recommendations

1. **Encryption** : Encrypter les PII côté client
2. **Masking** : Masquer les PII dans les logs
3. **Scrubbing** : Scrubber les PII dans Sentry

---

## RGPD

### Compliance

**Data Retention**
- ⚠️ Pas de politique de rétention définie
- ⚠️ Pas de suppression automatique

**Data Deletion**
- ✅ CASCADE delete sur profiles
- ⚠️ Pas de right to be forgotten explicite

**Data Export**
- ⚠️ Pas de data export endpoint

**Consent**
- ⚠️ Pas de consent management

### Vulnerabilities

- ❌ Pas de politique de rétention
- ❌ Pas de right to be forgotten explicite
- ❌ Pas de data export endpoint
- ❌ Pas de consent management

### Recommendations

1. **Rétention** : Définir une politique de rétention
2. **Right to be forgotten** : Implémenter right to be forgotten
3. **Data export** : Implémenter data export endpoint
4. **Consent** : Implémenter consent management

---

## Conclusion

### Points forts

1. **JWT** : Signature verification, expiration check, anti-tampering
2. **Permissions** : RBAC implémenté, RLS activé
3. **Rate Limiting** : Upstash Redis pour le rate limiting
4. **Prompt Injection** : Prompt sanitizer implémenté
5. **Supabase** : RLS activé sur toutes les tables

### Points faibles

1. **Secrets** : Pas de secret manager, secrets en clair
2. **Replay** : Pas de signature, pas de checksum
3. **Storage** : Pas d'encryption côté client
4. **OpenAI Keys** : Pas de rate limiting explicite
5. **PII** : Pas de masking, pas de scrubbing
6. **RGPD** : Pas de politique de rétention, pas de right to be forgotten

### Recommandations

1. **Secret Manager** : Utiliser HashiCorp Vault ou AWS Secrets Manager
2. **Replay Security** : Signer et checksummer les replays
3. **Storage Encryption** : Encrypter les fichiers avant upload
4. **OpenAI Rate Limit** : Implémenter rate limiting côté client
5. **PII Protection** : Masquer et scrubber les PII
6. **RGPD Compliance** : Implémenter rétention, right to be forgotten, data export, consent

**Prochaine phase** : Audit Technique
