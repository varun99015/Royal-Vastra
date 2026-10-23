import { useState, useEffect } from 'react';
import { fetchSettings } from '../services/products.js';
import { openWhatsAppChat, buildGeneralInquiryMessage } from '../utils/whatsapp.js';
import { MessageCircle, Sparkles, Truck, Phone } from 'lucide-react';

export default function AnnouncementBar() {
  const [settings, setSettings] = useState({
    announcementText: 'Wedding Season Collection 2026 Live • Complimentary Shipping Over ₹999 • Bespoke WhatsApp Stylist Available',
    whatsappNumber: '919876543210',
    phone: '+91 98765 43210',
  });

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleWhatsApp = () => {
    openWhatsAppChat(buildGeneralInquiryMessage(settings.storeName || 'Royal Vastra'), settings.whatsappNumber);
  };

  return (
    <div className="bg-charcoal text-ivory text-[11px] sm:text-xs tracking-wider border-b border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Styling Help */}
        <div className="hidden sm:flex items-center gap-2 text-beige hover:text-white transition-colors cursor-pointer" onClick={handleWhatsApp}>
          <MessageCircle className="w-3.5 h-3.5 text-gold" />
          <span className="font-medium">Personal Stylist on WhatsApp</span>
        </div>

        {/* Center: Main Announcement */}
        <div className="flex-1 text-center font-medium tracking-wide text-ivory/95 flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-gold hidden sm:inline" />
          <span>{settings.announcementText || 'Wedding Season Collection 2026 Live • Free Shipping over ₹999'}</span>
        </div>

        {/* Right: Phone / Contact */}
        <div className="hidden md:flex items-center gap-3 text-beige/80">
          <a href={`tel:${settings.phone || '+919876543210'}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-gold" />
            <span>{settings.phone || '+91 98765 43210'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
