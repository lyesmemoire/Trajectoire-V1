# CVM-008: Branch Prediction

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define branch prediction in Cognitive Virtual Machine

---

## Purpose

Branch prediction predicts the outcome of conditional branches to keep the pipeline full and improve performance.

---

## Branch Prediction Architecture

### Branch Predictor State
```
struct BranchPredictor {
    bht: BranchHistoryTable;      // Branch History Table
    btb: BranchTargetBuffer;      // Branch Target Buffer
    ras: ReturnAddressStack;      // Return Address Stack
    prediction_accuracy: f64;
}
```

---

## Prediction Types

### Static Prediction
- Predict based on opcode
- Always predict not taken (default)
- Always predict taken (for loops)

### Dynamic Prediction
- Predict based on history
- Use branch history table
- Use branch target buffer

### Hybrid Prediction
- Combine static and dynamic
- Use meta-predictor to select best predictor

---

## Branch History Table (BHT)

### BHT Structure
```
struct BranchHistoryTable {
    entries: [BHTEntry; 1024];  // 1024 entries
}

struct BHTEntry {
    history: u2;                // 2-bit saturating counter
    last_prediction: bool;
    last_outcome: bool;
}
```

### 2-Bit Saturating Counter
```
00: Strongly not taken
01: Weakly not taken
10: Weakly taken
11: Strongly taken
```

### BHT Update
```
update_bht(address, taken) {
    index = hash(address) % BHT_SIZE;
    entry = bht.entries[index];
    
    if (taken) {
        if (entry.history < 3) {
            entry.history++;
        }
    } else {
        if (entry.history > 0) {
            entry.history--;
        }
    }
    
    entry.last_outcome = taken;
    bht.entries[index] = entry;
}
```

### BHT Prediction
```
predict_bht(address) -> bool {
    index = hash(address) % BHT_SIZE;
    entry = bht.entries[index];
    
    prediction = (entry.history >= 2);
    entry.last_prediction = prediction;
    bht.entries[index] = entry;
    
    return prediction;
}
```

---

## Branch Target Buffer (BTB)

### BTB Structure
```
struct BranchTargetBuffer {
    entries: [BTBEntry; 256];  // 256 entries
}

struct BTBEntry {
    valid: bool;
    tag: u32;
    target: u64;
    type: BranchType;
}
```

### Branch Types
```
enum BranchType {
    Conditional,
    Unconditional,
    Indirect,
    Call,
    Return,
}
```

### BTB Lookup
```
lookup_btb(address) -> Option<u64> {
    index = hash(address) % BTB_SIZE;
    entry = btb.entries[index];
    
    if (entry.valid && entry.tag == extract_tag(address)) {
        return Some(entry.target);
    }
    
    return None;
}
```

### BTB Update
```
update_btb(address, target, branch_type) {
    index = hash(address) % BTB_SIZE;
    entry = btb.entries[index];
    
    entry.valid = true;
    entry.tag = extract_tag(address);
    entry.target = target;
    entry.type = branch_type;
    
    btb.entries[index] = entry;
}
```

---

## Return Address Stack (RAS)

### RAS Structure
```
struct ReturnAddressStack {
    stack: [u64; 16];  // 16 entries
    top: u8;
}
```

### RAS Push
```
ras_push(address) {
    if (ras.top < 16) {
        ras.stack[ras.top] = address;
        ras.top++;
    }
}
```

### RAS Pop
```
ras_pop() -> Option<u64> {
    if (ras.top > 0) {
        ras.top--;
        return Some(ras.stack[ras.top]);
    }
    return None;
}
```

---

## Prediction Algorithm

### Combined Prediction
```
predict_branch(address, branch_type) -> BranchPrediction {
    prediction = BranchPrediction::new();
    
    // Check BTB for target
    prediction.target = lookup_btb(address);
    
    // Predict direction based on branch type
    match branch_type {
        BranchType::Conditional => {
            prediction.taken = predict_bht(address);
        }
        BranchType::Unconditional => {
            prediction.taken = true;
        }
        BranchType::Indirect => {
            prediction.taken = true;
            prediction.target = predict_indirect_target(address);
        }
        BranchType::Call => {
            prediction.taken = true;
            ras_push(address + INSTRUCTION_SIZE);
        }
        BranchType::Return => {
            prediction.taken = true;
            prediction.target = ras_pop();
        }
    }
    
    return prediction;
}
```

---

## Prediction Update

### Update on Branch Resolution
```
update_prediction(address, taken, actual_target) {
    // Update BHT
    update_bht(address, taken);
    
    // Update BTB
    update_btb(address, actual_target, branch_type);
    
    // Update accuracy
    if (taken == last_prediction.taken) {
        prediction_accuracy = update_accuracy(prediction_accuracy, true);
    } else {
        prediction_accuracy = update_accuracy(prediction_accuracy, false);
    }
}
```

---

## Misprediction Handling

### Misprediction Detection
```
detect_misprediction(address, predicted, actual) -> bool {
    if (predicted.taken != actual.taken) {
        return true;
    }
    if (predicted.taken && predicted.target != actual.target) {
        return true;
    }
    return false;
}
```

### Misprediction Recovery
```
recover_misprediction(mispredicted_address) {
    // Flush pipeline
    flush_pipeline();
    
    // Restore correct PC
    PC = actual_target;
    
    // Rollback speculative execution
    rollback_speculation();
    
    // Update prediction
    update_prediction(mispredicted_address, actual.taken, actual.target);
}
```

---

## Prediction Statistics

### Metrics
- Prediction accuracy (correct predictions / total predictions)
- Misprediction rate (mispredictions / total branches)
- BTB hit rate (BTB hits / total branches)
- RAS hit rate (RAS hits / total returns)

### Counters
- Branches executed
- Branches predicted
- Branches mispredicted
- BTB hits
- BTB misses
- RAS hits
- RAS misses

---

## Branch Prediction Debugging

### Prediction Tracing
- Trace branch predictions
- Trace prediction updates
- Trace mispredictions
- Trace recovery

### Prediction Inspection
- Inspect BHT state
- Inspect BTB state
- Inspect RAS state
- Inspect prediction accuracy
