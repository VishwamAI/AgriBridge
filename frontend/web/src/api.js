import axios from 'axios';

const API_BASE_URL = 'https://backend-vqnufjhq.fly.dev/api'; // Deployed backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
export const verify2FA = (verificationData) => api.post('/auth/verify-2fa', verificationData);
export const requestRecoveryCode = (email) => api.post('/auth/request-recovery-code', { email });
export const verifyRecoveryCode = (recoveryData) => api.post('/auth/verify-recovery-code', recoveryData);

// User endpoints
export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (userData) => api.put('/user/profile', userData);

// Product endpoints
export const getProducts = () => api.get('/products');
export const getProductById = (productId) => api.get(`/products/${productId}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (productId, productData) => api.put(`/products/${productId}`, productData);
export const deleteProduct = (productId) => api.delete(`/products/${productId}`);

// Order endpoints
export const getOrders = () => api.get('/orders');
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });

// Payment endpoints
export const processPayment = (paymentData) => api.post('/payments/process', paymentData);
export const getPaymentMethods = () => api.get('/payments/methods');

// Add more API endpoints as needed

export default api;
