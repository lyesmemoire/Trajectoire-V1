# PROFILER-003: Token & Latency Profiler

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the token and latency profiler in Cognitive Profiler

---

## Purpose

The token and latency profiler measures token usage, token cost, operation latency, and end-to-end latency.

---

## Token Metrics

### Token Usage
```
struct TokenMetrics {
    input_tokens: u32,         // Input tokens
    output_tokens: u32,        // Output tokens
    total_tokens: u32,         // Total tokens
    token_rate: f64,           // Tokens per second
    token_cost: f64,           // Cost in currency
    token_efficiency: f64,     // Output / input ratio
}
```

### Token Profiling
```
profile_tokens(operation) -> TokenMetrics {
    TokenMetrics {
        input_tokens: count_input_tokens(operation),
        output_tokens: count_output_tokens(operation),
        total_tokens: count_total_tokens(operation),
        token_rate: calculate_token_rate(operation),
        token_cost: calculate_token_cost(operation),
        token_efficiency: calculate_token_efficiency(operation),
    }
}
```

---

## Latency Metrics

### Operation Latency
```
struct LatencyMetrics {
    operation_latency: u64,    // Operation latency in ms
    network_latency: u64,      // Network latency in ms
    provider_latency: u64,     // Provider latency in ms
    processing_latency: u64,   // Processing latency in ms
    end_to_end_latency: u64,   // End-to-end latency in ms
    latency_percentile: f64,   // Latency percentile
}
```

### Latency Profiling
```
profile_latency(operation) -> LatencyMetrics {
    LatencyMetrics {
        operation_latency: measure_operation_latency(operation),
        network_latency: measure_network_latency(operation),
        provider_latency: measure_provider_latency(operation),
        processing_latency: measure_processing_latency(operation),
        end_to_end_latency: measure_end_to_end_latency(operation),
        latency_percentile: calculate_latency_percentile(operation),
    }
}
```

---

## Token Tracking

### Token Counting
```
count_input_tokens(operation) -> u32 {
    mut tokenizer = Tokenizer::new();
    tokens = tokenizer.tokenize(operation.input);
    tokens.len() as u32
}
```

### Token Cost Calculation
```
calculate_token_cost(operation) -> f64 {
    input_cost = operation.input_tokens * input_token_price;
    output_cost = operation.output_tokens * output_token_price;
    input_cost + output_cost
}
```

---

## Latency Measurement

### Operation Latency
```
measure_operation_latency(operation) -> u64 {
    start_time = current_time();
    execute_operation(operation);
    end_time = current_time();
    end_time - start_time
}
```

### Network Latency
```
measure_network_latency(operation) -> u64 {
    start_time = current_time();
    send_request(operation);
    end_time = current_time();
    end_time - start_time
}
```

### Provider Latency
```
measure_provider_latency(operation) -> u64 {
    start_time = current_time();
    provider.execute(operation);
    end_time = current_time();
    end_time - start_time
}
```

---

## Statistics

### Metrics
- Average token usage
- Average latency
- Token cost per operation
- Latency distribution

### Counters
- Tokens profiled
- Latencies measured
