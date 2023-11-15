import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
   getFirestore,
   collection,
   addDoc,
   doc,
   getDoc,
} from 'firebase/firestore';
import { User } from '../../../models/model';
import { db } from '../../../config/firebase';

// Define the User interface

// Custom hook for adding a user
const useAddAdminUser = async (userData: User) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const addUser = async (userData: User) => {
      try {
         setLoading(true);
         const userRef = await addDoc(collection(db, 'users'), userData);
         setLoading(false);
         return userRef.id;
      } catch (err) {
         setError(err as Error);
         setLoading(false);
         throw err;
      }
   };

   return { addUser, loading, error };
};

// Custom hook for fetching a user
export default function UserAPI() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const fetchUser = async (userId: string): Promise<User | null> => {
      try {
         setLoading(true);
         const userRef = doc(db, 'users', userId);
         const userData = await getDoc(userRef);

         if (userData.exists()) {
            const user: User = {
               id: userData.id,
               address: {
                  street: null,
                  city: null,
                  country: null,
                  postalCode: null,
                  state: null,
               },
               email: userData.data().email,
               displayName: userData.data().displayName,
               role: userData.data().role,
               paymentMethod: null,
               account: {
                  accountId: userData.data().account.accountId,
                  accountType: userData.data().account.accountType,
                  defaultSupplier: '',
               },
            };
            setLoading(false);

            return user;
         } else {
            setLoading(false);
            return null;
         }
      } catch (err) {
         setError(err as Error);
         setLoading(false);
         throw err;
      }
   };

   return { fetchUser, loading, error };
}
