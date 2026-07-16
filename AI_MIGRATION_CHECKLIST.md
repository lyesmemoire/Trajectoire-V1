# AI Migration Checklist

## Overview

This checklist must be completed for every AI domain migration to ensure quality, security, and consistency with the AI Domain Standard.

**Status**: Official Checklist  
**Version**: 1.0  
**Reference**: AI_DOMAIN_STANDARD.md  

---

## Pre-Migration Checklist

### Planning

- [ ] **Domain Audit**: Analyze current architecture and dependencies
- [ ] **Complexity Assessment**: Estimate effort and risk
- [ ] **Dependency Analysis**: Identify external dependencies
- [ ] **Migration Plan**: Create detailed migration plan
- [ ] **Risk Assessment**: Identify and document risks
- [ ] **Rollback Plan**: Create rollback strategy

### Preparation

- [ ] **Template Review**: Review `lib/_templates/ai-domain/`
- [ ] **Reference Study**: Study Career Copilot and Interview implementations
- [ ] **ai-core Review**: Review available abstractions in `lib/ai-core/`
- [ ] **Standard Review**: Review AI_DOMAIN_STANDARD.md
- [ ] **Environment Setup**: Ensure development environment is ready

---

## Architecture Checklist

### Layer Structure

- [ ] **Domain Layer**: Created with contracts, ports, aggregates, value objects, policies
- [ ] **Application Layer**: Created with use cases, queries, contexts
- [ ] **Infrastructure Layer**: Created with adapters, builders, engines, providers, repositories
- [ ] **Composition Layer**: Created with factory
- [ ] **Presentation Layer**: Created with presenter, validators (if needed)

### Layer Responsibilities

- [ ] **Domain Layer**: No dependencies on infrastructure or application
- [ ] **Application Layer**: No dependencies on infrastructure
- [ ] **Infrastructure Layer**: No dependencies on application
- [ ] **Composition Layer**: Server-only protection
- [ ] **Presentation Layer**: No business logic

### Dependency Rules

- [ ] **Domain → Application**: Allowed
- [ ] **Application → Infrastructure**: Not allowed (use ports)
- [ ] **Infrastructure → Application**: Not allowed
- [ ] **UI → Infrastructure**: Not allowed (use route handler)
- [ ] **UI → AI Engines**: Not allowed (use useChat)

---

## Implementation Checklist

### Domain Layer

- [ ] **DTOs**: Defined in `domain/contracts/{domain}.dto.ts`
- [ ] **Errors**: Defined in `domain/contracts/{domain}.errors.ts` (extends ai-core)
- [ ] **Events**: Defined in `domain/contracts/{domain}.events.ts`
- [ ] **Ports**: Defined in `domain/ports/`
- [ ] **Aggregates**: Created if needed
- [ ] **Value Objects**: Created if needed
- [ ] **Policies**: Created if needed

### Application Layer

- [ ] **Use Cases**: Created in `application/use-cases/`
- [ ] **Queries**: Created if needed
- [ ] **Contexts**: Created if needed
- [ ] **Validation**: Implemented in use cases

### Infrastructure Layer

- [ ] **Adapters**: Created in `infrastructure/adapters/`
- [ ] **Builders**: Created in `infrastructure/builders/`
- [ ] **Engines**: Created in `infrastructure/engines/`
- [ ] **Providers**: Created in `infrastructure/providers/`
- [ ] **Repositories**: Created if needed
- [ ] **Mappers**: Created if needed

### Composition Layer

- [ ] **Factory**: Created in `composition/{domain}.factory.ts`
- [ ] **Server-Only**: Factory has `import "server-only"`
- [ ] **Dependency Injection**: All dependencies wired correctly

### Presentation Layer

- [ ] **Presenter**: Created if needed
- [ ] **Validators**: Created if needed
- [ ] **Schema Validation**: Input validation implemented

---

## Server-Only Checklist

### Protection

- [ ] **Factory**: `import "server-only"` at top
- [ ] **Stream Adapter**: `import "server-only"` at top
- [ ] **Context Builder**: `import "server-only"` at top
- [ ] **Engine**: `import "server-only"` at top
- [ ] **Provider**: `import "server-only"` at top

### Validation

- [ ] **Client Import Test**: Attempted client import (should fail)
- [ ] **Build Verification**: Build fails if client import attempted
- [ ] **No Client Compilation**: Infrastructure files not in client bundle

---

## Streaming Checklist

### Implementation

- [ ] **AsyncGenerator**: Use case returns `AsyncGenerator<DomainEvent, void, void>`
- [ ] **Text Deltas**: Yield `{ type: "TextDelta", text: string }`
- [ ] **Completion**: Yield `{ type: "Completed", output: DomainOutput }`
- [ ] **Errors**: Yield `{ type: "Error", error: DomainError }`

### Stream Adapter

- [ ] **Adapter Created**: `infrastructure/adapters/{domain}-stream.adapter.ts`
- [ ] **AI SDK Integration**: Uses `StreamAdapter` from ai-core
- [ ] **Event Conversion**: Converts domain events to AI SDK stream
- [ ] **Response**: Returns `Response` object

---

## Authentication Checklist

### Route Handler

- [ ] **User Authentication**: `getCurrentUser()` called in route handler
- [ ] **Unauthorized Check**: Returns 401 if user not authenticated
- [ ] **User ID Passed**: User ID passed to use case

### Authorization

- [ ] **Access Check**: Use case checks user access to resources
- [ ] **Error Handling**: Returns 403 if access denied

---

## Tests Checklist

### Unit Tests

