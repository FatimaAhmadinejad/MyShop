import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notfound, errorHandler } from './middleware/errormiddleware.js';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/usersRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recommenderRoutes from './routes/recommenderRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

console.log('--- SERVER STARTING ---');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET at startup:', process.env.JWT_SECRET); // ← این مهمه

connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// تنظیم CORS
const allowedOrigins = [
  'https://myshop-76pn.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware برای لاگ درخواست‌ها
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request cookies:', req.cookies);
  next();
});

// روت‌های API
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recommend', recommenderRoutes);

// مسیر آپلود فایل‌ها
const __dirname = path.resolve()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// مسیر تست ساده
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware مدیریت خطا
app.use(notfound);
app.use(errorHandler);

// شروع سرور
app.listen(port, () => console.log(`Server running on port ${port}`));
