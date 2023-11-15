import {
   createContext,
   useContext,
   useReducer,
   useMemo,
   ReactElement,
} from 'react';
import { CartItem, User } from '../models/model';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { stat } from 'fs';
import CartAPI from '../features/cart/services/CartAPI';
import useUser from '../features/authen/hooks/useUser';

// import updateCart from

type CartStateType = {
   cartItems: CartItem[];
};

const initCartState: CartStateType = {
   cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') ?? '[]')
      : [],
};

const REDUCER_ACTION_TYPE = {
   ADD_CART_ITEM: 'ADD_CART_ITEM',
   REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
};

const { updateCart } = CartAPI();

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
   type: string;
   payload: { product?: CartItem; accountId?: string | null };
};

const reducer = (
   state: CartStateType,
   action: ReducerAction
): CartStateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.ADD_CART_ITEM: {
         console.log('Adding cart item');
         if (action.payload.product) {
            const newItem: CartItem = action.payload.product;
            const accountId = action.payload.accountId;

            console.log('action payload:', action.payload);

            const existItem = state.cartItems.find(
               (item) => item.productId === newItem.productId
            );
            console.log('existItem :', existItem);
            // if (existItem) {
            // const quantity: number = existItem
            //    ? existItem.quantity + newItem.quantity
            //    : newItem.quantity;
            //    console.log('new item:', newItem);
            //    console.log('new item quantity:', newItem.quantity);
            //    console.log('exist item quantity:', existItem.quantity);
            //    const updateQuantity = 900;
            //    console.log('update quantity:', updateQuantity);
            //    newItem.quantity = updateQuantity;

            //    updatedCartItems = state.cartItems.map((item) =>
            //       item.productId === existItem.productId ? newItem : item
            //    );
            // } else {
            console.log(newItem.quantity);
            newItem.quantity = existItem
               ? existItem.quantity + 1
               : newItem.quantity;
            const updatedCartItems: CartItem[] = existItem
               ? state.cartItems.map((item) =>
                    item.productId === existItem.productId ? newItem : item
                 )
               : [...state.cartItems, newItem];

            // }
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            console.log('accountId', accountId);
            updateCart(updatedCartItems, accountId);
            return { ...state, cartItems: updatedCartItems };
         } else {
            toast.error('action.payload is required');
         }
         return { ...state };
      }

      case REDUCER_ACTION_TYPE.REMOVE_CART_ITEM: {
         localStorage.removeItem('userInfo');
         localStorage.removeItem('shippingAddress');
         localStorage.removeItem('paymentMethodName');
         signOut(auth)
            .then(() => {
               toast('Signed Out Successfully');
               console.log(auth.currentUser);
            })
            .catch((err) => {
               toast.error(err);
            });
         return {
            ...state,
            userInfo: null,
         };
      }

      default:
         return state;
   }
};

const useCartContext = (initCartState: CartStateType) => {
   const [state, dispatch] = useReducer(reducer, initCartState);
   const cartItems = state.cartItems;
   const REDUCER_ACTIONS = useMemo(() => {
      return REDUCER_ACTION_TYPE;
   }, []);

   return { dispatch, REDUCER_ACTIONS, cartItems };
};

export type UseContextType = ReturnType<typeof useCartContext>;

const initCartContextState: UseContextType = {
   dispatch: () => {},
   REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
   cartItems: [],
};

export const CartContext = createContext<UseContextType>(initCartContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
   return (
      <CartContext.Provider value={useCartContext(initCartState)}>
         {children}
      </CartContext.Provider>
   );
};

export default function useCart(): UseContextType {
   return useContext(CartContext);
}
