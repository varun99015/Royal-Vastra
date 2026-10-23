const express = require('express');
const router = express.Router();
const orderService = require('../services/order.service');
const { validateRequest, asyncHandler } = require('../middleware/auth');
const { body } = require('express-validator');

// POST /api/orders - Create a new order
router.post('/',
  [
    body('items').isArray({ min: 1 }),
    body('customer.name').notEmpty().withMessage('Customer name is required'),
    body('customer.mobile').matches(/^\+?[\d\s\-]{7,}$/).withMessage('Valid mobile number required'),
    body('paymentMethod').isIn(['cod', 'online']).withMessage('Invalid payment method'),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  })
);

// GET /api/orders/:orderId - Lookup order (requires mobile or email verification)
router.get('/:orderId', asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, {
    mobile: req.query.mobile,
    email: req.query.email,
  });
  if (!order) return res.status(404).json({ success: false, error: 'Order not found or unauthorized' });
  res.json({ success: true, data: order });
}));

// POST /api/admin/orders - Admin: list all orders (protected)
const adminOrdersRoutes = express.Router();

module.exports = { router, adminOrdersRoutes };
