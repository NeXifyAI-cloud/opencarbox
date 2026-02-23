-- ========================================
-- OpenCarBox Supabase RLS Policies & Security
-- Repository: NeXifyAI-cloud/opencarbox
-- ========================================
-- This SQL script implements:
-- 1. Row Level Security (RLS) Policies for all tables
-- 2. JWT Claims validation
-- 3. Audit triggers for change tracking
-- 4. Sensitive data masking views
-- ========================================

-- ========================================
-- 1. ROLE DEFINITIONS
-- ========================================
-- Note: Roles are typically managed by Supabase Auth
-- This documents the expected role structure:
-- - anon: Unauthenticated users
-- - authenticated: Logged-in users
-- - admin: Team administrators
-- - service_role: Backend service (has ALL permissions, bypasses RLS)

-- ========================================
-- 2. JWT CLAIMS FUNCTIONS & HELPERS
-- ========================================

-- Get current user ID from JWT
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE SQL STABLE
AS $$
  SELECT
    COALESCE(
      (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid,
      (current_setting('request.jwt.claims', true)::jsonb->>'user_id')::uuid
    )
$$;

-- Get user role from JWT claims
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->>'role',
    'authenticated'
  )
$$;

-- Get user's team ID from JWT claims or users table
CREATE OR REPLACE FUNCTION auth.team_id() RETURNS uuid
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb->>'team_id')::uuid,
    (SELECT team_id FROM users WHERE id = auth.uid() LIMIT 1)
  )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean
LANGUAGE SQL STABLE
AS $$
  SELECT 
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'admin'
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE user_id = auth.uid()
        AND team_id = auth.team_id()
        AND role = 'admin'
        AND active = true
    )
$$;

-- ========================================
-- 3. AUDIT TRIGGER INFRASTRUCTURE
-- ========================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  operation text NOT NULL,  -- INSERT, UPDATE, DELETE
  old_values jsonb,         -- Previous values
  new_values jsonb,         -- New values
  changed_fields text[],    -- List of changed columns
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster audit queries
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  v_changed_fields text[];
  v_key text;
BEGIN
  -- Detect changed fields for UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    FOR v_key IN SELECT jsonb_object_keys(to_jsonb(NEW))
    LOOP
      IF (to_jsonb(OLD) ->> v_key) != (to_jsonb(NEW) ->> v_key) THEN
        v_changed_fields := array_append(v_changed_fields, v_key);
      END IF;
    END LOOP;
  END IF;

  -- Record to audit_logs
  INSERT INTO audit_logs (
    table_name,
    record_id,
    operation,
    old_values,
    new_values,
    changed_fields,
    user_id,
    user_email,
    ip_address
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE((NEW).id, (OLD).id)::uuid,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    v_changed_fields,
    auth.uid(),
    current_setting('request.jwt.claims', true)::jsonb->>'email',
    inet_client_addr()
  );

  -- Return appropriate row
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 4. TABLE DEFINITIONS WITH RLS
-- ========================================

-- ========== USERS TABLE ==========
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  team_id uuid NOT NULL REFERENCES teams(id),
  role text DEFAULT 'user',  -- user, admin, team_lead
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Policy: Users can see profiles of team members
CREATE POLICY "Users can view team member profiles"
  ON users FOR SELECT
  USING (
    team_id = auth.team_id()
    AND active = true
  );

-- Policy: Admins can see all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.is_admin());

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND team_id = auth.team_id());

-- Policy: Only service role can insert (Supabase Auth handles this)
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  USING (current_user_id = 'service_role');

-- Audit trigger
CREATE TRIGGER audit_users_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== TEAMS TABLE ==========
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  plan text DEFAULT 'starter',  -- starter, pro, enterprise
  subscription_status text DEFAULT 'active',
  max_users integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own team
CREATE POLICY "Users can view their own team"
  ON teams FOR SELECT
  USING (id = auth.team_id());

-- Policy: Users can't create teams (admin handles this)
CREATE POLICY "No direct team creation"
  ON teams FOR INSERT
  USING (false);

