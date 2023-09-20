import React, { useContext, useEffect, useReducer } from 'react';
import { getAccountProducts } from '../components/Firestore/FSfx';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

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

export default function InventoryScreen() {
   const { state } = useContext(Store);
   const supplierAccountId = state.userInfo.account.defaultSupplier.id;
   //  const { state } = useContext(Store);
   console.log(state);
   const accountId = state.userInfo.account.accountId;

   const [{ loading, error, product }, dispatch] = useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
   });

   console.log(product);

   useEffect(() => {
      const fetchProduct = async () => {
         await getAccountProducts(accountId, dispatch);
      };
      fetchProduct();
   }, []);

   return (
      <div>
         {loading ? (
            <LoadingBox />
         ) : error ? (
            <MessageBox variant="danger"> {error}</MessageBox>
         ) : (
            <div className="container">
               <div className="row">
                  <div className="col-4">Description</div>
                  <div className="col-2">Price</div>
                  <div className="col-2">Stock</div>
                  <div className="col-2">Order Level</div>
                  <div className="col-2">Full Level</div>
               </div>
            </div>
         )}
      </div>
   );
}
