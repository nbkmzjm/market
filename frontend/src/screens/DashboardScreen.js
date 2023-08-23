import {
   QuerySnapshot,
   collection,
   collectionGroup,
   doc,
   getDoc,
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

   async function getParentCollectionReference(documentPath) {
      console.log('doc path in side getParent:', documentPath);

      const documentRef = doc(db, documentPath);
      console.log('documentRef:', documentRef);
      const parentCollectionSnapshot = await getDoc(documentRef.parent);
      console.log('parentCollectionSnapshot:', parentCollectionSnapshot);
      const parentCollectionRef = parentCollectionSnapshot.ref;
      console.log('parentCollectionRef:', parentCollectionRef);

      return parentCollectionRef;
   }

   async function getDocumentsFromCollectionGroup() {
      // const querySnapshot = await getDocs(
      //    query(
      //       collectionGroup('yourCollectionGroupName'),
      //       where('field', '==', 'value')
      //    )
      // );
      const TNS = query(
         collectionGroup(db, 'orderItems'),
         where('brand', '==', 'TNS')
      );
      const querySnapshot = await getDocs(TNS);

      const documentsAndParents = [];

      for (const docSnapshot of querySnapshot.docs) {
         const documentPath = docSnapshot.ref.path;
         const parentCollectionRef = await getParentCollectionReference(
            documentPath
         );

         documentsAndParents.push({
            documentId: docSnapshot.id,
            data: docSnapshot.data(),
            parentCollectionRef: parentCollectionRef,
         });
      }

      return documentsAndParents;
   }

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
         console.log('parent:', querySnapshot.parent);
         querySnapshot.forEach(async (document) => {
            const parentCollection = document.id.split('/')[1];
            console.log(parentCollection);
            // console.log(document.id, '=>', document.data().parentCollection);
         });
      };
      // fetchData2();

      const fetchData4 = async () => {
         getDocumentsFromCollectionGroup().then((documentsAndParents) => {
            console.log(
               'Documents and their parent collection references:',
               documentsAndParents
            );
         });
      };
      fetchData4();
   }, []);
   return <div></div>;
}
