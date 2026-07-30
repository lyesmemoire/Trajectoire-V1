# AUTO_GENERATED-007: Package Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the package generator in Auto-Generated Components system

---

## Purpose

The package generator generates package definitions for all contracts.

---

## Package Generation

### Package Generation
```
generate_package(contract, package_format) -> Package {
    match package_format {
        PackageFormat::NPM => {
            generate_npm_package(contract)
        }
        PackageFormat::Cargo => {
            generate_cargo_package(contract)
        }
        PackageFormat::Maven => {
            generate_maven_package(contract)
        }
        PackageFormat::Python => {
            generate_python_package(contract)
        }
        PackageFormat::Go => {
            generate_go_package(contract)
        }
    }
}
```

### Package Structure
```
struct Package {
    name: String,
    version: Version,
    description: String,
    dependencies: Vec<Dependency>,
    files: Vec<PackageFile>,
    metadata: PackageMetadata,
}
```

---

## NPM Package Generation

### NPM Package Generation
```
generate_npm_package(contract) -> NPMPackage {
    NPMPackage {
        name: contract.name,
        version: contract.version.to_string(),
        description: contract.description,
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: generate_npm_scripts(contract),
        dependencies: generate_npm_dependencies(contract),
        dev_dependencies: generate_npm_dev_dependencies(contract),
    }
}
```

### NPM Scripts Generation
```
generate_npm_scripts(contract) -> HashMap<String, String> {
    mut scripts = HashMap::new();
    
    scripts.insert("build".to_string(), "tsc".to_string());
    scripts.insert("test".to_string(), "jest".to_string());
    scripts.insert("lint".to_string(), "eslint".to_string());
    
    scripts
}
```

---

## Cargo Package Generation

### Cargo Package Generation
```
generate_cargo_package(contract) -> CargoPackage {
    CargoPackage {
        package: CargoPackageInfo {
            name: contract.name,
            version: contract.version.to_string(),
            edition: "2021",
        },
        dependencies: generate_cargo_dependencies(contract),
        dev_dependencies: generate_cargo_dev_dependencies(contract),
        lib: CargoLib {
            name: contract.name,
            path: "src/lib.rs",
        },
    }
}
```

### Cargo Dependencies Generation
```
generate_cargo_dependencies(contract) -> HashMap<String, String> {
    mut dependencies = HashMap::new();
    
    for dependency in contract.dependencies {
        dependencies.insert(dependency.name, dependency.version);
    }
    
    dependencies
}
```

---

## Maven Package Generation

### Maven Package Generation
```
generate_maven_package(contract) -> MavenPackage {
    MavenPackage {
        group_id: contract.group_id,
        artifact_id: contract.name,
        version: contract.version.to_string(),
        dependencies: generate_maven_dependencies(contract),
        build: generate_maven_build(contract),
    }
}
```

### Maven Dependencies Generation
```
generate_maven_dependencies(contract) -> Vec<MavenDependency> {
    mut dependencies = Vec::new();
    
    for dependency in contract.dependencies {
        maven_dep = MavenDependency {
            group_id: dependency.group_id,
            artifact_id: dependency.artifact_id,
            version: dependency.version,
        };
        dependencies.push(maven_dep);
    }
    
    dependencies
}
```

---

## Python Package Generation

### Python Package Generation
```
generate_python_package(contract) -> PythonPackage {
    PythonPackage {
        name: contract.name,
        version: contract.version.to_string(),
        description: contract.description,
        packages: vec![contract.name],
        install_requires: generate_python_requirements(contract),
        python_requires: ">=3.8",
    }
}
```

### Python Requirements Generation
```
generate_python_requirements(contract) -> Vec<String> {
    mut requirements = Vec::new();
    
    for dependency in contract.dependencies {
        requirements.push(format!("{}=={}", dependency.name, dependency.version));
    }
    
    requirements
}
```

---

## Go Package Generation

### Go Package Generation
```
generate_go_package(contract) -> GoPackage {
    GoPackage {
        module: contract.module,
        go: "1.21",
        require: generate_go_requirements(contract),
    }
}
```

### Go Requirements Generation
```
generate_go_requirements(contract) -> Vec<GoRequirement> {
    mut requirements = Vec::new();
    
    for dependency in contract.dependencies {
        requirement = GoRequirement {
            path: dependency.path,
            version: dependency.version,
        };
        requirements.push(requirement);
    }
    
    requirements
}
```

---

## Package Statistics

### Metrics
- Package generation time (time to generate package)
- Package size (bytes)
- Format coverage (formats supported / total formats)

### Counters
- Packages generated
- Formats supported
