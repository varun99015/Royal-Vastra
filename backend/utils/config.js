const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dataDir: path.join(__dirname, '..', 'data'),
  store: {
    name: process.env.STORE_NAME || 'Royal Vastra',
    currency: process.env.STORE_CURRENCY || 'INR',
    whatsappNumber: process.env.STORE_WHATSAPP_NUMBER || '919876543210',
    address: process.env.STORE_ADDRESS || '',
    email: process.env.STORE_EMAIL || '',
    phone: process.env.STORE_PHONE || '',
  },
  shipping: {
    freeAbove: parseFloat(process.env.SHIPPING_FREE_ABOVE) || 999,
    standardFee: parseFloat(process.env.SHIPPING_STANDARD_FEE) || 99,
    expressFee: parseFloat(process.env.SHIPPING_EXPRESS_FEE) || 199,
  },
  returnPolicyDays: parseInt(process.env.RETURN_POLICY_DAYS, 10) || 7,
  adminEmail: (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
};

module.exports = config;
