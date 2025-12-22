import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FromContainer from '../compontent/FromContainer.jsx'
import Loader from '../compontent/Loader.jsx'
import { useRegisterMutation } from '../slices/userApiSlice.js'
import { setCredentials } from '../slices/authSlice.js'
import { toast } from 'react-toastify'

const RegisterScreen = () => {
  const [name, SetName] = useState('')
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [ConfirmPassword, SetConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== ConfirmPassword) {
      toast.error('Passwords do not match')
      return
    } else {
      try {
        const res = await register({ name, email, password }).unwrap()
        dispatch(setCredentials({ ...res }))
        navigate(redirect)
        toast.success('Sign Up Successfully')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <FromContainer>
      <h1>Sign Up</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => SetName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={ConfirmPassword}
            onChange={(e) => SetConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FromContainer>
  )
}

export default RegisterScreen
