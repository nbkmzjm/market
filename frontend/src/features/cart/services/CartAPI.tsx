import React from 'react';
import { auth, db } from '../../../config/firebase';
import {
   addDoc,
   collection,
   doc,
   getDocs,
   query,
   updateDoc,
   where,
} from 'firebase/firestore';
import { CartItem } from '../../../models/model';
import { toast } from 'react-toastify';

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

   const productInStockCheck = async (
      quantity: number,
      supplierAccountId: string,
      productId: string
   ): Promise<boolean> => {
      console.log(quantity, '', supplierAccountId, '', productId);
      try {
         const q = query(
            collection(db, 'accounts', supplierAccountId, 'accountProducts'),
            where('productId', '==', productId)
         );

         const docSnap = await getDocs(q);
         console.log(docSnap.size);

         if (docSnap.size === 1) {
            const countInStock = docSnap.docs[0].data().countInStock;

            if (countInStock < quantity) {
               toast.error('Sorry. Product is out of stock');
               return false;
            }
         } else if (docSnap.size === 0) {
            toast.error('Product is not found with provided Id');
            throw new Error('Product is not found with provided Id');
         } else {
            toast.error('Number of documents returned is incorrect');
            throw new Error('Number of documents returned is incorrect');
         }

         return true;
      } catch (error) {
         console.error('Error checking product stock:', error);
         toast.error('An error occurred while checking product stock');
         return false; // Consider returning true to indicate an error condition
      }
   };

   return { updateCart, productInStockCheck };
}
