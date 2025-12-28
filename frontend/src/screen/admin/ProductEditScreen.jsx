import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../../compontent/Message.jsx'
import Loader from '../../compontent/Loader.jsx'
import FormContainer from '../../compontent/FromContainer.jsx'
import { toast } from 'react-toastify'
import { BASE_URL } from "../../constents.js"
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice.js'

const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()

  // فرم state
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  // گرفتن جزئیات محصول
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId)

  // mutations
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation()
  const [uploadProductImage] = useUploadProductImageMutation()

  // پر کردن فرم
  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [product])

  // submit
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      await updateProduct({
        productId,
        name,
        price: Number(price),
        image,
        brand,
        category,
        countInStock: Number(countInStock),
        description,
      }).unwrap()

      toast.success('Product Updated')
      navigate('/admin/productlist')
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Something went wrong')
    }
  }

  // upload image
  const uploadFileHandler = async (e) => {
  const formData = new FormData()
  formData.append('image', e.target.files[0])

  try {
    const res = await uploadProductImage(formData).unwrap()

    // اگر لینک از Cloudinary شروع شده، BASE_URL اضافه نکن
    const imageUrl = res.image.startsWith('http') ? res.image : `${BASE_URL}${res.image}`
    setImage(imageUrl)

    toast.success(res.message)
  } catch (err) {
    toast.error(err?.data?.message || err.error || 'Something went wrong')
  }
}

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='price' className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control type='file' onChange={uploadFileHandler} />
            </Form.Group>

            <Form.Group controlId='brand' className='my-2'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='countInStock' className='my-2'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Count In Stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='category' className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen



