# Validation Indépendante du Moteur de Régression

## PHASE 1 : Analyse de l'Exécution
- **Commande exacte :** `npx vitest run tests/vm/advanced/execution-pipeline.test.ts --no-coverage --reporter=verbose --no-threads`
- **Timeout :** 30000 millisecondes (30 secondes).
- **Critère REGRESSION_DETECTED :** La détection d'une régression est déclenchée pour tout code de retour (Exit Code) de Vitest différent de 0, peu importe si l'erreur provient de l'échec d'un test ou d'une erreur fatale de la CLI.

## PHASES 2, 3, 4 : Injection et Observation
Une unique régression (R5 : Supprimer `stop()`) a été isolée et injectée pour tester le pipeline.
- **Commande lancée :** `pnpm cert:regression`
- **Stdout :** Le script affiche l'exécution de la régression R5 et indique `Status: REGRESSION_DETECTED (1332ms)`. Le score final est de 100%.
- **Stderr :** Vide (le script Javascript global s'exécute sans erreur de syntaxe ou d'exécution).
- **Exit Code global :** 0

## PHASE 5 : Exécution Réelle des Tests
**Les tests n'ont pas du tout tourné.**
L'analyse des logs générés par `regression.cjs` (ex: `logs/06-regression-R5.stderr.log`) montre que l'exécutable Vitest échoue instantanément au lancement en raison de l'option de ligne de commande invalide (`--no-threads`), provoquant une `CACError`. Le script `regression.cjs` assimile cette erreur de processus à une détection réussie, générant un faux positif systématique.

## PHASE 6 : Logique des Statuts
L'examen du code de `regression.cjs` démontre la logique suivante :
- **BUILD ERROR :** S'applique avant même l'exécution des tests si la modification du fichier source échoue (ex. l'index de la ligne fournie dans le JSON de définition est hors limites) ou si une autre erreur non prévue (comme l'indisponibilité du système de fichiers) se produit.
- **TIMEOUT :** Attribué si le processus Vitest dépasse la limite de temps configurée (30000ms) ou s'il est tué par un signal système (`e.killed || e.signal === 'SIGTERM'`).
- **FAILED :** **Ce statut n'existe pas** dans le script. Un test échoué est structurellement confondu avec la détection de la régression.
- **REGRESSION DETECTED :** Attribué pour *tout* code de retour de Vitest différent de 0. Le script suppose qu'un processus qui échoue (Exit Code != 0) indique une régression déjouée, alors qu'il capte ici un plantage immédiat de la configuration (l'erreur d'option `--threads`).

---

## CONCLUSION

**B. détection invalide**
