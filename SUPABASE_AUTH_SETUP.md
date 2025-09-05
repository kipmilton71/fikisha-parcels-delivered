# 🔐 Supabase Authentication Setup Guide

## ✅ Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (or create a new one if you haven't)
3. **Go to Settings → API**
4. **Copy these values**:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## ✅ Step 2: Update the Real Client

1. **Open** `src/integrations/supabase/real-client.ts`
2. **Replace the placeholder values**:

```typescript
// Replace these with your actual values
const SUPABASE_URL = "https://your-project-id.supabase.co";  // Your Project URL
const SUPABASE_ANON_KEY = "eyJ...";  // Your anon key
```

## ✅ Step 3: Switch to Real Client

1. **Open** `src/hooks/useAuth.tsx`
2. **Find this line**:
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   ```
3. **Replace it with**:
   ```typescript
   import { supabase } from '@/integrations/supabase/real-client';
   ```

## ✅ Step 4: Run the Database Setup

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste** the contents of `supabase_setup.sql`
4. **Click "Run"**

## ✅ Step 5: Configure Authentication Settings

1. **Go to Authentication → Settings** in your Supabase dashboard
2. **Enable Email authentication**
3. **Set your Site URL** to your website domain (e.g., `http://localhost:5173` for development)
4. **Configure email templates** (optional)

## 🧪 Step 6: Test Authentication

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to your website** and click "Get Started"

3. **Try to sign up** with a real email address

4. **Check your Supabase Dashboard**:
   - Go to Authentication → Users
   - You should see your new user
   - Go to Table Editor → profiles
   - You should see the user's profile automatically created

## 🎯 What Should Happen

### When you sign up:
1. **User is created** in Supabase Auth
2. **Profile is automatically created** in the profiles table
3. **User is redirected** to their dashboard
4. **Role is set** based on what they selected during signup

### When you sign in:
1. **User authenticates** with Supabase
2. **Session is established**
3. **User is redirected** to their dashboard
4. **All data is real** (not mock data)

## 🆘 Troubleshooting

### If sign up doesn't work:
- Check that your Supabase URL and key are correct
- Make sure you've run the SQL setup script
- Check the browser console for errors
- Verify authentication is enabled in Supabase settings

### If profile isn't created:
- Check that the trigger was created in the SQL script
- Look at the Supabase logs for any errors
- Verify the user metadata includes the role

### If you get CORS errors:
- Make sure your Site URL is set correctly in Supabase settings
- For development, use `http://localhost:5173`

## 🎉 You're Done!

Once you complete these steps, your website will have **real Supabase authentication**:

- ✅ **Real user registration**
- ✅ **Real user login**
- ✅ **Real data storage**
- ✅ **Automatic profile creation**
- ✅ **Role-based dashboards**

**Your Fikisha delivery website will be ready for real users!** 🚀
