const express = require('express');
const router = express.Router();
const repo = require('../services/file.service');
const adminService = require('../services/admin.service');
const productService = require('../services/product.service');
const orderService = require('../services/order.service');
const { requireAdmin, asyncHandler, authRateLimit } = require('../middleware/auth');
const logger = require('../utils/logger');

// ---- Admin Auth Routes ----
const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  const result = await adminService.authenticateAdmin(email, password);
  if (!result.success) return res.status(401).json({ success: false, error: result.error });
  res.json({ success: true, data: { token: result.token, admin: result.admin } });
});

router.post('/login', authRateLimit(15 * 60 * 1000, 10), loginHandler);
router.post('/admin/login', authRateLimit(15 * 60 * 1000, 10), loginHandler);

// ---- Public settings ----
router.get('/settings/public', asyncHandler(async (req, res) => {
  const data = await repo.getPublicSettings();
  res.json({ success: true, data });
}));

// ---- Categories helper route ----
router.get('/categories', asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  const categories = {};
  for (const p of products) {
    if (!p.category) continue;
    if (!categories[p.category]) categories[p.category] = [];
    if (p.subcategory && !categories[p.category].includes(p.subcategory)) {
      categories[p.category].push(p.subcategory);
    }
  }
  const result = Object.keys(categories).map((cat) => ({
    category: cat,
    subcategories: [...new Set(categories[cat])],
  }));
  res.json({ success: true, data: result });
}));

// ---- Protected Admin Product Management ----
router.get('/admin/products', requireAdmin, asyncHandler(async (req, res) => {
  const data = await productService.getAllProducts();
  res.json({ success: true, data });
}));

router.post('/admin/products', requireAdmin, asyncHandler(async (req, res) => {
  const product = await productService.addProduct(req.body);
  res.status(201).json({ success: true, data: product });
}));

router.put('/admin/products/:id', requireAdmin, asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.id;
  const success = await productService.updateProduct(req.params.id, updates);
  if (!success) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, message: 'Product updated successfully' });
}));

router.delete('/admin/products/:id', requireAdmin, asyncHandler(async (req, res) => {
  const success = await productService.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted successfully' });
}));

// ---- Protected Admin Order Management ----
router.get('/admin/orders', requireAdmin, asyncHandler(async (req, res) => {
  const data = await orderService.getAllOrders();
  res.json({ success: true, data });
}));

router.patch('/admin/orders/:orderId/status', requireAdmin, asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['pending_confirmation', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }
  const result = await orderService.updateOrderStatus(req.params.orderId, status, note || '');
  if (!result.success) return res.status(404).json({ success: false, error: result.error });
  res.json({ success: true, data: result.order });
}));

// Also support without /admin prefix
router.patch('/orders/:orderId/status', requireAdmin, asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const result = await orderService.updateOrderStatus(req.params.orderId, status, note || '');
  if (!result.success) return res.status(404).json({ success: false, error: result.error });
  res.json({ success: true, data: result.order });
}));

// ---- Protected Admin Settings Management ----
router.get('/admin/settings', requireAdmin, asyncHandler(async (req, res) => {
  const settings = await repo.readJSON('settings.json') || {};
  res.json({ success: true, data: settings });
}));

router.put('/admin/settings', requireAdmin, asyncHandler(async (req, res) => {
  const currentSettings = (await repo.readJSON('settings.json')) || {};
  const updatedSettings = {
    ...currentSettings,
    ...req.body,
  };
  await repo.writeJSON('settings.json', updatedSettings);
  res.json({ success: true, data: updatedSettings });
}));

module.exports = router;
