import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : `${window.location.protocol}//${window.location.hostname}:5000/api`) 
});

// Attach token to every request if logged in
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('atithigram_user') || '{}');
  if (user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Places
export const getPlaces = (category) => API.get('/places', { params: { category } });
export const getPlace = (id) => API.get(`/places/${id}`);

// Homestays
export const getHomestays = () => API.get('/homestays');
export const getHomestay = (id) => API.get(`/homestays/${id}`);
export const createHomestay = (data) => API.post('/homestays', data);

// Products
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const verifyHomestay = (id, status) => API.patch(`/admin/homestays/${id}/verify`, { status });

// User / Rewards
export const updateEcoPoints = (points) => API.patch('/auth/eco-points', { points });
