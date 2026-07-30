# Sentry Environment Variables

Add the following variables to your environment configuration:

```bash
# Sentry DSN (Client - for browser errors)
NEXT_PUBLIC_SENTRY_DSN=

# Sentry DSN (Server - for backend errors)
SENTRY_DSN=

# Sentry Auth Token (for source maps upload)
SENTRY_AUTH_TOKEN=

# Sentry Organization
SENTRY_ORG=

# Sentry Project
SENTRY_PROJECT=
```

## Setup Instructions

1. Create a Sentry project at https://sentry.io
2. Get your DSN from Sentry project settings
3. Add the variables to your `.env.local` file
4. The Sentry SDK will automatically capture errors in production
