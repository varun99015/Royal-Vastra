import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CartPage from './pages/CartPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';

function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">
        404 — Page Not Found
      </span>
      <h1 className="font-display text-4xl font-bold text-charcoal">
        Lost in the Royal Courtyard
      </h1>
      <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
        The corridor or design you seek has been moved or does not exist in our royal archives.
      </p>
      <div className="pt-2">
        <Link to="/" className="btn-primary py-3 px-8 text-xs font-semibold tracking-widest">
          Return to Royal Vastra Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <AnnouncementBar />
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
