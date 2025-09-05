// Real Supabase client for production
// Replace the mock client with this when ready to connect to your Supabase backend

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_CONFIG } from './config';

export const supabase = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// To use this real client:
// 1. Install Supabase: npm install @supabase/supabase-js
// 2. Replace the import in src/hooks/useAuth.tsx:
//    Change: import { supabase } from '@/integrations/supabase/client';
//    To: import { supabase } from '@/integrations/supabase/real-client';
// 3. Update SUPABASE_URL and SUPABASE_ANON_KEY with your actual values
// 4. Run the supabase_setup.sql script in your Supabase dashboard
