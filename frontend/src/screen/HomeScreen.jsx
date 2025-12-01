import {Row,Col} from 'react-bootstrap'
import Product from '../compontent/Product'
import {Link, useParams} from 'react-router-dom'
import Message from '../compontent/Message'
import Loader from '../compontent/Loader'
import ProductCarousel from '../compontent/ProductCarousel.jsx'
import Paginate from '../compontent/Paginate.jsx'
import Meta from '../compontent/Meta.jsx'
import { useGetProductsQuery } from '../slices/productsApiSlice'
const Homescreen = () => {
  const {pageNumber,keyword} = useParams();

  const {data,isLoading,error} = useGetProductsQuery({keyword,pageNumber});
  return (
    <>
    {!keyword ? <ProductCarousel/> : <Link to='/' className='btn btn-light'>Go Back</Link>}
    {isLoading? (
      <Loader/>
    ) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (<>
    <Meta title='Hello'/>
        <h1>Latest products</h1>
        <Row>
            {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                    <Product product={product}/>
                </Col>
            ))}
    
        </Row>
        <Paginate
        pages={data.pages}
        page={data.page}
        keyword={keyword ? keyword : ''}
        />
        </>)}
    </>
  )
}

export default Homescreen;