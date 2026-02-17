-- RLS Smoke Tests
-- Validates that Row Level Security is enabled and policies exist for key tables.
-- Run against a Supabase database: psql $DATABASE_URL -f supabase/tests/rls_smoke.sql
--
-- Expected: All checks return TRUE. Any FALSE indicates a misconfiguration.

DO $$
DECLARE
  _table TEXT;
  _has_rls BOOLEAN;
  _policy_count INT;
  _errors INT := 0;
  _tables TEXT[] := ARRAY[
    'profiles',
    'vehicles',
    'categories',
    'products',
    'product_vehicle_compatibility',
    'orders',
    'order_items',
    'services',
    'appointments',
    'vehicles_for_sale',
    'chat_conversations',
    'chat_messages',
    'project_memory',
    'audit_logs'
  ];
BEGIN
  RAISE NOTICE '=== RLS Smoke Tests ===';

  FOREACH _table IN ARRAY _tables LOOP
    -- Check RLS is enabled
    SELECT relrowsecurity INTO _has_rls
    FROM pg_class
    WHERE relname = _table AND relnamespace = 'public'::regnamespace;

    IF _has_rls IS NULL THEN
      RAISE NOTICE 'SKIP  %-35s table not found', _table;
      CONTINUE;
    END IF;

    IF NOT _has_rls THEN
      RAISE WARNING 'FAIL  %-35s RLS not enabled', _table;
      _errors := _errors + 1;
    ELSE
      RAISE NOTICE 'PASS  %-35s RLS enabled', _table;
    END IF;

    -- Check at least one policy exists
    SELECT COUNT(*) INTO _policy_count
    FROM pg_policies
    WHERE tablename = _table AND schemaname = 'public';

    IF _policy_count = 0 THEN
      RAISE WARNING 'FAIL  %-35s no policies found', _table;
      _errors := _errors + 1;
    ELSE
      RAISE NOTICE 'PASS  %-35s % policies found', _table, _policy_count;
    END IF;
  END LOOP;

  RAISE NOTICE '=== Results: % errors ===', _errors;

  IF _errors > 0 THEN
    RAISE EXCEPTION 'RLS smoke tests failed with % error(s)', _errors;
  END IF;
END $$;
