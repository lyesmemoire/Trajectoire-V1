# Architecture Linter Specification

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | LINTER-SPEC-001 |
| **Title** | Architecture Linter Specification |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Architecture Team |
| **Purpose** | Define automatic validation rules for Blueprint V3 Enterprise architecture |

---

## Overview

This document defines the specification for the Architecture Linter, an automated tool that validates all architecture rules defined in ARCHITECTURE_RULES.md. The linter ensures architectural coherence, prevents technical debt, and maintains system integrity through automated validation.

**Core Principle**: All architecture rules MUST be validated automatically by the linter.

---

## Linter Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Architecture Linter                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Rule Engine                              │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  Layer Rules                                         │    │
│  │  Contract Rules                                     │    │
│  │  Dependency Rules                                   │    │
│  │  Interface Rules                                    │    │
│  │  Type Rules                                         │    │
│  │  Event Rules                                        │    │
│  │  State Machine Rules                                │    │
│  │  Graph Rules                                        │    │
│  │  Invariant Rules                                    │    │
│  │  Business Rule Rules                                │    │
│  │  Forbidden Behavior Rules                           │    │
│  │  Naming Convention Rules                            │    │
│  │  Code Organization Rules                            │    │
│  │  Documentation Rules                                │    │
│  │  Testing Rules                                      │    │
│  │  Security Rules                                     │    │
│  │  Performance Rules                                  │    │
│  │  Monitoring Rules                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Analyzers                                 │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  Dependency Analyzer                                │    │
│  │  Contract Analyzer                                  │    │
│  │  Interface Analyzer                                 │    │
│  │  Type Analyzer                                      │    │
│  │  Event Analyzer                                     │    │
│  │  State Machine Analyzer                             │    │
│  │  Graph Analyzer                                     │    │
│  │  Invariant Analyzer                                 │    │
│  │  Business Rule Analyzer                             │    │
│  │  Naming Convention Analyzer                        │    │
│  │  Code Organization Analyzer                         │    │
│  │  Documentation Analyzer                             │    │
│  │  Security Analyzer                                  │    │
│  │  Performance Analyzer                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Reporters                                 │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  Console Reporter                                   │    │
│  │  File Reporter                                      │    │
│  │  HTML Reporter                                      │    │
│  │  JSON Reporter                                      │    │
│  │  SARIF Reporter                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Rule Specifications

### Layer Rules

#### Rule L-001: COS Independence

**Check**: Verify COS does not depend on CVM or CPR

**Implementation**:
```typescript
function checkCOSIndependence(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const cosFiles = project.getFiles('cos');
  const cvmFiles = project.getFiles('cvm');
  const cprFiles = project.getFiles('cpr');
  
  for (const file of cosFiles) {
    const imports = file.getImports();
    
    for (const imp of imports) {
      if (cvmFiles.some(f => f.path === imp.path)) {
        violations.push({
          rule: 'L-001',
          severity: 'critical',
          file: file.path,
          message: 'COS must not depend on CVM',
          line: imp.line,
          column: imp.column
        });
      }
      
      if (cprFiles.some(f => f.path === imp.path)) {
        violations.push({
          rule: 'L-001',
          severity: 'critical',
          file: file.path,
          message: 'COS must not depend on CPR',
          line: imp.line,
          column: imp.column
        });
      }
    }
  }
  
  return violations;
}
```

#### Rule L-002: CVM Contract Dependency

**Check**: Verify CVM depends only on COS contracts (read-only)

**Implementation**:
```typescript
function checkCVMContractDependency(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const cvmFiles = project.getFiles('cvm');
  const cosContracts = project.getFiles('contracts');
  const cosImplementation = project.getFiles('cos').filter(f => !f.path.includes('contracts'));
  
  for (const file of cvmFiles) {
    const imports = file.getImports();
    
    for (const imp of imports) {
      if (cosImplementation.some(f => f.path === imp.path)) {
        violations.push({
          rule: 'L-002',
          severity: 'critical',
          file: file.path,
          message: 'CVM must not depend on COS implementation',
          line: imp.line,
          column: imp.column
        });
      }
      
      if (imp.path.includes('cpr')) {
        violations.push({
          rule: 'L-002',
          severity: 'critical',
          file: file.path,
          message: 'CVM must not depend on CPR',
          line: imp.line,
          column: imp.column
        });
      }
    }
  }
  
  return violations;
}
```

