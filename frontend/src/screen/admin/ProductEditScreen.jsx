import {useState,useEffect} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import Message from '../../compontent/Message.jsx'
import Loader from '../../compontent/Loader.jsx'
import FormContainer from '../../compontent/FromContainer.jsx'
import {toast} from 'react-toastify'
import {useUpdateProductMutation,useGetProductDetailsQuery,useUploadProductImageMutation} from '../../slices/productsApiSlice.js'

const ProductEditScreen = () => {
  const {id:productId} = useParams();

  const [name,SetName] = useState('');
  const [price,SetPrice] = useState(0);
  const [image,SetImage] = useState('');
  const [brand,SetBrand] = useState('');
  const [category,SetCategory] = useState('');
  const [countInStock,SetCountInStock] = useState(0);
  const [description,SetDescription] = useState('');

  const {data:product,isLoading,refetch,error} = useGetProductDetailsQuery(productId);

  const [updateProduct,{isLoading:loadingUpdate}] = useUpdateProductMutation();

  const [uploadProductImage,{isLoading:loadingUpload}] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if(product){
      SetName(product.name);
      SetPrice(product.price);
      SetImage(product.image);
      SetBrand(product.brand);
      SetCategory(product.category);
      SetCountInStock(product.countInStock);
      SetDescription(product.description);
    }
  },[product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
   productId,
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description
    }
    const result = await updateProduct(updatedProduct);
    if(result.error){
      toast.error(result.error)
    }else {
      toast.success('Product Updated');
      navigate('/admin/productlist');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image',e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      SetImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return <>
  <Link to="/admin/productlist" className='btn btn-light my-3'>
  Go Back
  </Link>
  <FormContainer>
    <h1>Edit Product</h1>
    {loadingUpdate && <Loader/>}

    {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-2'>
          <Form.Label>Name</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter Name'
          value={name}
          onChange={(e) => SetName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='price' className='my-2'>
          <Form.Label>Price</Form.Label>
          <Form.Control
          type='number'
          placeholder='Enter Price'
          value={price}
          onChange={(e) => SetPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='image' className='my-2'>
          <Form.Label>Image</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter Image url'
          value={image}
          onChange={(e) => SetImage}
          ></Form.Control>
          <Form.Control
          type='file'
          label='Choose File'
          onChange={uploadFileHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='brand' className='my-2'>
          <Form.Label>Brand</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter Brand'
          value={brand}
          onChange={(e) => SetBrand(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='CountInStock' className='my-2'>
          <Form.Label>CountInStock</Form.Label>
          <Form.Control
          type='number'
          placeholder='Enter CountInStock'
          value={countInStock}
          onChange={(e) => SetCountInStock(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='Category' className='my-2'>
          <Form.Label>Category</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter Category'
          value={category}
          onChange={(e) => SetCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='Description' className='my-2'>
          <Form.Label>Description</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter Description'
          value={description}
          onChange={(e) => SetDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
        type='submit'
        variant='primary'
        className='my-2'>
          Update
        </Button>
      </Form>
    )}
  </FormContainer>
  </>
}

export default ProductEditScreen