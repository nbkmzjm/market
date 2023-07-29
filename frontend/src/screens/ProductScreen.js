import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useReducer, useEffect, useContext } from 'react';
import axios from 'axios';
import Rating from '../Product/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import {
   getDocs,
   collection,
   where,
   query,
   doc,
   getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
   switch (action.type) {
      case 'FETCH_REQUEST':
         return { ...state, loading: true, product: [] };
      case 'FETCH_SUCCESS':
         return { ...state, loading: false, product: action.payload };
      case 'FETCH_FAIL':
         return { ...state, loading: false, error: action.payload };
   }
};

export default function ProdcutScreen() {
   const navigate = useNavigate();
   const params = useParams();
   const { slug } = params;
   console.log(slug);

   const productRef = collection(db, 'product');

   const [{ loading, error, product }, dispatch] = useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
   });

   useEffect(() => {
      console.log('effect run');
      const fetchData = async () => {
         dispatch({ type: 'FETCH_REQUEST' });
         try {
            // const result = await axios.get(`/api/products/slug/${slug}`);

            const q = query(productRef, where('slug', '==', slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size === 1) {
               const result = querySnapshot.docs[0].data();
               result.id = querySnapshot.docs[0].id;
               console.log(result);
               console.log(querySnapshot.docs[0].id);
               dispatch({ type: 'FETCH_SUCCESS', payload: result });
            } else {
               console.log('no product found');
            }
         } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
         }
      };
      fetchData();
   }, [slug]);

   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { cart } = state;

   const addToCardHandler = async () => {
      console.log('cart');
      console.log(product);
      const existItem = cart.cartItems.find((x) => x.id === product.id);

      const quantity = existItem ? existItem.quantity + 1 : 1;
      const productRef = doc(db, 'product', product.id);
      // const { data } = await axios.get(`/api/products/${product._id}`);
      console.log(product);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
         if (docSnap.data().countInStock < quantity) {
            toast('Sorry. Product is out of stock');
            return;
         }
      } else {
         toast.error('No such document');
      }

      ctxDispatch({
         type: 'CARD_ADD_ITEM',
         payload: { ...product, quantity: quantity },
      });
      navigate('/cart');
   };

   return (
      <div>
         {console.log('render')}
         {console.log(product.name)}
         {loading ? (
            <LoadingBox />
         ) : error ? (
            <MessageBox variant="danger"> {error}</MessageBox>
         ) : (
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
                     {console.log(product, 'render')}
                     <ListGroup varirant="flush">
                        <ListGroup.Item>
                           <Helmet>
                              {console.log('product name: ', product.name)}
                              <title>{product.name}</title>
                           </Helmet>
                        </ListGroup.Item>
                        <ListGroup.Item>
                           <Rating
                              rating={product.rating}
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
                                    <Col>Statusx:</Col>
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
                                          Add to Card
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
         )}
         ;
      </div>
   );
}
