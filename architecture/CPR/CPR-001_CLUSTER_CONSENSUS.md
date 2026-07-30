# CPR-001: Cluster Consensus

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the cluster consensus mechanism in Cognitive Processing Runtime

---

## Purpose

The cluster consensus mechanism ensures that all nodes in the cluster agree on the state of the system, providing strong consistency guarantees for distributed operations.

---

## Consensus Algorithm

### Raft Algorithm
CPR uses the Raft consensus algorithm for cluster consensus.

### Raft Roles
- **Leader**: Manages cluster coordination, accepts client requests
- **Follower**: Receives requests from leader, replicates log
- **Candidate**: Candidate for leadership during election

---

## Consensus State

### Persistent State
```
struct PersistentState {
    current_term: u64;
    voted_for: Option<NodeID>;
    log: Vec<LogEntry>;
}
```

### Volatile State (Leader)
```
struct LeaderVolatileState {
    next_index: HashMap<NodeID, u64>;
    match_index: HashMap<NodeID, u64>;
}
```

### Volatile State (All)
```
struct AllVolatileState {
    commit_index: u64;
    last_applied: u64;
}
```

---

## Log Entry Structure

### Log Entry
```
struct LogEntry {
    index: u64;
    term: u64;
    command: Command;
    cognitive_state: CognitiveState;
}
```

### Command Types
- **CognitiveOperation**: Cognitive operation command
- **StateUpdate**: State update command
- **Transaction**: Transaction command
- **Snapshot**: Snapshot command

---

## Leader Election

### Election Process
```
start_election() {
    persistent_state.current_term++;
    persistent_state.voted_for = Some(self.id);
    reset_election_timer();
    
    // Request votes from all nodes
    for node in cluster.nodes {
        send_request_vote(node);
    }
}
```

### Request Vote
```
request_vote(term, candidate_id, last_log_index, last_log_term) -> VoteResponse {
    if (term < persistent_state.current_term) {
        return VoteResponse { term: persistent_state.current_term, vote_granted: false };
    }
    
    if (voted_for.is_none() || voted_for == Some(candidate_id)) {
        if (log_is_up_to_date(last_log_index, last_log_term)) {
            persistent_state.voted_for = Some(candidate_id);
            reset_election_timer();
            return VoteResponse { term: term, vote_granted: true };
        }
    }
    
    return VoteResponse { term: persistent_state.current_term, vote_granted: false };
}
```

### Vote Result
```
on_vote_response(response) {
    if (response.vote_granted) {
        votes_received++;
        if (votes_received > majority()) {
            become_leader();
        }
    } else if (response.term > persistent_state.current_term) {
        become_follower(response.term);
    }
}
```

---

## Log Replication

### Append Entries
```
append_entries(term, leader_id, prev_log_index, prev_log_term, entries, leader_commit) -> AppendEntriesResponse {
    if (term < persistent_state.current_term) {
        return AppendEntriesResponse { term: persistent_state.current_term, success: false };
    }
    
    if (log_contains_entry(prev_log_index, prev_log_term)) {
        // Append new entries
        for entry in entries {
            if (log[entry.index].term != entry.term) {
                log.truncate(entry.index);
                log.append(entry);
            }
        }
        
        // Update commit index
        if (leader_commit > commit_index) {
            commit_index = min(leader_commit, log.last().index);
        }
        
        reset_heartbeat_timer();
        return AppendEntriesResponse { term: term, success: true };
    }
    
    return AppendEntriesResponse { term: persistent_state.current_term, success: false };
}
```

### Log Consistency Check
```
log_contains_entry(index, term) -> bool {
    if (index >= log.len()) {
        return false;
    }
    return log[index].term == term;
}
```

---

## Commit Mechanism

### Commit Process
```
commit_log_entry(index) {
    if (index > commit_index) {
        commit_index = index;
        
        // Apply committed entries
        while (last_applied < commit_index) {
            last_applied++;
            apply_log_entry(log[last_applied]);
        }
    }
}
```

### Apply Log Entry
```
apply_log_entry(entry) {
    match entry.command {
        Command::CognitiveOperation(op) => {
            execute_cognitive_operation(op);
        }
        Command::StateUpdate(update) => {
            apply_state_update(update);
        }
        Command::Transaction(tx) => {
            execute_transaction(tx);
        }
        Command::Snapshot(snapshot) => {
            apply_snapshot(snapshot);
        }
    }
}
```

---

## Cognitive State Replication

### Cognitive State in Log
Each log entry includes the cognitive state at the time of the operation.

### Cognitive State Consistency
- Cognitive state is replicated across all nodes
- Cognitive state is applied in log order
- Cognitive state is consistent with committed log

---

## Consensus Guarantees

### Safety Guarantees
- **Election Safety**: At most one leader per term
- **Leader Append-Only**: Leader never overwrites or deletes entries
- **Log Matching**: If two logs contain an entry with same index and term, all preceding entries are identical
- **Leader Completeness**: If a log entry is committed in a term, it appears in all future leaders' logs
- **State Machine Safety**: If a server has applied a log entry at a given index, no other server will apply a different log entry at the same index

### Liveness Guarantees
- **Leader Election**: A leader is eventually elected if the majority of servers can communicate
- **Log Availability**: If a leader is elected, it will eventually have all committed entries
- **Commit Availability**: If a log entry is committed, it will eventually be applied to all servers

---

## Consensus Statistics

### Metrics
- Election time (time to elect new leader)
- Commit latency (time to commit log entry)
- Replication lag (lag between leader and followers)
- Consensus throughput (entries per second)

### Counters
- Elections held
- Votes cast
- Log entries replicated
- Log entries committed
- Log entries applied

---

## Consensus Debugging

### Consensus Tracing
- Trace election process
- Trace vote requests
- Trace log replication
- Trace commit process

### Consensus Inspection
- Inspect persistent state
- Inspect volatile state
- Inspect log entries
- Inspect commit index
