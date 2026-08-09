# CI/CD Pipeline Documentation

## Overview

This document describes the complete CI/CD pipeline for Trajectoire, including all stages, quality gates, deployment strategies, and rollback mechanisms.

## Pipeline Architecture

```
Push/PR → Lint → Typecheck → Tests → Coverage → Regression → Build → Security → Docker → Quality Report → Deploy
```

## Stages

### 1. Lint
**Purpose**: Code quality and style enforcement
**Tool**: ESLint
**Trigger**: All branches and PRs
**Failure Action**: Upload lint results as artifacts, block pipeline

```bash
pnpm lint
```

**Quality Gate**: Must pass with no errors

### 2. Typecheck
**Purpose**: TypeScript type validation
**Tool**: TypeScript compiler
**Trigger**: All branches and PRs
**Failure Action**: Upload typecheck results as artifacts, block pipeline

```bash
pnpm typecheck
```

**Quality Gate**: Must pass with no type errors

### 3. Tests
**Purpose**: Unit and integration testing
**Tool**: Vitest
**Trigger**: All branches and PRs
**Coverage Threshold**: 80% minimum

```bash
pnpm test:cov
```

**Quality Gates**:
- All tests must pass
- Coverage must be ≥ 80%
- Results uploaded to Codecov

### 4. Regression Tests
**Purpose**: Detect performance and functional regressions
**Tool**: Playwright E2E tests
**Trigger**: After unit tests pass
**Failure Action**: Block deployment

```bash
pnpm test:e2e
```

**Quality Gates**:
- All E2E tests must pass
- Performance metrics compared with baseline
- Any regression blocks deployment

### 5. Build
**Purpose**: Compile and bundle the application
**Tool**: TypeScript, Next.js
**Dependencies**: Lint, Typecheck, Tests, Regression
**Failure Action**: Block pipeline

<pnpm build</p>

**Quality Gate**: Build must succeed without errors

### 6. Security Scan
**Purpose**: Detect vulnerabilities in code and dependencies
**Tools**: 
- Trivy (file system and Docker images)
- npm audit
- Snyk

**Quality Gates**:
- No CRITICAL vulnerabilities allowed
- No HIGH vulnerabilities allowed
- Moderate vulnerabilities reviewed but may block

### 7. Docker Build
**Purpose**: Build and push Docker images
**Tools**: Docker Buildx, Docker Hub
**Dependencies**: Build, Security

**Images Built**:
- `trajectoire-api:{sha}` and `trajectoire-api:latest`
- `trajectoire-web:{sha}` and `trajectoire-web:latest`

**Quality Gates**:
- Docker build must succeed
- Docker image scan must pass

### 8. Quality Report
**Purpose**: Aggregate all quality metrics into a single report
**Trigger**: After all quality checks complete
**Output**: Markdown report uploaded as artifact

**Report Includes**:
- Build SHA
- Lint status
- Typecheck status
- Test status
- Security status
- Docker status

**PR Integration**: Report automatically commented on pull requests

### 9. Deploy Preview
**Purpose**: Deploy preview environment for PRs
**Trigger**: Pull requests only
**Environment**: Vercel Preview
**Post-Deploy**: Smoke tests

**Quality Gates**:
- Smoke tests must pass
- Preview URL must be accessible

### 10. Deploy Staging
**Purpose**: Deploy to staging environment
**Trigger**: Push to `develop` branch
**Environment**: Vercel Staging
**Post-Deploy**: 
- Prisma migrations
- Smoke tests
- Store deployment info for rollback

**Quality Gates**:
- Migrations must succeed
- Smoke tests must pass

### 11. Deploy Production
**Purpose**: Deploy to production environment
**Trigger**: Push to `main` branch
**Environment**: Vercel Production
**Post-Deploy**:
- Prisma migrations
- Smoke tests
- Health checks
- Store deployment info for rollback
- Slack notification

**Quality Gates**:
- All health checks must pass
- Smoke tests must pass

### 12. Automatic Rollback
**Purpose**: Automatically rollback on deployment failure
**Trigger**: Production deployment failure
**Actions**:
- Deploy previous version
- Rollback Prisma migrations
- Slack notification

**Rollback Strategy**:
- Checkout previous commit (`github.event.before`)
- Deploy previous version
- Rollback database migrations
- Notify team

## Environment Configuration

### Required Secrets

**GitHub Secrets**:
- `DATABASE_URL` - Production database connection string
- `STAGING_DATABASE_URL` - Staging database connection string
- `OPENAI_API_KEY` - OpenAI API key
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `SNYK_TOKEN` - Snyk security token
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications

### Environment Variables

**Production**:
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_HOST=redis
REDIS_PORT=6379
```

**Staging**:
```bash
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db_staging
REDIS_HOST=redis
REDIS_PORT=6379
```

## Deployment Environments

### Preview
- **Trigger**: Pull requests
- **Platform**: Vercel
- **URL**: `https://<pr-number>.preview.vercel.app`
- **Database**: Uses staging database
- **Features**: Full feature parity with production

### Staging
- **Trigger**: Push to `develop`
- **Platform**: Vercel
- **URL**: `https://staging.vercel.app`
- **Database**: Dedicated staging database
- **Features**: Production-like environment for testing

### Production
- **Trigger**: Push to `main`
- **Platform**: Vercel
- **URL**: `https://trajectoire.app`
- **Database**: Production database
- **Features**: Full production deployment

## Quality Gates Summary