#### Rule L-003: CPR Contract Dependency

**Check**: Verify CPR depends only on COS contracts (read-only) and CVM contracts (read-only)

**Implementation**:
```typescript
function checkCPRContractDependency(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const cprFiles = project.getFiles('cpr');
  const cosContracts = project.getFiles('contracts');
  const cvmContracts = project.getFiles('cvm').filter(f => f.path.includes('contract'));
  const cosImplementation = project.getFiles('cos').filter(f => !f.path.includes('contracts'));
  const cvmImplementation = project.getFiles('cvm').filter(f => !f.path.includes('contract'));
  
  for (const file of cprFiles) {
    const imports = file.getImports();
    
    for (const imp of imports) {
      if (cosImplementation.some(f => f.path === imp.path)) {
        violations.push({
          rule: 'L-003',
          severity: 'critical',
          file: file.path,
          message: 'CPR must not depend on COS implementation',
          line: imp.line,
          column: imp.column
        });
      }
      
      if (cvmImplementation.some(f => f.path === imp.path)) {
        violations.push({
          rule: 'L-003',
          severity: 'critical',
          file: file.path,
          message: 'CPR must not depend on CVM implementation',
          line: imp.line,
          column: imp.column
        });
      }
    }
  }
  
  return violations;
}
```

---

### Contract Rules

#### Rule C-001: Single Contract Owner

**Check**: Verify each contract has a single owner

**Implementation**:
```typescript
function checkSingleContractOwner(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const ownershipMap = new Map<string, string[]>();
  
  for (const file of contractFiles) {
    const owner = file.getMetadata('owner');
    if (!owner) {
      violations.push({
        rule: 'C-001',
        severity: 'high',
        file: file.path,
        message: 'Contract must have an owner',
        line: 1,
        column: 1
      });
      continue;
    }
    
    if (ownershipMap.has(file.name)) {
      ownershipMap.get(file.name)!.push(owner);
    } else {
      ownershipMap.set(file.name, [owner]);
    }
  }
  
  for (const [contractName, owners] of ownershipMap) {
    if (owners.length > 1) {
      violations.push({
        rule: 'C-001',
        severity: 'high',
        file: contractFiles.find(f => f.name === contractName)!.path,
        message: `Contract has multiple owners: ${owners.join(', ')}`,
        line: 1,
        column: 1
      });
    }
  }
  
  return violations;
}
```

#### Rule C-002: Contract Versioning

**Check**: Verify all contracts are versioned using semantic versioning

**Implementation**:
```typescript
function checkContractVersioning(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const versionRegex = /^\d+\.\d+\.\d+$/;
  
  for (const file of contractFiles) {
    const version = file.getMetadata('version');
    
    if (!version) {
      violations.push({
        rule: 'C-002',
        severity: 'high',
        file: file.path,
        message: 'Contract must have a version',
        line: 1,
        column: 1
      });
      continue;
    }
    
    if (!versionRegex.test(version)) {
      violations.push({
        rule: 'C-002',
        severity: 'high',
        file: file.path,
        message: `Contract version must follow semantic versioning: ${version}`,
        line: 1,
        column: 1
      });
    }
  }
  
  return violations;
}
```

#### Rule C-003: Contract Location

**Check**: Verify all contracts are defined in the `/contracts` directory

**Implementation**:
```typescript
function checkContractLocation(project: Project): Violation[] = {
  const violations: Violation[] = [];
  
  const allFiles = project.getAllFiles();
  const contractPattern = /contract/i;
  
  for (const file of allFiles) {
    if (contractPattern.test(file.name) && !file.path.startsWith('contracts/')) {
      violations.push({
        rule: 'C-003',
        severity: 'high',
        file: file.path,
        message: 'Contract must be defined in /contracts directory',
        line: 1,
        column: 1
      });
    }
  }
  
  return violations;
}
```

#### Rule C-004: No Contract Redefinition

