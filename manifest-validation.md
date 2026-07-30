# Audit Cryptographique du Manifeste

## PHASES 1 & 2 : Exécutions Successives
Tous les anciens manifests ont été purgés via `archive.cjs clean`. Ensuite, la commande `pnpm cert:manifest` a été exécutée deux fois d'affilée sans aucune modification du dépôt source.

## PHASE 3 : Comparaison des Manifestes (Run 1 vs Run 2)
- **SHA256 (Run 1) :** `a5098f4b32a7c18953b1c5b7bcdd6ba9c6d6498f9e461d7eab4e22bfb4a0f329`
- **SHA256 (Run 2) :** `eeb4df8f5727537a3ad70ecf5076f852489cd215219f7ac19d07d1ff3c79cf7b`
- **UUID (`manifestId`) :** A changé (`MAN-20260728T092251Z...` vs `MAN-20260728T092300Z...`)
- **Timestamps (`createdAt`) :** A changé (`2026-07-28T09:22:51.042Z` vs `2026-07-28T09:23:00.557Z`)
- **Tableau des logs :** Le Run 1 affichait un tableau de logs vide (`[]`). Le Run 2 a listé le log `07-manifest.stdout.log` produit par le Run 1 (car il n'y a pas eu de `clean` entre les deux, créant une fuite d'état d'une exécution à l'autre).

## PHASES 4 & 5 : Identification et Rôle des Champs Variables
**Champs variables :** `metadata.manifestId`, `metadata.createdAt`, et le tableau `logs`.
**Rôle dans le hachage :** La fonction `sha256Json(manifest, ['integrity'])` calcule le hash sur l'ensemble de l'objet JSON (en excluant uniquement sa propre signature finale). **Ces champs participent donc directement au hash.** Puisqu'ils intègrent le moment de l'exécution et des UUID générés aléatoirement/basés sur le temps, le hash est mécaniquement volatile.

## PHASE 6 : Test de Déterminisme par Isolement
Afin de prouver que le non-déterminisme provient uniquement de ces métadonnées et non du contenu audité (fichiers sources, tests, etc.) :
1. Les champs `metadata.manifestId`, `metadata.createdAt` et `logs` ont été supprimés programmatiquement des deux objets JSON récupérés.
2. Le `sha256Json` a été recalculé.
- **Résultat :** Le hachage devient **strictement identique** entre le Run 1 et le Run 2 (`69bf619b434f32a43e6ac06c64c68dea5e6b1aa7410e0dccdd88a81ea7f8bdcb`).

---

## CONCLUSION

**B. Non déterministe**
