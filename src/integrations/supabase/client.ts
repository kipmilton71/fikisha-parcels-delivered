// Mock Supabase client for development
// Replace this with actual Supabase client when ready to connect

// Mock user data - you can change the role here to test different dashboards
const mockUser = {
  id: 'demo-user-123',
  email: 'demo@fikisha.com',
  user_metadata: {
    full_name: 'Demo User',
    role: 'customer' // Change this to 'driver' to test driver dashboard
  }
};

const mockProfile = {
  id: 'demo-user-123',
  full_name: 'Demo User',
  role: 'customer', // Change this to 'driver' to test driver dashboard
  phone_number: '+254712345678',
  is_active: true
};

// Global state for authentication
let isLoggedIn = true;
let authCallback: any = null;

export const supabase = {
  auth: {
    onAuthStateChange: (callback: any) => {
      authCallback = callback;
      // Simulate immediate login for demo
      if (isLoggedIn) {
        setTimeout(() => {
          callback('SIGNED_IN', { user: mockUser });
        }, 100);
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: async () => {
      // Mock session - return logged in user or null based on state
      if (isLoggedIn) {
        return { 
          data: { 
            session: { 
              user: mockUser,
              access_token: 'mock-token'
            } 
          } 
        };
      }
      return { data: { session: null } };
    },
    signUp: async (credentials: any) => {
      // Mock sign up - simulate success
      console.log('Mock sign up:', credentials);
      isLoggedIn = true;
      if (authCallback) {
        authCallback('SIGNED_IN', { user: mockUser });
      }
      return { 
        data: { 
          user: mockUser,
          session: { user: mockUser }
        }, 
        error: null 
      };
    },
    signInWithPassword: async (credentials: any) => {
      // Mock sign in - simulate success
      console.log('Mock sign in:', credentials);
      isLoggedIn = true;
      if (authCallback) {
        authCallback('SIGNED_IN', { user: mockUser });
      }
      return { 
        data: { 
          user: mockUser,
          session: { user: mockUser }
        }, 
        error: null 
      };
    },
    signOut: async () => {
      // Mock sign out - actually log out
      console.log('Mock sign out');
      isLoggedIn = false;
      if (authCallback) {
        authCallback('SIGNED_OUT', null);
      }
      return { error: null };
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          console.log(`Mock select from ${table} where ${column} = ${value}`);
          if (table === 'profiles' && column === 'id') {
            return { data: mockProfile, error: null };
          }
          return { data: null, error: null };
        }
      }),
      async single() {
        console.log(`Mock select from ${table}`);
        if (table === 'profiles') {
          return { data: mockProfile, error: null };
        }
        return { data: null, error: null };
      }
    }),
    insert: (data: any) => ({
      select: (columns?: string) => ({
        async single() {
          console.log(`Mock insert into ${table}:`, data);
          const mockOrder = {
            id: 'mock-order-' + Date.now(),
            tracking_code: 'FKS' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
            confirmation_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            ...data,
            created_at: new Date().toISOString(),
            status: 'pending'
          };
          return { 
            data: mockOrder, 
            error: null 
          };
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async single() {
          console.log(`Mock update ${table} set ${JSON.stringify(data)} where ${column} = ${value}`);
          return { data: { ...mockProfile, ...data }, error: null };
        }
      })
    })
  })
};
