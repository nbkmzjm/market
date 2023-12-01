import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import { CartItem, ProductType } from '../models/model';
import useCart from '../contexts/CartProvider';
import useUser from '../features/authen/hooks/useUser';
import ProductAPI from '../features/products/services/ProductsAPI';
import CartAPI from '../features/cart/services/CartAPI';

export default function CartSceen() {
   const navigate = useNavigate();
   const { user } = useUser();
   const { cartItems, dispatch, REDUCER_ACTIONS } = useCart();
   const { fetchProductBySupplierId_Slug, loading, error } = ProductAPI();
   const { productInStockCheck } = CartAPI();
   const supplierAccountId = user.account.defaultSupplier.id;
   const updateCartHandler = async (product: ProductType, quantity: number) => {
      // const q = query(
      //    collection(db, 'accounts', ''),
      //    where('productId', '==', item.productId),
      //    where('supplierId', '==', userInfo.account.defaultSupplier.id)
      // );
      console.log('quantity clicked: ', quantity);
      if (product) {
         if (user) {
            const inStock = await productInStockCheck(
               quantity,
               user.account.defaultSupplier.id,
               product.productId
            );

            if (inStock) {
               console.log({ ...product });
               console.log({ ...product, quantity: 2 });
               console.log(user.account.accountId);
               dispatch({
                  type: REDUCER_ACTIONS.ADD_CART_ITEM,
                  payload: {
                     product: product,
                     quantity: quantity,
                     accountId: user ? user.account.accountId : null,
                  },
               });
            }
         }
      } else {
         console.log('Product is not loaded');
      }
   };

   const removeItemHandler = (item) => {
      ctxDispatch({
         type: 'CARD_REMOVE_ITEM',
         payload: item,
      });
   };

   const checkoutHandler = () => {
      if (!user) {
         navigate('/signin?redirect=/shipping');
      } else {
         navigate('/shipping');
      }
   };

   return (
      <div>
         <Helmet>
            <title>Shopping Cart</title>
         </Helmet>
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
                              <Col md={3}>
                                 <Button
                                    variant="light"
                                    onClick={() => {
                                       console.log('item clicked minus', item);
                                       updateCartHandler(
                                          item,
                                          item.quantity - 1
                                       );
                                    }}
                                    disabled={item.quantity === 1}
                                 >
                                    <i className="fas fa-minus-circle"></i>
                                 </Button>
                                 <span> {item.quantity}</span>
                                 <Button
                                    variant="light"
                                    onClick={() => {
                                       console.log('item clicked plus', item);
                                       updateCartHandler(
                                          item,
                                          item.quantity + 1
                                       );
                                    }}
                                 >
                                    <i className="fas fa-plus-circle"></i>
                                 </Button>
                              </Col>
                              <Col md={1}>${item.price}</Col>
                              <Col md={1}>
                                 <Button
                                    variant="light"
                                    onClick={() => removeItemHandler(item)}
                                 >
                                    <i className="fas fa-trash"></i>
                                 </Button>
                              </Col>
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
