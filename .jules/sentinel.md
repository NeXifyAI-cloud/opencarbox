# Sentinel's Journal

## 2024-05-20 - [API Route Authorization & Header Spoofing Prevention]
**Vulnerability:** Many API routes (e.g., `/api/users`, `/api/orders`) were completely public, allowing unauthorized data access and privilege escalation.
**Learning:** Even with a middleware-based RBAC system, API routes can be vulnerable if the middleware doesn't explicitly protect all relevant paths and if it doesn't securely propagate user identity. Relying on headers like `x-user-id` is only secure if the middleware STRIPS them from the incoming client request first.
**Prevention:** Always use a "fail-safe" approach in middleware: strip sensitive headers from all incoming requests, and only re-inject them after successful session validation. Ensure API routes verify these headers and perform fine-grained authorization (e.g., checking if a user is updating their own record).
