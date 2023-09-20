import React, { useContext, useEffect, useReducer, useState } from 'react';
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
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import context from 'react-bootstrap/esm/AccordionContext';
import { Store } from '../Store';
import { getAccountProducts } from '../components/Firestore/FSfx';

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
   const [productx, setProductx] = useState([]);
   const [{ loading, error, products }, dispatch] = useReducer(
      logger(reducer),
      {
         products: [],
         loading: true,
         error: '',
      }
   );
   const { state } = useContext(Store);
   console.log('user', state.userInfo);

   console.log('code run 1st');
   useEffect(() => {
      console.log('effect run');
      const fetchProduct = async () => {
         console.log('fetch product');
         await getAccountProducts(
            state.userInfo.account.defaultSupplier.id,
            dispatch
         );
      };
      fetchProduct();
   }, []);
   return (
      <div>
         <h1>Procduct List</h1>
         {console.log('render')}
         <div className="products">
            {loading ? (
               <LoadingBox />
            ) : error ? (
               <MessageBox variant="danger">{error}</MessageBox>
            ) : (
               <Row>
                  {console.log('Productx', productx)}
                  {products.map((product) => (
                     <Col
                        key={product.slug}
                        sm={6}
                        md={6}
                        lg={3}
                        className="mb-3"
                     >
                        <Product product={product}></Product>
                     </Col>
                  ))}
               </Row>
            )}
         </div>
      </div>
   );
}
