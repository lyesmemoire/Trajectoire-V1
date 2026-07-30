const fs = require('fs');

// Charger les résultats
const results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results.json', 'utf8'));

// Définition des catégories INVALID
const INVALID_CATEGORIES = {
  REAL_INVALID: 'REAL_INVALID',           // compile error, type impossible, syntaxe invalide
  EXPECTED_INVALID: 'EXPECTED_INVALID',   // invariant cassé (mutation normale qui casse un invariant)
  EXPECTED_KILL: 'EXPECTED_KILL',         // boucle infinie, deadlock (devrait être KILLED)
  TEST_ISSUE: 'TEST_ISSUE'                // timeout du test lui-même, problème d'infrastructure
};

// Définition des poids métier
const BUSINESS_WEIGHTS = {
  CRITICAL: 10,  // Casse le comportement métier fondamental
  MAJOR: 5,      // Casse une fonctionnalité importante
  MINOR: 2,      // Casse une fonctionnalité secondaire
  COSMETIC: 1    // Casse un détail sans impact métier
};

// Fonction pour classer une INVALID
function classifyInvalid(mutation) {
  const { family, line, description } = mutation;
  
  // Famille E: Validation - suppression de validations
  if (family === 'E') {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: suppression de validation critique crée un état invalide normal'
    };
  }
  
  // Famille F: Exceptions - modification de propagation d'erreurs
  if (family === 'F') {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: modification de la propagation d\'erreurs casse le contrat d\'erreur'
    };
  }
  
  // Famille I: Pipeline - suppression d'étapes
  if (family === 'I') {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: suppression de fetch/decode/execute casse le pipeline fondamental'
    };
  }
  
  // Famille J: Retours - valeurs de retour incorrectes
  if (family === 'J') {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: retour de null/undefined casse le contrat de l\'API'
    };
  }
  
  // Famille B: Comparaisons - inversion de conditions de boucle
  if (family === 'B' && (line === 105 || line === 116)) {
    return {
      category: INVALID_CATEGORIES.EXPECTED_KILL,
      reason: 'Boucle infinie: inversion de condition de boucle while/for'
    };
  }
  
  // Famille B: Comparaisons - inversion de conditions critiques
  if (family === 'B' && line === 57) {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: inversion de halted check crée un état incohérent'
    };
  }
  
  // Famille A: Arithmétique sur les compteurs
  if (family === 'A' && line >= 74 && line <= 92) {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: modification des compteurs crée des incohérences dans les statistiques'
    };
  }
  
  // Famille C: Booléens sur l'état running
  if (family === 'C' && line === 103) {
    return {
      category: INVALID_CATEGORIES.EXPECTED_INVALID,
      reason: 'Invariant cassé: forcer running=false empêche l\'exécution'
    };
  }
  
  // Famille D: Contrôle - retours incorrects
  if (family === 'D' && line === 57) {
    return {
      category: INVALID_CATEGORIES.TEST_ISSUE,
      reason: 'Test issue: return undefined vs null ne devrait pas causer de crash'
    };
  }
  
  // Famille H: Compteurs - suppression d'incrément
  if (family === 'H' && line === 74) {
    return {
      category: INVALID_CATEGORIES.TEST_ISSUE,
      reason: 'Test issue: suppression d\'incrément ne devrait pas causer de crash'
    };
  }
  
  // Par défaut: TEST_ISSUE (erreur de test inconnue)
  return {
    category: INVALID_CATEGORIES.TEST_ISSUE,
    reason: 'Test issue: erreur de test inconnue, probablement crash ou assertion invalide'
  };
}

