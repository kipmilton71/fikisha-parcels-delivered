import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Navigation, Phone } from 'lucide-react';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onAccept: (order: any) => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onOpenChange, order, onAccept }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Review order details before accepting
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{order.tracking_code}</h3>
              <Badge variant="outline">{order.package_description}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Delivery Fee</p>
                <p className="font-medium text-primary text-lg">KSh {order.delivery_amount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Distance</p>
                <p className="font-medium">{order.distance}</p>
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-2">Receiver Information</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium">{order.receiver_name}</p>
              <p className="text-sm text-muted-foreground">{order.receiver_phone}</p>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{order.pickup_address}</p>
              </div>
            </div>
            
            <div className="ml-6 border-l-2 border-dashed border-muted h-4"></div>
            
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
              <div>
                <p className="text-sm font-medium">Delivery Location</p>
                <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* Package Description */}
          {order.package_description && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-1">Package Description</p>
              <p className="text-sm text-muted-foreground">{order.package_description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onAccept(order);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Accept Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
