import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PendingApproval = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Application Under Review</h1>
          <p className="text-muted-foreground">
            Thank you for applying to be a Fikisha driver partner!
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-800">Pending Review</p>
                <p className="text-sm text-yellow-700">Our team is reviewing your application</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Under Review
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Application submitted:</strong> Recently</p>
              <p><strong>Applicant:</strong> {profile?.full_name}</p>
              <p><strong>Phone:</strong> {profile?.phone_number || 'Not provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-muted-foreground">We're verifying your submitted documents and vehicle information</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Background Check</p>
                  <p className="text-sm text-muted-foreground">A standard background verification is being conducted</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Account Activation</p>
                  <p className="text-sm text-muted-foreground">Once approved, your driver account will be activated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Timeline</CardTitle>
            <CardDescription>
              Most applications are reviewed within 2-3 business days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Need Help?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    If you have questions about your application status or need to update any information, please contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Support
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;