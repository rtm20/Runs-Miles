import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

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
              Organizing premium marathon events across India. Join thousands of runners 
              in experiencing the joy of running through India's most beautiful cities.
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
              {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'].map((city) => (
                <li key={city}>
                  <Link 
                    to="/events" 
                    className="text-gray-400 hover:text-primary transition-colors flex items-center"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary mr-3 mt-1" />
                <span className="text-gray-400">contact@runsandmiles.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-primary mr-3 mt-1" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Runner's Lane, Sports Complex<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-white/10 p-2 rounded-lg hover:bg-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
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
