require('dotenv').config({ path: '.env' });

async function testAuth() {
  try {
    // Dynamischer Import für Supabase
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-8) : 'NOT SET');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase environment variables not set');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test: Get current session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Session test passed');
      console.log('Session:', session ? 'User logged in' : 'No active session');
    }
    
    // Test: Get server health
    const { data: health, error: healthError } = await supabase.from('_health').select('*').limit(1);
    
    if (healthError) {
      console.log('ℹ️  Health check failed (expected if table does not exist):', healthError.message);
    } else {
      console.log('✅ Health check passed');
    }
    
    // Test: Simple query to profiles table (if exists)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();
    
    if (profilesError) {
      console.log('ℹ️  Profiles query failed (might not exist yet):', profilesError.message);
    } else {
      console.log('✅ Profiles query successful');
    }
    
    console.log('\n✅ Supabase Auth configuration appears to be working');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testAuth().then(success => {
  process.exit(success ? 0 : 1);
});