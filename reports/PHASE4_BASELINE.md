# PHASE 0 — Baseline (Mesure de référence)

Ce document capture l'état exact du projet avant le démarrage de l'Audit Phase 4.
**Date** : 2026-07-12

## 1. Métriques de Compilation (Build)
| Métrique | Valeur |
|----------|-------:|
| Build Time | 58s |
| First Load JS (Shared) | 103 kB |
| Route `/dashboard` (Total) | 269 kB |
| Route `/dashboard/career-copilot` | 414 kB |
| Route `/auth/login` | 207 kB |
| Route `/cv` | 225 kB |
| Route `/cv-editor` | 231 kB |

## 2. Indicateurs d'Architecture React
| Élément | Décompte (Fichiers) | Source |
|---------|-------------------:|--------|
| `"use client"` | 324 | `grep` sur `app/` et `components/` |
| `next/dynamic` | 15 | `grep` sur `app/` et `components/` |
| `export const dynamic = "force-dynamic"` | 37 | `grep` sur `app/` et `components/` |
| `fetch(..., { cache: "no-store" })` | 0 | `grep` sur `app/` et `components/` |
| `revalidate` | 1 | `grep` sur `app/` et `components/` |
| `cache()` | 1 | `grep` sur `app/` et `components/` |
| `unstable_cache()` | 0 | `grep` sur `app/` et `components/` |

## 3. Indicateurs de Structure
| Élément | Décompte | Source |
|---------|---------:|--------|
| Providers | 14 | Fichiers contenant `provider` |
| Hooks (dossiers + custom) | 4 | Fichiers matchant `^use[A-Z]` (dossier `hooks/` principalement) |
| Layouts | 13 | Fichiers matchant `layout.tsx` |
| Pages dynamiques (`[slug]`) | 3 | Fichiers matchant `\[.*\]` |

*(Note : ces données de structure sont des approximations RegExp pour donner un ordre de grandeur de l'arbre).*

## Prochaine Étape
Mise à jour des métriques de compilation dès la fin du processus `ANALYZE=true pnpm run build`.
