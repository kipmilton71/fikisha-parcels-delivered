// Configuration for Supabase client
// Set USE_REAL_SUPABASE to true when ready to use real Supabase

export const USE_REAL_SUPABASE = true; // Changed to true to use real Supabase

// Your Supabase credentials (using the same credentials as the mock client)
export const SUPABASE_CONFIG = {
  url: "https://tategrqxvlqezsuejzmb.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGVncnF4dmxxZXpzdWVqem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzIxMjAsImV4cCI6MjA3MjY0ODEyMH0.dEHi0hQJ0Aidb3VJ5rCR7wb1lgW7ocHRl1AGd9Ctw0s"
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
