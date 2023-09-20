import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
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

               //getting order items from top level collection
               const supCollectionRef = collection(
                  db,
                  'order',
                  orderId,
                  'orderItems'
               );

               try {
                  const querySnapshot = await getDocs(supCollectionRef);
                  if (querySnapshot.size > 0) {
                     querySnapshot.forEach((doc) => {
                        orderItems.push(doc.data());
                        console.log(doc.id, ' => ', doc.data());
                     });
                  }
                  orderDetail.items = orderItems;
                  dispatch({ type: 'FETCH_SUCCESS', payload: orderDetail });
                  console.log(orderDetail);
               } catch (error) {
                  console.log('Can not fetch items for this order:', error);
               }

               //geting order items from subcollection
               // const querySnapshot = await getDocs(
               //    collection(db, 'order', orderId, 'orderItems')
               // );
            } else {
               console.log('Order do not exist');
            }
         } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err.message) });

            console.log(err);
         }
      };

      fetchData();
   }, []);

   return (
      <div>
         {/* <Helmet>
            <title>Order Detial</title>
         </Helmet> */}
         <h1>Order Detail</h1>
         {console.log('render')}
         {console.log(order)}

         <div>
            {loading ? (
               <LoadingBox></LoadingBox>
            ) : error ? (
               <MessageBox>{error}</MessageBox>
            ) : (
               <div>
                  <div className="row">
                     <div className="col-4">
                        <div className="card">
                           <div className="card-body">
                              <div className="card-title">
                                 <h5>Shipping Information</h5>
                              </div>
                              {order.shippingAddress && (
                                 <div className="card-text">
                                    {' '}
                                    <p>
                                       {order.shippingAddress.fullName.toUpperCase()}
                                       <br />
                                       {order.shippingAddress.address}
                                       <br />
                                       {order.shippingAddress.city}{' '}
                                       {order.shippingAddress.stateAdd}{' '}
                                       {order.shippingAddress.postalCode}{' '}
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="col-4">
                        <div className="card">
                           <div className="card-body">
                              <div className="card-title">
                                 <h5>Payment Information</h5>
                              </div>
                              {order.shippingAddress && (
                                 <div className="card-text">
                                    <p>Payment Method: {order.paymentMethod}</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="col-4">
                        <div className="card">
                           <div className="card-body">
                              <div className="card-title">
                                 <h5>Order Summary</h5>
                              </div>
                              <div className="card-text">
                                 <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                       Sub Total: ${order.itemsPrice}
                                    </li>
                                    <li className="list-group-item">
                                       Tax: ${order.tax}
                                    </li>
                                    <li className="list-group-item">
                                       Shipping Cost: ${order.shippingCost}
                                    </li>
                                    <li className="list-group-item">
                                       <strong>
                                          {' '}
                                          Order Total: ${order.orderTotal}
                                       </strong>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <row>
                     <div className="col-12 mt-3">
                        <div className="card">
                           {' '}
                           <div className="card-header">
                              <h5 class="">Order Summary</h5>
                           </div>
                           <div className="card-body">
                              <ul className="list-group list-group-flush">
                                 <li className="list-group-item">
                                    <div className="row">
                                       <div className="col-3"></div>
                                       <div className="col-5">Product</div>
                                       <div className="col-2">Quantity</div>
                                       <div className="col-2">Total Price</div>
                                    </div>
                                 </li>
                                 {order.items &&
                                    order.items.map((item) => (
                                       <li
                                          key={item.id}
                                          className="list-group-item"
                                       >
                                          <div className="row">
                                             <div className="col-2">
                                                <img
                                                   src={item.image}
                                                   alt={item.name}
                                                   height="100"
                                                   width="100"
                                                   className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                             </div>
                                             <div className="col-6">
                                                <Link
                                                   to={`/product/${item.slug}`}
                                                >
                                                   {item.name}
                                                </Link>
                                             </div>
                                             <div className="col-2">
                                                {item.quantity}
                                             </div>
                                             <div className="col-2">
                                                ${item.price}
                                             </div>
                                          </div>
                                       </li>
                                    ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                  </row>
               </div>
            )}
         </div>
      </div>
   );
}