**Check**: Verify components do not redefine contracts from other layers

**Implementation**:
```typescript
function checkNoContractRedefinition(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const contractDefinitions = new Map<string, string>();
  
  // Collect all contract definitions
  for (const file of contractFiles) {
    const definitions = file.getInterfaceDefinitions();
    for (const def of definitions) {
      contractDefinitions.set(def.name, file.path);
    }
  }
  
  // Check for redefinitions in other files
  const allFiles = project.getAllFiles();
  for (const file of allFiles) {
    if (file.path.startsWith('contracts/')) continue;
    
    const definitions = file.getInterfaceDefinitions();
    for (const def of definitions) {
      if (contractDefinitions.has(def.name)) {
        violations.push({
          rule: 'C-004',
          severity: 'critical',
          file: file.path,
          message: `Contract redefinition: ${def.name} is defined in ${contractDefinitions.get(def.name)}`,
          line: def.line,
          column: def.column
        });
      }
    }
  }
  
  return violations;
}
```

---

### Dependency Rules

#### Rule D-001: No Circular Dependencies

**Check**: Verify no circular dependencies across layers

**Implementation**:
```typescript
function checkNoCircularDependencies(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const dependencyGraph = project.buildDependencyGraph();
  const cycles = dependencyGraph.detectCycles();
  
  for (const cycle of cycles) {
    violations.push({
      rule: 'D-001',
      severity: 'critical',
      file: cycle[0].file,
      message: `Circular dependency detected: ${cycle.map(c => c.file).join(' -> ')}`,
      line: 1,
      column: 1
    });
  }
  
  return violations;
}
```

#### Rule D-002: Explicit Dependencies

**Check**: Verify all dependencies are explicit

**Implementation**:
```typescript
function checkExplicitDependencies(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const allFiles = project.getAllFiles();
  const declaredDependencies = project.getDeclaredDependencies();
  
  for (const file of allFiles) {
    const imports = file.getImports();
    
    for (const imp of imports) {
      if (!declaredDependencies.has(imp.path)) {
        violations.push({
          rule: 'D-002',
          severity: 'high',
          file: file.path,
          message: `Implicit dependency detected: ${imp.path}`,
          line: imp.line,
          column: imp.column
        });
      }
    }
  }
  
  return violations;
}
```

---

### Interface Rules

#### Rule I-001: Interface Definition

**Check**: Verify all interfaces are defined in contracts

**Implementation**:
```typescript
function checkInterfaceDefinition(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const contractInterfaces = new Set<string>();
  
  // Collect all contract interfaces
  for (const file of contractFiles) {
    const interfaces = file.getInterfaceDefinitions();
    for (const iface of interfaces) {
      contractInterfaces.add(iface.name);
    }
  }
  
  // Check for interfaces defined outside contracts
  const allFiles = project.getAllFiles();
  for (const file of allFiles) {
    if (file.path.startsWith('contracts/')) continue;
    
    const interfaces = file.getInterfaceDefinitions();
    for (const iface of interfaces) {
      if (!contractInterfaces.has(iface.name)) {
        violations.push({
          rule: 'I-001',
          severity: 'high',
          file: file.path,
          message: `Interface must be defined in contracts: ${iface.name}`,
          line: iface.line,
          column: iface.column
        });
      }
    }
  }
  
  return violations;
}
```

---

### Type Rules

#### Rule T-001: Type Definition

**Check**: Verify all types are defined in contracts

**Implementation**:
```typescript
function checkTypeDefinition(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const contractTypes = new Set<string>();
  
  // Collect all contract types
  for (const file of contractFiles) {
    const types = file.getTypeDefinitions();
    for (const type of types) {
      contractTypes.add(type.name);
    }
  }
  
  // Check for types defined outside contracts
  const allFiles = project.getAllFiles();
  for (const file of allFiles) {
    if (file.path.startsWith('contracts/')) continue;
    
    const types = file.getTypeDefinitions();
    for (const type of types) {
      if (!contractTypes.has(type.name)) {
        violations.push({
          rule: 'T-001',
          severity: 'high',
          file: file.path,
          message: `Type must be defined in contracts: ${type.name}`,
          line: type.line,
          column: type.column
        });
      }
    }
  }
  
  return violations;
}
```