-- Policy: Only admins can update team settings
CREATE POLICY "Admins can update team settings"
  ON teams FOR UPDATE
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- Audit trigger
CREATE TRIGGER audit_teams_trigger
AFTER INSERT OR UPDATE OR DELETE ON teams
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== TEAM MEMBERS TABLE ==========
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',  -- admin, lead, user
  active boolean DEFAULT true,
  invited_at timestamp with time zone DEFAULT now(),
  joined_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Members can see other members of their team
CREATE POLICY "Team members can view team members"
  ON team_members FOR SELECT
  USING (team_id = auth.team_id() AND active = true);

-- Policy: Team admins can manage members
CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (auth.is_admin() AND team_id = auth.team_id())
  WITH CHECK (auth.is_admin() AND team_id = auth.team_id());

-- Audit trigger
CREATE TRIGGER audit_team_members_trigger
AFTER INSERT OR UPDATE OR DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== PRODUCTS TABLE ==========
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(12,2) NOT NULL,
  currency text DEFAULT 'EUR',
  stock_quantity integer DEFAULT 0,
  brand_id uuid REFERENCES brands(id),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(team_id, sku)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view products in their team
CREATE POLICY "Team members can view products"
  ON products FOR SELECT
  USING (
    team_id = auth.team_id()
    AND EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = products.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.active = true
    )
  );

-- Policy: Team members can create products
CREATE POLICY "Team members can create products"
  ON products FOR INSERT
  WITH CHECK (
    team_id = auth.team_id()
    AND auth.uid() IS NOT NULL
  );

-- Policy: Team members can update their team's products
CREATE POLICY "Team members can update products"
  ON products FOR UPDATE
  USING (team_id = auth.team_id())
  WITH CHECK (team_id = auth.team_id());

-- Policy: Admins can delete products
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    team_id = auth.team_id()
    AND auth.is_admin()
  );

-- Audit trigger
CREATE TRIGGER audit_products_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== ORDERS TABLE ==========
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  customer_id uuid REFERENCES customers(id),
  customer_email text NOT NULL,
  total_amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'pending',  -- pending, confirmed, shipped, delivered, cancelled
  stripe_payment_intent_id text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone,
  UNIQUE(team_id, order_number)
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can view orders for their team
CREATE POLICY "Team members can view orders"
  ON orders FOR SELECT
  USING (
    team_id = auth.team_id()
    AND EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = orders.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.active = true
    )
  );

-- Policy: Team members can create orders
CREATE POLICY "Team members can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    team_id = auth.team_id()
    AND auth.uid() IS NOT NULL
  );

-- Policy: Team members can update orders
CREATE POLICY "Team members can update orders"
  ON orders FOR UPDATE
  USING (team_id = auth.team_id())
  WITH CHECK (team_id = auth.team_id());

-- Don't allow direct deletes (soft delete instead)
CREATE POLICY "No direct order deletion"
  ON orders FOR DELETE
  USING (false);

-- Audit trigger
CREATE TRIGGER audit_orders_trigger
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== CUSTOMERS TABLE ==========
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  first_name text,
  last_name text,
  company_name text,
  tax_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(team_id, email)
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can view customers
CREATE POLICY "Team members can view customers"
  ON customers FOR SELECT
  USING (
    team_id = auth.team_id()
    AND EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = customers.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.active = true
    )
  );

-- Policy: Team members can create customers
CREATE POLICY "Team members can create customers"
  ON customers FOR INSERT
  WITH CHECK (team_id = auth.team_id());

-- Policy: Team members can update customers
CREATE POLICY "Team members can update customers"
  ON customers FOR UPDATE
  USING (team_id = auth.team_id())
  WITH CHECK (team_id = auth.team_id());

-- Audit trigger
CREATE TRIGGER audit_customers_trigger
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== PAYMENT METHODS TABLE (SENSITIVE) ==========
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  payment_type text NOT NULL,  -- stripe_card, stripe_sepa, bank_transfer
  stripe_payment_method_id text,
  last_4 text,  -- Last 4 digits
  brand text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Policy: STRICT - Only admins can view payment methods
CREATE POLICY "Admins only can view payment methods"
  ON payment_methods FOR SELECT
  USING (
    team_id = auth.team_id()
    AND auth.is_admin()
  );

