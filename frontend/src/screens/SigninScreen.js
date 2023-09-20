import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export default function SigninScreen() {
   const navigate = useNavigate();

   const { search } = useLocation();
   console.log('use location:' + search);
   const redirectinUrl = new URLSearchParams(search).get('redirect');
   console.log('redirectinUrl :' + redirectinUrl);
   const redirect = redirectinUrl ? redirectinUrl : '/';
   console.log('redirect :' + redirect);
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();

   const { state, dispatch: ctxDispatch } = useContext(Store);
   const { userInfo } = state;
   console.log(auth.currentUser);

   const onSubmitHandler = async (e) => {
      e.preventDefault();

      await signInWithEmailAndPassword(auth, email, password)
         .then(async (userCredential) => {
            console.log(auth.currentUser);

            const userInfo = await getDoc(
               doc(db, 'users', userCredential.user.uid)
            );
            if (userInfo.exists()) {
               let user = {};
               const fetchUserInfo = async () => {
                  const currentUser = userInfo.data();
                  console.log(currentUser);
                  const accountRef = doc(
                     db,
                     'accounts',
                     currentUser.account.accountId
                  );
                  const accountData = await getDoc(accountRef);
                  user = {
                     ...userCredential.user,
                     ...currentUser,
                     account: { ...currentUser.account, ...accountData.data() },
                  };
                  console.log(user);
               };
               await fetchUserInfo();
               let cartItems = [];
               const fetchCartData = async () => {
                  const cartItemRef = collection(
                     db,
                     'accounts',
                     user.account.accountId,
                     'cart'
                  );
                  const querySnapshot = await getDocs(cartItemRef);
                  querySnapshot.forEach((item) => {
                     cartItems.push({ ...item.data() });
                  });

                  user = { ...user, cart: cartItems };
                  console.log('cartItems:', cartItems);
                  console.log('user:', user);
               };

               await fetchCartData();

               ctxDispatch({
                  type: 'USER_SIGNIN',
                  payload: { user: user, cart: cartItems },
               });

               navigate(redirect || '/');
            } else {
               toast.error('Username and/or password do not match');
            }
         })
         .catch((err) => {
            toast.error(getError(err));
            console.log(err);
         });
   };

   //    try {
   //       const { data } = await axios.post('/api/users/signin', {
   //          email,
   //          password,
   //       });
   //       console.log(data);

   //       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
   //       localStorage.setItem('userInfo', JSON.stringify(data));
   //       navigate(redirect || '/');
   //    } catch (err) {
   //       toast.error(getError(err));
   //    }
   // };

   // useEffect(() => {
   //    if (userInfo) {
   //       navigate(redirect);
   //    }
   // }, [navigate, redirect, userInfo]);

   return (
      <Container className="small-container">
         <Helmet>
            <title>Sign In</title>
         </Helmet>
         <h1 className="my-3">Sign In</h1>
         <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="email">
               <Form.Label>Email</Form.Label>
               <Form.Control
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
               ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
               <Form.Label>Password</Form.Label>
               <Form.Control
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
               ></Form.Control>
            </Form.Group>

            <div className="mb-3">
               <Button type="submit"> Sign In</Button>
            </div>
            <div className="mb-3">
               New customer?
               <Link to={`/signup?redirect=${redirect}`}>
                  Create your account
               </Link>
            </div>
         </Form>
      </Container>
   );
}
