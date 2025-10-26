import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/real-client';

interface DriverStats {
  totalEarnings: number;
  todayEarnings: number;
  todayDeliveries: number;
  totalDeliveries: number;
  rating: number;
}

export const useDriverEarnings = (driverId: string | undefined) => {
  const [stats, setStats] = useState<DriverStats>({
    totalEarnings: 0,
    todayEarnings: 0,
    todayDeliveries: 0,
    totalDeliveries: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;

    const fetchStats = async () => {
      try {
        // Fetch driver profile with earnings
        const { data: driverProfile, error: profileError } = await supabase
          .from('driver_profiles')
          .select('*')
          .eq('id', driverId)
          .single();

        if (profileError) {
          console.error('Error fetching driver profile:', profileError);
          return;
        }

        if (driverProfile) {
          const profile = driverProfile as any;
          setStats({
            totalEarnings: parseFloat(profile.total_earnings || '0'),
            todayEarnings: parseFloat(profile.today_earnings || '0'),
            todayDeliveries: profile.today_deliveries || 0,
            totalDeliveries: profile.total_deliveries || 0,
            rating: parseFloat(String(profile.rating || 0))
          });
        }
      } catch (error) {
        console.error('Error in useDriverEarnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time updates
    const channel = supabase
      .channel('driver-earnings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'driver_profiles',
          filter: `id=eq.${driverId}`
        },
        (payload) => {
          const updated = payload.new as any;
          setStats({
            totalEarnings: parseFloat(updated.total_earnings || '0'),
            todayEarnings: parseFloat(updated.today_earnings || '0'),
            todayDeliveries: updated.today_deliveries || 0,
            totalDeliveries: updated.total_deliveries || 0,
            rating: parseFloat(updated.rating || '0')
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  return { stats, loading };
};
