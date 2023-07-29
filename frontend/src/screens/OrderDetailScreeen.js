import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import LoadingBox from '../components/LoadingBox';
import { getError } from '../utils';
import { db } from '../config/firebase';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
   switch (action.type) {
      case 'FETCH_REQUEST':
         return { ...state, loading: true };
      case 'FETCH_SUCCESS':
         return { ...state, loading: false, order: action.payload };
      case 'FETCH_FAIL':
         return {
            ...state,
            loading: false,
            error: action.payload,
         };
   }
};

export default function OrderDetailScreen() {
   const { state } = useContext(Store);

   //  const orderId = state.order.orderCreatedId;
   //  console.log(state);

   const params = useParams();

   const { Id: orderId } = params;
   console.log(orderId);

   const [{ error, loading, order }, dispatch] = useReducer(reducer, {
      loading: false,
      error: '',
      order: {},
   });

   useEffect(() => {
      console.log('effect');
      const fetchData = async () => {
         dispatch({ type: 'FETCH_REQUEST' });
         try {
            const querySnap = await getDoc(doc(db, 'order', orderId));

            if (querySnap.exists()) {
               const orderDetail = querySnap.data();
               console.log(orderDetail);

               const orderItems = [];
               const querySnapshot = await getDocs(
                  collection(db, 'order', orderId, 'orderItems')
               );
               querySnapshot.forEach((doc) => {
                  orderItems.push(doc.data());
                  console.log(doc.id, ' => ', doc.data());
               });
               orderDetail.items = orderItems;
               dispatch({ type: 'FETCH_SUCCESS', payload: orderDetail });

               console.log(orderDetail);
            } else {
               console.log('Order do not exist');
            }
         } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err.message) });

            console.log(err);
         }
      };

      fetchData();
   }, [order]);

   return (
      <div>
         {/* <Helmet>
            <title>Order Detial</title>
         </Helmet> */}
         <h1>Order Detail</h1>
         {console.log('render')}
         {console.log(order.orderTotal)}
         <div>
            {loading ? (
               <LoadingBox></LoadingBox>
            ) : error ? (
               <MessageBox>{error}</MessageBox>
            ) : (
               <Row>
                  {console.log(order, 'render div')}
                  Detail here: {order.orderTotal}
                  {/* {console.log(order.shippingAddress)} */}
                  {/* {order} */}
                  <Col md={8}>
                     <Card.Body>
                        <Card.Title>Shipping Information</Card.Title>
                        <Card.Text>
                           <strong>Name:</strong>
                           {order.shippingAddress != null ||
                           typeof order.shippingAddress != 'undefined'
                              ? order.shippingAddress.address
                              : ''}

                           {/* // Object.entries(order.shippingAddress).map(
                                //      ([key, value]) => (
                                //         <p key={key}>
                                //            XXXX:
                                //            {key}: {value}
                                //         </p>
                                //      )
                                //   ) */}
                        </Card.Text>
                     </Card.Body>
                  </Col>
                  <Col md={4}></Col>
               </Row>
            )}
         </div>
      </div>
   );
}
