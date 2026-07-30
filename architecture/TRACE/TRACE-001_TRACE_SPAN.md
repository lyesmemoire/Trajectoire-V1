# TRACE-001: Trace & Span

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the trace and span generation in Trace Engine

---

## Purpose

The trace and span generation component creates traces and spans for every instruction and operation, providing a complete execution flow representation.

---

## Trace Structure

### Trace Definition
```
struct Trace {
    id: TraceID;
    root_span_id: SpanID,
    start_time: u64,
    end_time: u64,
    spans: HashMap<SpanID, Span>,
    metadata: TraceMetadata,
}
```

### Trace Metadata
```
struct TraceMetadata {
    trace_type: TraceType,
    source: TraceSource,
    tags: HashMap<String, String>,
    attributes: HashMap<String, Value>,
}
```

---

## Span Structure

### Span Definition
```
struct Span {
    id: SpanID,
    parent_id: Option<SpanID>,
    trace_id: TraceID,
    name: String,
    span_kind: SpanKind,
    start_time: u64,
    end_time: u64,
    status: SpanStatus,
    events: Vec<SpanEvent>,
    links: Vec<SpanLink>,
    attributes: HashMap<String, Value>,
}
```

### Span Kind
```
enum SpanKind {
    Internal,
    Server,
    Client,
    Producer,
    Consumer,
}
```

### Span Status
```
struct SpanStatus {
    status_code: StatusCode,
    description: Option<String>,
}
```

---

## Trace Generation

### Trace Creation
```
create_trace() -> TraceID {
    trace = Trace {
        id: generate_trace_id(),
        root_span_id: generate_span_id(),
        start_time: current_time(),
        end_time: 0,
        spans: HashMap::new(),
        metadata: TraceMetadata::default(),
    };
    
    traces.insert(trace.id, trace);
    return trace.id;
}
```

### Trace Completion
```
complete_trace(trace_id) {
    trace = traces.get_mut(trace_id);
    trace.end_time = current_time();
    
    // Export trace
    export_trace(trace);
}
```

---

## Span Generation

### Span Creation
```
create_span(trace_id, parent_id, name, span_kind) -> SpanID {
    span = Span {
        id: generate_span_id(),
        parent_id: parent_id,
        trace_id: trace_id,
        name: name,
        span_kind: span_kind,
        start_time: current_time(),
        end_time: 0,
        status: SpanStatus::default(),
        events: Vec::new(),
        links: Vec::new(),
        attributes: HashMap::new(),
    };
    
    trace = traces.get_mut(trace_id);
    trace.spans.insert(span.id, span);
    
    return span.id;
}
```

### Span Completion
```
complete_span(trace_id, span_id, status) {
    trace = traces.get_mut(trace_id);
    span = trace.spans.get_mut(span_id);
    span.end_time = current_time();
    span.status = status;
}
```

---

## Span Events

### Event Structure
```
struct SpanEvent {
    timestamp: u64,
    name: String,
    attributes: HashMap<String, Value>,
}
```

### Event Addition
```
add_span_event(trace_id, span_id, event) {
    trace = traces.get_mut(trace_id);
    span = trace.spans.get_mut(span_id);
    span.events.push(event);
}
```

---

## Span Links

### Link Structure
```
struct SpanLink {
    trace_id: TraceID,
    span_id: SpanID,
    attributes: HashMap<String, Value>,
}
```

### Link Addition
```
add_span_link(trace_id, span_id, link) {
    trace = traces.get_mut(trace_id);
    span = trace.spans.get_mut(span_id);
    span.links.push(link);
}
```

---

## Trace Statistics

### Metrics
- Trace duration (end_time - start_time)
- Span duration (end_time - start_time)
- Span count (number of spans per trace)
- Span depth (maximum span nesting depth)

### Counters
- Traces created
- Traces completed
- Spans created
- Spans completed
- Events added
- Links added
