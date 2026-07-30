# BLUEPRINT_ARCHITECTURE_LINTER.md

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BLUEPRINT-LINTER-001 |
| **Title** | Blueprint Architecture Linter |
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Created** | 2026-01-15 |
| **Author** | Enterprise Chief Architect |
| **Purpose** | Define Blueprint Architecture Linter for enforcing architectural rules |
| **Scope** | Entire Blueprint V3 Enterprise platform |

---

## Executive Summary

This document defines the Blueprint Architecture Linter, an automated tool that enforces all architectural rules across Blueprint V3 Enterprise. The linter checks for duplications, ownership violations, dependency cycles, contract violations, and other architectural issues.

**Principles**:
1. **Automated Enforcement**: All rules must be automatically enforced
2. **Early Detection**: Violations must be detected early
3. **Clear Reporting**: Violations must be clearly reported
4. **Actionable Feedback**: Violations must have actionable feedback

---

## Linter Architecture

### Linter Components

**Core Linter**: Main linter engine
- Rule Engine: Executes all rules
- Validator Engine: Validates all elements
- Reporter Engine: Generates reports
- Fixer Engine: Suggests fixes

**Rule Sets**:
- Duplication Rules
- Ownership Rules
- Dependency Rules
- Contract Rules
- Naming Rules
- Versioning Rules

---

## Duplication Rules

### Rule: No Duplicate Definitions

**Rule ID**: LINT-DUP-001
**Severity**: Critical
**Description**: No element may be defined more than once

