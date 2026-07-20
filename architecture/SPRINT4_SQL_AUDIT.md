# Sprint 4 - Audit Complet des Requêtes SQL

## Overview
Ce document contient l'audit complet des requêtes SQL pour identifier les optimisations possibles.

## Analyse des Repositories

### SessionRepository

#### findById (lignes 31-48)
```typescript
const { data, error } = await supabase
  .from("interview_sessions")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("id", id)
  .single();
```
**Problème:** SELECT * récupère toutes les colonnes
**Impact:** Faible (table a ~10 colonnes)
**Optimisation:** Spécifier les colonnes nécessaires: id, user_id, job_title, level, interview_type, duration_seconds, status, started_at, completed_at, created_at, updated_at, version

#### find (lignes 53-97)
```typescript
const { data, error } = await supabase
  .from("interview_sessions")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .match(criteria)
```
**Problème:** SELECT * récupère toutes les colonnes
**Impact:** Moyen (si beaucoup de résultats)
**Optimisation:** Spécifier les colonnes nécessaires, ajouter LIMIT par défaut

#### create (lignes 110-133)
```typescript
const { data, error } = await supabase
  .from("interview_sessions")
  .insert({...})
  .select()  // ✅ OK - récupère l'objet créé
  .single();
```
**Statut:** ✅ Acceptable (besoin de l'objet complet retourné)

#### update (lignes 141-195)
```typescript
const { data, error } = await supabase
  .from("interview_sessions")
  .update({...})
  .eq("id", id)
  .eq("version", updates.version)
  .select()  // ✅ OK - récupère l'objet mis à jour
  .single();
```
**Statut:** ✅ Acceptable (besoin de l'objet complet retourné)

---

### MessageRepository

#### findById (lignes 25-42)
```typescript
const { data, error } = await supabase
  .from("interview_messages")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("id", id)
  .single();
```
**Problème:** SELECT * récupère toutes les colonnes
**Impact:** Faible (table a ~5 colonnes)
**Optimisation:** Spécifier les colonnes nécessaires: id, session_id, role, content, created_at, version

#### getBySessionId (lignes 72-89)
```typescript
const { data, error } = await supabase
  .from("interview_messages")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("session_id", sessionId)
  .order("created_at", { ascending: true });
```
**Problème:** SELECT * récupère toutes les colonnes, pas de LIMIT
**Impact:** Élevé (peut récupérer beaucoup de messages)
**Optimisation:** 
- Spécifier les colonnes nécessaires
- Ajouter LIMIT 20 par défaut
- Implémenter cursor pagination

#### count (lignes 94-98)
```typescript
const { count, error } = await supabase
  .from("interview_messages")
  .select("*", { count: "exact", head: true })  // ⚠️ SELECT * pour un count
  .eq("session_id", sessionId);
```
**Problème:** SELECT * pour un count
**Impact:** Faible (mais inutile)
**Optimisation:** Utiliser `select("id", { count: "exact", head: true })` au lieu de "*"

---

### ReportRepository

#### findById (lignes 32-49)
```typescript
const { data, error } = await supabase
  .from("reports")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("id", id)
  .single();
```
**Problème:** SELECT * récupère toutes les colonnes
**Impact:** Faible (table a ~12 colonnes)
**Optimisation:** Spécifier les colonnes nécessaires

#### getBySessionId (lignes 54-71)
```typescript
const { data, error } = await supabase
  .from("reports")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("session_id", sessionId)
  .single();
```
**Statut:** ✅ Acceptable (une seule ligne attendue)

---

### ProfileRepository

#### findById (lignes 27-44)
```typescript
const { data, error } = await supabase
  .from("profiles")
  .select("*")  // ⚠️ SELECT * - toutes les colonnes
  .eq("id", id)
  .single();
```
**Problème:** SELECT * récupère toutes les colonnes
**Impact:** Faible (table a ~10 colonnes)
**Optimisation:** Spécifier les colonnes nécessaires

---

## Requêtes N+1 Détectées

### ConversationService.sendMessage
```typescript
// 1. Read session
const sessionData = await this.sessionRepository.findById(command.sessionId);

// 2. Count messages
const messageCount = await this.messageRepository.count({ session_id: command.sessionId });

// 3. Read messages
const messages = await this.messageRepository.getBySessionId(command.sessionId);
```
**Problème:** 3 requêtes séparées pour la même session
**Impact:** Moyen
**Optimisation:** Fusionner en une seule requête RPC ou utiliser une vue matérialisée

---

## Recommandations

### 1. Supprimer SELECT *
- Remplacer `.select("*")` par `.select("col1, col2, col3")`
- Définir des constantes pour les colonnes fréquemment utilisées

### 2. Ajouter LIMIT par défaut
- `getBySessionId`: LIMIT 20
- `find`: LIMIT 50 par défaut
- Implémenter cursor pagination

### 3. Optimiser count
- Remplacer `select("*", { count: "exact" })` par `select("id", { count: "exact" })`

### 4. Fusionner les requêtes
- Créer des RPC pour les opérations multi-étapes
- Utiliser les vues matérialisées pour les données fréquemment accédées

### 5. Pagination
- Implémenter cursor pagination pour les listes
- Ajouter paramètres `limit` et `offset` dans les repositories
