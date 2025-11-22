import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Facebook, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#111111] text-[#888888] py-20 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-xl mb-4">
              <Shield className="w-6 h-6" />
              <span>Humble Halal</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Home</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-secondary transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-secondary transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-secondary transition-colors">FAQs</Link></li>
              <li><Link to="/" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/auth" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link to="/category/food-beverage" className="hover:text-secondary transition-colors">Verified Listings</Link></li>
              <li><Link to="/" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div>© Humble Halal - Discover Halal Singapore</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white hover:text-secondary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-secondary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-secondary transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
