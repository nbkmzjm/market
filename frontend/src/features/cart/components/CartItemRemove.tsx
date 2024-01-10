import React from 'react';
import { CartItem } from '../../../models/model';
import useCart from '../hooks/useCart';
import useUser from '../../authen/hooks/useUser';

type CartItemRemovePropsType = {
   cartItem: CartItem;
};

export default function CartItemRemove({ cartItem }: CartItemRemovePropsType) {
   const { user } = useUser();
   const { REDUCER_ACTIONS, dispatch } = useCart();
   const removeItem = () => {
      if (user) {
         dispatch({
            type: REDUCER_ACTIONS.REMOVE_CART_ITEM,
            payload: {
               cartItem: cartItem,
               accountId: user ? user.account.accountId : null,
               quantity: 1,
            },
         });
      }
   };

   return (
      <button className="btn btn-primary" onClick={removeItem}>
         <i className="fas fa-trash"></i>
      </button>
   );
}
