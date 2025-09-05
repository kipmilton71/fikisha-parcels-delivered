#!/usr/bin/env node

// Script to help switch from mock to real Supabase
// Run this after you've set up your Supabase credentials

const fs = require('fs');
const path = require('path');

console.log('🔄 Switching to Real Supabase Authentication...\n');

// Step 1: Update config.ts
const configPath = path.join(__dirname, 'src', 'integrations', 'supabase', 'config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

configContent = configContent.replace(
  'export const USE_REAL_SUPABASE = false;',
  'export const USE_REAL_SUPABASE = true;'
);

fs.writeFileSync(configPath, configContent);
console.log('✅ Updated config.ts to use real Supabase');

// Step 2: Update useAuth.tsx
const useAuthPath = path.join(__dirname, 'src', 'hooks', 'useAuth.tsx');
let useAuthContent = fs.readFileSync(useAuthPath, 'utf8');

useAuthContent = useAuthContent.replace(
  "import { supabase } from '@/integrations/supabase/client';",
  "import { supabase } from '@/integrations/supabase/real-client';"
);

fs.writeFileSync(useAuthPath, useAuthContent);
console.log('✅ Updated useAuth.tsx to use real Supabase client');

console.log('\n🎉 Successfully switched to real Supabase!');
console.log('\n📋 Next steps:');
console.log('1. Make sure you\'ve updated your Supabase credentials in config.ts');
console.log('2. Run the supabase_setup.sql script in your Supabase dashboard');
console.log('3. Configure authentication settings in Supabase');
console.log('4. Test sign up and sign in with real users');
console.log('\n🚀 Your website is now ready for real authentication!');
