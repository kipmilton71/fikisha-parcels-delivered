// Configuration for Supabase client
// Set USE_REAL_SUPABASE to true when ready to use real Supabase

export const USE_REAL_SUPABASE = false; // Change to true when ready

// Your Supabase credentials (replace with your actual values)
export const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",
  anonKey: "your-anon-key-here"
};

// Helper function to get the correct client
export const getSupabaseClient = () => {
  if (USE_REAL_SUPABASE) {
    // Import real client dynamically to avoid build issues
    return import('./real-client').then(module => module.supabase);
  } else {
    // Import mock client
    return import('./client').then(module => module.supabase);
  }
};
