import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Facebook, Instagram, Youtube, Mail, MapPin, ArrowRight, User, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Neighbourhood {
  id: string;
  name: string;
  slug: string;
  region?: string;
}

export const Footer = () => {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedNeighbourhoods, setGroupedNeighbourhoods] = useState<Record<string, Neighbourhood[]>>({});

  useEffect(() => {
    const fetchNeighbourhoods = async () => {
      try {
        const { data } = await supabase
          .from("neighbourhoods")
          .select("id, name, slug, region")
          .order("region")
          .order("name");

        if (data) {
          setNeighbourhoods(data);
          
          // Group by region
          const grouped: Record<string, Neighbourhood[]> = {};
          data.forEach((hood) => {
            const region = hood.region || "Other";
            if (!grouped[region]) {
              grouped[region] = [];
            }
            grouped[region].push(hood);
          });
          setGroupedNeighbourhoods(grouped);
        }
      } catch (error) {
        console.error("Error fetching neighbourhoods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighbourhoods();
  }, []);

  // Get popular neighbourhoods (first 4)
  const popularNeighbourhoods = neighbourhoods.slice(0, 4);
  
  // Get all regions sorted
  const regions = Object.keys(groupedNeighbourhoods).sort();

  return (
    <footer className="bg-[#1a1a1a] text-[#888888] py-12 mt-20">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-xl mb-4">
              <Shield className="w-6 h-6" />
              <span>Humble Halal</span>
            </div>
            <p className="text-sm text-[#aaaaaa] mb-4 leading-relaxed">
              Your trusted source for finding Halal businesses in Singapore. Discover verified MUIS certified 
              and Muslim-owned restaurants, cafes, and services across all districts.
            </p>
            <Link to="/about" className="text-sm text-[#aaaaaa] hover:text-white transition-colors flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Contact Us
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#neighbourhoods" className="hover:text-white transition-colors">Browse All Districts</Link></li>
              <li><Link to="/advertise" className="hover:text-white transition-colors">Advertise With Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Popular Districts */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Popular Districts</h4>
            <ul className="space-y-2 text-sm">
              {popularNeighbourhoods.map((hood) => (
                <li key={hood.id}>
                  <Link 
                    to={`/neighbourhood/${hood.slug}`} 
                    className="hover:text-white transition-colors"
                  >
                    {hood.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/#neighbourhoods" 
                  className="hover:text-white transition-colors flex items-center gap-1 text-primary"
                >
                  View All Districts <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Business</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/business/submit" className="hover:text-white transition-colors flex items-center gap-1">
                  <User className="w-3 h-3" />
                  List Your Business FREE
                </Link>
              </li>
              <li>
                <Link to="/badge-generator" className="hover:text-white transition-colors flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  Get Free Featured Month
                </Link>
              </li>
              <li><Link to="/claim-business" className="hover:text-white transition-colors">Claim Your Business</Link></li>
              <li><Link to="/business-dashboard" className="hover:text-white transition-colors">Business Support</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Send Feedback</Link></li>
            </ul>
          </div>
        </div>

        {/* Browse by District Section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="text-white font-heading font-bold text-2xl mb-6 text-center">
            Browse Halal Businesses by District
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <div key={region} className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{region}</h4>
                  <ul className="space-y-1.5">
                    {groupedNeighbourhoods[region].map((hood) => (
                      <li key={hood.id}>
                        <Link 
                          to={`/neighbourhood/${hood.slug}`}
                          className="text-sm text-[#aaaaaa] hover:text-white transition-colors"
                        >
                          {hood.name} Halal Businesses
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-4 text-[#aaaaaa]">
            <span>© {new Date().getFullYear()} Humble Halal</span>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-primary transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
