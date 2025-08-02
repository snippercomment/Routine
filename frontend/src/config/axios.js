import axios from 'axios';

// Token validation function
const isValidToken = (token) => {
    if (!token || typeof token !== 'string' || token.trim() === '') return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

// Create base axios configuration
const baseConfig = {
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000, // Increased timeout to 10s
    headers: {
        'Content-Type': 'application/json'
    }
};

// Create user axios instance
const userInstance = axios.create(baseConfig);

// Create admin axios instance
const adminInstance = axios.create(baseConfig);

// User request interceptor
userInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token && isValidToken(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (token) {
            // If token exists but is invalid, clear it
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Admin request interceptor
adminInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token && isValidToken(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User response interceptor
userInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Admin response interceptor
adminInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export const userAxios = userInstance;
export const adminAxios = adminInstance;

// Default export for backward compatibility and general use
export default userInstance; 