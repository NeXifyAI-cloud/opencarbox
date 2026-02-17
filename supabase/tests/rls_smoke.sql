-- RLS Smoke Tests
-- Run with: psql $DATABASE_URL -f supabase/tests/rls_smoke.sql
-- Or via: pnpm db:rls:check (requires local Supabase or DATABASE_URL)
--
-- These tests verify that Row Level Security is enabled on tables
-- that require it, and that expected policies exist.

\echo '=== RLS Smoke Tests ==='

-- ----------------------------------------------------------------
-- Test 1: Verify RLS is enabled on user-facing tables
-- This query lists all tables in the public schema where RLS is NOT enabled.
-- If any user-facing tables appear here, it is a security concern.
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 1: Tables in public schema WITHOUT RLS enabled (should be empty for user-facing tables):'
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('schema_migrations', '_prisma_migrations')
  AND tablename NOT IN (
    SELECT relname
    FROM pg_class
    WHERE relrowsecurity = true
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  )
ORDER BY tablename;

-- ----------------------------------------------------------------
-- Test 2: List all RLS-enabled tables (informational)
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 2: Tables with RLS enabled:'
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true
ORDER BY c.relname;

-- ----------------------------------------------------------------
-- Test 3: List all RLS policies (informational)
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 3: RLS policies defined:'
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ----------------------------------------------------------------
-- Test 4: Verify settings table has RLS (if it exists)
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 4: Settings table RLS check:'
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'settings' AND c.relrowsecurity = true
    ) THEN 'PASS: settings table has RLS enabled'
    WHEN EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'settings'
    ) THEN 'FAIL: settings table exists but RLS is NOT enabled'
    ELSE 'SKIP: settings table does not exist yet'
  END AS result;

\echo ''
\echo '=== RLS Smoke Tests Complete ==='
