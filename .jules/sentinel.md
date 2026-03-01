## 2026-03-01 - Preventing Role Injection and IDOR

**Vulnerability:** API endpoints were susceptible to Insecure Direct Object Reference (IDOR) and role injection via client-provided headers.
**Learning:** In a Next.js environment with Supabase, relying on headers for user identity is only secure if the middleware explicitly sanitizes those headers before injecting verified values. Malicious clients can otherwise "spoof" their identity or role.
**Prevention:**
1. Always strip all incoming `x-user-*` headers in the middleware before setting them from a trusted session.
2. Implement strict ownership checks in API handlers (e.g., `currentUserId === resource.userId`) and never trust the `userId` provided in the request body for `POST`/`PUT` operations without validation.
