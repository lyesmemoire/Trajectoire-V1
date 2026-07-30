# Blueprint CLI Command Reference

Complete documentation for all Blueprint CLI commands including usage, description, arguments, options, examples, and exit codes.

---

## Global Options

| Option | Description |
|--------|-------------|
| `-h, --help` | Display help information |
| `-v, --version` | Display version number |
| `--config <path>` | Path to configuration file |
| `--verbose` | Enable verbose output |
| `--quiet` | Suppress non-error output |

---

## init

**Description:** Initialize a new Blueprint project with directory structure and configuration files.

**Usage:**
```bash
blueprint init [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--name <name>` | Project name | blueprint-project |
| `--template <template>` | Template to use | default |
| `--directory <path>` | Output directory | ./ |
| `--force` | Force overwrite existing directory | false |

**Examples:**
```bash
# Initialize with default settings
blueprint init

# Initialize with custom name
blueprint init --name my-project

# Initialize in specific directory
blueprint init --directory ./my-project

# Force overwrite existing directory
blueprint init --force
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Directory already exists (use --force to overwrite) |
| 2 | Invalid project name |
| 3 | Permission denied |

**Output Structure:**
```
my-project/
├── src/
│   ├── contracts/
│   ├── modules/
│   └── index.ts
├── tests/
├── artifacts/
├── config/
├── blueprint.config.json
└── README.md
```

---

## compile

**Description:** Compile Blueprint DSL source files to bytecode packages.

**Usage:**
```bash
blueprint compile [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--input <path>` | Input Blueprint file path | required |
| `--output <path>` | Output bytecode file path | <input>.bpp |
| `--optimize` | Enable optimizations | false |
| `--emit-ir` | Emit intermediate representation | false |
| `--emit-bytecode` | Emit bytecode (default) | true |
| `--emit-package` | Emit package format | false |
| `--target <platform>` | Target platform | cvm-v3 |

**Examples:**
```bash
# Compile with default settings
blueprint compile --input src/contracts/SampleContract.bp

# Compile with optimizations
blueprint compile --input src/contracts/SampleContract.bp --optimize

# Compile and emit IR
blueprint compile --input src/contracts/SampleContract.bp --emit-ir

# Compile to specific output
blueprint compile --input src/contracts/SampleContract.bp --output artifacts/SampleContract.bpp
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Input file not found |
| 2 | Compilation error |
| 3 | Invalid target platform |
| 4 | Permission denied |

---

## build

**Description:** Build a Blueprint package from source directory.

**Usage:**
```bash
blueprint build [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--input <path>` | Input source directory | ./src |
| `--output <path>` | Output directory | ./artifacts |
| `--watch` | Watch for changes and rebuild | false |
| `--optimize` | Enable optimizations | false |

**Examples:**
```bash
# Build from default src directory
blueprint build

# Build from custom directory
blueprint build --input ./contracts

# Build with optimizations
blueprint build --optimize

# Watch mode for development
blueprint build --watch
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Input directory not found |
| 2 | Build error |
| 3 | No Blueprint files found |
| 4 | Permission denied |

---

## run

**Description:** Execute a compiled Blueprint package.

**Usage:**
```bash
blueprint run [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--package <path>` | Package file path | required |
| `--entry <name>` | Entry point name | main |
| `--debug` | Enable debug mode | false |
| `--args <args...>` | Arguments to pass to program | [] |

**Examples:**
```bash
# Run a package
blueprint run --package artifacts/SampleContract.bpp

# Run with custom entry point
blueprint run --package artifacts/SampleContract.bpp --entry custom

# Run in debug mode
blueprint run --package artifacts/SampleContract.bpp --debug

# Run with arguments
blueprint run --package artifacts/SampleContract.bpp --args arg1 arg2
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Package file not found |
| 2 | Execution error |
| 3 | Entry point not found |
| 4 | Permission denied |

---

## graph

**Description:** Generate dependency graphs and visualizations.

**Usage:**
```bash
blueprint graph [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--type <type>` | Graph type (dependency, call, dataflow) | dependency |
| `--format <format>` | Output format (json, dot, mermaid) | json |
| `--output <path>` | Output file path | graph.<format> |
| `--filter <pattern>` | Filter nodes by pattern | * |

**Examples:**
```bash
# Generate dependency graph in JSON
blueprint graph --type dependency --format json

# Generate call graph in DOT format
blueprint graph --type call --format dot

# Generate dataflow graph in Mermaid
blueprint graph --type dataflow --format mermaid

# Filter specific modules
blueprint graph --filter "src/modules/*"
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Invalid graph type |
| 2 | Invalid format |
| 3 | No matching nodes |
| 4 | Permission denied |

---

## trace

**Description:** Enable runtime tracing and event collection.

**Usage:**
```bash
blueprint trace [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output trace file | trace.json |
| `--format <format>` | Output format (json, binary) | json |
| `--filter <pattern>` | Event filter pattern | * |
| `--duration <ms>` | Trace duration in milliseconds | 1000 |

**Examples:**
```bash
# Trace for default duration
blueprint trace

# Trace for specific duration
blueprint trace --duration 5000

# Trace with custom output
blueprint trace --output my-trace.json

# Filter specific events
blueprint trace --filter "execution:*"
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Runtime error |
| 2 | Invalid duration |
| 3 | Permission denied |

---

## debug

**Description:** Attach debugger to a running Blueprint process.

**Usage:**
```bash
blueprint debug [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--port <port>` | Debug port | 9229 |
| `--host <host>` | Debug host | localhost |
| `--breakpoints <path>` | Breakpoints file | breakpoints.json |
| `--attach` | Attach to existing process | false |

**Examples:**
```bash
# Start debugger with default settings
blueprint debug

# Start debugger on custom port
blueprint debug --port 9230

# Attach to existing process
blueprint debug --attach

# Load breakpoints from file
blueprint debug --breakpoints my-breakpoints.json
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Port already in use |
| 2 | Connection failed |
| 3 | Invalid breakpoints file |

---

## benchmark

**Description:** Run performance benchmarks and generate reports.

**Usage:**
```bash
blueprint benchmark [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output report file | benchmark-report.json |
| `--filter <pattern>` | Benchmark filter pattern | * |
| `--iterations <n>` | Number of iterations | 100 |
| `--warmup <n>` | Warmup iterations | 10 |

**Examples:**
```bash
# Run all benchmarks
blueprint benchmark

# Run with custom iterations
blueprint benchmark --iterations 1000

# Run specific benchmarks
blueprint benchmark --filter "compiler:*"

# Custom warmup
blueprint benchmark --warmup 20
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Benchmark error |
| 2 | Invalid iteration count |

**Report Format:**
```json
{
  "timestamp": "2025-01-25T00:00:00Z",
  "iterations": 100,
  "warmup": 10,
  "results": [
    {
      "name": "Compiler",
      "duration": 5000,
      "avgMs": 50.0,
      "opsPerSec": 20.0,
      "statistics": {
        "min": 45.0,
        "max": 55.0,
        "mean": 50.0,
        "median": 50.0,
        "p95": 54.0,
        "p99": 54.8,
        "stdDev": 2.5
      }
    }
  ]
}
```

---

## doctor

**Description:** Check system health and configuration.

**Usage:**
```bash
blueprint doctor [options]
```

**Arguments:** None

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output report file | doctor-report.json |
| `--fix` | Auto-fix issues | false |
| `--check <items...>` | Specific checks to run | all |

**Examples:**
```bash
# Run all health checks
blueprint doctor

# Auto-fix issues
blueprint doctor --fix

# Run specific checks
blueprint doctor --check node version dependencies

# Save report to file
blueprint doctor --output my-report.json
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success (all checks passed) |
| 1 | Some checks failed |
| 2 | Critical issues found |

**Health Checks:**
- Node.js version compatibility
- Dependency integrity
- Configuration validity
- File permissions
- Disk space
- Network connectivity

---

## completion

**Description:** Generate shell completion scripts.

**Usage:**
```bash
blueprint completion [shell]
```

**Arguments:**
| Argument | Description |
|----------|-------------|
| `shell` | Shell type (bash, zsh, fish, powershell) |

**Examples:**
```bash
# Generate bash completion
blueprint completion bash > ~/.bashrc
source ~/.bashrc

# Generate zsh completion
blueprint completion zsh > ~/.zshrc
source ~/.zshrc

# Generate fish completion
blueprint completion fish > ~/.config/fish/completions/blueprint.fish

# Generate PowerShell completion
blueprint completion powershell > $PROFILE
. $PROFILE
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Unsupported shell |

---

## Configuration

**Configuration Files:**
- `blueprint.config.json` - JSON configuration
- `blueprint.config.yaml` - YAML configuration
- `blueprint.config.yml` - YAML configuration (alternative)
- `.blueprintrc` - JSON configuration (hidden)
- `.blueprintrc.json` - JSON configuration (hidden)

**Environment Variables:**
- `BLUEPRINT_TARGET` - Compilation target
- `BLUEPRINT_OPTIMIZE` - Enable optimizations (true/false)
- `BLUEPRINT_OUTPUT_DIR` - Output directory
- `BLUEPRINT_DEBUG` - Debug mode (true/false)

**Example Configuration (JSON):**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "compiler": {
    "target": "cvm-v3",
    "optimize": true,
    "emitIR": false
  },
  "runtime": {
    "debug": false,
    "trace": false
  },
  "output": {
    "directory": "./artifacts",
    "format": "binary"
  }
}
```

**Example Configuration (YAML):**
```yaml
name: my-project
version: 1.0.0
compiler:
  target: cvm-v3
  optimize: true
  emitIR: false
runtime:
  debug: false
  trace: false
output:
  directory: ./artifacts
  format: binary
```

---

## Common Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid input/arguments |
| 3 | File not found |
| 4 | Permission denied |
| 5 | Network error |
| 10 | Runtime error |
| 20 | Compilation error |
| 30 | Test failure |

---

## Troubleshooting

**CLI not found:**
```bash
# Reinstall the package
npm install -g blueprint
# or
pnpm add -g blueprint
```

**Permission denied:**
```bash
# Check file permissions
ls -la bin/blueprint
# Make executable
chmod +x bin/blueprint
```

**Node version incompatible:**
```bash
# Check Node version
node --version
# Use nvm to switch versions
nvm use 18
```

**Configuration not loading:**
```bash
# Check config file exists
ls -la blueprint.config.json
# Validate JSON syntax
cat blueprint.config.json | jq .
```

---

**Generated:** 2025-01-25  
**CLI Version:** 1.0.0  
**Blueprint Version:** 3.0.0
