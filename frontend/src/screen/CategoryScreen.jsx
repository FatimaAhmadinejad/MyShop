import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/apiSlice';
import Product from '../compontent/Product'; // فرض بر این است که کامپوننت Product برای نمایش محصول داری
import { Row, Col } from 'react-bootstrap';

const CategoryScreen = () => {
  const { categoryName } = useParams();

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    category: categoryName, });

    React.useEffect(() => {
  refetch();
}, [categoryName, refetch]);


  const products = data && data.products ? data.products : [];
  

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error loading products</h2>;

  return (
    <>
      <h1>{categoryName}</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CategoryScreen;
