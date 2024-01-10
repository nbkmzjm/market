import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useReducer, useEffect, useContext, useState } from 'react';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../../components/LoadingBox';
import MessageBox from '../../../components/MessageBox';

import { Store } from '../../../Store';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { toast } from 'react-toastify';
import { getError } from '../../../functions/utils';
import ProductAPI from '../services/ProductsAPI';
import { ProductType } from '../../../models/model';
import useUser from '../../authen/hooks/useUser';
import useCart from '../../cart/hooks/useCart';
import CartAPI from '../../cart/services/CartAPI';

export default function ProductScreen() {
   const navigate = useNavigate();
   const params = useParams();
   const { slug } = params;
   const slugArray = slug.split('~');
   const productSlug = slugArray[0];
   const supplierAccountId = slugArray[1];

   const [product, setProducts] = useState<ProductType | null>(null);

   const { fetchProductBySupplierId_Slug, loading, error } = ProductAPI();

   const { cartItems, dispatch, REDUCER_ACTIONS } = useCart();
   const { productInStockCheck } = CartAPI();
   const { user } = useUser();

   const quantity: number = 1;

   useEffect(() => {
      fetchProductBySupplierId_Slug(supplierAccountId, productSlug).then(
         (product) => {
            setProducts(product);
         }
      );
   }, [productSlug]);

   const addToCardHandler = async () => {
      console.log(product);
      if (product) {
         const inStock = await productInStockCheck(
            quantity,
            supplierAccountId,
            product.productId
         );
         if (inStock) {
            dispatch({
               type: REDUCER_ACTIONS.ADD_CART_ITEM,
               payload: {
                  cartItem: { ...product, quantity: quantity },
                  accountId: user ? user.account.accountId : null,
                  quantity: quantity,
               },
            });
         }
      }

      navigate('/cart');
   };

   return (
      <div>
         {loading ? (
            <LoadingBox />
         ) : error ? (
            <MessageBox variant="danger"> {error}</MessageBox>
         ) : product ? (
            <div>
               <Row>
                  <Col md={6}>
                     <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                     />
                  </Col>

                  <Col md={3}>
                     <ListGroup variant="flush">
                        <ListGroup.Item>
                           <Helmet>
                              <title>{product.name}</title>
                           </Helmet>
                        </ListGroup.Item>
                        <ListGroup.Item>
                           <Rating
                              rating={product.ratings}
                              numReviews={product.numReviews}
                           ></Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>
                           Price : ${product.price}
                        </ListGroup.Item>
                     </ListGroup>
                  </Col>

                  <Col md={3}>
                     <Card>
                        <Card.Body>
                           <ListGroup variant="flush">
                              <ListGroup.Item>
                                 <Row>
                                    <Col>Price:</Col>
                                    <Col>${product.price}</Col>
                                 </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                 <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                       {product.countInStock > 0 ? (
                                          <Badge bg="success">In Stock</Badge>
                                       ) : (
                                          <Badge bg="danger">
                                             Out Of Stock
                                          </Badge>
                                       )}
                                    </Col>
                                 </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                 {product.countInStock > 0 && (
                                    <div className="d-grid">
                                       <Button
                                          onClick={addToCardHandler}
                                          variant="primary"
                                       >
                                          Add Card
                                       </Button>
                                    </div>
                                 )}
                              </ListGroup.Item>
                           </ListGroup>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </div>
         ) : (
            <div>No product found.</div>
         )}
         ;
      </div>
   );
}
