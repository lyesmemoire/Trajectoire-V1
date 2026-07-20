# Trajectoire - Clean Architecture Diagram

## Overview
This document illustrates the Clean Architecture implementation for the Trajectoire backend application.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                        │
│                         (API Controllers)                          │
├─────────────────────────────────────────────────────────────────┤
│  /api/simulation/create  │  /api/simulation/message             │
│  /api/simulation/end     │  /api/report/generate                │
│  /api/account/delete      │  /api/account/export                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer (Services)                  │
├─────────────────────────────────────────────────────────────────┤
│  SimulationService      │  ConversationService                   │
│  ReportService          │  AccountService                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Domain Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Entities      │  │  Value Objects  │  │   Validators     │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ Session         │  │ QuotaLimits     │  │ SessionValidator │  │
│  │ Message         │  │ RateLimitRules  │  │ MessageValidator│  │
│  │ Report          │  │                 │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Repositories  │  │  DI Container   │  │  Implementations│  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ SessionRepository│  │ Container       │  │ OpenAIProvider  │  │
│  │ MessageRepository│  │ bootstrap       │  │ SecureLogger    │  │
│  │ ReportRepository │  │                 │  │ RateLimiter     │  │
│  │ ProfileRepository│  │                 │  │ QuotaService    │  │
│  └─────────────────┘  └─────────────────┘  │ AuditService    │  │
│                                          └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                            │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (Database & Auth)  │  OpenAI (AI Provider)              │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
Controllers → Services → Domain ← Repositories ← Infrastructure
```

**Key Principle**: Dependencies point inward. The Domain layer has no dependencies on outer layers.

## Core Components

### 1. Core Layer (`src/core/`)

**Interfaces** (`src/core/interfaces/`)
- `IAIProvider` - AI operations contract
- `IRepository` - Generic repository contract
- `ILogger` - Logging contract
- `IRateLimiter` - Rate limiting contract
- `IQuotaService` - Quota management contract
- `IAuditService` - Audit logging contract

**Errors** (`src/core/errors/`)
- `AppError` - Base error class
- `ValidationError` - Input validation errors
- `AIError` - AI operation errors
- `QuotaError` - Quota exceeded errors
- `AuthenticationError` - Auth failures
- `AuthorizationError` - Permission failures

**HTTP Helpers** (`src/core/http/`)
- `ApiResponseBuilder` - Standardized API responses
- `ErrorHandler` - Global error handling

### 2. Domain Layer (`src/domain/`)

**Entities** (`src/domain/entities/`)
- `Session` - Interview session with business logic
- `Message` - Conversation message with validation
- `Report` - Interview report with scoring logic

**Value Objects** (`src/domain/valueObjects/`)
- `QuotaLimits` - Quota rules and limits
- `RateLimitRules` - Rate limiting rules

**Validators** (`src/domain/validators/`)
- `SessionValidator` - Session input validation
- `MessageValidator` - Message input validation

### 3. Application Layer (`src/application/services/`)

**Services**
- `SimulationService` - Session lifecycle management
- `ConversationService` - Message handling and AI responses
- `ReportService` - Report generation
- `AccountService` - Account management

### 4. Infrastructure Layer (`src/infrastructure/`)

**Repositories** (`src/infrastructure/repositories/`)
- `SessionRepository` - Supabase session data access
- `MessageRepository` - Supabase message data access
- `ReportRepository` - Supabase report data access
- `ProfileRepository` - Supabase profile data access

**DI Container** (`src/infrastructure/di/`)
- `Container` - Lightweight dependency injection
- `bootstrap` - Service registration
- `implementations` - Concrete implementations of interfaces

## Data Flow Example: Creating a Session

```
1. POST /api/simulation/create
   ↓
2. Controller authenticates user
   ↓
3. Controller resolves SimulationService from DI container
   ↓
4. SimulationService validates input using SessionValidator
   ↓
5. SimulationService checks rate limit via IRateLimiter
   ↓
6. SimulationService checks quota via IQuotaService
   ↓
7. SimulationService creates Session entity
   ↓
8. SessionRepository persists session to Supabase
   ↓
9. SimulationService increments quota
   ↓
10. AuditService logs the action
    ↓
11. Controller returns standardized API response
```

## Key Design Patterns

1. **Dependency Inversion**: High-level modules depend on abstractions (interfaces)
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic encapsulation
4. **Domain-Driven Design**: Rich domain models with behavior
5. **Dependency Injection**: Loose coupling and testability
6. **Value Objects**: Immutable domain concepts
7. **Command Pattern**: Service methods as commands

## Benefits of This Architecture

- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to swap implementations
- **Flexibility**: Business logic independent of frameworks
- **Type Safety**: Strong TypeScript typing throughout
- **Error Handling**: Unified error management
- **Observability**: Centralized logging and auditing

## File Structure

```
src/
├── core/
│   ├── interfaces/          # Core contracts
│   ├── errors/              # Error classes
│   └── http/                # HTTP helpers
├── domain/
│   ├── entities/            # Domain entities
│   ├── valueObjects/         # Value objects
│   └── validators/          # Input validators
├── application/
│   └── services/            # Application services
├── infrastructure/
│   ├── repositories/        # Data access
│   └── di/                  # Dependency injection
└── app/api/                 # API controllers
```

## Migration Summary

The refactoring successfully transformed the Trajectoire backend from a monolithic structure to a Clean Architecture Enterprise level with:

- ✅ No functional regressions
- ✅ No UI modifications
- ✅ No public route changes
- ✅ TypeScript build success
- ✅ All business logic in Services layer
- ✅ All data access in Repository layer
- ✅ Domain validation in Domain layer
- ✅ Dependency Injection implementation
- ✅ Unified error handling
- ✅ Standardized API responses
- ✅ Dead code removed
