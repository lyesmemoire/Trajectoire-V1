# Blueprint SDK for TypeScript

## Installation

```bash
pnpm add @blueprint/sdk
```

## Quick Start

```typescript
import { Blueprint } from '@blueprint/sdk';

const bp = new Blueprint();
const message = await bp.hello();
console.log(message);
```

## API

### Blueprint

#### constructor()
Create a new Blueprint instance.

#### hello(): Promise<string>
Returns a greeting message.

#### getVersion(): string
Returns the SDK version.

## Building

```bash
pnpm build
```

## Testing

```bash
pnpm test
```
