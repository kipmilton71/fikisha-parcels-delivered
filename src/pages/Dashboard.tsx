import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import CustomerDashboard from '@/components/CustomerDashboard';
import DriverDashboard from '@/components/DriverDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import PendingApproval from '@/components/PendingApproval';

const Dashboard = () => {
  const { user, profile, loading, hasRole } = useAuth();

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

  // Use secure role checking
  const isAdmin = hasRole('admin');
  const isDriver = hasRole('driver');

  // For drivers, check if they're approved
  if (isDriver && !profile?.is_active) {
    return (
      <Layout>
        <PendingApproval />
      </Layout>
    );
  }

  return (
    <Layout>
      {isAdmin ? (
        <AdminDashboard />
      ) : isDriver ? (
        <DriverDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
