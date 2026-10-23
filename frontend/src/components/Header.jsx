import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Truck,
  User,
  ShieldCheck,
} from 'lucide-react';
import { openWhatsAppChat, buildGeneralInquiryMessage } from '../utils/whatsapp.js';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsOpen: openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navCategories = [
    { name: 'Kurtas & Kurta Sets', path: '/shop?category=Kurtas%20%26%20Kurta%20Sets' },
    { name: 'Sherwanis & Wedding Wear', path: '/shop?category=Sherwanis%20%26%20Wedding%20Wear' },
    { name: 'Traditional Formal Wear', path: '/shop?category=Traditional%20Formal%20Wear' },
    { name: 'Indo-Western Outfits', path: '/shop?category=Indo-Western%20Outfits' },
    { name: 'Festive Essentials', path: '/shop?category=Festive%20Essentials' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-beige/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-charcoal hover:text-burgundy transition-colors"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 ml-1 text-charcoal hover:text-burgundy"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <span className="w-9 h-9 rounded-sm bg-burgundy flex items-center justify-center text-ivory font-display font-bold text-lg shadow-sm group-hover:bg-burgundy-deep transition-colors">
                  RV
                </span>
                <div className="text-left">
                  <span className="block font-display text-xl sm:text-2xl font-bold tracking-tight text-burgundy group-hover:text-burgundy-deep transition-colors">
                    Royal Vastra
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.25em] text-gold-dark font-medium -mt-1">
                    Haute Couture & Heritage
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link
                to="/"
                className={`text-xs uppercase tracking-wider font-semibold hover:text-burgundy transition-colors py-2 ${
                  location.pathname === '/' ? 'text-burgundy border-b-2 border-burgundy' : 'text-charcoal'
                }`}
              >
                Home
              </Link>

              <div
                className="relative group"
                onMouseEnter={() => setCategoriesDropdown(true)}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                <Link
                  to="/shop"
                  className={`text-xs uppercase tracking-wider font-semibold hover:text-burgundy transition-colors py-2 inline-flex items-center gap-1 ${
                    location.pathname === '/shop' ? 'text-burgundy' : 'text-charcoal'
                  }`}
                >
                  Collections
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Dropdown Menu */}
                {categoriesDropdown && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-beige/60 shadow-elevated py-2 animate-fade-in z-50">
                    <Link
                      to="/shop"
                      className="block px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-burgundy hover:bg-ivory border-b border-beige/30"
                    >
                      View All Menswear
                    </Link>
                    {navCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="block px-5 py-2 text-xs font-medium text-charcoal/80 hover:text-burgundy hover:bg-ivory transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <div className="border-t border-beige/30 mt-2 pt-2 px-5 pb-1">
                      <Link
                        to="/shop?sort=newest"
                        className="block py-1 text-[11px] font-semibold text-gold-dark hover:underline uppercase tracking-wider"
                      >
                        ✦ Explore New Arrivals 2026
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/shop?category=Kurtas%20%26%20Kurta%20Sets"
                className="text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-burgundy transition-colors py-2"
              >
                Kurtas & Sets
              </Link>

              <Link
                to="/shop?category=Sherwanis%20%26%20Wedding%20Wear"
                className="text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-burgundy transition-colors py-2"
              >
                Wedding Wear
              </Link>

              <Link
                to="/shop?category=Traditional%20Formal%20Wear"
                className="text-xs uppercase tracking-wider font-semibold text-charcoal hover:text-burgundy transition-colors py-2"
              >
                Bandhgalas
              </Link>

              <Link
                to="/shop?badge=Festive%20Pick"
                className="text-xs uppercase tracking-wider font-semibold text-gold-dark hover:text-burgundy transition-colors py-2 flex items-center gap-1"
              >
                Festive
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Desktop Search Toggle */}
              <div className="hidden lg:block relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search kurtas, sherwanis..."
                    className="w-44 xl:w-56 pl-8 pr-3 py-1.5 text-xs bg-white/80 border border-beige/70 rounded-none focus:outline-none focus:border-burgundy focus:w-64 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-charcoal/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Track Order */}
              <Link
                to="/track-order"
                className="hidden sm:inline-flex p-2 text-charcoal/80 hover:text-burgundy transition-colors"
                title="Track Your Order"
                aria-label="Track Order"
              >
                <Truck className="w-5 h-5" />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-charcoal/80 hover:text-burgundy transition-colors"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-0 right-0 bg-gold-dark text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => openCart(true)}
                className="relative p-2 text-charcoal/80 hover:text-burgundy transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-burgundy text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* WhatsApp Concierge */}
              <button
                type="button"
                onClick={() => openWhatsAppChat(buildGeneralInquiryMessage('Royal Vastra'))}
                className="hidden md:inline-flex items-center gap-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-none text-xs font-semibold tracking-wider transition-colors ml-1"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Concierge</span>
              </button>

              {/* Admin Icon */}
              <Link
                to="/admin"
                className="hidden sm:inline-flex p-2 text-charcoal/40 hover:text-charcoal transition-colors ml-1"
                title="Store Administrator Portal"
                aria-label="Admin Portal"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {searchOpen && (
          <div className="lg:hidden border-t border-beige/40 px-4 py-3 bg-white animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kurtas, sherwanis, jodhpuri suits..."
                className="w-full pl-9 pr-16 py-2 text-sm bg-neutral-50 border border-beige/70 focus:outline-none focus:border-burgundy"
                autoFocus
              />
              <Search className="w-4 h-4 text-charcoal/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 text-xs font-semibold bg-burgundy text-white uppercase tracking-wider"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-beige/40 flex items-center justify-between bg-charcoal text-white">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-burgundy text-white font-display font-bold text-sm flex items-center justify-center">
                    RV
                  </span>
                  <span className="font-display font-bold text-base">Royal Vastra</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-4 px-5 space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 mb-2">
                  Collections
                </p>
                <Link
                  to="/"
                  className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-charcoal hover:text-burgundy border-b border-beige/20"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-burgundy border-b border-beige/20"
                >
                  Shop All Menswear
                </Link>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="block py-2 text-sm text-charcoal/80 hover:text-burgundy pl-2 border-l-2 border-gold/40 my-1"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to="/shop?sort=newest"
                  className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-gold-dark border-b border-beige/20"
                >
                  ✦ New Arrivals 2026
                </Link>
                <Link
                  to="/shop?priceUnder=999"
                  className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-charcoal/90 border-b border-beige/20"
                >
                  Affordable Ethnic (&lt; ₹999)
                </Link>
              </div>

              {/* Customer Care Links */}
              <div className="px-5 py-4 border-t border-beige/40 space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40">
                  Customer Assistance
                </p>
                <Link
                  to="/track-order"
                  className="flex items-center gap-2 py-1.5 text-sm text-charcoal/80 hover:text-burgundy"
                >
                  <Truck className="w-4 h-4 text-gold-dark" />
                  <span>Track Your Order</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 py-1.5 text-sm text-charcoal/80 hover:text-burgundy"
                >
                  <Heart className="w-4 h-4 text-gold-dark" />
                  <span>Saved Wishlist ({wishlistCount})</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 py-1.5 text-sm text-charcoal/50 hover:text-charcoal"
                >
                  <ShieldCheck className="w-4 h-4 text-charcoal/40" />
                  <span>Store Admin Portal</span>
                </Link>
              </div>
            </div>

            {/* Bottom Contact */}
            <div className="p-5 bg-beige/30 border-t border-beige/50">
              <button
                type="button"
                onClick={() => openWhatsAppChat(buildGeneralInquiryMessage('Royal Vastra'))}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 font-semibold text-xs uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat with Stylist on WhatsApp</span>
              </button>
              <p className="text-[10px] text-center text-charcoal/60 mt-2">
                Mon - Sat: 10:00 AM – 8:00 PM IST
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
