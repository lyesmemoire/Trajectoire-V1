# Blueprint SDK for Rust

## Installation

```toml
[dependencies]
blueprint-sdk = "1.0.0"
```

## Quick Start

```rust
use blueprint_sdk::Blueprint;

fn main() {
    let bp = Blueprint::new();
    println!("{}", bp.hello());
}
```

## API

### Blueprint

#### new()
Create a new Blueprint instance.

#### hello() -> String
Returns a greeting message.

#### version() -> &str
Returns the SDK version.

## Building

```bash
cargo build
```

## Testing

```bash
cargo test
```
