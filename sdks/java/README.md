# Blueprint SDK for Java

## Installation

```xml
<dependency>
    <groupId>com.blueprint</groupId>
    <artifactId>blueprint-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Quick Start

```java
import com.blueprint.sdk.Blueprint;

public class Main {
    public static void main(String[] args) {
        Blueprint bp = new Blueprint();
        System.out.println(bp.hello());
    }
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
mvn package
```

## Testing

```bash
mvn test
```
