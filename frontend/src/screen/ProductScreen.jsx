import { useState,useEffect } from "react";
import {useParams,useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import {Form,Row,Col,Image,ListGroup,Card,Button,} from "react-bootstrap";
import Rating from "../compontent/Rating";
import Message from "../compontent/Message";
import Loader from "../compontent/Loader";
import { useGetProductDetailsQuery,useCreateReviewsMutation } from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";
import { useDispatch,useSelector } from "react-redux";
import {toast} from 'react-toastify'
import Meta from '../compontent/Meta'
const ProductScreen = () => {
const {id : productId} = useParams ();
const dispatch = useDispatch();
const navigate = useNavigate();
const [qty,setQty] = useState(1);
const [rating,SetRating] = useState(0);
const [comment,SetComment] = useState('');
const {data:product,isLoading,refetch,error} = useGetProductDetailsQuery(productId);
const [recommended, setRecommended] = useState([]);

// ******** RECOMMENDER SYSTEM ********
useEffect(() => {
  const fetchRecommended = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/recommend/${productId}`);
      const data = await res.json();
      setRecommended(data.recommended || []);
    } catch (error) {
      console.error("Recommender error:", error);
    }
  };

  fetchRecommended();
}, [productId]);

const [createReview,{ isLoading: isReviewLoading,}] = useCreateReviewsMutation();
const { userInfo } = useSelector((state) => state.auth);
const addToCartHandler = () => {
dispatch(addToCart({...product,qty}));
navigate('/cart')
}
const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
     <Link className='btn btn-light my-3' to='/'>Go back</Link>
     {isLoading? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
        <>
        <Meta title={product.name}/>
      <Row>
      <Col md="5">
         <Image src={product.image} alt={product.name}  className="product-screen-img"/>
          </Col>
         <Col md="4">
         <ListGroup variant="flush">
             <ListGroup.Item>
                 <h3>{product.name}</h3>
             </ListGroup.Item>
             <ListGroup.Item>
             <Rating value={product.rating || 0} text={`${product.numReviews || 0}reviews`}/>
             </ListGroup.Item>
             <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
             <ListGroup.Item>Description : {product.description}</ListGroup.Item>
         </ListGroup>
         </Col>
         <Col md="3">
         <Card>
          <ListGroup variant="flush">
             <ListGroup.Item>
                 <Row>
                 <Col>Price:</Col>
                 <Col>
                 <strong>${product.price}</strong>
                 </Col>
                 </Row>
             </ListGroup.Item>
             <ListGroup.Item>
                 <Row>
               <Col>Status:</Col>
               <Col>
               <strong>{product.countInStock > 0 ? 'in Stock' : 'Out of Stock'}</strong>
               </Col>
                 </Row>
             </ListGroup.Item>
             {product.countInStock > 0 && (
                <ListGroup.Item>
                    <Row>
                 <Col>Qty</Col>
                 <Col>
                 <Form.Control
                 as='select'
                 value={qty}
                 onChange={(e) => setQty(Number(e.target.value))}
                 >
                    {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                            {x + 1}
                        </option>
                    ))
                    }
                 </Form.Control>
                 </Col>
                    </Row>
                </ListGroup.Item>
             )}
             <ListGroup.Item>
                 <Button
                 className='btn-black'
                 type="button"
                 disabled={product.countInStock === 0}
                 onClick={addToCartHandler}
                 >
                     Add to Cart
                 </Button>
             </ListGroup.Item>
          </ListGroup>
         </Card> 
         </Col>
     </Row>
     <Row className='reviews'>
        <Col md={6}>
        <h2>Reviews</h2>
        {product.reviews.length === 0 && <Message>No Reviews</Message>}
        <ListGroup variant='flush'>
            {product.reviews.map(review => (
                <ListGroup key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating}/>
                    <p>{review.comment}</p>
                </ListGroup>
            ))}
            <ListGroup.Item>
                <h2>Write A Customer Review</h2>

                {isReviewLoading && <Loader/>}

                {userInfo ? (
                    <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => SetRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                     <Form.Group controlId='comment' className='my-2'>
                       <Form.Label>Comment</Form.Label>
                       <Form.Control
                         as='textarea'
                        row='3'
                      value={comment}
                      onChange={(e) => SetComment(e.target.value)}></Form.Control>
                     </Form.Group>
                                          <Button
                                              disabled={isReviewLoading}
                                              type='submit'
                                              variant='primary'>
                                              Submit
                                          </Button>
                                          </Form>
                                          
                ) : (
                    <Message>
                        Please <Link to='/login'>Sign In</Link> To Write a review{'  '}
                    </Message>
                )}
            </ListGroup.Item>
        </ListGroup>
        </Col>
     </Row>
     </>
     )}
     {/* ******** RECOMMENDED PRODUCTS ******** */}
{recommended.length > 0 && (
  <Row className='mt-5'>
    <h3>Recommended Products</h3>
    {recommended.map((item) => (
      <Col key={item.id} sm={12} md={6} lg={4} xl={3}>
        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
          <Card className="my-3 p-3 rounded product-card">
            <Card.Img src={item.image || "/images/placeholder.png"} variant="top" className="product-img" />
            <Card.Body>
              <Card.Title as="div">
                <strong>{item.name}</strong>
              </Card.Title>
              <Card.Text as='div'>
               <Rating value={product.rating || 0} text={`${product.numReviews || 0}reviews`}/>
              </Card.Text>
              <Card.Text as="h3">${item.price}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    ))}
  </Row>
)}
    </>
  )
}

export default ProductScreen