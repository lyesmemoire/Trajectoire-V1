# AI Domain Standard

## Overview

This document defines the official standard for AI domains in Trajectoire. It establishes the architecture, responsibilities, and implementation patterns that all AI domains must follow.

**Status**: ✅ OFFICIAL STANDARD  
**Version**: 1.0  
**Reference Implementations**: Career Copilot, Interview  

---

## Architecture

### Layered Architecture

All AI domains must follow a clean, layered architecture:

```
UI Layer (Client)
  ↓ useChat (Vercel AI SDK)
Route Handler (HTTP Boundary)
  ↓ Factory (Composition)
Use Case (Application)
  ↓ Ports (Domain)
Infrastructure (Server)
  ↓ Provider (LLM)
External Service
```

### Layers

#### 1. Domain Layer
**Purpose**: Core business logic, pure functions, no external dependencies

**Components**:
- **Contracts**: DTOs, errors, events
- **Ports**: Interfaces for external dependencies
- **Aggregates**: Domain aggregates (if needed)
- **Value Objects**: Value objects (if needed)
- **Policies**: Business rules (if needed)

**Rules**:
- No dependencies on infrastructure
- No dependencies on application layer
- Pure functions where possible
- Business rules encapsulated in policies

#### 2. Application Layer
**Purpose**: Orchestrate use cases, coordinate domain objects

**Components**:
- **Use Cases**: Business operations
- **Queries**: Read operations (if needed)
- **Contexts**: Application contexts (if needed)

**Rules**:
- Depends only on domain layer
- No direct infrastructure dependencies
- Uses ports for external dependencies
- Orchestrates domain objects

#### 3. Infrastructure Layer
**Purpose**: Implement ports, handle external dependencies

**Components**:
- **Engines**: AI engine implementations
- **Providers**: LLM provider implementations
- **Repositories**: Data repositories (if needed)
- **Builders**: Context builders
- **Adapters**: Stream adapters
- **Mappers**: Data mappers (if needed)

**Rules**:
- Implements domain ports
- Server-only protection
- No dependencies on application layer
- Can depend on external services

#### 4. Composition Layer
**Purpose**: Dependency injection, object construction

**Components**:
- **Factory**: Object construction

**Rules**:
- Server-only protection
- Constructs object graph
- Wires dependencies

#### 5. Presentation Layer
**Purpose**: API contracts, validation, serialization

**Components**:
- **Presenter**: API contracts (if needed)
- **Validators**: Input validation (if needed)

**Rules**:
- Validates input/output
- Serializes domain objects
- No business logic

---

## Responsibilities

### Domain Layer
- Define business entities and value objects
- Define business rules and policies
- Define ports for external dependencies
- Define error types
- Define domain events

### Application Layer
- Orchestrate business operations
- Coordinate domain objects
- Validate business rules
- Handle errors

### Infrastructure Layer
- Implement ports
- Handle external service calls
- Build context from data sources
- Adapt streams to HTTP responses

### Composition Layer
- Wire dependencies
- Create object graph
- Provide factory functions

### Presentation Layer
- Validate input
- Serialize output
- Handle HTTP errors

---

## Data Flow

### Request Flow

```
1. User sends message in UI
2. useChat hook sends POST to /api/{domain}/chat
3. Route handler validates input
4. Route handler creates use case via factory
5. Use case validates business rules
6. Use case loads context via context builder
7. Use case calls engine via port
8. Engine calls provider via port
9. Provider calls LLM (Mistral)
10. Response streamed back through adapter
11. Route handler returns streaming response
12. useChat receives stream
13. UI updates with streaming response
```

### State Management

- **Session State**: Stored in database (Supabase/Prisma)
- **Conversation State**: Managed by useChat hook (client-side)
- **Domain State**: Managed by domain aggregates (server-side)

---

## Rules

### Server-Only Protection

All infrastructure and composition files must include:

```typescript
import "server-only";
```

**Protected Files**:
- `composition/{domain}.factory.ts`
- `infrastructure/adapters/{domain}-stream.adapter.ts`
- `infrastructure/builders/supabase-{domain}-context.builder.ts`
- `infrastructure/engines/{domain}.engine.ts`
- `infrastructure/providers/mistral-{domain}.provider.ts`

### Dependency Rules

- **Domain Layer**: No dependencies on infrastructure or application
- **Application Layer**: No dependencies on infrastructure
- **Infrastructure Layer**: No dependencies on application
- **Composition Layer**: Server-only only
- **UI Layer**: No direct AI imports, use useChat only

### Import Restrictions

**Forbidden**:
- No imports from `core/intelligence` in UI
- No imports from `core/prompts` in UI
- No direct AI engine imports in UI
- No direct provider imports in UI

**Allowed**:
- UI → useChat (Vercel AI SDK)
- UI → Route Handler (HTTP)
- Route Handler → Factory
- Factory → Use Case
- Use Case → Ports
- Infrastructure → Ports (implementation)

---

## Streaming

### Streaming Pattern

All AI domains must use streaming for responses:

```typescript
async *execute(
  userId: string,
  input: DomainInput,
): AsyncGenerator<DomainEvent, void, void> {
  // Stream text deltas
  yield { type: "TextDelta", text: "Hello" };
  
  // Emit completion
  yield { type: "Completed", output: DomainOutput };
}
```

### Stream Adapter

Use the standard stream adapter from `ai-core`:

```typescript
import { StreamAdapter } from "@/lib/ai-core/adapters/stream.adapter";

export class DomainStreamAdapter {
  static toResponse(events: AsyncGenerator<DomainEvent, void, void>): Response {
    // Convert domain events to AI SDK stream
  }
}
```

---

## Authentication

### User Authentication

