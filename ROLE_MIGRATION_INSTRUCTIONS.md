# Critical Database Migration Instructions

## ⚠️ IMPORTANT: Run this SQL in your Supabase SQL Editor

This migration fixes critical security vulnerabilities by moving roles to a separate table and adds earnings tracking for drivers.

### Step 1: Run this SQL in Supabase Dashboard

Go to: **Supabase Dashboard → SQL Editor → New Query**

Paste and run this SQL:

```sql
-- ========================================
-- CRITICAL SECURITY FIX: Proper Role-Based Access Control
-- ========================================

-- 1. Create app_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('customer', 'driver', 'admin');
    END IF;
END $$;

-- 2. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Add earnings tracking to driver_profiles
ALTER TABLE driver_profiles 
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS today_earnings DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS today_deliveries INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_earnings_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. Migrate existing roles from profiles to user_roles
INSERT INTO user_roles (user_id, role)
SELECT id, role::text::app_role
FROM profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Create RLS policies for user_roles using security definer function
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
CREATE POLICY "Admins can view all roles" ON user_roles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 8. Update profiles RLS policies to use has_role function
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- 9. Create or update trigger function to create user roles
CREATE OR REPLACE FUNCTION handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert role into user_roles table
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id, 
    (NEW.raw_user_meta_data->>'role')::app_role
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 10. Create trigger to auto-assign roles on signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_role();

-- 11. Update driver_applications RLS policies
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON driver_applications;
CREATE POLICY "Users can view their own applications" ON driver_applications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own applications" ON driver_applications;
CREATE POLICY "Users can insert their own applications" ON driver_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all applications" ON driver_applications;
CREATE POLICY "Admins can view all applications" ON driver_applications
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all applications" ON driver_applications;
CREATE POLICY "Admins can update all applications" ON driver_applications
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Success message
SELECT 'Security fixes applied successfully! Roles moved to separate table, earnings tracking added.' as status;
```

### Step 2: After running the SQL

The application will automatically work with the new secure role system. The edge function will be deployed automatically.

### What This Migration Does

1. **Security Fix**: Moves roles from `profiles` table to separate `user_roles` table to prevent privilege escalation attacks
2. **Earnings Tracking**: Adds columns to track driver earnings (total_earnings, today_earnings, today_deliveries)
3. **Secure Role Checking**: Creates a `has_role()` function that uses SECURITY DEFINER to prevent RLS recursion
4. **Data Migration**: Automatically migrates existing roles to the new table
5. **RLS Policies**: Updates all security policies to use the new secure role checking

### For Your Ecommerce Integration

The edge function at `/delivery-tasks` accepts POST requests with this format:

```json
{
  "tracking_code": "FKS12345678",
  "sender_id": "uuid-of-vendor",
  "receiver_name": "Customer Name",
  "receiver_phone": "254712345678",
  "pickup_address": "Vendor Address",
  "pickup_latitude": -1.2921,
  "pickup_longitude": 36.8219,
  "delivery_address": "Customer Address",
  "delivery_latitude": -1.2833,
  "delivery_longitude": 36.8167,
  "package_description": "Product description",
  "delivery_amount": 250.00,
  "confirmation_code": "ABC123",
  "vendor_whatsapp": "254712345678",
  "customer_whatsapp": "254798765432",
  "vendor_county": "Nairobi",
  "vendor_constituency": "Westlands",
  "vendor_ward": "Kitisuru",
  "customer_county": "Nairobi",
  "customer_constituency": "Dagoretti",
  "customer_ward": "Mutu-ini",
  "distance_km": 5.2,
  "original_order_id": "ecommerce-order-123"
}
```

The endpoint will be available at: `https://tategrqxvlqezsuejzmb.supabase.co/functions/v1/delivery-tasks`