---

### Naming Convention Rules

#### Rule NC-001: Contract Naming

**Check**: Verify contract files use UPPER_CASE naming

**Implementation**:
```typescript
function checkContractNaming(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const contractFiles = project.getFiles('contracts');
  const upperCaseRegex = /^[A-Z_]+\.md$/;
  
  for (const file of contractFiles) {
    if (!upperCaseRegex.test(file.name)) {
      violations.push({
        rule: 'NC-001',
        severity: 'low',
        file: file.path,
        message: `Contract file must use UPPER_CASE naming: ${file.name}`,
        line: 1,
        column: 1
      });
    }
  }
  
  return violations;
}
```

#### Rule NC-002: Interface Naming

**Check**: Verify interfaces use PascalCase naming

**Implementation**:
```typescript
function checkInterfaceNaming(project: Project): Violation[] {
  const violations: Violation[] = [];
  
  const allFiles = project.getAllFiles();
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  
  for (const file of allFiles) {
    const interfaces = file.getInterfaceDefinitions();
    for (const iface of interfaces) {
      if (!pascalCaseRegex.test(iface.name)) {
        violations.push({
          rule: 'NC-002',
          severity: 'low',
          file: file.path,
          message: `Interface must use PascalCase naming: ${iface.name}`,
          line: iface.line,
          column: iface.column
        });
      }
    }
  }
  
  return violations;
}
```

---

## Linter Configuration

### Configuration File

```yaml
# .architecture-linter.yml

rules:
  # Layer Rules
  L-001:
    enabled: true
    severity: critical
  L-002:
    enabled: true
    severity: critical
  L-003:
    enabled: true
    severity: critical
  L-004:
    enabled: true
    severity: critical
  L-005:
    enabled: true
    severity: critical
  
  # Contract Rules
  C-001:
    enabled: true
    severity: high
  C-002:
    enabled: true
    severity: high
  C-003:
    enabled: true
    severity: high
  C-004:
    enabled: true
    severity: critical
  C-005:
    enabled: true
    severity: critical
  C-006:
    enabled: true
    severity: high
  C-007:
    enabled: true
    severity: medium
  C-008:
    enabled: true
    severity: critical
  
  # Dependency Rules
  D-001:
    enabled: true
    severity: critical
  D-002:
    enabled: true
    severity: high
  D-003:
    enabled: true
    severity: medium
  D-004:
    enabled: true
    severity: high
  D-005:
    enabled: true
    severity: high
  
  # Interface Rules
  I-001:
    enabled: true
    severity: high
  I-002:
    enabled: true
    severity: high
  I-003:
    enabled: true
    severity: high
  I-004:
    enabled: true
    severity: medium
  
  # Type Rules
  T-001:
    enabled: true
    severity: high
  T-002:
    enabled: true
    severity: high
  T-003:
    enabled: true
    severity: high
  T-004:
    enabled: true
    severity: medium
  
  # Event Rules
  E-001:
    enabled: true
    severity: high
  E-002:
    enabled: true
    severity: high
  E-003:
    enabled: true
    severity: high
  E-004:
    enabled: true
    severity: medium
  
  # Naming Convention Rules
  NC-001:
    enabled: true
    severity: low
  NC-002:
    enabled: true
    severity: low
  NC-003:
    enabled: true
    severity: low
  NC-004:
    enabled: true
    severity: low
  NC-005:
    enabled: true
    severity: low

# Exclude patterns
exclude:
  - 'node_modules/**'
  - 'dist/**'
  - 'build/**'
  - '.git/**'
  - '**/*.test.ts'
  - '**/*.spec.ts'

# Include patterns
include:
  - 'cos/**'
  - 'cvm/**'
  - 'cpr/**'
  - 'contracts/**'

# Reporters
reporters:
  - console
  - file
  - html
  - json

# Output directory
outputDir: '.architecture-linter'

# Fail on violations
failOn:
  critical: true
  high: true
  medium: false
  low: false
```

---

## Linter CLI

### Commands

