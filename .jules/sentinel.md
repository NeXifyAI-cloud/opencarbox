## 2026-02-25 - API Authorization Gap in Middleware
**Vulnerability:** Missing authorization for sensitive API endpoints (/api/users, /api/orders, /api/appointments) allowing public access to sensitive data and role escalation.
**Learning:** Next.js middleware matchers that rely on specific path prefixes (like `/api/admin/*`) are fragile. When new API routes are added outside these prefixes, they are unprotected by default. Additionally, standard middleware often incorrectly redirects API requests to a login page instead of returning 401/403 JSON.
**Prevention:** Implement a robust middleware that explicitly handles API routes by returning JSON error responses. Regularly audit the `config.matcher` and `protectedPaths` map when adding new API routes.
