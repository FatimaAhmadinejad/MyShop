import asyncHandler from '../middleware/asynchandler.js';
import Product from '../model/productModel.js';
// @desc    Fetch all products
//@route    GET /api/products
//@access   Public
const getProducts = asyncHandler(async(req,res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

     const category = req.query.category;
     const brand = req.query.brand;
     const minPrice = req.query.minPrice;
     const maxPrice = req.query.maxPrice;
     const sort = req.query.sort;
     const filter = { ...keyword };

     if (category) {
     filter.category = category;
    }

     if (brand) {
      filter.brand = brand;
    }

     if (minPrice || maxPrice) {
       filter.price = {};
     if (minPrice) filter.price.$gte = Number(minPrice);
     if (maxPrice) filter.price.$lte = Number(maxPrice);
    } 
 
    const count = await Product.countDocuments(filter);

    let sortOption = {};

   switch (sort) {
  case 'price_asc':
    sortOption.price = 1;
    break;
  case 'price_desc':
    sortOption.price = -1;
    break;
  case 'rating_desc':
    sortOption.rating = -1;
    break;
  default:
    sortOption.createdAt = -1;
}


    const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    ;
  

  const productsWithRatings = products.map(product => {
  const realNumReviews = product.reviews.length;
  const realRating = realNumReviews > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / realNumReviews
    : 0;
  return {
    ...product._doc,
    rating: realRating,
    numReviews: realNumReviews
  };
});

res.json({ products: productsWithRatings, page, pages: Math.ceil(count / pageSize) });
});
// @desc    Fetch all products
//@route    GET /api/products:id
//@access   Public
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // محاسبه review واقعی
    const realNumReviews = product.reviews.length;
    const realRating = realNumReviews > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / realNumReviews
      : 0;

    return res.json({
      ...product._doc,      // داده اصلی محصول
      rating: realRating,   // مقدار واقعی یا صفر
      numReviews: realNumReviews // تعداد واقعی یا صفر
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create A Product
//@route    POST /api/products
//@access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: name || 'Sample name',
    price: price || 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: brand || 'Sample brand',
    category: category || 'Sample category',
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});
// @desc    Update A Product
//@route    PUT /api/products/:id
//@access   Private/Admin
const UpdateProduct = asyncHandler(async(req,res) => {
  const {name,price,description,image,brand,category,countInStock} = req.body;
  
  const product = await Product.findById(req.params.id);

  if(product){
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock

    const UpdatedProduct = await product.save();
    res.json(UpdatedProduct);
  }else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
// @desc    Delete A Product
//@route    DELETE /api/products/:id
//@access   Private/Admin
const DeleteProduct = asyncHandler(async(req,res) => {
  const product = await Product.findById(req.params.id);

  if(product){
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product deleted' });
  }else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
// @desc    Create a new review
//@route    DELETE /api/products/:id/reviews
//@access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);


  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;}
      else{
         product.rating = 0;
      }

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getTopProducts = asyncHandler(async(req,res) => {
  const products = await Product.find({}).sort({ Rating: -1 }).limit(3);
  res.status(200).json(products)
});
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category'); // همه دسته‌ها
  res.status(200).json( categories );
});


const getBrands = async (req, res) => {
  const brands = await Product.find().distinct('brand'); // یا populate و map
   res.status(200).json(brands);
};
export {getProducts,getProductsById,createProduct,UpdateProduct,DeleteProduct,createProductReview,getTopProducts,getCategories,getBrands};   