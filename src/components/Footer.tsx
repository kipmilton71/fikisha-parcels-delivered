import { Package, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Parcel Delivery", href: "#" },
        { name: "E-commerce Delivery", href: "#" },
        { name: "Express Courier", href: "#" },
        { name: "Bulk Deliveries", href: "#" }
      ]
    },
    {
      title: "For Partners",
      links: [
        { name: "Join as Driver", href: "#" },
        { name: "Fleet Partnership", href: "#" },
        { name: "Transport Companies", href: "#" },
        { name: "API Integration", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Track Package", href: "#" },
        { name: "Contact Support", href: "#" },
        { name: "Report Issue", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Linkedin, href: "#", name: "LinkedIn" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-light">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with Fikisha
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Get the latest updates on new features, partnerships, and delivery innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="secondary" className="px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-secondary p-2 rounded-lg">
                <Package className="h-6 w-6 text-secondary-foreground" />
              </div>
              <span className="text-2xl font-bold">Fikisha</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Kenya's premier delivery service, connecting customers, couriers, and businesses 
              for fast, reliable parcel delivery across the country.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-sm">+254 700 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-sm">support@fikisha.co.ke</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-smooth text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-light">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-foreground/80">
              © 2024 Fikisha Deliveries. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.name}
                    className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-smooth">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-smooth">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;