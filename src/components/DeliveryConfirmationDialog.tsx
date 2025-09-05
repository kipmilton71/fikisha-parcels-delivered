import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeliveryConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const DeliveryConfirmationDialog: React.FC<DeliveryConfirmationDialogProps> = ({ open, onOpenChange, order }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!order) return null;

  const handleCompleteDelivery = async () => {
    if (!confirmationCode) {
      toast({
        title: "Confirmation code required",
        description: "Please enter the confirmation code to complete delivery.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement delivery completion logic
      console.log('Completing delivery:', order.id, confirmationCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Delivery completed!",
        description: `Order ${order.tracking_code} has been successfully delivered.`
      });
      
      setConfirmationCode('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error completing delivery",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Complete Delivery
          </DialogTitle>
          <DialogDescription>
            Confirm delivery completion with the customer
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Info */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{order.tracking_code}</p>
                <p className="text-sm text-muted-foreground">To: {order.receiver_name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
          </div>

          {/* Confirmation Code */}
          <div className="space-y-2">
            <Label htmlFor="confirmation-code">Confirmation Code</Label>
            <Input
              id="confirmation-code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter confirmation code"
              className="text-center text-lg font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Ask the customer for the confirmation code to complete delivery
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteDelivery}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Completing..." : "Complete Delivery"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryConfirmationDialog;
