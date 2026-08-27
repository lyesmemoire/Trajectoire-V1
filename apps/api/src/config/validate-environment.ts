export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const nodeEnv =
    typeof config.NODE_ENV === 'string'
      ? config.NODE_ENV
      : 'development';

  if (nodeEnv !== 'production') {
    return config;
  }

  const required = [
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'OPENAI_API_KEY',
    'ALLOWED_ORIGINS',
  ] as const;

  const missing = required.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`,
    );
  }

  const redisPort = Number(config.REDIS_PORT);

  if (
    !Number.isInteger(redisPort) ||
    redisPort < 1 ||
    redisPort > 65535
  ) {
    throw new Error(
      'REDIS_PORT must be an integer between 1 and 65535 in production',
    );
  }

  const allowedOrigins = String(config.ALLOWED_ORIGINS)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    throw new Error(
      'ALLOWED_ORIGINS must contain at least one origin in production',
    );
  }

  for (const origin of allowedOrigins) {
    let parsed: URL;

    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(
        'ALLOWED_ORIGINS contains an invalid URL in production',
      );
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(
        'ALLOWED_ORIGINS must contain only http(s) origins in production',
      );
    }

    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1' ||
      parsed.hostname === '[::1]'
    ) {
      throw new Error(
        'ALLOWED_ORIGINS must not contain localhost in production',
      );
    }
  }

  return config;
}
