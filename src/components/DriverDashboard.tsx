import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Package, 
  Star, 
  Navigation, 
  Clock, 
  DollarSign,
  CheckCircle,
  Phone,
  MessageCircle
} from 'lucide-react';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
import DeliveryConfirmationDialog from '@/components/DeliveryConfirmationDialog';
import { useAuth } from '@/hooks/useAuth';
import { useDriverEarnings } from '@/hooks/useDriverEarnings';
import { DeliveryTasksAPI } from '@/api/deliveryTasks';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useDriverEarnings(user?.id);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTrackingCodeInput, setShowTrackingCodeInput] = useState(false);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);

  // Fetch data on component mount and when availability changes
  useEffect(() => {
    if (user) {
      fetchAvailableOrders();
      fetchActiveDeliveries();
    }
  }, [user, isAvailable]);

  const fetchAvailableOrders = async () => {
    if (!isAvailable) return;
    
    setLoading(true);
    try {
      const result = await DeliveryTasksAPI.getAvailableTasks();
      if (result.success) {
        setAvailableOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching available orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDeliveries = async () => {
    if (!user) return;
    
    try {
      const result = await DeliveryTasksAPI.getDriverTasks(user.id);
      if (result.success) {
        setActiveDeliveries(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching active deliveries:', error);
    }
  };

  const handleAcceptOrder = async (order: any) => {
    if (!user) return;
    
    try {
      const result = await DeliveryTasksAPI.acceptTask(order.id, user.id);
      if (result.success) {
        // Refresh the lists
        fetchAvailableOrders();
        fetchActiveDeliveries();
        setShowOrderDetails(false);
      } else {
        console.error('Failed to accept order:', result.error);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCompleteDelivery = (order: any) => {
    setSelectedOrder(order);
    setCompletingOrderId(order.id);
    setShowTrackingCodeInput(true);
  };

  const handleCompleteDeliveryWithCode = async () => {
    if (!completingOrderId || !trackingCodeInput.trim()) {
      console.error('Missing order ID or tracking code');
      return;
    }

    try {
      const result = await DeliveryTasksAPI.completeDeliveryWithTrackingCode(
        completingOrderId, 
        trackingCodeInput.trim()
      );

      if (result.success) {
        // Refresh the lists
        fetchAvailableOrders();
        fetchActiveDeliveries();
        setShowTrackingCodeInput(false);
        setTrackingCodeInput('');
        setCompletingOrderId(null);
        setSelectedOrder(null);
      } else {
        console.error('Failed to complete delivery:', result.error);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header with availability toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
            <p className="text-muted-foreground">Manage your deliveries and earnings</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Available for deliveries</span>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={setIsAvailable}
            />
            <Badge variant={isAvailable ? "default" : "secondary"}>
              {isAvailable ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold">KSh {stats.todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Deliveries</p>
                  <p className="text-2xl font-bold">{stats.todayDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{stats.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Orders</TabsTrigger>
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Near You</CardTitle>
                <CardDescription>Accept orders that match your location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isAvailable ? (
                    availableOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">KSh {order.delivery_amount}</h4>
                            <p className="text-sm text-muted-foreground">{order.distance} • {order.tracking_code}</p>
                          </div>
                          <Badge variant="outline">{order.package_description}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Pickup</p>
                              <p className="text-sm text-muted-foreground">{order.pickup_address}</p>
                              {order.integration_data?.vendor_county && (
                                <p className="text-xs text-muted-foreground">
                                  {order.integration_data.vendor_county}
                                  {order.integration_data.vendor_constituency && `, ${order.integration_data.vendor_constituency}`}
                                  {order.integration_data.vendor_ward && `, ${order.integration_data.vendor_ward}`}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Drop-off</p>
                              <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                              <p className="text-sm text-muted-foreground">To: {order.receiver_name}</p>
                              {order.integration_data?.customer_county && (
                                <p className="text-xs text-muted-foreground">
                                  {order.integration_data.customer_county}
                                  {order.integration_data.customer_constituency && `, ${order.integration_data.customer_constituency}`}
                                  {order.integration_data.customer_ward && `, ${order.integration_data.customer_ward}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* WhatsApp Contact Info */}
                        {(order.integration_data?.vendor_whatsapp || order.integration_data?.customer_whatsapp) && (
                          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-blue-900">Contact Information:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.integration_data?.vendor_whatsapp && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => window.open(`https://wa.me/${order.integration_data.vendor_whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Contact Vendor
                                </Button>
                              )}
                              {order.integration_data?.customer_whatsapp && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => window.open(`https://wa.me/${order.integration_data.customer_whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Contact Customer
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button 
                            onClick={() => handleViewOrder(order)}
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            onClick={() => handleAcceptOrder(order)}
                            size="sm"
                            className="flex-1"
                          >
                            Accept Order
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold mb-2">You're offline</p>
                      <p className="text-muted-foreground mb-4">Turn on availability to see orders</p>
                      <Button onClick={() => setIsAvailable(true)}>Go Online</Button>
                    </div>
                  )}
                  
                  {isAvailable && availableOrders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold mb-2">No orders available</p>
                      <p className="text-muted-foreground">Check back soon for new delivery opportunities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Deliveries</CardTitle>
                <CardDescription>Orders you're currently delivering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDeliveries.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">KSh {order.delivery_amount}</h4>
                          <p className="text-sm text-muted-foreground">{order.tracking_code}</p>
                          <Badge className="mt-1 bg-orange-100 text-orange-800">
                            {order.status === 'picked_up' ? 'Picked Up' : 'Out for Delivery'}
                          </Badge>
                        </div>
                        <Badge variant="outline">{order.package_description}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Deliver to</p>
                            <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                            <p className="text-sm text-muted-foreground">To: {order.receiver_name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* WhatsApp Contact Info for Active Deliveries */}
                      {(order.integration_data?.vendor_whatsapp || order.integration_data?.customer_whatsapp) && (
                        <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-blue-900">Contact Information:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.integration_data?.vendor_whatsapp && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => window.open(`https://wa.me/${order.integration_data.vendor_whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Vendor
                              </Button>
                            )}
                            {order.integration_data?.customer_whatsapp && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => window.open(`https://wa.me/${order.integration_data.customer_whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Customer
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button 
                          onClick={() => handleCompleteDelivery(order)}
                          size="sm"
                          className="flex-1"
                        >
                          Complete Delivery
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {activeDeliveries.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold mb-2">No active deliveries</p>
                      <p className="text-muted-foreground">Accept orders to start delivering</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <OrderDetailsDialog 
          open={showOrderDetails} 
          onOpenChange={setShowOrderDetails}
          order={selectedOrder}
          onAccept={handleAcceptOrder}
        />
        
        <DeliveryConfirmationDialog 
          open={showDeliveryConfirmation} 
          onOpenChange={setShowDeliveryConfirmation}
          order={selectedOrder}
        />

        {/* Tracking Code Input Modal */}
        {showTrackingCodeInput && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Complete Delivery
                </CardTitle>
                <CardDescription>
                  Ask the customer for their tracking code to complete delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tracking-code">Customer Tracking Code</Label>
                  <Input
                    id="tracking-code"
                    value={trackingCodeInput}
                    onChange={(e) => setTrackingCodeInput(e.target.value)}
                    placeholder="Enter tracking code from customer"
                    className="font-mono text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The customer should provide this code to verify delivery
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTrackingCodeInput(false);
                      setTrackingCodeInput('');
                      setCompletingOrderId(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCompleteDeliveryWithCode}
                    disabled={!trackingCodeInput.trim()}
                    className="flex-1"
                  >
                    Complete Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
