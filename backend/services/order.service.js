const { v4: uuidv4 } = require('uuid');
const repo = require('./file.service');
const productService = require('./product.service');
const config = require('../utils/config');
const logger = require('../utils/logger');

const calculateShipping = (subtotal) => {
  if (subtotal >= config.shipping.freeAbove) {
    return { fee: 0, label: 'Free Shipping', method: 'standard' };
  }
  return { fee: config.shipping.standardFee, label: `Standard Shipping (₹${config.shipping.standardFee})`, method: 'standard' };
};

const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = calculateShipping(subtotal);
  return {
    subtotal: Math.round(subtotal),
    shipping: shipping.fee,
    shippingLabel: shipping.label,
    total: Math.round(subtotal + shipping.fee),
    currency: config.store.currency,
  };
};

const validateOrderItems = async (items) => {
  const validatedItems = [];
  for (const item of items) {
    if (!item.productId) return { valid: false, error: 'Each item must have a productId' };
    const product = await productService.getProductById(item.productId);
    if (!product) return { valid: false, error: `Product not found: ${item.productId}` };
    if (product.isActive === false) return { valid: false, error: `Product is not available: ${product.name}` };

    if (item.size && (!product.sizes || !product.sizes.includes(item.size))) {
      return { valid: false, error: `Size "${item.size}" not available for ${product.name}` };
    }
    if (item.color && (!product.colors || !product.colors.includes(item.color))) {
      return { valid: false, error: `Color "${item.color}" not available for ${product.name}` };
    }

    const requestedQty = item.quantity || 1;
    if (product.stock !== undefined && product.stock < requestedQty) {
      return { valid: false, error: `Only ${product.stock} units available for ${product.name}` };
    }

    validatedItems.push({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      size: item.size || (product.sizes?.[0] || 'M'),
      color: item.color || (product.colors?.[0] || 'Default'),
      quantity: requestedQty,
      price: product.price,
      originalPrice: product.originalPrice,
    });
  }
  return { valid: true, items: validatedItems };
};

const createOrder = async (orderData) => {
  const { items, customer, paymentMethod, notes } = orderData;

  const validation = await validateOrderItems(items);
  if (!validation.valid) throw new Error(validation.error);

  const totals = calculateOrderTotals(validation.items);
  const orderId = `RV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const order = {
    id: orderId,
    uuid: uuidv4(),
    status: paymentMethod === 'cod' ? 'pending_confirmation' : 'awaiting_payment',
    paymentMethod,
    items: validation.items,
    customer: {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email || '',
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    },
    notes: notes || '',
    totals,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    statusHistory: [{ status: paymentMethod === 'cod' ? 'pending_confirmation' : 'awaiting_payment', timestamp: Date.now(), note: 'Order placed' }],
  };

  await repo.safeMergeOrders('orders.json', [order]);
  await repo.updateStock('products.json', validation.items.map((item) => ({ id: item.productId, quantity: item.quantity })));

  logger.info(`Order created: ${orderId}, items: ${validation.items.length}, total: ${totals.total}`);
  return order;
};

const getOrderById = async (orderId, verification = null) => {
  const orders = (await repo.readJSON('orders.json')) || [];
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  if (verification && (verification.mobile || verification.email)) {
    const { mobile, email } = verification;
    const cMobile = (order.customer?.mobile || '').replace(/\D/g, '');
    const vMobile = (mobile || '').replace(/\D/g, '');
    const cEmail = (order.customer?.email || '').toLowerCase().trim();
    const vEmail = (email || '').toLowerCase().trim();

    const mobileMatches = vMobile.length >= 7 && cMobile.length >= 7 && (cMobile.endsWith(vMobile) || vMobile.endsWith(cMobile));
    const emailMatches = vEmail && cEmail && cEmail === vEmail;

    if (!mobileMatches && !emailMatches) {
      return null;
    }
  }

  return order;
};

const updateOrderStatus = async (orderId, newStatus, note = '') => {
  const orders = await repo.readJSON('orders.json') || [];
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return { success: false, error: 'Order not found' };

  orders[index].status = newStatus;
  orders[index].updatedAt = Date.now();
  orders[index].statusHistory = orders[index].statusHistory || [];
  orders[index].statusHistory.push({ status: newStatus, timestamp: Date.now(), note });

  await repo.writeJSON('orders.json', orders);
  return { success: true, order: orders[index] };
};

const getAllOrders = async () => repo.readJSON('orders.json') || [];

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  calculateOrderTotals,
  validateOrderItems,
};
