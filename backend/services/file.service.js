const fs = require('fs-extra');
const path = require('path');
const config = require('../utils/config');
const logger = require('../utils/logger');

const dataDir = config.dataDir;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const readJSON = async (filename) => {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) return null;
    return await fs.readJson(filePath);
  } catch (err) {
    logger.error(`Error reading ${filename}:`, err);
    throw new Error(`Failed to read ${filename}`);
  }
};

const writeJSON = async (filename, data) => {
  const filePath = path.join(dataDir, filename);
  try {
    const tempPath = filePath + '.tmp';
    await fs.writeJson(tempPath, data, { spaces: 2 });
    await fs.rename(tempPath, filePath);
    logger.debug(`Wrote ${filename}`);
  } catch (err) {
    logger.error(`Error writing ${filename}:`, err);
    throw new Error(`Failed to write ${filename}`);
  }
};

const appendToJSON = async (filename, item) => {
  let data = [];
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    try { data = await readJSON(filename) || []; } catch (e) { /* ignore */ }
  }
  if (!Array.isArray(data)) data = [data];
  data.push(item);
  await writeJSON(filename, data);
};

const prependToJSON = async (filename, item) => {
  let data = [];
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    try { data = await readJSON(filename) || []; } catch (e) { /* ignore */ }
  }
  if (!Array.isArray(data)) data = [data];
  data.unshift(item);
  await writeJSON(filename, data);
};

const updateJSONItem = async (filename, idField, idValue, updatedData) => {
  const filePath = path.join(dataDir, filename);
  let data = [];
  if (fs.existsSync(filePath)) {
    try { data = await readJSON(filename) || []; } catch (e) { return false; }
  }
  if (!Array.isArray(data)) data = [data];

  const index = data.findIndex((item) => item[idField] === idValue);
  if (index === -1) return false;

  data[index] = { ...data[index], ...updatedData };
  await writeJSON(filename, data);
  return true;
};

const removeJSONItem = async (filename, idField, idValue) => {
  const filePath = path.join(dataDir, filename);
  let data = [];
  if (fs.existsSync(filePath)) {
    try { data = await readJSON(filename) || []; } catch (e) { return false; }
  }
  if (!Array.isArray(data)) data = [data];

  const index = data.findIndex((item) => item[idField] === idValue);
  if (index === -1) return false;
  data.splice(index, 1);
  await writeJSON(filename, data);
  return true;
};

const safeMergeOrders = async (filename, newOrders) => {
  const filePath = path.join(dataDir, filename);
  let existingOrders = [];
  if (fs.existsSync(filePath)) {
    try { existingOrders = await readJSON(filename) || []; } catch (e) { /* ignore */ }
  }
  if (!Array.isArray(existingOrders)) existingOrders = [];

  const existingIds = new Set(existingOrders.map((o) => o.id));
  const ordersToAdd = newOrders.filter((order) => !existingIds.has(order.id));
  const mergedOrders = [...existingOrders, ...ordersToAdd];

  await writeJSON(filename, mergedOrders);
  return true;
};

const updateStock = async (filename, updates) => {
  const filePath = path.join(dataDir, filename);
  let products = [];
  if (fs.existsSync(filePath)) {
    try { products = await readJSON(filename) || []; } catch (e) { return false; }
  }
  if (!Array.isArray(products)) products = [products];

  for (const update of updates) {
    const product = products.find((p) => p.id === update.id);
    if (product) {
      product.stock = Math.max(0, (product.stock || 0) - update.quantity);
      logger.info(`Stock updated for ${product.id}: new stock = ${product.stock}`);
    } else {
      logger.warn(`Product not found for stock update: ${update.id}`);
    }
  }

  await writeJSON(filename, products);
  return true;
};

const getPublicSettings = async () => {
  const settings = await readJSON('settings.json') || {};
  return {
    storeName: settings.storeName || config.store.name,
    currency: settings.currency || config.store.currency,
    whatsappNumber: settings.whatsappNumber || config.store.whatsappNumber,
    address: settings.address || config.store.address,
    email: settings.email || config.store.email,
    phone: settings.phone || config.store.phone,
    shippingFreeAbove: settings.shippingFreeAbove || config.shipping.freeAbove,
    shippingStandardFee: settings.shippingStandardFee || config.shipping.standardFee,
    shippingExpressFee: settings.shippingExpressFee || config.shipping.expressFee,
    returnPolicyDays: settings.returnPolicyDays || config.returnPolicyDays,
  };
};

module.exports = {
  readJSON,
  writeJSON,
  appendToJSON,
  prependToJSON,
  updateJSONItem,
  removeJSONItem,
  safeMergeOrders,
  updateStock,
  getPublicSettings,
};
