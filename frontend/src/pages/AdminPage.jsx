import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetSettings,
  adminUpdateSettings,
} from '../services/products.js';
import { formatPrice } from '../utils/helpers.js';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit,
  LogOut,
  CheckCircle,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, adminInfo, login, logout } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@royalvastra.com');
  const [loginPassword, setLoginPassword] = useState('RoyalVastra@2026');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'settings'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Product Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Kurtas & Kurta Sets',
    subcategory: 'Cotton Daily-Wear Kurtas',
    description: '',
    price: 999,
    originalPrice: 1499,
    stock: 20,
    fabric: 'Cotton',
    badge: '',
    imageUrl: '',
    sizes: 'S, M, L, XL',
    colors: 'Ivory, Navy',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({});

  // Filter orders state
  const [orderFilter, setOrderFilter] = useState('all');

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setActionMessage(null);
    try {
      if (activeTab === 'products') {
        const res = await adminGetProducts();
        if (res.success) setProducts(res.data || []);
      } else if (activeTab === 'orders') {
        const res = await adminGetOrders();
        if (res.success) setOrders(res.data || []);
      } else if (activeTab === 'settings') {
        const res = await adminGetSettings();
        if (res.success) {
          setSettings(res.data || {});
          setSettingsForm(res.data || {});
        }
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Kurtas & Kurta Sets',
      subcategory: 'Cotton Daily-Wear Kurtas',
      description: '',
      price: 999,
      originalPrice: 1499,
      stock: 20,
      fabric: 'Cotton',
      badge: 'New',
      imageUrl: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80',
      sizes: 'S, M, L, XL, XXL',
      colors: 'Ivory, Navy Blue',
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Kurtas & Kurta Sets',
      subcategory: prod.subcategory || '',
      description: prod.description || '',
      price: prod.price || 999,
      originalPrice: prod.originalPrice || '',
      stock: prod.stock || 0,
      fabric: prod.fabric || '',
      badge: prod.badge || '',
      imageUrl: prod.images?.[0] || '',
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : '',
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : '',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      subcategory: productForm.subcategory.trim(),
      description: productForm.description.trim(),
      price: parseFloat(productForm.price) || 0,
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
      stock: parseInt(productForm.stock, 10) || 0,
      fabric: productForm.fabric.trim(),
      badge: productForm.badge.trim() || undefined,
      images: [productForm.imageUrl.trim()],
      sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: productForm.colors.split(',').map((c) => c.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, payload);
        setActionMessage({ type: 'success', text: `Product "${payload.name}" updated successfully.` });
      } else {
        await adminCreateProduct(payload);
        setActionMessage({ type: 'success', text: `New garment "${payload.name}" added to catalog.` });
      }
      setProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) return;
    try {
      await adminDeleteProduct(id);
      setActionMessage({ type: 'success', text: `Product removed successfully.` });
      loadDashboardData();
    } catch (err) {
      alert(`Error deleting: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus, `Status updated by admin`);
      setActionMessage({ type: 'success', text: `Order #${orderId} marked as ${newStatus}.` });
      loadDashboardData();
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateSettings(settingsForm);
      setActionMessage({ type: 'success', text: 'Store settings updated successfully.' });
      loadDashboardData();
    } catch (err) {
      alert(`Error updating settings: ${err.message}`);
    }
  };

  // ── IF NOT AUTHENTICATED: SHOW LOGIN FORM ──
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-beige/60 p-8 shadow-royal space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-charcoal text-gold mx-auto flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-charcoal">
              Royal Vastra Atelier Portal
            </h2>
            <p className="text-xs text-charcoal/60">
              Authorized administrator access for catalog & orders management.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70 focus:outline-none focus:border-burgundy"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full btn-primary py-3 text-xs tracking-widest font-semibold uppercase"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="p-3 bg-beige/20 text-[11px] text-charcoal/70 border border-beige/50">
            <p className="font-semibold text-charcoal mb-0.5">Developer Demo Credentials:</p>
            <p>Email: <code className="text-burgundy">admin@royalvastra.com</code></p>
            <p>Password: <code className="text-burgundy">RoyalVastra@2026</code></p>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED DASHBOARD ──
  const filteredOrders =
    orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Bar */}
      <div className="bg-charcoal text-white p-6 border border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
            Store Management
          </span>
          <h1 className="font-display font-bold text-2xl text-ivory">
            Royal Vastra Atelier Console
          </h1>
          <p className="text-xs text-ivory/60 mt-0.5">
            Logged in as <strong>{adminInfo?.email || 'Administrator'}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{actionMessage.text}</span>
          <X className="w-4 h-4 cursor-pointer" onClick={() => setActionMessage(null)} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-beige/40 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-burgundy text-burgundy'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-b-2 border-burgundy text-burgundy'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-b-2 border-burgundy text-burgundy'
              : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* ── TAB 1: PRODUCTS MANAGEMENT ── */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-charcoal/70">
              Total Catalog: {products.length} Items
            </span>
            <button
              type="button"
              onClick={openAddProductModal}
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-beige/40 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-beige/40 text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  <th className="p-3">Garment</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/30">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-ivory/50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={prod.images?.[0] || ''}
                        alt=""
                        className="w-10 h-12 object-cover object-top border border-beige/30 flex-shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-charcoal block line-clamp-1">{prod.name}</span>
                        <span className="text-[10px] text-charcoal/50">Ref: {prod.id}</span>
                      </div>
                    </td>
                    <td className="p-3 text-charcoal/80">{prod.category}</td>
                    <td className="p-3 font-bold text-burgundy">{formatPrice(prod.price)}</td>
                    <td className="p-3">
                      <span className={`font-semibold ${prod.stock < 5 ? 'text-red-600' : 'text-charcoal'}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 ${
                          prod.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditProductModal(prod)}
                        className="p-1 text-charcoal/60 hover:text-burgundy"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1 text-charcoal/60 hover:text-red-600"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDERS MANAGEMENT ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/70 mr-2">
              Filter by Status:
            </span>
            {['all', 'pending_confirmation', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                  orderFilter === st
                    ? 'bg-burgundy text-white border-burgundy'
                    : 'bg-white border-beige/60 text-charcoal/80 hover:border-charcoal'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-beige/40 p-6 text-xs text-charcoal/60">
                No orders currently in this status.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="p-5 bg-white border border-beige/50 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige/30 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-burgundy">{ord.id}</span>
                      <span className="text-xs text-charcoal/60 ml-3">
                        Placed by <strong>{ord.customer?.name}</strong> (+91 {ord.customer?.mobile})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-charcoal">
                        Total: {formatPrice(ord.totals?.total || 0)}
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-2 py-1 text-xs uppercase font-semibold bg-ivory border border-beige/70 focus:outline-none"
                      >
                        <option value="pending_confirmation">Pending Confirmation</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order items miniature */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal/80">
                    <div>
                      <p className="font-semibold text-charcoal mb-1">Items:</p>
                      <ul className="space-y-1">
                        {ord.items?.map((it, idx) => (
                          <li key={idx}>
                            • {it.name} (Size: {it.size}, Qty: {it.quantity}) – {formatPrice(it.price * it.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal mb-1">Destination:</p>
                      <p>{ord.customer?.address}, {ord.customer?.city}, {ord.customer?.state} - {ord.customer?.pincode}</p>
                      <p className="text-[11px] text-charcoal/50 mt-1">Payment: {ord.paymentMethod?.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: SETTINGS CONFIGURATION ── */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-beige/50 p-6 sm:p-8 space-y-6 max-w-2xl">
          <h3 className="font-display font-bold text-lg text-charcoal border-b border-beige/40 pb-3">
            Store & WhatsApp Business Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.storeName || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Store WhatsApp Number (Intl format)</label>
              <input
                type="text"
                placeholder="919876543210"
                value={settingsForm.whatsappNumber || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Concierge Email</label>
              <input
                type="email"
                value={settingsForm.email || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
              <input
                type="text"
                value={settingsForm.phone || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Store Physical Address</label>
            <input
              type="text"
              value={settingsForm.address || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Free Shipping Above (₹)</label>
              <input
                type="number"
                value={settingsForm.shippingFreeAbove || 999}
                onChange={(e) => setSettingsForm({ ...settingsForm, shippingFreeAbove: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settingsForm.shippingStandardFee || 99}
                onChange={(e) => setSettingsForm({ ...settingsForm, shippingStandardFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Return Window (Days)</label>
              <input
                type="number"
                value={settingsForm.returnPolicyDays || 7}
                onChange={(e) => setSettingsForm({ ...settingsForm, returnPolicyDays: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary py-3 px-8 text-xs font-semibold tracking-wider">
            Save Store Settings
          </button>
        </form>
      )}

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full border border-beige/60 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-beige/40 pb-3">
              <h3 className="font-display font-bold text-lg text-charcoal">
                {editingProduct ? 'Edit Garment Details' : 'Add New Ethnic Garment'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="p-1 text-charcoal/60 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  >
                    <option value="Kurtas & Kurta Sets">Kurtas & Kurta Sets</option>
                    <option value="Sherwanis & Wedding Wear">Sherwanis & Wedding Wear</option>
                    <option value="Traditional Formal Wear">Traditional Formal Wear</option>
                    <option value="Indo-Western Outfits">Indo-Western Outfits</option>
                    <option value="Festive Essentials">Festive Essentials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Colours (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Fabric</label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="Bestseller, New, Festive Pick"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-ivory/50 border border-beige/70"
                />
              </div>

              <div className="pt-3 border-t border-beige/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="btn-secondary py-2.5 px-5 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
