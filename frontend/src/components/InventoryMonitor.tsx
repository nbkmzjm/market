import {
   addDoc,
   collection,
   doc,
   getDocs,
   onSnapshot,
   query,
   snapshotEqual,
   updateDoc,
   where,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { Store } from '../Store';
import { roundNumber } from '../functions/calculation';

export default function InventoryMonitor() {
   const { state } = useContext(Store);
   console.log('state:', state.userInfo.account.accountId);
   const accountId = state.userInfo.account.accountId;
   const [item, setItem] = useState([]);
   console.log('item:', item);

   useEffect(() => {
      const inventoryRef = collection(
         db,
         'accounts',
         accountId,
         'accountProducts'
      );

      const unsubscribe = onSnapshot(inventoryRef, (querySnapshot) => {
         console.log('querySnapshot:', querySnapshot.docChanges());

         // const changes = [];
         // querySnapshot.forEach((doc) => {
         //    changes.push(doc.data());
         //    console.log('changes:', doc.type);
         // });

         // console.log('changes:', changes);

         querySnapshot.docChanges().forEach((change) => {
            console.log(change.type);
            if (change.type === 'modified') {
               // Handle the case when an item's inventory is modified (decreased)
               let updatedProduct = change.doc.data();
               setItem(updatedProduct);

               if (updatedProduct.countInStock < updatedProduct.min) {
                  const quantity = roundNumber(
                     (updatedProduct.max - updatedProduct.countInStock) * 0.5,
                     0
                  );
                  updatedProduct = { ...updatedProduct, quantity: quantity };
                  console.log('updated product:', updatedProduct);
                  const updateOrderList = async () => {
                     try {
                        const q = query(
                           collection(db, 'accounts', accountId, 'orderList'),
                           where('productId', '==', updatedProduct.productId)
                        );
                        const querySnapOderList = await getDocs(q);
                        console.log('snap order list:', querySnapOderList.size);
                        if (querySnapOderList.size > 0) {
                           const exitedProductId = querySnapOderList.docs[0].id;
                           console.log('exitedProductId:', exitedProductId);
                           const updateProductRef = doc(
                              db,
                              'accounts',
                              accountId,
                              'orderList',
                              exitedProductId
                           );
                           await updateDoc(updateProductRef, updatedProduct);
                        } else {
                           console.log('added');
                           const collectionRef = collection(
                              db,
                              'accounts',
                              accountId,
                              'orderList'
                           );

                           await addDoc(collectionRef, updatedProduct);
                        }
                     } catch (error) {
                        console.log(error);
                     }
                  };
                  updateOrderList();
               }
               // onInventoryUpdate();

               // Check if you need to reorder items based on some condition
               //   if (itemData.quantity <= reorderThreshold) {
               //     // Call a function to place an order for more items
               //     placeOrder(itemData.itemId);
               //   }
            }
         });
      });
      return () => unsubscribe();
   }, []);
   return (
      <div>
         InventoryMonitor:x
         {item && <p> {item.countInStock}</p>}
      </div>
   );
}
