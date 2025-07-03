import { GraduationCap, Mail, Phone, Send, MessageCircle, Instagram, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <GraduationCap className="h-6 w-6 text-primary mr-2" />
              Shan Bhoharia's Study Hub
            </h3>
            <p className="text-slate-600 text-sm">
              Your one-stop destination for all college study materials, previous papers, and academic resources.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                  All Semesters
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                  Previous Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                  Practical Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                  Assignments
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Contact & Support</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                shan.bhoharia@email.com
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +91 98765 43210
              </p>
              <div className="flex space-x-3 mt-3">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Send className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-6 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center">
            &copy; 2024 Shan Bhoharia's Study Hub. Made with{" "}
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
