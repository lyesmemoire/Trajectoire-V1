# DUPLICATION_ELIMINATION-004: Invariant & Rule Analyzer

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the invariant and rule analyzer in Duplication Elimination system

---

## Purpose

The invariant and rule analyzer analyzes invariant and rule definitions for duplication.

---

## Invariant Analysis

### Invariant Duplication Detection
```
detect_invariant_duplication(invariants) -> Vec<InvariantDuplication> {
    mut duplications = Vec::new();
    
    // Group invariants by name
    mut invariant_groups: HashMap<String, Vec<Invariant>> = HashMap::new();
    for invariant in invariants {
        invariant_groups.entry(invariant.name.clone()).or_insert(Vec::new()).push(invariant);
    }
    
    // Detect duplications within groups
    for (name, group) in invariant_groups {
        if (group.len() > 1) {
            duplication = InvariantDuplication {
                name: name,
                invariants: group,
                canonical: select_canonical_invariant(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### Invariant Similarity Detection
```
detect_invariant_similarity(invariants) -> Vec<InvariantSimilarity> {
    mut similarities = Vec::new();
    
    // Compare all pairs of invariants
    for i in 0..invariants.len() {
        for j in (i+1)..invariants.len() {
            similarity = calculate_invariant_similarity(invariants[i], invariants[j]);
            if (similarity > SIMILARITY_THRESHOLD) {
                similarity = InvariantSimilarity {
                    invariant1: invariants[i].clone(),
                    invariant2: invariants[j].clone(),
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

## Rule Analysis

### Rule Duplication Detection
```
detect_rule_duplication(rules) -> Vec<RuleDuplication> {
    mut duplications = Vec::new();
    
    // Group rules by name
    mut rule_groups: HashMap<String, Vec<Rule>> = HashMap::new();
    for rule in rules {
        rule_groups.entry(rule.name.clone()).or_insert(Vec::new()).push(rule);
    }
    
    // Detect duplications within groups
    for (name, group) in rule_groups {
        if (group.len() > 1) {
            duplication = RuleDuplication {
                name: name,
                rules: group,
                canonical: select_canonical_rule(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### Rule Similarity Detection
```
detect_rule_similarity(rules) -> Vec<RuleSimilarity> {
    mut similarities = Vec::new();
    
    // Compare all pairs of rules
    for i in 0..rules.len() {
        for j in (i+1)..rules.len() {
            similarity = calculate_rule_similarity(rules[i], rules[j]);
            if (similarity > SIMILARITY_THRESHOLD) {
                similarity = RuleSimilarity {
                    rule1: rules[i].clone(),
                    rule2: rules[j].clone(),
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
- Invariant duplication rate (duplicate invariants / total invariants)
- Rule duplication rate (duplicate rules / total rules)
- Invariant similarity rate (similar invariants / total invariant pairs)
- Rule similarity rate (similar rules / total rule pairs)

### Counters
- Invariants analyzed
- Rules analyzed
- Invariant duplications detected
- Rule duplications detected
