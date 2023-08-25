import './App.css';
import './sass/App.scss';
import Product from './Product/Product.js';
import data from './data';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
   BrowserRouter,
   Link,
   Route,
   Routes,
   useNavigate,
} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import CartScreen from './screens/CartScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { createAction } from '@reduxjs/toolkit';
import { useContext } from 'react';
import { Store } from './Store';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderSummnaryScreen from './screens/OrderSummaryScreen';
import OrderDetailScreen from './screens/OrderDetailScreeen';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import DashboardScreen from './screens/DashboardScreen';
import ProductTemplateScreens from './screens/ProductTemplateScreen';

function App() {
   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { cart, userInfo } = state;

   const signOutHandler = () => {
      ctxDispatch({ type: 'USER_SIGNOUT' });
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethodName');
      signOut(auth)
         .then(() => {
            toast('Signed Out Successfully');
            console.log(auth.currentUser);
         })
         .catch((err) => {
            toast.error(err);
         });
   };
   return (
      <BrowserRouter>
         <div className="d-flex flex-column site-container">
            <ToastContainer position="bottom-center" limit={1} />
            <header>
               {console.log(auth.currentUser)}
               <Navbar bg="dark" variant="dark">
                  <Container>
                     <LinkContainer to="/">
                        <Navbar.Brand>MarketPlace</Navbar.Brand>
                     </LinkContainer>
                     <Nav className="me-auto">
                        <Link to="/dashboard" className="nav-link">
                           Dashboard
                        </Link>
                        <Link to="/cart" className="nav-link">
                           Cart
                           {cart.cartItems.length > 0 && (
                              <Badge pill bg="danger">
                                 {cart.cartItems.reduce(
                                    (a, c) => a + c.quantity,
                                    0
                                 )}
                              </Badge>
                           )}
                        </Link>

                        {userInfo ? (
                           <NavDropdown
                              title={userInfo.displayName}
                              id="basic-nav-dropdown"
                           >
                              <LinkContainer to="/profile">
                                 <NavDropdown.Item>
                                    User Profile
                                 </NavDropdown.Item>
                              </LinkContainer>
                              <LinkContainer to="/orderhistory">
                                 <NavDropdown.Item>
                                    Order History
                                 </NavDropdown.Item>
                              </LinkContainer>
                              <LinkContainer to="/productTemplate">
                                 <NavDropdown.Item>
                                    Product Template
                                 </NavDropdown.Item>
                              </LinkContainer>
                              <NavDropdown.Divider />
                              <Link
                                 className="dropdown-item"
                                 onClick={signOutHandler}
                                 to="/"
                              >
                                 Sign Out
                              </Link>
                           </NavDropdown>
                        ) : (
                           <Link className="nav-link" to="/signin">
                              Sign In
                           </Link>
                        )}
                     </Nav>
                  </Container>
               </Navbar>
            </header>
            <main>
               <Container className="mt-3">
                  <Routes>
                     <Route path="/" element={<HomeScreen />}></Route>
                     <Route path="/product/:slug" element={<ProductScreen />} />
                     <Route path="/cart" element={<CartScreen />} />
                     <Route path="/signin" element={<SigninScreen />} />
                     <Route path="/signup" element={<SignupScreen />} />
                     <Route path="/payment" element={<PaymentScreen />} />
                     <Route path="/dashboard" element={<DashboardScreen />} />
                     <Route
                        path="/productEdit"
                        element={<ProductEditScreen />}
                     />

                     <Route
                        path="/shipping"
                        element={<ShippingAddressScreen />}
                     />
                     <Route
                        path="/orderSummary"
                        element={<OrderSummnaryScreen />}
                     />
                     <Route
                        path="/productTemplate"
                        element={<ProductTemplateScreens />}
                     />
                     <Route
                        path="/orderDetail/:Id"
                        element={<OrderDetailScreen />}
                     />
                  </Routes>
               </Container>
            </main>
            <footer className="text-center">All Right Resvered.</footer>
         </div>
      </BrowserRouter>
   );
}

export default App;
