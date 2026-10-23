import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/helpers.js';
import {
  Heart,
  Trash2,
  ShoppingBag,
  Sliders,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movedItems, setMovedItems] = useState({});

  // Style Matcher Preferences State
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefBudget, setPrefBudget] = useState('all');
  const [prefOccasion, setPrefOccasion] = useState('all');
  const [prefCategory, setPrefCategory] = useState('all');
  const [prefStyle, setPrefStyle] = useState('all');

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Classic', 1);
    removeFromWishlist(product.id);
    setMovedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setMovedItems((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-beige/40 pb-6 flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
            Personal Atelier Wardrobe
          </span>
          <h1 className="font-display text-3xl font-bold text-charcoal mt-1">
            Saved Ensembles ({wishlist.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center gap-2 px-4 py-2 border border-gold text-gold-dark hover:bg-gold hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
        >
          <Sliders className="w-4 h-4" />
          <span>{showPreferences ? 'Hide Style Matcher' : 'Open Style Matcher Wizard'}</span>
        </button>
      </div>

      {/* Interactive Style Matcher / Product Preferences Section */}
      {showPreferences && (
        <div className="p-6 sm:p-8 bg-ivory border border-gold/40 space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-dark" />
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal">
                Atelier Style Matcher
              </h3>
              <p className="text-xs text-charcoal/60">
                Specify your celebratory preferences to narrow down suitable outfits from our royal collection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Preferred Budget
              </label>
              <select
                value={prefBudget}
                onChange={(e) => setPrefBudget(e.target.value)}
                className="w-full p-2.5 bg-white border border-beige/70 text-xs focus:outline-none focus:border-burgundy"
              >
                <option value="all">Any Budget</option>
                <option value="under-1000">Affordable (&lt; ₹999)</option>
                <option value="1000-2500">Festive Mid-Range (₹999 – ₹2,499)</option>
                <option value="2500-5000">Occasion Ready (₹2,500 – ₹4,999)</option>
                <option value="above-5000">Bridal & Bespoke (&gt; ₹5,000)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Upcoming Occasion
              </label>
              <select
                value={prefOccasion}
                onChange={(e) => setPrefOccasion(e.target.value)}
                className="w-full p-2.5 bg-white border border-beige/70 text-xs focus:outline-none focus:border-burgundy"
              >
                <option value="all">All Occasions</option>
                <option value="Wedding Ceremonies">Wedding Ceremony / Baraat</option>
                <option value="Engagement & Reception">Engagement & Reception</option>
                <option value="Festivals & Family Celebrations">Diwali / Eid / Navratri</option>
                <option value="Pooja & Traditional Occasions">Pooja / Temple Visit</option>
                <option value="Casual">Casual / Everyday Comfort</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Clothing Category
              </label>
              <select
                value={prefCategory}
                onChange={(e) => setPrefCategory(e.target.value)}
                className="w-full p-2.5 bg-white border border-beige/70 text-xs focus:outline-none focus:border-burgundy"
              >
                <option value="all">All Categories</option>
                <option value="Kurtas & Kurta Sets">Kurtas & Kurta Sets</option>
                <option value="Sherwanis & Wedding Wear">Sherwanis & Wedding Wear</option>
                <option value="Traditional Formal Wear">Traditional Formal Wear</option>
                <option value="Indo-Western Outfits">Indo-Western Fusion</option>
                <option value="Festive Essentials">Festive Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Aesthetic Style
              </label>
              <select
                value={prefStyle}
                onChange={(e) => setPrefStyle(e.target.value)}
                className="w-full p-2.5 bg-white border border-beige/70 text-xs focus:outline-none focus:border-burgundy"
              >
                <option value="all">Any Style</option>
                <option value="simple">Minimalist & Clean</option>
                <option value="embroidered">Zari & Embroidered</option>
                <option value="festive">Vibrant & Printed</option>
                <option value="regal">Royal Velvet & Brocade</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Link
              to={`/shop?category=${encodeURIComponent(prefCategory)}&occasion=${encodeURIComponent(prefOccasion)}`}
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5"
            >
              <span>View Filtered Outfits in Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white border border-beige/40 p-8">
          <div className="w-16 h-16 rounded-full bg-beige/20 text-gold-dark flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-charcoal">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Tap the heart icon on any kurta, sherwani, or bandhgala to save it for upcoming wedding preparations or festive occasions.
          </p>
          <div className="pt-2">
            <Link to="/shop" className="btn-primary py-3 px-8 text-xs font-semibold tracking-widest">
              Explore Royal Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-white border border-beige/50 hover:border-gold/70 transition-all duration-300 shadow-sm"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                <Link to={`/product/${item.slug || item.id}`}>
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-charcoal/60 hover:text-red-600 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-gold-dark">
                    {item.subcategory || item.category}
                  </span>
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="block font-display font-medium text-sm text-charcoal hover:text-burgundy mt-0.5 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display font-bold text-base text-burgundy">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-charcoal/40 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className={`w-full py-2.5 px-3 text-xs uppercase tracking-wider font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    movedItems[item.id]
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-burgundy text-burgundy hover:bg-burgundy hover:text-white'
                  }`}
                >
                  {movedItems[item.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Moved to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
