import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 mt-20 border-t border-border/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-heading font-bold text-xl mb-3">Humble Halal</div>
            <p className="text-sm opacity-80 mb-4">
              Discover the best Halal businesses across Singapore.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Discover</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/category/food-beverage" className="hover:opacity-100">F&B</Link></li>
              <li><Link to="/category/groceries" className="hover:opacity-100">Groceries</Link></li>
              <li><Link to="/category/lifestyle" className="hover:opacity-100">Lifestyle</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">About Us</a></li>
              <li><a href="#" className="hover:opacity-100">Contact</a></li>
              <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Business</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/auth" className="hover:opacity-100">List Your Business</Link></li>
              <li><a href="#" className="hover:opacity-100">Claim Business</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-sm opacity-70">
          <p>© 2024 Humble Halal Business Directory. All rights reserved. Made with ❤️ in Singapore</p>
        </div>
      </div>
    </footer>
  );
};
