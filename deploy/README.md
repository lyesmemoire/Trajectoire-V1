# Trajectoire Deployment Guide

## Prerequisites

- Docker installed
- Kubernetes cluster (minikube, kind, or cloud provider)
- Helm 3.x
- kubectl configured
- External Secrets Operator (optional, for Vault integration)

## Quick Start

### Docker Compose (Development)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (Production)

```bash
# Create namespace
kubectl apply -f deploy/kubernetes/namespace.yaml

# Apply secrets (replace with actual values)
kubectl apply -f deploy/kubernetes/secret.yaml

# Apply configmap
kubectl apply -f deploy/kubernetes/configmap.yaml

# Deploy PostgreSQL
kubectl apply -f deploy/kubernetes/postgres-deployment.yaml

# Deploy Redis
kubectl apply -f deploy/kubernetes/redis-deployment.yaml

# Deploy API
kubectl apply -f deploy/kubernetes/api-deployment.yaml

# Deploy monitoring
kubectl apply -f deploy/kubernetes/monitoring-deployment.yaml

# Configure ingress
kubectl apply -f deploy/kubernetes/ingress.yaml
```

### Helm (Recommended for Production)

```bash
# Add Helm repository (if using)
helm repo add trajectoire https://charts.trajectoire.com

# Install/upgrade
helm upgrade --install trajectoire ./deploy/helm/trajectoire \
  --namespace trajectoire \
  --create-namespace \
  --values deploy/helm/trajectoire/values.yaml \
  --set secrets.postgres.password=your-password \
  --set secrets.openai.apiKey=your-api-key \
  --set secrets.jwt.secret=your-secret
```

## Secrets Management

### Option 1: Kubernetes Secrets

Edit `deploy/kubernetes/secret.yaml` with actual values:
```bash
kubectl create secret generic trajectoire-secrets \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=your-password \
  --from-literal=POSTGRES_DB=trajectoire \
  --from-literal=REDIS_PASSWORD=your-password \
  --from-literal=OPENAI_API_KEY=your-api-key \
  --from-literal=JWT_SECRET=your-secret \
  --from-literal=GRAFANA_ADMIN_USER=admin \
  --from-literal=GRAFANA_ADMIN_PASSWORD=your-password \
  --namespace trajectoire
```

### Option 2: External Secrets (Vault)

Install External Secrets Operator:
```bash
kubectl apply -f https://raw.githubusercontent.com/external-secrets/external-secrets/main/docs/contributing/examples/vault/deploy-vault.yaml
kubectl apply -f https://raw.githubusercontent.com/external-secrets/external-secrets/main/docs/contributing/examples/vault/deploy-external-secrets.yaml
```

Apply ExternalSecrets configuration:
```bash
kubectl apply -f deploy/kubernetes/secrets-external-secrets.yaml
```

## Deployment Strategies

### Rolling Update (Default)
```bash
helm upgrade --install trajectoire ./deploy/helm/trajectoire \
  --namespace trajectoire \
  --values deploy/helm/trajectoire/values.yaml
```

### Blue-Green Deployment
```bash
# Deploy blue environment
helm upgrade --install trajectoire-blue ./deploy/helm/trajectoire \
  --namespace trajectoire \
  --set fullnameOverride=trajectoire-blue \
  --values deploy/helm/trajectoire/values.yaml

# Switch traffic
kubectl patch service trajectoire-api-service -n trajectoire \
  -p '{"spec":{"selector":{"app":"trajectoire-blue"}}}'
```

### Canary Deployment
```bash
# Deploy canary (10%)
helm upgrade --install trajectoire-canary ./deploy/helm/trajectoire \
  --namespace trajectoire \
  --set replicaCount=1 \
  --set fullnameOverride=trajectoire-canary \
  --values deploy/helm/trajectoire/values.yaml

# Monitor and scale up if successful
kubectl scale deployment trajectoire-canary -n trajectoire --replicas=2
```

## Backup and Restore

### Backup PostgreSQL
```bash
kubectl exec -n trajectoire deployment/trajectoire-postgres -- \
  pg_dump -U postgres trajectoire > backup-$(date +%Y%m%d).sql
```

### Backup Redis
```bash
kubectl exec -n trajectoire deployment/trajectoire-redis -- \
  redis-cli --rdb /backups/dump-$(date +%Y%m%d).rdb
```

### Restore PostgreSQL
```bash
kubectl exec -n trajectoire deployment/trajectoire-postgres -- \
  psql -U postgres trajectoire < backup-20260101.sql
```

### Restore Redis
```bash
kubectl cp backup-20260101.rdb trajectoire-redis:/data/dump.rdb -n trajectoire
kubectl exec -n trajectoire deployment/trajectoire-redis -- redis-cli --rdb /data/dump.rdb
```

## Rollback

### Helm Rollback
```bash
helm rollback trajectoure -n trajectoire
```

### Kubernetes Rollback
```bash
kubectl rollout undo deployment/trajectoire-api -n trajectoire
```

## Monitoring

### Access Grafana
```bash
kubectl port-forward -n trajectoire svc/trajectoire-grafana 3000:3000
```

### Access Prometheus
```bash
kubectl port-forward -n trajectoire svc/trajectoire-prometheus 9090:9090
```

### Access Jaeger
```bash
kubectl port-forward -n trajectoire svc/trajectoire-jaeger 16686:16686
```

## Health Checks

```bash
# Application health
curl http://api.trajectoire.com/health

# Readiness check
curl http://api.trajectoire.com/health/readiness

# Metrics
curl http://api.trajectoire.com/metrics

# Dashboard
curl http://api.trajectoire.com/dashboard
```

## CI/CD

The project includes GitHub Actions workflows for:
- Automated testing and linting
- Docker image building and pushing
- Kubernetes deployment with Helm
- Blue-Green and Canary deployments
- Automatic rollback on failure
- Database migrations
- Backup and disaster recovery

Trigger deployment via:
```bash
# Manual deployment
gh workflow run deploy-k8s.yml \
  -f environment=production \
  -f strategy=rolling
```

## Troubleshooting

### Check pod logs
```bash
kubectl logs -n trajectoire deployment/trajectoire-api -f
```

### Check pod status
```bash
kubectl get pods -n trajectoire
kubectl describe pod <pod-name> -n trajectoire
```

### Check events
```bash
kubectl get events -n trajectoire --sort-by='.lastTimestamp'
```

### Port forward for debugging
```bash
kubectl port-forward -n trajectoire deployment/trajectoire-api 3000:3000
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | production |
| PORT | Application port | 3000 |
| DATABASE_URL | PostgreSQL connection | - |
| REDIS_HOST | Redis host | redis |
| REDIS_PORT | Redis port | 6379 |
| OPENAI_API_KEY | OpenAI API key | - |
| JWT_SECRET | JWT secret | - |
| JAEGER_ENDPOINT | Jaeger endpoint | http://jaeger:4317 |

## Scaling

### Manual scaling
```bash
kubectl scale deployment trajectoire-api -n trajectoire --replicas=5
```

### Auto-scaling (HPA)
```bash
kubectl apply -f deploy/kubernetes/api-deployment.yaml
# HPA is included in the deployment manifest
```

## Security

- Secrets should never be committed to git
- Use External Secrets Operator for production
- Enable RBAC in Kubernetes
- Use network policies to restrict traffic
- Regular security scans with Trivy
- Keep dependencies updated
