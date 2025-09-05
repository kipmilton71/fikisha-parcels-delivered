import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Package, Truck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/260af120-2959-4e8f-9da9-f231460da090.png" 
              alt="Fikisha Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-primary">Fikisha</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-smooth">
              Services
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-smooth">
              How it Works
            </a>
            <a href="#partner" className="text-foreground hover:text-primary transition-smooth">
              Partner with Us
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
              Contact
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <DropdownMenuItem 
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                  onSelect={() => {}}
                >
                  <div className="font-semibold text-foreground">Become a Delivery Guy</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Deliver parcels within your area and get paid weekly, good rates.
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                  onSelect={() => {}}
                >
                  <div className="font-semibold text-foreground">Add Fikisha to your online store</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Reach more customers and increase earnings
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                  onSelect={() => {}}
                >
                  <div className="font-semibold text-foreground">Sign up as a fleet owner</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Own a fleet? Partner with us and boost your income
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                  onSelect={() => {}}
                >
                  <div className="font-semibold text-foreground">Fikisha for Bulk sellers</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Scale-up your online business with Fikisha Deliveries
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-foreground hover:text-primary transition-smooth">
                Services
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-smooth">
                How it Works
              </a>
              <a href="#partner" className="text-foreground hover:text-primary transition-smooth">
                Partner with Us
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="hero" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-4">
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => {}}
                    >
                      <div className="font-semibold text-foreground">Become a Delivery Guy</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Deliver parcels within your area and get paid weekly, good rates.
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => {}}
                    >
                      <div className="font-semibold text-foreground">Add Fikisha to your online store</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Reach more customers and increase earnings
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => {}}
                    >
                      <div className="font-semibold text-foreground">Sign up as a fleet owner</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Own a fleet? Partner with us and boost your income
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => {}}
                    >
                      <div className="font-semibold text-foreground">Fikisha for Bulk sellers</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Scale-up your online business with Fikisha Deliveries
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;