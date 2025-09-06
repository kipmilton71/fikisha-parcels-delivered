import { Button } from "@/components/ui/button";
import { Truck, Users, TrendingUp, Shield, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Partnership = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePartnerSignup = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/driver-auth');
    }
  };

  const handleLoginAgain = () => {
    navigate('/driver-auth');
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access new revenue streams by partnering with Kenya's fastest-growing delivery network."
    },
    {
      icon: Users,
      title: "Expand Your Fleet",
      description: "Connect with verified drivers and courier services to scale your operations."
    },
    {
      icon: Shield,
      title: "Trusted Network",
      description: "Join a verified network of transport partners with insurance and security protocols."
    }
  ];

  const partnerTypes = [
    {
      title: "Transport Companies",
      description: "Partner with us to expand your delivery services and reach more customers across Kenya.",
      features: ["Volume discounts", "Priority support", "Custom integration", "Performance analytics"]
    },
    {
      title: "Fleet Owners",
      description: "Maximize your vehicle utilization by joining our network of delivery partners.",
      features: ["Guaranteed work", "Flexible schedules", "Competitive rates", "Driver support"]
    },
    {
      title: "Individual Couriers",
      description: "Whether you have a motorcycle, car, or van, join our courier network and start earning.",
      features: ["Instant payouts", "Flexible hours", "Training provided", "Equipment support"]
    }
  ];

  return (
    <section id="partner" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Partner With Fikisha
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join Kenya's leading delivery network. Whether you're a transport company, 
            fleet owner, or individual courier, we have partnership opportunities that grow with you.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6">
                <benefit.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partner Types */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {partnerTypes.map((type, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elegant transition-smooth"
            >
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                {type.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {type.description}
              </p>
              <ul className="space-y-3 mb-8">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={user ? handlePartnerSignup : handleLoginAgain}
              >
                {user ? 'Go to Dashboard' : 'Login to Get Started'}
              </Button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-hero rounded-3xl p-12 text-center text-primary-foreground">
          <div className="max-w-2xl mx-auto">
            <Truck className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-bold mb-4">
              Ready to Partner with Us?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of transport partners already earning with Fikisha. 
              Get started today and become part of Kenya's delivery revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="shadow-secondary"
                onClick={user ? handlePartnerSignup : handleLoginAgain}
              >
                <Truck className="mr-2 h-5 w-5" />
                {user ? 'Go to Dashboard' : 'Login to Join as Partner'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={user ? handlePartnerSignup : handleLoginAgain}
              >
                <Mail className="mr-2 h-5 w-5" />
                {user ? 'Manage Account' : 'Login to Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;