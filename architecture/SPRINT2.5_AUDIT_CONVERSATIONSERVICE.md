# Audit Race Conditions - ConversationService

## Méthode: sendMessage (lignes 41-175)

### Analyse:
1. Read session (sessionRepository.findById) →
2. Check rate limit (read) → OK (pas de modify)
3. Check quota (read) → OK (pas de modify)
4. Count messages (messageRepository.count) → **RACE CONDITION POTENTIELLE**
5. Create user message (write) →
6. Read messages (messageRepository.getBySessionId) →
7. Generate AI response (external service) →
8. Create AI message (write) →
9. Increment quota (write) → OK (RPC atomique)

### Race Condition: **OUI** (sur message count)

### Scénario:
1. Requête A compte messages (count=10)
2. Requête B compte messages (count=10)
3. Requête A crée user message (count=11)
4. Requête B crée user message (count=12)
5. **Problème:** Les deux requêtes passent le check count >= 50, mais le vrai count peut dépasser 50

### Impact:
- Faible (limite de 50 messages est une protection, pas une contrainte stricte)
- Le check count >= 50 peut être dépassé de quelques messages en cas de concurrence

### Mitigation Recommandée:
**Option 1: Utiliser un verrou distribué**
- Utiliser pg_advisory_lock() sur sessionId
- Garantir qu'un seul message est créé à la fois

**Option 2: UPSERT avec contrainte CHECK**
- Ajouter contrainte CHECK dans PostgreSQL: CHECK(message_count <= 50)
- Utiliser une table de compteur atomique

**Option 3: Accepter le risque**
- La limite de 50 messages est une protection, pas une contrainte stricte
- Le dépassement de quelques messages est acceptable

### Recommandation: **Option 3** (accepter le risque pour l'instant)
- Le risque est faible
- La limite est une protection, pas une contrainte stricte
- Peut être amélioré plus tard si nécessaire

---

### Race Condition: **OUI** (sur ordre des messages)

### Scénario:
1. Requête A crée user message
2. Requête B crée user message (avant que A crée AI response)
3. Requête A crée AI response
4. Requête B crée AI response
5. **Problème:** L'ordre des messages peut être incorrect

### Impact:
- Moyen (les messages peuvent être dans le mauvais ordre)
- Peut affecter la qualité de l'interview

### Mitigation: **DÉJÀ PARTIELLEMENT MITIGÉ**
- Les messages sont créés avec createdAt timestamp
- L'affichage peut trier par createdAt
- Mais l'historique envoyé à l'AI peut être incorrect

### Mitigation Recommandée:
**Option 1: Verrou distribué sur sessionId**
- Utiliser pg_advisory_lock() pendant toute la durée de sendMessage
- Garantir l'ordre séquentiel

**Option 2: Queue par session**
- Utiliser une queue de messages par session
- Traiter les messages séquentiellement

### Recommandation: **Option 1** (verrou distribué)
- Plus simple à implémenter
- Garantit l'ordre séquentiel
- À implémenter dans le sprint

---

## Méthode: getMessages (lignes 180-193)

### Analyse:
- Read only

### Race Condition: **NON**

### Justification:
- Opération de lecture uniquement

---

## Conclusion Générale

### Race Conditions Détectées:
- sendMessage (message count): OUI (faible impact)
- sendMessage (ordre des messages): OUI (moyen impact)

### Mitigations en Place:
- ✅ Quota utilise RPC atomique
- ✅ Messages ont createdAt timestamp
- ⚠️ Pas de verrou distribué sur sessionId

### Améliorations Recommandées:
1. **Priorité Haute:** Ajouter pg_advisory_lock() dans sendMessage
   - Verrouiller sessionId pendant toute la durée de sendMessage
   - Garantir l'ordre séquentiel des messages
   - Empêcher les doublons de messages

2. **Priorité Moyenne:** Ajouter contrainte CHECK sur message count
   - Ajouter CHECK(message_count <= 50) dans PostgreSQL
   - Protéger contre le dépassement de la limite

### Sécurité:
- **Niveau:** Moyen (race condition sur ordre des messages)
- **Risque:** Moyen (les messages peuvent être dans le mauvais ordre)
- **Action Recommandée:** Implémenter verrou distribué
