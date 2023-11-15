import { createContext, useContext, useReducer } from 'react';
import { db } from './config/firebase';
import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDocs,
   query,
   setDoc,
   updateDoc,
   where,
} from 'firebase/firestore';
import { StoreState } from './models/model';

const initialState: StoreState = {
   order: { orderCreatedId: localStorage.getItem('orderDetailId') },
   cart: {
      cartItems: localStorage.getItem('cartItems')
         ? JSON.parse(localStorage.getItem('cartItems') ?? '[]')
         : [],
      shippingAddress: localStorage.getItem('shippingAddress')
         ? JSON.parse(localStorage.getItem('shippingAddress') ?? '{}')
         : {},
      paymentMethod: localStorage.getItem('paymentMethod')
         ? localStorage.getItem('paymentMethod')
         : '',
   },
   userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') ?? '{}')
      : {},
};

export const Store = createContext();

const updateFSCartItem = async (cartItems, accountId) => {
   console.log('addCartItem');

   const cartFS = [];
   const getFScart = async () => {
      const querySnap = await getDocs(
         collection(db, 'accounts', accountId, 'cart')
      );
      console.log(querySnap);
      querySnap.forEach(async (doc) => {
         console.log(doc.data());
         cartFS.push({
            productId: doc.data().productId,
            id: doc.id,
         });
      });
   };
   await getFScart();
   console.log('cartFS', cartFS);
   const addCarttoFirestore = async () => {
      for (const item of cartItems) {
         const filterItem = cartFS.filter(
            (cartItemFS) => cartItemFS.productId === item.productId
         );
         console.log(filterItem);
         if (filterItem.length > 0) {
            console.log('updating item', item);
            const updateItem = {
               ...item,
               quantity: item.quantity,
            };
            console.log(updateItem);
            try {
               const subCollectionRef = doc(
                  db,
                  'accounts',
                  accountId,
                  'cart',
                  filterItem[0].id
               );
               // const itemUpdateRef = doc(
               //    subCollectionRef,

               // );

               await updateDoc(subCollectionRef, updateItem);
            } catch (error) {
               console.log(error);
            }
         } else {
            const subCollectionRef = collection(
               db,
               'accounts',
               accountId,
               'cart'
            );
            await addDoc(subCollectionRef, item);
         }
      }
   };
   await addCarttoFirestore();
};
function reducer(state, action) {
   switch (action.type) {
      case 'CARD_ADD_ITEM':
         const newItem = action.payload;
         console.log('newItem', newItem);

         const existItem = state.cart.cartItems.find(
            (item) => item.productId === newItem.productId
         );
         console.log('existItem', existItem);

         const cartItems = existItem
            ? state.cart.cartItems.map((item) =>
                 item.productId === existItem.productId ? newItem : item
              )
            : [...state.cart.cartItems, newItem];
         console.log('cartItems', cartItems);

         updateFSCartItem(cartItems, state.userInfo.account.accountId);
         localStorage.setItem('cartItems', JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };

      case 'CARD_REMOVE_ITEM': {
         console.log('remove Item cart ');
         const cartItems = state.cart.cartItems.filter(
            (item) => item.id !== action.payload.id
         );
         const removeItemFS = async () => {
            try {
               const subCollectionRef = collection(
                  db,
                  'accounts',
                  state.userInfo.account.accountId,
                  'cart'
               );
               const q = query(
                  subCollectionRef,
                  where('productId', '==', action.payload.id)
               );

               // Execute the query and get a query snapshot
               const querySnapshot = await getDocs(q);
               console.log(querySnapshot);
               if (querySnapshot.size > 0) {
                  const itemToRemoveId = querySnapshot.docs[0].id;
                  console.log(itemToRemoveId);
                  const itemRef = doc(
                     db,
                     'accounts',
                     state.userInfo.account.accountId,
                     'cart',
                     itemToRemoveId
                  );
                  await deleteDoc(itemRef);
               }
            } catch (error) {
               console.log(error);
            }
         };
         removeItemFS();

         // updateFSCartItem(cartItems, state.userInfo.account.accountId);

         localStorage.setItem('cartItems', JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case 'USER_SIGNIN': {
         console.log('state: ', state.userInfo);
         console.log('payload: ', action.payload);
         return {
            ...state,
            userInfo: action.payload.user,
            cart: { ...state.cart, cartItems: action.payload.cart },
         };
      }
      case 'DEFAULT_SUPPLIER_CHANGE': {
         console.log('USER: ', action.payload.user);
         console.log('account: ', action.payload.account);
         return {
            ...state,
            userInfo: action.payload.user,
            // cart: { ...state.cart, cartItems: action.payload.cart },
         };
      }

      // case 'FETCH_CART': {
      //    localStorage.setItem('cartItems', JSON.stringify(action.payload));
      //    console.log('action.payload')
      //    return {
      //       ...state,
      //       // cart: { ...state.cart, cartItems: action.payload },
      //    };
      // }

      case 'USER_SIGNOUT':
         return {
            ...state,
            userInfo: null,
            cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
         };

      case 'SAVE_SHIPPING_ADDRESS':
         console.log(action.payload);
         localStorage.setItem(
            'shippingAddress',
            JSON.stringify(action.payload)
         );
         return {
            ...state,
            cart: {
               ...state.cart,
               shippingAddress: action.payload,
            },
         };

      case 'SAVE_PAYMENT_METHOD':
         return {
            ...state,
            cart: {
               ...state.cart,
               paymentMethod: action.payload,
            },
         };

      case 'ORDER_CREATED': {
         localStorage.setItem('orderDetailId', action.payload);
         localStorage.setItem('cartItems', []);

         const clearCart = async () => {
            const collectionRef = collection(
               db,
               'accounts',
               state.userInfo.account.accountId,
               'cart'
            );
            const snapshot = await getDocs(collectionRef);
            console.log(snapshot);
            if (snapshot.size > 0) {
               snapshot.forEach(async (doc) => {
                  console.log(doc.id);
                  await deleteDoc(doc.ref);
               });
            }
         };

         clearCart();

         return {
            ...state,
            order: { orderCreatedId: action.payload },
            cart: { ...state.cart, cartItems: [] },
         };
      }
      default:
         return state;
   }
}

interface props {
   children: JSX.Element | JSX.Element[];
}

export default function StoreProvider({ children }: props) {
   const [state, dispatch] = useReducer(reducer, initialState);
   const value = { state, dispatch };
   return <Store.Provider value={{ value }}> {children}</Store.Provider>;
}
