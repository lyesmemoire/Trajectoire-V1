# CPR-007: Distributed Scheduling

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the distributed scheduling mechanism in Cognitive Processing Runtime

---

## Purpose

The distributed scheduling mechanism manages task distribution across cluster nodes, ensuring optimal resource utilization and load balancing for cognitive operations.

---

## Scheduling Policies

### Round Robin Scheduling
- Fair distribution across nodes
- Simple implementation
- Good for uniform tasks

### Priority Scheduling
- Priority-based task assignment
- Higher priority tasks scheduled first
- Priority aging to prevent starvation

### Resource-Aware Scheduling
- Consider node resources (CPU, memory, GPU)
- Assign tasks to nodes with available resources
- Dynamic resource monitoring

### Cognitive-Aware Scheduling
- Consider cognitive state
- Assign tasks to nodes with relevant cognitive state
- Cognitive workload balancing

### Work Stealing
- Idle nodes steal tasks from busy nodes
- Dynamic load balancing
- Reduces load imbalance

---

## Scheduler Structure

### Scheduler State
```
struct DistributedScheduler {
    ready_queue: PriorityQueue<Task>;
    running_tasks: HashMap<TaskID, Task>;
    worker_nodes: HashMap<NodeID, WorkerNode>;
    scheduling_policy: SchedulingPolicy;
    load_balancer: LoadBalancer;
}
```

### Worker Node
```
struct WorkerNode {
    id: NodeID;
    address: String;
    resources: Resources;
    current_tasks: HashSet<TaskID>;
    cognitive_state: CognitiveState;
    load: f64;
}
```

---

## Task Scheduling

### Schedule Task
```
schedule_task(task) -> NodeID {
    // Select worker node based on policy
    node_id = select_worker_node(task, scheduling_policy);
    
    // Assign task to node
    assign_task_to_node(task.id, node_id);
    
    // Update node state
    worker_nodes.get_mut(node_id).unwrap().current_tasks.insert(task.id);
    worker_nodes.get_mut(node_id).unwrap().load = calculate_load(node_id);
    
    return node_id;
}
```

### Select Worker Node
```
select_worker_node(task, policy) -> NodeID {
    match policy {
        SchedulingPolicy::RoundRobin => {
            select_round_robin()
        }
        SchedulingPolicy::Priority => {
            select_priority(task)
        }
        SchedulingPolicy::ResourceAware => {
            select_resource_aware(task)
        }
        SchedulingPolicy::CognitiveAware => {
            select_cognitive_aware(task)
        }
        SchedulingPolicy::WorkStealing => {
            select_work_stealing()
        }
    }
}
```

---

## Resource-Aware Scheduling

### Resource Requirements
```
struct ResourceRequirements {
    cpu: f64;
    memory: u64;
    gpu: f64;
    cognitive: CognitiveResources;
}
```

### Select Resource-Aware Node
```
select_resource_aware(task) -> NodeID {
    best_node = None;
    best_score = 0.0;
    
    for node in worker_nodes.values() {
        // Check if node has sufficient resources
        if (node_has_sufficient_resources(node, task.requirements)) {
            // Calculate score based on resource utilization
            score = calculate_resource_score(node, task.requirements);
            
            if (score > best_score) {
                best_node = Some(node.id);
                best_score = score;
            }
        }
    }
    
    best_node.unwrap()
}
```

### Resource Score Calculation
```
calculate_resource_score(node, requirements) -> f64 {
    cpu_score = (node.resources.cpu - node.used_cpu) / requirements.cpu;
    memory_score = (node.resources.memory - node.used_memory) as f64 / requirements.memory as f64;
    gpu_score = (node.resources.gpu - node.used_gpu) / requirements.gpu;
    
    (cpu_score + memory_score + gpu_score) / 3.0
}
```

---

## Cognitive-Aware Scheduling

### Cognitive Requirements
```
struct CognitiveRequirements {
    knowledge_access: HashSet<KnowledgeID>;
    memory_access: HashSet<MemoryID>;
    cognitive_ops: Vec<CognitiveOp>;
}
```

