import { Button } from "@/components/ui/button";
import { Package, Truck, ShoppingBag, Clock, Shield, MapPin } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Package,
      title: "Parcel Delivery",
      description: "Send documents, packages, and parcels safely across Kenya with real-time tracking.",
      features: ["Same-day delivery", "Insurance coverage", "Proof of delivery"]
    },
    {
      icon: ShoppingBag,
      title: "E-commerce Delivery",
      description: "Perfect for online businesses. We pick up from sellers and deliver to buyers seamlessly.",
      features: ["Bulk deliveries", "Business rates", "API integration"]
    },
    {
      icon: Truck,
      title: "Express Courier",
      description: "Urgent deliveries when time matters most. Fast, reliable, and professional service.",
      features: ["1-hour delivery", "Priority handling", "Direct routes"]
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Same-day delivery in major cities, next-day nationwide coverage."
    },
    {
      icon: Shield,
      title: "Secure & Insured",
      description: "All packages are insured and handled with maximum security protocols."
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your package every step of the way with live GPS updates."
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
            Our Delivery Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're sending a document or running an e-commerce business, 
            we have the right solution for your delivery needs.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elegant transition-smooth group"
            >
              <div className="bg-gradient-primary p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-bounce">
                <service.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-semibold text-card-foreground mb-4">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-secondary p-4 rounded-2xl w-fit mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;