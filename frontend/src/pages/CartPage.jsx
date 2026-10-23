import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/helpers.js';
import { openWhatsAppChat, buildCartShareMessage } from '../utils/whatsapp.js';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totals, couponCode, setCouponCode } = useCart();
  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim());
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setInputCoupon('');
  };

  const handleShareOnWhatsApp = () => {
    const msg = buildCartShareMessage(cart, totals, 'Royal Vastra');
    openWhatsAppChat(msg);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 bg-beige/20 text-gold-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h1 className="font-display text-3xl font-bold text-charcoal">Your Bag is Empty</h1>
        <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
          Explore our handcrafted kurtas, festive waistcoats, and wedding sherwanis.
        </p>
        <div className="pt-4">
          <Link to="/shop" className="btn-primary py-3 px-8 text-xs font-semibold tracking-widest">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-beige/40 pb-6 mb-8 flex flex-col sm:flex-row items-baseline justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
            Checkout Preparation
          </span>
          <h1 className="font-display text-3xl font-bold text-charcoal mt-1">
            Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-charcoal/50 hover:text-burgundy underline uppercase tracking-wider"
        >
          Clear entire bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress */}
          <div className="p-4 bg-beige/20 border border-beige/40 mb-6">
            {totals.isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>You qualify for Complimentary Express Delivery on this order!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-charcoal/80 mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4 text-gold-dark" />
                    <span>Free Shipping Threshold</span>
                  </span>
                  <span className="font-semibold text-burgundy">
                    Add {formatPrice(totals.remainingForFreeShipping)} more for FREE Delivery
                  </span>
                </div>
                <div className="w-full bg-beige/50 h-2">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totals.subtotal / 999) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Table/List */}
          <div className="divide-y divide-beige/30 border border-beige/40 bg-white">
            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'}
                  alt={item.name}
                  className="w-24 sm:w-28 aspect-[3/4] object-cover object-top border border-beige/40 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-gold-dark">
                          {item.category || 'Menswear'}
                        </span>
                        <h3 className="font-display font-medium text-base text-charcoal line-clamp-1">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(index)}
                        className="text-charcoal/40 hover:text-burgundy p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-charcoal/70 mt-2">
                      <span>Size: <strong className="text-charcoal">{item.size}</strong></span>
                      <span>•</span>
                      <span>Colour: <strong className="text-charcoal">{item.color}</strong></span>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-4 border-t border-beige/30 mt-4">
                    <div className="flex items-center border border-beige/60 bg-ivory">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1.5 hover:bg-beige/30 text-charcoal"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1.5 hover:bg-beige/30 text-charcoal"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-burgundy">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-charcoal/50">
                          {formatPrice(item.price)} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <Link to="/shop" className="text-charcoal/70 hover:text-burgundy underline uppercase tracking-wider font-semibold">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Column (Sticky) */}
        <div>
          <div className="p-6 bg-ivory border border-beige/50 sticky top-28 space-y-5">
            <h3 className="font-display font-bold text-lg text-charcoal border-b border-beige/40 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code Field */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="text-emerald-800 font-medium">Coupon <strong>{couponCode}</strong> applied</span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-emerald-700 underline text-xs font-semibold">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-beige/70 uppercase focus:outline-none focus:border-burgundy"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-charcoal text-white text-xs font-semibold uppercase tracking-wider hover:bg-burgundy transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {totals.couponError && (
                <p className="text-[11px] text-red-600 mt-1">{totals.couponError}</p>
              )}
            </div>

            {/* Price Lines */}
            <div className="space-y-2 text-xs text-charcoal/80 pt-2 border-t border-beige/40">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Savings / Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                      Complimentary (Free)
                    </span>
                  ) : (
                    formatPrice(totals.shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-beige/40">
                <span className="font-display">Total Amount</span>
                <span className="font-display text-xl text-burgundy">{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3.5 text-xs font-semibold tracking-widest flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span>Share Cart on WhatsApp</span>
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-charcoal/50 space-y-1">
              <p>🔒 256-bit Secure Ordering & Server Revalidation</p>
              <p>📦 7-Day Doorstep Size Exchange Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