- [ ] **Domain Layer Tests**: Tests for value objects, aggregates, policies
- [ ] **Use Case Tests**: Tests for use cases with mocked ports
- [ ] **Port Tests**: Tests for port implementations
- [ ] **Error Tests**: Tests for error handling

### Integration Tests

- [ ] **Route Handler Tests**: Tests for HTTP endpoints
- [ ] **Stream Tests**: Tests for streaming responses
- [ ] **Database Tests**: Tests for database operations
- [ ] **External API Tests**: Tests for external API calls

### Architecture Tests

- [ ] **Dependency Cruiser**: `pnpm exec depcruise lib/{domain} --include-only "^lib/{domain}"`
- [ ] **No Violations**: Zero dependency violations
- [ ] **Layer Isolation**: Each layer properly isolated

---

## Bundle Checklist

### Build

- [ ] **Build Command**: `pnpm build` executed
- [ ] **Build Success**: Build completes without errors
- [ ] **Bundle Analysis**: Bundle analyzed for size and content

### Verification

- [ ] **Bundle Size**: Domain-specific bundle < 50 kB
- [ ] **No AI Engines**: No AI engines in client bundle
- [ ] **No Prompts**: No prompts in client bundle
- [ ] **No Direct Providers**: No direct provider imports in UI
- [ ] **No Forbidden Imports**: No imports from `core/intelligence` or `core/prompts`

---

## Build Checklist

### Lint

- [ ] **Lint Command**: `pnpm lint` executed
- [ ] **No Errors**: Zero lint errors
- [ ] **Warnings Acceptable**: Lint warnings acceptable or fixed

### Type Check

- [ ] **Type Check Command**: `pnpm type-check` executed
- [ ] **No Errors**: Zero TypeScript errors

### Tests

- [ ] **Test Command**: `pnpm test` executed
- [ ] **All Pass**: All tests pass
- [ ] **Coverage**: Acceptable test coverage

### Architecture Test

- [ ] **Architecture Command**: `pnpm test:architecture` executed
- [ ] **Domain-Specific**: Domain-specific architecture test passes
- [ ] **No Violations**: Zero architecture violations

### Build

- [ ] **Build Command**: `pnpm build` executed
- [ ] **Success**: Build completes successfully

---

## Documentation Checklist

### Code Documentation

- [ ] **Comments**: Complex logic documented
- [ ] **JSDoc**: Public functions documented
- [ ] **Examples**: Usage examples provided

### Migration Documentation

- [ ] **Migration Report**: Created migration report
- [ ] **Changes Documented**: All changes documented
- [ ] **Decisions Documented**: Architectural decisions documented

### README

- [ ] **Domain README**: Created or updated
- [ ] **Usage Instructions**: Usage instructions provided
- [ ] **Architecture Overview**: Architecture overview provided

---

## CI Checklist

### Pipeline

- [ ] **CI Config**: CI configuration updated if needed
- [ ] **All Checks Pass**: All CI checks pass
- [ ] **Build Artifacts**: Build artifacts generated correctly

### Deployment

- [ ] **Deployment Plan**: Deployment plan created
- [ ] **Rollback Plan**: Rollback plan tested
- [ ] **Monitoring**: Monitoring configured

---

## Post-Migration Checklist

### Validation

- [ ] **Manual Testing**: Manual testing completed
- [ ] **User Acceptance**: User acceptance testing completed
- [ ] **Performance**: Performance acceptable
- [ ] **Security**: Security review completed

### Monitoring

- [ ] **Error Tracking**: Error tracking configured
- [ ] **Performance Monitoring**: Performance monitoring configured
- [ ] **Bundle Monitoring**: Bundle size monitoring configured

### Cleanup

- [ ] **Legacy Code**: Legacy code removed or marked for removal
- [ ] **Unused Files**: Unused files removed
- [ ] **Imports Cleaned**: Unused imports removed

---

## Sign-Off

### Developer

- [ ] **Self-Review**: Self-review completed
- [ ] **Checklist Complete**: All checklist items completed
- [ ] **Ready for Review**: Ready for code review

### Reviewer

- [ ] **Code Review**: Code review completed
- [ ] **Architecture Review**: Architecture review completed
- [ ] **Security Review**: Security review completed
- [ ] **Approved**: Migration approved

### QA

- [ ] **Testing**: Testing completed
- [ ] **Acceptance**: QA acceptance completed
- [ ] **Approved**: Migration approved for deployment

---

## Common Issues

### Architecture Violations

**Issue**: Dependency cruiser reports violations  
**Solution**: Check layer dependencies, ensure no reverse dependencies

### Bundle Size

**Issue**: Bundle size exceeds 50 kB  
**Solution**: Check for AI engines, prompts, or large dependencies

### Server-Only Failure

**Issue**: Server-only protection not working  
**Solution**: Ensure `import "server-only"` at top of infrastructure files

### Test Failures

**Issue**: Tests failing  
**Solution**: Check mocks, ensure ports are properly mocked

### Build Errors

**Issue**: Build fails  
**Solution**: Check TypeScript errors, fix import paths

---

## References

- **AI Domain Standard**: `AI_DOMAIN_STANDARD.md`
- **Template**: `lib/_templates/ai-domain/`
- **Reference Implementations**: `lib/career-copilot/`, `lib/interview/`
- **AI Core**: `lib/ai-core/`
- **Roadmap**: `AI_PLATFORM_ROADMAP.md`

---

## Conclusion

This checklist ensures that every AI domain migration meets the quality standards defined in the AI Domain Standard. Complete all items before considering a migration complete.

**Remember**: Quality over speed. It's better to take extra time to ensure correctness than to rush and introduce technical debt.
