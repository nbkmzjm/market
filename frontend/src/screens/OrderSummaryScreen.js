import { Helmet } from 'react-helmet-async';
import CheckOutSteps from '../components/CheckOutSteps';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
   addDoc,
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   setDoc,
   where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import SupplierOptionMenu from '../components/SupplierOptionMenu';

export default function OrderSummnaryScreen() {
   const navigate = useNavigate();

   const reducer = (state, action) => {
      switch (action.type) {
         case 'CREATE_REQUEST':
            return { ...state, loading: true };
         case 'CREATE_SUCCESS':
            return { ...state, loading: false, order: action.payload };
         case 'CREATE_FAIL':
            return { ...state, loading: false, error: action.payload };
         default:
            return state;
      }
   };

   const [{ loading, error, order, supplierList }, dispatch] = useReducer(
      reducer,
      {
         loading: false,
         error: '',
      }
   );

   const defaultOption = {
      id: 'LNiEKE3i77Pa2xt1cT1AQtNSxpz2',

      displayName: 'Kim Tran',
      email: 'kimtran@mkplace.com',
      role: 'supplier',
   };

   const { state, dispatch: ctxDispatch } = useContext(Store);

   const { cart, userInfo } = state;
   const paymentMethod = cart.paymentMethod;
   const [suplier, setSupplier] = useState(defaultOption.id);
   const [supplierOption, setSupplierOption] = useState([]);

   const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
   cart.itemsPrice = round2(
      cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
   );

   cart.shippingCost = cart.itemsPrice < 100 ? round2(0) : round2(10);
   cart.itemsTax = round2(cart.itemsPrice * 0.15);
   cart.itemsTotal = cart.itemsPrice + cart.itemsTax + cart.shippingCost;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const q = query(
               collection(db, 'users'),
               where('role', '==', 'supplier')
            );
            const resultedArray = [];
            const querySnap = await getDocs(q);
            querySnap.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               console.log(doc.id, ' => ', doc.data());
               resultedArray.push({ id: doc.id, ...doc.data() });
            });
            console.log(resultedArray);
            setSupplierOption(resultedArray);
         } catch (error) {
            toast.error(error);
         }
      };
      fetchData();
      if (!paymentMethod) {
         navigate('/payment');
      }
   }, []);

   const selectedHandler = (e) => {
      setSupplier(e.target.value);
      console.log(e.target.value);
   };

   const placeOrderHandler = async () => {
      try {
         dispatch({ type: 'CREATE_REQUEST' });

         const data = {
            // orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            isPaid: false,
            isDelivered: false,
            userId: userInfo.uid,

            itemsPrice: cart.itemsPrice,
            orderTotal: cart.itemsTotal,
            Tax: cart.itemsTax,
            shippingCost: cart.shippingCost,
            supplier: suplier,
         };
         const docRef = await addDoc(collection(db, 'order'), data);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            // const result = docSnap.data();
            // result.id = docSnap.id;
            console.log(docSnap.id);

            const parentDocRef = doc(db, 'order', docSnap.id);
            const subDocRef = collection(parentDocRef, 'orderItems');
            try {
               const promises = cart.cartItems.map(async (item) => {
                  const newItem = doc(subDocRef, item.id);
                  console.log(item);

                  //ad item without ID
                  // const result = await addDoc(subDocRef, data)
                  // throw new Error('order item fail to added');
                  await setDoc(newItem, { ...item });
                  console.log('adding item');
               });

               await Promise.all(promises);
               console.log('All item added success');
               ctxDispatch({
                  type: 'ORDER_CREATED',
                  payload: docSnap.id,
               });
               navigate(`/orderDetail/${docSnap.id}`);
            } catch (error) {
               console.error('error occured during adding item', error);
            }
         }
      } catch (error) {
         // dispatch({ type: 'CREATE_FAIL', payload: error });
         toast.error(error);
         console.log(error);
      }
   };

   return (
      <div>
         <Helmet>
            <title>Order Summary</title>
         </Helmet>
         <CheckOutSteps step1 step2 step3></CheckOutSteps>
         <div className="mt-3">
            <h1> Order Summary</h1>
            <Row>
               <Col md={8}>
                  <Row>
                     <Card>
                        <Card.Body>
                           <Card.Title>Shipping Information</Card.Title>
                           <Card.Text>
                              <strong>Name: </strong>
                              {cart.shippingAddress.fullName} <br />
                              <strong>Shipping Address: </strong>
                              {cart.shippingAddress.address},{' '}
                              {cart.shippingAddress.city},{' '}
                              {cart.shippingAddress.postalCode},{' '}
                              {cart.shippingAddress.country}
                           </Card.Text>
                           <Link to="/shipping">Edit</Link>
                        </Card.Body>
                     </Card>
                  </Row>
                  <br />
                  <Row>
                     <Card>
                        <Card.Body>
                           <Card.Title>Payment Method</Card.Title>
                           <Card.Text>
                              <strong>Payment: </strong>
                              {cart.paymentMethod}
                           </Card.Text>
                           <Link to="/payment">Edit</Link>
                        </Card.Body>
                     </Card>
                  </Row>
                  <div className="row">
                     <Form.Group controlId="role" onChange={selectedHandler}>
                        <Form.Label>Select Supplier:</Form.Label>
                        {/* <Form.Select>
                           {supplierOption.map((option) => (
                              <option key={option.id} value={option.id}>
                                 {option.displayName}
                              </option>
                           ))}
                        </Form.Select> */}
                        <SupplierOptionMenu
                           selectedOption={defaultOption}
                           options={supplierOption}
                        />
                     </Form.Group>
                  </div>
                  <br />
                  <Row>
                     <Card className="mb-3">
                        <Card.Body>
                           <Card.Title>Items</Card.Title>
                           <ListGroup variant="flush">
                              {cart.cartItems.map((item) => (
                                 <ListGroup.Item key={item.id}>
                                    <Row className="align-items-center">
                                       <Col md={1}>
                                          <img
                                             src={item.image}
                                             alt={item.name}
                                             className="img-fluid rounded img-thumbnail"
                                          ></img>{' '}
                                       </Col>
                                       <Col md={5}>
                                          <Link to={`/product/${item.slug}`}>
                                             {item.name}
                                          </Link>
                                       </Col>

                                       <Col md={3}>{item.quantity}</Col>
                                       <Col md={3}>${item.price}</Col>
                                    </Row>
                                 </ListGroup.Item>
                              ))}
                           </ListGroup>
                        </Card.Body>
                     </Card>
                  </Row>
               </Col>

               <Col md={4}>
                  <Card>
                     <Card.Body>
                        <ListGroup variant="flush">
                           <h3>Order Summary</h3>
                           <ListGroup.Item>
                              Items: ${cart.itemsPrice}
                           </ListGroup.Item>
                           <ListGroup.Item>
                              Tax: ${cart.itemsTax}
                           </ListGroup.Item>
                           <ListGroup.Item>
                              Shipping Cost: ${cart.shippingCost}
                           </ListGroup.Item>
                           <ListGroup.Item>
                              Order Total: ${cart.itemsTotal}
                           </ListGroup.Item>
                           <ListGroup.Item>
                              <div className="d-grid">
                                 <Button
                                    onClick={placeOrderHandler}
                                    variant="primary"
                                 >
                                    Submit Order
                                 </Button>
                              </div>
                           </ListGroup.Item>
                        </ListGroup>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </div>
   );
}
