import { useState } from 'react';
import { auth, signInWithGoogle } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export const Authen = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const signinHandle = async () => {
      await createUserWithEmailAndPassword(auth, email, password);
      await signInWithPopup(auth, signInWithGoogle);
   };
   return (
      <div>
         <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
         />
         <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
         />
         <button onClick={signinHandle}>Sign In</button>
      </div>
   );
};
