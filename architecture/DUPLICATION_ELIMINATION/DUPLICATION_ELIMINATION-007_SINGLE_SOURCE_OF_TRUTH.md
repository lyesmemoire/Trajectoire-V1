# DUPLICATION_ELIMINATION-007: Single Source of Truth

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the single source of truth in Duplication Elimination system

---

## Purpose

The single source of truth maintains canonical definitions for all concepts and ensures all references point to the canonical definition.

---

## Canonical Definition Storage

### Canonical Registry
```
struct CanonicalRegistry {
    contracts: HashMap<String, CanonicalContract>,
    types: HashMap<String, CanonicalType>,
    events: HashMap<String, CanonicalEvent>,
    states: HashMap<String, CanonicalState>,
    graphs: HashMap<String, CanonicalGraph>,
    algorithms: HashMap<String, CanonicalAlgorithm>,
    invariants: HashMap<String, CanonicalInvariant>,
    rules: HashMap<String, CanonicalRule>,
}
```

### Canonical Definition
```
struct CanonicalDefinition<T> {
    id: DefinitionID,
    name: String,
    version: Version,
    definition: T,
    location: Location,
    references: Vec<Reference>,
    metadata: DefinitionMetadata,
}
```

---

## Canonical Registration

### Contract Registration
```
register_canonical_contract(contract) -> RegistrationResult {
    // Check if contract already exists
    if (canonical_registry.contracts.contains_key(&contract.name)) {
        return RegistrationResult::AlreadyExists;
    }
    
    // Register canonical contract
    canonical = CanonicalDefinition {
        id: generate_definition_id(),
        name: contract.name.clone(),
        version: contract.version,
        definition: contract,
        location: determine_location(contract),
        references: Vec::new(),
        metadata: DefinitionMetadata::default(),
    };
    
    canonical_registry.contracts.insert(contract.name, canonical);
    
    RegistrationResult::Success
}
```

### Type Registration
```
register_canonical_type(type_def) -> RegistrationResult {
    // Check if type already exists
    if (canonical_registry.types.contains_key(&type_def.name)) {
        return RegistrationResult::AlreadyExists;
    }
    
    // Register canonical type
    canonical = CanonicalDefinition {
        id: generate_definition_id(),
        name: type_def.name.clone(),
        version: type_def.version,
        definition: type_def,
        location: determine_location(type_def),
        references: Vec::new(),
        metadata: DefinitionMetadata::default(),
    };
    
    canonical_registry.types.insert(type_def.name, canonical);
    
    RegistrationResult::Success
}
```

---

## Reference Management

### Reference Tracking
```
track_reference(reference) -> ReferenceResult {
    // Update canonical definition
    canonical = get_canonical_definition(reference.definition_id);
    canonical.references.push(reference);
    
    ReferenceResult::Success
}
```

### Reference Resolution
```
resolve_reference(reference) -> Option<CanonicalDefinition> {
    match reference.definition_type {
        DefinitionType::Contract => {
            canonical_registry.contracts.get(&reference.definition_name)
        }
        DefinitionType::Type => {
            canonical_registry.types.get(&reference.definition_name)
        }
        DefinitionType::Event => {
            canonical_registry.events.get(&reference.definition_name)
        }
        DefinitionType::State => {
            canonical_registry.states.get(&reference.definition_name)
        }
        DefinitionType::Graph => {
            canonical_registry.graphs.get(&reference.definition_name)
        }
        DefinitionType::Algorithm => {
            canonical_registry.algorithms.get(&reference.definition_name)
        }
        DefinitionType::Invariant => {
            canonical_registry.invariants.get(&reference.definition_name)
        }
        DefinitionType::Rule => {
            canonical_registry.rules.get(&reference.definition_name)
        }
    }
}
```

---

## Canonical Updates

### Canonical Update
```
update_canonical_definition(definition_id, new_definition) -> UpdateResult {
    // Get current canonical definition
    canonical = get_canonical_definition(definition_id);
    
    // Update version
    new_version = increment_version(canonical.version);
    
    // Update definition
    updated_canonical = CanonicalDefinition {
        id: canonical.id,
        name: canonical.name,
        version: new_version,
        definition: new_definition,
        location: canonical.location,
        references: canonical.references,
        metadata: canonical.metadata,
    };
    
    // Update registry
    update_registry(updated_canonical);
    
    UpdateResult::Success { new_version }
}
```

---

## Single Source of Truth Statistics

### Metrics
- Canonical definition count (total canonical definitions)
- Reference count (total references to canonical definitions)
- Reference resolution rate (resolved / total references)

### Counters
- Canonical definitions registered
- References tracked
- Canonical definitions updated
