import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, AlertCircle, CheckCircle, ArrowLeft, Truck, User, FileText, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const DriverApplication = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    idNumber: "",
    vehicleType: "",
    vehicleRegistration: "",
    licenseNumber: "",
    experience: "",
    availability: "",
    areas: "",
    documents: {
      idCard: null as File | null,
      license: null as File | null,
      vehicleRegistration: null as File | null,
      insurance: null as File | null
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!user) {
    return <Navigate to="/driver-auth" replace />;
  }

  const validateFile = (file: File | null, field: string) => {
    if (!file) return '';
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed.';
    }
    if (file.size > maxFileSize) {
      return 'File is too large. Please upload a file under 10MB.';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDocumentUpload = async (field: string, file: File | null) => {
    const error = validateFile(file, field);
    setFileErrors(prev => ({ ...prev, [field]: error }));
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: error ? null : file
      }
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
        break;
      case 2:
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        if (!formData.vehicleRegistration) newErrors.vehicleRegistration = 'Vehicle registration is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
        break;
      case 3:
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.availability) newErrors.availability = 'Availability is required';
        if (!formData.areas) newErrors.areas = 'Service areas are required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return formData.idNumber;
      case 2:
        return formData.vehicleType && formData.vehicleRegistration && formData.licenseNumber;
      case 3:
        return formData.experience && formData.availability && formData.areas;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create driver application
      const { error: applicationError } = await supabase
        .from('driver_applications')
        .insert({
          user_id: user.id,
          id_number: formData.idNumber,
          vehicle_type: formData.vehicleType,
          vehicle_registration: formData.vehicleRegistration,
          license_number: formData.licenseNumber,
          experience: formData.experience,
          availability: formData.availability,
          service_areas: formData.areas,
          status: 'pending'
        });

      if (applicationError) {
        toast.error('Failed to submit application');
        return;
      }

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          status: 'pending_approval',
          account_setup_completed: true
        })
        .eq('id', user.id);

      if (profileError) {
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Application submitted successfully! We will review and contact you soon.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Driver application error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Personal Information</h4>
                  <p className="text-sm text-blue-700">
                    Provide your personal details for verification and contact purposes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="idNumber" className="text-base font-semibold text-gray-900">National ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className={`mt-2 h-12 text-base ${errors.idNumber ? 'border-red-500' : ''}`}
                placeholder="Enter your national ID number"
              />
              {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Vehicle Information</h4>
                  <p className="text-sm text-blue-700">
                    Provide details about your vehicle and driving license for verification.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="vehicleType" className="text-base font-semibold text-gray-900">Vehicle Type *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger className={`mt-2 h-12 text-base ${errors.vehicleType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
            </div>

            <div>
              <Label htmlFor="vehicleRegistration" className="text-base font-semibold text-gray-900">Vehicle Registration Number *</Label>
              <Input
                id="vehicleRegistration"
                value={formData.vehicleRegistration}
                onChange={(e) => handleInputChange('vehicleRegistration', e.target.value)}
                className={`mt-2 h-12 text-base ${errors.vehicleRegistration ? 'border-red-500' : ''}`}
                placeholder="Enter vehicle registration number"
              />
              {errors.vehicleRegistration && <p className="text-red-500 text-sm mt-1">{errors.vehicleRegistration}</p>}
            </div>

            <div>
              <Label htmlFor="licenseNumber" className="text-base font-semibold text-gray-900">Driving License Number *</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className={`mt-2 h-12 text-base ${errors.licenseNumber ? 'border-red-500' : ''}`}
                placeholder="Enter driving license number"
              />
              {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Experience & Availability</h4>
                  <p className="text-sm text-blue-700">
                    Tell us about your delivery experience and availability to help us match you with the right opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="experience" className="text-base font-semibold text-gray-900">Delivery Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger className={`mt-2 h-12 text-base ${errors.experience ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (3+ years)</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>

            <div>
              <Label htmlFor="availability" className="text-base font-semibold text-gray-900">Availability *</Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger className={`mt-2 h-12 text-base ${errors.availability ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="weekends">Weekends Only</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
            </div>

            <div>
              <Label htmlFor="areas" className="text-base font-semibold text-gray-900">Service Areas *</Label>
              <Textarea
                id="areas"
                value={formData.areas}
                onChange={(e) => handleInputChange('areas', e.target.value)}
                className={`mt-2 text-base resize-none ${errors.areas ? 'border-red-500' : ''}`}
                placeholder="List the areas you can deliver to (e.g., Nairobi CBD, Westlands, Kilimani...)"
                rows={3}
              />
              {errors.areas && <p className="text-red-500 text-sm mt-1">{errors.areas}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Required Documents</h4>
                  <p className="text-sm text-blue-700">
                    Upload the required documents for verification. You can upload these later if needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <Label htmlFor="idCard" className="text-base font-semibold text-gray-900">National ID Card</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">Upload a clear photo of your national ID</p>
                <Input
                  id="idCard"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => await handleDocumentUpload('idCard', e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {fileErrors.idCard && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{fileErrors.idCard}</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <Label htmlFor="license" className="text-base font-semibold text-gray-900">Driving License</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">Upload a clear photo of your driving license</p>
                <Input
                  id="license"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => await handleDocumentUpload('license', e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {fileErrors.license && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{fileErrors.license}</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <Label htmlFor="vehicleRegistration" className="text-base font-semibold text-gray-900">Vehicle Registration</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">Upload vehicle registration document</p>
                <Input
                  id="vehicleRegistration"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => await handleDocumentUpload('vehicleRegistration', e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {fileErrors.vehicleRegistration && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{fileErrors.vehicleRegistration}</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <Label htmlFor="insurance" className="text-base font-semibold text-gray-900">Vehicle Insurance</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">Upload vehicle insurance document</p>
                <Input
                  id="insurance"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={async (e) => await handleDocumentUpload('insurance', e.target.files?.[0] || null)}
                  className="mt-2"
                />
                {fileErrors.insurance && (
                  <div className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{fileErrors.insurance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", description: "Personal details", icon: User },
    { number: 2, title: "Vehicle", description: "Vehicle information", icon: Truck },
    { number: 3, title: "Experience", description: "Experience & availability", icon: Clock },
    { number: 4, title: "Documents", description: "Upload documents", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Join Fikisha Delivery</h1>
            <p className="text-muted-foreground mt-2">
              Become a delivery partner and earn money by delivering orders
            </p>
          </div>
          <div></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white shadow-md' 
                      : isActive 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                        : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`text-sm font-semibold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2 hidden md:block"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="h-12 px-6 text-base"
              >
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  type="submit"
                  disabled={!canProceed(currentStep) || isLoading}
                  className="bg-green-600 hover:bg-green-700 h-12 px-8 text-base font-semibold"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  disabled={!canProceed(currentStep)}
                  className="bg-primary hover:bg-primary/90 h-12 px-8 text-base font-semibold"
                >
                  Next Step
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverApplication;
