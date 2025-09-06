import { Button } from "@/components/ui/button";
import { ArrowRight, Package, MapPin, Truck, CheckCircle, Smartphone, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HowItWorks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSendPackage = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/customer-auth');
    }
  };

  const handleJoinAsDriver = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/driver-auth');
    }
  };

  const handleLoginAgain = () => {
    navigate('/customer-auth');
  };

  const customerSteps = [
    {
      icon: Smartphone,
      title: "Book Online",
      description: "Enter pickup and delivery details through our app or website."
    },
    {
      icon: CreditCard,
      title: "Pay Securely",
      description: "Choose from mobile money, card, or cash payment options."
    },
    {
      icon: Package,
      title: "Package Pickup",
      description: "Our courier collects your package from the specified location."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Track your package in real-time until safe delivery."
    }
  ];

  const driverSteps = [
    {
      icon: Smartphone,
      title: "Download App",
      description: "Get the Fikisha Driver app and complete your registration."
    },
    {
      icon: CheckCircle,
      title: "Get Verified",
      description: "Submit documents and get verified to start earning."
    },
    {
      icon: MapPin,
      title: "Accept Orders",
      description: "Receive delivery requests and choose the ones that work for you."
    },
    {
      icon: CreditCard,
      title: "Earn Money",
      description: "Complete deliveries and get paid instantly to your account."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            How Fikisha Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and reliable. Whether you're sending or delivering, 
            our process is designed for maximum convenience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Customers */}
          <div>
            <div className="text-center mb-12">
              <div className="bg-gradient-hero p-4 rounded-2xl w-fit mx-auto mb-6">
                <Package className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                For Customers
              </h3>
              <p className="text-muted-foreground">
                Send packages anywhere in Kenya with just a few taps
              </p>
            </div>

            <div className="space-y-8">
              {customerSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={user ? handleSendPackage : handleLoginAgain}
              >
                {user ? 'Go to Dashboard' : 'Login to Send Packages'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* For Drivers */}
          <div>
            <div className="text-center mb-12">
              <div className="bg-gradient-secondary p-4 rounded-2xl w-fit mx-auto mb-6">
                <Truck className="h-10 w-10 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                For Drivers
              </h3>
              <p className="text-muted-foreground">
                Join our network of couriers and start earning money
              </p>
            </div>

            <div className="space-y-8">
              {driverSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-xl flex-shrink-0">
                    <step.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={user ? handleJoinAsDriver : handleLoginAgain}
              >
                {user ? 'Manage Deliveries' : 'Login to Join as Driver'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;