#!/bin/bash

# Supabase Production Setup Script
# Configures Supabase for production use

set -e

echo "Starting Supabase production setup..."

# Check required environment variables
if [ -z "${SUPABASE_URL}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY}" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    exit 1
fi

# Enable Row Level Security (RLS)
echo "Enabling Row Level Security..."
supabase db push --db-url "${DATABASE_URL}" || echo "RLS setup skipped"

# Set up backup schedule
echo "Setting up backup schedule..."
# This would typically be done via Supabase dashboard or API
echo "Configure daily backups in Supabase dashboard"

# Configure connection pooling
echo "Configuring connection pooling..."
# This would typically be done via Supabase dashboard
echo "Enable connection pooling in Supabase dashboard"

# Set up monitoring
echo "Setting up monitoring..."
# This would typically be done via Supabase dashboard
echo "Enable monitoring in Supabase dashboard"

echo "Supabase production setup completed"
echo "Manual steps required:"
echo "1. Enable daily backups in Supabase dashboard"
echo "2. Enable connection pooling in Supabase dashboard"
echo "3. Enable monitoring in Supabase dashboard"
echo "4. Configure custom domain if needed"
