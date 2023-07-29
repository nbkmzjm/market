import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
   order: { orderCreatedId: localStorage.getItem('orderDetailId') },
   cart: {
      cartItems: localStorage.getItem('cartItems')
         ? JSON.parse(localStorage.getItem('cartItems'))
         : [],
      shippingAddress: localStorage.getItem('shippingAddress')
         ? JSON.parse(localStorage.getItem('shippingAddress'))
         : {},
      paymentMethod: localStorage.getItem('paymentMethod')
         ? localStorage.getItem('paymentMethod')
         : '',
   },
   userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : '',
};

function reducer(state, action) {
   switch (action.type) {
      case 'CARD_ADD_ITEM':
         const newItem = action.payload;

         const existItem = state.cart.cartItems.find(
            (item) => item.id === newItem.id
         );

         const cartItems = existItem
            ? state.cart.cartItems.map((item) =>
                 item.id === existItem.id ? newItem : item
              )
            : [...state.cart.cartItems, newItem];
         localStorage.setItem('cartItems', JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };

      case 'CARD_REMOVE_ITEM': {
         const cartItems = state.cart.cartItems.filter(
            (item) => item.id !== action.payload.id
         );
         localStorage.setItem('cartItems', JSON.stringify(cartItems));
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case 'USER_SIGNIN': {
         return { ...state, userInfo: action.payload };
      }

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
         return {
            ...state,
            order: { orderCreatedId: action.payload },
         };
      }
      default:
         return state;
   }
}

export default function StoreProvider(props) {
   const [state, dispatch] = useReducer(reducer, initialState);
   const value = { state, dispatch };
   return <Store.Provider value={value}> {props.children}</Store.Provider>;
}
