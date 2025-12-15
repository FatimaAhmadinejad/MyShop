import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {notfound,errorHandler} from './middleware/errormiddleware.js'
import productsRoutes from './routes/productRoutes.js'
import userRoutes from './routes/usersRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/UpdateRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';  // ← اضافه کن

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}))

// Cookie parser middleware
app.use(cookieParser())

// ← اضافه کردن CORS قبل از روت‌ها
app.use(cors({
  origin: 'http://localhost:3000', // آدرس فرانت‌اند
  credentials: true // اگر کوکی‌ها هم میخوای فرستاده بشن
}));

app.get('/',(req,res) => {
    res.send('API is running ...')
});

// روت‌ها
app.use('/api/products',productsRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/categories', categoryRoutes);

// محیط پروکشن
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
}

app.use(notfound);
app.use(errorHandler);

app.listen(port,() => console.log(`Server is running On port ${port}`));


