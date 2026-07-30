# PACKAGE_MANAGER-007: Package Cache

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the package cache in Package Manager

---

## Purpose

The package cache caches packages for faster installs and reduced network bandwidth.

---

## Cache Structure

### Cache Storage
```
struct PackageCache {
    cache_dir: Path,
    max_size: u64,
    current_size: u64,
    entries: HashMap<PackageKey, CacheEntry>,
}
```

### Cache Entry
```
struct CacheEntry {
    package_id: PackageID,
    version: Version,
    path: Path,
    size: u64,
    last_accessed: u64,
    checksum: String,
}
```

### Package Key
```
struct PackageKey {
    package_id: PackageID,
    version: Version,
    platform: Platform,
}
```

---

## Cache Operations

### Cache Lookup
```
lookup_cache(package_id, version) -> Option<CacheEntry> {
    key = PackageKey {
        package_id: package_id,
        version: version,
        platform: current_platform(),
    };
    
    entry = cache.entries.get(key);
    
    if (entry.is_some()) {
        // Update last accessed time
        entry.last_accessed = current_time();
    }
    
    entry
}
```

### Cache Store
```
store_cache(package_id, version, package_data) -> CacheEntry {
    // Calculate checksum
    checksum = calculate_checksum(package_data);
    
    // Create cache entry
    entry = CacheEntry {
        package_id: package_id,
        version: version,
        path: generate_cache_path(package_id, version),
        size: package_data.len(),
        last_accessed: current_time(),
        checksum: checksum,
    };
    
    // Write package to cache
    write_to_cache(entry.path, package_data);
    
    // Add to cache
    cache.entries.insert(key, entry);
    cache.current_size += entry.size;
    
    // Evict if necessary
    if (cache.current_size > cache.max_size) {
        evict_entries();
    }
    
    entry
}
```

---

## Cache Eviction

### Eviction Policy
```
evict_entries() {
    // Sort entries by last accessed time
    mut entries = cache.entries.values().collect();
    entries.sort_by(|a, b| a.last_accessed.cmp(&b.last_accessed));
    
    // Evict least recently used entries
    while (cache.current_size > cache.max_size && !entries.is_empty()) {
        entry = entries.remove(0);
        remove_from_cache(entry);
    }
}
```

### Cache Removal
```
remove_from_cache(entry) {
    // Remove file from disk
    remove_file(entry.path);
    
    // Remove from cache
    key = PackageKey {
        package_id: entry.package_id,
        version: entry.version,
        platform: current_platform(),
    };
    cache.entries.remove(key);
    
    // Update size
    cache.current_size -= entry.size;
}
```

---

## Cache Statistics

### Metrics
- Cache hit rate (cache hits / total requests)
- Cache size (bytes)
- Cache utilization (current_size / max_size)

### Counters
- Cache hits
- Cache misses
- Cache evictions
