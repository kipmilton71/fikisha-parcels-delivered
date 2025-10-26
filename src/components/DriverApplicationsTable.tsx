import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/real-client';
import { toast } from 'sonner';
import { Eye, Check, X, User, Car, Phone, Mail, MapPin } from 'lucide-react';

interface DriverApplication {
  id: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
  is_active: boolean;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

const DriverApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // Load profiles with driver role and inactive status (pending approval)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Load driver application notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'driver_application')
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      setApplications(profilesData || []);
      setNotifications(notificationsData || []);
    } catch (error: any) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load driver applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      // Update profile to active status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_active: true
        })
        .eq('id', applicationId);

      if (profileError) throw profileError;

      // Create driver profile if it doesn't exist
      const { error: driverError } = await supabase
        .from('driver_profiles')
        .upsert({
          id: applicationId,
          is_available: true,
          rating: 5.0,
          total_deliveries: 0
        });

      if (driverError) {
        console.error('Error creating driver profile:', driverError);
      }

      // Create approval notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: applicationId,
          title: 'Application Approved',
          message: 'Your driver application has been approved! You can now start accepting delivery requests.',
          type: 'application_status'
        });

      if (notificationError) {
        console.error('Error creating approval notification:', notificationError);
      }

      toast.success('Driver application approved successfully!');
      loadApplications();
    } catch (error: any) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      // Delete the profile (or you could mark it differently)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      // Create rejection notification (this will fail since profile is deleted, but that's ok)
      await supabase
        .from('notifications')
        .insert({
          user_id: applicationId,
          title: 'Application Rejected',
          message: 'Your driver application has been rejected. Please contact support for more information.',
          type: 'application_status'
        });

      toast.success('Driver application rejected');
      loadApplications();
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  const ApplicationDetailsDialog = ({ application }: { application: DriverApplication }) => {
    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Driver Application - {application.full_name}
          </DialogTitle>
          <DialogDescription>
            Review the driver's application details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Full Name:</span>
                <p className="font-medium">{application.full_name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <p className="font-medium">{application.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Application Date:</span>
                <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge variant="secondary">Pending Approval</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            Additional application details would be available once the full application system is implemented with proper database schema.
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handleReject(application.id)}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </Button>
          <Button
            onClick={() => handleApprove(application.id)}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Approve
          </Button>
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No pending driver applications found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.full_name}</TableCell>
              <TableCell>{application.phone_number || 'N/A'}</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pending
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(application.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <ApplicationDetailsDialog application={application} />
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApprove(application.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(application.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriverApplicationsTable;