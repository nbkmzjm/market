import {
   createContext,
   useContext,
   useReducer,
   useMemo,
   ReactElement,
} from 'react';
import { User } from '../models/model';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

type UserStateType = {
   userInfo: User | null;
};

const initUserState: UserStateType = {
   userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') ?? 'null')
      : null,
};

const REDUCER_ACTION_TYPE = {
   SIGN_IN: 'SIGN_IN',
   SIGN_OUT: 'SIGN_OUT',
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
   type: string;
   payload?: User | null;
};

const reducer = (
   state: UserStateType,
   action: ReducerAction
): UserStateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.SIGN_IN: {
         console.log('state: ', state.userInfo);
         console.log('payload: ', action.payload);
         if (action.payload) {
            const user = action.payload;
            return {
               ...state,
               userInfo: user,
            };
         } else {
            toast.error('action.payload is required');
         }
         return state;
      }

      case REDUCER_ACTION_TYPE.SIGN_OUT: {
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

const useUserContext = (initUserState: UserStateType) => {
   const [state, dispatch] = useReducer(reducer, initUserState);
   const user = state.userInfo;
   const REDUCER_ACTIONS = useMemo(() => {
      return REDUCER_ACTION_TYPE;
   }, []);

   return { dispatch, REDUCER_ACTIONS, user };
};

export type UseUserContextType = ReturnType<typeof useUserContext>;

const initUserContextState: UseUserContextType = {
   dispatch: () => {},
   REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
   user: initUserState.userInfo,
};

export const UserContext =
   createContext<UseUserContextType>(initUserContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const UserProvider = ({ children }: ChildrenType): ReactElement => {
   return (
      <UserContext.Provider value={useUserContext(initUserState)}>
         {children}
      </UserContext.Provider>
   );
};
