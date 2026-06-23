#!/bin/bash
set -e  # Arrêt immédiat en cas d'erreur

echo "🚀 Démarrage du déploiement AI Career Copilot"
echo "============================================="

# Étape 1 : Vérification des types TypeScript
echo ""
echo "📋 [1/5] Vérification TypeScript..."
npm run type-check
echo "✅ TypeScript OK"

# Étape 2 : Linting
echo ""
echo "🔍 [2/5] Linting ESLint..."
npm run lint
echo "✅ Lint OK"

# Étape 3 : Build de production
echo ""
echo "🏗️  [3/5] Build production Next.js..."
npm run build
echo "✅ Build OK"

# Étape 4 : Variables d'environnement requises
echo ""
echo "🔐 [4/5] Vérification des variables d'environnement..."

REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "OPENAI_API_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
)

MISSING=0
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Variable manquante : $VAR"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "❌ $MISSING variable(s) manquante(s). Déploiement annulé."
  exit 1
fi
echo "✅ Toutes les variables sont présentes"

# Étape 5 : Déploiement Vercel
echo ""
echo "🌐 [5/5] Déploiement sur Vercel..."
vercel --prod

echo ""
echo "============================================="
echo "✅ Déploiement terminé avec succès !"