-- Policy: Admins can create payment methods
CREATE POLICY "Admins can create payment methods"
  ON payment_methods FOR INSERT
  USING (auth.is_admin() AND team_id = auth.team_id());

-- Policy: Admins can update payment methods
CREATE POLICY "Admins can update payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.is_admin() AND team_id = auth.team_id())
  WITH CHECK (auth.is_admin() AND team_id = auth.team_id());

-- Policy: Admins can delete payment methods
CREATE POLICY "Admins can delete payment methods"
  ON payment_methods FOR DELETE
  USING (auth.is_admin() AND team_id = auth.team_id());

-- Audit trigger (logs even sensitive operations)
CREATE TRIGGER audit_payment_methods_trigger
AFTER INSERT OR UPDATE OR DELETE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========== API KEYS TABLE (HIGHLY SENSITIVE) ==========
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,  -- SHA-256 hash of actual key
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  scopes text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: VERY STRICT - Only creator can see their own keys
CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  USING (
    team_id = auth.team_id()
    AND created_by = auth.uid()
  );

-- Policy: Admins can view all team's API keys
CREATE POLICY "Admins can view all API keys"
  ON api_keys FOR SELECT
  USING (
    team_id = auth.team_id()
    AND auth.is_admin()
  );

-- Policy: Users can create API keys
CREATE POLICY "Users can create API keys"
  ON api_keys FOR INSERT
  WITH CHECK (
    team_id = auth.team_id()
    AND created_by = auth.uid()
  );

-- Policy: Users can revoke their own keys
CREATE POLICY "Users can revoke own API keys"
  ON api_keys FOR UPDATE
  USING (
    team_id = auth.team_id()
    AND created_by = auth.uid()
  )
  WITH CHECK (
    team_id = auth.team_id()
    AND created_by = auth.uid()
  );

-- Policy: Admins can revoke any key
CREATE POLICY "Admins can revoke API keys"
  ON api_keys FOR UPDATE
  USING (team_id = auth.team_id() AND auth.is_admin())
  WITH CHECK (team_id = auth.team_id() AND auth.is_admin());

-- Audit trigger
CREATE TRIGGER audit_api_keys_trigger
AFTER INSERT OR UPDATE OR DELETE ON api_keys
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========================================
-- 5. SENSITIVE DATA MASKING VIEWS
-- ========================================

-- Safe view for displaying payment methods (masks sensitive data)
CREATE OR REPLACE VIEW payment_methods_safe AS
SELECT
  id,
  team_id,
  customer_id,
  payment_type,
  last_4,      -- Only last 4 digits
  brand,
  is_default,
  created_at,
  updated_at
FROM payment_methods;

-- Safe view for API keys (shows minimal info)
CREATE OR REPLACE VIEW api_keys_safe AS
SELECT
  id,
  team_id,
  name,
  created_by,
  last_used_at,
  expires_at,
  is_active,
  created_at
FROM api_keys;

-- View for audit logs (masks sensitive data in old/new values)
CREATE OR REPLACE VIEW audit_logs_safe AS
SELECT
  id,
  table_name,
  record_id,
  operation,
  -- Mask sensitive fields in old/new values
  CASE
    WHEN table_name = 'api_keys' THEN 
      old_values - 'key_hash'
    WHEN table_name = 'payment_methods' THEN 
      old_values - 'stripe_payment_method_id'
    ELSE old_values
  END as old_values,
  CASE
    WHEN table_name = 'api_keys' THEN 
      new_values - 'key_hash'
    WHEN table_name = 'payment_methods' THEN 
      new_values - 'stripe_payment_method_id'
    ELSE new_values
  END as new_values,
  changed_fields,
  user_id,
  user_email,
  created_at
FROM audit_logs;

-- ========================================
-- 6. SECURITY FUNCTIONS
-- ========================================

