import React from 'react';
import { Badge, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../../Store';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { toast } from 'react-toastify';
import useUser from '../../features/authen/hooks/useUser';
import useCart from '../../contexts/CartProvider';

export default function Header() {
   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { cart } = state;
   const { REDUCER_ACTIONS, dispatch, user } = useUser();
   const {
      dispatch: cartDispatch,
      REDUCER_ACTIONS: CART_ACTIONS,
      cartItems,
   } = useCart();

   const signOutHandler = () => dispatch({ type: REDUCER_ACTIONS.SIGN_OUT });

   return (
      <header>
         <Navbar bg="dark" variant="dark">
            <Container>
               <LinkContainer to="/">
                  <Navbar.Brand>MarketPlace</Navbar.Brand>
               </LinkContainer>
               <Nav className="me-auto">
                  <Link to="/dashboard" className="nav-link">
                     Dashboard
                  </Link>
                  <Link to="/test" className="nav-link">
                     Test
                  </Link>
                  <Link to="/cart" className="nav-link">
                     Cart
                     {cartItems.length > 0 && (
                        <Badge pill bg="danger">
                           {cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                     )}
                  </Link>
                  <Link to="/wishList" className="nav-link">
                     Wish List
                     {cartItems.length > 0 && (
                        <Badge pill bg="danger">
                           {cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                     )}
                  </Link>

                  {user ? (
                     <NavDropdown
                        title={user.displayName}
                        id="basic-nav-dropdown"
                     >
                        <LinkContainer to="/userProfile">
                           <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderHistory">
                           <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/productTemplate">
                           <NavDropdown.Item>Product Template</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/inventory">
                           <NavDropdown.Item>Inventory</NavDropdown.Item>
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
   );
}
