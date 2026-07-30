# DUPLICATION_ELIMINATION-005: Duplication Reporter

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the duplication reporter in Duplication Elimination system

---

## Purpose

The duplication reporter reports detected duplications in various formats.

---

## Report Generation

### Report Structure
```
struct DuplicationReport {
    id: ReportID,
    timestamp: u64,
    contract_duplications: Vec<ContractDuplication>,
    type_duplications: Vec<TypeDuplication>,
    event_duplications: Vec<EventDuplication>,
    state_duplications: Vec<StateDuplication>,
    graph_duplications: Vec<GraphDuplication>,
    algorithm_duplications: Vec<AlgorithmDuplication>,
    invariant_duplications: Vec<InvariantDuplication>,
    rule_duplications: Vec<RuleDuplication>,
    summary: ReportSummary,
}
```

### Report Summary
```
struct ReportSummary {
    total_duplications: u32,
    by_category: HashMap<String, u32>,
    severity_distribution: HashMap<Severity, u32>,
}
```

---

## Report Formats

### Markdown Report
```
generate_markdown_report(report) -> String {
    mut markdown = String::new();
    
    markdown.push_str("# Duplication Report\n\n");
    markdown.push_str(&format!("Generated: {}\n\n", report.timestamp));
    
    // Summary
    markdown.push_str("## Summary\n\n");
    markdown.push_str(&format!("Total Duplications: {}\n\n", report.summary.total_duplications));
    
    // Contract duplications
    if (!report.contract_duplications.is_empty()) {
        markdown.push_str("## Contract Duplications\n\n");
        for duplication in report.contract_duplications {
            markdown.push_str(&format!("- {}: {} occurrences\n", duplication.name, duplication.contracts.len()));
        }
        markdown.push_str("\n");
    }
    
    // Type duplications
    if (!report.type_duplications.is_empty()) {
        markdown.push_str("## Type Duplications\n\n");
        for duplication in report.type_duplications {
            markdown.push_str(&format!("- {}: {} occurrences\n", duplication.name, duplication.types.len()));
        }
        markdown.push_str("\n");
    }
    
    markdown
}
```

### JSON Report
```
generate_json_report(report) -> String {
    serde_json::to_string_pretty(report).unwrap()
}
```

### HTML Report
```
generate_html_report(report) -> String {
    mut html = String::new();
    
    html.push_str("<html><body>\n");
    html.push_str("<h1>Duplication Report</h1>\n");
    html.push_str(&format!("<p>Generated: {}</p>\n", report.timestamp));
    
    // Summary
    html.push_str("<h2>Summary</h2>\n");
    html.push_str(&format!("<p>Total Duplications: {}</p>\n", report.summary.total_duplications));
    
    html.push_str("</body></html>\n");
    
    html
}
```

---

## Report Statistics

### Metrics
- Report generation time (time to generate report)
- Report size (bytes)
- Duplication severity distribution

### Counters
- Reports generated
- Duplications reported
