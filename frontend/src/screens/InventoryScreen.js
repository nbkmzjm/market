import React, { useContext, useEffect, useReducer, useState } from 'react';
import { getAccountProducts } from '../components/Firestore/FSfx';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
   collection,
   doc,
   getDocs,
   query,
   updateDoc,
   where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getError } from '../utils';

const reducer = (state, action) => {
   switch (action.type) {
      case 'FETCH_REQUEST':
         return { ...state, loading: true, products: [] };
      case 'FETCH_SUCCESS':
         return { ...state, loading: false, products: action.payload };
      case 'FETCH_FAIL':
         return { ...state, loading: false, error: action.payload };
   }
};

export default function InventoryScreen() {
   const { state } = useContext(Store);
   const supplierAccountId = state.userInfo.account.defaultSupplier.id;
   //  const { state } = useContext(Store);
   console.log(state);
   const accountId = state.userInfo.account.accountId;
   const [inventory, setInventory] = useState([]);

   const [{ loading, error, products }, dispatch] = useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
   });

   console.log('products', products);

   const handleMinChange = async (productId, event) => {
      let countInStock;
      console.log(event.target.value);
      if (isNaN(parseFloat(event.target.value))) {
         countInStock = 0;
      } else {
         countInStock = parseFloat(event.target.value);
      }
      console.log(productId);
      console.log(event);

      const updateInventory = products.map((product) => {
         if (product.id === productId) {
            if (countInStock < product.min) {
               //Order more items if stock below minimum
               console.log('please order more item:', product.name);
               const quantity = (product.max - countInStock) * 0.7;
               let orderListFS = [];
               const producttoUpdate = { ...product, quantity: quantity };
               const getFSOrderList = async () => {
                  try {
                     const q = query(
                        collection(db, 'accounts', accountId, 'orderList'),
                        where('productId', '==', product.productId)
                     );
                     const querySnapOderList = await getDocs(q);
                     if (querySnapOderList.size > 0) {
                        orderListFS = querySnapOderList.map((order) => order);
                     } else {
                        throw new Error('Can not find any item in order list');
                     }
                  } catch (error) {
                     dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
                  }
               };
            }
            return { ...product, [event.target.name]: countInStock };
         }
         return product;
      });
      console.log(updateInventory);

      const subcollectionRef = doc(
         db,
         'accounts',
         state.userInfo.account.accountId,
         'accountProducts',
         productId
      );
      try {
         await updateDoc(subcollectionRef, {
            [event.target.name]: countInStock,
         });
      } catch (error) {
         console.log(error);
      }

      dispatch({ type: 'FETCH_SUCCESS', payload: updateInventory });
   };

   useEffect(() => {
      const fetchProduct = async () => {
         await getAccountProducts(accountId, dispatch);
      };
      fetchProduct();
   }, []);

   return (
      <div className="container">
         {loading ? (
            <LoadingBox />
         ) : error ? (
            <MessageBox variant="danger"> {error}</MessageBox>
         ) : (
            <div>
               <div className="card-body">
                  <ul className="list-group list-group-flush">
                     <li key="inventory" className="list-group-item">
                        <div className="row">
                           <div className="col-4">Name</div>
                           <div className="col-2">Price</div>
                           <div className="col-2">Stock</div>
                           <div className="col-2">Min</div>
                           <div className="col-2">Max</div>
                        </div>
                     </li>
                     {products.map((product) => (
                        <li key={product.id} className="list-group-item">
                           <div className="row">
                              <div className="col-4">{product.name}</div>

                              <div className="col-2 mb-3">
                                 <input
                                    type="text"
                                    name="price"
                                    value={product.price}
                                    onChange={(event) => {
                                       handleMinChange(product.id, event);
                                    }}
                                    className="form-control"
                                 />
                              </div>
                              <div className="col-2 mb-3">
                                 <input
                                    type="text"
                                    name="countInStock"
                                    value={product.countInStock}
                                    onChange={(event) => {
                                       handleMinChange(product.id, event);
                                    }}
                                    className="form-control"
                                 />
                              </div>
                              <div className="col-2 mb-3">
                                 <input
                                    type="text"
                                    name="min"
                                    value={product.min}
                                    onChange={(event) => {
                                       handleMinChange(product.id, event);
                                    }}
                                    className="form-control"
                                 />
                              </div>
                              <div className="col-2 mb-3">
                                 <input
                                    type="text"
                                    name="max"
                                    value={product.max}
                                    onChange={(event) => {
                                       handleMinChange(product.id, event);
                                    }}
                                    className="form-control"
                                 />
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         )}
      </div>
   );
}
