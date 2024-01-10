import { useContext, useState } from 'react';
import { Store } from '../../../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import MessageBox from '../../../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

import { CartItem, ProductType } from '../../../models/model';
import useCart from '../../../contexts/CartProvider';
import useUser from '../../authen/hooks/useUser';
import ProductAPI from '../../products/services/ProductsAPI';
import CartAPI from '../services/CartAPI';
import { async } from 'q';
import QuantityPicker from '../components/CartQuantityPicker';
import CartItemRemove from '../components/CartItemRemove';

export default function CartSceen() {
   const navigate = useNavigate();
   const { user } = useUser();
   const { cartItems } = useCart();

   const checkoutHandler = () => {
      if (!user) {
         navigate('/signin?redirect=/shipping');
      } else {
         navigate('/shipping');
      }
   };
   console.log('initCartState', cartItems);

   return (
      <div>
         <h1>Shopping Cart</h1>

         <Row>
            <Col md={8}>
               {cartItems.length === 0 ? (
                  <MessageBox>
                     Cart is empty. <Link to="/">Go Shopping</Link>
                  </MessageBox>
               ) : (
                  <ListGroup>
                     {cartItems.map((item: CartItem) => (
                        <ListGroup.Item key={item.productId}>
                           <Row className="align-items-center">
                              <Col md={1}>
                                 ∫{' '}
                                 <img
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid rounded img-thumbnail"
                                 ></img>
                                 {''}
                              </Col>
                              <Col md={4}>
                                 <Link
                                    to={`/product/${item.slug}~${item.accountId}`}
                                 >
                                    {item.name}
                                 </Link>
                              </Col>
                              <CartItemRemove cartItem={item}></CartItemRemove>
                              <Col>
                                 <QuantityPicker
                                    cartItem={item}
                                 ></QuantityPicker>
                              </Col>
                              <Col md={1}>${item.price}</Col>
                              <Col md={1}></Col>
                           </Row>
                        </ListGroup.Item>
                     ))}
                  </ListGroup>
               )}
            </Col>
            <Col md={4}>
               <Card>
                  <Card.Body>
                     <ListGroup variant="flush">
                        <ListGroup.Item>
                           <h3>
                              Subtotal : $
                              {cartItems.reduce(
                                 (a, c) => a + c.price * c.quantity,
                                 0
                              )}
                           </h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                           <div className="d-grid">
                              <Button
                                 type="button"
                                 variant="primary"
                                 onClick={() => checkoutHandler()}
                                 disabled={cartItems.length === 0}
                              >
                                 Checkout
                              </Button>
                           </div>
                        </ListGroup.Item>
                     </ListGroup>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </div>
   );
}

//q: What does SOLID stand for?
