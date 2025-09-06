# 🚨 Quick Fix for Authentication Issue

## The Problem
You're getting `ERR_CONNECTION_REFUSED` because:
1. You're still using the **mock Supabase client** (not real Supabase)
2. The mock client is trying to connect to localhost:8080 but there's no real Supabase server there

## The Solution

### Option 1: Use Real Supabase (Recommended)

**Step 1: Get your Supabase credentials**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy your **Project URL** and **anon key**

**Step 2: Update the config**
1. Open `src/integrations/supabase/config.ts`
2. Replace the placeholder values:
   ```typescript
   export const SUPABASE_CONFIG = {
     url: "https://your-actual-project-id.supabase.co",  // Your real URL
     anonKey: "eyJ..."  // Your real anon key
   };
   ```

**Step 3: Switch to real client**
1. Open `src/hooks/useAuth.tsx`
2. Change line 3 from:
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   ```
   To:
   ```typescript
   import { supabase } from '@/integrations/supabase/real-client';
   ```

**Step 4: Run the database setup**
1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase_setup.sql`
3. Click "Run"

### Option 2: Fix Mock Client (Temporary)

If you want to keep using the mock client for now, I can fix the connection issue.

## Which option do you want?
- **Option 1**: Set up real Supabase (recommended for production)
- **Option 2**: Fix mock client (for testing only)

Let me know which option you prefer!

