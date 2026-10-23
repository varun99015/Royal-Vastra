// Royal Vastra backend seed/init script
// Run with: node scripts/seed.js
// This ensures the admin users file exists and initializes the admin account from environment variables.

const path = require('path');
const fs = require('fs-extra');
const config = require('../utils/config');
const logger = require('../utils/logger');
const adminService = require('../services/admin.service');

const ADMINS_KEY = 'admin_users.json';
const dataDir = config.dataDir;

(async () => {
  logger.info('Running Royal Vastra backend seed...');

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    await fs.mkdirp(dataDir);
    logger.info('Created data directory');
  }

  // Seed initial admin if configured
  try {
    await adminService.seedInitialAdmin();
    logger.info('Admin account initialized');
  } catch (err) {
    logger.error('Failed to seed admin:', err.message);
  }

  // Verify products data exists
  const productsPath = path.join(dataDir, 'products.json');
  if (fs.existsSync(productsPath)) {
    logger.info('Products data already present');
  } else {
    logger.warn('No products.json found - backend will have empty product catalog');
  }

  // Verify settings data exists
  const settingsPath = path.join(dataDir, 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    await fs.writeJson(settingsPath, config.store, { spaces: 2 });
    logger.info('Initialized settings.json with default store config');
  }

  logger.info('Seed complete!');
})();
