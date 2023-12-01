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
            const user = userData.data() as User;
            console.log('user UserAPI', user);

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