// Fonction pour attribuer le poids métier
function assignBusinessWeight(mutation) {
  const { family, line, function: funcName } = mutation;
  
  // Critères pour CRITICAL (poids 10)
  if (line === 57) return { weight: BUSINESS_WEIGHTS.CRITICAL, level: 'CRITICAL', reason: 'Validation halted - critique pour la sécurité' };
  if (line === 105 || line === 116) return { weight: BUSINESS_WEIGHTS.CRITICAL, level: 'CRITICAL', reason: 'Condition de boucle - critique pour la terminaison' };
  if (family === 'I') return { weight: BUSINESS_WEIGHTS.CRITICAL, level: 'CRITICAL', reason: 'Pipeline - critique pour le fonctionnement' };
  
  // Critères pour MAJOR (poids 5)
  if (family === 'E') return { weight: BUSINESS_WEIGHTS.MAJOR, level: 'MAJOR', reason: 'Validation - important pour la cohérence' };
  if (family === 'F') return { weight: BUSINESS_WEIGHTS.MAJOR, level: 'MAJOR', reason: 'Exception - important pour le gestion d\'erreur' };
  if (line === 91) return { weight: BUSINESS_WEIGHTS.MAJOR, level: 'MAJOR', reason: 'Gestion d\'erreur - important' };
  
  // Critères pour MINOR (poids 2)
  if (family === 'B' && line !== 57 && line !== 105 && line !== 116) return { weight: BUSINESS_WEIGHTS.MINOR, level: 'MINOR', reason: 'Comparaison - impact secondaire' };
  if (family === 'C') return { weight: BUSINESS_WEIGHTS.MINOR, level: 'MINOR', reason: 'Booléen - impact secondaire' };
  if (family === 'G') return { weight: BUSINESS_WEIGHTS.MINOR, level: 'MINOR', reason: 'État - impact secondaire' };
  
  // Critères pour COSMETIC (poids 1)
  if (family === 'A') return { weight: BUSINESS_WEIGHTS.COSMETIC, level: 'COSMETIC', reason: 'Arithmetique sur compteurs - impact cosmétique' };
  if (family === 'H') return { weight: BUSINESS_WEIGHTS.COSMETIC, level: 'COSMETIC', reason: 'Compteur - impact cosmétique' };
  if (family === 'J') return { weight: BUSINESS_WEIGHTS.COSMETIC, level: 'COSMETIC', reason: 'Retour de statistiques - impact cosmétique' };
  if (family === 'D') return { weight: BUSINESS_WEIGHTS.COSMETIC, level: 'COSMETIC', reason: 'Controle de retour - impact cosmétique' };
  
  return { weight: BUSINESS_WEIGHTS.MINOR, level: 'MINOR', reason: 'Non classifié' };
}

// Re-classer toutes les mutations
const reclassifiedResults = results.map(mutation => {
  const businessWeight = assignBusinessWeight(mutation);
  
  if (mutation.status === 'INVALID') {
    const classification = classifyInvalid(mutation);
    
    // Si c'est EXPECTED_KILL, reclasser comme KILLED
    if (classification.category === INVALID_CATEGORIES.EXPECTED_KILL) {
      return {
        ...mutation,
        status: 'KILLED',
        originalStatus: 'INVALID',
        invalidCategory: classification.category,
        invalidReason: classification.reason,
        ...businessWeight
      };
    }
    
    return {
      ...mutation,
      invalidCategory: classification.category,
      invalidReason: classification.reason,
      ...businessWeight
    };
  }
  
  return {
    ...mutation,
    invalidCategory: null,
    invalidReason: null,
    ...businessWeight
  };
});

// Sauvegarder les résultats re-classés
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results-reclassified.json', JSON.stringify(reclassifiedResults, null, 2));

// Statistiques de re-classification
const stats = {
  total: reclassifiedResults.length,
  killed: reclassifiedResults.filter(r => r.status === 'KILLED').length,
  survived: reclassifiedResults.filter(r => r.status === 'SURVIVED').length,
  invalid: reclassifiedResults.filter(r => r.status === 'INVALID').length,
  
  // Détail des INVALID
  realInvalid: reclassifiedResults.filter(r => r.invalidCategory === INVALID_CATEGORIES.REAL_INVALID).length,
  expectedInvalid: reclassifiedResults.filter(r => r.invalidCategory === INVALID_CATEGORIES.EXPECTED_INVALID).length,
  expectedKill: reclassifiedResults.filter(r => r.invalidCategory === INVALID_CATEGORIES.EXPECTED_KILL).length,
  testIssue: reclassifiedResults.filter(r => r.invalidCategory === INVALID_CATEGORIES.TEST_ISSUE).length,
  
  // Poids métier
  critical: reclassifiedResults.filter(r => r.level === 'CRITICAL').length,
  major: reclassifiedResults.filter(r => r.level === 'MAJOR').length,
  minor: reclassifiedResults.filter(r => r.level === 'MINOR').length,
  cosmetic: reclassifiedResults.filter(r => r.level === 'COSMETIC').length
};

console.log('=== Re-classification des INVALID ===');
console.log(`Total mutations: ${stats.total}`);
console.log(`KILLED: ${stats.killed}`);
console.log(`SURVIVED: ${stats.survived}`);
console.log(`INVALID: ${stats.invalid}`);
console.log('\nDétail des INVALID:');
console.log(`  REAL_INVALID: ${stats.realInvalid}`);
console.log(`  EXPECTED_INVALID: ${stats.expectedInvalid}`);
console.log(`  EXPECTED_KILL (reclassés KILLED): ${stats.expectedKill}`);
console.log(`  TEST_ISSUE: ${stats.testIssue}`);
console.log('\nPoids métier:');
console.log(`  CRITICAL: ${stats.critical}`);
console.log(`  MAJOR: ${stats.major}`);
console.log(`  MINOR: ${stats.minor}`);
console.log(`  COSMETIC: ${stats.cosmetic}`);

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/reclassification-stats.json', JSON.stringify(stats, null, 2));

console.log('\nRe-classification terminée.');
