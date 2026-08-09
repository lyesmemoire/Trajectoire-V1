# E2E Test Suite - SPRINT-4.6

## Overview

Complete E2E test suite covering all routes, pipelines, and scenarios.

## Test Structure

### API Routes Tests
- `api/auth.e2e.test.ts` - Authentication endpoints
- `api/cv.e2e.test.ts` - CV upload and analysis
- `api/interview.e2e.test.ts` - Interview management
- `api/matching.e2e.test.ts` - CV-job matching
- `api/simulation.e2e.test.ts` - Interview simulation
- `api/stripe.e2e.test.ts` - Payment processing
- `api/health.e2e.test.ts` - Health checks
- `api/knowledge.e2e.test.ts` - Knowledge graph operations

### Pipeline Tests
- `pipelines/matching-pipeline.e2e.test.ts` - Complete matching flow
- `pipelines/interview-pipeline.e2e.test.ts` - Interview lifecycle
- `pipelines/search-pipeline.e2e.test.ts` - Search functionality
- `pipelines/report-pipeline.e2e.test.ts` - Report generation

### Scenario Tests
- `scenarios/user-journey.e2e.test.ts` - Complete user journeys

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run with UI
```bash
npm run test:e2e:ui
```

### Run with headed browser
```bash
npm run test:e2e:headed
```

### Auto-fix and retry
```bash
npm run test:e2e:fix
```

## Test Coverage

- ✅ All API routes
- ✅ All major pipelines
- ✅ Key user scenarios
- ✅ Error handling
- ✅ Auth flows
- ✅ Payment flows

## Environment Variables

Set `E2E_BASE_URL` to override default (default: http://localhost:3000)

```bash
E2E_BASE_URL=http://localhost:3000 npm run test:e2e
```