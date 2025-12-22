import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // از .env می‌خونه

// instance پیش‌فرض axios
const axiosInstance = axios.create({
  baseURL: API_URL,       // URL پایه برای تمام درخواست‌ها
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