**Check**:
```typescript
function checkNoDuplicateDefinitions(elements: Element[]): LintResult {
  const idMap = new Map<string, Element[]>();
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!idMap.has(element.id)) {
      idMap.set(element.id, []);
    }
    idMap.get(element.id).push(element);
  }

  for (const [id, elements] of idMap) {
    if (elements.length > 1) {
      violations.push({
        rule: 'LINT-DUP-001',
        severity: 'critical',
        message: `Element ${id} is defined ${elements.length} times`,
        locations: elements.map(e => e.location),
        suggestion: 'Remove duplicate definitions and reference canonical definition'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

### Rule: No Duplicate Names

**Rule ID**: LINT-DUP-002
**Severity**: Critical
**Description**: No two elements may have the same name

**Check**:
```typescript
function checkNoDuplicateNames(elements: Element[]): LintResult {
  const nameMap = new Map<string, Element[]>();
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!nameMap.has(element.name)) {
      nameMap.set(element.name, []);
    }
    nameMap.get(element.name).push(element);
  }

  for (const [name, elements] of nameMap) {
    if (elements.length > 1) {
      violations.push({
        rule: 'LINT-DUP-002',
        severity: 'critical',
        message: `Name ${name} is used by ${elements.length} elements`,
        locations: elements.map(e => e.location),
        suggestion: 'Rename elements to have unique names'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Ownership Rules

### Rule: Unique Ownership

**Rule ID**: LINT-OWN-001
**Severity**: Critical
**Description**: Each element must have exactly one owner

**Check**:
```typescript
function checkUniqueOwnership(elements: Element[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!element.owner) {
      violations.push({
        rule: 'LINT-OWN-001',
        severity: 'critical',
        message: `Element ${element.id} has no owner`,
        location: element.location,
        suggestion: 'Assign an owner to this element'
      });
    }

    if (Array.isArray(element.owner) && element.owner.length > 1) {
      violations.push({
        rule: 'LINT-OWN-001',
        severity: 'critical',
        message: `Element ${element.id} has multiple owners: ${element.owner.join(', ')}`,
        location: element.location,
        suggestion: 'Assign a single owner to this element'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

### Rule: Valid Owner

**Rule ID**: LINT-OWN-002
**Severity**: Critical
**Description**: Owner must be a valid owner defined in ownership matrix

**Check**:
```typescript
function checkValidOwner(elements: Element[], ownershipMatrix: OwnershipMatrix): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!ownershipMatrix.isValidOwner(element.owner)) {
      violations.push({
        rule: 'LINT-OWN-002',
        severity: 'critical',
        message: `Owner ${element.owner} is not a valid owner for element ${element.id}`,
        location: element.location,
        suggestion: 'Assign a valid owner from the ownership matrix'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Dependency Rules

### Rule: No Cyclic Dependencies

**Rule ID**: LINT-DEP-001
**Severity**: Critical
**Description**: Dependency graphs must be acyclic

**Check**:
```typescript
function checkNoCyclicDependencies(dependencyGraph: DependencyGraph): LintResult {
  const violations: LintViolation[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function detectCycle(node: string, path: string[]): boolean {
    if (recursionStack.has(node)) {
      violations.push({
        rule: 'LINT-DEP-001',
        severity: 'critical',
        message: `Cyclic dependency detected: ${path.join(' -> ')} -> ${node}`,
        location: node,
        suggestion: 'Break the cycle by removing one dependency'
      });
      return true;
    }

    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    recursionStack.add(node);

    const dependencies = dependencyGraph.getDependencies(node);
    for (const dep of dependencies) {
      if (detectCycle(dep, [...path, node])) {
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (const node of dependencyGraph.getNodes()) {
    if (!visited.has(node)) {
      detectCycle(node, []);
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

### Rule: Defined Dependencies

**Rule ID**: LINT-DEP-002
**Severity**: High
**Description**: All dependencies must be defined

**Check**:
```typescript
function checkDefinedDependencies(elements: Element[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!element.dependencies) {
      violations.push({
        rule: 'LINT-DEP-002',
        severity: 'high',
        message: `Element ${element.id} has no dependencies defined`,
        location: element.location,
        suggestion: 'Define dependencies for this element'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Contract Rules

### Rule: Contract Compliance

**Rule ID**: LINT-CON-001
**Severity**: Critical
**Description**: All elements must comply with their contracts

**Check**:
```typescript
function checkContractCompliance(elements: Element[], contracts: Contract[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    const contract = contracts.find(c => c.id === element.contractId);
    if (!contract) {
      violations.push({
        rule: 'LINT-CON-001',
        severity: 'critical',
        message: `Element ${element.id} references non-existent contract ${element.contractId}`,
        location: element.location,
        suggestion: 'Reference a valid contract'
      });
      continue;
    }

    const compliance = contract.checkCompliance(element);
    if (!compliance.compliant) {
      violations.push({
        rule: 'LINT-CON-001',
        severity: 'critical',
        message: `Element ${element.id} does not comply with contract ${contract.id}: ${compliance.reason}`,
        location: element.location,
        suggestion: compliance.suggestion
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

### Rule: No Duplicate Contracts

**Rule ID**: LINT-CON-002
**Severity**: Critical
**Description**: No contract may be defined more than once

**Check**:
```typescript
function checkNoDuplicateContracts(contracts: Contract[]): LintResult {
  const idMap = new Map<string, Contract[]>();
  const violations: LintViolation[] = [];

  for (const contract of contracts) {
    if (!idMap.has(contract.id)) {
      idMap.set(contract.id, []);
    }
    idMap.get(contract.id).push(contract);
  }

  for (const [id, contracts] of idMap) {
    if (contracts.length > 1) {
      violations.push({
        rule: 'LINT-CON-002',
        severity: 'critical',
        message: `Contract ${id} is defined ${contracts.length} times`,
        locations: contracts.map(c => c.location),
        suggestion: 'Remove duplicate contracts and reference canonical contract'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Naming Rules

### Rule: PascalCase Naming

**Rule ID**: LINT-NAM-001
**Severity**: Medium
**Description**: Object names must use PascalCase

**Check**:
```typescript
function checkPascalCaseNaming(elements: Element[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!isPascalCase(element.name)) {
      violations.push({
        rule: 'LINT-NAM-001',
        severity: 'medium',
        message: `Element ${element.id} name ${element.name} does not use PascalCase`,
        location: element.location,
        suggestion: `Rename to ${toPascalCase(element.name)}`
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

### Rule: Semantic ID Format

**Rule ID**: LINT-NAM-002
**Severity**: Critical
**Description**: Semantic IDs must follow blueprint.{layer}.{category}.{name} format

**Check**:
```typescript
function checkSemanticIdFormat(elements: Element[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!isValidSemanticId(element.semanticId)) {
      violations.push({
        rule: 'LINT-NAM-002',
        severity: 'critical',
        message: `Element ${element.id} semantic ID ${element.semanticId} does not follow blueprint.{layer}.{category}.{name} format`,
        location: element.location,
        suggestion: 'Update semantic ID to follow the correct format'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Versioning Rules

### Rule: Semantic Versioning

**Rule ID**: LINT-VER-001
**Severity**: Critical
**Description**: Versions must follow MAJOR.MINOR.PATCH format

**Check**:
```typescript
function checkSemanticVersioning(elements: Element[]): LintResult {
  const violations: LintViolation[] = [];

  for (const element of elements) {
    if (!isValidSemanticVersion(element.version)) {
      violations.push({
        rule: 'LINT-VER-001',
        severity: 'critical',
        message: `Element ${element.id} version ${element.version} does not follow semantic versioning (MAJOR.MINOR.PATCH)`,
        location: element.location,
        suggestion: 'Update version to follow semantic versioning'
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations
  };
}
```

---

## Linter Execution

### Linter Pipeline

**Order of Rules**:
1. Duplication Rules
2. Ownership Rules
3. Dependency Rules
4. Contract Rules
5. Naming Rules
6. Versioning Rules

### Linter Modes

**Strict Mode**: All rules must pass
- Block commit if any violation
- No exceptions

**Warning Mode**: Critical rules must pass
- Block commit if critical violation
- Warn if other violations

**Report Mode**: All rules run
- Report all violations
- Do not block

### Linter Configuration

```yaml
linter:
  mode: strict
  rules:
    - LINT-DUP-001
    - LINT-DUP-002
    - LINT-OWN-001
    - LINT-OWN-002
    - LINT-DEP-001
    - LINT-DEP-002
    - LINT-CON-001
    - LINT-CON-002
    - LINT-NAM-001
    - LINT-NAM-002
    - LINT-VER-001
  exclude:
    - node_modules
    - .git
  include:
    - BEA/
    - BCM/
    - COS/
    - CVM/
    - CPR/
    - contracts/
```

---

## Linter Reporting

### Report Format

```typescript
interface LinterReport {
  timestamp: string;
  mode: LinterMode;
  summary: LinterSummary;
  results: LinterResult[];
}

interface LinterSummary {
  total: number;
  passed: number;
  failed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface LinterResult {
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  passed: boolean;
  violations: LintViolation[];
}

interface LintViolation {
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  location: string;
  suggestion: string;
}
```

### Report Output

**Console Output**:
```
Blueprint Architecture Linter v1.0.0
Mode: Strict
Scanning: BEA/, BCM/, COS/, CVM/, CPR/, contracts/

Summary:
Total: 100
Passed: 95
Failed: 5
Critical: 2
High: 2
Medium: 1
Low: 0

Violations:
[LINT-DUP-001] CRITICAL: Element Memory is defined 3 times
  Location: BEA-003, BCM-011, COS-000
  Suggestion: Remove duplicate definitions and reference canonical definition

[LINT-OWN-001] CRITICAL: Element Observation has no owner
  Location: BCM-001
  Suggestion: Assign an owner to this element

[LINT-DEP-001] HIGH: Element Reasoning has undefined dependencies
  Location: BCM-008
  Suggestion: Define dependencies for this element

[LINT-NAM-001] MEDIUM: Element observation does not use PascalCase
  Location: BCM-001
  Suggestion: Rename to Observation

Lint failed with 5 violations
```

**JSON Output**:
```json
{
  "timestamp": "2026-01-15T10:00:00Z",
  "mode": "strict",
  "summary": {
    "total": 100,
    "passed": 95,
    "failed": 5,
    "critical": 2,
    "high": 2,
    "medium": 1,
    "low": 0
  },
  "results": [...]
}
```

---

## Linter Automation

### Continuous Linting

**Triggers**:
- On file save
- On pre-commit
- On pull request
- On deployment

### Linter Gates

**Pre-commit Gate**:
- Run linter in strict mode
- Block commit if critical violations
- Warn if other violations

**Pre-deployment Gate**:
- Run linter in strict mode
- Block deployment if any violations
- Require manual approval for warnings

---

## Document End

**This document defines the Blueprint Architecture Linter for Blueprint V3 Enterprise.**

**All architectural rules must be automatically enforced by the linter.**

**This document is signed by the Enterprise Chief Architect.**
