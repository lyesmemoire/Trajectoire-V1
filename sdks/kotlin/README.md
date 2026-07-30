# Blueprint SDK for Kotlin

## Installation

```gradle
implementation("com.blueprint:blueprint-sdk:1.0.0")
```

## Quick Start

```kotlin
import com.blueprint.sdk.Blueprint

fun main() {
    val bp = Blueprint()
    println(bp.hello())
}
```

## API

### Blueprint

#### Blueprint()
Create a new Blueprint instance.

#### hello() -> String
Returns a greeting message.

#### getVersion() -> String
Returns the SDK version.

## Building

```bash
gradle build
```

## Testing

```bash
gradle test
```
