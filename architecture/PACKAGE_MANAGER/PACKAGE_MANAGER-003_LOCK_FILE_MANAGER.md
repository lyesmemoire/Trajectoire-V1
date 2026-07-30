# PACKAGE_MANAGER-003: Lock File Manager

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the lock file manager in Package Manager

---

## Purpose

The lock file manager manages lock files for reproducible builds and deterministic installs.

---

## Lock File Structure

### Lock File Format
```
struct LockFile {
    package_id: PackageID,
    version: Version,
    dependencies: Vec<LockedDependency>,
    checksum: String,
    timestamp: u64,
}
```

### Locked Dependency
```
struct LockedDependency {
    package_id: PackageID,
    version: Version,
    source: PackageSource,
    checksum: String,
}
```

---

## Lock File Generation

### Lock File Creation
```
create_lock_file(dependency_graph) -> LockFile {
    mut lock_file = LockFile {
        package_id: dependency_graph.root_package,
        version: dependency_graph.root_version,
        dependencies: Vec::new(),
        checksum: String::new(),
        timestamp: current_time(),
    };
    
    // Add locked dependencies
    for node in dependency_graph.nodes {
        locked_dep = LockedDependency {
            package_id: node.package_id,
            version: node.version,
            source: node.source,
            checksum: calculate_checksum(node),
        };
        lock_file.dependencies.push(locked_dep);
    }
    
    // Calculate checksum
    lock_file.checksum = calculate_lock_file_checksum(&lock_file);
    
    lock_file
}
```

### Checksum Calculation
```
calculate_checksum(package) -> String {
    // Calculate SHA256 checksum of package
    data = serialize_package(package);
    checksum = sha256(data);
    checksum
}
```

---

## Lock File Verification

### Lock File Verification
```
verify_lock_file(lock_file) -> bool {
    // Verify checksum
    expected_checksum = calculate_lock_file_checksum(lock_file);
    if (lock_file.checksum != expected_checksum) {
        return false;
    }
    
    // Verify all dependencies
    for dep in lock_file.dependencies {
        if (!verify_dependency_checksum(dep)) {
            return false;
        }
    }
    
    true
}
```

### Dependency Verification
```
verify_dependency_checksum(dependency) -> bool {
    // Get package from cache or download
    package = get_package(dependency.package_id, dependency.version);
    
    // Calculate checksum
    calculated_checksum = calculate_checksum(package);
    
    // Compare with locked checksum
    calculated_checksum == dependency.checksum
}
```

---

## Lock File Usage

### Install from Lock File
```
install_from_lock_file(lock_file) -> InstallResult {
    // Verify lock file
    if (!verify_lock_file(lock_file)) {
        return InstallResult::Failed { error: "Lock file verification failed" };
    }
    
    // Install each dependency
    for dep in lock_file.dependencies {
        result = install_package(dep.package_id, dep.version);
        if (!result.success) {
            return result;
        }
    }
    
    InstallResult::Success
}
```

### Update Lock File
```
update_lock_file(lock_file) -> LockFile {
    // Resolve dependencies again
    dependency_graph = resolve_dependencies(lock_file.package_id);
    
    // Generate new lock file
    new_lock_file = create_lock_file(dependency_graph);
    
    new_lock_file
}
```

---

## Lock File Statistics

### Metrics
- Lock file generation time (time to generate lock file)
- Lock file verification time (time to verify lock file)
- Lock file size (bytes)

### Counters
- Lock files created
- Lock files verified
- Lock files updated
