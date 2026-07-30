# Blueprint SDK for Go

## Installation

```bash
go get github.com/blueprint/sdk
```

## Quick Start

```go
package main

import (
    "fmt"
    "github.com/blueprint/sdk"
)

func main() {
    bp := blueprint.New()
    fmt.Println(bp.Hello())
}
```

## API

### Blueprint

#### New() *Blueprint
Create a new Blueprint instance.

#### Hello() string
Returns a greeting message.

#### Version() string
Returns the SDK version.

## Building

```bash
go build
```

## Testing

```bash
go test
```
