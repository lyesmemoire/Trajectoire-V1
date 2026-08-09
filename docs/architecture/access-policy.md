# Access Policy

**Version:** 1.0  
**Date:** 2026-08-05  
**Status:** Official Reference

---

## Overview

This document defines the official access levels and feature permissions for the Trajectoire application. It serves as the single source of truth for access control decisions across the entire platform.

---

## Access Levels

### FREE

**Description:** Default access level for all authenticated users. No subscription required.

**Features:**

- **Dashboard** - Main user dashboard with progress tracking
- **Analyse CV** - CV analysis and scoring
- **Analyse Job** - Job description analysis
- **Matching** - CV-to-job matching algorithm
- **Search** - Job and candidate search functionality
- **Copilot** - AI-powered career assistant
- **Knowledge Graph** - Career path visualization
- **Profil candidat** - Candidate profile management
- **Profil poste** - Job position profile management

**Limitations:**

- Limited monthly quota for CV analyses
- Basic reports only
- Limited history retention
- Standard AI model access

**Route Access:** `AccessLevel.AUTHENTICATED`

---

### PREMIUM

**Description:** Enhanced access level for users with active subscription. Unlocks advanced features and removes limitations.

**Features:**

- **Export PDF** - Full PDF export functionality
- **Export DOCX** - Word document export
- **Export Excel** - Spreadsheet export for data analysis
- **Historique illimité** - Unlimited history retention
- **Rapports avancés** - Advanced reporting with detailed insights
- **Simulations illimitées** - Unlimited interview simulations
- **Assistant IA avancé** - Advanced AI assistant with premium models
- **Rapports RH** - HR-specific reports and analytics
- **API avancée** - Advanced API access with higher rate limits

**Additional Benefits:**

- Priority support
- Early access to new features
- Custom branding options
- Team collaboration tools

**Route Access:** `AccessLevel.AUTHENTICATED` (premium features gated at component level)

**Implementation:** Premium features are not gated at the middleware level. Instead, components check subscription status and display upgrade prompts when premium features are accessed without subscription.

---

### ADMIN

**Description:** Administrative access level for platform management and monitoring.

**Features:**

- **Gestion utilisateurs** - User management and moderation
- **Gestion abonnements** - Subscription management and billing
- **Dashboard Admin** - Administrative dashboard
- **Monitoring** - System monitoring and health checks
- **Logs** - Access to application logs
- **Configuration** - System configuration management

**Responsibilities:**

- User support and account recovery
- Subscription troubleshooting
- System maintenance
- Security monitoring
- Performance optimization

**Route Access:** `AccessLevel.ADMIN`

**Implementation:** Admin routes require authentication and admin role verification. Role checking is performed at the route level (pages/API) with middleware handling authentication only.

---

## PUBLIC

**Description:** No authentication required. Accessible to all visitors.

**Features:**

- Landing page
- Marketing pages (features, pricing, FAQ, about, contact, blog)
- Authentication pages (login, signup)
- Public API endpoints (auth callbacks, health checks, webhooks)
- Static assets (favicon, robots.txt, sitemap)

**Route Access:** `AccessLevel.PUBLIC`

---

## Access Control Architecture

### Middleware Level

The middleware (`apps/web/src/middleware.ts`) handles route-level authentication:

- **PUBLIC** - No checks, direct access
- **AUTHENTICATED** - Supabase authentication required
- **ADMIN** - Supabase authentication + admin role check

### Component Level

Premium features are gated at the component level using:

- `usePremium()` hook - Checks subscription status
- `useSubscription()` hook - Detailed subscription information
- `UpgradeCTA` component - Displays upgrade prompt
- `BlurOverlay` component - Blurs premium content with upgrade option

### API Level

API routes implement additional checks:

- `/api/auth/check-access` - Internal middleware access check (deprecated)
- `/api/user/subscription` - Client-side subscription status
- `/api/auth/sync-user` - User profile synchronization

---

## Route Classification

### Public Routes

```
/                          - Landing page
/features                 - Features page
/pricing                  - Pricing page
/faq                      - FAQ page
/about                    - About page
/contact                  - Contact page
/blog                     - Blog
/login                    - Login page
/signup                   - Signup page
/auth/*                   - Auth callbacks
/api/auth/*               - Auth API endpoints
/api/stripe/webhook       - Stripe webhook (CRITICAL)
/api/health               - Health check
/_next/*                  - Next.js assets
/static/*                 - Static files
```

### Authenticated Routes (FREE)

```
/onboarding               - User onboarding
/dashboard                - Main dashboard
/analyze                  - CV analysis
/search                   - Search functionality
/copilot                  - AI copilot
/simulation               - Interview simulation
/report/*                 - Report viewing
/history                  - History
/settings                 - User settings
/api/cv                   - CV API
/api/user                 - User API
/api/simulation           - Simulation API
/api/report               - Report API
/api/interview            - Interview API
```

### Admin Routes

```
/admin                    - Admin dashboard
/api/admin                - Admin API endpoints
```

---

## User Flow

### New User Journey

1. **Landing** → Browse features and pricing
2. **Signup** → Create account
3. **Email Confirmation** → Verify email address
4. **Login** → Authenticate with Supabase
5. **Onboarding** → Complete profile setup
6. **Dashboard** → Access FREE features
7. **Premium Feature Access** → Prompt to upgrade
8. **Pricing** → Subscribe to premium
9. **Premium Access** → Unlock all features

### Premium Upgrade Flow

1. User attempts to access premium feature
2. Component checks subscription status via `usePremium()`
3. If not premium, display `UpgradeCTA` or `BlurOverlay`
4. User clicks upgrade button
5. Navigate to `/pricing` page
6. User selects plan and completes checkout via Stripe
7. Webhook updates subscription in database
8. User gains premium access
9. Premium features become available

---

## Security Considerations

### Fail-Open vs Fail-Closed

- **Middleware**: Fail-open for unknown routes (defaults to PUBLIC)
- **Premium Features**: Fail-closed (require explicit subscription check)
- **Admin Routes**: Fail-closed (require explicit role verification)

### Rate Limiting

- FREE users: Standard rate limits
- PREMIUM users: Increased rate limits
- ADMIN users: No rate limits for admin operations

### Data Isolation

- User data isolated by user ID
- Admin access requires explicit authorization
- Premium data accessible only to premium users

---

## Implementation Guidelines

### Adding New Features

1. **Determine Access Level** - Consult this document
2. **Route Classification** - Add to middleware `ROUTE_ACCESS` registry
3. **Component Gating** - Use `usePremium()` for premium features
4. **API Protection** - Add appropriate checks in API routes
5. **Documentation** - Update this document

### Modifying Access Levels

1. **Review Impact** - Check all affected routes and components
2. **Update Middleware** - Modify `ROUTE_ACCESS` registry
3. **Update Components** - Adjust gating logic if needed
4. **Update Documentation** - Reflect changes in this document
5. **Communicate Changes** - Notify users if access is restricted

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-05 | Initial access policy definition |

---

## Related Documents

- [Middleware Architecture](../middleware.md)
- [Authentication Flow](../authentication.md)
- [Subscription Management](../subscription.md)
- [API Documentation](../api.md)

---

**Maintained By:** Architecture Team  
**Review Cycle:** Quarterly  
**Next Review:** 2026-11-05
