# Validation Indépendante du Pipeline de Couverture (Coverage)

## PHASE 1 : Analyse des Commandes
- **Script :** `certification/coverage.cjs`
- **Commande réellement exécutée :** `npx vitest run tests/vm/advanced/execution-pipeline.test.ts tests/vm/advanced/execution-pipeline-r5-minimal.test.ts --coverage --reporter=verbose --reporter=json --outputFile=C:/Trajectoire/certification/runs/manual/vitest-results.json --no-threads`
- **Options Vitest :** `--coverage`, `--reporter=verbose`, `--reporter=json`, `--outputFile=...`, `--no-threads`
- **Fichiers lus :** Le script tente de lire `C:\Trajectoire\reports\cli\coverage\coverage-final.json`.
- **Fichiers écrits :** `03-coverage.stdout.log`, `03-coverage.stderr.log`, `coverage-final.json` (copie dans le dossier de run), et l'artefact `coverage-report.json`.

## PHASE 2 : Suppression des Artefacts Locaux
Le dossier local préexistant `reports/cli/coverage/` a été supprimé afin de vérifier si l'exécution recalcule réellement ce fichier.

## PHASE 3 : Exécution Isolée
La commande `pnpm cert:coverage` a été lancée.
- **Exit Code de cert:coverage :** 0 (le script JS intercepte l'erreur mais ne crash pas Node.js)
- **Durée :** 5.57 secondes
- **Stdout :** Le script affiche un message d'erreur clair : `[COVERAGE] ERROR: coverage-final.json not found at C:\Trajectoire\reports\cli\coverage\coverage-final.json`

## PHASE 4 : Analyse de l'Échec de Vitest
La commande Vitest exécutée par le script **échoue inconditionnellement**.
- **Message :** `CACError: Unknown option '--threads'`
- **Stack :** `at Command.checkUnknownOptions (...) at CAC.runMatchedCommand (...)`
- **Code erreur (Exit Code Vitest) :** 1
- **Ligne concernée :** `node_modules/vitest/dist/chunks/cac.C9xsMMkH.js:406`

## PHASE 5 : Traçabilité Fichier
Le script `coverage.cjs` **copie un fichier existant statique**. Il ne génère aucun nouveau fichier `coverage-final.json` dynamiquement car l'exécution de Vitest plante avant toute exécution de test.

## PHASE 6 : Intégrité Cryptographique
- **SHA256 avant suppression :** `0B8B62DB97709A7894DDE3007711A75B714AB8935E575B3A382A34E3DCDDE15B`
- **SHA256 après exécution :** Fichier introuvable. Aucun fichier n'ayant été généré par Vitest, le hachage est impossible.

## PHASE 7 : Comportement Post-Suppression
Après la suppression complète du dossier de couverture, **le pipeline ne fonctionne plus** pour la phase de couverture. Le script s'arrête avec l'erreur `coverage-final.json not found` et retourne `null` au lieu de produire l'artefact de couverture. Le processus de certification échouera ultérieurement en indiquant "PREUVE INSUFFISANTE".

---

## CONCLUSION

**B. Coverage copié**
