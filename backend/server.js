const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./utils/config');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./utils/errors');
const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

// ---- Security & Middleware ----
app.use(helmet());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---- Rate limiting ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// ---- Health check ----
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Routes ----
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes.router);
app.use('/api', adminRoutes);

// ---- Error handling ----
app.use(notFound);
app.use(errorHandler);

// ---- Start server ----
const server = app.listen(config.port, () => {
  logger.info(`Royal Vastra backend running on port ${config.port} [${config.nodeEnv}]`);
});

module.exports = { app, server };
