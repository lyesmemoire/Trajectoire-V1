# CVM-005: Instruction Cache

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the instruction cache in Cognitive Virtual Machine

---

## Purpose

The instruction cache provides fast access to frequently used instructions, reducing memory access latency and improving performance.

---

## Cache Architecture

### Cache Parameters
- Size: 32KB
- Line size: 64 bytes
- Associativity: 4-way set associative
- Sets: 128 sets
- Ways: 4 ways per set

### Cache Organization
```
┌─────────────────────────────────────┐
│         Instruction Cache            │
├─────────────────────────────────────┤
│  Set 0: [Way0, Way1, Way2, Way3]   │
│  Set 1: [Way0, Way1, Way2, Way3]   │
│  ...                                 │
│  Set 127: [Way0, Way1, Way2, Way3] │
└─────────────────────────────────────┘
```

---

## Cache Line Structure

### Cache Line
```
struct CacheLine {
    valid: bool;           // Valid bit
    tag: u32;             // Tag (address bits)
    data: [u8; 64];      // Cache line data (64 bytes)
    dirty: bool;          // Dirty bit (for write-back)
    lru: u2;              // LRU counter (2 bits for 4-way)
}
```

### Address Mapping
```
Address: [Tag: 20 bits][Set: 7 bits][Offset: 6 bits]
```

---

## Cache Operations

### Cache Read
```
cache_read(address) -> data {
    set = extract_set(address);
    tag = extract_tag(address);
    offset = extract_offset(address);
    
    for way in 0..3 {
        if (cache[set][way].valid && cache[set][way].tag == tag) {
            // Cache hit
            update_lru(set, way);
            return cache[set][way].data[offset];
        }
    }
    
    // Cache miss
    data = memory_read(address);
    cache_line_fill(set, tag, data);
    return data;
}
```

### Cache Write
```
cache_write(address, data) {
    set = extract_set(address);
    tag = extract_tag(address);
    offset = extract_offset(address);
    
    for way in 0..3 {
        if (cache[set][way].valid && cache[set][way].tag == tag) {
            // Cache hit
            cache[set][way].data[offset] = data;
            cache[set][way].dirty = true;
            update_lru(set, way);
            return;
        }
    }
    
    // Cache miss
    cache_line_fill(set, tag, data);
    cache[set][way].dirty = true;
}
```

---

## Cache Replacement Policy

### LRU (Least Recently Used)
- Track access order with LRU counter
- Replace least recently used line on miss

### LRU Update
```
update_lru(set, way) {
    for w in 0..3 {
        if (w != way) {
            cache[set][w].lru = (cache[set][w].lru + 1) % 4;
        }
    }
    cache[set][way].lru = 0;
}
```

### LRU Replacement
```
lru_replace(set) -> way {
    for way in 0..3 {
        if (cache[set][way].lru == 3) {
            return way;
        }
    }
}
```

---

## Cache Line Fill

### Fill Operation
```
cache_line_fill(set, tag, data) {
    way = lru_replace(set);
    
    if (cache[set][way].dirty) {
        // Write back dirty line
        write_back(set, way);
    }
    
    cache[set][way].valid = true;
    cache[set][way].tag = tag;
    cache[set][way].data = data;
    cache[set][way].dirty = false;
    cache[set][way].lru = 0;
}
```

### Write Back
```
write_back(set, way) {
    address = reconstruct_address(set, cache[set][way].tag);
    memory_write(address, cache[set][way].data);
    cache[set][way].dirty = false;
}
```

---

## Cache Prefetching

### Sequential Prefetch
- Prefetch next cache line on access
- Reduces cache misses for sequential code

### Prefetch Operation
```
prefetch_next(address) {
    next_address = address + CACHE_LINE_SIZE;
    set = extract_set(next_address);
    tag = extract_tag(next_address);
    
    if (!cache_line_present(set, tag)) {
        cache_line_fill(set, tag, memory_read(next_address));
    }
}
```

---

## Cache Coherence

### Cache Coherence Protocol
- MESI protocol (Modified, Exclusive, Shared, Invalid)
- Ensures data consistency across caches

### MESI States
- **M (Modified)**: Line modified, not in memory
- **E (Exclusive)**: Line exclusive to this cache
- **S (Shared)**: Line shared with other caches
- **I (Invalid)**: Line invalid

---

## Cache Statistics

### Metrics
- Hit rate (hits / total accesses)
- Miss rate (misses / total accesses)
- Average access time
- Cache utilization

### Counters
- Cache hits
- Cache misses
- Cache reads
- Cache writes
- Prefetches

---

## Cache Debugging

### Cache Tracing
- Trace cache hits
- Trace cache misses
- Trace cache fills
- Trace write backs

### Cache Inspection
- Inspect cache state
- Inspect cache lines
- Inspect LRU counters
- Inspect dirty bits
