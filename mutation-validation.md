# Validation Indépendante du Moteur de Mutation

## PHASE 1 : Commande exacte utilisée
- **Script :** `certification/mutation.cjs`
- **Commande Vitest :** `npx vitest run tests/vm/advanced/execution-pipeline.test.ts --no-coverage --reporter=verbose --no-threads`

## PHASE 2 : Création de la Mutation Triviale
Une mutation triviale (nommée "M3") a été ajoutée au fichier de définitions `certification/definitions/execution-pipeline/mutations.json`.
- **Fichier ciblé :** `compiler/cvm/execution-pipeline.ts`
- **Ligne :** 28
- **Modification :** `private running: boolean = false;` → `private running: boolean = true;`

## PHASES 3 & 4 : Exécution et Captures
- **Commande lancée :** `pnpm cert:mutation`
- **Durée totale :** 7.85 secondes
- **Exit Code :** 0 (le script englobant s'exécute sans crasher).
- **Stdout du script :** Annonce que 3 mutations ont été testées et que les 3 sont "KILLED", avec un score de 100%.

## PHASE 5 : Exécution Réelle de Vitest
**Vitest n'a exécuté aucun test.**
L'analyse des fichiers de log individuels (ex: `logs/05-mutation-M3.stderr.log`) démontre que Vitest s'arrête instantanément avec une erreur fatale d'initialisation :
> `CACError: Unknown option '--threads'`

## PHASE 6 : Comparaison des Métriques
- **Tests réellement exécutés :** 0
- **Mutations annoncées comme "KILLED" par les tests :** 3
La totalité des mutations annoncées "tuées" ne l'ont pas été par l'exécution d'un test.

## PHASE 7 : Justification du Statut KILLED
Dans `mutation.cjs`, la logique d'évaluation intercepte l'exception renvoyée par le plantage de Vitest. Parce que `vitestExitCode !== 0` (il vaut 1 suite au plantage `--no-threads`), le script considère automatiquement la mutation comme "KILLED", bien qu'aucun test n'ait échoué légitimement. L'erreur système est maquillée en réussite du pipeline de mutation.

---

## CONCLUSION

**B. Mutation faussement détectée**
