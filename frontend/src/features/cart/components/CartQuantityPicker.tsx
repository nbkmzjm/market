import { UserWhitespacable } from '@babel/types';
import React, { useState, ChangeEvent } from 'react';
import { CartItem, User } from '../../../models/model';
import useUser from '../../authen/hooks/useUser';
import { async } from 'q';
import CartAPI from '../services/CartAPI';
import useCart from '../hooks/useCart';

type QuantityPickerPropsType = {
   cartItem: CartItem;
};

function CartQuantityPicker({ cartItem }: QuantityPickerPropsType) {
   // State to hold the selected quantity and item ID
   const { productInStockCheck } = CartAPI();
   const { user } = useUser();
   const { dispatch, REDUCER_ACTIONS } = useCart();
   const [selectedValues, setSelectedValues] = useState({
      quantity: 1,
      itemId: cartItem.productId,
   });
   const quantityOptions = Array.from({ length: 20 }, (_, index) => index + 1);
   // Handler function to update the selected quantity and item ID
   const handleQuantityChange = async (
      event: ChangeEvent<HTMLSelectElement>
   ) => {
      const newQuantity = parseInt(event.target.value, 10);
      setSelectedValues({
         quantity: newQuantity,
         itemId: cartItem.productId,
      });

      if (user) {
         const inStock = await productInStockCheck(
            newQuantity,
            user.account.defaultSupplier.id,
            cartItem.productId
         );

         if (inStock) {
            console.log(user.account.accountId);
            dispatch({
               type: REDUCER_ACTIONS.EDIT_QUANTITY_CART_ITEM,
               payload: {
                  cartItem: cartItem,
                  quantity: newQuantity,
                  accountId: user ? user.account.accountId : null,
               },
            });
         }
      }
   };

   return (
      <div>
         <label htmlFor="quantity">Select Quantity:</label>

         <select value={cartItem.quantity} onChange={handleQuantityChange}>
            {quantityOptions.map((option) => (
               <option key={option} value={option}>
                  {option}
               </option>
            ))}
         </select>
      </div>
   );
}

export default CartQuantityPicker;
