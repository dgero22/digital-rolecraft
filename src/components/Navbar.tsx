
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, PlusCircle, MessageCircle, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-1" /> },
    { path: '/create', label: 'Create', icon: <PlusCircle className="h-4 w-4 mr-1" /> },
    { path: '/library', label: 'Library', icon: <Users className="h-4 w-4 mr-1" /> },
    { path: '/simulator', label: 'Simulator', icon: <MessageCircle className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-lg tracking-tight">Persona</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            asChild
            variant="ghost" 
            size="sm"
            className="hidden md:flex"
          >
            <Link to="/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Persona
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center px-2 transition-colors ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center h-6">
                {link.icon}
              </div>
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
