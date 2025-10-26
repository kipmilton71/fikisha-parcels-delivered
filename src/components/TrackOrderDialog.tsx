import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Package, Clock, CheckCircle, Truck, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/real-client';

interface TrackOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
}

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

const TrackOrderDialog: React.FC<TrackOrderDialogProps> = ({ open, onOpenChange, orderId }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && orderId) {
      fetchOrderData();
    }
  }, [open, orderId]);

  const fetchOrderData = async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError('');
    
    try {
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
        .eq('id', orderId)
        .single();

      if (orderError) {
        throw orderError;
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
    } catch (error: any) {
      console.error('Error fetching order:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-success text-success-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
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

  if (!orderId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Track Order
          </DialogTitle>
          <DialogDescription>
            Track your package delivery in real-time
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : orderData ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{orderData.tracking_code}</h3>
                <Badge className={getStatusColor(orderData.status)}>
                  {formatStatus(orderData.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">To</p>
                  <p className="font-medium">{orderData.receiver_name}</p>
                  <p className="text-muted-foreground">{orderData.receiver_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium text-primary">KSh {orderData.delivery_amount}</p>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            {orderData.driver && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
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

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{orderData.pickup_address}</p>
              </div>
            </div>
            
            <div className="ml-6 border-l-2 border-dashed border-muted h-4"></div>
            
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium">Delivery Location</p>
                <p className="text-sm text-muted-foreground">{orderData.delivery_address}</p>
              </div>
            </div>
          </div>

            {/* Timeline */}
            <div className="space-y-3">
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
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Package Description */}
            {orderData.package_description && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-1">Package Description</p>
                <p className="text-sm text-muted-foreground">{orderData.package_description}</p>
              </div>
            )}

            {/* Live Location (Placeholder) */}
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
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TrackOrderDialog;
