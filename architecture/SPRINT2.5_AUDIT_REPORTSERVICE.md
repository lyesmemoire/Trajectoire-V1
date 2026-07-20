# Audit Race Conditions - ReportService

## Méthode: generateReport (lignes 45-189)

### Analyse:
1. Read session (sessionRepository.findById) →
2. Check if report exists (reportRepository.getBySessionId) → **RACE CONDITION POTENTIELLE**
3. Check rate limit (read) → OK (pas de modify)
4. Check quota (read) → OK (pas de modify)
5. Read messages (messageRepository.getBySessionId) →
6. Generate AI report (external service) →
7. Create report (write) → **RACE CONDITION POTENTIELLE**
8. Increment quota (write) → OK (RPC atomique)

### Race Condition: **OUI** (sur création de rapport)

### Scénario:
1. Requête A check if report exists (non trouvé)
2. Requête B check if report exists (non trouvé)
3. Requête A crée report (version=1)
4. Requête B crée report (version=1)
5. **Problème:** Deux rapports créés pour la même session

### Impact:
- Moyen (duplication de rapports)
- Peut affecter le quota (2 rapports = 2 consommations de quota)

### Mitigation: **PARTIELLEMENT MITIGÉ**
- Le code check si le rapport existe avant de créer
- Mais le check n'est pas atomique avec la création

### Mitigation Recommandée:
**Option 1: UPSERT avec contrainte UNIQUE**
- Ajouter contrainte UNIQUE(session_id) sur reports
- Utiliser INSERT ON CONFLICT DO NOTHING
- Si duplicate, retourner le rapport existant

**Option 2: Verrou distribué sur sessionId**
- Utiliser pg_advisory_lock() sur sessionId
- Garantir qu'un seul rapport est créé

### Recommandation: **Option 1** (UPSERT avec contrainte UNIQUE)
- Plus simple à implémenter
- La contrainte UNIQUE empêche la duplication
- UPSERT gère le cas où le rapport existe déjà

---

### Race Condition: **OUI** (sur consommation de quota)

### Scénario:
1. Requête A check if report exists (non trouvé)
2. Requête B check if report exists (non trouvé)
3. Requête A crée report et incrémente quota
4. Requête B crée report et incrémente quota
5. **Problème:** Quota consommé 2 fois pour un seul rapport

### Impact:
- Moyen (quota consommé incorrectement)
- Peut affecter la limite de rapports de l'utilisateur

### Mitigation: **PARTIELLEMENT MITIGÉ**
- Si Option 1 est implémentée (UPSERT), le quota ne sera consommé qu'une fois
- Le code check si le rapport existe avant de consommer le quota

### Recommandation:
- Implémenter Option 1 (UPSERT avec contrainte UNIQUE)
- Ne consommer le quota que si le rapport a été créé (pas s'il existait déjà)

---

## Méthode: getReport (lignes 194-208)

### Analyse:
- Read only

### Race Condition: **NON**

### Justification:
- Opération de lecture uniquement

---

## Conclusion Générale

### Race Conditions Détectées:
- generateReport (création de rapport): OUI (moyen impact)
- generateReport (consommation de quota): OUI (moyen impact)

### Mitigations en Place:
- ✅ Check si le rapport existe avant de créer
- ✅ Quota utilise RPC atomique
- ⚠️ Pas de contrainte UNIQUE sur session_id
- ⚠️ Check et création ne sont pas atomiques

### Améliorations Recommandées:
1. **Priorité Haute:** Ajouter contrainte UNIQUE sur session_id
   - Ajouter UNIQUE(session_id) dans la table reports
   - Empêcher la duplication de rapports

2. **Priorité Haute:** Utiliser UPSERT pour generateReport
   - Remplacer SELECT + INSERT par INSERT ON CONFLICT DO NOTHING
   - Si duplicate, retourner le rapport existant
   - Ne consommer le quota que si le rapport a été créé

3. **Priorité Moyenne:** Verrou distribué sur sessionId
   - Utiliser pg_advisory_lock() sur sessionId
   - Garantir qu'un seul rapport est créé
   - Alternative à UPSERT

### Sécurité:
- **Niveau:** Moyen (race condition sur création de rapport)
- **Risque:** Moyen (duplication de rapports et consommation de quota)
- **Action Recommandée:** Implémenter UPSERT avec contrainte UNIQUE
