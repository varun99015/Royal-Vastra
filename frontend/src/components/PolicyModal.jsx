import { X } from 'lucide-react';

export default function PolicyModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
          <p>
            <strong>Complimentary Standard Shipping:</strong> We are pleased to provide complimentary standard shipping on all domestic orders over ₹999 across India. For orders below ₹999, a nominal standard shipping fee of ₹99 applies.
          </p>
          <p>
            <strong>Express Air Delivery:</strong> Express priority dispatch is available at checkout for ₹199, delivering within 2–4 business days across metropolitan areas.
          </p>
          <p>
            <strong>Dispatch Timelines:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ready-to-ship kurtas & waistcoats: Dispatched within 24–48 hours.</li>
            <li>Handcrafted & Embroidered Sherwanis: Dispatched within 3–5 business days following quality inspection.</li>
          </ul>
          <p>
            <strong>Tracking:</strong> Once dispatched, a live tracking code and SMS/email confirmation will be sent to monitor your royal parcel in real-time.
          </p>
        </div>
      ),
    },
    returns: {
      title: '7-Day Return & Size Exchange Policy',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
          <p>
            <strong>7-Day Easy Exchange:</strong> We want your ethnic silhouette to fit with absolute perfection. If the size or fit is not ideal, you may request an exchange or return within <strong>7 calendar days</strong> of parcel delivery.
          </p>
          <p>
            <strong>Eligibility Criteria:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Item must be unwashed, unworn, and with original brand tags attached.</li>
            <li>Original packaging must be preserved for safe transit.</li>
            <li>Custom tailored or bespoke altered pieces are final sale unless a manufacturing defect exists.</li>
          </ul>
          <p>
            <strong>How to Initiate:</strong> Reach out to our concierge via WhatsApp (+91 98765 43210) or email us at concierge@royalvastra.com with your Order ID. Our logistics partner will pick up the parcel from your doorstep.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy & Data Security',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
          <p>
            At <strong>Royal Vastra</strong>, your privacy and trust are sacred. We collect only essential contact and shipping information necessary to fulfill your orders, provide dispatch notifications, and deliver concierge customer support.
          </p>
          <p>
            <strong>No Payment Credentials Stored:</strong> We never capture, view, or retain payment card numbers, CVVs, or online banking passwords on our local servers.
          </p>
          <p>
            <strong>No Third-Party Data Selling:</strong> We do not sell, rent, or lease your personal information to advertising brokers or marketing syndicates.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
          <p>
            By browsing or placing an order on Royal Vastra, you acknowledge and agree to our standard shopping terms. All textile designs, brand monograms, and product editorial photographs are proprietary to Royal Vastra.
          </p>
          <p>
            <strong>Colour Accuracy:</strong> Due to artisanal dyes, digital photography lighting, and varied mobile display calibrations, slight nuances in fabric sheen and tint may occur naturally.
          </p>
        </div>
      ),
    },
  };

  const active = contentMap[type] || contentMap.shipping;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white max-w-lg w-full max-h-[85vh] flex flex-col border border-beige/60 shadow-2xl">
        <div className="px-6 py-4 border-b border-beige/40 flex items-center justify-between bg-ivory">
          <h3 className="font-display font-bold text-lg text-charcoal">{active.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-charcoal/60 hover:text-charcoal hover:bg-beige/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{active.content}</div>

        <div className="px-6 py-3 border-t border-beige/40 bg-ivory/50 flex justify-end">
          <button type="button" onClick={onClose} className="btn-secondary py-2 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
