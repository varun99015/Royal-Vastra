const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { asyncHandler } = require('../middleware/auth');

// GET /api/products - filter, sort, paginate
router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    category: req.query.category || undefined,
    subcategory: req.query.subcategory || undefined,
    brand: req.query.brand || undefined,
    occasion: req.query.occasion ? (req.query.occasion === 'all' ? undefined : req.query.occasion.split(',')) : undefined,
    fabric: req.query.fabric ? (req.query.fabric === 'all' ? undefined : req.query.fabric.split(',')) : undefined,
    color: req.query.color ? (req.query.color === 'all' ? undefined : req.query.color.split(',')) : undefined,
    size: req.query.size ? (req.query.size === 'all' ? undefined : req.query.size.split(',')) : undefined,
    minPrice: req.query.minPrice !== undefined && req.query.minPrice !== '' ? req.query.minPrice : undefined,
    maxPrice: req.query.maxPrice !== undefined && req.query.maxPrice !== '' ? req.query.maxPrice : undefined,
    search: req.query.search || undefined,
    sort: req.query.sort || undefined,
    active: req.query.active !== undefined ? req.query.active === 'true' : undefined,
  };

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;

  const result = await productService.filterProducts(filters, page, limit);
  res.json({ success: true, data: result });
}));

// GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const data = await productService.getFeaturedProducts();
  res.json({ success: true, data });
}));

// GET /api/products/new-arrivals
router.get('/new-arrivals', asyncHandler(async (req, res) => {
  const data = await productService.getNewArrivals();
  res.json({ success: true, data });
}));

// GET /api/products/best-sellers
router.get('/best-sellers', asyncHandler(async (req, res) => {
  const data = await productService.getBestSellers();
  res.json({ success: true, data });
}));

// GET /api/products/categories
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

// GET /api/products/slug/:slug
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
}));

// GET /api/products/:id (handles both ID and slug)
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: product });
}));

module.exports = router;
