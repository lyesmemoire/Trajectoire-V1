# P0.6 — ZERO TRUST ENFORCEMENT LAYER

## 1. PRINCIPE FONDAMENTAL
```text
Aucune entité P0 ne fait confiance à une autre sans preuve cryptographique explicite
```

---

## 2. ARCHITECTURE CIBLE
```text
                ┌──────────────────────┐
                │   Identity Plane     │
                │ (OIDC / JWT / mTLS)  │
                └─────────┬────────────┘
                          ▼
        ┌──────────────────────────────────┐
        │   Service Mesh (Istio / Linkerd) │
        │  - mTLS everywhere              │
        │  - policy enforcement            │
        │  - traffic identity injection    │
        └──────────┬───────────┬───────────┘
                   ▼           ▼
        ┌──────────────┐ ┌──────────────┐
        │ API Gateway  │ │  P0 Services │
        │ (identity ok)│ │ (tenant bound)│
        └──────┬───────┘ └──────┬───────┘
               ▼                 ▼
        Kafka / Redis / Postgres (signed events only)
```

---

## 3. PILIERS DU DESIGN

### 3.1 Identity Plane
- JWT signé + rotation obligatoire
- mTLS service-to-service
- Tenant identity = cryptographically bound claim

### 3.2 Policy Enforcement Layer (OPA)
Chaque action : `ALLOW / DENY / REDACT`
- `session.create` → allowed only if tenant.quota > 0
- `evaluation.read` → allowed only if same tenant OR admin role
- `report.access` → requires signed artifact hash match

### 3.3 Event Bus Signing (CRITIQUE)
Chaque event Kafka :
```ts
{
  payload,
  tenantId,
  eventId,
  timestamp,
  signature: HMAC_SHA256(payload + context)
}
```
Toute consommation invalide = rejet immédiat.

### 3.4 Replay Security Model
- Vérifié par hash chain
- Invalidé si divergence d'état détectée
- Audit trail cryptographique

### 3.5 Attack Surface Model
- Spoofing de tenant
- Event injection
- Replay poisoning
- Cross-tenant leakage
- Trace tampering

---

## 4. INVARIANT AJOUTÉ AU SYSTÈME
```text
No cross-tenant state mutation is physically possible without cryptographic proof
```

---

## 5. IMPACT STRUCTUREL

Avant :
```text
P0 = infrastructure fonctionnelle
```

Après :
```text
P0 = infrastructure + preuve de non-contamination inter-couches
```
