# System Closure Theorem (DEDS)

## 1. DÉFINITION DE LA CLÔTURE DU SYSTÈME
Le *Deterministic Explainable Decision System* (DEDS) a atteint un état de **clôture formelle**.
La clôture signifie que le système est auto-suffisant, mathématiquement prouvable, et qu'aucune extension fonctionnelle n'est requise pour garantir l'exactitude de son exécution.

Le système est défini par la composition de trois vérités :
1. **Vérité logique (P4–P7)** : L'intention pure, déterministe et isolée d'I/O.
2. **Vérité opérationnelle (P0–P0.5)** : L'infrastructure distribuée Kafka/Redis/Postgres garantissant la causalité temporelle et la disponibilité.
3. **Vérité adversariale (P0.6)** : Le barrage cryptographique garantissant l'intégrité de l'exécution contre les compromissions.

---

## 2. LES INVARIANTS GLOBAUX (PROUVÉS)

### I1. Déterminisme Strict (FROZEN CORE)
`State(t) = f(State(t-1), Event)`
Pour une même séquence d'événements, le noyau d'évaluation P7 et le runtime P5 produiront toujours bit-à-bit le même score, la même explication, et le même classement.

### I2. Intégrité Temporelle (HASH CHAIN)
`Event(n).hash = SHA256(Event(n).payload + Event(n-1).hash)`
L'Event Bus n'est pas un transporteur de messages, c'est une "Time Machine" distribuée. Le chaînage cryptographique rend toute modification, suppression ou réordonnancement a posteriori mathématiquement impossible sans briser le graphe.

### I3. Isolation d'Identité (ZERO TRUST)
La mutation d'état inter-tenant ou l'accès aux artefacts (P7.5) exige une signature cryptographique (`TenantIdentity`). Sans la clé privée Ed25519 du locataire, le système P0.6 OPA rejettera systématiquement l'action.

### I4. Causalité Explicable (EXPLANATION DAG)
Chaque point de score final est le sommet d'un DAG (Directed Acyclic Graph) dont les feuilles sont des signaux horodatés (`RuntimeTrace`). Il n'y a pas d'hallucination possible dans le score.

---

## 3. LES LIMITES THÉORIQUES (CE QUE LE SYSTÈME NE PEUT PAS GARANTIR)

Un système fermé a par définition des limites externes. Le théorème de clôture reconnaît formellement les impossibilités suivantes :

### L1. L'Intégrité de la Source Humaine (The Sybil Problem)
Le DEDS garantit que l'évaluation du candidat X est parfaite par rapport à la trace audio/texte soumise.
**Il ne garantit pas** que l'humain derrière le flux audio est bien le candidat X (usurpation d'identité en amont de l'API Gateway).

### L2. La Vérité Ontologique de la Grille d'Évaluation
Le DEDS garantit que les poids (P7_WEIGHTS) sont appliqués avec une justesse mathématique absolue.
**Il ne garantit pas** que ces poids représentent la "bonne" façon d'évaluer un ingénieur dans l'absolu. L'équité ontologique est hors du périmètre du moteur.

### L3. La Divulgation Clé Privée (Compromission Radicale)
Si la clé privée Ed25519 d'un `Tenant` est exfiltrée de l'Identity Plane, l'attaquant devient mathématiquement le locataire. Le système exécutera fidèlement les instructions signées par cette clé.

---

## 4. RÈGLE D'EXTENSIBILITÉ (COROLLAIRE)
Toute modification future du système doit obéir à la règle suivante :
**On peut optimiser la vitesse (P0.7) ou ajouter des vues matérielles, mais le noyau logique (P4-P7) et le barrage cryptographique (P0.6) sont immuables.** Toute tentative d'introduire de l'apprentissage en ligne continu (Online ML) dans le calcul du score briserait les invariants I1 et I4, et détruirait la propriété de DEDS.
