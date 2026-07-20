/**
 * scripts/check-env-stripe.ts
 * Vérifie les variables d'environnement requises pour Stripe
 * N'affiche PAS les valeurs des variables
 */

import { config } from 'dotenv';

// Charger le fichier .env.local
config({ path: '.env.local' });

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'MISTRAL_API_KEY',
  'STRIPE_SECRET_KEY',
];

const optionalVars = [
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_EARLY',
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_EXPERT_PRICE_ID',
];

interface EnvReport {
  present: string[];
  missing: string[];
  invalid: string[];
  optionalPresent: string[];
  optionalMissing: string[];
}

function checkEnv(): EnvReport {
  const report: EnvReport = {
    present: [],
    missing: [],
    invalid: [],
    optionalPresent: [],
    optionalMissing: [],
  };

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      report.missing.push(varName);
    } else if (value === 'undefined' || value === '') {
      report.invalid.push(varName);
    } else {
      report.present.push(varName);
    }
  }

  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (!value) {
      report.optionalMissing.push(varName);
    } else {
      report.optionalPresent.push(varName);
    }
  }

  return report;
}

function main() {
  console.log('=== RAPPORT VARIABLES ENVIRONNEMENT ===\n');

  const report = checkEnv();

  console.log('VARIABLES OBLIGATOIRES');
  console.log(`✓ Présentes (${report.present.length}/${requiredVars.length}):`);
  report.present.forEach(v => console.log(`  - ${v}`));

  if (report.missing.length > 0) {
    console.log(`✗ Manquantes (${report.missing.length}):`);
    report.missing.forEach(v => console.log(`  - ${v}`));
  }

  if (report.invalid.length > 0) {
    console.log(`⚠ Invalides (${report.invalid.length}):`);
    report.invalid.forEach(v => console.log(`  - ${v}`));
  }

  console.log('\nVARIABLES OPTIONNELLES');
  console.log(`✓ Présentes (${report.optionalPresent.length}/${optionalVars.length}):`);
  report.optionalPresent.forEach(v => console.log(`  - ${v}`));

  if (report.optionalMissing.length > 0) {
    console.log(`○ Manquantes (${report.optionalMissing.length}):`);
    report.optionalMissing.forEach(v => console.log(`  - ${v}`));
  }

  console.log('\n=== RÉSUMÉ ===');
  const totalRequired = requiredVars.length;
  const totalPresent = report.present.length;
  const isReady = report.missing.length === 0 && report.invalid.length === 0;

  console.log(`Statut: ${isReady ? '✅ PRÊT' : '❌ NON PRÊT'}`);
  console.log(`Variables obligatoires: ${totalPresent}/${totalRequired} présentes`);

  if (!isReady) {
    console.log('\n⚠️ Action requise: Configurer les variables manquantes/invalides');
    process.exit(1);
  } else {
    console.log('\n✅ Environnement valide pour Stripe');
    process.exit(0);
  }
}

main();
