# Blueprint SDK for C#

## Installation

```bash
dotnet add package Blueprint.Sdk
```

## Quick Start

```csharp
using Blueprint.Sdk;

var bp = new Blueprint();
Console.WriteLine(bp.Hello());
```

## API

### Blueprint

#### Blueprint()
Create a new Blueprint instance.

#### Hello() -> string
Returns a greeting message.

#### GetVersion() -> string
Returns the SDK version.

## Building

```bash
dotnet build
```

## Testing

```bash
dotnet test
```
