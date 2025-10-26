import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderData {
  id: string;
  tracking_code: string;
  receiver_name: string;
  receiver_phone: string;
  pickup_address: string;
  delivery_address: string;
  package_description: string | null;
  delivery_amount: number;
  status: string;
  created_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
  driver_id: string | null;
  driver?: {
    full_name: string;
    phone_number: string;
    vehicle_type: string;
    rating: number;
  };
}

const TrackPackage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trackingCode, setTrackingCode] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not yet';
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrderData(null);

    try {
      // Search for order by tracking code
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          driver:driver_profiles(
            id,
            vehicle_type,
            rating,
            profiles!driver_profiles_id_fkey(
              full_name,
              phone_number
            )
          )
        `)
        .eq('tracking_code', trackingCode.trim().toUpperCase())
        .single();

      if (orderError) {
        if (orderError.code === 'PGRST116') {
          setError('No package found with this tracking code. Please check and try again.');
        } else {
          throw orderError;
        }
        return;
      }

      // Transform the data to match our interface
      const transformedOrder: OrderData = {
        ...order,
        driver: order.driver ? {
          full_name: order.driver.profiles?.full_name || 'Unknown Driver',
          phone_number: order.driver.profiles?.phone_number || 'N/A',
          vehicle_type: order.driver.vehicle_type || 'N/A',
          rating: order.driver.rating || 0
        } : undefined
      };

      setOrderData(transformedOrder);
      toast({
        title: "Package found!",
        description: `Tracking details for ${trackingCode} loaded successfully.`
      });
    } catch (error: any) {
      console.error('Error searching for order:', error);
      setError(error.message || 'An error occurred while searching for your package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeline = (order: OrderData) => {
    const timeline = [
      {
        status: 'Order Created',
        time: formatDate(order.created_at),
        completed: true,
        icon: Package
      }
    ];

    if (order.driver_id) {
      timeline.push({
        status: 'Driver Assigned',
        time: formatDate(order.created_at), // You might want to add a driver_assigned_at field
        completed: true,
        icon: User
      });
    }

    if (order.picked_up_at) {
      timeline.push({
        status: 'Package Picked Up',
        time: formatDate(order.picked_up_at),
        completed: true,
        icon: CheckCircle
      });
    }

    if (order.status === 'out_for_delivery') {
      timeline.push({
        status: 'Out for Delivery',
        time: 'In Progress',
        completed: true,
        icon: Truck
      });
    }

    if (order.delivered_at) {
      timeline.push({
        status: 'Delivered',
        time: formatDate(order.delivered_at),
        completed: true,
        icon: MapPin
      });
    } else if (order.status !== 'delivered') {
      timeline.push({
        status: 'Delivered',
        time: 'Pending',
        completed: false,
        icon: MapPin
      });
    }

    return timeline;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-foreground mb-2">Track Your Package</h1>
            <p className="text-xl text-muted-foreground">
              Enter your tracking code to see real-time delivery status
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Enter Tracking Code
              </CardTitle>
              <CardDescription>
                Your tracking code was provided when you created the order (format: FKS12345678)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter tracking code (e.g., FKS12345678)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isLoading ? 'Searching...' : 'Track'}
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Order Details */}
          {orderData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      {orderData.tracking_code}
                    </CardTitle>
                    <CardDescription>
                      Package tracking information
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(orderData.status)}>
                    {formatStatus(orderData.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Delivery Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">To:</span>
                        <span className="ml-2 font-medium">{orderData.receiver_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-2 font-medium">{orderData.receiver_phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-medium text-primary">KSh {orderData.delivery_amount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ordered:</span>
                        <span className="ml-2 font-medium">{formatDate(orderData.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Addresses</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                        <div>
                          <p className="text-sm font-medium">Pickup Location</p>
                          <p className="text-sm text-muted-foreground">{orderData.pickup_address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                        <div>
                          <p className="text-sm font-medium">Delivery Location</p>
                          <p className="text-sm text-muted-foreground">{orderData.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                {orderData.driver && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Your Driver
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{orderData.driver.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {orderData.driver.vehicle_type} • Rating: {orderData.driver.rating}⭐
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="text-sm font-medium">{orderData.driver.phone_number}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Description */}
                {orderData.package_description && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-1">Package Description</p>
                    <p className="text-sm text-muted-foreground">{orderData.package_description}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Delivery Timeline</h4>
                  <div className="space-y-3">
                    {getTimeline(orderData).map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              item.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {item.status}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                          {item.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Tracking Placeholder */}
                {orderData.status === 'out_for_delivery' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-blue-800">Live Tracking</p>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your driver is on the way! Estimated arrival: 15-20 minutes
                    </p>
                    <div className="mt-3 bg-blue-100 rounded p-3 text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-xs text-blue-600">Live map integration would appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrackPackage;
