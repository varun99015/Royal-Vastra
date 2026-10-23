import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/helpers.js';
import { openWhatsAppChat, buildCartShareMessage } from '../utils/whatsapp.js';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Tag,
  CheckCircle,
} from 'lucide-react';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isOpen,
    setIsOpen,
    totals,
    couponCode,
    setCouponCode,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponCode(inputCoupon.trim());
    setCouponMessage({ type: 'success', text: `Coupon applied: ${inputCoupon.toUpperCase()}` });
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setInputCoupon('');
    setCouponMessage(null);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleShareOnWhatsApp = () => {
    const msg = buildCartShareMessage(cart, totals, 'Royal Vastra');
    openWhatsAppChat(msg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-5 py-4 border-b border-beige/40 flex items-center justify-between bg-ivory">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-burgundy" />
              <h2 className="font-display font-bold text-lg text-charcoal">Your Shopping Bag</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-burgundy/10 text-burgundy">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-beige/30 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="px-5 py-2.5 bg-beige/20 border-b border-beige/40">
            {totals.isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>You qualify for Complimentary Express Delivery!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-charcoal/80 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Free Shipping Threshold</span>
                  </span>
                  <span className="font-semibold text-burgundy">
                    Add {formatPrice(totals.remainingForFreeShipping)} more
                  </span>
                </div>
                <div className="w-full bg-beige/50 h-1.5 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (totals.subtotal / 999) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-beige/30">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-beige/20 flex items-center justify-center text-gold-dark mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-display font-semibold text-lg text-charcoal mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-charcoal/60 max-w-xs mb-6">
                  Explore our handcrafted kurtas, bespoke wedding sherwanis, and festive menswear.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/shop');
                  }}
                  className="btn-primary"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="py-4 flex gap-3.5 group">
                  {/* Thumbnail */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-top border border-beige/40 flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-medium text-xs sm:text-sm text-charcoal line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="text-charcoal/40 hover:text-burgundy p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-charcoal/60 mt-0.5">
                        Size: <span className="font-semibold text-charcoal">{item.size}</span> | Colour:{' '}
                        <span className="font-semibold text-charcoal">{item.color}</span>
                      </p>
                    </div>

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-beige/60 bg-ivory">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 hover:bg-beige/40 text-charcoal/70 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-charcoal select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 hover:bg-beige/40 text-charcoal/70 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-sm text-burgundy">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-charcoal/40">
                            {formatPrice(item.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Breakdown & CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-beige/50 bg-ivory space-y-3.5">
              {/* Coupon Bar */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{couponCode}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. ROYAL10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-beige/70 uppercase focus:outline-none focus:border-burgundy"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-charcoal text-white text-xs font-semibold uppercase tracking-wider hover:bg-burgundy transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {totals.couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{totals.couponError}</p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-charcoal/80 pt-1 border-t border-beige/40">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                        FREE
                      </span>
                    ) : (
                      formatPrice(totals.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-beige/40">
                  <span className="font-display">Estimated Total</span>
                  <span className="font-display text-base text-burgundy">{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleShareOnWhatsApp}
                  className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 py-2.5 px-4 text-xs font-semibold tracking-wider transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                  <span>Share Cart & Inquire on WhatsApp</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-charcoal/60 hover:text-burgundy underline tracking-wider uppercase"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
