package main

import (
    "fmt"
    "github.com/blueprint/sdk"
)

func main() {
    bp := blueprint.New()
    fmt.Println(bp.Hello())
    fmt.Printf("SDK Version: %s\n", bp.Version())
}
