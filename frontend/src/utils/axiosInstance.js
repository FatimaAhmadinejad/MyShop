import axios from 'axios';

// Base URL از فایل .env می‌خونه و خودش مسیر /api رو اضافه می‌کنه
const API_URL = (process.env.REACT_APP_API_URL || 'https://myshop1-qgb6.onrender.com') + '/api';

// ساخت instance پیش‌فرض axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // چون از کوکی استفاده می‌کنه
});

// Middleware برای اضافه کردن توکن به هدر (اختیاری)
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

console.log('REACT_APP_API_URL=', process.env.REACT_APP_API_URL);
console.log('REACT_APP_TEST=', process.env.REACT_APP_TEST);

export default axiosInstance;


