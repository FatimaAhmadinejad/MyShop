import {useState,useEffect} from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import FromContainer from '../compontent/FromContainer.jsx'
import Loader from '../compontent/Loader.jsx'
import {useLoginMutation} from '../slices/userApiSlice.js'
import {setCredentials} from '../slices/authSlice.js'
import { toast} from 'react-toastify'

const LoginScreen = () => {
    const [email,SetEmail] = useState('');
    const [password,SetPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login,{isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect (() => {
        if(userInfo){
            navigate(redirect);

        }
    },[userInfo,redirect,navigate])

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await login({email,password}).unwrap();
            dispatch(setCredentials({...res,})); 
            navigate(redirect);
            toast.success('Sign in Successfully')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

  return (
    <FromContainer>
        <h1>Sign In</h1>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => SetEmail(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => SetPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
                Sign In
            </Button>

            {isLoading && <Loader/>}
        </Form>
        <Row className='py-3'>
            <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
            </Col>
        </Row>
    </FromContainer>
  )
}

export default LoginScreen