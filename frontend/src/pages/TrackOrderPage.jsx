import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchOrder } from '../services/products.js';
import { formatPrice } from '../utils/helpers.js';
import { openWhatsAppChat, buildOrderInquiryMessage } from '../utils/whatsapp.js';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [mobileOrEmail, setMobileOrEmail] = useState(searchParams.get('mobile') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-search if query params exist
  useEffect(() => {
    const initialId = searchParams.get('orderId');
    const initialMobile = searchParams.get('mobile');
    if (initialId && initialMobile) {
      performLookup(initialId, initialMobile);
    }
  }, [searchParams]);

  const performLookup = async (lookupId, contact) => {
    if (!lookupId.trim() || !contact.trim()) {
      setError('Please provide both Order Reference ID and Mobile/Email.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    const isEmail = contact.includes('@');
    const verification = isEmail ? { email: contact.trim() } : { mobile: contact.trim() };

    try {
      const res = await fetchOrder(lookupId.trim(), verification);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('No matching order found. Please check your Order ID and phone number.');
      }
    } catch (err) {
      setError('Order lookup failed. Verify your details or contact concierge.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLookup(orderId, mobileOrEmail);
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'pending_confirmation':
      case 'awaiting_payment':
        return 1;
      case 'confirmed':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStepIndex(order.status) : 1;

  const timelineSteps = [
    { title: 'Order Placed', desc: 'Received at atelier' },
    { title: 'Confirmed & Tailoring', desc: 'Garments verified & inspected' },
    { title: 'Dispatched', desc: 'Handed to express logistics' },
    { title: 'Delivered', desc: 'Delivered to your doorstep' },
  ];

  const handleWhatsAppHelp = () => {
    if (!order) return;
    const msg = buildOrderInquiryMessage(order.id, order.customer.name, 'Royal Vastra');
    openWhatsAppChat(msg);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
          Order Verification & Tracking
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
          Track Your Ensemble
        </h1>
        <p className="text-xs text-charcoal/60">
          Enter your unique Royal Vastra order reference and registered phone number or email to view live fulfillment status.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white border border-beige/60 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Order Reference ID
            </label>
            <input
              type="text"
              placeholder="e.g. RV-XXXX-XXXX"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-ivory/50 border border-beige/70 uppercase focus:outline-none focus:border-burgundy"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Registered Mobile or Email
            </label>
            <input
              type="text"
              placeholder="10-digit mobile or email"
              value={mobileOrEmail}
              onChange={(e) => setMobileOrEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-ivory/50 border border-beige/70 focus:outline-none focus:border-burgundy"
            />
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white border border-beige/60 p-6 sm:p-10 shadow-royal space-y-8 animate-fade-in">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige/40 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold-dark">
                Order Reference
              </span>
              <h2 className="font-display font-bold text-2xl text-burgundy">{order.id}</h2>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Recipient: <strong className="text-charcoal">{order.customer.name}</strong> • Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/50 block">
                Fulfillment Status
              </span>
              <span className="inline-block mt-1 px-3 py-1 bg-burgundy/10 text-burgundy font-bold text-xs uppercase tracking-wider">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-6">
              Dispatch Timeline
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {timelineSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div key={step.title} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-burgundy text-white shadow-sm'
                          : 'bg-neutral-100 text-charcoal/40 border border-beige/60'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </div>

                    <h4
                      className={`font-display text-xs font-semibold ${
                        isCurrent ? 'text-burgundy' : isPassed ? 'text-charcoal' : 'text-charcoal/50'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-charcoal/60">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this Order */}
          <div className="pt-4 border-t border-beige/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Ensemble Details
            </h3>

            <div className="divide-y divide-beige/30 border border-beige/40">
              {order.items.map((item, idx) => (
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

          {/* Delivery Destination & Total Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-ivory border border-beige/40 text-xs text-charcoal/80 space-y-1">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-charcoal mb-2">
                Delivery Address
              </h4>
              <p className="font-medium text-charcoal">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.state} – {order.customer.pincode}</p>
            </div>

            <div className="p-4 bg-ivory border border-beige/40 text-xs text-charcoal/80 space-y-1.5">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-charcoal mb-2">
                Payment & Billing
              </h4>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-semibold uppercase text-[10px]">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal pt-1.5 border-t border-beige/40">
                <span>Total</span>
                <span className="text-burgundy">{formatPrice(order.totals.total)}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Inquire */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleWhatsAppHelp}
              className="flex items-center gap-2 bg-[#25D366] text-white py-3 px-8 text-xs font-semibold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask Concierge About This Order on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
