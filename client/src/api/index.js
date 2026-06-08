import api from './client.js';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login:    (payload) => api.post('/auth/login', payload).then((r) => r.data),
  me:       () => api.get('/auth/me').then((r) => r.data),
};

export const productsApi = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  get:  (id) => api.get(`/products/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
};

export const cartApi = {
  get:        () => api.get('/cart').then((r) => r.data),
  addItem:    (productId, quantity) => api.post('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (id, quantity) => api.patch(`/cart/items/${id}`, { quantity }).then((r) => r.data),
  removeItem: (id) => api.delete(`/cart/items/${id}`).then((r) => r.data),
};

export const ordersApi = {
  create: (shipping) => api.post('/orders', shipping).then((r) => r.data),
  list:   () => api.get('/orders').then((r) => r.data),
  get:    (id) => api.get(`/orders/${id}`).then((r) => r.data),
};

export const profileApi = {
  get:    () => api.get('/profile').then((r) => r.data),
  update: (payload) => api.patch('/profile', payload).then((r) => r.data),
};
