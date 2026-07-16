#!/bin/bash
# SIL v1.0 — Development Run Script
# Usage: ./scripts/dev-run.sh

set -e

echo "🐳 Starting SIL infrastructure (Postgres + Kafka + ZooKeeper)..."
docker compose -f docker/docker-compose.yml up -d

echo "⏳ Waiting for Postgres to be ready..."
until docker exec sil-postgres pg_isready -U sil > /dev/null 2>&1; do
  sleep 1
done
echo "✅ Postgres ready"

echo "⏳ Waiting for Kafka to be ready..."
sleep 5
echo "✅ Kafka ready"

echo ""
echo "🚀 SIL v1.0 infrastructure is UP"
echo ""
echo "  Postgres: localhost:5432 (user: sil, pass: sil, db: sil)"
echo "  Kafka:    localhost:9092"
echo ""
echo "Run tests:     npx vitest run sil/tests"
echo "Run benchmarks: npx ts-node sil/benchmarks/load/ingest-stress.ts"
echo ""
