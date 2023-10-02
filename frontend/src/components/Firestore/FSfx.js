import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useContext } from 'react';
import { Store } from '../../Store';
import { getError } from '../../functions/utils';
import { toast } from 'react-toastify';

export const getCartItems = async (cartItemID) => {
  const cartItems = [];
  const cartItemRef = collection(db, 'accounts', cartItemID, 'cart');
  const querySnapshot = await getDocs(cartItemRef);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((item) => {
      cartItems.push({ ...item.data() });
    });
  } else {
    console.log('Cart is empty');
  }

  return cartItems;
};

export const getAccountProducts = async (accountId, dispatch) => {
  // Get all the products from the account with accountId
  let products = [];
  dispatch({ type: 'FETCH_REQUEST' });
  try {
    const docSnap = await getDocs(
      collection(db, 'accounts', accountId, 'accountProducts')
    );
    if (docSnap.size > 0) {
      products = docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      dispatch({ type: 'FETCH_SUCCESS', payload: products });
    } else {
      throw new Error('Products in this account are not found');
    }
  } catch (error) {
    dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
    console.log(error);
  }
  return;
};

// export const getA
