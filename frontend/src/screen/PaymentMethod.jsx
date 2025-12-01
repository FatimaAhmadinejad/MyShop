import { useEffect, useState } from 'react';
import {Form,Button,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import CheckoutSteps from '../compontent/CheckoutSteps.jsx';
import FromContainer from '../compontent/FromContainer.jsx';
import {savePaymentMethod} from '../slices/cartSlice.js';

const PaymentMethod = () => {
    const [paymentMethod,setPaymentMethod] = useState('ZarinPal');
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder')
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart)
    const {shippingAddress} = cart;

    useEffect(() => {
        if(!shippingAddress){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

  return (
    <FromContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                <Form.Check
                type='radio'
                className='my-2'
                label='ZarinPal or Credit Card'
                id='ZarinPal'
                name='paymentMethod'
                value='ZarinPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                </Col>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Continue
            </Button>
        </Form>
    </FromContainer>
  )
}

export default PaymentMethod