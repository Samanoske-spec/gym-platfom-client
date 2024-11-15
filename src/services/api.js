import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // baseURL: 'http://54.151.161.131', // Update this if your backend runs on a different host/port
  baseURL: 'http://localhost:5000', // Update this if your backend runs on a different host/port
});

// Add a request interceptor to include the authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Handle unauthorized errors globally, such as redirecting to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Credit Management API calls
const creditAPI = {
  // Get credit balance for a user
  getCreditBalance: () => api.get('/api/credits/balance'),
  
  // Purchase credits
  purchaseCredits: (data) => api.post('/api/credits/purchase', data),
  
  // Get credit packages
  getCreditPackages: () => api.get('/api/credits/packages'),
  
  // Use credit (for posting venue/project or enrolling)
  useCredit: (data) => api.post('/api/credits/use', data),
  
  // Get credit transaction history
  getCreditHistory: () => api.get('/api/credits/history'),
  
  // Admin: Update credit package settings
  updateCreditPackage: (packageId, data) => api.put(`/api/credits/packages/${packageId}`, data),
  
  // Admin: Create new credit package
  createCreditPackage: (data) => api.post('/api/credits/packages', data),
};

// Add creditAPI to the existing api object
const enhancedApi = {
  ...api,
  credits: creditAPI,
};

export default enhancedApi;
