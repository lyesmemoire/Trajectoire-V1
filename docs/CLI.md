# Blueprint V3 Enterprise CLI Documentation

**Version:** 1.0.0  
**Date:** 2025-01-25  

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [init](#init)
  - [compile](#compile)
  - [build](#build)
  - [run](#run)
  - [graph](#graph)
  - [trace](#trace)
  - [debug](#debug)
  - [benchmark](#benchmark)
  - [doctor](#doctor)
- [Global Options](#global-options)
- [Configuration](#configuration)
- [Exit Codes](#exit-codes)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Installation

The Blueprint CLI is included in the Blueprint V3 Enterprise package. Install dependencies:

```bash
pnpm install
```

The CLI can be invoked using `npx tsx bin/blueprint` or by linking the binary:

```bash
pnpm link
blueprint --help
```

---

## Quick Start

Initialize a new Blueprint project:

```bash
blueprint init --name my-project
```

Compile a Blueprint file:

```bash
blueprint compile --input src/contracts/MyContract.bp --output artifacts/MyContract.bpp
```

Run a compiled package:

```bash
blueprint run --package artifacts/MyContract.bpp
```

Check system health:

```bash
blueprint doctor
```

---

## Commands

### init

Initialize a new Blueprint project with directory structure and configuration files.

**Usage:**
```bash
blueprint init [options]
```

**Options:**
- `--name <name>` - Project name (default: blueprint-project)
- `--template <template>` - Template to use (future feature)
- `--directory <path>` - Output directory (default: ./<name>)
- `--force` - Force overwrite existing files

**Example:**
```bash
blueprint init --name my-app --directory ./my-app
```

**Creates:**
- `src/contracts/` - Contract files
- `src/modules/` - Module files
- `tests/` - Test files
- `artifacts/` - Build artifacts
- `config/` - Configuration files
- `blueprint.config.json` - Project configuration
- `README.md` - Project documentation
- Sample contract file

---

### compile

Compile Blueprint DSL to bytecode.

**Usage:**
```bash
blueprint compile [options]
```

**Options:**
- `-i, --input <path>` - Input file path (required)
- `-o, --output <path>` - Output file path (default: <input>.bpp)
- `-O, --optimize` - Enable optimizations
- `--emit-ir` - Emit intermediate representation
- `--emit-bytecode` - Emit bytecode
- `--emit-package` - Emit package
- `--target <target>` - Target platform (default: cvm-v3)

**Example:**
```bash
blueprint compile --input src/contracts/MyContract.bp --output artifacts/MyContract.bpp --optimize --emit-ir
```

**Compilation Pipeline:**
1. Lexing
2. Parsing
3. Semantic Analysis
4. Type Checking
5. Constraint Solving
6. Symbol Table Building
7. Reference Resolution
8. Optimization
9. IR Generation
10. Bytecode Generation
11. Bytecode Verification

---

### build

Build a Blueprint package from source files.

**Usage:**
```bash
blueprint build [options]
```

**Options:**
- `-i, --input <path>` - Input directory (default: current directory)
- `-o, --output <path>` - Output directory (default: ./dist)
- `-w, --watch` - Watch for changes (future feature)
- `-O, --optimize` - Enable optimizations

**Example:**
```bash
blueprint build --input ./src --output ./dist --optimize
```

---

### run

Run a compiled Blueprint program.

**Usage:**
```bash
blueprint run [options]
```

**Options:**
- `-p, --package <path>` - Package path (required)
- `-e, --entry <name>` - Entry point name (default: default)
- `--debug` - Enable debugging
- `--args <args...>` - Arguments to pass to program

**Example:**
```bash
blueprint run --package artifacts/MyContract.bpp --entry main --debug
```

---

### graph

Generate dependency, knowledge, or runtime graphs.

**Usage:**
```bash
blueprint graph [options]
```

**Options:**
- `--type <type>` - Graph type: dependency, knowledge, runtime (default: dependency)
- `--format <format>` - Output format: json, dot, mermaid (default: json)
- `--output <path>` - Output file (default: graph-<type>.<format>)
- `--filter <filter>` - Filter nodes (future feature)

**Example:**
```bash
blueprint graph --type dependency --format mermaid --output deps.mmd
```

**Output Formats:**
- **json** - Structured JSON with nodes and edges
- **dot** - Graphviz DOT format
- **mermaid** - Mermaid.js diagram syntax

---

### trace

Enable runtime tracing to capture execution events.

**Usage:**
```bash
blueprint trace [options]
```

**Options:**
- `--output <path>` - Output file (default: trace.json)
- `--format <format>` - Output format: json, text (default: json)
- `--filter <filter>` - Event filter (future feature)
- `--duration <ms>` - Trace duration in milliseconds (default: 5000)

**Example:**
```bash
blueprint trace --output execution-trace.json --duration 10000
```

---

### debug

Attach debugger to a running program.

**Usage:**
```bash
blueprint debug [options]
```

**Options:**
- `--port <port>` - Debug port (default: 9229)
- `--host <host>` - Debug host (default: localhost)
- `--breakpoints <file>` - Breakpoints file
- `--attach` - Attach to existing process

**Example:**
```bash
blueprint debug --port 9229 --host localhost --attach
```

---

### benchmark

Run performance benchmarks.

**Usage:**
```bash
blueprint benchmark [options]
```

**Options:**
- `--output <path>` - Output file (default: benchmark-report.json)
- `--filter <filter>` - Benchmark filter (future feature)
- `--iterations <n>` - Number of iterations (default: 100)
- `--warmup <n>` - Warmup iterations (default: 10)

**Example:**
```bash
blueprint benchmark --iterations 1000 --warmup 50 --output benchmarks.json
```

**Benchmarks:**
- Compiler performance
- Runtime performance
- Memory operations
- Scheduler performance
- Provider operations

---

### doctor

Check system health and configuration.

**Usage:**
```bash
blueprint doctor [options]
```

**Options:**
- `--output <path>` - Output file
- `--fix` - Auto-fix issues (future feature)
- `--check <items...>` - Specific checks to run

**Example:**
```bash
blueprint doctor --output health-report.json
```

**Health Checks:**
- Node.js version
- Operating System
- Memory availability
- CPU cores
- TypeScript installation
- Blueprint Compiler
- CVM (Cognitive Virtual Machine)
- CPR (Cognitive Processing Runtime)
- Docker (optional)
- Rust (optional)
- Go (optional)
- Python (optional)
- Java (optional)

---

## Global Options

These options apply to all commands:

- `-V, --version` - Output the version number
- `-v, --verbose` - Enable verbose output
- `-q, --quiet` - Suppress output
- `--json` - Output in JSON format
- `-c, --config <path>` - Path to configuration file
- `-h, --help` - Display help for command

**Example:**
```bash
blueprint --verbose compile --input contract.bp
blueprint --json doctor
```

---

## Configuration

The CLI supports configuration via:

### Configuration Files

- `blueprint.config.json` - JSON configuration
- `blueprint.config.yaml` - YAML configuration (future)
- `blueprint.config.ts` - TypeScript configuration (future)

### Environment Variables

- `BLUEPRINT_TARGET` - Default compilation target
- `BLUEPRINT_OPTIMIZE` - Enable optimizations (true/false)
- `BLUEPRINT_OUTPUT_DIR` - Default output directory

### Example Configuration

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Blueprint V3 Enterprise Project",
  "compiler": {
    "target": "cvm-v3",
    "optimize": true,
    "emitIR": true,
    "emitBytecode": true,
    "emitPackage": true
  },
  "runtime": {
    "debug": false,
    "trace": false,
    "profile": false
  },
  "output": {
    "directory": "artifacts",
    "format": "json"
  }
}
```

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Validation error
- `3` - Configuration error
- `4` - File not found
- `5` - Compilation error
- `6` - Runtime error
- `7` - Health check error

---

## Examples

### Complete Workflow

```bash
# Initialize project
blueprint init --name my-app

# Compile contract
blueprint compile --input src/contracts/MyContract.bp --optimize --emit-ir

# Build package
blueprint build --optimize

# Run program
blueprint run --package artifacts/MyContract.bpp

# Generate dependency graph
blueprint graph --type dependency --format mermaid

# Run benchmarks
blueprint benchmark --iterations 1000

# Check health
blueprint doctor
```

### Debugging Workflow

```bash
# Compile with debug info
blueprint compile --input contract.bp --optimize false

# Run with debugging
blueprint run --package contract.bpp --debug

# Attach debugger in another terminal
blueprint debug --attach --port 9229
```

### Tracing Workflow

```bash
# Run with tracing
blueprint trace --duration 10000 --output trace.json

# Analyze trace
# (trace.json contains execution events)
```

---

## Troubleshooting

### Command not found

If `blueprint` command is not found, use:

```bash
npx tsx bin/blueprint <command>
```

Or link the binary:

```bash
pnpm link
```

### Compilation errors

Check that:
- Input file exists and is readable
- File has `.bp` extension
- Syntax is valid

Use `--verbose` flag for detailed error messages:

```bash
blueprint --verbose compile --input contract.bp
```

### Runtime errors

Check that:
- Package file exists
- Package is valid bytecode
- Entry point exists

### Health check failures

Run doctor command to diagnose:

```bash
blueprint doctor --output report.json
```

Review the report for specific issues and recommendations.

### Permission errors

Ensure you have write permissions for output directories:

```bash
# On Unix/Linux
chmod +w artifacts/

# On Windows
# Run terminal as Administrator if needed
```

---

## Support

For issues, questions, or contributions:

- Documentation: [docs/](./)
- Issues: [GitHub Issues](https://github.com/your-org/blueprint/issues)
- Community: [Discord/Slack](https://your-community-link)

---

**Blueprint V3 Enterprise CLI**  
© 2025 Blueprint Cognitive Platform
