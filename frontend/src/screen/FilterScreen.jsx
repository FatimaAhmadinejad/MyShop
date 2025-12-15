import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../compontent/Product.jsx';
import { useGetProductsQuery } from '../slices/apiSlice.js';
import Paginate from '../compontent/Paginate.jsx';

const FilterScreen = () => {
  const location = useLocation();

  // خواندن query params از URL
  const searchParams = new URLSearchParams(location.search);
const keyword = searchParams.get('keyword') || '';
const category = searchParams.get('category') || '';
const brand = searchParams.get('brand') || '';
const minPrice = searchParams.get('minPrice') || '';
const maxPrice = searchParams.get('maxPrice') || '';
const sort = searchParams.get('sort') || '';
const pageNumber = Number(searchParams.get('page')) || 1;

// تبدیل رشته به عدد فقط در صورت موجود بودن، برای ارسال به بک‌اند رشته می‌مونه
const minPriceValue = minPrice !== '' ? Number(minPrice) : '';
const maxPriceValue = maxPrice !== '' ? Number(maxPrice) : '';


  // فراخوانی hook برای گرفتن محصولات
  const { data, error, isLoading } = useGetProductsQuery({
    keyword,
    category,
    brand,
    minPrice: minPriceValue,
    maxPrice: maxPriceValue,
    sort,
    pageNumber
  });
  
  


  return (
    <div>
      <h2>Filtered Products</h2>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3>Error: {error?.data?.message || 'Something went wrong'}</h3>
      ) : (
        <>
          <Row>
            {data.products.length === 0 && <p>No products found</p>}
            {data.products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {data.products.length > 0 && (
          <Paginate
            pages={data?.pages || 1}              // اگر data هنوز undefined هست
            page={Number(data?.page || pageNumber)}
            isFilterScreen={true}
            keyword={keyword}
            category={category}
            brand={brand}
            minPrice={minPriceValue}
            maxPrice={maxPriceValue}
            sort={sort}
          />
        )}
        </>
      )}
    </div>
  );
};

export default FilterScreen;

