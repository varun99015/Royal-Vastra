import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Send,
  CheckCircle,
} from 'lucide-react';
import { openWhatsAppChat, buildGeneralInquiryMessage } from '../utils/whatsapp.js';
import PolicyModal from './PolicyModal.jsx';

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <>
      {/* Trust & Guarantee Banner */}
      <section className="bg-ivory border-t border-b border-beige/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold-dark mb-2.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-xs sm:text-sm text-charcoal">
                Handcrafted Heritage
              </h4>
              <p className="text-[11px] text-charcoal/60 mt-0.5">Authentic Indian craftsmanship</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold-dark mb-2.5">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-xs sm:text-sm text-charcoal">
                Complimentary Shipping
              </h4>
              <p className="text-[11px] text-charcoal/60 mt-0.5">On all domestic orders over ₹999</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold-dark mb-2.5">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-xs sm:text-sm text-charcoal">
                7-Day Easy Exchange
              </h4>
              <p className="text-[11px] text-charcoal/60 mt-0.5">Hassle-free doorstep pickup</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold-dark mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-xs sm:text-sm text-charcoal">
                Honest Direct Pricing
              </h4>
              <p className="text-[11px] text-charcoal/60 mt-0.5">No designer brand markups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-charcoal text-ivory/80 pt-16 pb-8 border-t border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand Info (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <span className="w-8 h-8 bg-gold text-charcoal font-display font-bold text-base flex items-center justify-center">
                  RV
                </span>
                <span className="font-display text-2xl font-bold text-white tracking-wide">
                  Royal Vastra
                </span>
              </Link>
              <p className="text-xs text-ivory/70 leading-relaxed max-w-sm">
                Redefining Indian menswear with regal silhouettes, breathable natural textiles, and bespoke tailoring. From daily festive kurtas to royal wedding ensembles, we bring grandeur within reach.
              </p>

              {/* Direct Concierge CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openWhatsAppChat(buildGeneralInquiryMessage('Royal Vastra'))}
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect with Concierge on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Col 2: Collections */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-gold/40 pb-1 inline-block">
                Collections
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/shop?category=Kurtas%20%26%20Kurta%20Sets" className="hover:text-gold transition-colors">
                    Kurtas & Sets
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Sherwanis%20%26%20Wedding%20Wear" className="hover:text-gold transition-colors">
                    Sherwanis & Wedding Wear
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Traditional%20Formal%20Wear" className="hover:text-gold transition-colors">
                    Bandhgalas & Jodhpuris
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Indo-Western%20Outfits" className="hover:text-gold transition-colors">
                    Indo-Western Fusion
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Festive%20Essentials" className="hover:text-gold transition-colors">
                    Festive Essentials
                  </Link>
                </li>
                <li>
                  <Link to="/shop?priceUnder=999" className="hover:text-gold text-gold-light transition-colors">
                    Budget Styles &lt; ₹999
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Policies */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-gold/40 pb-1 inline-block">
                Customer Care
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/track-order" className="hover:text-gold transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-gold transition-colors">
                    Wishlist & Preferences
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('shipping')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    Shipping & Delivery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('returns')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    7-Day Exchanges & Returns
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('privacy')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Store Contact & Updates */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-gold/40 pb-1 inline-block">
                Atelier & Contact
              </h4>
              <ul className="space-y-2.5 text-xs text-ivory/70">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Shop 42, Heritage Colonnade, MG Road, Bengaluru 560001</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="mailto:concierge@royalvastra.com" className="hover:text-white transition-colors">
                    concierge@royalvastra.com
                  </a>
                </li>
              </ul>

              {/* Newsletter / Updates Form */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-[11px] text-ivory/80 font-medium mb-2">
                  Get seasonal lookbooks & private festive previews:
                </p>
                {subscribed ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs py-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Welcome to the Royal Vastra circle!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs px-3 py-2 focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="bg-gold text-charcoal px-3 py-2 hover:bg-gold-light transition-colors"
                      title="Subscribe"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory/50 gap-3">
            <p>© {new Date().getFullYear()} Royal Vastra Haute Couture. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>GST Verified</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
              <span>•</span>
              <Link to="/admin" className="hover:text-gold transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {activePolicy && <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />}
    </>
  );
}
