# TRACE-004: Provider Tracer

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the provider tracer in Trace Engine

---

## Purpose

The provider tracer traces provider interactions including LLM calls and tool calls.

---

## LLM Call Tracer

### LLM Call Trace Structure
```
struct LLMCallTrace {
    id: LLMCallID,
    trace_id: TraceID,
    span_id: SpanID,
    provider: ProviderID,
    model: String,
    prompt: String,
    response: Option<String>,
    timestamp: u64,
    latency: u64,
    tokens: TokenUsage,
    success: bool,
    error: Option<String>,
    metadata: LLMCallMetadata,
}
```

### Token Usage
```
struct TokenUsage {
    input_tokens: u32,
    output_tokens: u32,
    total_tokens: u32,
}
```

### LLM Call Tracing
```
trace_llm_call(trace_id, span_id, provider, model, prompt) -> LLMCallID {
    llm_call = LLMCallTrace {
        id: generate_llm_call_id(),
        trace_id: trace_id,
        span_id: span_id,
        provider: provider,
        model: model,
        prompt: prompt,
        response: None,
        timestamp: current_time(),
        latency: 0,
        tokens: TokenUsage { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
        success: false,
        error: None,
        metadata: LLMCallMetadata::default(),
    };
    
    llm_call_traces.insert(llm_call.id, llm_call);
    return llm_call.id;
}
```

### LLM Call Completion
```
complete_llm_call(llm_call_id, response, latency, tokens, success, error) {
    llm_call = llm_call_traces.get_mut(llm_call_id);
    llm_call.response = Some(response);
    llm_call.latency = latency;
    llm_call.tokens = tokens;
    llm_call.success = success;
    llm_call.error = error;
}
```

---

## Tool Call Tracer

### Tool Call Trace Structure
```
struct ToolCallTrace {
    id: ToolCallID,
    trace_id: TraceID,
    span_id: SpanID,
    tool: ToolID,
    parameters: ToolParameters,
    result: Option<ToolResult>,
    timestamp: u64,
    latency: u64,
    success: bool,
    error: Option<String>,
    metadata: ToolCallMetadata,
}
```

### Tool Call Tracing
```
trace_tool_call(trace_id, span_id, tool, parameters) -> ToolCallID {
    tool_call = ToolCallTrace {
        id: generate_tool_call_id(),
        trace_id: trace_id,
        span_id: span_id,
        tool: tool,
        parameters: parameters,
        result: None,
        timestamp: current_time(),
        latency: 0,
        success: false,
        error: None,
        metadata: ToolCallMetadata::default(),
    };
    
    tool_call_traces.insert(tool_call.id, tool_call);
    return tool_call.id;
}
```

### Tool Call Completion
```
complete_tool_call(tool_call_id, result, latency, success, error) {
    tool_call = tool_call_traces.get_mut(tool_call_id);
    tool_call.result = Some(result);
    tool_call.latency = latency;
    tool_call.success = success;
    tool_call.error = error;
}
```

---

## Provider Statistics

### Metrics
- LLM call throughput (calls per second)
- Tool call throughput (calls per second)
- Average latency (time per call)
- Success rate (successful calls / total calls)

### Counters
- LLM calls traced
- Tool calls traced
- Successful calls
- Failed calls
