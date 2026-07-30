# DEBUGGER-002: Step Controller

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the step controller in Cognitive Debugger

---

## Purpose

The step controller controls step-by-step execution at multiple levels: instruction, reasoning, graph, hypothesis, evidence, decision, and planner.

---

## Step Types

### Step Instruction
Step through individual instructions.

### Step Reasoning
Step through reasoning operations.

### Step Graph
Step through graph operations.

### Step Hypothesis
Step through hypothesis operations.

### Step Evidence
Step through evidence operations.

### Step Decision
Step through decision operations.

### Step Planner
Step through planning operations.

---

## Step Controller Structure

### Controller State
```
struct StepController {
    current_level: StepLevel,
    execution_state: ExecutionState,
    step_count: u32,
}
```

### Step Level
```
enum StepLevel {
    Instruction,
    Reasoning,
    Graph,
    Hypothesis,
    Evidence,
    Decision,
    Planner,
}
```

---

## Step Operations

### Step Instruction
```
step_instruction() -> StepResult {
    // Fetch current instruction
    instruction = fetch_instruction(PC);
    
    // Execute instruction
    result = execute_instruction(instruction);
    
    // Update PC
    PC = next_PC(instruction, result);
    
    // Update step count
    step_count++;
    
    StepResult {
        instruction: instruction,
        result: result,
        state: capture_state(),
    }
}
```

### Step Reasoning
```
step_reasoning() -> StepResult {
    // Find next reasoning operation
    reasoning_op = find_next_reasoning_operation(PC);
    
    // Execute reasoning operation
    result = execute_reasoning(reasoning_op);
    
    // Update PC to after reasoning operation
    PC = reasoning_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: reasoning_op,
        result: result,
        cognitive_state: capture_cognitive_state(),
    }
}
```

### Step Graph
```
step_graph() -> StepResult {
    // Find next graph operation
    graph_op = find_next_graph_operation(PC);
    
    // Execute graph operation
    result = execute_graph_operation(graph_op);
    
    // Update PC to after graph operation
    PC = graph_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: graph_op,
        result: result,
        graph_state: capture_graph_state(),
    }
}
```

### Step Hypothesis
```
step_hypothesis() -> StepResult {
    // Find next hypothesis operation
    hypothesis_op = find_next_hypothesis_operation(PC);
    
    // Execute hypothesis operation
    result = execute_hypothesis(hypothesis_op);
    
    // Update PC to after hypothesis operation
    PC = hypothesis_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: hypothesis_op,
        result: result,
        hypothesis_state: capture_hypothesis_state(),
    }
}
```

### Step Evidence
```
step_evidence() -> StepResult {
    // Find next evidence operation
    evidence_op = find_next_evidence_operation(PC);
    
    // Execute evidence operation
    result = execute_evidence(evidence_op);
    
    // Update PC to after evidence operation
    PC = evidence_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: evidence_op,
        result: result,
        evidence_state: capture_evidence_state(),
    }
}
```

### Step Decision
```
step_decision() -> StepResult {
    // Find next decision operation
    decision_op = find_next_decision_operation(PC);
    
    // Execute decision operation
    result = execute_decision(decision_op);
    
    // Update PC to after decision operation
    PC = decision_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: decision_op,
        result: result,
        decision_state: capture_decision_state(),
    }
}
```

### Step Planner
```
step_planner() -> StepResult {
    // Find next planner operation
    planner_op = find_next_planner_operation(PC);
    
    // Execute planner operation
    result = execute_planner(planner_op);
    
    // Update PC to after planner operation
    PC = planner_op.end_address;
    
    // Update step count
    step_count++;
    
    StepResult {
        operation: planner_op,
        result: result,
        planner_state: capture_planner_state(),
    }
}
```

---

## Step Over/Into/Out

### Step Over
Execute current function without stepping into called functions.

```
step_over() -> StepResult {
    if (current_instruction.is_call()) {
        // Set breakpoint after call
        return_address = PC + instruction_size;
        set_breakpoint(return_address, None);
        continue_execution();
    } else {
        step_instruction()
    }
}
```

### Step Into
Step into called functions.

```
step_into() -> StepResult {
    if (current_instruction.is_call()) {
        // Step into function
        PC = call_target;
    } else {
        step_instruction()
    }
}
```

### Step Out
Step out of current function.

```
step_out() -> StepResult {
    // Find return address
    return_address = find_return_address();
    
    // Set breakpoint at return address
    set_breakpoint(return_address, None);
    
    // Continue execution
    continue_execution();
}
```

---

## Step Statistics

### Metrics
- Step latency (time per step)
- Step throughput (steps per second)

### Counters
- Steps taken at each level
- Step overs
- Step intos
- Step outs
