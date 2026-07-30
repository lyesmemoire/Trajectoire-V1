# OPTIMIZATION-005: Knowledge Inlining

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the knowledge inlining optimization pass

---

## Purpose

Knowledge inlining replaces knowledge lookup operations with inline knowledge values, reducing lookup overhead and improving performance.

---

## Inline Decision

### Inline Criteria
```
should_inline_knowledge(knowledge_lookup) -> bool {
    // Inline small knowledge
    if (knowledge_lookup.knowledge_size < INLINE_THRESHOLD) {
        return true;
    }
    
    // Inline knowledge accessed once
    if (knowledge_lookup.access_count == 1) {
        return true;
    }
    
    // Inline frequently accessed knowledge
    if (knowledge_lookup.access_frequency > INLINE_FREQUENCY_THRESHOLD) {
        return true;
    }
    
    false
}
```

---

## Knowledge Inlining

### Inlining Process
```
inline_knowledge(cir) -> OptimizedCIR {
    mut inliner = KnowledgeInliner::new();
    optimized_cir = inliner.inline(cir);
    return optimized_cir;
}
```

### Inlining Steps
1. **Identify Candidates**: Identify knowledge lookup candidates for inlining
2. **Extract Knowledge**: Extract knowledge values from knowledge base
3. **Replace Lookups**: Replace knowledge lookups with inline values
4. **Update Metadata**: Update metadata to reflect inlining
5. **Verify**: Verify CIR remains valid after inlining

---

## Knowledge Inlining Examples

### Single Lookup Inlining
```
// Before
knowledge = KNOWLEDGE_LOOKUP(knowledge_id);
result = REASON(knowledge);

// After
result = REASON(inline_knowledge_value);
```

### Multiple Lookup Inlining
```
// Before
knowledge1 = KNOWLEDGE_LOOKUP(knowledge_id);
knowledge2 = KNOWLEDGE_LOOKUP(knowledge_id);
result1 = REASON(knowledge1);
result2 = REASON(knowledge2);

// After
result1 = REASON(inline_knowledge_value);
result2 = REASON(inline_knowledge_value);
```

---

## Optimization Statistics

### Metrics
- Knowledge lookups inlined (count)
- Code size increase (bytes)
- Performance improvement (speedup)

### Counters
- Knowledge lookups analyzed
- Inline candidates identified
- Lookups inlined
