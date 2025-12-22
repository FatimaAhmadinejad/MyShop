import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/apiSlice';
import Product from '../compontent/Product';
import { Row, Col } from 'react-bootstrap';
import Paginate from '../compontent/Paginate';

const CategoryScreen = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    category: categoryName,
    pageNumber: currentPage,
  });

  React.useEffect(() => {
    refetch();
  }, [categoryName, currentPage, refetch]);

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error loading products</h2>;

  const products = data?.products || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;

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

      {pages > 1 && (
        <Paginate
          pages={pages}
          page={page}
          isFilterScreen={true} // یا flag جدا برای CategoryScreen
          category={categoryName}
        />
      )}
    </>
  );
};

export default CategoryScreen;




