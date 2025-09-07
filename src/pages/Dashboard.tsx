import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import CustomerDashboard from '@/components/CustomerDashboard';
import DriverDashboard from '@/components/DriverDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import PendingApproval from '@/components/PendingApproval';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = profile?.role || 'customer';

  // For drivers, check if they're approved
  if (userRole === 'driver' && !profile?.is_active) {
    return (
      <Layout>
        <PendingApproval />
      </Layout>
    );
  }

  return (
    <Layout>
      {userRole === 'admin' ? (
        <AdminDashboard />
      ) : userRole === 'driver' ? (
        <DriverDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
