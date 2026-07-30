# AUTO_GENERATED-005: Diagram Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the diagram generator in Auto-Generated Components system

---

## Purpose

The diagram generator generates architecture diagrams for all contracts.

---

## Diagram Generation

### Diagram Generation
```
generate_diagram(contract) -> Diagram {
    Diagram {
        name: contract.name,
        diagram_type: DiagramType::Architecture,
        nodes: generate_diagram_nodes(contract),
        edges: generate_diagram_edges(contract),
        layout: generate_diagram_layout(contract),
    }
}
```

### Node Generation
```
generate_diagram_nodes(contract) -> Vec<DiagramNode> {
    mut nodes = Vec::new();
    
    // Generate type nodes
    for type_def in contract.types {
        node = DiagramNode {
            id: type_def.name,
            label: type_def.name,
            node_type: NodeType::Type,
            position: calculate_node_position(type_def),
        };
        nodes.push(node);
    }
    
    // Generate service nodes
    for service in contract.services {
        node = DiagramNode {
            id: service.name,
            label: service.name,
            node_type: NodeType::Service,
            position: calculate_node_position(service),
        };
        nodes.push(node);
    }
    
    nodes
}
```

### Edge Generation
```
generate_diagram_edges(contract) -> Vec<DiagramEdge> {
    mut edges = Vec::new();
    
    // Generate dependency edges
    for dependency in contract.dependencies {
        edge = DiagramEdge {
            from: dependency.from,
            to: dependency.to,
            edge_type: EdgeType::Dependency,
            label: dependency.relationship,
        };
        edges.push(edge);
    }
    
    edges
}
```

---

## Diagram Layout

### Layout Generation
```
generate_diagram_layout(contract) -> DiagramLayout {
    DiagramLayout {
        layout_type: LayoutType::Hierarchical,
        direction: LayoutDirection::TopToBottom,
        spacing: LayoutSpacing {
            node_spacing: 100,
            level_spacing: 150,
        },
    }
}
```

---

## Diagram Formats

### Mermaid Generation
```
generate_mermaid_diagram(contract) -> String {
    mut mermaid = String::new();
    
    mermaid.push_str("graph TD\n");
    
    // Generate nodes
    for node in contract.nodes {
        mermaid.push_str(&format!("    {}[{}]\n", node.id, node.label));
    }
    
    // Generate edges
    for edge in contract.edges {
        mermaid.push_str(&format!("    {} --> {}\n", edge.from, edge.to));
    }
    
    mermaid
}
```

### PlantUML Generation
```
generate_plantuml_diagram(contract) -> String {
    mut plantuml = String::new();
    
    plantuml.push_str("@startuml\n");
    
    // Generate nodes
    for node in contract.nodes {
        plantuml.push_str(&format!("class {} {{\n}}\n", node.label));
    }
    
    // Generate edges
    for edge in contract.edges {
        plantuml.push_str(&format!("{} --> {}\n", edge.from, edge.to));
    }
    
    plantuml.push_str("@enduml\n");
    
    plantuml
}
```

---

## Diagram Statistics

### Metrics
- Diagram generation time (time to generate diagram)
- Diagram size (bytes)
- Node count (nodes in diagram)
- Edge count (edges in diagram)

### Counters
- Diagrams generated
- Nodes generated
- Edges generated
