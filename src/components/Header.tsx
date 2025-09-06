import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Package, Truck, Users, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "./NotificationCenter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/260af120-2959-4e8f-9da9-f231460da090.png" 
              alt="Fikisha Logo" 
              className="h-14 w-14 object-contain"
            />
            <span className="text-3xl font-bold text-primary">Deliveries</span>
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
            {user ? (
              <>
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {profile?.full_name || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/customer-auth')}
                >
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
                      onSelect={() => navigate('/driver-auth')}
                    >
                      <div className="font-semibold text-foreground">Become a Delivery Guy</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Deliver parcels within your area and get paid weekly, good rates.
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => navigate('/customer-auth')}
                    >
                      <div className="font-semibold text-foreground">Send Packages</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Create an account to send and track your packages
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => navigate('/customer-auth')}
                    >
                      <div className="font-semibold text-foreground">Add Fikisha to your online store</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Reach more customers and increase earnings
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onSelect={() => navigate('/customer-auth')}
                    >
                      <div className="font-semibold text-foreground">Fikisha for Bulk sellers</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Scale-up your online business with Fikisha Deliveries
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
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
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/customer-auth')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/customer-auth')}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;