import {
   QuerySnapshot,
   collection,
   collectionGroup,
   doc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { db } from '../config/firebase';
import { collapseToast } from 'react-toastify';
import { Store } from '../Store';

export default function DashboardScreen() {
   const { state } = useContext(Store);
   const { userInfo } = state;

   console.log(userInfo.uid);

   useEffect(() => {
      const orderIds = [];
      const fetchData = async () => {
         const q = query(
            collection(db, 'order'),
            where('userId', '==', userInfo.uid)
         );
         const querySnapshot = await getDocs(q);
         querySnapshot.forEach(async (doc) => {
            orderIds.push(doc.id);
            const orderRef = collection(db, 'order');
            console.log(doc.id, '=>', doc.data());
            const orderItemsRef = collection(orderRef, doc.id, 'orderItems');
            const querySnapshot = await getDocs(orderItemsRef);
            querySnapshot.forEach((item) => {
               console.log(item.id, '=>', item.data());
            });
         });
      };
      //   fetchData();

      const fetchData3 = async () => {
         console.log('data3');
         const orderRef = collection(db, 'order', userInfo.uid, 'orderItems');
         const q = query(orderRef, where('brand', '==', 'TNS'));
         const querySnapshot = await getDocs(q);
         querySnapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data().orderItems);
         });
      };
      //   fetchData3();

      const fetchData2 = async () => {
         console.log('sdfsg');
         const TNS = query(
            collectionGroup(db, 'orderItems'),
            where('brand', '==', 'TNS')
         );
         const querySnapshot = await getDocs(TNS);
         querySnapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
         });
      };
      fetchData2();

      const fetchData4 = async () => {};
      fetchData4();
   }, []);
   return <div></div>;
}
