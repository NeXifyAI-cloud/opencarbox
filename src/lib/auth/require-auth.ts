import { createClient } from '@supabase/supabase-js';

import { serverEnv } from '@/lib/server/env';

export interface AuthContext {
  userId: string;
}

export async function requireAuth(authorizationHeader: string | null): Promise<AuthContext | null> {
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.replace('Bearer ', '')
    : null;

  if (!token || !serverEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = createClient(serverEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return { userId: data.user.id };
}
