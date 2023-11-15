import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { collection, addDoc } from 'firebase/firestore';
import { Account } from '../../../models/model';
import { db } from '../../../config/firebase';

// Define the User interface

// Custom hook for adding a user
const AccountAPI = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const addAccount = async (accountData: Account): Promise<string> => {
      try {
         setLoading(true);
         const accountRef = await addDoc(
            collection(db, 'accounts'),
            accountData
         );
         setLoading(false);
         return accountRef.id;
      } catch (err) {
         setError(err as Error);
         setLoading(false);
         throw err;
      }
   };

   return { addAccount, loading, error };
};

export default AccountAPI;
// Custom hook for fetching a user
