import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
   addDoc,
   collection,
   doc,
   getDoc,
   getDocs,
   setDoc,
} from 'firebase/firestore';
import { Store } from '../../../Store';
import { auth, db } from '../../../config/firebase';
import { Account, Address, User } from '../../../models/model';
import { getError } from '../../../functions/utils';
import useUser from '../hooks/useUser';
import AccountAPI from '../services/AccountAPI';
import UserAPI from '../services/UserAPI';

export default function SignUpScreen() {
   const navigate = useNavigate();

   const { search } = useLocation();
   const redirectinUrl = new URLSearchParams(search).get('redirect');
   const redirect = redirectinUrl ? redirectinUrl : '/';

   type NewGoogleAuthenUser = {
      displayName: string;
      email: string;
      password: string;
      accountType: string;
   };

   const [newUser, setNewUser] = useState<NewGoogleAuthenUser>({
      displayName: '',
      email: '',
      password: '',
      accountType: '',
   });
   console.log(newUser);
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewUser((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const { addAccount, loading, error } = AccountAPI();
   const { fetchUser } = UserAPI();

   const initAddress: Address = {
      street: null,
      city: null,
      country: null,
      postalCode: null,
      state: null,
   };

   const { REDUCER_ACTIONS, dispatch, user } = useUser();

   // const { state, dispatch: ctxDispatch } = useContext(Store);
   // const { userInfo } = state;

   const submitHandler = async (e) => {
      e.preventDefault();

      await createUserWithEmailAndPassword(
         auth,
         newUser.email,
         newUser.password
      )
         .then(async (userCredential) => {
            console.log(userCredential.user.uid);
            const account: Account = {
               id: null,
               businessAddress: initAddress,
               accountType: newUser.accountType,
               businessName: '',
            };
            await addAccount(account).then(async (accountId: string) => {
               console.log(accountId);
               const userRef = doc(db, 'users', userCredential.user.uid);

               const userDetail: User = {
                  id: null,
                  address: {
                     street: null,
                     city: null,
                     country: null,
                     postalCode: null,
                     state: null,
                  },
                  email: userCredential.user.email,
                  displayName: newUser.displayName,
                  role: 'admin',
                  paymentMethod: null,
                  account: {
                     accountId: accountId,
                     accountType: newUser.accountType,
                     defaultSupplier: '',
                  },
               };
               await setDoc(userRef, userDetail).then(async () => {
                  const user = await fetchUser(userCredential.user.uid);

                  console.log(user);
                  dispatch({
                     type: REDUCER_ACTIONS.SIGN_IN,
                     payload: user,
                  });
                  localStorage.setItem('userInfo', JSON.stringify(user));
                  console.log(userCredential);
                  navigate('/');
               });
            });
         })
         .catch((err) => {
            toast.error(getError(err));
         });
   };

   // useEffect(() => {
   //    console.log('checking user first user');
   //    const userExisted = async () => {
   //       const querySnap = await getDocs(collection(db, 'users'));
   //       if (querySnap.empty) {
   //          // setRole('admin');

   //          const element = document.getElementById('accountType');
   //          if (element) {
   //             console.log(element);
   //             const newOption = document.createElement('option');
   //             newOption.value = 'admin';
   //             newOption.textContent = 'Admin';
   //             element.appendChild(newOption);
   //          }
   //       } else {
   //          console.log('exist user');
   //       }
   //    };
   //    userExisted();
   //    if (userInfo) {
   //       navigate(redirect);
   //    }
   // }, [navigate, redirect, userInfo]);

   return (
      <Container className="small-container">
         <Helmet>
            <title>Sign Up</title>
         </Helmet>
         <h1 className="my-3">Sign Up</h1>

         <div className="form-floating mb-3">
            <input
               className="form-control"
               type="text"
               id="floatingDisplayName"
               name="displayName"
               value={newUser.displayName}
               onChange={handleInputChange}
               placeholder="x"
               required
            />
            <label htmlFor="floatingDisplayName">Display Name</label>
         </div>
         <div className="form-floating">
            {' '}
            <input
               className="form-control mb-3"
               type="email"
               id="floatingEmail"
               name="email"
               value={newUser.email}
               onChange={handleInputChange}
               placeholder="x"
               required
            />
            <label htmlFor="floatingEmail">Email</label>
         </div>
         <div className="form-floating mb-3">
            {' '}
            <input
               className="form-control"
               type="password"
               id="floatingPassword"
               name="password"
               value={newUser.password}
               onChange={handleInputChange}
               placeholder="x"
               required
            />
            <label htmlFor="floatingPassword">Password</label>
         </div>

         <select
            className="form-select mb-3"
            onChange={handleInputChange}
            aria-label="Default select example"
            id="accountType"
            name="accountType"
         >
            <option selected>Select Account Type</option>
            <option value="supplier">Supplier</option>
            <option value="comsumer">Consumer</option>
         </select>

         <div className="mb-3">
            Log In to account isntead!
            <Link to={'/signin'}>Log-In</Link>
         </div>

         <button
            className="btn btn-primary"
            onClick={submitHandler}
            type="submit"
         >
            Sign Up
         </button>
      </Container>
   );
}
