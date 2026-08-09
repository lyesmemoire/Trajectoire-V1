export const productionConfig = {
  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),

  // Cache Configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
  CACHE_MAX: parseInt(process.env.CACHE_MAX || '1000', 10),

  // Rate Limiting
  RATE_LIMIT_TTL: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10), // 1 minute
  RATE_LIMIT_LIMIT: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),
  STRICT_RATE_LIMIT_TTL: parseInt(
    process.env.STRICT_RATE_LIMIT_TTL || '60000',
    10,
  ),
  STRICT_RATE_LIMIT_LIMIT: parseInt(
    process.env.STRICT_RATE_LIMIT_LIMIT || '20',
    10,
  ),
  GRAPH_RATE_LIMIT_TTL: parseInt(
    process.env.GRAPH_RATE_LIMIT_TTL || '60000',
    10,
  ),
  GRAPH_RATE_LIMIT_LIMIT: parseInt(
    process.env.GRAPH_RATE_LIMIT_LIMIT || '10',
    10,
  ),

  // Circuit Breaker
  CIRCUIT_FAILURE_THRESHOLD: parseInt(
    process.env.CIRCUIT_FAILURE_THRESHOLD || '5',
    10,
  ),
  CIRCUIT_SUCCESS_THRESHOLD: parseInt(
    process.env.CIRCUIT_SUCCESS_THRESHOLD || '2',
    10,
  ),
  CIRCUIT_TIMEOUT: parseInt(process.env.CIRCUIT_TIMEOUT || '10000', 10),
  CIRCUIT_RESET_TIMEOUT: parseInt(
    process.env.CIRCUIT_RESET_TIMEOUT || '60000',
    10,
  ),

  // Timeouts (in milliseconds)
  HTTP_TIMEOUT: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
  DATABASE_TIMEOUT: parseInt(process.env.DATABASE_TIMEOUT || '10000', 10),
  CACHE_TIMEOUT: parseInt(process.env.CACHE_TIMEOUT || '2000', 10),
  QUEUE_TIMEOUT: parseInt(process.env.QUEUE_TIMEOUT || '60000', 10),
  EXTERNAL_TIMEOUT: parseInt(process.env.EXTERNAL_TIMEOUT || '15000', 10),
  GRAPH_IMPORT_TIMEOUT: parseInt(
    process.env.GRAPH_IMPORT_TIMEOUT || '120000',
    10,
  ),
  GRAPH_QUERY_TIMEOUT: parseInt(process.env.GRAPH_QUERY_TIMEOUT || '30000', 10),
  GRAPH_VALIDATION_TIMEOUT: parseInt(
    process.env.GRAPH_VALIDATION_TIMEOUT || '10000',
    10,
  ),
  MATCHING_CALCULATE_TIMEOUT: parseInt(
    process.env.MATCHING_CALCULATE_TIMEOUT || '60000',
    10,
  ),
  MATCHING_SEARCH_TIMEOUT: parseInt(
    process.env.MATCHING_SEARCH_TIMEOUT || '30000',
    10,
  ),

  // Memory Limits (in bytes)
  MAX_HEAP_SIZE: parseInt(process.env.MAX_HEAP_SIZE || '536870912', 10), // 512 MB
  MAX_RSS: parseInt(process.env.MAX_RSS || '1073741824', 10), // 1 GB
  GC_INTERVAL: parseInt(process.env.GC_INTERVAL || '60000', 10), // 1 minute
  MEMORY_WARNING_THRESHOLD: parseFloat(
    process.env.MEMORY_WARNING_THRESHOLD || '0.7',
  ), // 70%
  MEMORY_CRITICAL_THRESHOLD: parseFloat(
    process.env.MEMORY_CRITICAL_THRESHOLD || '0.9',
  ), // 90%

  // Queue Configuration
  QUEUE_REMOVE_ON_COMPLETE: parseInt(
    process.env.QUEUE_REMOVE_ON_COMPLETE || '10',
    10,
  ),
  QUEUE_REMOVE_ON_FAIL: parseInt(process.env.QUEUE_REMOVE_ON_FAIL || '5', 10),
  QUEUE_ATTEMPTS: parseInt(process.env.QUEUE_ATTEMPTS || '3', 10),
  QUEUE_BACKOFF_DELAY: parseInt(process.env.QUEUE_BACKOFF_DELAY || '2000', 10),
  QUEUE_BACKOFF_TYPE: process.env.QUEUE_BACKOFF_TYPE || 'exponential',

  // Retry Configuration
  RETRY_MAX_ATTEMPTS: parseInt(process.env.RETRY_MAX_ATTEMPTS || '3', 10),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '1000', 10),
  RETRY_BACKOFF_MULTIPLIER: parseFloat(
    process.env.RETRY_BACKOFF_MULTIPLIER || '2',
  ),
  RETRY_MAX_DELAY: parseInt(process.env.RETRY_MAX_DELAY || '10000', 10),

  // Health Check
  HEALTH_CHECK_MEMORY_HEAP_THRESHOLD: parseInt(
    process.env.HEALTH_CHECK_MEMORY_HEAP_THRESHOLD || '157286400',
    10,
  ), // 150 MB
  HEALTH_CHECK_MEMORY_RSS_THRESHOLD: parseInt(
    process.env.HEALTH_CHECK_MEMORY_RSS_THRESHOLD || '157286400',
    10,
  ), // 150 MB
  HEALTH_CHECK_DISK_THRESHOLD: parseFloat(
    process.env.HEALTH_CHECK_DISK_THRESHOLD || '0.9',
  ), // 90%

  // Application
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT || '3000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
