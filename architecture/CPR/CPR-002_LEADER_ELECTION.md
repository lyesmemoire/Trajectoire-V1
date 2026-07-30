# CPR-002: Leader Election

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the leader election mechanism in Cognitive Processing Runtime

---

## Purpose

The leader election mechanism ensures that the cluster always has a single leader to coordinate operations, with automatic failover when the leader fails.

---

## Election Triggers

### Election Triggers
- **Initial Startup**: No leader exists
- **Leader Failure**: Leader heartbeat timeout
- **Leader Partition**: Leader becomes unreachable
- **Manual Trigger**: Manual election request

---

## Election Process

### Candidate Nomination
```
become_candidate() {
    // Increment term
    persistent_state.current_term++;
    
    // Vote for self
    persistent_state.voted_for = Some(self.id);
    
    // Reset election timer
    reset_election_timer();
    
    // Transition to candidate state
    state = Candidate;
    
    // Request votes from all nodes
    for node in cluster.nodes {
        if (node.id != self.id) {
            send_request_vote(node);
        }
    }
}
```

### Vote Request
```
send_request_vote(node) {
    request = RequestVote {
        term: persistent_state.current_term,
        candidate_id: self.id,
        last_log_index: log.last().index,
        last_log_term: log.last().term,
    };
    
    send_to_node(node, request);
}
```

### Vote Response Handling
```
on_vote_response(node, response) {
    if (response.term > persistent_state.current_term) {
        // Newer term discovered
        become_follower(response.term);
        return;
    }
    
    if (response.vote_granted) {
        votes_received++;
        
        // Check if majority achieved
        if (votes_received > majority_count()) {
            become_leader();
        }
    }
}
```

---

## Leader Transition

### Become Leader
```
become_leader() {
    // Transition to leader state
    state = Leader;
    
    // Initialize leader state
    for node in cluster.nodes {
        if (node.id != self.id) {
            next_index.insert(node.id, log.last().index + 1);
            match_index.insert(node.id, 0);
        }
    }
    
    // Start heartbeat timer
    reset_heartbeat_timer();
    
    // Send initial heartbeat
    send_heartbeat_to_all();
}
```

### Become Follower
```
become_follower(term) {
    // Update term
    persistent_state.current_term = term;
    persistent_state.voted_for = None;
    
    // Transition to follower state
    state = Follower;
    
    // Reset election timer
    reset_election_timer();
}
```

---

## Heartbeat Mechanism

### Heartbeat Sending
```
send_heartbeat_to_all() {
    for node in cluster.nodes {
        if (node.id != self.id) {
            send_heartbeat(node);
        }
    }
}

send_heartbeat(node) {
    heartbeat = AppendEntries {
        term: persistent_state.current_term,
        leader_id: self.id,
        prev_log_index: next_index[node.id] - 1,
        prev_log_term: log[next_index[node.id] - 1].term,
        entries: [],
        leader_commit: commit_index,
    };
    
    send_to_node(node, heartbeat);
}
```

### Heartbeat Receiving
```
on_heartbeat(heartbeat) {
    if (heartbeat.term > persistent_state.current_term) {
        become_follower(heartbeat.term);
    }
    
    if (state == Candidate && heartbeat.term == persistent_state.current_term) {
        // Another node won election
        become_follower(heartbeat.term);
    }
    
    if (state == Follower) {
        reset_election_timer();
    }
}
```

---

## Election Timer

### Election Timeout
- Randomized timeout: 150-300ms
- Prevents split votes
- Ensures quick election

### Timer Reset
```
reset_election_timer() {
    timeout = random(150, 300);
    election_timer.reset(timeout);
}
```

### Timer Expiry
```
on_election_timeout() {
    if (state == Follower || state == Candidate) {
        become_candidate();
    }
}
```

---

## Leader Failure Detection

### Failure Detection
- Heartbeat timeout
- Network partition detection
- Health check failure

### Failure Handling
```
on_leader_failure() {
    if (state == Follower) {
        // Start new election
        become_candidate();
    }
}
```

---

## Cognitive Leader Election

### Cognitive-Aware Election
- Consider cognitive state in election
- Prefer nodes with better cognitive resources
- Consider cognitive workload

### Cognitive Election Criteria
```
calculate_cognitive_priority(node) -> u8 {
    priority = 0;
    
    // Cognitive resources
    priority += node.cognitive_state.resources * 0.4;
    
    // Cognitive workload
    priority += (1.0 - node.cognitive_state.workload) * 0.3;
    
    // Cognitive state consistency
    priority += node.cognitive_state.consistency * 0.3;
    
    return priority;
}
```

---

## Election Statistics

### Metrics
- Election time (time to elect new leader)
- Election frequency (elections per hour)
- Leader tenure (average time as leader)
- Failover time (time to detect and recover from failure)

### Counters
- Elections held
- Votes cast
- Votes received
- Leader transitions
- Failover events

---

## Election Debugging

### Election Tracing
- Trace election start
- Trace vote requests
- Trace vote responses
- Trace leader transition
- Trace failover events

### Election Inspection
- Inspect current term
- Inspect voted_for
- Inspect votes received
- Inspect election timer
- Inspect leader state
