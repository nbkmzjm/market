import { collection, onSnapshot, snapshotEqual } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { Store } from '../Store';

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
               const itemData = change.doc.data();
               setItem(itemData);
               // onInventoryUpdate();
               console.log('itemData:', itemData);

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
         {console.log('itemx:', item.countInStock)}
         {item && <p> {item.countInStock}</p>}
      </div>
   );
}
