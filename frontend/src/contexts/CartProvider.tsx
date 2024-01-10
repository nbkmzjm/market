import {
   createContext,
   useContext,
   useReducer,
   useMemo,
   ReactElement,
   useEffect,
   useState,
} from 'react';
import { CartItem, ProductType, User } from '../models/model';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { stat } from 'fs';
import CartAPI from '../features/cart/services/CartAPI';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import useUser from '../features/authen/hooks/useUser';

// import updateCart from

const REDUCER_ACTION_TYPE = {
   ADD_CART_ITEM: 'ADD_CART_ITEM',
   REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
   EDIT_QUANTITY_CART_ITEM: 'EDIT_QUANTITY_CART_ITEM',
};
type CartStateType = {
   cartItems: CartItem[];
};
const { updateCart } = CartAPI();

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
   type: string;
   payload: {
      cartItem: CartItem;
      accountId?: string | null;
      quantity: number;
   };
};

console.log('init carts variable');

const reducer = (
   state: CartStateType,
   action: ReducerAction
): CartStateType => {
   console.log('reducer state', state);
   console.log('reducer action', action);
   switch (action.type) {
      case REDUCER_ACTION_TYPE.ADD_CART_ITEM: {
         console.log('Adding cart item');
         if (action.payload.cartItem) {
            const accountId = action.payload.accountId;
            const quantity = action.payload.quantity;
            const cartItem = action.payload.cartItem;
            console.log('Account:', accountId);
            console.log('quantity', action.payload.quantity);

            console.log('product', action.payload.cartItem);

            let newItem: CartItem = {
               ...cartItem,
               quantity: quantity,
            };
            console.log('newItem', newItem);

            const existItem = state.cartItems.find(
               (item) => item.productId === newItem.productId
            );
            console.log('existItem :', existItem);
            if (existItem) {
               newItem.quantity = existItem.quantity + quantity;
            }

            const updatedCartItems: CartItem[] = existItem
               ? state.cartItems.map((item) =>
                    item.productId === existItem.productId ? newItem : item
                 )
               : [...state.cartItems, newItem];

            accountId && updateCart(updatedCartItems, accountId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return { ...state, cartItems: updatedCartItems };
         } else {
            toast.error('action.payload is required');
         }
         return { ...state };
      }
      case REDUCER_ACTION_TYPE.EDIT_QUANTITY_CART_ITEM: {
         console.log('Adding cart item');
         if (action.payload) {
            const accountId = action.payload.accountId;
            const quantity = action.payload.quantity;
            const cartItem = action.payload.cartItem;
            console.log('Account:', accountId);
            console.log('quantity', action.payload.quantity);

            console.log('product', action.payload.cartItem);

            let newItem: CartItem = {
               ...action.payload.cartItem,
               quantity: quantity,
            };
            console.log('newItem', newItem);

            const existItem = state.cartItems.find(
               (item) => item.productId === newItem.productId
            );
            console.log('existItem :', existItem);
            if (existItem) {
               newItem.quantity = quantity;
            }

            const updatedCartItems: CartItem[] = existItem
               ? state.cartItems.map((item) =>
                    item.productId === existItem.productId ? newItem : item
                 )
               : [...state.cartItems, newItem];

            accountId && updateCart(updatedCartItems, accountId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return { ...state, cartItems: updatedCartItems };
         } else {
            toast.error('action.payload is required');
         }
         return { ...state };
      }

      case REDUCER_ACTION_TYPE.REMOVE_CART_ITEM: {
         if (action.payload) {
            const accountId = action.payload.accountId;
            const removedItem = { ...action.payload.cartItem };
            const updatedCartItems: CartItem[] = state.cartItems.filter(
               (item) => item.productId !== removedItem.productId
            );
            console.log(updatedCartItems);
            accountId && updateCart(updatedCartItems, accountId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return {
               ...state,
               cartItems: updatedCartItems,
            };
         }

         return { ...state };
      }

      default:
         return state;
   }
};

const useCartContext = (initCartState: CartStateType) => {
   console.log('initCartState in use CartContext', initCartState);
   const [state, dispatch] = useReducer(reducer, initCartState);
   const cartItems = state.cartItems;
   console.log('state', state);
   console.log('cartItems', cartItems);

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
   const [cartItemsInit, setCartItemsInit] = useState<CartItem[]>([]);

   // const initCartState: CartStateType = {
   //    cartItems: cartItemsInit,
   // };

   const { user } = useUser();
   const initCartState: CartStateType = {
      cartItems: localStorage.getItem('cartItems')
         ? JSON.parse(localStorage.getItem('cartItems') ?? '[]')
         : [],
   };

   useEffect(() => {
      console.log('useEffect in cart provider');
      const fetchCartData = async () => {
         try {
            if (user.account && user.account.accountId) {
               const cartItemRef = collection(
                  db,
                  'accounts',
                  user.account.accountId,
                  'cart'
               );
               const querySnapshot = await getDocs(cartItemRef);

               const cartItemsData: CartItem[] = [];
               querySnapshot.forEach((item) => {
                  cartItemsData.push({ ...item.data() } as CartItem);
               });
               setCartItemsInit(cartItemsData);
               console.log('cartItemsData', cartItemsData);
               // initCartState.cartItems = cartItemsInit;
            }
         } catch (error) {
            console.error('Error fetching cart data:', error);
         }
      };

      if (user) {
         fetchCartData();
      }
   }, []);

   //q: Can cartItems be initialized from localStorage?  A: Yes, but it's not a good idea.
   // 1. If the user is not logged in, then the cartItems will be empty.
   // 2. If the user is logged in, then the cartItems will be fetched from the database.
   // 3. If the user is logged in, then the cartItems will be fetched from the database.
   //q: How do I fetched the cartItems from the database? A: Use useEffect() hook.
   // how to fetch cartItems from the database?
   // 1. fetch cartItems from the database
   // 2. set cartItems to the state
   // 3. update the cartItems in the localStorage
   //please implement the above steps in the useEffect() hook.
   // const initCartState: CartStateType = {
   //    cartItems: [],
   // };
   // can caritems be initialized from database wihout update the localStorage?  A: Yes, but it's not a good idea.

   console.log('initCartState', initCartState);

   return (
      <div>
         {console.log('render content')}
         <CartContext.Provider value={useCartContext(initCartState)}>
            {children}
         </CartContext.Provider>
      </div>
   );
};

export default function useCart(): UseContextType {
   return useContext(CartContext);
}
