import React from 'react';
import { auth, db } from '../../../config/firebase';
import {
   addDoc,
   collection,
   doc,
   getDocs,
   updateDoc,
} from 'firebase/firestore';
import { CartItem } from '../../../models/model';

export default function CartAPI() {
   const updateCart = async (cartItems: CartItem[], accountId: string) => {
      console.log('addCartItem');
      console.log('accountId', accountId);

      const cartFS: CartItem[] = [];
      const getFScart = async () => {
         const querySnap = await getDocs(
            collection(db, 'accounts', accountId, 'cart')
         );
         console.log(querySnap);
         querySnap.forEach(async (doc) => {
            console.log(doc.data());
            const cartItem = doc.data() as CartItem;
            cartItem.id = doc.id;
            cartFS.push(cartItem);
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
               } catch (error) {}
            } else {
               console.log('adding item', item);

               try {
                  const subCollectionRef = collection(
                     db,
                     'accounts',
                     accountId,
                     'cart'
                  );
                  await addDoc(subCollectionRef, item);
               } catch (error) {
                  console.log(error);
               }
            }
         }
      };
      await addCarttoFirestore();
   };

   return { updateCart };
}
