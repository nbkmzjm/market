import { collection, getDocsFromCache } from 'firebase/firestore';
import React, { useContext, useEffect, useReducer } from 'react';
import { db } from '../config/firebase';
import { getError } from '../functions/utils';
import { Store } from '../Store';

export default function OrderHistoryScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  console.log('state', state);
  const accountId = state.userInfo.account.accountId;
  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, orders: [] };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, products: action.payload };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
    }
  };
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const collectionRef = collection(db, 'accounts', accountId, 'orderList');
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const snapShot = await getDocsFromCache(collectionRef);
        if (snapShot.size > 0) {
          const productData = snapShot.docs.map((product) => ({
            ...product.data(),
            id: product.id,
          }));
          console.log('productData', productData);
          dispatch({ type: 'FETCH_SUCCESS', payload: productData });
        } else {
          throw new Error('Cannot find product in wish list.');
        }
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
        console.log(error);
      }
    };
  });
  return <div>OrderHistoryScreen</div>;
}
