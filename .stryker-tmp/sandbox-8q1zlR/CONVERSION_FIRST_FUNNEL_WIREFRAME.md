# 🚀 NEW LANDING FUNNEL — CONVERSION-FIRST ARCHITECTURE (INTERVO.IO)

## 🎯 PRINCIPLE FONDAMENTAL
On inverse complètement la logique :
`Value → Emotion → Commitment → Signup → Depth`

### CORE SHIFT
- ❌ **Ancien modèle :** Demander effort → Expliquer produit → Demander confiance → Donner valeur
- ✅ **Nouveau modèle :** Montrer valeur immédiate → Créer “moment aha” → Amplifier désir → Capturer identité → Demander compte

---

## 🟢 0. ARCHITECTURE GLOBALE FRONT (Next.js)
```text
app/
 ├─ (marketing)/
 │   └─ page.tsx        ← funnel entry (simulation gate)
 │
 ├─ simulation/
 │   ├─ page.tsx        ← question engine
 │   ├─ result/page.tsx ← instant AI result
 │   └─ replay/page.tsx ← teaser locked replay
 │
 ├─ auth/
 │   └─ signup/page.tsx ← Save moment
 │
 └─ dashboard/
     └─ page.tsx
```

---

## 🟢 SCREEN 1 — LANDING (SIMULATION GATE)
**📁 `app/(marketing)/page.tsx`**

L’utilisateur ne “lit” pas, il “subit une simulation”. Pas de CTA classique visible en premier écran.
```text
-------------------------------------------------
| LOGO                                          |
|-----------------------------------------------|
|                                               |
|   “Simulate your interview pressure”          |
|                                               |
|        [ START SIMULATION ]                   |
|                                               |
|   subtle animated background (noise/glow)     |
-------------------------------------------------
```
⚡ LOGIC: `router.push("/simulation")`

---

## 🟡 SCREEN 2 — INTERVIEW QUESTION ENGINE
**📁 `app/simulation/page.tsx`**
```text
-------------------------------------------------
| Question 1 / 3                                |
|-----------------------------------------------|
| "Tell me about a time you failed."            |
|                                               |
| [ text input / voice input ]                  |
|                                               |
|        (timer: 10s subtle pulse)              |
-------------------------------------------------
```
⚡ ACTION: `POST /api/simulation/answer`

---

## 🔵 SCREEN 3 — AI PROCESSING STATE
**📁 `components/simulation/ProcessingState.tsx`**
```text
-------------------------------------------------
| Analyzing behavioral signals...               |
|                                               |
|   [/////// loading animation //////]          |
|                                               |
| “Mapping cognitive pressure response...”      |
-------------------------------------------------
```

---

## 🔴 SCREEN 4 — RESULT (CORE VALUE SCREEN)
**📁 `app/simulation/result/page.tsx`**

L'identité est activée. La curiosité est déclenchée.
```text
-------------------------------------------------
| YOUR PRESSURE PROFILE                         |
|-----------------------------------------------|
| Confidence:   ████████░░ 78                   |
| Clarity:      ██████░░░░ 61                   |
| Recovery:     █████████░ 89                   |
|-----------------------------------------------|
| “You perform best under structured chaos.”    |
| “You recover faster than 87% of candidates.”  |
-------------------------------------------------
```

---

## 🟠 SCREEN 5 — EMOTIONAL EXPANSION
**📁 `components/simulation/InsightExpansion.tsx`**

On montre ce que l'utilisateur est, pas l'outil.
```text
-------------------------------------------------
| WHY THIS RESULT                               |
|-----------------------------------------------|
| • You hesitate under ambiguity                |
| • You recover extremely fast                  |
| • You adapt under pressure                    |
|-----------------------------------------------|
| [ WATCH YOUR REPLAY (preview locked) ]        |
-------------------------------------------------
```

---

## 🟣 SCREEN 6 — REPLAY TEASER (LOCKED)
**📁 `app/simulation/replay/page.tsx`**
```text
-------------------------------------------------
| YOUR INTERVIEW MOMENTS                        |
|-----------------------------------------------|
|                                               |
| [ blurred timeline visualization ]            |
|                                               |
| “Unlock full behavioral breakdown”            |
|                                               |
|           [ CONTINUE ] (signup gate)          |
-------------------------------------------------
```
⚡ LOCK LOGIC: `if (!user) router.push("/auth/signup")`

---

## 🟢 SCREEN 7 — SIGNUP (SAVE MOMENT)
**📁 `app/auth/signup/page.tsx`**

Signup = memory preservation. Jamais une barrière.
```text
-------------------------------------------------
| SAVE YOUR RESULT                              |
|-----------------------------------------------|
| “Create account to preserve your evolution”   |
|                                               |
| [ Continue with Google ]                      |
| [ Continue with Email ]                       |
-------------------------------------------------
```

---

## ⚡ CRITICAL UX PRINCIPLES
1. **ZERO EMPTY STATES** → tout écran produit de la valeur.
2. **PROGRESSIVE DISCLOSURE** → info révélée par couches émotionnelles.
3. **IDENTITY FIRST DESIGN** → utilisateur se reconnaît avant de s’inscrire.
4. **SIGNUP AS CONSEQUENCE** → jamais une barrière, toujours une sauvegarde.
