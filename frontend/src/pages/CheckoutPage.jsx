import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/products.js';
import { formatPrice } from '../utils/helpers.js';
import { openWhatsAppChat, buildOrderInquiryMessage } from '../utils/whatsapp.js';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  CreditCard,
  Banknote,
  Copy,
  Check,
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totals, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' or 'online'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi NCR', 'Jammu & Kashmir', 'Ladakh'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ''))) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state) errs.state = 'State is required';

    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit postal PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    setSubmitting(true);
    setServerError(null);

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      customer: {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.trim(),
      },
      notes: formData.notes.trim(),
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await createOrder(orderPayload);
      if (res.success && res.data) {
        setConfirmedOrder(res.data);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setServerError(res.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'Network error occurred while creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!confirmedOrder) return;
    const msg = buildOrderInquiryMessage(confirmedOrder.id, confirmedOrder.customer.name, 'Royal Vastra');
    openWhatsAppChat(msg);
  };

  // ── ORDER CONFIRMATION SCREEN ──
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-beige/60 p-6 sm:p-10 shadow-royal space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-3 border-b border-beige/40 pb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Order Placed Successfully
            </span>
            <h1 className="font-display text-3xl font-bold text-charcoal">
              Thank You, {confirmedOrder.customer.name}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto">
              Your royal ensemble order has been received. Our concierge team is verifying stock and packaging your garments with heirloom care.
            </p>

            {/* Order Reference Box */}
            <div className="inline-flex items-center gap-2 p-3 bg-ivory border border-beige/60 mt-2">
              <span className="text-xs text-charcoal/70">Order Reference:</span>
              <span className="font-mono font-bold text-sm text-burgundy">{confirmedOrder.id}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="p-1 hover:text-burgundy text-charcoal/60"
                title="Copy Order ID"
              >
                {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status & Mode Explanation */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <span>Status:</span>
              <span className="uppercase text-[11px] px-2 py-0.5 bg-amber-200/80 rounded-none">
                {confirmedOrder.status === 'pending_confirmation' ? 'Awaiting Confirmation' : confirmedOrder.status}
              </span>
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {confirmedOrder.paymentMethod === 'cod'
                ? 'Payment Method: Cash / Pay on Delivery. You will pay once your parcel arrives at your doorstep.'
                : 'Payment Method: Online Payment. A secure checkout payment link has been generated for manual settlement.'}
            </p>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-base text-charcoal">Garments in this Order</h3>
            <div className="divide-y divide-beige/30 border border-beige/40">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 sm:p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'}
                      alt={item.name}
                      className="w-12 h-16 object-cover object-top border border-beige/40 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-display font-medium text-sm text-charcoal">{item.name}</h4>
                      <p className="text-[11px] text-charcoal/60">
                        Size: {item.size} • Colour: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-sm text-burgundy">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Pricing Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1 text-xs text-charcoal/80 bg-ivory p-4 border border-beige/40">
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-2">
                Shipping Destination
              </h4>
              <p className="font-medium text-charcoal">{confirmedOrder.customer.name}</p>
              <p>{confirmedOrder.customer.address}</p>
              <p>{confirmedOrder.customer.city}, {confirmedOrder.customer.state} – {confirmedOrder.customer.pincode}</p>
              <p className="pt-1 text-[11px]">Contact: +91 {confirmedOrder.customer.mobile}</p>
            </div>

            <div className="space-y-2 text-xs text-charcoal/80 bg-ivory p-4 border border-beige/40">
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-charcoal mb-2">
                Payment Summary
              </h4>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(confirmedOrder.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {confirmedOrder.totals.shipping === 0 ? 'Complimentary' : formatPrice(confirmedOrder.totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal pt-2 border-t border-beige/40">
                <span>Total Payable</span>
                <span className="text-burgundy">{formatPrice(confirmedOrder.totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSendWhatsAppConfirmation}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-6 text-xs font-semibold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Get Order Updates on WhatsApp</span>
            </button>

            <Link
              to={`/track-order?orderId=${confirmedOrder.id}&mobile=${confirmedOrder.customer.mobile}`}
              className="flex-1 btn-secondary text-center py-3 text-xs"
            >
              Track Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no confirmed order
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-charcoal">Your Bag is Empty</h2>
        <p className="text-xs text-charcoal/60">
          Add garments to your shopping bag before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore Menswear
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-beige/40 pb-6 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
          Finalize Your Ensemble
        </span>
        <h1 className="font-display text-3xl font-bold text-charcoal mt-1">
          Secure Checkout
        </h1>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Shipping & Payment Form (Span 2) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Step 1: Customer Contact Details */}
          <div className="bg-white border border-beige/50 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-charcoal border-b border-beige/40 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Customer & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                    errors.name ? 'border-red-500' : 'border-beige/70'
                  } focus:outline-none focus:border-burgundy`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                    errors.mobile ? 'border-red-500' : 'border-beige/70'
                  } focus:outline-none focus:border-burgundy`}
                />
                {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address <span className="text-charcoal/40 text-[10px]">(Optional for tracking)</span>
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                  errors.email ? 'border-red-500' : 'border-beige/70'
                } focus:outline-none focus:border-burgundy`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="bg-white border border-beige/50 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-charcoal border-b border-beige/40 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Delivery Address</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Street Address, Flat / Villa No., Landmark <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="House / Apartment number, building name, street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                  errors.address ? 'border-red-500' : 'border-beige/70'
                } focus:outline-none focus:border-burgundy`}
              />
              {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                    errors.city ? 'border-red-500' : 'border-beige/70'
                  } focus:outline-none focus:border-burgundy`}
                />
                {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                    errors.state ? 'border-red-500' : 'border-beige/70'
                  } focus:outline-none focus:border-burgundy`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Postal PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className={`w-full px-3 py-2.5 text-xs bg-ivory/50 border ${
                    errors.pincode ? 'border-red-500' : 'border-beige/70'
                  } focus:outline-none focus:border-burgundy`}
                />
                {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Special Tailoring / Delivery Notes <span className="text-charcoal/40 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Leave with security, wedding date is 15th Nov"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70 focus:outline-none focus:border-burgundy"
              />
            </div>
          </div>

          {/* Step 3: Payment Method Mode */}
          <div className="bg-white border border-beige/50 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-display font-semibold text-lg text-charcoal border-b border-beige/40 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">
                3
              </span>
              <span>Preferred Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Mode A: Cash on Delivery / Pay on Delivery */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-burgundy bg-burgundy/5'
                    : 'border-beige/70 hover:border-charcoal'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="mt-1 accent-burgundy"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-xs text-charcoal">
                      <Banknote className="w-4 h-4 text-gold-dark" />
                      <span>Cash on Delivery / Pay on Delivery (Recommended)</span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 mt-1">
                      Pay cash, UPI, or card directly to the courier upon delivery of your garments. Order is held as <em>pending confirmation</em> until our atelier confirms stock & dispatch.
                    </p>
                  </div>
                </div>
              </label>

              {/* Mode B: Online Payment Integration Note */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  formData.paymentMethod === 'online'
                    ? 'border-burgundy bg-burgundy/5'
                    : 'border-beige/70 hover:border-charcoal'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                    className="mt-1 accent-burgundy"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-xs text-charcoal">
                      <CreditCard className="w-4 h-4 text-gold-dark" />
                      <span>Online Payment (UPI / NetBanking / Cards)</span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 mt-1">
                      Awaits payment settlement. Note: Razorpay integration interface is ready on backend; orders placed in this mode are placed in awaiting payment state and can be confirmed via WhatsApp payment link.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-xs font-semibold tracking-widest flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting Order to Atelier...</span>
                </>
              ) : (
                <>
                  <span>Place Order • {formatPrice(totals.total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-charcoal/50 mt-2">
              Prices and stock will be securely revalidated on our server before finalizing your order.
            </p>
          </div>
        </form>

        {/* Right: Order Summary Sidebar */}
        <div>
          <div className="bg-ivory border border-beige/60 p-6 sticky top-28 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base text-charcoal border-b border-beige/40 pb-3">
              Order Review ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            {/* Items miniature list */}
            <div className="divide-y divide-beige/30 max-h-72 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center gap-3 text-xs">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'}
                    alt={item.name}
                    className="w-10 h-14 object-cover object-top border border-beige/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-medium text-xs text-charcoal truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-charcoal/60">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-display font-bold text-xs text-burgundy">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-charcoal/80 pt-3 border-t border-beige/40">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                      Complimentary
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

            {/* Assurance */}
            <div className="pt-3 border-t border-beige/40 text-[11px] text-charcoal/70 space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>Dispatches from Bengaluru within 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>7-Day Doorstep Size Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
