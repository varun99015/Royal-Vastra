import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, getDiscountPercent } from '../utils/helpers.js';
import { Heart, ShoppingBag, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const discount = getDiscountPercent(product.originalPrice, product.price);
  const isFavorited = isInWishlist(product.id);

  // Fallback image handling
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80';
  const secondaryImage = product.images?.[1] || mainImage;
  const displayImage = isHovered && product.images?.[1] ? secondaryImage : mainImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || 'Classic';
    addToCart(product, defaultSize, defaultColor, 1);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-beige/40 hover:border-gold/60 transition-all duration-300 hover:shadow-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80';
            }}
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 shadow-xs ${
                product.badge === 'Bestseller'
                  ? 'bg-burgundy text-white'
                  : product.badge === 'Groom Collection' || product.badge === 'Royal Couture'
                  ? 'bg-gold-royal text-charcoal'
                  : product.badge === 'Festive Pick'
                  ? 'bg-amber-700 text-white'
                  : product.badge === 'Under ₹999'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-charcoal text-white'
              }`}
            >
              {product.badge}
            </span>
          )}

          {discount && !product.badge && (
            <span className="bg-burgundy text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5">
              {discount}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-xs ${
            isFavorited
              ? 'bg-burgundy text-white'
              : 'bg-white/90 text-charcoal hover:bg-white hover:text-burgundy'
          }`}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex justify-center">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
              quickAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-ivory hover:bg-white text-charcoal hover:text-burgundy'
            }`}
          >
            {quickAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add (Size {product.sizes?.[0] || 'M'})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory / Fabric */}
          <div className="flex items-center justify-between text-[11px] text-charcoal/60 mb-1 tracking-wide">
            <span className="uppercase text-[10px] tracking-widest font-medium text-gold-dark truncate">
              {product.subcategory || product.category}
            </span>
            {product.fabric && (
              <span className="hidden sm:inline text-[10px] text-charcoal/50">
                {product.fabric.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="block font-display font-medium text-sm text-charcoal hover:text-burgundy transition-colors line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Colors Row */}
        <div className="mt-2.5 pt-2 border-t border-beige/30 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-base text-burgundy">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-charcoal/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Available Colors Count or Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-charcoal/60" title={product.colors.join(', ')}>
              <span className="text-[10px] font-medium tracking-wider uppercase text-charcoal/50">
                {product.colors.length} {product.colors.length === 1 ? 'col' : 'cols'}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="sm:hidden mt-3">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2 px-3 text-[11px] uppercase tracking-wider font-semibold border transition-colors flex items-center justify-center gap-1 ${
              quickAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-burgundy text-burgundy hover:bg-burgundy hover:text-white'
            }`}
          >
            {quickAdded ? 'Added' : '+ Quick Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
