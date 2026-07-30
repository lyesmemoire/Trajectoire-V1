# DUPLICATION_ELIMINATION-001: Contract & Type Analyzer

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the contract and type analyzer in Duplication Elimination system

---

## Purpose

The contract and type analyzer analyzes contract and type definitions for duplication.

---

## Contract Analysis

### Contract Duplication Detection
```
detect_contract_duplication(contracts) -> Vec<ContractDuplication> {
    mut duplications = Vec::new();
    
    // Group contracts by name
    mut contract_groups: HashMap<String, Vec<Contract>> = HashMap::new();
    for contract in contracts {
        contract_groups.entry(contract.name.clone()).or_insert(Vec::new()).push(contract);
    }
    
    // Detect duplications within groups
    for (name, group) in contract_groups {
        if (group.len() > 1) {
            duplication = ContractDuplication {
                name: name,
                contracts: group,
                canonical: select_canonical_contract(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### Canonical Selection
```
select_canonical_contract(contracts) -> Contract {
    // Select contract with highest version
    mut canonical = contracts[0];
    for contract in contracts {
        if (contract.version > canonical.version) {
            canonical = contract;
        }
    }
    canonical
}
```

---

## Type Analysis

### Type Duplication Detection
```
detect_type_duplication(types) -> Vec<TypeDuplication> {
    mut duplications = Vec::new();
    
    // Group types by name
    mut type_groups: HashMap<String, Vec<Type>> = HashMap::new();
    for type_def in types {
        type_groups.entry(type_def.name.clone()).or_insert(Vec::new()).push(type_def);
    }
    
    // Detect duplications within groups
    for (name, group) in type_groups {
        if (group.len() > 1) {
            duplication = TypeDuplication {
                name: name,
                types: group,
                canonical: select_canonical_type(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### Type Similarity Detection
```
detect_type_similarity(types) -> Vec<TypeSimilarity> {
    mut similarities = Vec::new();
    
    // Compare all pairs of types
    for i in 0..types.len() {
        for j in (i+1)..types.len() {
            similarity = calculate_type_similarity(types[i], types[j]);
            if (similarity > SIMILARITY_THRESHOLD) {
                similarity = TypeSimilarity {
                    type1: types[i].clone(),
                    type2: types[j].clone(),
                    similarity: similarity,
                };
                similarities.push(similarity);
            }
        }
    }
    
    similarities
}
```

---

## Duplication Statistics

### Metrics
- Contract duplication rate (duplicate contracts / total contracts)
- Type duplication rate (duplicate types / total types)
- Type similarity rate (similar types / total type pairs)

### Counters
- Contracts analyzed
- Types analyzed
- Contract duplications detected
- Type duplications detected
