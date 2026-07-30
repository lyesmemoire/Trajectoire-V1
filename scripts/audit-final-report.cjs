const fs = require('fs');

// Charger les résultats de toutes les phases
const phase5Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase5.json', 'utf8'));
const phase6Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase6.json', 'utf8'));
const phase7Final = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase7-final.json', 'utf8'));

// Résultats finaux (Phase 7 après reclassification)
const killed = phase7Final.filter(r => r.status === 'KILLED').length;
const survived = phase7Final.filter(r => r.status === 'SURVIVED').length;
const invalid = phase7Final.filter(r => r.status === 'INVALID').length;
const total = phase7Final.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Familles couvertes
const familiesWithValid = new Set(phase7Final.filter(r => r.status !== 'INVALID').map(r => r.family || ''));
const coveredFamilies = Array.from(familiesWithValid);
const allFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const uncoveredFamilies = allFamilies.filter(f => !familiesWithValid.has(f));

// Certification
let certification = 'FAILED';
if (validTotal >= 30 && parseFloat(mutationScore) >= 95 && survived === 0 && coveredFamilies.length >= 8) {
  certification = 'GOLD';
} else if (validTotal >= 15 && parseFloat(mutationScore) >= 90) {
  certification = 'SILVER';
} else if (validTotal >= 10 && parseFloat(mutationScore) >= 80) {
  certification = 'BRONZE';
}

const report = `# Audit par mutation - execution-pipeline (Rapport Final Consolidé)

## Résumé des phases

### Phase 5 - Mutations Métier
- Total mutations: 12
- KILLED: 3
- SURVIVED: 0
- INVALID: 9
- Certification: FAILED

### Phase 6 - Reclassification des INVALID
- 9 mutations INVALID reclassées en KILLED
- Résultat: 12 KILLED, 0 SURVIVED, 0 INVALID
- Certification: BRONZE

### Phase 7 - Validation des KILLED avec preuve par assertion
- 12 mutations KILLED analysées
- 11 reclassées en INVALID (aucune assertion fonctionnelle identifiée)
- 1 reste KILLED (assertion identifiée)
- Résultat final: 1 KILLED, 0 SURVIVED, 11 INVALID

## Résultats finaux

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |
| Total | ${total} |
| Mutation Score | ${mutationScore}% |

## Familles couvertes

${coveredFamilies.length} familles sur 10: ${coveredFamilies.join(', ') || 'Aucune'}

## Familles non couvertes

${uncoveredFamilies.join(', ') || 'Aucune'}

## Certification

**${certification}**

## Justification

La certification est **${certification}** car:
- Seulement ${validTotal} mutation(s) valide(s) sur ${total} (critère: ≥ 10 pour BRONZE, ≥ 15 pour SILVER, ≥ 30 pour GOLD)
- Mutation Score de ${mutationScore}% sur les mutations valides
- ${coveredFamilies.length} famille(s) couverte(s) sur 10 (critère: ≥ 8 pour GOLD)
- ${invalid} mutation(s) INVALID sur ${total} (${((invalid/total)*100).toFixed(1)}%)

## Analyse détaillée

### Mutation KILLED (avec assertion identifiée)

${phase7Final.filter(r => r.status === 'KILLED').map(r => `- **${r.id}**: ${r.mutation} (Test: ${r.detectorTest}, Assertion: ${r.assertion})`).join('\n') || 'Aucune'}

### Mutations INVALID (sans assertion identifiée)

${phase7Final.filter(r => r.status === 'INVALID').map(r => `- **${r.id}**: ${r.mutation} (Raison: ${r.reason || 'Aucune assertion fonctionnelle identifiée'})`).join('\n')}

## Conclusion

L'audit révèle que bien que les tests détectent certaines régressions (Mutation Score 100% sur les mutations valides), l'échantillon de mutations valides est trop petit (${validTotal}) pour démontrer une couverture robuste du comportement métier. De plus, ${invalid} mutations sur ${total} n'ont pas pu être validées avec une assertion fonctionnelle précise, ce qui indique que les tests ne protègent pas de manière explicite ces aspects du comportement.

Pour atteindre une certification plus élevée, il faudrait:
- Augmenter le nombre de mutations valides à au moins 15 (SILVER) ou 30 (GOLD)
- Identifier des assertions fonctionnelles précises pour chaque mutation KILLED
- Couvrir au moins 8 familles de mutations avec des mutations valides
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-report.md', report);

console.log('=== Rapport Final Consolidé ===');
console.log(`\nKILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`\nCertification: ${certification}`);
console.log(`\nFamilles couvertes: ${coveredFamilies.join(', ') || 'Aucune'}`);
console.log(`Familles non couvertes: ${uncoveredFamilies.join(', ') || 'Aucune'}`);
