# Driver Registration 500 Error Fix

## Problem
You're getting a 500 error when trying to create a driver account, with the message "database error saving..." in the console.

## Root Cause
The application was using a mock Supabase client that wasn't properly configured, and the database tables/triggers weren't set up correctly.

## Solution Applied

### 1. ✅ Fixed Supabase Client Configuration
- **Changed** `USE_REAL_SUPABASE = true` in `src/integrations/supabase/config.ts`
- **Updated** `useAuth.tsx` to use the real Supabase client instead of the mock client
- **Configured** proper Supabase credentials

### 2. ✅ Improved Error Handling
- **Enhanced** driver application form with better error handling
- **Added** profile existence checks before upsert operations
- **Improved** error messages in the authentication flow

### 3. ✅ Database Setup Required
You need to run the database setup script in your Supabase dashboard.

## Next Steps - CRITICAL

### Step 1: Set Up Database Tables
1. **Go to** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select** your project: `tategrqxvlqezsuejzmb`
3. **Navigate** to SQL Editor (left sidebar)
4. **Copy** the entire contents of `supabase_setup.sql`
5. **Paste** and **run** the SQL script
6. **Verify** all tables are created successfully

### Step 2: Test the Fix
1. **Restart** your development server
2. **Try** creating a driver account again
3. **Check** the browser console for any remaining errors
4. **Verify** that the profile is created in the database

## Database Tables Created
The SQL script will create:
- ✅ `profiles` - User profiles with roles
- ✅ `driver_profiles` - Driver-specific information
- ✅ `orders` - Delivery orders
- ✅ `notifications` - System notifications
- ✅ `order_tracking` - Real-time tracking
- ✅ `ratings` - Driver ratings
- ✅ **Triggers** - Automatic profile creation
- ✅ **RLS Policies** - Row-level security
- ✅ **Indexes** - Performance optimization

## Troubleshooting

### If you still get 500 errors:

1. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for any error messages during signup

2. **Verify Database Setup**
   - Check that all tables exist in the Table Editor
   - Verify the trigger function `handle_new_user()` exists

3. **Test Database Connection**
   - Try creating a simple profile manually in the Table Editor
   - Check if RLS policies are blocking operations

4. **Check Browser Console**
   - Look for specific error messages
   - Check network tab for failed requests

### Common Issues:

**Issue**: "relation 'profiles' does not exist"
**Solution**: Run the `supabase_setup.sql` script

**Issue**: "permission denied for table profiles"
**Solution**: Check RLS policies are set up correctly

**Issue**: "trigger function handle_new_user() does not exist"
**Solution**: The trigger wasn't created - run the SQL script again

## Files Modified
- ✅ `src/integrations/supabase/config.ts` - Enabled real Supabase
- ✅ `src/hooks/useAuth.tsx` - Switched to real client, improved error handling
- ✅ `src/components/DriverApplicationForm.tsx` - Better error handling
- ✅ `setup-database.js` - Database setup helper script

## Testing Checklist
- [ ] Database tables created successfully
- [ ] Driver account creation works
- [ ] Profile is created automatically
- [ ] Driver application form submits successfully
- [ ] No 500 errors in console
- [ ] User can log in after registration

## Need Help?
If you're still experiencing issues:
1. Check the Supabase logs in your dashboard
2. Verify all tables exist in the Table Editor
3. Test with a simple user creation in the Table Editor
4. Check the browser console for specific error messages

The fix should resolve the 500 error and allow driver registration to work properly.
