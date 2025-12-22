import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notfound, errorHandler } from './middleware/errormiddleware.js';
import productsRoutes from './routes/productRoutes.js';
import userRoutes from './routes/usersRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/UpdateRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recommenderRoutes from './routes/recommenderRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

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
  'https://myshop-76pn.onrender.com', // فرانت روی Render
  'http://localhost:3000' // توسعه محلی
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// روت‌های API
app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recommend', recommenderRoutes);

// مسیر آپلود فایل‌ها
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// محیط پروکشن: serve فرانت از build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Middleware مدیریت خطا
app.use(notfound);
app.use(errorHandler);

// شروع سرور
app.listen(port, () => console.log(`Server running on port ${port}`));
