const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./file.service');
const config = require('../utils/config');
const logger = require('../utils/logger');

const ADMINS_KEY = 'admin_users.json';

const getAdminUsers = async () => {
  const users = await repo.readJSON(ADMINS_KEY) || [];
  return Array.isArray(users) ? users : [];
};

const seedInitialAdmin = async () => {
  const existingUsers = await getAdminUsers();
  if (config.adminEmail && config.adminPassword) {
    const passwordHash = await bcrypt.hash(config.adminPassword, 10);
    const adminUser = { id: 'admin', email: config.adminEmail, name: 'Store Administrator', passwordHash, role: 'admin', createdAt: Date.now() };
    const existingAdmin = existingUsers.find((u) => u.email.toLowerCase() === config.adminEmail.toLowerCase());
    if (existingAdmin) {
      await repo.updateJSONItem(ADMINS_KEY, 'email', config.adminEmail, { passwordHash });
      logger.info(`Updated password for admin: ${config.adminEmail}`);
    } else {
      await repo.prependToJSON(ADMINS_KEY, adminUser);
      logger.info(`Created initial admin: ${config.adminEmail}`);
    }
  }
  return existingUsers;
};

const authenticateAdmin = async (email, password) => {
  const users = await getAdminUsers();
  const admin = users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!admin) return { success: false, error: 'Invalid email or password' };
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return { success: false, error: 'Invalid email or password' };
  const token = jwt.sign({ adminId: admin.id, email: admin.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return { success: true, token, admin: { id: admin.id, email: admin.email, name: admin.name } };
};

const verifyAdminToken = (token) => {
  try {
    return { success: true, admin: jwt.verify(token, config.jwtSecret) };
  } catch (err) {
    return { success: false, error: 'Invalid or expired token' };
  }
};

module.exports = { seedInitialAdmin, authenticateAdmin, verifyAdminToken };
