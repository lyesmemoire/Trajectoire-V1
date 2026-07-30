# Registre des Hypothèses & Écarts
*Phase 2 — Due Diligence Assumptions*

## 1. Hypothèses Techniques (Assumptions)

| ID | Hypothèse (UNKNOWN) | Pourquoi c'est une hypothèse | Impact Métier | Comment la lever |
|---|---|---|---|---|
| **ASM-001** | La charge DB supporte 20 req/s. | Load testing explicite hors scope pour le moment. | Si faux, crash DB en pic. | Exécuter un stress test ciblé (k6) si requis. |
| **ASM-002** | L'adaptateur Redis WebSocket est fiable en cluster. | L'application tourne actuellement en single-node (Next.js serverless). | Désynchronisation WS en mode distribué. | Documenté comme dette technique / limitation d'architecture (Scalability Readiness). |

## 2. Registre des Écarts (Deviations)

*(Aucun écart enregistré à ce stade. Tout écart au protocole de certification sera listé ici avec son sign-off).*

---
- **Evidence-ID** : `EV-004`
- **Generated-At** : `2026-07-30T10:55:00Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
