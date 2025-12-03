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


// ← این خط اول اجرا شود
dotenv.config();

const port = process.env.PORT || 5000;


// حالا که dotenv اجرا شده، connectDB درست MONGO_URI را می‌خواند
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}))

// Cookie parser middleware
app.use(cookieParser())

app.get('/',(req,res) => {
    res.send('API is running ...')
});
app.use('/api/products',productsRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/categories', categoryRoutes);

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

