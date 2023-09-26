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

   const [{ loading, error, products }, dispatch] = useReducer(
      logger(reducer),
      {
         products: [],
         loading: true,
         error: '',
      }
   );
   const { state } = useContext(Store);
   //   const supplierAccountId = state.userInfo.account.defaultSupplier.id;
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
      console.log(state.userInfo);

      //Fetch all products from supplier account (not from consumer)
      const fetchAllProducts = async () => {
         console.log('fetch all products');
         dispatch({ type: 'FETCH_REQUEST' });
         try {
            const allProducts = [];
            const q = query(
               collection(db, 'accounts'),
               where('accountType', '==', 'supplier')
            );

            const supplierAccountSnap = await getDocs(q);
            for (const supplierAccount of supplierAccountSnap.docs) {
               console.log(supplierAccount);
               const subCollectionRef = collection(
                  db,
                  'accounts',
                  supplierAccount.id,
                  'accountProducts'
               );
               const accountProductsSupplier = await getDocs(subCollectionRef);
               console.log('accountProductsSupplier', accountProductsSupplier);
               accountProductsSupplier.forEach((doc) => {
                  console.log(doc.data());
                  allProducts.push({ ...doc.data(), id: doc.id });
               });
            }
            //combine all products from different suppliers and put price, accountId, stock and
            //cost in an array to display as multi vendor options
            const combinedProducts = allProducts.reduce(
               (acc, currentProduct) => {
                  const existingProduct = acc.find(
                     (product) => product.productId === currentProduct.productId
                  );
                  console.log('existingProduct', existingProduct);
                  const priceArray = [];
                  if (existingProduct) {
                     const stockArray = [];
                     const accountIdArray = [];
                     const costArray = [];
                     const minArray = [];
                     const maxArray = [];

                     priceArray.push(
                        existingProduct.price,
                        currentProduct.price
                     );
                     existingProduct.price = priceArray;
                     stockArray.push(
                        existingProduct.countInStock,
                        currentProduct.countInStock
                     );
                     existingProduct.countInStock = stockArray;
                  } else {
                     priceArray.push(currentProduct.price);
                     acc.push({
                        ...currentProduct,
                        price: priceArray,
                     });
                  }

                  return acc;
               },
               []
            );
            console.log('combinedProducts', combinedProducts);
            dispatch({ type: 'FETCH_SUCCESS', payload: combinedProducts });
         } catch (error) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            console.log(error);
         }
      };
      // if (state.userInfo !== null) {
      //    console.log('user exist');
      //    fetchProduct();
      // } else {
      //    console.log('user not exist');
      fetchAllProducts();
      // }
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