### Select Cognitive-Aware Node
```
select_cognitive_aware(task) -> NodeID {
    best_node = None;
    best_score = 0.0;
    
    for node in worker_nodes.values() {
        // Calculate cognitive affinity score
        score = calculate_cognitive_affinity(node, task.cognitive_requirements);
        
        if (score > best_score) {
            best_node = Some(node.id);
            best_score = score;
        }
    }
    
    best_node.unwrap()
}
```

### Cognitive Affinity Score
```
calculate_cognitive_affinity(node, requirements) -> f64 {
    mut score = 0.0;
    
    // Knowledge locality
    for knowledge_id in requirements.knowledge_access {
        if (node.cognitive_state.has_knowledge(knowledge_id)) {
            score += 0.3;
        }
    }
    
    // Memory locality
    for memory_id in requirements.memory_access {
        if (node.cognitive_state.has_memory(memory_id)) {
            score += 0.3;
        }
    }
    
    // Cognitive operation compatibility
    for op in requirements.cognitive_ops {
        if (node.cognitive_state.supports_operation(op)) {
            score += 0.4;
        }
    }
    
    score
}
```

---

## Work Stealing

### Work Stealing Mechanism
```
work_steal() -> Option<Task> {
    // Find busiest node
    busiest_node = find_busiest_node();
    
    // Find idle node
    idle_node = find_idle_node();
    
    if (busiest_node.is_some() && idle_node.is_some()) {
        // Steal task from busiest node
        task = steal_task(busiest_node.unwrap());
        
        // Assign to idle node
        assign_task_to_node(task.id, idle_node.unwrap());
        
        return Some(task);
    }
    
    None
}
```

### Find Busiest Node
```
find_busiest_node() -> Option<NodeID> {
    let mut busiest = None;
    let mut max_load = 0.0;
    
    for node in worker_nodes.values() {
        if (node.load > max_load) {
            max_load = node.load;
            busiest = Some(node.id);
        }
    }
    
    busiest
}
```

### Find Idle Node
```
find_idle_node() -> Option<NodeID> {
    for node in worker_nodes.values() {
        if (node.load < IDLE_THRESHOLD) {
            return Some(node.id);
        }
    }
    None
}
```

---

## Load Balancing

### Load Balancing
```
balance_load() {
    // Calculate average load
    avg_load = calculate_average_load();
    
    // Find overloaded nodes
    overloaded_nodes = find_overloaded_nodes(avg_load);
    
    // Find underloaded nodes
    underloaded_nodes = find_underloaded_nodes(avg_load);
    
    // Redistribute tasks
    for overloaded_node in overloaded_nodes {
        for underloaded_node in underloaded_nodes {
            if (should_migrate_task(overloaded_node, underloaded_node)) {
                migrate_task(overloaded_node, underloaded_node);
            }
        }
    }
}
```

### Task Migration
```
migrate_task(from_node, to_node) {
    // Select task to migrate
    task = select_migratable_task(from_node);
    
    // Migrate task state
    migrate_task_state(task, from_node, to_node);
    
    // Update node states
    worker_nodes.get_mut(from_node).unwrap().current_tasks.remove(task.id);
    worker_nodes.get_mut(to_node).unwrap().current_tasks.insert(task.id);
    
    // Recalculate loads
    worker_nodes.get_mut(from_node).unwrap().load = calculate_load(from_node);
    worker_nodes.get_mut(to_node).unwrap().load = calculate_load(to_node);
}
```

---

## Scheduling Statistics

### Metrics
- Task throughput (tasks per second)
- Average task wait time
- Average task turnaround time
- Load imbalance (variance in node loads)
- Resource utilization (CPU, memory, GPU)

### Counters
- Tasks scheduled
- Tasks migrated
- Work steals
- Load balancing cycles
- Scheduling decisions

---

## Scheduling Debugging

### Scheduling Tracing
- Trace task scheduling
- Trace node selection
- Trace task migration
- Trace work stealing
- Trace load balancing

### Scheduling Inspection
- Inspect ready queue
- Inspect running tasks
- Inspect worker nodes
- Inspect node loads
- Inspect scheduling policy