| Stage | Quality Gate | Threshold | Block on Failure |
|-------|-------------|-----------|------------------|
| Lint | No errors | 0 errors | Yes |
| Typecheck | No type errors | 0 errors | Yes |
| Tests | Pass rate | 100% | Yes |
| Coverage | Line coverage | ≥80% | Yes |
| Regression | Performance | No regression | Yes |
| Security | Vulnerabilities | No CRITICAL/HIGH | Yes |
| Build | Compilation | Success | Yes |
| Docker | Image scan | No CRITICAL/HIGH | Yes |
| Deploy | Health checks | 200 OK | Yes |

## Rollback Strategy

### Automatic Rollback Triggers
- Production deployment failure
- Health check failure
- Smoke test failure
- Migration failure

### Manual Rollback
```bash
# Via GitHub Actions
# Go to Actions tab
# Select "Rollback" workflow
# Click "Run workflow"
# Select previous commit SHA

# Via CLI
git checkout <previous-sha>
git push origin main --force
```

### Rollback Process
1. Identify last successful deployment SHA
2. Checkout previous commit
3. Deploy previous version
4. Rollback database migrations
5. Verify health checks
6. Notify team

## Monitoring and Alerts

### Health Checks
**Endpoint**: `GET /health`
**Checks**:
- Database connectivity
- Redis connectivity
- Memory usage
- Disk space

**Frequency**: Every 30 seconds
**Timeout**: 10 seconds
**Retries**: 3

### Metrics
**Collected Metrics**:
- Request rate
- Response time
- Error rate
- Memory usage
- CPU usage
- Database query performance
- Cache hit/miss ratio

**Tools**:
- Prometheus for metric collection
- Grafana for visualization

### Alerts
**Slack Notifications**:
- Production deployment success
- Production deployment failure
- Automatic rollback initiated
- Security vulnerabilities detected
- Health check failures

## Docker Deployment

### Local Development
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build api
```

### Production Deployment
```bash
# Pull latest images
docker pull username/trajectoire-api:latest
docker pull username/trajectoire-web:latest

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec api pnpm migration:up
```

## Troubleshooting

### Pipeline Failures

**Lint Errors**:
```bash
# Run locally to reproduce
pnpm lint
pnpm lint:fix
```

**Typecheck Errors**:
```bash
# Run locally to reproduce
pnpm typecheck
```

**Test Failures**:
```bash
# Run tests locally
pnpm test:cov

# Run specific test
pnpm test -- path/to/test.spec.ts
```

**Coverage Below Threshold**:
- Review coverage report
- Add tests for uncovered code
- Adjust threshold if justified

**Security Vulnerabilities**:
```bash
# Run audit locally
pnpm audit

# Fix vulnerabilities
pnpm audit fix
```

### Deployment Failures

**Build Failure**:
- Check build logs
- Verify dependencies
- Check Node.js version compatibility

**Migration Failure**:
- Review migration SQL
- Check database connectivity
- Manually run migration locally

**Health Check Failure**:
- Check service logs
- Verify environment variables
- Check database connectivity
- Check Redis connectivity

### Rollback Issues

**Rollback Fails**:
- Verify previous commit exists
- Check deployment logs
- Manually deploy previous version
- Manually rollback migrations

## Best Practices

### Branch Strategy
- `main` - Production-ready code
- `develop` - Staging integration
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

### Commit Messages
Follow conventional commits:
- `feat: add new feature`
- `fix: fix bug`
- `docs: update documentation`
- `test: add tests`
- `chore: maintenance`

### Pull Request Guidelines
1. Create PR from feature branch to `develop`
2. Ensure all CI checks pass
3. Request at least one review
4. Merge after approval

### Release Process
1. Merge `develop` to `main`
2. Tag release: `git tag v1.0.0`
3. Push tag: `git push origin v1.0.0`
4. Pipeline deploys to production
5. Monitor deployment
6. Verify health checks

## Performance Optimization

### Pipeline Caching
- Docker layer caching enabled
- GitHub Actions cache for dependencies
- Build artifacts cached between jobs

### Parallel Execution
- Lint, Typecheck, Security run in parallel
- Docker builds run in parallel
- Tests run in parallel where possible

### Resource Optimization
- Use appropriate runner sizes
- Limit concurrent jobs
- Optimize Docker image sizes

## Security Considerations

### Secret Management
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use different secrets per environment

### Dependency Security
- Regular dependency updates
- Automated security scanning
- Review and patch vulnerabilities promptly

### Access Control
- Restrict who can trigger deployments
- Require approval for production
- Audit deployment logs

## Maintenance

### Regular Tasks
- Update GitHub Actions versions
- Review and update security tools
- Monitor pipeline performance
- Update documentation

### Pipeline Updates
- Test changes in feature branch
- Use preview deployments
- Monitor impact on build times
- Update team on changes

## Support

### Documentation
- This document
- GitHub Actions documentation
- Vercel documentation
- Docker documentation

### Contacts
- DevOps team for pipeline issues
- Security team for vulnerabilities
- Platform team for deployment issues

## Appendix

### Useful Commands

```bash
# Trigger pipeline manually
gh workflow run ci-cd.yml

# View pipeline status
gh run list

# View specific run
gh run view <run-id>

# Cancel running pipeline
gh run cancel <run-id>

# Re-run failed jobs
gh run rerun <run-id>

# View deployment status
vercel ls

# Rollback deployment
vercel rollback <deployment-url>
```

### Configuration Files

- `.github/workflows/ci-cd.yml` - Main pipeline configuration
- `Dockerfile` - Docker image definition
- `docker-compose.yml` - Local development setup
- `package.json` - Build scripts and dependencies

### External Links

- GitHub Actions: https://docs.github.com/en/actions
- Vercel: https://vercel.com/docs
- Docker: https://docs.docker.com
- Codecov: https://codecov.io/docs
- Snyk: https://snyk.io/docs
