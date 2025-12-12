'use client';

import {
  Facebook, Instagram, Twitter, Linkedin, Mail, Phone,
  MapPin, Droplet, ArrowRight, Send
} from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  services: [
    { name: 'Premium Wash', href: '/services' },
    { name: 'Interior Detailing', href: '/services' },
    { name: 'Full Detailing', href: '/services' },
    { name: 'Express Wash', href: '/services' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/support' },
    { name: 'Careers', href: '/careers' },
    { name: 'Feedback', href: '/feedback' },
  ],
  support: [
    { name: 'Help Center', href: '/support' },
    { name: 'Track Order', href: '/orders' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Complaints', href: '/support/complaints' },
  ],
};

export default function EnhancedFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-lg sm:rounded-xl blur-md sm:blur-lg opacity-50"></div>
                  <div className="relative bg-primary p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-xl">
                    <Droplet className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Eazy Wash</span>
                  <span className="text-xs text-muted-foreground -mt-1 font-medium">Premium Service</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-md">
                Professional car wash and detailing services delivered right to your doorstep. Experience premium quality with every wash.
              </p>

              {/* Newsletter */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-foreground font-semibold mb-3 text-xs sm:text-sm">Subscribe to Our Newsletter</h4>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-muted border border-border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-2 border-primary"
                  >
                    {subscribed ? (
                      <>
                        <span className="text-sm">✓</span>
                        <span className="text-xs sm:text-sm">Subscribed</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Subscribe</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 sm:gap-3">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                    aria-label={`Social link ${idx + 1}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="text-foreground font-semibold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-0 -ml-5 sm:-ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2">
              <h4 className="text-foreground font-semibold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-0 -ml-5 sm:-ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-foreground font-semibold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Get in Touch</h4>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { Icon: Phone, label: 'Phone', value: '+91 88489 19507', href: 'tel:+918848919507' },
                  { Icon: Mail, label: 'Email', value: 'support@eazywash.com', href: 'mailto:support@eazywash.com' },
                  { Icon: MapPin, label: 'Location', value: 'Mumbai, Maharashtra', href: '#' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2 sm:gap-3 group">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-muted group-hover:bg-primary transition-all duration-300 flex-shrink-0">
                      <item.Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">{item.label}</span>
                      <a href={item.href} className="text-xs sm:text-sm text-foreground hover:text-primary transition-colors truncate">
                        {item.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="text-foreground font-medium">Eazy Wash Services</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-primary transition-colors relative group whitespace-nowrap"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
