# DUPLICATION_ELIMINATION-002: Event & State Analyzer

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the event and state analyzer in Duplication Elimination system

---

## Purpose

The event and state analyzer analyzes event and state definitions for duplication.

---

## Event Analysis

### Event Duplication Detection
```
detect_event_duplication(events) -> Vec<EventDuplication> {
    mut duplications = Vec::new();
    
    // Group events by name
    mut event_groups: HashMap<String, Vec<Event>> = HashMap::new();
    for event in events {
        event_groups.entry(event.name.clone()).or_insert(Vec::new()).push(event);
    }
    
    // Detect duplications within groups
    for (name, group) in event_groups {
        if (group.len() > 1) {
            duplication = EventDuplication {
                name: name,
                events: group,
                canonical: select_canonical_event(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### Event Similarity Detection
```
detect_event_similarity(events) -> Vec<EventSimilarity> {
    mut similarities = Vec::new();
    
    // Compare all pairs of events
    for i in 0..events.len() {
        for j in (i+1)..events.len() {
            similarity = calculate_event_similarity(events[i], events[j]);
            if (similarity > SIMILARITY_THRESHOLD) {
                similarity = EventSimilarity {
                    event1: events[i].clone(),
                    event2: events[j].clone(),
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

## State Analysis

### State Duplication Detection
```
detect_state_duplication(states) -> Vec<StateDuplication> {
    mut duplications = Vec::new();
    
    // Group states by name
    mut state_groups: HashMap<String, Vec<State>> = HashMap::new();
    for state in states {
        state_groups.entry(state.name.clone()).or_insert(Vec::new()).push(state);
    }
    
    // Detect duplications within groups
    for (name, group) in state_groups {
        if (group.len() > 1) {
            duplication = StateDuplication {
                name: name,
                states: group,
                canonical: select_canonical_state(group),
            };
            duplications.push(duplication);
        }
    }
    
    duplications
}
```

### State Similarity Detection
```
detect_state_similarity(states) -> Vec<StateSimilarity> {
    mut similarities = Vec::new();
    
    // Compare all pairs of states
    for i in 0..states.len() {
        for j in (i+1)..states.len() {
            similarity = calculate_state_similarity(states[i], states[j]);
            if (similarity > SIMILARITY_THRESHOLD) {
                similarity = StateSimilarity {
                    state1: states[i].clone(),
                    state2: states[j].clone(),
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
- Event duplication rate (duplicate events / total events)
- State duplication rate (duplicate states / total states)
- Event similarity rate (similar events / total event pairs)
- State similarity rate (similar states / total state pairs)

### Counters
- Events analyzed
- States analyzed
- Event duplications detected
- State duplications detected
