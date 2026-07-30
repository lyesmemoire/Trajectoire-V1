# DEBUGGER-003: State Inspector

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the state inspector in Cognitive Debugger

---

## Purpose

The state inspector provides comprehensive state inspection capabilities, including registers, memory, stack, and cognitive state inspection.

---

## Inspection Types

### Register Inspection
Inspect register file contents.

### Memory Inspection
Inspect memory contents.

### Stack Inspection
Inspect stack contents.

### Cognitive State Inspection
Inspect cognitive state (knowledge, beliefs, hypotheses, etc.).

---

## Register Inspection

### Register File Inspection
```
inspect_registers() -> RegisterFileState {
    RegisterFileState {
        general_purpose: register_file[0..31],
        fp: FP,
        sp: SP,
        pc: PC,
        flags: FLAGS,
    }
}
```

### Single Register Inspection
```
inspect_register(register_id) -> RegisterValue {
    register_file[register_id]
}
```

---

## Memory Inspection

### Memory Region Inspection
```
inspect_memory_region(start_address, size) -> MemoryRegion {
    MemoryRegion {
        start_address: start_address,
        size: size,
        data: memory.read_range(start_address, size),
    }
}
```

### Memory Dump
```
dump_memory(start_address, size) -> Vec<u8> {
    memory.read_range(start_address, size)
}
```

### Memory Search
```
search_memory(pattern) -> Vec<u64> {
    mut addresses = Vec::new();
    
    for address in 0..memory.size() {
        if (memory.matches(address, pattern)) {
            addresses.push(address);
        }
    }
    
    addresses
}
```

---

## Stack Inspection

### Stack Frame Inspection
```
inspect_stack_frame(frame_pointer) -> StackFrame {
    StackFrame {
        frame_pointer: frame_pointer,
        return_address: memory.read(frame_pointer + 8),
        saved_fp: memory.read(frame_pointer),
        local_variables: read_local_variables(frame_pointer),
        arguments: read_arguments(frame_pointer),
    }
}
```

### Stack Trace
```
inspect_stack_trace() -> Vec<StackFrame> {
    mut frames = Vec::new();
    mut current_fp = FP;
    
    while (current_fp != 0) {
        frame = inspect_stack_frame(current_fp);
        frames.push(frame);
        current_fp = frame.saved_fp;
    }
    
    frames
}
```

### Stack Inspection
```
inspect_stack() -> StackState {
    StackState {
        stack_pointer: SP,
        stack_size: stack_size(),
        stack_contents: memory.read_range(stack_start, SP),
    }
}
```

---

## Cognitive State Inspection

### Knowledge Inspection
```
inspect_knowledge() -> KnowledgeState {
    KnowledgeState {
        knowledge_base: knowledge_base.clone(),
        knowledge_count: knowledge_base.count(),
        last_updated: knowledge_base.last_updated(),
    }
}
```

### Belief Inspection
```
inspect_beliefs() -> BeliefState {
    BeliefState {
        beliefs: belief_set.clone(),
        belief_count: belief_set.count(),
        confidence_distribution: calculate_confidence_distribution(),
    }
}
```

### Hypothesis Inspection
```
inspect_hypotheses() -> HypothesisState {
    HypothesisState {
        hypotheses: hypothesis_set.clone(),
        hypothesis_count: hypothesis_set.count(),
        validation_status: get_validation_status(),
    }
}
```

### Evidence Inspection
```
inspect_evidence() -> EvidenceState {
    EvidenceState {
        evidence: evidence_log.clone(),
        evidence_count: evidence_log.count(),
        sources: get_evidence_sources(),
    }
}
```

### Decision Inspection
```
inspect_decisions() -> DecisionState {
    DecisionState {
        decisions: decision_log.clone(),
        decision_count: decision_log.count(),
        criteria: get_decision_criteria(),
    }
}
```

---

## State Comparison

### State Diff
```
diff_states(state1, state2) -> StateDiff {
    StateDiff {
        register_diff: diff_registers(state1.registers, state2.registers),
        memory_diff: diff_memory(state1.memory, state2.memory),
        cognitive_diff: diff_cognitive_state(state1.cognitive, state2.cognitive),
    }
}
```

---

## State Statistics

### Metrics
- State inspection latency (time to inspect state)
- State size (bytes)

### Counters
- Register inspections
- Memory inspections
- Stack inspections
- Cognitive state inspections
