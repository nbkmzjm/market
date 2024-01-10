import './App.css';
import './sass/App.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './features/home/pages/HomeScreen';
import ProductScreen from './features/products/pages/ProductScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import CartScreen from './features/cart/pages/CartScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderSummnaryScreen from './screens/OrderSummaryScreen';
import OrderDetailScreen from './screens/OrderDetailScreeen';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import DashboardScreen from './screens/DashboardScreen';
import ProductTemplateScreens from './features/products/pages/ProductTemplateScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import TestScreen from './screens/TestScreen';
import InventoryScreen from './screens/InventoryScreen';
import OrderHistoryScreen from './screens/OrderHistory/OrderHistoryScreen';
import WishListScreen from './screens/WishList/WishListScreen';
import Header from './screens/header';
import SignUpScreen from './features/authen/pages/SignUpScreen';
import SigninScreen from './features/authen/pages/SigninScreen';

function App() {
   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { cart, userInfo } = state;
   console.log('App.js');

   const content = (
      <>
         <ToastContainer position="bottom-center" limit={1} />
         <Header></Header>
         <main>
            <Container className="mt-3">
               <Routes>
                  <Route path="/" element={<HomeScreen />}></Route>
                  <Route path="/product/:slug" element={<ProductScreen />} />
                  <Route path="/test" element={<TestScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/wishList" element={<WishListScreen />} />
                  <Route
                     path="/orderHistory"
                     element={<OrderHistoryScreen />}
                  />
                  <Route path="/signin" element={<SigninScreen />} />
                  <Route path="/signup" element={<SignUpScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/dashboard" element={<DashboardScreen />} />
                  <Route path="/userProfile" element={<UserProfileScreen />} />

                  <Route path="/productEdit" element={<ProductEditScreen />} />

                  <Route path="/shipping" element={<ShippingAddressScreen />} />
                  <Route
                     path="/orderSummary"
                     element={<OrderSummnaryScreen />}
                  />
                  <Route
                     path="/productTemplate"
                     element={<ProductTemplateScreens />}
                  />
                  <Route path="/inventory" element={<InventoryScreen />} />
                  <Route
                     path="/orderDetail/:Id"
                     element={<OrderDetailScreen />}
                  />
               </Routes>
            </Container>
         </main>
         <footer className="text-center">All Right Resvered.</footer>
      </>
   );
   return content;

   // <div className="d-flex flex-column site-container"></div>;
}

export default App;
