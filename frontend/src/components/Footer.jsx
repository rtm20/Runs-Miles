import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl">
                  Runs <span className="text-primary">&</span> Miles
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Marathon Events India</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pune's newest running community where miles meet movement. From marathon training
              to weekend group runs, we bring runners together on and off the track.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Events', 'About Us', 'Contact', 'FAQs'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Events' ? '/events' : '/'} 
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Cities */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Marathon Cities</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/events" 
                  className="text-gray-400 hover:text-primary transition-colors flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Follow Us</h3>
            <a
              href="https://www.instagram.com/runs._and._miles?igsh=bDJ4YXVnb3hkdDh0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white/10 px-4 py-3 rounded-xl hover:bg-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-sm font-medium">@runs._and._miles</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 Runs and Miles. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="text-gray-400 hover:text-primary text-sm">Privacy Policy</Link>
            <Link to="/" className="text-gray-400 hover:text-primary text-sm">Terms & Conditions</Link>
            <Link to="/" className="text-gray-400 hover:text-primary text-sm">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
