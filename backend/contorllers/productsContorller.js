import asyncHandler from '../middleware/asynchandler.js'
import Product from '../model/productModel.js'
import axios from 'axios'

/* =========================
   GET ALL PRODUCTS
========================= */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1

  // فیلتر بر اساس keyword
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}

  const filter = { ...keyword }

  // فیلتر category و brand
  if (req.query.category) filter.category = req.query.category
  if (req.query.brand) filter.brand = req.query.brand

  // فیلتر محدوده قیمت
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {}
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice)
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice)
  }

  // تنظیم sort بر اساس query
  let sortOption = { createdAt: -1 } // default: جدیدترین‌ها

  switch (req.query.sort) {
    case 'price_asc':
      sortOption = { price: 1 }
      break
    case 'price_desc':
      sortOption = { price: -1 }
      break
    case 'rating_asc':
      sortOption = { rating: 1, numReviews: 1 }
      break
    case 'rating_desc':
      sortOption = { rating: -1, numReviews: -1 }
      break
    default:
      sortOption = { createdAt: -1 }
  }

  const count = await Product.countDocuments(filter)

  // دریافت محصولات با filter، sort و pagination
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  })
})

/* =========================
   GET PRODUCT BY ID
========================= */
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
})

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
    rating: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)

  // 🔥 ML recommender
  try {
    await axios.post('https://recommender-gyqm.onrender.com/add-product', {
      id: createdProduct._id,
      name: createdProduct.name,
      description: createdProduct.description,
      image: createdProduct.image,
      category: createdProduct.category,
      brand: createdProduct.brand,
    })
  } catch (error) {
    console.error('ML add-product failed:', error.message)
  }
})

/* =========================
   UPDATE PRODUCT
========================= */
const UpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  product.name = req.body.name
  product.price = req.body.price
  product.description = req.body.description
  product.image = req.body.image
  product.brand = req.body.brand
  product.category = req.body.category
  product.countInStock = req.body.countInStock

  const updatedProduct = await product.save()
  res.json(updatedProduct)

  // 🔥 ML update
  try {
    await axios.post('https://recommender-gyqm.onrender.com/update-product', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      image: updatedProduct.image,
      category: updatedProduct.category,
      brand: updatedProduct.brand,
    })
  } catch (error) {
    console.error('ML update-product failed:', error.message)
  }
})

/* =========================
   DELETE PRODUCT
========================= */
const DeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await Product.deleteOne({ _id: product._id })

  // 🔥 ML delete
  try {
    await axios.delete(
      `https://recommender-gyqm.onrender.com/delete_embedding/${product._id}`
    )
  } catch (error) {
    console.error('ML delete failed:', error.message)
  }

  res.json({ message: 'Product deleted' })
})

/* =========================
   CREATE REVIEW
========================= */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  )

  if (alreadyReviewed) {
    res.status(400)
    throw new Error('Product already reviewed')
  }

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  })

  // ✅ محاسبه صحیح rating
  product.numReviews = product.reviews.length
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.numReviews

  await product.save()
  res.status(201).json({ message: 'Review added' })
})

/* =========================
   TOP PRODUCTS
========================= */
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1, numReviews: -1 })
    .limit(3)

  res.json(products)
})

/* =========================
   CATEGORIES & BRANDS
========================= */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category')
  res.json(categories)
})

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand')
  res.json(brands)
})

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
}

  