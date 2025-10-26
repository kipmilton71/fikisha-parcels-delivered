import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import DriverApplicationForm from '@/components/DriverApplicationForm';

const DriverApplication = () => {
  const { user, profile, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/driver-auth" replace />;
  }

  // If user already has a driver profile (active or pending), redirect to dashboard
  if (hasRole('driver')) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleApplicationSuccess = () => {
    // Redirect to dashboard after successful application
    window.location.href = '/dashboard';
  };

  return (
    <Layout>
      <DriverApplicationForm onSuccess={handleApplicationSuccess} />
    </Layout>
  );
};

export default DriverApplication;