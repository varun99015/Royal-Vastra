import api from './api.js';

export const fetchProducts = (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });
  const queryString = new URLSearchParams(cleanParams).toString();
  return api.get(queryString ? `/products?${queryString}` : '/products');
};

export const fetchProductById = (id) => api.get(`/products/${id}`);

export const fetchProductBySlug = (slug) => api.get(`/products/slug/${slug}`);

export const fetchFeaturedProducts = () => api.get('/products/featured');

export const fetchNewArrivals = () => api.get('/products/new-arrivals');

export const fetchBestSellers = () => api.get('/products/best-sellers');

export const fetchCategories = () => api.get('/products/categories');

export const fetchSettings = () => api.get('/settings/public');

export const createOrder = (orderData) => api.post('/orders', orderData);

export const fetchOrder = (orderId, verification = {}) => {
  const query = new URLSearchParams(verification).toString();
  return api.get(`/orders/${orderId}${query ? `?${query}` : ''}`);
};

// Admin Service Calls
export const adminLogin = (email, password) => api.post('/admin/login', { email, password });

export const adminGetProducts = () => api.get('/admin/products');

export const adminCreateProduct = (data) => api.post('/admin/products', data);

export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data);

export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);

export const adminGetOrders = () => api.get('/admin/orders');

export const adminUpdateOrderStatus = (orderId, status, note = '') =>
  api.patch(`/admin/orders/${orderId}/status`, { status, note });

export const adminGetSettings = () => api.get('/admin/settings');

export const adminUpdateSettings = (settings) => api.put('/admin/settings', settings);
