import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../services/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice, getDiscountPercent } from '../utils/helpers.js';
import { openWhatsAppChat, buildProductInquiryMessage } from '../utils/whatsapp.js';
import SizeGuideModal from '../components/SizeGuideModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('fabric');

  // Load product
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((res) => {
        if (res.success && res.data) {
          const prod = res.data;
          setProduct(prod);
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0] || 'Classic');
          setSelectedImageIndex(0);

          // Track recently viewed
          try {
            const viewed = JSON.parse(localStorage.getItem('rv_recently_viewed') || '[]');
            const filtered = viewed.filter((v) => v.id !== prod.id);
            localStorage.setItem(
              'rv_recently_viewed',
              JSON.stringify([{ id: prod.id, name: prod.name, image: prod.images?.[0], price: prod.price }, ...filtered].slice(0, 6))
            );
          } catch {}

          // Fetch similar products in same category
          if (prod.category) {
            fetchProducts({ category: prod.category, limit: 4 })
              .then((simRes) => {
                if (simRes.success && simRes.data?.data) {
                  setSimilarProducts(simRes.data.data.filter((p) => p.id !== prod.id).slice(0, 4));
                }
              })
              .catch(() => {});
          }
        } else {
          setError('Product not found');
        }
      })
      .catch((err) => setError(err.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display text-charcoal/70 text-sm">Presenting royal ensemble...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-charcoal">Design Not Found</h2>
        <p className="text-xs text-charcoal/60">
          The requested product may have been archived or is temporarily unavailable.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore All Menswear
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.originalPrice, product.price);
  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppInquiry = () => {
    const msg = buildProductInquiryMessage({
      productName: product.name,
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      storeName: 'Royal Vastra',
    });
    openWhatsAppChat(msg);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setDeliveryStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setDeliveryStatus({
      valid: true,
      message: `Delivery available to PIN ${cleanPin}. Estimated dispatch within 24-48 hours.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-charcoal/60 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-burgundy">Home</Link>
        <ChevronRight className="w-3 h-3 text-beige-dark flex-shrink-0" />
        <Link to="/shop" className="hover:text-burgundy">Collections</Link>
        <ChevronRight className="w-3 h-3 text-beige-dark flex-shrink-0" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-burgundy">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-beige-dark flex-shrink-0" />
        <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase (2-Column Desktop Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Gallery Column */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] flex-shrink-0 border-2 overflow-hidden transition-all ${
                    selectedImageIndex === idx ? 'border-burgundy shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Photograph */}
          <div className="flex-1 relative aspect-[3/4] bg-neutral-100 border border-beige/40 overflow-hidden group">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
              {product.badge && (
                <span className="bg-burgundy text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="bg-gold-royal text-charcoal text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  {discount}% Savings
                </span>
              )}
            </div>

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                isFavorited
                  ? 'bg-burgundy text-white'
                  : 'bg-white/90 text-charcoal hover:bg-white hover:text-burgundy'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Subcategory & Code */}
            <div className="flex items-center justify-between text-xs text-charcoal/60">
              <span className="uppercase tracking-widest font-semibold text-gold-dark">
                {product.subcategory || product.category}
              </span>
              <span className="text-[11px] text-charcoal/40">Ref: {product.id}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-snug">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-display text-3xl font-bold text-burgundy">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-charcoal/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Save {formatPrice(product.originalPrice - product.price)} ({discount}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-charcoal/50">Inclusive of all taxes • Free Shipping above ₹999</p>

            {/* Brief Description */}
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-3 border-t border-beige/40">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-charcoal">
                    Colour: <span className="font-normal text-burgundy">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs border transition-all ${
                        selectedColor === color
                          ? 'border-burgundy bg-burgundy/5 text-burgundy font-semibold'
                          : 'border-beige/70 bg-white text-charcoal/80 hover:border-charcoal'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection with Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-3 border-t border-beige/40">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-charcoal">
                    Select Size: <span className="font-normal text-burgundy">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-gold-dark hover:text-burgundy underline font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[46px] h-10 px-3 text-xs uppercase font-semibold border transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-burgundy text-white border-burgundy shadow-xs'
                          : 'bg-white border-beige/70 text-charcoal hover:border-charcoal'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs pt-1">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-emerald-800 font-medium">
                    In Stock ({product.stock} units available)
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Currently Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-charcoal">Quantity:</span>
              <div className="flex items-center border border-beige/60 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-beige/20 text-charcoal"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-semibold text-charcoal">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-1 hover:bg-beige/20 text-charcoal"
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="btn-gold py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Ask on WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/20 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span>Ask About Sizing & Availability on WhatsApp</span>
              </button>
            </div>

            {/* Pincode Serviceability Check */}
            <div className="pt-4 border-t border-beige/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal mb-2">
                <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                <span>Check Delivery & Serviceability</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-beige/70 focus:outline-none focus:border-burgundy"
                />
                <button type="submit" className="px-4 py-2 bg-charcoal text-white text-xs font-semibold uppercase">
                  Check
                </button>
              </form>
              {deliveryStatus && (
                <p
                  className={`text-[11px] mt-2 font-medium ${
                    deliveryStatus.valid ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {deliveryStatus.message}
                </p>
              )}
            </div>

            {/* Fabric, Care & Specifications Tabs */}
            <div className="pt-4 border-t border-beige/40">
              <div className="flex border-b border-beige/40 gap-4 text-xs font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'fabric'
                      ? 'border-b-2 border-burgundy text-burgundy font-bold'
                      : 'text-charcoal/60'
                  }`}
                >
                  Fabric & Weave
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'care'
                      ? 'border-b-2 border-burgundy text-burgundy font-bold'
                      : 'text-charcoal/60'
                  }`}
                >
                  Care Guide
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'shipping'
                      ? 'border-b-2 border-burgundy text-burgundy font-bold'
                      : 'text-charcoal/60'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className="py-3 text-xs text-charcoal/70 leading-relaxed">
                {activeTab === 'fabric' && (
                  <ul className="space-y-1">
                    <li>• <strong>Material:</strong> {product.fabric || 'Premium Handloom Cotton / Silk Blend'}</li>
                    <li>• <strong>Occasion:</strong> {Array.isArray(product.occasion) ? product.occasion.join(', ') : 'Festive & Celebration'}</li>
                    <li>• <strong>Fit:</strong> Standard Indian Tailored Comfort Fit</li>
                    <li>• <strong>Collar:</strong> Traditional Mandarin Bandhgala Collar</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul className="space-y-1">
                    <li>• Dry clean recommended for silk, velvet, and embroidered garments.</li>
                    <li>• Pure cotton kurtas may be gently hand-washed in cold water with mild detergent.</li>
                    <li>• Steam iron inside-out at low-to-medium heat.</li>
                    <li>• Store in a breathable cotton garment cover away from direct sunlight.</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <ul className="space-y-1">
                    <li>• Complimentary shipping on orders above ₹999.</li>
                    <li>• Dispatched within 24–48 hours from Bengaluru atelier.</li>
                    <li>• 7-Day easy size exchange with doorstep courier pickup.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Outfits Grid */}
      {similarProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-beige/40">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Coordinated Styling
            </span>
            <h3 className="font-display text-2xl font-bold text-charcoal mt-1">
              You May Also Admire
            </h3>
            <div className="gold-divider mt-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-beige/40 p-3 shadow-elevated z-40 flex items-center justify-between gap-3">
        <div>
          <span className="font-display font-bold text-base text-burgundy">
            {formatPrice(product.price)}
          </span>
          <span className="block text-[10px] text-charcoal/50 truncate max-w-[120px]">
            Size: {selectedSize}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary py-2.5 px-4 text-xs font-semibold uppercase tracking-wider"
          >
            Add to Bag
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="btn-gold py-2.5 px-4 text-xs font-semibold uppercase tracking-wider"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
