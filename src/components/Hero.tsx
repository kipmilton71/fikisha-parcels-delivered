import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSendPackage = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleJoinAsDriver = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLoginAgain = () => {
    navigate('/auth');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Fast, Reliable
                <span className="block text-primary">Parcel Delivery</span>
                Across Kenya
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Send packages, receive e-commerce orders, and connect with trusted couriers. 
                Your deliveries, simplified and secured with Fikisha.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-success" />
                <span>Same-day delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span>Insured packages</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-success" />
                <span>Real-time tracking</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="shadow-elegant"
                    onClick={handleSendPackage}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="partner" 
                    size="xl"
                    onClick={handleJoinAsDriver}
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    Manage Deliveries
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="shadow-elegant"
                    onClick={handleLoginAgain}
                  >
                    Login to Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="partner" 
                    size="xl"
                    onClick={handleLoginAgain}
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Couriers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Video */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="/src/assets/hero-delivery.jpg"
                alt="Fast delivery service - courier delivering packages across Kenya"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">Package Delivered</div>
                  <div className="text-sm text-muted-foreground">Just now in Nairobi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;