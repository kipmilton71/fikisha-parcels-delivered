import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/real-client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  is_active: boolean;
}

interface UserRole {
  role: 'customer' | 'driver' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRoles: string[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'customer' | 'driver' | 'admin', phoneNumber?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile and roles
          setTimeout(async () => {
            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              setProfile(profileData);
              // Temporarily use role from profile until migration is complete
              // After migration, this will be replaced by user_roles table query
              const profileRole = (profileData as any).role;
              if (profileRole) {
                setUserRoles([profileRole]);
              }
            } else if (profileError) {
              console.error('Error fetching profile:', profileError);
            }

            // Try to fetch from user_roles table (will work after migration)
            try {
              const { data: rolesData } = await supabase
                .from('user_roles' as any)
                .select('role')
                .eq('user_id', session.user.id);
              
              if (rolesData && rolesData.length > 0) {
                setUserRoles(rolesData.map((r: any) => r.role));
              }
            } catch (error) {
              // Table doesn't exist yet, using profile role as fallback
            }
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'driver' | 'admin', phoneNumber?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user) {
        // Update phone number if provided
        if (phoneNumber) {
          setTimeout(async () => {
            await supabase
              .from('profiles')
              .update({ phone_number: phoneNumber })
              .eq('id', data.user.id);
          }, 1000);
        }

        // Create driver profile if role is driver
        if (role === 'driver') {
          setTimeout(async () => {
            await supabase
              .from('driver_profiles')
              .insert({
                id: data.user.id,
                is_available: false
              });
          }, 1500);
        }

        toast({
          title: "Success!",
          description: "Account created successfully. Please check your email to verify your account."
        });
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in."
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "Successfully signed out."
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // Update local profile state
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const hasRole = (role: string) => {
    return userRoles.includes(role);
  };

  const value = {
    user,
    session,
    profile,
    userRoles,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
