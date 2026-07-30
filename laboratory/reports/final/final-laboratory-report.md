# Rapport de Laboratoire Indépendant (ISO 17025)

## Résumé exécutif

Ce rapport présente les résultats d'une campagne de validation indépendante du pipeline de certification logiciel contenu dans le dépôt Trajectoire. L'audit a été conduit selon les principes ISO 17025 : le laboratoire n'importe aucun module du pipeline audité et recalcule toutes les métriques de manière autonome.

## Méthodologie

Le laboratoire a :
1. Vérifié son propre isolement (aucun import de `certification/`)
2. Recalculé Coverage, Mutation et Régression en invoquant directement Vitest
3. Comparé les hashes SHA256 de chaque artefact
4. Exécuté le pipeline 5 fois pour vérifier le déterminisme
5. Reproduit le pipeline dans un environnement vierge (Machine B)
6. Lancé 8 attaques hostiles pour tester la falsifiabilité
7. Vérifié la chaîne de traçabilité complète

## Résultats

### Indépendance
- Conclusion: **OUI**
- 53 imports scannés, 0 interdits

### Recalcul Coverage
- Lab: stmts=100% branches=100% fn=100%
- Pipeline: stmts=100% branches=100% fn=100%
- Concordance: **OUI**

### Recalcul Mutation
- Lab: score=100% killed=3 survived=0
- Pipeline: score=100% killed=3 survived=0
- Concordance: **OUI**

### Recalcul Régression
- Lab: rate=100% detected=1 missed=0
- Pipeline: rate=0% detected=0 missed=1
- Concordance: **NON**

### Déterminisme (5 runs)
- Run 1: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- Run 2: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- Run 3: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- Run 4: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- Run 5: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- Tous identiques: **NON**

### Machine B
- SHA A: 799978b2aa8b57bd8c89d1eaf0c922fcba293f5425afc498797205e8e49aa88d
- SHA B: ERREUR
- Identiques: **NON**
- Erreur: Le dossier certification/runs n'existe pas sur Machine B

### Campagne hostile
- Modification coverage-report.json (statements → 0): ✓ DÉTECTÉE
- Modification manifest.json (hash altéré): ✓ DÉTECTÉE
- Modification certification.json (certified → true): ✓ DÉTECTÉE
- Suppression coverage-final.json: ✓ DÉTECTÉE
- Suppression vitest-results.json: ✓ DÉTECTÉE
- Suppression dossier logs/: ✗ NON DÉTECTÉE
- Création faux artefact (fake-cert.json): ✗ NON DÉTECTÉE
- Inversion mutation-report.json (contenu vide): ✓ DÉTECTÉE
- Toutes détectées: **NON**

### Matrice de validation

| Élément | Source primaire | Recalcul Lab | Concordance |
|---|---|---|---|
| Coverage | coverage-final.json | OUI | OUI |
| Mutation | vitest-results-M*.json | OUI | OUI |
| Régression | vitest-results-R*.json | OUI | NON |
| Manifest | manifest.json | OUI | NON |
| Certification | certification.json | OUI | NON |

## Limites

- Machine B utilise `xcopy` (Windows) et non un vrai `git clone` distant
- Le nombre de mutations (3) et régressions (1) est faible
- L'audit ne couvre pas les dépendances transitives npm

## Menaces à la validité

- Le laboratoire et le pipeline tournent sur la même machine physique
- Le même runtime Node.js est utilisé

## Reproductibilité

Ce rapport peut être reproduit en exécutant :
```
git clone <repo>
pnpm install
node laboratory/iso-final-audit.cjs
```

## Conclusion

Les conditions suivantes ne sont PAS satisfaites :
- Régression recalculée et concordante
- Déterminisme (5 runs identiques)
- Machine B identique
- Hashes SHA256 concordants
- Toutes attaques hostiles détectées

## Réponse finale

**NON**

Justification : Régression recalculée et concordante, Déterminisme (5 runs identiques), Machine B identique, Hashes SHA256 concordants, Toutes attaques hostiles détectées
