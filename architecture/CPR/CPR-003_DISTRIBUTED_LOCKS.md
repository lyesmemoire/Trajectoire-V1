# CPR-003: Distributed Locks

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the distributed lock mechanism in Cognitive Processing Runtime

---

## Purpose

The distributed lock mechanism provides synchronization across cluster nodes, ensuring that critical operations are executed atomically and consistently.

---

## Lock Types

### Exclusive Lock
- Single holder
- No concurrent access
- Used for write operations

### Shared Lock
- Multiple readers
- No writers
- Used for read operations

### Upgrade Lock
- Read to write upgrade
- Single writer
- Multiple readers

### Timeout Lock
- Timeout-based lock
- Automatic release on timeout
- Used for operations with time limits

---

## Lock Structure

### Lock Definition
```
struct Lock {
    id: LockID;
    name: String;
    lock_type: LockType;
    holder: Option<NodeID>;
    holders: HashSet<NodeID>;  // For shared locks
    wait_queue: Vec<LockRequest>;
    acquired_at: Option<u64>;
    timeout: Option<u64>;
    cognitive_state: CognitiveLockState;
}
```

### Lock Request
```
struct LockRequest {
    requester: NodeID;
    lock_type: LockType;
    requested_at: u64;
    timeout: Option<u64>;
    cognitive_priority: u8;
}
```

---

## Lock Manager

### Lock Manager State
```
struct LockManager {
    locks: HashMap<LockID, Lock>;
    node_locks: HashMap<NodeID, HashSet<LockID>>;
    lock_timeout: u64;
}
```

---

## Lock Operations

### Acquire Lock
```
acquire_lock(lock_id, node_id, lock_type, timeout) -> LockResult {
    lock = locks.get(lock_id);
    
    if (lock.is_none()) {
        // Lock doesn't exist, create it
        lock = create_lock(lock_id, lock_type);
        locks.insert(lock_id, lock);
    }
    
    lock = locks.get(lock_id).unwrap();
    
    if (can_acquire_lock(lock, node_id, lock_type)) {
        // Acquire lock immediately
        grant_lock(lock, node_id, lock_type);
        return LockResult::Acquired;
    } else {
        // Add to wait queue
        request = LockRequest {
            requester: node_id,
            lock_type: lock_type,
            requested_at: current_time(),
            timeout: timeout,
            cognitive_priority: calculate_cognitive_priority(node_id),
        };
        lock.wait_queue.push(request);
        return LockResult::Queued;
    }
}
```

### Release Lock
```
release_lock(lock_id, node_id) {
    lock = locks.get(lock_id).unwrap();
    
    // Remove holder
    lock.holder = None;
    lock.holders.remove(node_id);
    lock.acquired_at = None;
    
    // Remove from node locks
    node_locks.get_mut(node_id).unwrap().remove(lock_id);
    
    // Grant lock to next waiter
    if (!lock.wait_queue.is_empty()) {
        next_request = select_next_request(lock.wait_queue);
        grant_lock(lock, next_request.requester, next_request.lock_type);
    }
}
```

---

## Lock Acquisition Logic

### Can Acquire Lock
```
can_acquire_lock(lock, node_id, lock_type) -> bool {
    match lock.lock_type {
        LockType::Exclusive => {
            lock.holder.is_none() || lock.holder == Some(node_id)
        }
        LockType::Shared => {
            lock.holder.is_none() || 
            (lock.holders.len() > 0 && !lock.holders.contains(node_id))
        }
        LockType::Upgrade => {
            lock.holder == Some(node_id) && lock.holders.contains(node_id)
        }
        LockType::Timeout => {
            lock.holder.is_none() || 
            (lock.holder == Some(node_id) && !is_timeout_expired(lock))
        }
    }
}
```

### Grant Lock
```
grant_lock(lock, node_id, lock_type) {
    lock.holder = Some(node_id);
    lock.holders.insert(node_id);
    lock.acquired_at = Some(current_time());
    
    node_locks.entry(node_id).or_insert(HashSet::new()).insert(lock.id);
    
    // Notify requester
    notify_lock_acquired(node_id, lock.id);
}
```

---

## Lock Timeout

### Timeout Handling
```
check_lock_timeouts() {
    for lock in locks.values() {
        if (lock.timeout.is_some()) {
            if (is_timeout_expired(lock)) {
                // Release lock due to timeout
                release_lock(lock.id, lock.holder.unwrap());
            }
        }
    }
}
```

### Timeout Check
```
is_timeout_expired(lock) -> bool {
    if (lock.acquired_at.is_none() || lock.timeout.is_none()) {
        return false;
    }
    
    elapsed = current_time() - lock.acquired_at.unwrap();
    elapsed > lock.timeout.unwrap()
}
```

---

## Cognitive Lock Priority

### Cognitive Priority Calculation
```
calculate_cognitive_priority(node_id) -> u8 {
    node = cluster.get_node(node_id);
    
    priority = 0;
    
    // Cognitive operation priority
    priority += node.cognitive_state.operation_priority * 0.5;
    
    // Cognitive state urgency
    priority += node.cognitive_state.urgency * 0.3;
    
    // Cognitive resource availability
    priority += node.cognitive_state.resource_availability * 0.2;
    
    return priority;
}
```

### Request Selection
```
select_next_request(wait_queue) -> LockRequest {
    // Sort by cognitive priority
    wait_queue.sort_by(|a, b| b.cognitive_priority.cmp(&a.cognitive_priority));
    
    // Select highest priority request
    wait_queue.remove(0)
}
```

---

## Deadlock Detection

### Deadlock Detection Algorithm
```
detect_deadlock() -> Vec<NodeID> {
    // Build wait-for graph
    graph = build_wait_for_graph();
    
    // Detect cycles
    cycles = detect_cycles(graph);
    
    // Return nodes in deadlock
    cycles.iter().flat_map(|cycle| cycle.iter()).cloned().collect()
}
```

### Deadlock Resolution
```
resolve_deadlock(deadlocked_nodes) {
    // Select victim (lowest priority)
    victim = select_victim(deadlocked_nodes);
    
    // Abort victim's locks
    for lock_id in node_locks.get(victim).unwrap() {
        release_lock(lock_id, victim);
    }
    
    // Notify victim
    notify_deadlock_abort(victim);
}
```

---

## Lock Statistics

### Metrics
- Lock acquisition time (time to acquire lock)
- Lock hold time (time lock is held)
- Lock wait time (time spent waiting)
- Lock contention (lock requests per second)

### Counters
- Locks acquired
- Locks released
- Lock timeouts
- Deadlocks detected
- Deadlocks resolved

---

## Lock Debugging

### Lock Tracing
- Trace lock acquisition
- Trace lock release
- Trace lock timeouts
- Trace deadlock detection

### Lock Inspection
- Inspect lock state
- Inspect wait queue
- Inspect node locks
- Inspect lock timeouts
