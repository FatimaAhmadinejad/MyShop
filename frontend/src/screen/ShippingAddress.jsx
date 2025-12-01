import { useState } from 'react';
import {Form,Button} from 'react-bootstrap';
import FromContainer from '../compontent/FromContainer.jsx'
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {saveShippingAddress} from '../slices/cartSlice.js'
import CheckoutSteps from '../compontent/CheckoutSteps.jsx';

const ShippingAddress = () => {
  const cart = useSelector((state) => state.cart);
    const {shippingAddress} = cart;
    const [address,SetAddress] = useState(shippingAddress?.address || '')
    const [city,SetCity]= useState(shippingAddress?.city || '');
    const [postalCode,SetPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country,SetCountry] = useState(shippingAddress?.country || '');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
      e.preventDefault();
      dispatch(saveShippingAddress({address,city,postalCode,country}));
      navigate('/payment');
    }
  return (
    <FromContainer>
      <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control type='text'
           placeholder='Enter Address'
            value={address}
           onChange={(e) => SetAddress(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control type='text'
           placeholder='Enter city'
            value={city}
           onChange={(e) => SetCity(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control type='text'
           placeholder='Enter postalCode'
            value={postalCode}
           onChange={(e) => SetPostalCode(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control type='text'
           placeholder='Enter Country'
            value={country}
           onChange={(e) => SetCountry(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FromContainer>
  )
}

export default ShippingAddress