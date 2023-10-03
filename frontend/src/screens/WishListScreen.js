import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import { db } from '../config/firebase';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';
import { getError } from '../functions/utils';

export default function WishListScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  console.log('state', state);
  const accountId = state.userInfo.account.accountId;

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
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const addToCardHandler = async (product) => {
    console.log('adding to cart');
    console.log(product);

    const existItem = cart.cartItems.find(
      (x) => x.templateId === product.productId
    );

    console.log('existItem', existItem);

    //  const quantity = existItem ? existItem.quantity + 1 : 1;

    const q = query(
      collection(
        db,
        'accounts',
        state.userInfo.account.defaultSupplier.id,
        'accountProducts'
      ),
      where('productId', '==', product.productId)
    );

    const docSnap = await getDocs(q);
    console.log(state.userInfo.account.accountId);
    console.log(docSnap);

    if (docSnap.size > 0) {
      if (docSnap.docs[0].data().countInStock < product.quantity) {
        toast('Sorry. Product is out of stock');
        return;
      }
    } else {
      toast.error('Supplier do not carry this product');
    }

    ctxDispatch({
      type: 'CARD_ADD_ITEM',
      payload: { ...product, quantity: product.quantity },
    });
  };

  const removeItemHandler = (item) => {};

  console.log('products', products);
  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, 'accounts', accountId, 'orderList');
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const snapShot = await getDocs(collectionRef);
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
    fetchData();
  }, []);
  return (
    <div className="container">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox></MessageBox>
      ) : (
        <div>
          {' '}
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-4">Description</div>
                  <div className="col-2">Quantity</div>
                  <div className="col-2">Price</div>
                  <div className="col-2">Remove</div>
                  <div className="col-2">Cart</div>
                </div>
              </li>
              {products.map((product) => (
                <li className="list-group-item">
                  {' '}
                  <div className="row">
                    <div className="col-4">{product.name}</div>
                    <div className="col-2">{product.quantity}</div>
                    <div className="col-2">{product.price}</div>

                    <div className="col-2">
                      {' '}
                      <button
                        type="button"
                        className="btn btn-primary"
                        variant="light"
                        onClick={() => removeItemHandler(product)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="col-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        variant="light"
                        onClick={() => addToCardHandler(product)}
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>{' '}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
