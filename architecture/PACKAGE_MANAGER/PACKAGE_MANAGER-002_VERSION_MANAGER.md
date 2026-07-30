# PACKAGE_MANAGER-002: Version Manager

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the version manager in Package Manager

---

## Purpose

The version manager manages semantic versioning and version constraints for packages.

---

## Semantic Versioning

### Version Format
```
struct Version {
    major: u32,
    minor: u32,
    patch: u32,
    pre_release: Option<String>,
    build_metadata: Option<String>,
}
```

### Version Parsing
```
parse_version(version_string) -> Version {
    // Parse semantic version string
    parts = version_string.split('.');
    
    Version {
        major: parts[0].parse(),
        minor: parts[1].parse(),
        patch: parts[2].parse(),
        pre_release: extract_pre_release(version_string),
        build_metadata: extract_build_metadata(version_string),
    }
}
```

---

## Version Constraints

### Constraint Types
- **Exact**: Exact version match
- **Greater Than**: Version greater than specified
- **Less Than**: Version less than specified
- **Range**: Version within range
- **Compatible With**: Compatible with specified version

### Constraint Parsing
```
parse_constraint(constraint_string) -> VersionConstraint {
    match constraint_string {
        s if s.starts_with('=') => {
            VersionConstraint::Exact(parse_version(&s[1..]))
        }
        s if s.starts_with('>') => {
            VersionConstraint::GreaterThan(parse_version(&s[1..]))
        }
        s if s.starts_with('<') => {
            VersionConstraint::LessThan(parse_version(&s[1..]))
        }
        s if s.contains('~') => {
            VersionConstraint::CompatibleWith(parse_version(&s[1..]))
        }
        _ => {
            VersionConstraint::Exact(parse_version(constraint_string))
        }
    }
}
```

---

## Version Comparison

### Version Comparison
```
compare_versions(version1, version2) -> Ordering {
    // Compare major version
    match version1.major.cmp(&version2.major) {
        Ordering::Equal => {}
        ordering => return ordering,
    }
    
    // Compare minor version
    match version1.minor.cmp(&version2.minor) {
        Ordering::Equal => {}
        ordering => return ordering,
    }
    
    // Compare patch version
    match version1.patch.cmp(&version2.patch) {
        Ordering::Equal => {}
        ordering => return ordering,
    }
    
    // Compare pre-release
    match (version1.pre_release, version2.pre_release) {
        (Some(pre1), Some(pre2)) => {
            pre1.cmp(pre2)
        }
        (Some(_), None) => Ordering::Less,
        (None, Some(_)) => Ordering::Greater,
        (None, None) => Ordering::Equal,
    }
}
```

---

## Version Satisfaction

### Constraint Satisfaction
```
satisfies_constraint(version, constraint) -> bool {
    match constraint {
        VersionConstraint::Exact(expected_version) => {
            compare_versions(version, expected_version) == Ordering::Equal
        }
        VersionConstraint::GreaterThan(min_version) => {
            compare_versions(version, min_version) == Ordering::Greater
        }
        VersionConstraint::LessThan(max_version) => {
            compare_versions(version, max_version) == Ordering::Less
        }
        VersionConstraint::Range(min_version, max_version) => {
            compare_versions(version, min_version) == Ordering::Greater &&
            compare_versions(version, max_version) == Ordering::Less
        }
        VersionConstraint::CompatibleWith(base_version) => {
            is_compatible(version, base_version)
        }
    }
}
```

### Compatibility Check
```
is_compatible(version, base_version) -> bool {
    // Compatible if major version matches and version >= base_version
    if (version.major != base_version.major) {
        return false;
    }
    
    if (version.minor < base_version.minor) {
        return false;
    }
    
    true
}
```

---

## Version Manager Statistics

### Metrics
- Version parsing time (time to parse versions)
- Constraint satisfaction time (time to check satisfaction)
- Version comparison time (time to compare versions)

### Counters
- Versions parsed
- Constraints parsed
- Comparisons performed
- Satisfactions checked
