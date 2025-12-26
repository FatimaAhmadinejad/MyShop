import asyncHandler from '../middleware/asynchandler.js';
import Product from '../model/productModel.js';
import axios from 'axios';

/* =========================
   GET ALL PRODUCTS
========================= */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const filter = { ...keyword };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const productsWithRatings = products.map((product) => {
    const numReviews = product.reviews.length;
    const rating =
      numReviews > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
        : 0;

    return {
      ...product._doc,
      rating,
      numReviews,
    };
  });

  res.json({
    products: productsWithRatings,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

/* =========================
   GET PRODUCT BY ID
========================= */
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const numReviews = product.reviews.length;
  const rating =
    numReviews > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
      : 0;

  res.json({
    ...product._doc,
    rating,
    numReviews,
  });
});

/* =========================
   CREATE PRODUCT
========================= */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);

  // 🔥 ارسال دیتای کامل به ML recommender
  try {
    await axios.post('https://recommender-gyqm.onrender.com/add-product', {
      id: createdProduct._id,
      name: createdProduct.name,
      description: createdProduct.description,
      image: createdProduct.image,
      category: createdProduct.category,
      brand: createdProduct.brand,
    });
  } catch (error) {
    console.error('ML add-product failed:', error.message);
  }
});

/* =========================
   UPDATE PRODUCT
========================= */
const UpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.body.image;
  product.brand = req.body.brand;
  product.category = req.body.category;
  product.countInStock = req.body.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);

  // 🔥 بروزرسانی embedding در ML
  try {
    await axios.post('https://recommender-gyqm.onrender.com/update-product', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      image: updatedProduct.image,
      category: updatedProduct.category,
      brand: updatedProduct.brand,
    });
  } catch (error) {
    console.error('ML update-product failed:', error.message);
  }
});

/* =========================
   DELETE PRODUCT
========================= */
const DeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: product._id });

  // 🔥 حذف embedding از ML
  try {
    await axios.delete(
      `https://recommender-gyqm.onrender.com/delete_embedding/${product._id}`
    );
  } catch (error) {
    console.error('ML delete failed:', error.message);
  }

  res.json({ message: 'Product deleted' });
});

/* =========================
   CREATE REVIEW
========================= */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  });

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

/* =========================
   TOP PRODUCTS
========================= */
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  const sorted = products
    .map((p) => {
      const numReviews = p.reviews.length;
      const rating =
        numReviews > 0
          ? p.reviews.reduce((a, r) => a + r.rating, 0) / numReviews
          : 0;
      return { ...p._doc, rating, numReviews };
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  res.json(sorted);
});

/* =========================
   CATEGORIES & BRANDS
========================= */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands);
});

export {
  getProducts,
  getProductsById,
  createProduct,
  UpdateProduct,
  DeleteProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  getBrands,
};
  