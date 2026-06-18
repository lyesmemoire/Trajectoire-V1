# Architecture : Runtime Vocal Temps Réel (P4)

Ce document décrit l'architecture du runtime vocal de l'application `realtime-gateway`, son cycle de vie, ses invariants, et comment l'étendre en toute sécurité.

## 1. Séparation stricte Inbound / Outbound

Le runtime vocal opère avec un **flux strictement unidirectionnel** pour garantir l'idempotence, la testabilité et la robustesse face à la concurrence.

- **`InboundVoiceEvent`** (Entrant) : Ce sont les événements générés par le candidat (ex: `transcript`, `user_silence`). Ils sont "subis" par le système.
- **`OutboundVoiceSignal`** et **`VoiceInstruction`** (Sortant) : Ce sont les décisions et actions générées par le moteur (ex: `thinking`, `speak`, `speaking_stop`, `turn_done`). Ils pilotent le comportement du client WebSocket ou de l'orchestrateur.

> [!WARNING]
> Historiquement, le système mélangeait ces deux flux, ce qui permettait de réinjecter un transcript entrant comme une instruction sortante, créant des boucles infinies ou des corruptions d'état. **Il est strictement interdit de mélanger ou caster ces deux types.**

### Le point de contact : le `sink`

Pour injecter des événements depuis le réseau, le `SessionManager` expose publiquement une propriété **`.sink`** sur l'objet de session (`session.sink` de type `InboundEventSource`). C'est l'unique point d'entrée pour la couche réseau.

### Le payload sortant : `VoiceInstruction` vs `OutboundVoiceSignal`

