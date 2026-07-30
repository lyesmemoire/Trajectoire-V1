# Rapport d'Audit ISO 17025 - Validation Globale du Pipeline

## PROTOCOLE
Conformément aux directives, une évaluation complète du pipeline de certification a été menée sans présupposé de confiance. Les scripts d'orchestration (`certify.cjs` et ses modules) ont été analysés empiriquement.

## OBSERVATIONS FACTUELLES

### PHASES 1 à 4 : Exécution standard
L'exécution de `pnpm cert:full` sur un dépôt reconstitué génère une décision globale `REJECTED`. Le système s'exécute jusqu'au bout mais échoue sur les premières étapes réelles.
**Fait marquant :** Vitest échoue systématiquement avec un code d'erreur 1 en raison de l'option `--no-threads` (non supportée par la version 4.1.8).

### PHASE 5 : Évaluation des sous-modules
- **Coverage :** Tente de copier un fichier d'une exécution antérieure (`reports/cli/coverage/coverage-final.json`). Ne calcule aucune couverture en temps réel.
- **Mutation :** Produit un score de 100% de mutations tuées. Ce résultat est un artefact : tout crash de l'exécuteur de test (y compris l'erreur CLI fatale) est validé comme un succès de mutation.
- **Regression :** Produit un score de 100% de détection. Même cause : l'erreur fatale est traitée comme une régression détectée par les tests.
- **Manifest / Verification :** La cryptographie des empreintes et de la vérification de cohérence fonctionne correctement. Elle vérifie l'intégrité des mensonges générés.

### PHASE 6 : Test de Déterminisme
Le pipeline échoue au test de déterminisme. Deux exécutions consécutives strictement identiques (sans modification des sources) produisent des manifestes JSON dont les hashs SHA256 diffèrent. Cette instabilité est causée par l'inclusion de dates (`createdAt`) et d'identifiants aléatoires (`manifestId`) dans la base de calcul du hash.

### PHASE 7 : Test de Falsification A Posteriori
Le module de vérification (`verify.cjs`) détecte efficacement les altérations (erreur `V-05`). La protection cryptographique de l'existant est fonctionnelle.

### PHASE 8 : Test d'Impact des Sources
La modification du code source n'a **aucune incidence** sur les métriques calculées. Les scores (100%) restent identiques car ils sont fondés sur les codes de retour erronés des outils sous-jacents, et non sur le comportement du code métier analysé.

## PHASE 9 : QUALIFICATION DU PIPELINE
1. **Reproductible : NON.** L'empreinte globale (manifeste) change à chaque exécution.
2. **Déterministe : NON.** Même constat (présence de fuites d'état et timestamps).
3. **Falsifiable : OUI.** Au sens Poppersien, il a pu être mis en défaut et ses failles ont été prouvées.
4. **Auditable : OUI.** La traçabilité des exécutions (logs, diffs, JSONs) permet de détecter l'imposture.
5. **Indépendant : NON.** Il ne s'appuie pas sur une véritable évaluation isolée mais subit les états de l'environnement, des fichiers copiés et des erreurs de l'exécuteur.

---

## CONCLUSION

**B. Pipeline invalide**
