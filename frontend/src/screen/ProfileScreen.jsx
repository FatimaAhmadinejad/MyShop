import {useState,useEffect} from "react";
import {Table,Form,Button,Row,Col} from "react-bootstrap"
import {useDispatch,useSelector} from "react-redux"
import {toast} from "react-toastify"
import Message from "../compontent/Message.jsx"
import Loader from "../compontent/Loader.jsx"
import {useProfileMutation} from "../slices/userApiSlice.js"
import {setCredentials} from "../slices/authSlice.js"
import {useGetMyOrderQuery} from "../slices/orderApiSlice.js"
import {FaTimes} from "react-icons/fa"
import {LinkContainer} from "react-router-bootstrap"

const ProfileScreen = () => {
  const [name,SetName] = useState("");
  const [email,SetEmail] = useState("");
  const [password,SetPassword] = useState("");
  const [confirmPassword,SetConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const {userInfo} = useSelector((state) => state.auth);

  const [updateProfile,{isLoading:loadingUpdateProfile}] = useProfileMutation();

  const {data: orders,isLoading,error} = useGetMyOrderQuery();

  useEffect(() => {
    if(userInfo){
      SetName(userInfo.name);
      SetEmail(userInfo.email);
    }
  },[userInfo.name,userInfo.email]);

  const submitHandler = async(e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      toast.error('Password do not Match');
    }else {
      try {
        const res = await updateProfile({_id:userInfo._id,name,email,password}).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile updated successfully')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return <Row>
    <Col md={3}>
    <h2>User Profile</h2>

    <Form onSubmit={submitHandler}>
      <Form.Group controlId='name' className='my-2'>
        <Form.Label>Name</Form.Label>
        <Form.Control
        type='name'
        placeholder='Enter name'
        value={name}
        onChange={(e) => SetName(e.target.value)}></Form.Control>
      </Form.Group>

      <Form.Group controlId='email' className='my-2'>
        <Form.Label>Email Address</Form.Label>
        <Form.Control
        type='email'
        placeholder='Enter Email'
        value={email}
        onChange={(e) => SetEmail(e.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group controlId='password' className='my-2'>
        <Form.Label>Enter Password</Form.Label>
        <Form.Control
        type='password'
        placeholder='Enter Password'
        value={password}
        onChange={(e) => SetPassword(e.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group controlId='confirmPassword' className='my-2'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
        type='password'
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={(e) => SetConfirmPassword(e.target.value)}></Form.Control>
      </Form.Group>
      <Button type='submit' variant='primary' className='my-2'>
        Update
      </Button>
      {loadingUpdateProfile && <Loader/>}
    </Form>
    </Col>
    <Col md={9}>
    <h2>My Orders</h2>
    {isLoading ? <Loader/> : error? (<Message variant='danger'>
    {error?.data?.message || error.error}
    </Message>) : (
      <Table striped hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order}>
              <td>{order._id}</td>
              <td>{
              order.createdAt.substring(0,10)
              }</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  order.paidAt.substring(0,10)
                ) : (
                  <FaTimes style={{color: 'red'}}/>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  order.deliverAt.substring(0,10)
                ) : (
                  <FaTimes style={{color: 'red'}}/>
                )}
              </td>
              <td>
                <LinkContainer to={`/order/${order._id}`}>
                <Button className='btn-sm' variant='light'>
                  Details
                </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    </Col>
  </Row>
}

export default ProfileScreen