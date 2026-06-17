# C4 ARCHITECTURE (Level 1 to 3)

## 📌 Level 1 — System Context

```
+----------------------+
|   Human User         |
| (Recruiter / Admin)  |
+----------+-----------+
           |
           v
+------------------------------+
|  Interview Evaluation System |
+------------------------------+
           |
           v
+------------------------------+
| External Systems             |
|                              |
| - Voice Provider (TTS/STT)   |
| - WebSocket Gateway          |
| - Storage (optional infra)   |
+------------------------------+
```

---

## 📌 Level 2 — Container Diagram

```
+--------------------------------------------------------------+
|                    SYSTEM                                     |
+--------------------------------------------------------------+

   [Apps Layer]
   +------------------------------+
   | realtime-gateway (WS)        |
   | - session-registry           |
   | - runtime-bootstrap          |
   | - trace collector            |
   +--------------+---------------+
                  |
                  v

   [Core Runtime]
   +------------------------------+
   | P6 Runtime Orchestrator      |
   | P6 Lifecycle Engine          |
   | P6 Voice Binding             |
   | P6 Transport Adapter         |
   +--------------+---------------+
                  |
                  v

   [Execution Core]
   +------------------------------+
   | P5 Execution Engine          |
   | reduceMind()                 |
   | Journal / Timeline           |
   +--------------+---------------+
                  |
                  v

   [Governance Layer]
   +------------------------------+
   | P4 Governor                  |
   | Policy Engine                |
   +--------------+---------------+
                  |
                  v

   [Evaluation Layer]
   +------------------------------+
   | P7 Scoring Engine            |
   | P7 Ranking Engine            |
   | P7 Explainability DAG        |
   | P7 Report Generator          |
   +------------------------------+

   [Observability]
   +------------------------------+
   | RuntimeTrace Collector       |
   | Session Trace Builder        |
   +------------------------------+
```

---

## 📌 Level 3 — Component Diagram (Core P6 focus)

```
P6 Runtime Orchestrator
|
+-- SessionRuntimeAdapter
|     +-- ExecutionFacade (P5 bridge)
|     +-- Governor Adapter (P4 interface)
|
+-- Lifecycle Engine
|     +-- state transitions (ACTIVE/PAUSED/FINISHED/ARCHIVED)
|
+-- Voice Binding
|     +-- buildVoicePlan()
|     +-- clamp + validate
|
+-- Transport Layer
      +-- buildTransportCommands()
      +-- batch / replay
```

---

## 📌 Data Flow

```
User Message
   ↓
Gateway (WS)
   ↓
P6 Orchestrator
   ↓
P5 Execution (deterministic state)
   ↓
Journal + Timeline
   ↓
INFRA Trace Collector
   ↓
RuntimeTrace
   ↓
P7 Scoring Engine
   ↓
P7 Explainability DAG
   ↓
P7 Report Generator
   ↓
Human Decision Output
```