-- Function to verify JWT token validity before operations
CREATE OR REPLACE FUNCTION verify_jwt_token()
RETURNS boolean AS $$
BEGIN
  -- Check if JWT claims exist
  IF current_setting('request.jwt.claims', true) IS NULL THEN
    RAISE EXCEPTION 'Invalid JWT token';
  END IF;

  -- Check if user_id is present
  IF (current_setting('request.jwt.claims', true)::jsonb->>'sub') IS NULL THEN
    RAISE EXCEPTION 'JWT missing user ID (sub)';
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check if user's JWT team_id matches record's team_id
CREATE OR REPLACE FUNCTION check_team_access(team_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN team_uuid = auth.team_id();
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to safely update sensitive fields (admin only)
CREATE OR REPLACE FUNCTION update_sensitive_field(
  table_name text,
  record_id uuid,
  field_name text,
  new_value text
)
RETURNS void AS $$
BEGIN
  -- Only admins can update sensitive fields
  IF NOT auth.is_admin() THEN
    RAISE EXCEPTION 'Only admins can update sensitive fields';
  END IF;

  -- Log the update attempt
  INSERT INTO audit_logs (
    table_name,
    record_id,
    operation,
    user_id,
    user_email,
    ip_address
  ) VALUES (
    table_name,
    record_id,
    'SENSITIVE_UPDATE',
    auth.uid(),
    current_setting('request.jwt.claims', true)::jsonb->>'email',
    inet_client_addr()
  );

  -- Note: Actual update logic would be in application code
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 7. PERFORMANCE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_products_team ON products(team_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_team ON orders(team_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_customers_team ON customers(team_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_payment_methods_customer ON payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_team ON api_keys(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- ========================================
-- 8. VERIFICATION QUERIES
-- ========================================

-- Check that RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- Count policies per table
SELECT
  schemaname,
  tablename,
  count(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY policy_count DESC;

-- Check audit triggers
SELECT
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE 'audit_%'
ORDER BY event_object_table;

-- ========================================
-- 9. DEPLOYMENT CHECKLIST
-- ========================================
-- Run this SQL in order:
-- 1. Execute sections 1-3 (roles, functions, audit infrastructure)
-- 2. Execute section 4 (table definitions with RLS)
-- 3. Execute section 5 (views)
-- 4. Execute section 6 (security functions)
-- 5. Execute section 7 (indexes)
-- 6. Run verification queries in section 8
-- 7. Test RLS policies with test queries below

-- ========================================
-- 10. TEST QUERIES
-- ========================================

-- Test 1: Verify JWT validation
-- SELECT verify_jwt_token();
-- Expected: Error "Invalid JWT token" (unless JWT is set)

-- Test 2: Test RLS with anonymous user
-- SET ROLE anon;
-- SELECT * FROM products;
-- Expected: No rows (RLS blocks anonymous access)

-- Test 3: Test RLS with authenticated user
-- SET ROLE authenticated;
-- SET request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000001","team_id":"11111111-1111-1111-1111-111111111111"}';
-- SELECT * FROM products;
-- Expected: Only products where team_id matches JWT team_id

-- Test 4: Verify audit logging
-- SELECT * FROM audit_logs WHERE table_name = 'products' ORDER BY created_at DESC;
-- Expected: All changes to products are logged

-- Test 5: Verify payment methods masking
-- SELECT * FROM payment_methods_safe;
-- Expected: No stripe_payment_method_id field (masked)

-- ========================================
-- 11. BACKUP & RECOVERY
-- ========================================

-- Create backup of audit logs (daily)
-- pg_dump -t audit_logs opencarbox_prod | gzip > audit_logs_$(date +%Y%m%d).sql.gz

-- Restore from backup if needed
-- gunzip < audit_logs_20260223.sql.gz | psql opencarbox_prod

-- ========================================
-- SECURITY NOTES
-- ========================================
-- 1. Service role key bypasses ALL RLS - keep it secret and only use in backend
-- 2. RLS only works with session auth - API calls must include JWT
-- 3. Audit logs are APPEND-ONLY - immutable for compliance
-- 4. Sensitive data should use views with masking for non-admin users
-- 5. Always test RLS policies in staging before production
-- 6. Monitor audit_logs for suspicious activity (bulk deletes, unauthorized access)
-- 7. Rotate API keys monthly; track expiration with expires_at column
-- 8. Payment method records should be periodically purged after 7 years (GDPR)
