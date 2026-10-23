import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import {
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchBestSellers,
  fetchSettings,
} from '../services/products.js';
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Shield,
  Truck,
  RotateCcw,
  Ruler,
  ChevronRight,
  Award,
} from 'lucide-react';
import { openWhatsAppChat, buildGeneralInquiryMessage } from '../utils/whatsapp.js';

export default function HomePage() {
  const navigate = useNavigate();

  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    storeName: 'Royal Vastra',
    whatsappNumber: '919876543210',
  });

  useEffect(() => {
    Promise.all([
      fetchBestSellers(),
      fetchNewArrivals(),
      fetchFeaturedProducts(),
      fetchSettings(),
    ])
      .then(([bestRes, newRes, featRes, setRes]) => {
        if (bestRes.success) setBestSellers(bestRes.data || []);
        if (newRes.success) setNewArrivals(newRes.data || []);
        if (featRes.success) setFeaturedProducts(featRes.data || []);
        if (setRes.success && setRes.data) setSettings(setRes.data);
      })
      .catch((err) => console.error('Failed to load homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleWhatsAppChat = () => {
    openWhatsAppChat(
      buildGeneralInquiryMessage(settings.storeName || 'Royal Vastra'),
      settings.whatsappNumber
    );
  };

  const categories = [
    {
      title: 'Kurtas & Kurta Sets',
      desc: 'Breathable slub cottons, hand-block prints, and timeless silk sets.',
      image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80',
      link: '/shop?category=Kurtas%20%26%20Kurta%20Sets',
    },
    {
      title: 'Sherwanis & Wedding Wear',
      desc: 'Bespoke bridal groom ensembles, Banarasi raw silk, and hand zardozi.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80',
      link: '/shop?category=Sherwanis%20%26%20Wedding%20Wear',
    },
    {
      title: 'Traditional Formal Wear',
      desc: 'Structured Jodhpuri suits, royal velvet bandhgalas, and Nehru jackets.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80',
      link: '/shop?category=Traditional%20Formal%20Wear',
    },
    {
      title: 'Indo-Western Outfits',
      desc: 'Contemporary asymmetric cowl drapes, fusion tuxedos, and sheer jackets.',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=80',
      link: '/shop?category=Indo-Western%20Outfits',
    },
    {
      title: 'Festive Essentials',
      desc: 'Dazzling mirror work kurtas, woven Chanderi silk, and brocade waistcoats.',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&q=80',
      link: '/shop?category=Festive%20Essentials',
    },
    {
      title: 'New Arrivals 2026',
      desc: 'Latest runway styles, modern pastel palettes, and heritage revivals.',
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&q=80',
      link: '/shop?sort=newest',
    },
  ];

  const occasions = [
    {
      title: 'Wedding Ceremonies',
      desc: 'Royal groom sherwanis, achkans & wedding guest ensembles',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80',
      link: '/shop?occasion=Wedding%20Ceremonies',
    },
    {
      title: 'Engagement & Reception',
      desc: 'Structured bandhgalas, Jodhpuri coats & evening formals',
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=700&q=80',
      link: '/shop?occasion=Engagement%20%26%20Reception',
    },
    {
      title: 'Festivals & Celebrations',
      desc: 'Vibrant mirror work, Bandhani prints & silk kurta sets',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=700&q=80',
      link: '/shop?occasion=Festivals%20%26%20Family%20Celebrations',
    },
    {
      title: 'Pooja & Traditions',
      desc: 'Pure cotton, handloom khadi & understated elegant kurtas',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=80',
      link: '/shop?occasion=Pooja%20%26%20Traditional%20Occasions',
    },
    {
      title: 'Casual Ethnic Wear',
      desc: 'Breathable short kurtas, linen tunics & relaxed pajamas',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=700&q=80',
      link: '/shop?occasion=Casual',
    },
    {
      title: 'Formal & Evening Events',
      desc: 'Imperial black suits, tweed Nehru jackets & fine velvet',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=80',
      link: '/shop?occasion=Formal%20%26%20Evening%20Events',
    },
  ];

  const priceRanges = [
    { label: 'Under ₹999', subtitle: 'Everyday Cotton & Short Kurtas', filter: 'maxPrice=999', color: 'from-amber-900/80 to-amber-950' },
    { label: '₹999 – ₹1,999', subtitle: 'Printed Sets & Silk Waistcoats', filter: 'minPrice=999&maxPrice=1999', color: 'from-stone-900/80 to-stone-950' },
    { label: '₹2,000 – ₹3,999', subtitle: 'Artisanal Sets & Chikankari', filter: 'minPrice=2000&maxPrice=3999', color: 'from-red-950/80 to-red-950' },
    { label: 'Above ₹4,000', subtitle: 'Handcrafted Sherwanis & Bandhgalas', filter: 'minPrice=4000', color: 'from-burgundy-900/80 to-burgundy-dark' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ── 1. HERO SECTION (Editorial Grandeur) ── */}
      <section className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-charcoal">
        {/* Hero Background Image with Editorial Mood */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800&q=85"
            alt="Royal Vastra Indian Men's Ethnic Wear"
            className="w-full h-full object-cover object-[center_20%] opacity-45 scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center sm:text-left">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/20 border border-gold/40 text-gold-light text-xs font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Wedding Season 2026 Collection</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory tracking-tight leading-[1.12]">
              Tradition, <br />
              <span className="italic font-normal text-gold-light">Tailored</span> for Today.
            </h1>

            <p className="text-sm sm:text-base text-ivory/80 font-normal leading-relaxed max-w-xl">
              Discover timeless Indian menswear for weddings, celebrations, and every moment worth dressing up for. Bespoke sherwanis, structured bandhgalas, and breathable handloom kurtas at honest prices.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto btn-primary py-3.5 px-8 text-xs font-semibold tracking-widest flex items-center justify-center gap-2 group"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/shop?category=Sherwanis%20%26%20Wedding%20Wear"
                className="w-full sm:w-auto btn-secondary text-white border-white/30 hover:bg-white hover:text-charcoal py-3.5 px-8 text-xs font-semibold tracking-widest flex items-center justify-center"
              >
                Explore Wedding Wear
              </Link>
            </div>

            {/* Quick Highlights */}
            <div className="pt-4 flex items-center justify-center sm:justify-start gap-6 text-[11px] text-ivory/60 tracking-wider">
              <span>✦ Sizes S to 46 (XXL)</span>
              <span>✦ Starting from ₹649</span>
              <span>✦ Complimentary Express Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SHOP BY CATEGORY (6 Main Tiles) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
            Curated Menswear
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Shop by Category
          </h2>
          <div className="gold-divider mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative overflow-hidden aspect-[4/5] bg-charcoal flex flex-col justify-end p-6 border border-beige/40 hover:border-gold transition-all duration-300 shadow-sm hover:shadow-royal"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

              {/* Text */}
              <div className="relative z-10 space-y-1.5">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gold-light transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-ivory/80 line-clamp-2">{cat.desc}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider">
                  <span>Explore Collection</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. BEST SELLERS PRODUCT GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Most Loved Pieces
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=featured"
            className="btn-ghost flex items-center gap-1 text-xs"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. SHOP BY OCCASION ── */}
      <section className="bg-ivory py-16 border-t border-b border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Celebration Dressing
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mt-1">
              Shop by Occasion
            </h2>
            <div className="gold-divider mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occ) => (
              <Link
                key={occ.title}
                to={occ.link}
                className="group relative h-64 overflow-hidden bg-charcoal border border-beige/50 hover:border-gold flex flex-col justify-end p-6 transition-all duration-300"
              >
                <img
                  src={occ.image}
                  alt={occ.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

                <div className="relative z-10">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-gold-light transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-ivory/70 mt-1 line-clamp-1">{occ.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. AFFORDABLE STYLE SECTION (Price Bracket Cards) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
            Honest Value
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Shop by Price
          </h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Fine Indian ethnic menswear tailored for every budget and occasion.
          </p>
          <div className="gold-divider mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {priceRanges.map((range) => (
            <Link
              key={range.label}
              to={`/shop?${range.filter}`}
              className="p-6 bg-white border border-beige/60 hover:border-burgundy hover:shadow-card transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold-dark">
                  Budget Filter
                </span>
                <h3 className="font-display text-2xl font-bold text-burgundy mt-1 group-hover:translate-x-0.5 transition-transform">
                  {range.label}
                </h3>
                <p className="text-xs text-charcoal/70 mt-2">{range.subtitle}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-beige/40 flex items-center justify-between text-xs font-semibold text-charcoal group-hover:text-burgundy uppercase tracking-wider">
                <span>Browse Styles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. EDITORIAL BANNER (Made for Moments That Matter) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-charcoal text-white grid grid-cols-1 lg:grid-cols-2 border border-gold/40 shadow-royal">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold">
              Editorial Feature
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ivory">
              Made for Moments <br />
              <span className="italic font-normal text-gold-light">That Matter</span>
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed max-w-md">
              From crisp linen-cotton kurtas for daytime rituals to heavy velvet bandhgalas and regal Banarasi sherwanis for the big day — Royal Vastra crafts ensembles that celebrate your cultural pride with modern poise.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="btn-gold py-3 px-8 text-xs font-semibold tracking-widest">
                Explore the Collection
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&q=80"
              alt="Editorial Indian Men's Festive Fashion"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── 7. NEW ARRIVALS CAROUSEL/GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
              Fresh Off the Loom
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mt-1">
              New Arrivals 2026
            </h2>
          </div>
          <Link to="/shop?sort=newest" className="btn-ghost flex items-center gap-1 text-xs">
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 8. WHATSAPP SHOPPING BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white p-8 sm:p-12 border border-[#25D366]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-none">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Personal Styling Assistance</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Not sure about sizing, fabric or color?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Our expert atelier team is available on WhatsApp to guide your measurements, share fabric video previews, and recommend the ideal ethnic outfit for your wedding or festival.
            </p>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppChat}
            className="flex-shrink-0 bg-white text-[#075E54] hover:bg-ivory py-3.5 px-8 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
            <span>Chat With Us on WhatsApp</span>
          </button>
        </div>
      </section>
    </div>
  );
}
