-- RLS Smoke Tests
-- Run with: psql $DATABASE_URL -f supabase/tests/rls_smoke.sql
-- Or via: pnpm db:rls:check (requires local Supabase or DATABASE_URL)
-- CI: workflow_dispatch via .github/workflows/rls-check.yml
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
-- Exclude internal schema management tables (Prisma and Supabase migration tracking).
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
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
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

-- ----------------------------------------------------------------
-- Test 5: Verify profiles table has RLS (if it exists)
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 5: Profiles table RLS check:'
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'profiles' AND c.relrowsecurity = true
    ) THEN 'PASS: profiles table has RLS enabled'
    WHEN EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'profiles'
    ) THEN 'FAIL: profiles table exists but RLS is NOT enabled'
    ELSE 'SKIP: profiles table does not exist yet'
  END AS result;

-- ----------------------------------------------------------------
-- Test 6: Summary — count tables with/without RLS
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 6: RLS coverage summary:'
SELECT
  COUNT(*) FILTER (WHERE c.relrowsecurity = true) AS rls_enabled,
  COUNT(*) FILTER (WHERE c.relrowsecurity = false) AS rls_disabled,
  COUNT(*) AS total_tables
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname NOT IN ('schema_migrations', '_prisma_migrations');

-- ----------------------------------------------------------------
-- Test 7: Sanity check — verify the public schema has tables at all
-- Prevents false confidence if the test runs against an empty database.
-- ----------------------------------------------------------------
\echo ''
\echo 'Test 7: Sanity check — public schema has tables:'
SELECT
  CASE
    WHEN (
      SELECT COUNT(*) FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
        AND c.relname NOT IN ('schema_migrations', '_prisma_migrations')
    ) > 0 THEN 'PASS: public schema has user tables — RLS results are meaningful'
    ELSE 'WARN: no user tables in public schema — RLS tests may be vacuously passing'
  END AS result;

\echo ''
\echo '=== RLS Smoke Tests Complete ==='
