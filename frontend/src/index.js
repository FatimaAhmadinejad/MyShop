import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import ProductListScreen from './screen/admin/ProductListScreen.jsx'
import { Provider } from 'react-redux';
import store from './store';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import HomeScreen from './screen/HomeScreen.jsx';
import CategoryScreen from './screen/CategoryScreen.jsx';
import ProductScreen from './screen/ProductScreen.jsx';
import CartScreen from './screen/CartScreen.jsx';
import LoginScreen from './screen/LoginScreen.jsx'
import RegisterScreen from './screen/RegisterScreen.jsx';
import ShippingAddress from './screen/ShippingAddress.jsx';
import PrivateRoutes from './compontent/PrivateRoutes.jsx';
import PaymentMethod from './screen/PaymentMethod.jsx';
import PlaceOrderScreen from './screen/PlaceOrderScreen.jsx';
import OrderScreen from './screen/OrderScreen.jsx';
import AdminRoute from './compontent/Admin/AdminRoute.jsx'
import OrderListScreen from './screen/admin/OrderListScreen.jsx';
import ProfileScreen from './screen/ProfileScreen.jsx';
import FilterScreen from './screen/FilterScreen.jsx';
import ProductEdit from './screen/admin/ProductEditScreen.jsx'
import UsersList from './screen/admin/UsersListScreen.jsx'
import {HelmetProvider} from 'react-helmet-async'
import { FastDom } from 'bskl';

const Dom = new FastDom
     const router = createBrowserRouter(
  createRoutesFromElements(
   <Route path='/' element={<App />}>
    <Route index={true} path='/' element={<HomeScreen />} />
    <Route path='/page/:pageNumber' element={<HomeScreen />} />
    <Route path='/search/:keyword' element={<HomeScreen />} />
    <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
    <Route path='/products/filter' element={<FilterScreen />} />
    <Route path="/category/:categoryName" element={<CategoryScreen />} />
    <Route path='/product/:id' element={<ProductScreen/>} />
    <Route path='/cart' element={<CartScreen/>} />
    <Route path='/login' element={<LoginScreen/>}/>
    <Route path='/register' element={<RegisterScreen/>}/>

    <Route path='' element={<PrivateRoutes/>}>
    <Route path='/shipping' element={<ShippingAddress/>}/>
    <Route path='/payment'  element={<PaymentMethod/>}/>
    <Route path='/placeorder' element={<PlaceOrderScreen/>}/>
    <Route path='/order/:id' element={<OrderScreen/>}/>
    <Route path='/profile' element={<ProfileScreen/>}/>
    </Route>

    <Route path='' element={<AdminRoute/>}>
    <Route path='/admin/orderList' element={<OrderListScreen/>}/>
    <Route path='/admin/Productlist' element={<ProductListScreen/>}/>
    <Route path='/admin/Productlist/:pageNumber' element={<ProductListScreen/>}/>
    <Route path='/admin/product/:id/edit' element={<ProductEdit/>}/>
    <Route path='/admin/userlist' element={<UsersList/>}/>
    </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(Dom.queryById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
reportWebVitals();