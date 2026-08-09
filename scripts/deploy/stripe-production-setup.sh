#!/bin/bash

# Stripe Production Setup Script
# Configures Stripe for production use

set -e

echo "Starting Stripe production setup..."

# Check required environment variables
if [ -z "${STRIPE_SECRET_KEY}" ] || [ -z "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" ]; then
    echo "Error: STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be set"
    exit 1
fi

# Validate keys are production keys
if [[ "${STRIPE_SECRET_KEY}" == sk_test_* ]]; then
    echo "Warning: Using test key. For production, use sk_live_* keys"
fi

if [[ "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" == pk_test_* ]]; then
    echo "Warning: Using test key. For production, use pk_live_* keys"
fi

# Set up webhooks
echo "Setting up webhooks..."
echo "Configure webhook endpoints in Stripe dashboard:"
echo "1. Go to https://dashboard.stripe.com/webhooks"
echo "2. Add endpoint: ${NEXT_PUBLIC_APP_URL}/api/stripe/webhook"
echo "3. Select events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed"
echo "4. Copy webhook secret and set as STRIPE_WEBHOOK_SECRET"

# Set up products and prices
echo "Setting up products and prices..."
echo "Create products and prices in Stripe dashboard:"
echo "1. Go to https://dashboard.stripe.com/products"
echo "2. Create products for your subscription tiers"
echo "3. Copy price IDs and update environment variables"

# Configure radar fraud rules
echo "Configuring fraud protection..."
echo "Enable Radar fraud rules in Stripe dashboard for production"

# Set up billing alerts
echo "Setting up billing alerts..."
echo "Configure billing alerts in Stripe dashboard"

echo "Stripe production setup completed"
echo "Manual steps required:"
echo "1. Configure webhook endpoint in Stripe dashboard"
echo "2. Set STRIPE_WEBHOOK_SECRET environment variable"
echo "3. Create products and prices in Stripe dashboard"
echo "4. Update price IDs in environment variables"
echo "5. Enable Radar fraud rules"
echo "6. Configure billing alerts"
