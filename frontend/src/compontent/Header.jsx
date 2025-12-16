import {useNavigate} from 'react-router-dom'
import { Badge,Navbar, Nav,Container, NavbarBrand, NavDropdown } from 'react-bootstrap';
import {FaShoppingCart,FaUser} from 'react-icons/fa';
import logo from '../assets/logo.png';
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector,useDispatch} from 'react-redux';
import {useLogoutMutation} from '../slices/userApiSlice.js'
import {logout} from '../slices/authSlice.js'
import SearchBox from '../compontent/SearchBox.jsx'
import { useGetCategoriesQuery } from '../slices/apiSlice';
import { Link } from 'react-router-dom';
import Filter from './Filter.jsx';

const Header = () => {
  const {cartItems} = useSelector((state) => state.cart);
  const {userInfo} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const[logoutApiCall] = useLogoutMutation();

  const logoutHandler = async() => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.log(err)
    }
  }
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  return (
    <header>
        <Navbar style={{ backgroundColor: '#1d361dff' }} variant="dark" expand="lg" collapseOnSelect>

        <Container>
        <Navbar.Brand href="/">
        <img src={logo} alt="MyShop" />
        MyShop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
             <SearchBox/>
             <Filter />
             <NavDropdown title="Categories" id="categories-dropdown">
                {isLoading && <NavDropdown.Item>Loading...</NavDropdown.Item>}
                {isError && <NavDropdown.Item className="text-danger">Error loading categories</NavDropdown.Item>}
                {categories && categories.map((cat,index) => (
               <LinkContainer key={index} to={`/category/${cat}`}>
               <NavDropdown.Item>{cat}</NavDropdown.Item>
               </LinkContainer>
             ))}
           </NavDropdown>
              <Nav.Link href="/cart">
              <FaShoppingCart/> Cart
                {
                  cartItems.length > 0 && (
                    <Badge pill bg='success' style={{marginLeft: '5px'}}>
                      {cartItems.reduce((a, c) => a + c.qty, 0 )}
                    </Badge>
                  )
                 }
                 </Nav.Link>
                 {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                 ):(<Nav.Link href="/login"><FaUser/>Sign in</Nav.Link>)}
                 {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Admin Work' id='adminmenu'>
                    <LinkContainer to='/admin/Productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                 )}
            </Nav>
        </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
  )
}

export default Header