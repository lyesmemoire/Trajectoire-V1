package blueprint

// Blueprint represents the Blueprint SDK
type Blueprint struct {
    version string
}

// New creates a new Blueprint instance
func New() *Blueprint {
    return &Blueprint{
        version: "1.0.0",
    }
}

// Hello returns a greeting message
func (b *Blueprint) Hello() string {
    return "Hello from Blueprint SDK!"
}

// Version returns the SDK version
func (b *Blueprint) Version() string {
    return b.version
}
