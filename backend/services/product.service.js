const repo = require('./file.service');
const logger = require('../utils/logger');

const getAllProducts = async () => (await repo.readJSON('products.json')) || [];

const getProductById = async (id) => {
  const products = await getAllProducts();
  return products.find((p) => p.id === id || p.slug === id);
};

const getProductBySlug = async (slug) => {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug || p.id === slug);
};

const filterProducts = async (filters = {}, page = 1, limit = 12) => {
  let products = await getAllProducts();

  if (filters.active !== undefined) {
    products = products.filter((p) => (p.isActive !== undefined ? p.isActive === filters.active : true));
  } else {
    products = products.filter((p) => p.isActive !== false);
  }

  if (filters.category && filters.category !== 'all') {
    const catLower = filters.category.toLowerCase().trim();
    products = products.filter((p) => p.category && p.category.toLowerCase().trim() === catLower);
  }

  if (filters.subcategory && filters.subcategory !== 'all') {
    const subLower = filters.subcategory.toLowerCase().trim();
    products = products.filter((p) => p.subcategory && p.subcategory.toLowerCase().trim() === subLower);
  }

  if (filters.brand && filters.brand !== 'all') {
    const brandLower = filters.brand.toLowerCase().trim();
    products = products.filter((p) => p.brand && p.brand.toLowerCase().trim() === brandLower);
  }

  if (filters.occasion && filters.occasion !== 'all') {
    const occasions = Array.isArray(filters.occasion) ? filters.occasion : [filters.occasion];
    const occLowerList = occasions.map((o) => o.toLowerCase().trim());
    products = products.filter(
      (p) =>
        Array.isArray(p.occasion) &&
        p.occasion.some((o) => occLowerList.includes(o.toLowerCase().trim()))
    );
  }

  if (filters.fabric && filters.fabric !== 'all') {
    const fabrics = Array.isArray(filters.fabric) ? filters.fabric : [filters.fabric];
    const fabLowerList = fabrics.map((f) => f.toLowerCase().trim());
    products = products.filter(
      (p) =>
        p.fabric &&
        fabLowerList.some((f) => p.fabric.toLowerCase().includes(f))
    );
  }

  if (filters.color && filters.color !== 'all') {
    const colors = Array.isArray(filters.color) ? filters.color : [filters.color];
    const colLowerList = colors.map((c) => c.toLowerCase().trim());
    products = products.filter(
      (p) =>
        Array.isArray(p.colors) &&
        p.colors.some((c) => colLowerList.some((target) => c.toLowerCase().includes(target)))
    );
  }

  if (filters.size && filters.size !== 'all') {
    const sizes = Array.isArray(filters.size) ? filters.size : [filters.size];
    products = products.filter(
      (p) => Array.isArray(p.sizes) && p.sizes.some((s) => sizes.some((target) => s.includes(target)))
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) {
      products = products.filter((p) => (p.price || 0) >= min);
    }
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) {
      products = products.filter((p) => (p.price || 0) <= max);
    }
  }

  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    products = products.filter((p) => {
      const nameMatch = p.name && p.name.toLowerCase().includes(searchLower);
      const descMatch = p.description && p.description.toLowerCase().includes(searchLower);
      const catMatch = p.category && p.category.toLowerCase().includes(searchLower);
      const subcatMatch = p.subcategory && p.subcategory.toLowerCase().includes(searchLower);
      const fabricMatch = p.fabric && p.fabric.toLowerCase().includes(searchLower);
      return nameMatch || descMatch || catMatch || subcatMatch || fabricMatch;
    });
  }

  switch (filters.sort) {
    case 'price-low':
      products.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'newest':
      products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    case 'featured':
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
    default:
      // Default: featured first, then newest
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  const totalCount = products.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const startIndex = (pageNum - 1) * limitNum;
  const pagedProducts = products.slice(startIndex, startIndex + limitNum);

  return {
    data: pagedProducts,
    total: totalCount,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalCount / limitNum),
  };
};

const getFeaturedProducts = async () => {
  const products = await getAllProducts();
  return products.filter((p) => p.isFeatured === true && p.isActive !== false);
};

const getNewArrivals = async () => {
  const products = await getAllProducts();
  return products
    .filter((p) => (p.isNew === true || (p.createdAt && p.createdAt > 1717300000000)) && p.isActive !== false)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

const getBestSellers = async () => {
  const products = await getAllProducts();
  return products
    .filter((p) => (p.badge === 'Bestseller' || p.isFeatured) && p.isActive !== false)
    .slice(0, 10);
};

const addProduct = async (productData) => {
  const products = await getAllProducts();
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = productData.id || `rv-${Date.now()}`;
  const newProduct = {
    ...productData,
    id,
    slug,
    currency: productData.currency || 'INR',
    stock: parseInt(productData.stock, 10) || 10,
    price: parseFloat(productData.price) || 999,
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80'],
    colors: Array.isArray(productData.colors) ? productData.colors : ['Classic'],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : ['M', 'L', 'XL'],
    isActive: productData.isActive !== false,
    createdAt: Date.now(),
  };

  await repo.prependToJSON('products.json', newProduct);
  return newProduct;
};

const updateProduct = async (id, updates) => {
  return await repo.updateJSONItem('products.json', 'id', id, updates);
};

const deleteProduct = async (id) => {
  return await repo.removeJSONItem('products.json', 'id', id);
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  filterProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  addProduct,
  updateProduct,
  deleteProduct,
};