All route handlers must authenticate users:

```typescript
export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const useCase = createDomainUseCase();
  const events = useCase.execute(user.id, input);
  
  return DomainStreamAdapter.toResponse(events);
}
```

### Authorization

Use cases should check authorization:

```typescript
async *execute(userId: string, input: DomainInput) {
  // Check if user has access to the resource
  if (!await this.canAccess(userId, input.sessionId)) {
    throw new ValidationError("Access denied");
  }
}
```

---

## Tests

### Unit Tests

Test domain logic in isolation:

```typescript
describe("DomainUseCase", () => {
  it("should validate input", () => {
    const useCase = new DomainUseCase(mockContextBuilder, mockEngine);
    expect(() => useCase.execute("user-id", invalidInput)).toThrow(ValidationError);
  });
});
```

### Integration Tests

Test the full flow:

```typescript
describe("Domain Route", () => {
  it("should stream response", async () => {
    const response = await fetch("/api/domain/chat", {
      method: "POST",
      body: JSON.stringify({ sessionId, message, history }),
    });
    
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
```

### Architecture Tests

Use dependency-cruiser to verify architecture:

```bash
pnpm exec depcruise lib/{domain} --include-only "^lib/{domain}"
```

---

## Bundle

### Bundle Size

Target bundle size for domain-specific UI:

- **Target**: < 20 kB
- **Maximum**: 50 kB

### Verification

Run bundle analysis:

```bash
pnpm build
pnpm analyze
```

Check for:
- No AI engines in client bundle
- No prompts in client bundle
- No direct provider imports

---

## CI

### Build Pipeline

All AI domains must pass:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm test:architecture
pnpm build
```

### Architecture Test

Verify no dependency violations:

```bash
pnpm test:architecture
```

### Bundle Test

Verify bundle size:

```bash
pnpm build
pnpm analyze
```

---

## AI Core

### Common Abstractions

Use `lib/ai-core` for common abstractions:

```typescript
import { DomainError, ValidationError, ProviderError } from "@/lib/ai-core/errors/domain-error";
import { LLMProviderPort } from "@/lib/ai-core/ports/llm-provider.port";
import { StreamAdapter } from "@/lib/ai-core/adapters/stream.adapter";
```

### Rule of Three

Only extract to `ai-core` when used in 3+ domains.

Currently in `ai-core`:
- Error classes (DomainError, ValidationError, ProviderError)
- LLM Provider Port (LLMProviderPort)
- Stream Adapter (StreamAdapter)

---

## Template

### Quick Start

Use the template at `lib/_templates/ai-domain/`:

```bash
cp -r lib/_templates/ai-domain lib/{domain}
```

Replace placeholders:
- `Domain` → `{Domain}` (PascalCase)
- `domain` → `{domain}` (kebab-case)

### Structure

```
lib/{domain}/
├── application/
│   ├── use-cases/
│   │   └── {domain}-conversation.use-case.ts
│   └── contexts/
├── domain/
│   ├── contracts/
│   │   ├── {domain}.dto.ts
│   │   ├── {domain}.errors.ts
│   │   └── {domain}.events.ts
│   ├── ports/
│   │   ├── {domain}-context-builder.port.ts
│   │   ├── {domain}-engine.port.ts
│   │   └── llm-provider.port.ts (import from ai-core)
│   ├── aggregates/
│   ├── value-objects/
│   └── policies/
├── infrastructure/
│   ├── adapters/
│   │   └── {domain}-stream.adapter.ts
│   ├── builders/
│   │   └── supabase-{domain}-context.builder.ts
│   ├── engines/
│   │   └── {domain}.engine.ts
│   ├── providers/
│   │   └── mistral-{domain}.provider.ts
│   └── repositories/
├── composition/
│   └── {domain}.factory.ts
├── presentation/
│   ├── {domain}.presenter.ts
│   └── validators/
└── index.ts
```

---

## Examples

### Reference Implementations

- **Career Copilot**: `lib/career-copilot/`
- **Interview**: `lib/interview/`

### Route Handler

```typescript
// app/api/{domain}/chat/route.ts
import { createDomainUseCase } from "@/lib/{domain}/composition/{domain}.factory";
import { DomainStreamAdapter } from "@/lib/{domain}/infrastructure/adapters/{domain}-stream.adapter";

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const useCase = createDomainUseCase();
  const events = useCase.execute(user.id, body);
  
  return DomainStreamAdapter.toResponse(events);
}
```

### Client Hook

```typescript
// app/(app)/dashboard/{domain}/hooks/use{Domain}Chat.ts
import { useChat } from "ai";

export function use{Domain}Chat(config: {Domain}Config) {
  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/{domain}/chat",
      body: { sessionId, ... },
    }),
    [config],
  );
  
  return useChat({ transport });
}
```

---

## Checklist

Before releasing a new AI domain:

- [ ] Architecture follows layered pattern
- [ ] Server-only protection on infrastructure
- [ ] No forbidden imports in UI
- [ ] Streaming implementation
- [ ] Authentication in route handler
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Architecture tests pass
- [ ] Bundle size < 50 kB
- [ ] Build pipeline passes
- [ ] Documentation updated

---

## Conclusion

This standard ensures consistency across all AI domains in Trajectoire. By following this standard, we maintain:

- **Security**: Server-only isolation prevents AI leaks
- **Performance**: Small bundle sizes improve load times
- **Maintainability**: Consistent architecture reduces complexity
- **Testability**: Layered architecture enables easy testing
- **Scalability**: Standard pattern enables rapid domain creation

**Reference Implementations**: Career Copilot, Interview  
**Template**: `lib/_templates/ai-domain/`  
**Common Abstractions**: `lib/ai-core/`