```bash
# Run linter on all files
architecture-linter

# Run linter on specific directory
architecture-linter cos/

# Run linter on specific file
architecture-linter cos/COS-001_Cognitive_Scheduler.md

# Run linter with custom config
architecture-linter --config .architecture-linter.custom.yml

# Run linter with specific rules
architecture-linter --rules L-001,L-002,C-001

# Run linter and generate HTML report
architecture-linter --reporter html

# Run linter and generate JSON report
architecture-linter --reporter json

# Run linter in watch mode
architecture-linter --watch

# Run linter in fix mode (auto-fix where possible)
architecture-linter --fix

# Run linter with severity filter
architecture-linter --severity critical,high
```

---

## Linter API

### TypeScript API

```typescript
import { ArchitectureLinter, LinterConfig, Violation } from '@blueprint/architecture-linter';

const config: LinterConfig = {
  rules: {
    'L-001': { enabled: true, severity: 'critical' },
    'C-001': { enabled: true, severity: 'high' },
    // ... other rules
  },
  include: ['cos/**', 'cvm/**', 'cpr/**', 'contracts/**'],
  exclude: ['node_modules/**', 'dist/**'],
  reporters: ['console', 'file', 'html'],
  failOn: {
    critical: true,
    high: true,
    medium: false,
    low: false
  }
};

const linter = new ArchitectureLinter(config);

// Run linter
const violations: Violation[] = await linter.lint();

// Get violations by severity
const criticalViolations = violations.filter(v => v.severity === 'critical');
const highViolations = violations.filter(v => v.severity === 'high');

// Get violations by rule
const layerViolations = violations.filter(v => v.rule.startsWith('L-'));
const contractViolations = violations.filter(v => v.rule.startsWith('C-'));

// Get violations by file
const fileViolations = violations.filter(v => v.file === 'cos/COS-001_Cognitive_Scheduler.md');

// Generate report
await linter.generateReport('html');
await linter.generateReport('json');
await linter.generateReport('sarif');
```

---

## Pre-commit Hook

### Git Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running Architecture Linter..."

npx architecture-linter

if [ $? -ne 0 ]; then
  echo "Architecture Linter found violations. Commit blocked."
  echo "Run 'architecture-linter --fix' to auto-fix violations where possible."
  exit 1
fi

echo "Architecture Linter passed. No violations found."
exit 0
```

### Husky Configuration

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "architecture-linter",
      "pre-push": "architecture-linter --severity critical,high"
    }
  }
}
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Architecture Linter

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Architecture Linter
        run: npx architecture-linter --reporter json --output .architecture-linter/report.json
        
      - name: Upload Linter Report
        uses: actions/upload-artifact@v3
        with:
          name: architecture-linter-report
          path: .architecture-linter/report.json
          
      - name: Check for Critical Violations
        run: |
          if [ $(cat .architecture-linter/report.json | jq '.violations | map(select(.severity == "critical")) | length') -gt 0 ]; then
            echo "Critical violations found. Failing build."
            exit 1
          fi
```

---

## Violation Schema

### Violation Structure

```typescript
interface Violation {
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  column: number;
  message: string;
  suggestion?: string;
  fix?: {
    type: 'auto' | 'manual';
    description: string;
  };
}

interface LinterReport {
  summary: {
    totalViolations: number;
    criticalViolations: number;
    highViolations: number;
    mediumViolations: number;
    lowViolations: number;
    filesChecked: number;
    duration: number;
  };
  violations: Violation[];
  rules: {
    [ruleId: string]: {
      enabled: boolean;
      severity: string;
      violations: number;
    };
  };
}
```

---

## SARIF Format

### SARIF Output

```json
{
  "version": "2.1.0",
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "architecture-linter",
          "version": "1.0.0",
          "informationUri": "https://github.com/blueprint/architecture-linter"
        }
      },
      "results": [
        {
          "ruleId": "L-001",
          "level": "error",
          "message": {
            "text": "COS must not depend on CVM"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "cos/COS-001_Cognitive_Scheduler.md"
                },
                "region": {
                  "startLine": 10,
                  "startColumn": 1,
                  "endLine": 10,
                  "endColumn": 50
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Document End
