import { useState } from "react";
import { Link } from "wouter";
import { GraduationCap, Menu, X, Home, Info, Mail } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-slate-800">
                Shan Bhoharia's Study Hub
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <button className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Info className="h-4 w-4 mr-1" />
                About
              </button>
              <button className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Contact
              </button>
              <Link href="/admin" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Admin
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-600 hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <button className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left flex items-center">
              <Info className="h-4 w-4 mr-2" />
              About
            </button>
            <button className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
