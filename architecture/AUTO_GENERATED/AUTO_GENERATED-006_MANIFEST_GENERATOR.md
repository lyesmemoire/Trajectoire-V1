# AUTO_GENERATED-006: Manifest Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the manifest generator in Auto-Generated Components system

---

## Purpose

The manifest generator generates deployment manifests for all contracts.

---

## Manifest Generation

### Manifest Generation
```
generate_manifest(contract, platform) -> Manifest {
    match platform {
        Platform::Kubernetes => {
            generate_kubernetes_manifest(contract)
        }
        Platform::Docker => {
            generate_docker_manifest(contract)
        }
        Platform::Helm => {
            generate_helm_manifest(contract)
        }
        Platform::Terraform => {
            generate_terraform_manifest(contract)
        }
    }
}
```

### Manifest Structure
```
struct Manifest {
    name: String,
    platform: Platform,
    version: Version,
    resources: Vec<Resource>,
    configuration: Configuration,
    deployment: Deployment,
}
```

---

## Kubernetes Manifest Generation

### Kubernetes Manifest
```
generate_kubernetes_manifest(contract) -> KubernetesManifest {
    mut manifest = KubernetesManifest {
        api_version: "apps/v1",
        kind: "Deployment",
        metadata: Metadata {
            name: contract.name,
            labels: generate_labels(contract),
        },
        spec: Spec {
            replicas: 3,
            selector: Selector {
                match_labels: generate_labels(contract),
            },
            template: Template {
                metadata: Metadata {
                    labels: generate_labels(contract),
                },
                spec: PodSpec {
                    containers: vec![generate_container(contract)],
                },
            },
        },
    };
    
    manifest
}
```

### Container Generation
```
generate_container(contract) -> Container {
    Container {
        name: contract.name,
        image: format!("{}:{}", contract.image, contract.version),
        ports: generate_ports(contract),
        env: generate_environment_variables(contract),
        resources: generate_resource_requirements(contract),
    }
}
```

---

## Docker Manifest Generation

### Dockerfile Generation
```
generate_dockerfile(contract) -> Dockerfile {
    mut dockerfile = Dockerfile::new();
    
    // Base image
    dockerfile.add_instruction(Instruction::From(contract.base_image));
    
    // Dependencies
    for dependency in contract.dependencies {
        dockerfile.add_instruction(Instruction::Run(format!("apt-get install -y {}", dependency.package)));
    }
    
    // Copy application
    dockerfile.add_instruction(Instruction::Copy(".", "/app"));
    
    // Work directory
    dockerfile.add_instruction(Instruction::WorkDir("/app"));
    
    // Expose ports
    for port in contract.ports {
        dockerfile.add_instruction(Instruction::Expose(port));
    }
    
    // Command
    dockerfile.add_instruction(Instruction::Cmd(contract.command));
    
    dockerfile
}
```

---

## Helm Manifest Generation

### Helm Chart Generation
```
generate_helm_chart(contract) -> HelmChart {
    HelmChart {
        name: contract.name,
        version: contract.version,
        description: contract.description,
        values: generate_helm_values(contract),
        templates: generate_helm_templates(contract),
    }
}
```

### Values Generation
```
generate_helm_values(contract) -> HelmValues {
    HelmValues {
        image: Image {
            repository: contract.image,
            tag: contract.version,
            pull_policy: "IfNotPresent",
        },
        service: Service {
            type: "ClusterIP",
            port: contract.port,
        },
        resources: generate_resource_limits(contract),
    }
}
```

---

## Terraform Manifest Generation

### Terraform Module Generation
```
generate_terraform_module(contract) -> TerraformModule {
    TerraformModule {
        provider: "aws",
        resources: generate_terraform_resources(contract),
        variables: generate_terraform_variables(contract),
        outputs: generate_terraform_outputs(contract),
    }
}
```

### Resource Generation
```
generate_terraform_resources(contract) -> Vec<TerraformResource> {
    mut resources = Vec::new();
    
    // Generate EC2 instance
    resources.push(TerraformResource {
        resource_type: "aws_instance",
        name: contract.name,
        attributes: generate_instance_attributes(contract),
    });
    
    // Generate security group
    resources.push(TerraformResource {
        resource_type: "aws_security_group",
        name: format!("{}_sg", contract.name),
        attributes: generate_security_group_attributes(contract),
    });
    
    resources
}
```

---

## Manifest Statistics

### Metrics
- Manifest generation time (time to generate manifest)
- Manifest size (bytes)
- Platform coverage (platforms supported / total platforms)

### Counters
- Manifests generated
- Platforms supported