- **En pratique** : Le gateway (`gateway.ts`) envoie actuellement de manière directe et sérialisée les **`VoiceInstruction`** internes au client WebSocket.
- **En théorie** : Le type `OutboundVoiceSignal` (et l'adaptateur `voice-sink-ws.ts` associé) représente une version passée ou future de l'architecture (prévue par exemple pour brancher un client VAD distinct ou une file d'attente). 
> **Note** : `voice-sink-ws.ts` est un adaptateur alternatif, non utilisé par le gateway actuel. Cette ambiguïté sera résolue lors d'une future passe de nettoyage.

### Schéma du flux

```text
Gateway (WebSocket)              Session                   Runtime
       │                             │                        │
       │─── JSON msg ───────────────▶│                        │
       │                             │   sink.dispatch()      │
       │                             ├───────────────────────▶│
       │                             │                        │── nextStep()
       │                             │                        │
       │                             │   binding.send()       │
       │                             │◀───────────────────────┤
       │◀── JSON instr ──────────────┤                        │
       │                             │                        │
```

## 2. Invariants Architecturaux (Certifiés par CI)

L'intégrité de ce flux est protégée statiquement par le script `scripts/cert-architecture.ts` :

1. **Seule la couche réseau (ex: `gateway.ts`) a le droit d'appeler `.dispatch()`**. Elle pousse les événements entrants dans le système.
2. **Seul le moteur `VoiceRuntime` a le droit d'écouter `.onEvent()`**. Il est le consommateur exclusif des événements entrants.
3. **Seule la couche I/O finale a le droit d'écouter `.onInstruction()`**. Elle traduit les instructions sortantes en appels WebSocket ou API.
4. **Seul le moteur a le droit d'appeler `.send()` sur le binding**. Il est le producteur exclusif des instructions sortantes.
5. **Aucun code legacy orienté objet (ex: l'ancien `InterviewEngine` dans `src/interview/`) ne doit être réintroduit.**

## 3. Cycle de Vie d'une Session et Gestion de la Mémoire

Chaque session vocale (`VoiceSession`) représente un entretien actif. Le cycle de vie complet est géré par le `SessionManager`.

### Création et Streaming (`createVoiceSession`)
- Le `SessionManager` crée l'état métier pur.
- Le `VoiceRuntime` est instancié et branché sur un `TransportBinding` isolé.
- Chaque instruction générée en temps réel (streaming) déclenche un "bump" du TTL (Time-To-Live) de la session.

> [!NOTE]
> **Le TTL ne se réinitialise qu'à l'émission d'une instruction sortante.** Un transcript entrant seul ne prolonge pas la session. Cela peut entraîner une coupure pendant un long monologue utilisateur si le runtime ne répond pas (bug LLM, timeout réseau). À monitorer via la métrique `avgSessionDurationMs`.

### Interruption (Barge-in)
Lorsqu'un nouveau `transcript` arrive *pendant* que le moteur réfléchit ou parle :
1. L'`AbortController` de la session courante (`currentTurn`) déclenche un `abort()`.
2. Le `VoiceRuntime` attrape l'`AbortError`.
3. Si le recruteur était en train de parler (`isSpeaking === true`), une instruction `speaking_stop` est émise pour forcer le client à couper le son.
4. Le nouveau transcript est immédiatement traité dans un nouveau tour.

### Destruction et Nettoyage (`dispose`)
Pour prévenir les fuites mémoires silencieuses, trois mécanismes de fermeture invoquent la méthode `.dispose()` du `VoiceRuntime` (qui annule toute opération asynchrone en cours) :
- **Déconnexion propre** : Le client ferme le WebSocket (`ws_close`).
- **TTL Expiré** : La session reste inactive pendant N minutes.
- **Sweeper Périodique** : Une tâche de fond scrute et purge les sessions mortes.

> [!IMPORTANT]
> Ne laissez jamais une opération asynchrone tourner sans un `AbortSignal`. Toute fonction longue (LLM, TTS, délai) doit pouvoir être annulée instantanément via `dispose()`.

## 4. Comment ajouter un nouvel événement ? (Checklist)

Si vous devez ajouter un nouveau comportement (ex: "le candidat raccroche", ou "le recruteur rit") :

1. **Type** : Déclarez le variant dans `InboundVoiceEvent` ou `VoiceInstruction` selon la direction.
   - *Note : `user_silence` par exemple, devrait être émis par le VAD (Voice Activity Detection) du frontend.*
2. **Réseau (si Inbound)** : Modifiez `gateway.ts` pour décoder le message JSON du WebSocket et appeler `session.sink.dispatch(...)`.
3. **Runtime** : 
   - Si Inbound, gérez le cas dans le `this.binding.onEvent` de `VoiceRuntime`.
   - Si Outbound, émettez-le via le callback `onEmit` de `runVoiceTurn`.
4. **Transport (si Outbound, usage futur)** : Mettez à jour `OutboundVoiceSignal` et l'adaptateur `voice-sink-ws.ts` si ce client est réactivé.
5. **Cert** : Assurez-vous que votre ajout ne viole pas les invariants de `cert-architecture.ts` (ex: n'appelez pas `send()` depuis un fichier d'entrée !).

## 5. Pattern de Pilotage : Bypass & Bypass-Through

Afin d'offrir une expérience utilisateur fluide, le moteur intercepte les **commandes de pilotage** (ex: "Peux-tu répéter ?", "Plus lentement") via un pattern de court-circuit structuré, avant qu'elles ne soient évaluées.

### L'Architecture du Flux
```text
[Bypass Layer]      ← (Nouveau) Détecte "repeat", "slower", "stop", etc.
       │                 Si commande trouvée : renvoie le state INTACT + texte généré.
       ↓                 Si PAS de commande : laisse passer (Bypass-Through).
[Evaluation Layer]  ← (Existant) Score la réponse avec le LLM ou par lexique.
       │
       ↓
[Selection Layer]   ← (Existant) Choisit la prochaine munition ou question.
```

### Invariants du Bypass
1. **État Immuable** : Une commande de pilotage ne doit jamais faire progresser les compteurs de la phase courante (`phaseCount` ou `turnCount`) ni polluer l'historique de l'entretien. Le candidat n'est pas "pénalisé" pour avoir demandé à répéter.
2. **Scores Neutres** : Si le moteur (ex: V3) exige un score de retour, le Bypass retourne une valeur neutre (le maintien du score précédent).
3. **Extensibilité** : Pour ajouter une nouvelle commande (ex: "Passe à la suite"), il suffit d'ajouter une clé dans `UserCommand` (`intent-detector.ts`) et de l'implémenter dans `pilot-commands.ts`. Le FSM reste agnostique.
