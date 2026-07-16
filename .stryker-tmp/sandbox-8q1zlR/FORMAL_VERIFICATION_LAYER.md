# 📐 FORMAL VERIFICATION LAYER (TLA+ & INVARIANTS)

Ce document décrit la fondation mathématique de l'architecture. Plutôt que de s'en remettre uniquement à des tests empiriques ou au monitoring, le système est modélisé et prouvé formellement pour garantir l'inviolabilité de ses règles fondamentales.

---

## 1. LE PARADIGME DE LA PREUVE FORMELLE

Le système passe d'un état où les bugs sont "détectés puis corrigés" à un état où les états critiques invalides sont "prouvés impossibles". 
L'espace d'état global est modélisé mathématiquement (ex: TLA+) :
`STATE = (Users, Events, Ledger, Credits, AI_Cost, Stripe_State)`

---

## 2. INVARIANTS ABSOLUS

La vérification formelle prouve que, quel que soit l'état du système (concurrence extrême, crash réseau, retry Stripe infini), les invariants suivants tiennent toujours :

### Core Invariants
- **I1** : Le Ledger est strictement *append-only*.
- **I2** : Il n'existe aucun solde de crédits négatif.
- **I3** : La réconciliation Stripe est toujours consistante.
- **I4** : `Replay(state(events)) == original state` (Le déterminisme est absolu).
- **I5** : Aucune fuite de données inter-tenant n'est possible dans l'Event Store.

### Economic & System Invariants
- **E1** : Le coût LLM unitaire n'excède jamais un seuil critique sans déclencher de Circuit Breaker.
- **S1/S2** : Aucun *deadlock* dans le pipeline événementiel, aucune duplication dans le Ledger.

---

## 3. CE QUE LA VÉRIFICATION PROUVE ET NE PROUVE PAS

La modélisation TLA+ ne remplace pas le code runtime. 
- **Elle prouve** : Qu'aucune transition (AddEvent, RunAI, UpdateLedger) ne peut placer le système dans un état interdit. L'espace d'état valide est scellé.
- **Elle ne prouve pas** : Que l'API externe (Stripe/Mistral) répondra vite, ni que le code écrit ne contient pas de bugs triviaux hors du modèle conceptuel.

---

## 4. LA BOUCLE ARCHITECTURALE FINALE

L'architecture conceptuelle d'Intervo.io repose désormais sur 4 piliers absolus :
1. **Simulation** (Ce qui *pourrait* arriver).
2. **Gouvernance** (Ce qui *devrait* arriver).
3. **Exécution** (Ce qui *arrive* réellement).
4. **Vérification** (Ce qui *ne peut pas* arriver).

Le système n'est plus une simple application Cloud. C'est une économie logicielle mathématiquement prouvée, simulée et gouvernée.
