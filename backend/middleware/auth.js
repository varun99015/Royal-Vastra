const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errors');
const adminService = require('../services/admin.service');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(`Validation error: ${messages.join(', ')}`, 400));
  }
  next();
};

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authorization required', 401));
  }
  const token = authHeader.split(' ')[1];
  const result = await adminService.verifyAdminToken(token);
  if (!result.success) return next(new AppError(result.error, 401));
  req.admin = result.admin;
  next();
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authRateLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  return require('express-rate-limit')({ windowMs, max, message: 'Too many requests from this IP', standardHeaders: true, legacyHeaders: false });
};

module.exports = { validateRequest, requireAdmin, asyncHandler, authRateLimit };
