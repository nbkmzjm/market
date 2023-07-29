import React, { useEffect, useReducer, useState } from 'react';
import { Link, Route } from 'react-router-dom';
// import data from '../data';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../Product/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Auth, Authen } from '../components/Auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const reducer = (state, action) => {
   switch (action.type) {
      case 'FETCH_REQUEST':
         return { ...state, loading: true };
      case 'FETCH_SUCCESS':
         return { ...state, products: action.payload, loading: false };
      case 'FETCH_FAIL':
         return { ...state, error: action.payload, loading: false };
   }
};

export default function HomeScreen() {
   // const [products, setProducts] = useState([]);

   const [{ loading, error, products }, dispatch] = useReducer(
      logger(reducer),
      {
         products: [],
         loading: true,
         error: '',
      }
   );

   console.log('code run 1st');
   useEffect(() => {
      console.log('effect run');
      const fetchData = async () => {
         dispatch({ type: 'FETCH_REQUEST' });
         try {
            // const result = await axios.get('/api/products');
            const resultX = await getDocs(collection(db, 'product'));

            const result = resultX.docs.map((doc) => ({
               ...doc.data(),
               id: doc.id,
            }));

            console.log(result);
            dispatch({ type: 'FETCH_SUCCESS', payload: result });
         } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(error.message) });
         }

         // setProducts(result.data);
      };
      fetchData();
   }, []);
   return (
      <div>
         <h1>Procduct List</h1>
         {console.log('render')}
         {console.log('Productx', products)}
         <div className="products">
            {loading ? (
               <LoadingBox />
            ) : error ? (
               <MessageBox variant="danger">{error}</MessageBox>
            ) : (
               <Row>
                  {console.log('Productx', products)}
                  {products.map((product) => (
                     <Col
                        key={product.slug}
                        sm={6}
                        md={6}
                        lg={3}
                        className="mb-3"
                     >
                        {' '}
                        <Product product={product}></Product>
                     </Col>
                  ))}
               </Row>
            )}
         </div>
      </div>
   );
}
